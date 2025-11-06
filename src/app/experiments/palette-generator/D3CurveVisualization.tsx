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

interface HueSet {
  id: string;
  name: string; // Display name
  muiName: string; // MUI palette key (primary, secondary, etc.)
  shades: ShadeDefinition[];
  extrapolationMode: "functional" | "functional-saturated" | "expressive";
}

interface CurveSettings {
  showH: boolean;
  showS: boolean;
  showV: boolean;
  smoothMode: boolean;
}

interface CurveVisualizationProps {
  hue: HueSet;
  onUpdate: (updates: Partial<HueSet>) => void;
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

function D3CurveVisualization({ hue, onUpdate }: CurveVisualizationProps) {
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

  // Curve visibility settings
  const [curveSettings, setCurveSettings] = useState<CurveSettings>({
    showH: true,
    showS: true,
    showV: true,
    smoothMode: false,
  });

  // Chart dimensions - make responsive
  const margin = useMemo(
    () => ({ top: 20, right: 30, bottom: 20, left: 50 }),
    []
  );
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 });
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

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

  // Scales
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([50, 900]) // Use actual shade values instead of indices
      .range([0, width]);
  }, [width]);

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain([0, 100]).range([height, 0]);
  }, [height]);

  const yScaleHue = useMemo(() => {
    return d3.scaleLinear().domain([0, 360]).range([height, 0]);
  }, [height]);

  // Performance optimization: Memoize shade data to prevent unnecessary re-renders
  const shadeKeys = useMemo(
    () =>
      hue.shades
        .map(
          (s) =>
            `${s.value}-${s.hsv.h}-${s.hsv.s}-${s.hsv.v}-${s.selectedForH}-${s.selectedForS}-${s.selectedForV}-${s.locked}`
        )
        .join("|"),
    [hue.shades]
  );

  // Line generators - using smooth curves by default for better visual appeal
  const lineH = useMemo(() => {
    return d3
      .line<ShadeDefinition>()
      .x((d) => xScale(d.value)) // Use shade.value instead of index
      .y((d) => yScaleHue(d.hsv.h))
      .curve(d3.curveCardinal.tension(0.1)); // More exaggerated curves (lower tension)
  }, [xScale, yScaleHue]);

  const lineS = useMemo(() => {
    return d3
      .line<ShadeDefinition>()
      .x((d) => xScale(d.value)) // Use shade.value instead of index
      .y((d) => yScale(d.hsv.s))
      .curve(d3.curveCardinal.tension(0.1)); // More exaggerated curves (lower tension)
  }, [xScale, yScale]);

  const lineV = useMemo(() => {
    return d3
      .line<ShadeDefinition>()
      .x((d) => xScale(d.value)) // Use shade.value instead of index
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

      const newShades = [...hue.shades];
      const sigma = 0.8;
      const maxDistance = 2;

      for (let i = 0; i < newShades.length; i++) {
        const distance = Math.abs(i - targetIndex);
        if (distance <= maxDistance && i !== targetIndex) {
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
    [curveSettings.smoothMode, hue.shades]
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

        const newShades = [...hue.shades];
        const shade = newShades[dragStateRef.current.pointIndex];

        if (shade.locked) return;

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

        if (smoothShades) {
          smoothShades[dragStateRef.current.pointIndex] = {
            ...smoothShades[dragStateRef.current.pointIndex],
            hsv: newHsv,
            color,
            extrapolationMethod: undefined,
          };
          onUpdate({ shades: smoothShades });
        } else {
          onUpdate({ shades: newShades });
        }
      }); // End of requestAnimationFrame callback
    },
    [yScale, yScaleHue, hue.shades, applyGaussianFalloff, onUpdate]
  );

  const handleDragEnd = useCallback(() => {
    // Cancel any pending frame requests
    if (frameRequestRef.current !== null) {
      cancelAnimationFrame(frameRequestRef.current);
      frameRequestRef.current = null;
    }

    dragStateRef.current = null;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

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

  // Render D3 chart
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Add full SVG background
    svg
      .append("rect")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("fill", (theme.vars || theme).palette.background.paper)
      .attr("x", 0)
      .attr("y", 0);

    // Create main group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add chart area background (for the plotting area)
    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", (theme.vars || theme).palette.background.paper)
      .attr("x", 0)
      .attr("y", 0);

    // Add grid
    const xGrid = g
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) // Align grid with shade values
          .tickSize(-height)
          .tickFormat(() => "")
      );

    // Style x-grid
    xGrid
      .selectAll("line")
      .style("stroke", (theme.vars || theme).palette.divider)
      .style("stroke-dasharray", "3,3")
      .style("stroke-width", 0.5);
    xGrid.selectAll("path").style("stroke", "none");

    const yGrid = g
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(() => "")
      );

    // Style y-grid
    yGrid
      .selectAll("line")
      .style("stroke", (theme.vars || theme).palette.divider)
      .style("stroke-dasharray", "3,3")
      .style("stroke-width", 0.5);
    yGrid.selectAll("path").style("stroke", "none");

    // Add axes
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) // Show actual shade values
          .tickFormat((d) => d.toString())
      );

    // Style x-axis
    xAxis
      .selectAll("text")
      .style("fill", (theme.vars || theme).palette.text.secondary);
    xAxis
      .selectAll("path, line")
      .style("stroke", (theme.vars || theme).palette.text.secondary);

    const yAxis = g.append("g").call(d3.axisLeft(yScale));

    // Style y-axis
    yAxis
      .selectAll("text")
      .style("fill", (theme.vars || theme).palette.text.secondary);
    yAxis
      .selectAll("path, line")
      .style("stroke", (theme.vars || theme).palette.text.secondary);

    // Add lines
    if (curveSettings.showH && lineH) {
      g.append("path")
        .datum(hue.shades)
        .attr("fill", "none")
        .attr("stroke", (theme.vars || theme).palette.error.main)
        .attr("stroke-width", 2)
        .attr("d", lineH);
    }

    if (curveSettings.showS && lineS) {
      g.append("path")
        .datum(hue.shades)
        .attr("fill", "none")
        .attr("stroke", (theme.vars || theme).palette.success.main)
        .attr("stroke-width", 2)
        .attr("d", lineS);
    }

    if (curveSettings.showV && lineV) {
      g.append("path")
        .datum(hue.shades)
        .attr("fill", "none")
        .attr("stroke", (theme.vars || theme).palette.primary.main)
        .attr("stroke-width", 2)
        .attr("d", lineV);
    }

    // Add points
    const addPoints = (
      channel: "h" | "s" | "v",
      color: string,
      scale: d3.ScaleLinear<number, number>
    ) => {
      if (!curveSettings[`show${channel.toUpperCase() as "H" | "S" | "V"}`])
        return;

      // Get the reusable drag behavior for this channel
      const dragBehavior = dragBehaviorsRef.current[channel];
      if (!dragBehavior) return;

      // Update the handlers on the existing drag behavior (lightweight operation)
      dragBehavior
        .on("start", function (event, d) {
          const index = hue.shades.indexOf(d);
          const selectedKey =
            `selectedFor${channel.toUpperCase()}` as keyof ShadeDefinition;
          const isSelected = d[selectedKey] as boolean;

          if (!isSelected || d.locked) return;

          document.body.style.cursor = "ns-resize";
          document.body.style.userSelect = "none";
          document.body.style.touchAction = "none"; // Disable touch scrolling during drag

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
          // Re-enable touch scrolling
          document.body.style.touchAction = "";
          handleDragEnd();
        });

      g.selectAll(`.point-${channel}`)
        .data(hue.shades)
        .enter()
        .append("circle")
        .attr("class", `point-${channel}`)
        .attr("cx", (d) => xScale(d.value)) // Use shade.value instead of index
        .attr("cy", (d) => scale(d.hsv[channel]))
        .attr("r", (d) => {
          const selectedKey =
            `selectedFor${channel.toUpperCase()}` as keyof ShadeDefinition;
          return d[selectedKey] ? 8 : 5;
        })
        .attr("fill", (d) => {
          const selectedKey =
            `selectedFor${channel.toUpperCase()}` as keyof ShadeDefinition;
          return d[selectedKey]
            ? color
            : (theme.vars || theme).palette.background.default;
        })
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("click", function (event, d) {
          const index = hue.shades.indexOf(d);
          const selectedKey = `selectedFor${channel.toUpperCase()}`;
          const newShades = [...hue.shades];
          newShades[index] = {
            ...newShades[index],
            [selectedKey]: !d[selectedKey as keyof ShadeDefinition],
          };
          onUpdate({ shades: newShades });
        })
        .call(dragBehavior); // Reuse the same behavior object
    };

    addPoints("h", (theme.vars || theme).palette.error.main, yScaleHue);
    addPoints("s", (theme.vars || theme).palette.success.main, yScale);
    addPoints("v", (theme.vars || theme).palette.primary.main, yScale);
  }, [
    shadeKeys, // Use memoized keys for efficient re-render detection
    hue.shades, // Still needed for the actual data in the effect body
    curveSettings,
    xScale,
    yScale,
    yScaleHue,
    lineH,
    lineS,
    lineV,
    margin,
    width,
    height,
    dimensions.width,
    dimensions.height,
    onUpdate,
    handleDrag,
    handleDragEnd,
    theme,
  ]);

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
          color="primary"
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
        Click points to select/deselect them for dragging. Drag selected points
        vertically to adjust values.
        {curveSettings.smoothMode &&
          " Gaussian falloff applies smooth changes to adjacent points during dragging."}
      </Typography>

      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: 320,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
          overflow: "hidden",
          boxShadow: 1,
          mb: 0, // Remove any bottom margin
          touchAction: "manipulation", // Allow basic touch interactions
        }}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{
            background: theme.palette.background.paper,
          }}
        />
      </Box>
    </Box>
  );
}

export default D3CurveVisualization;
