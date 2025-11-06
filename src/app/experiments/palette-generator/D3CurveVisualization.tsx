import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import * as d3 from 'd3';

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
const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
  s = s / 100;
  v = v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

function D3CurveVisualization({ hue, onUpdate }: CurveVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    isDragging: boolean;
    pointIndex: number;
    channel: 'h' | 's' | 'v';
    originalValue: number;
  } | null>(null);

  // Curve visibility settings
  const [curveSettings, setCurveSettings] = useState<CurveSettings>({
    showH: true,
    showS: true,
    showV: true,
    smoothMode: false,
  });

  // Chart dimensions - make responsive
  const margin = useMemo(() => ({ top: 20, right: 30, bottom: 40, left: 50 }), []);
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 });
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  // Scales
  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, hue.shades.length - 1])
      .range([0, width]);
  }, [hue.shades.length, width]);

  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);
  }, [height]);

  const yScaleHue = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, 360])
      .range([height, 0]);
  }, [height]);

  // Line generators - using smooth curves by default for better visual appeal
  const lineH = useMemo(() => {
    return d3.line<ShadeDefinition>()
      .x((d, i) => xScale(i))
      .y(d => yScaleHue(d.hsv.h))
      .curve(d3.curveCardinal.tension(0.5)); // Smooth curves like Recharts
  }, [xScale, yScaleHue]);

  const lineS = useMemo(() => {
    return d3.line<ShadeDefinition>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d.hsv.s))
      .curve(d3.curveCardinal.tension(0.5)); // Smooth curves like Recharts
  }, [xScale, yScale]);

  const lineV = useMemo(() => {
    return d3.line<ShadeDefinition>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d.hsv.v))
      .curve(d3.curveCardinal.tension(0.5)); // Smooth curves like Recharts
  }, [xScale, yScale]);

  // Apply Gaussian falloff for smooth mode
  const applyGaussianFalloff = useCallback((targetIndex: number, newValue: number, originalValue: number, channel: 'h' | 's' | 'v') => {
    if (!curveSettings.smoothMode) return null;

    const newShades = [...hue.shades];
    const sigma = 0.8;
    const maxDistance = 2;
    
    for (let i = 0; i < newShades.length; i++) {
      const distance = Math.abs(i - targetIndex);
      if (distance <= maxDistance && i !== targetIndex) {
        const weight = Math.exp(-(distance * distance) / (2 * sigma * sigma));
        const currentValue = channel === 'h' ? newShades[i].hsv.h : 
                            channel === 's' ? newShades[i].hsv.s : 
                            newShades[i].hsv.v;
        const change = newValue - originalValue;
        const adjustedChange = change * weight;
        
        let adjustedValue: number;
        if (channel === 'h') {
          adjustedValue = Math.max(0, Math.min(360, currentValue + adjustedChange));
          const rgb = hsvToRgb(adjustedValue, newShades[i].hsv.s, newShades[i].hsv.v);
          newShades[i] = {
            ...newShades[i],
            hsv: { ...newShades[i].hsv, h: adjustedValue },
            color: rgbToHex(rgb.r, rgb.g, rgb.b)
          };
        } else {
          adjustedValue = Math.max(0, Math.min(100, currentValue + adjustedChange));
          if (channel === 's') {
            const rgb = hsvToRgb(newShades[i].hsv.h, adjustedValue, newShades[i].hsv.v);
            newShades[i] = {
              ...newShades[i],
              hsv: { ...newShades[i].hsv, s: adjustedValue },
              color: rgbToHex(rgb.r, rgb.g, rgb.b)
            };
          } else {
            const rgb = hsvToRgb(newShades[i].hsv.h, newShades[i].hsv.s, adjustedValue);
            newShades[i] = {
              ...newShades[i],
              hsv: { ...newShades[i].hsv, v: adjustedValue },
              color: rgbToHex(rgb.r, rgb.g, rgb.b)
            };
          }
        }
      }
    }
    
    return newShades;
  }, [curveSettings.smoothMode, hue.shades]);

  // Handle drag events with requestAnimationFrame for smooth performance
  const handleDrag = useCallback((event: MouseEvent) => {
    if (!dragStateRef.current || !svgRef.current) return;

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      if (!dragStateRef.current || !svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const y = event.clientY - rect.top - margin.top;
      
      let newValue: number;
      if (dragStateRef.current.channel === 'h') {
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

      // Apply smooth mode falloff if enabled
      const smoothShades = applyGaussianFalloff(dragStateRef.current.pointIndex, newValue, dragStateRef.current.originalValue, dragStateRef.current.channel);
      if (smoothShades) {
        // Update the main dragged point in the smooth result
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
    });
  }, [yScale, yScaleHue, margin.top, hue.shades, applyGaussianFalloff, onUpdate]);

  const handleDragEnd = useCallback(() => {
    dragStateRef.current = null;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleDrag]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ 
          width: Math.max(400, rect.width), 
          height: 300 
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Render D3 chart
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Create main group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add grid
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3")
      .style("stroke", "#333")
      .style("stroke-width", 0.5);

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3")
      .style("stroke", "#333")
      .style("stroke-width", 0.5);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .style("color", "#666");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .style("color", "#666");

    // Add lines
    if (curveSettings.showH && lineH) {
      g.append("path")
        .datum(hue.shades)
        .attr("fill", "none")
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 2)
        .attr("d", lineH);
    }

    if (curveSettings.showS && lineS) {
      g.append("path")
        .datum(hue.shades)
        .attr("fill", "none")
        .attr("stroke", "#22c55e")
        .attr("stroke-width", 2)
        .attr("d", lineS);
    }

    if (curveSettings.showV && lineV) {
      g.append("path")
        .datum(hue.shades)
        .attr("fill", "none")
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 2)
        .attr("d", lineV);
    }

    // Add points
    const addPoints = (channel: 'h' | 's' | 'v', color: string, scale: d3.ScaleLinear<number, number>) => {
      if (!curveSettings[`show${channel.toUpperCase() as 'H' | 'S' | 'V'}`]) return;

      g.selectAll(`.point-${channel}`)
        .data(hue.shades)
        .enter()
        .append("circle")
        .attr("class", `point-${channel}`)
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => scale(d.hsv[channel]))
        .attr("r", (d) => {
          const selectedKey = `selectedFor${channel.toUpperCase()}` as keyof ShadeDefinition;
          return d[selectedKey] ? 8 : 5;
        })
        .attr("fill", (d) => {
          const selectedKey = `selectedFor${channel.toUpperCase()}` as keyof ShadeDefinition;
          return d[selectedKey] ? color : "rgba(255,255,255,0.8)";
        })
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("click", function(event, d) {
          const index = hue.shades.indexOf(d);
          const selectedKey = `selectedFor${channel.toUpperCase()}`;
          const newShades = [...hue.shades];
          newShades[index] = {
            ...newShades[index],
            [selectedKey]: !d[selectedKey as keyof ShadeDefinition],
          };
          onUpdate({ shades: newShades });
        })
        .on("mousedown", function(event, d) {
          const index = hue.shades.indexOf(d);
          const selectedKey = `selectedFor${channel.toUpperCase()}` as keyof ShadeDefinition;
          const isSelected = d[selectedKey] as boolean;
          
          if (!isSelected || d.locked) return;

          event.preventDefault();
          document.body.style.cursor = 'ns-resize';
          document.body.style.userSelect = 'none';

          dragStateRef.current = {
            isDragging: true,
            pointIndex: index,
            channel,
            originalValue: d.hsv[channel],
          };

          document.addEventListener('mousemove', handleDrag);
          document.addEventListener('mouseup', handleDragEnd);
        });
    };

    addPoints('h', '#ef4444', yScaleHue);
    addPoints('s', '#22c55e', yScale);
    addPoints('v', '#3b82f6', yScale);

  }, [hue.shades, curveSettings, xScale, yScale, yScaleHue, lineH, lineS, lineV, margin, width, height, onUpdate, handleDrag, handleDragEnd]);

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant={curveSettings.showH ? "contained" : "outlined"}
          color="error"
          size="small"
          onClick={() => setCurveSettings(prev => ({ ...prev, showH: !prev.showH }))}
        >
          Hue (H)
        </Button>
        <Button
          variant={curveSettings.showS ? "contained" : "outlined"}
          color="success"
          size="small"
          onClick={() => setCurveSettings(prev => ({ ...prev, showS: !prev.showS }))}
        >
          Saturation (S)
        </Button>
        <Button
          variant={curveSettings.showV ? "contained" : "outlined"}
          color="primary"
          size="small"
          onClick={() => setCurveSettings(prev => ({ ...prev, showV: !prev.showV }))}
        >
          Value (V)
        </Button>
        <Button
          variant={curveSettings.smoothMode ? "contained" : "outlined"}
          size="small"
          onClick={() => setCurveSettings(prev => ({ ...prev, smoothMode: !prev.smoothMode }))}
        >
          Gaussian Falloff
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Click points to select/deselect them for dragging. Drag selected points vertically to adjust values.
        {curveSettings.smoothMode && " Gaussian falloff applies smooth changes to adjacent points during dragging."}
      </Typography>

      <Box 
        ref={containerRef}
        sx={{ width: '100%', height: 350, border: '1px solid #333', borderRadius: 1 }}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{ background: '#1a1a1a' }}
        />
      </Box>
    </Box>
  );
}

export default D3CurveVisualization;