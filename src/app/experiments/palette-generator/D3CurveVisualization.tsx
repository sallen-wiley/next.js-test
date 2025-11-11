import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import * as d3 from "d3";

// Types
interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

interface ShadeDefinition {
  id: string;
  value: number; // MUI shade value: 50, 100, 200, ..., 900
  color: string; // hex format: #RRGGBB
  locked: boolean;
  hsv: HSV;
  selectedForH: boolean;
  selectedForS: boolean;
  selectedForV: boolean;
  extrapolationMethod?: "interpolated" | "linear" | "adjusted";
  generationMode?: "functional" | "functional-saturated" | "expressive"; // Mode used when generating this shade
}

interface CurveSettings {
  showH: boolean;
  showS: boolean;
  showV: boolean;
  smoothMode: boolean;
}

interface CurveVisualizationProps {
  shades: ShadeDefinition[];
  onUpdate: (updates: { shades: ShadeDefinition[] }) => void;
}

// Utility functions
const hsvToRgb = (
  h: number,
  s: number,
  v: number
): { r: number; g: number; b: number } => {
  s = s / 100;
  v = v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

function D3CurveVisualization({ shades, onUpdate }: CurveVisualizationProps) {
  const theme = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    isDragging: boolean;
    pointIndex: number;
    channel: "h" | "s" | "v";
    originalValue: number;
  } | null>(null);

  // Performance optimization: Reuse drag behaviors instead of creating new ones every render
  const dragBehaviorsRef = useRef<{
    h: d3.DragBehavior<
      SVGCircleElement,
      ShadeDefinition,
      ShadeDefinition | d3.SubjectPosition
    > | null;
    s: d3.DragBehavior<
      SVGCircleElement,
      ShadeDefinition,
      ShadeDefinition | d3.SubjectPosition
    > | null;
    v: d3.DragBehavior<
      SVGCircleElement,
      ShadeDefinition,
      ShadeDefinition | d3.SubjectPosition
    > | null;
  }>({ h: null, s: null, v: null });

  // Performance optimization: Debounce requestAnimationFrame calls
  const frameRequestRef = useRef<number | null>(null);

  // Performance optimization: Throttle parent updates (color recalculation) to 15fps
  const throttledUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const pendingShadesRef = useRef<ShadeDefinition[] | null>(null);

  // Throttled color update function (15fps for parent re-renders)
  const throttledColorUpdate = useCallback(
    (shades: ShadeDefinition[]) => {
      pendingShadesRef.current = shades;

      if (!throttledUpdateRef.current) {
        throttledUpdateRef.current = setTimeout(() => {
          if (pendingShadesRef.current) {
            onUpdate({ shades: pendingShadesRef.current });
            pendingShadesRef.current = null;
          }
          throttledUpdateRef.current = null;
        }, 66); // 15fps (~66ms)
      }
    },
    [onUpdate]
  );

  // Curve visibility settings
  const [curveSettings, setCurveSettings] = useState<CurveSettings>({
    showH: true,
    showS: true,
    showV: true,
    smoothMode: false,
  });

  // Chart dimensions - make responsive
  const margin = useMemo(
    () => ({ top: 20, right: 0, bottom: 20, left: 20 }),
    []
  );
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 });
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  // Add ResizeObserver to make chart responsive
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions((prev) => ({
          ...prev,
          width: Math.max(250, width), // Minimum width of 250px
        }));
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Memoize length separately to prevent unnecessary recalculations
  const shadesLength = useMemo(() => shades.length, [shades.length]);

  // Create a stable key based on actual shade data (not the parent hue object)
  // Only recalculate when the stringified data actually changes
  const shadesDataString = shades
    .map(
      (s: ShadeDefinition) =>
        `${s.id}-${s.color}-${s.locked}-${s.hsv.h.toFixed(2)}-${s.hsv.s.toFixed(
          2
        )}-${s.hsv.v.toFixed(2)}`
    )
    .join("|");
  const shadesKey = useMemo(() => shadesDataString, [shadesDataString]);

  // Performance optimization: Create drag behaviors once on mount, reuse across renders
  useEffect(() => {
    // Only create if they don't exist
    if (!dragBehaviorsRef.current.h) {
      dragBehaviorsRef.current.h = d3
        .drag<SVGCircleElement, ShadeDefinition>()
        .filter(function (event) {
          // Only handle primary button (left click) or touch events
          return !event.ctrlKey && !event.button;
        });
    }
    if (!dragBehaviorsRef.current.s) {
      dragBehaviorsRef.current.s = d3
        .drag<SVGCircleElement, ShadeDefinition>()
        .filter(function (event) {
          return !event.ctrlKey && !event.button;
        });
    }
    if (!dragBehaviorsRef.current.v) {
      dragBehaviorsRef.current.v = d3
        .drag<SVGCircleElement, ShadeDefinition>()
        .filter(function (event) {
          return !event.ctrlKey && !event.button;
        });
    }
  }, []); // Empty dependency array - only run once

  // Scales - INDEX-BASED for even spacing regardless of shade values
  const xScale = useMemo(() => {
    const padding = 0.5; // Half a bar width of padding on each side
    return d3
      .scaleLinear()
      .domain([-padding, Math.max(0, shadesLength - 1) + padding]) // Add padding to prevent bar overflow
      .range([0, width]);
  }, [width, shadesLength]);

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain([0, 100]).range([height, 0]);
  }, [height]);

  const yScaleHue = useMemo(() => {
    return d3.scaleLinear().domain([0, 360]).range([height, 0]);
  }, [height]);

  // Line generators - using smooth curves by default for better visual appeal
  const lineH = useMemo(() => {
    return d3
      .line<ShadeDefinition>()
      .x((d, i) => xScale(i)) // Use index for even spacing
      .y((d) => yScaleHue(d.hsv.h))
      .curve(d3.curveCardinal.tension(0.1)); // More exaggerated curves (lower tension)
  }, [xScale, yScaleHue]);

  const lineS = useMemo(() => {
    return d3
      .line<ShadeDefinition>()
      .x((d, i) => xScale(i)) // Use index for even spacing
      .y((d) => yScale(d.hsv.s))
      .curve(d3.curveCardinal.tension(0.1)); // More exaggerated curves (lower tension)
  }, [xScale, yScale]);

  const lineV = useMemo(() => {
    return d3
      .line<ShadeDefinition>()
      .x((d, i) => xScale(i)) // Use index for even spacing
      .y((d) => yScale(d.hsv.v))
      .curve(d3.curveCardinal.tension(0.1)); // More exaggerated curves (lower tension)
  }, [xScale, yScale]);

  // Apply Gaussian falloff for smooth mode
  const applyGaussianFalloff = useCallback(
    (
      targetIndex: number,
      newValue: number,
      originalValue: number,
      channel: "h" | "s" | "v"
    ) => {
      if (!curveSettings.smoothMode) return null;

      const newShades = [...shades];
      const sigma = 0.8;
      const maxDistance = 2;

      // Helper function to check if there's a locked node between target and i
      const hasLockedNodeBetween = (start: number, end: number): boolean => {
        const [min, max] = start < end ? [start, end] : [end, start];
        for (let j = min + 1; j < max; j++) {
          if (j >= 0 && j < newShades.length && newShades[j]?.locked) {
            return true;
          }
        }
        return false;
      };

      for (let i = 0; i < newShades.length; i++) {
        const distance = Math.abs(i - targetIndex);
        // Skip if: it's the target itself, it's locked, too far away, or there's a locked node in between
        if (
          distance <= maxDistance &&
          i !== targetIndex &&
          !newShades[i].locked &&
          !hasLockedNodeBetween(targetIndex, i)
        ) {
          const weight = Math.exp(-(distance * distance) / (2 * sigma * sigma));
          const currentValue =
            channel === "h"
              ? newShades[i].hsv.h
              : channel === "s"
              ? newShades[i].hsv.s
              : newShades[i].hsv.v;
          const change = newValue - originalValue;
          const adjustedChange = change * weight;

          let adjustedValue: number;
          if (channel === "h") {
            adjustedValue = Math.max(
              0,
              Math.min(360, currentValue + adjustedChange)
            );
            const rgb = hsvToRgb(
              adjustedValue,
              newShades[i].hsv.s,
              newShades[i].hsv.v
            );
            newShades[i] = {
              ...newShades[i],
              hsv: { ...newShades[i].hsv, h: adjustedValue },
              color: rgbToHex(rgb.r, rgb.g, rgb.b),
            };
          } else {
            adjustedValue = Math.max(
              0,
              Math.min(100, currentValue + adjustedChange)
            );
            if (channel === "s") {
              const rgb = hsvToRgb(
                newShades[i].hsv.h,
                adjustedValue,
                newShades[i].hsv.v
              );
              newShades[i] = {
                ...newShades[i],
                hsv: { ...newShades[i].hsv, s: adjustedValue },
                color: rgbToHex(rgb.r, rgb.g, rgb.b),
              };
            } else {
              const rgb = hsvToRgb(
                newShades[i].hsv.h,
                newShades[i].hsv.s,
                adjustedValue
              );
              newShades[i] = {
                ...newShades[i],
                hsv: { ...newShades[i].hsv, v: adjustedValue },
                color: rgbToHex(rgb.r, rgb.g, rgb.b),
              };
            }
          }
        }
      }

      return newShades;
    },
    [curveSettings.smoothMode, shades]
  );

  // Handle drag events with requestAnimationFrame for smooth performance
  const handleDrag = useCallback(
    (
      event: d3.D3DragEvent<SVGCircleElement, ShadeDefinition, ShadeDefinition>
    ) => {
      if (!svgRef.current || !dragStateRef.current) return;

      // Performance optimization: Skip this drag event if we already have one queued
      if (frameRequestRef.current !== null) {
        return; // Skip redundant drag events within the same frame
      }

      frameRequestRef.current = requestAnimationFrame(() => {
        frameRequestRef.current = null; // Reset for next frame

        if (!dragStateRef.current || !svgRef.current) return;

        let y: number | null = null;

        // Strategy 1: Manual calculation from source event (most reliable)
        if (event.sourceEvent && svgRef.current) {
          const rect = svgRef.current.getBoundingClientRect();
          let clientY: number | undefined;

          // Handle both mouse and touch events
          if (
            "touches" in event.sourceEvent &&
            event.sourceEvent.touches.length > 0
          ) {
            clientY = event.sourceEvent.touches[0].clientY;
          } else if ("clientY" in event.sourceEvent) {
            clientY = event.sourceEvent.clientY;
          }

          if (
            clientY !== undefined &&
            Number.isFinite(clientY) &&
            Number.isFinite(rect.top)
          ) {
            y = clientY - rect.top - 20; // margin.top = 20
          }
        }

        // Strategy 2: Use d3.pointer (reliable for SVG coordinates)
        if (y === null) {
          try {
            const chartGroup = svgRef.current.querySelector("g");
            if (chartGroup) {
              const [, pointerY] = d3.pointer(event.sourceEvent, chartGroup);
              if (Number.isFinite(pointerY)) {
                y = pointerY;
              }
            }
          } catch (error) {
            console.warn("d3.pointer failed:", error);
          }
        }

        // Strategy 3: Use event.y as last resort
        if (y === null && Number.isFinite(event.y)) {
          y = event.y - 20; // margin.top = 20
        }

        // If all strategies failed, abort this frame
        if (y === null || !Number.isFinite(y)) {
          console.warn(
            "Could not determine valid y coordinate, skipping frame"
          );
          return;
        }

        let newValue: number;
        if (dragStateRef.current.channel === "h") {
          newValue = Math.max(0, Math.min(360, yScaleHue.invert(y)));
        } else {
          newValue = Math.max(0, Math.min(100, yScale.invert(y)));
        }

        const newShades = [...shades];
        const shade = newShades[dragStateRef.current.pointIndex];

        // Safety check: ensure shade exists and is not locked
        if (!shade || shade.locked) return;

        const newHsv = { ...shade.hsv };
        newHsv[dragStateRef.current.channel] = newValue;

        const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
        const color = rgbToHex(rgb.r, rgb.g, rgb.b);

        newShades[dragStateRef.current.pointIndex] = {
          ...shade,
          hsv: newHsv,
          color,
          extrapolationMethod: undefined,
        };

        const smoothShades = applyGaussianFalloff(
          dragStateRef.current.pointIndex,
          newValue,
          dragStateRef.current.originalValue,
          dragStateRef.current.channel
        );

        const finalShades = smoothShades
          ? (() => {
              smoothShades[dragStateRef.current!.pointIndex] = {
                ...smoothShades[dragStateRef.current!.pointIndex],
                hsv: newHsv,
                color,
                extrapolationMethod: undefined,
              };
              return smoothShades;
            })()
          : newShades;

        // OPTIMIZATION: Immediate visual update (60fps) without triggering parent re-render
        // Update the visual representation directly in the DOM
        const svg = d3.select(svgRef.current);
        const channel = dragStateRef.current.channel;
        const scale = channel === "h" ? yScaleHue : yScale;

        // Update circles immediately for this channel
        svg
          .selectAll(`.point-${channel}`)
          .data(finalShades)
          .attr("cy", (d) => scale(d.hsv[channel]));

        // Update path immediately for this channel
        if (channel === "h" && lineH) {
          svg.select(".line-h").datum(finalShades).attr("d", lineH);
        } else if (channel === "s" && lineS) {
          svg.select(".line-s").datum(finalShades).attr("d", lineS);
        } else if (channel === "v" && lineV) {
          svg.select(".line-v").datum(finalShades).attr("d", lineV);
        }

        // OPTIMIZATION: Throttled parent update (15fps) for color recalculation
        throttledColorUpdate(finalShades);
      }); // End of requestAnimationFrame callback
    },
    [
      yScale,
      yScaleHue,
      shades,
      applyGaussianFalloff,
      throttledColorUpdate,
      lineH,
      lineS,
      lineV,
    ]
  );

  const handleDragEnd = useCallback(() => {
    // Cancel any pending frame requests
    if (frameRequestRef.current !== null) {
      cancelAnimationFrame(frameRequestRef.current);
      frameRequestRef.current = null;
    }

    // Flush any pending throttled updates immediately on drag end
    if (throttledUpdateRef.current !== null) {
      clearTimeout(throttledUpdateRef.current);
      throttledUpdateRef.current = null;
      if (pendingShadesRef.current) {
        onUpdate({ shades: pendingShadesRef.current });
        pendingShadesRef.current = null;
      }
    }

    dragStateRef.current = null;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [onUpdate]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(400, rect.width),
          height: 300,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Global cleanup: ensure drag state is cleared on any mouseup/touchend
  useEffect(() => {
    const handleGlobalEnd = () => {
      if (dragStateRef.current) {
        handleDragEnd();
      }
    };

    window.addEventListener("mouseup", handleGlobalEnd);
    window.addEventListener("touchend", handleGlobalEnd);

    return () => {
      window.removeEventListener("mouseup", handleGlobalEnd);
      window.removeEventListener("touchend", handleGlobalEnd);
    };
  }, [handleDragEnd]);

  // CREATION PHASE: Initialize chart structure once (runs when dimensions/visibility/theme changes)
  const initializeChart = useCallback(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // ONLY clear on initialization

    // Add full SVG background (transparent)
    svg
      .append("rect")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("fill", "rgba(255,255,255,0)") // transparent
      .attr("x", 0)
      .attr("y", 0);

    // Create main group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add chart area background (transparent)
    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "rgba(255,255,255,0)") // transparent
      .attr("x", 0)
      .attr("y", 0);

    // Add colored background bars for each shade (BEFORE grid/curves/points)
    const barWidth = Math.ceil(width / Math.max(1, shades.length)) + 1; // Round up and add 1px overlap
    g.selectAll(".shade-bar")
      .data(shades)
      .enter()
      .append("rect")
      .attr("class", "shade-bar")
      .attr("x", (d, i) => xScale(i) - barWidth / 2)
      .attr("y", 0)
      .attr("width", barWidth)
      .attr("height", height)
      .attr("fill", (d) => d.color)
      .attr("opacity", 1); // Fully opaque

    // Add grid
    const xGrid = g
      .append("g")
      .attr("class", "grid x-grid")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues(shades.map((_, i) => i)) // Use indices for tick positions
          .tickSize(-height)
          .tickFormat(() => "")
      );

    xGrid
      .selectAll("line")
      .style("stroke", (theme.vars || theme).palette.divider)
      .style("stroke-dasharray", "3,3")
      .style("stroke-width", 0.5);
    xGrid.selectAll("path").style("stroke", "none");

    const yGrid = g
      .append("g")
      .attr("class", "grid y-grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(() => "")
      );

    yGrid
      .selectAll("line")
      .style("stroke", (theme.vars || theme).palette.divider)
      .style("stroke-dasharray", "3,3")
      .style("stroke-width", 0.5);
    yGrid.selectAll("path").style("stroke", "none");

    // Add axes with custom formatting for shade values
    const xAxis = g
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues(shades.map((_, i) => i)) // Use indices for tick positions
          .tickFormat((d) => {
            const index = d as number;
            return shades[index]?.value.toString() || "";
          })
      );

    xAxis
      .selectAll("text")
      .style("fill", (theme.vars || theme).palette.text.secondary);
    xAxis
      .selectAll("path, line")
      .style("stroke", (theme.vars || theme).palette.text.secondary);

    const yAxis = g
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));

    yAxis
      .selectAll("text")
      .style("fill", (theme.vars || theme).palette.text.secondary);
    yAxis
      .selectAll("path, line")
      .style("stroke", (theme.vars || theme).palette.text.secondary);

    // Create path elements with class names (no data yet)
    if (curveSettings.showH) {
      g.append("path")
        .attr("class", "line-h")
        .attr("fill", "none")
        .attr("stroke", (theme.vars || theme).palette.error.main)
        .attr("stroke-width", 2);
    }

    if (curveSettings.showS) {
      g.append("path")
        .attr("class", "line-s")
        .attr("fill", "none")
        .attr("stroke", (theme.vars || theme).palette.success.main)
        .attr("stroke-width", 2);
    }

    if (curveSettings.showV) {
      g.append("path")
        .attr("class", "line-v")
        .attr("fill", "none")
        .attr("stroke", (theme.vars || theme).palette.warning.main)
        .attr("stroke-width", 2);
    }

    // Create point groups and attach drag behaviors ONCE
    const createPoints = (channel: "h" | "s" | "v", color: string) => {
      if (!curveSettings[`show${channel.toUpperCase() as "H" | "S" | "V"}`])
        return;

      const dragBehavior = dragBehaviorsRef.current[channel];
      if (!dragBehavior) return;

      // Update drag behavior handlers (attached once to circles)
      dragBehavior
        .on("start", function (event, d) {
          // Find the correct index using id
          const index = shades.findIndex((point) => point.id === d.id);
          if (index === -1) return; // Safety: shade not found in array

          const selectedKey =
            `selectedFor${channel.toUpperCase()}` as keyof ShadeDefinition;
          const isSelected = d[selectedKey] as boolean;

          // Only allow dragging if NOT locked and channel is selected
          if (d.locked || !isSelected) return;

          document.body.style.cursor = "ns-resize";
          document.body.style.userSelect = "none";
          document.body.style.touchAction = "none";

          dragStateRef.current = {
            isDragging: true,
            pointIndex: index,
            channel,
            originalValue: d.hsv[channel],
          };
        })
        .on("drag", function (event) {
          if (!dragStateRef.current || !svgRef.current) return;
          handleDrag(event);
        })
        .on("end", function () {
          document.body.style.touchAction = "";
          handleDragEnd();
        });

      // Create circles with class names and attach drag
      g.selectAll(`.point-${channel}`)
        .data(shades)
        .enter()
        .append("circle")
        .attr("class", `point-${channel}`)
        .attr("r", 5)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("click", function (event, d) {
          const index = shades.indexOf(d);
          if (index === -1) return; // Safety: shade not found in array

          const newShades = [...shades];
          if (!newShades[index]) return; // Safety: index out of bounds

          // Toggle the locked state
          const newLockedState = !newShades[index].locked;

          newShades[index] = {
            ...newShades[index],
            locked: newLockedState,
            // When we lock/unlock, also set all channels to be selected (visible/active)
            // This just controls whether the point appears on this channel's curve
            selectedForH: true,
            selectedForS: true,
            selectedForV: true,
          };

          onUpdate({ shades: newShades });
        })
        .call(dragBehavior); // Attach drag behavior ONCE
    };

    createPoints("h", (theme.vars || theme).palette.error.main);
    createPoints("s", (theme.vars || theme).palette.success.main);
    createPoints("v", (theme.vars || theme).palette.warning.main);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dimensions.width,
    dimensions.height,
    curveSettings,
    theme,
    margin,
    width,
    height,
    xScale,
    yScale,
    handleDrag,
    handleDragEnd,
    onUpdate,
    shadesLength, // Only reinitialize if number of shades changes, not on data updates
  ]);

  // UPDATE PHASE: Only update attributes of existing elements (runs at 60fps during drag)
  const updateChart = useCallback(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Update colored background bars
    const barWidth = Math.ceil(width / Math.max(1, shades.length)) + 1; // Round up and add 1px overlap
    svg
      .selectAll(".shade-bar")
      .data(shades)
      .attr("x", (d, i) => xScale(i) - barWidth / 2)
      .attr("width", barWidth)
      .attr("fill", (d) => d.color);

    // Update path data for each visible channel
    if (curveSettings.showH && lineH) {
      svg.select(".line-h").datum(shades).attr("d", lineH);
    }

    if (curveSettings.showS && lineS) {
      svg.select(".line-s").datum(shades).attr("d", lineS);
    }

    if (curveSettings.showV && lineV) {
      svg.select(".line-v").datum(shades).attr("d", lineV);
    }

    // Update circle positions and styles for each channel
    const updatePoints = (
      channel: "h" | "s" | "v",
      scale: d3.ScaleLinear<number, number>,
      color: string
    ) => {
      if (!curveSettings[`show${channel.toUpperCase() as "H" | "S" | "V"}`])
        return;

      svg
        .selectAll(`.point-${channel}`)
        .data(shades)
        .attr("cx", (d, i) => xScale(i)) // Use index for position
        .attr("cy", (d) => scale(d.hsv[channel]))
        .attr("r", 7) // Same size for both states
        .attr("fill", (d) => {
          // Locked = filled with color, Unlocked = white fill
          return d.locked ? color : "#ffffff";
        })
        .attr("stroke", (d) => {
          // Locked = white outline, Unlocked = colored outline
          return d.locked ? "#ffffff" : color;
        })
        .attr("stroke-width", 2);
    };

    updatePoints("h", yScaleHue, (theme.vars || theme).palette.error.main);
    updatePoints("s", yScale, (theme.vars || theme).palette.success.main);
    updatePoints("v", yScale, (theme.vars || theme).palette.warning.main);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shadesKey, // Only update when actual shade data changes, not when mode changes
    xScale,
    yScale,
    yScaleHue,
    lineH,
    lineS,
    lineV,
    curveSettings,
    theme,
    width,
  ]);

  // Initialize chart when structure changes
  useEffect(() => {
    initializeChart();
  }, [initializeChart]);

  // Update chart when data changes
  useEffect(() => {
    updateChart();
  }, [updateChart]);

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant={curveSettings.showH ? "contained" : "outlined"}
          color="error"
          size="small"
          onClick={() =>
            setCurveSettings((prev) => ({ ...prev, showH: !prev.showH }))
          }
        >
          Hue (H)
        </Button>
        <Button
          variant={curveSettings.showS ? "contained" : "outlined"}
          color="success"
          size="small"
          onClick={() =>
            setCurveSettings((prev) => ({ ...prev, showS: !prev.showS }))
          }
        >
          Saturation (S)
        </Button>
        <Button
          variant={curveSettings.showV ? "contained" : "outlined"}
          color="warning"
          size="small"
          onClick={() =>
            setCurveSettings((prev) => ({ ...prev, showV: !prev.showV }))
          }
        >
          Value (V)
        </Button>
        <Button
          variant={curveSettings.smoothMode ? "contained" : "outlined"}
          size="small"
          onClick={() =>
            setCurveSettings((prev) => ({
              ...prev,
              smoothMode: !prev.smoothMode,
            }))
          }
        >
          Gaussian Falloff
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Click points to lock/unlock shades. Locked shades (filled points) are
        protected from dragging and interpolation. Unlocked shades (outline
        points) can be dragged to adjust values and will be overwritten by
        &ldquo;Generate Missing Shades&rdquo;. Gaussian falloff applies smooth
        changes to adjacent points during dragging.
      </Typography>

      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: 320,
          overflow: "hidden",
          touchAction: "manipulation",
        }}
      >
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
      </Box>
    </Box>
  );
}

export default React.memo(D3CurveVisualization, (prevProps, nextProps) => {
  // Only re-render if the shades data actually changed
  const prevKey = prevProps.shades
    .map(
      (s: ShadeDefinition) =>
        `${s.id}-${s.color}-${s.locked}-${s.hsv.h.toFixed(2)}-${s.hsv.s.toFixed(
          2
        )}-${s.hsv.v.toFixed(2)}`
    )
    .join("|");
  const nextKey = nextProps.shades
    .map(
      (s: ShadeDefinition) =>
        `${s.id}-${s.color}-${s.locked}-${s.hsv.h.toFixed(2)}-${s.hsv.s.toFixed(
          2
        )}-${s.hsv.v.toFixed(2)}`
    )
    .join("|");
  return prevKey === nextKey;
});
