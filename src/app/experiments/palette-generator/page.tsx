"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Container,
  Stack,
  Chip,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
// Individual icon imports for better tree-shaking
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

// TypeScript interfaces
interface HSV {
  h: number; // 0-360 degrees
  s: number; // 0-100 percent
  v: number; // 0-100 percent
}

interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
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
  extrapolationMethod?: 'interpolated' | 'linear' | 'anchored';
}

interface HueSet {
  id: string;
  name: string; // Display name
  muiName: string; // MUI palette key (primary, secondary, etc.)
  shades: ShadeDefinition[];
}

interface InterpolationPoint {
  x: number;
  y: number;
}

// Component prop interfaces
interface HueEditorProps {
  hue: HueSet;
  onUpdate: (updates: Partial<HueSet>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

interface ShadeGridProps {
  shades: ShadeDefinition[];
  onShadeUpdate: (index: number, updates: Partial<ShadeDefinition>) => void;
}

interface ShadeCardProps {
  shade: ShadeDefinition;
  onUpdate: (updates: Partial<ShadeDefinition>) => void;
}

interface CurveVisualizationProps {
  hue: HueSet;
  onUpdate: (updates: Partial<HueSet>) => void;
}

// Recharts types
interface ChartDataPoint {
  index: number;
  value: number;
  h: number;
  hRaw: number;
  s: number;
  v: number;
  locked: boolean;
  selectedForH: boolean;
  selectedForS: boolean;
  selectedForV: boolean;
  [key: string]: boolean | number; // Allow dynamic property access
}

// HSV to RGB conversion
const hsvToRgb = (h: number, s: number, v: number): RGB => {
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
  } else {
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

// RGB to HSV conversion
const rgbToHsv = (r: number, g: number, b: number): HSV => {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  return { h, s, v };
};

const hexToRgb = (hex: string): RGB => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.padStart(2, "0");
      })
      .join("")
  );
};

const hexToHsv = (hex: string): HSV => {
  const rgb = hexToRgb(hex);
  return rgbToHsv(rgb.r, rgb.g, rgb.b);
};

const calculateContrast = (hex1: string, hex2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ].map((val) => {
      const v = val / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

const splineInterpolation = (
  points: InterpolationPoint[],
  targetIndices: number[]
): number[] => {
  if (points.length === 0) return targetIndices.map(() => 50);
  if (points.length === 1) return targetIndices.map(() => points[0].y);

  points.sort((a: InterpolationPoint, b: InterpolationPoint) => a.x - b.x);

  return targetIndices.map((idx: number) => {
    if (idx <= points[0].x) return points[0].y;
    if (idx >= points[points.length - 1].x) return points[points.length - 1].y;

    let i = 0;
    while (i < points.length - 1 && points[i + 1].x < idx) i++;

    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[Math.min(points.length - 1, i + 1)];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const t = (idx - p1.x) / (p2.x - p1.x);

    const v0 = p0.y;
    const v1 = p1.y;
    const v2 = p2.y;
    const v3 = p3.y;

    const t2 = t * t;
    const t3 = t2 * t;

    return (
      0.5 *
      (2 * v1 +
        (-v0 + v2) * t +
        (2 * v0 - 5 * v1 + 4 * v2 - v3) * t2 +
        (-v0 + 3 * v1 - 3 * v2 + v3) * t3)
    );
  });
};

// Extrapolation functions
const isInvalidValue = (value: number, channel: 'h' | 's' | 'v'): boolean => {
  if (channel === 'h') return false; // Hue wraps around
  return value < 0 || value > 100;
};

const extrapolateLinear = (
  points: InterpolationPoint[],
  targetIndices: number[]
): number[] => {
  points.sort((a, b) => a.x - b.x);
  
  return targetIndices.map(idx => {
    // Within range: use spline interpolation
    if (idx >= points[0].x && idx <= points[points.length - 1].x) {
      return splineInterpolation(points, [idx])[0];
    }
    
    // LEFT extrapolation (lighter shades)
    if (idx < points[0].x) {
      if (points.length === 1) return points[0].y;
      const p0 = points[0];
      const p1 = points[1];
      const slope = (p1.y - p0.y) / (p1.x - p0.x);
      return p0.y + slope * (idx - p0.x);
    }
    
    // RIGHT extrapolation (darker shades)
    if (idx > points[points.length - 1].x) {
      if (points.length === 1) return points[0].y;
      const p1 = points[points.length - 2];
      const p2 = points[points.length - 1];
      const slope = (p2.y - p1.y) / (p2.x - p1.x);
      return p2.y + slope * (idx - p2.x);
    }
    
    return 0; // Fallback
  });
};

const extrapolateWithAnchors = (
  points: InterpolationPoint[],
  targetIndices: number[],
  channel: 'h' | 's' | 'v',
  shadeValues: number[]
): number[] => {
  const minShade = shadeValues[0]; // 50
  const maxShade = shadeValues[shadeValues.length - 1]; // 900
  const range = maxShade - minShade; // 850
  
  // Calculate virtual indices for pure black (shade 0) and pure white (shade 1000)
  const blackIndex = -minShade / range * (shadeValues.length - 1);
  const whiteIndex = (1000 - minShade) / range * (shadeValues.length - 1);
  
  const extendedPoints = [...points];
  const minLockedIndex = points[0].x;
  const maxLockedIndex = points[points.length - 1].x;
  
  // Add anchors based on channel
  if (channel === 'h') {
    // Hue: keep constant at edge values
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: blackIndex, y: points[0].y });
    }
    if (maxLockedIndex < shadeValues.length - 1) {
      extendedPoints.push({ x: whiteIndex, y: points[points.length - 1].y });
    }
  } else if (channel === 's') {
    // Saturation: white (light) has no saturation, dark colors maintain richness
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: blackIndex, y: 0 }); // White anchor
    }
    if (maxLockedIndex < shadeValues.length - 1) {
      const lastS = points[points.length - 1].y;
      extendedPoints.push({ x: whiteIndex, y: Math.max(lastS * 0.9, 50) }); // Rich dark anchor
    }
  } else if (channel === 'v') {
    // Value: white is full brightness, black has no brightness
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: blackIndex, y: 100 }); // White anchor
    }
    if (maxLockedIndex < shadeValues.length - 1) {
      extendedPoints.push({ x: whiteIndex, y: 0 }); // Black anchor
    }
  }
  
  return splineInterpolation(extendedPoints, targetIndices);
};

const extrapolateWithFallback = (
  points: InterpolationPoint[],
  targetIndices: number[],
  channel: 'h' | 's' | 'v',
  shadeValues: number[]
): { values: number[]; anchorUsed: boolean } => {
  // Step 1: Try linear extrapolation
  const extrapolated = extrapolateLinear(points, targetIndices);
  
  // Step 2: Check if any values are invalid (only outside locked range)
  const minLocked = Math.min(...points.map(p => p.x));
  const maxLocked = Math.max(...points.map(p => p.x));
  
  const hasInvalid = extrapolated.some((value, i) => {
    const idx = targetIndices[i];
    // Only check values outside locked range
    if (idx >= minLocked && idx <= maxLocked) return false;
    return isInvalidValue(value, channel);
  });
  
  // Step 3: If all valid, use linear extrapolation
  if (!hasInvalid) {
    return { values: extrapolated, anchorUsed: false };
  }
  
  // Step 4: Fall back to anchors
  const anchored = extrapolateWithAnchors(points, targetIndices, channel, shadeValues);
  return { values: anchored, anchorUsed: true };
};

const MUI_SHADE_VALUES = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;

const DEFAULT_HUE: HueSet = {
  id: "1",
  name: "primary",
  muiName: "primary",
  shades: MUI_SHADE_VALUES.map((val) => ({
    id: `shade-${val}`,
    value: val,
    color: "#808080",
    locked: false,
    hsv: { h: 0, s: 0, v: 50 },
    selectedForH: true,
    selectedForS: true,
    selectedForV: true,
  })),
};

function PaletteGenerator() {
  const [hues, setHues] = useState<HueSet[]>([DEFAULT_HUE]);
  const [activeHueId, setActiveHueId] = useState<string>("1");

  const activeHue = hues.find((h) => h.id === activeHueId);

  const addHue = () => {
    const newId = String(Date.now());
    const newHue = {
      ...DEFAULT_HUE,
      id: newId,
      name: `hue-${hues.length + 1}`,
      muiName: "",
      shades: DEFAULT_HUE.shades.map((s) => ({
        ...s,
        id: `${newId}-${s.value}`,
      })),
    };
    setHues([...hues, newHue]);
    setActiveHueId(newId);
  };

  const removeHue = (id: string) => {
    const filtered = hues.filter((h) => h.id !== id);
    setHues(filtered);
    if (activeHueId === id && filtered.length > 0) {
      setActiveHueId(filtered[0].id);
    }
  };

  const updateHue = (id: string, updates: Partial<HueSet>) => {
    setHues(hues.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const exportPalette = () => {
    const muiTheme: { palette: Record<string, Record<number, string>> } = {
      palette: {},
    };

    hues.forEach((hue) => {
      const colorSet: Record<number, string> = {};
      hue.shades.forEach((shade) => {
        colorSet[shade.value] = shade.color;
      });
      muiTheme.palette[hue.muiName || hue.name] = colorSet;
    });

    const exportData = {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      colorSpace: "hsv",
      muiTheme,
      fullData: hues,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                HSV Palette Generator
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Generate harmonious color palettes using HSV interpolation (like
                Palettte App)
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={exportPalette}
              size="large"
            >
              Export JSON
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
            {hues.map((hue) => (
              <Button
                key={hue.id}
                variant={activeHueId === hue.id ? "contained" : "outlined"}
                onClick={() => setActiveHueId(hue.id)}
                size="small"
                color="primary"
              >
                {hue.name}
              </Button>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addHue}
              size="small"
              sx={{ borderStyle: "dashed" }}
            >
              Add Hue
            </Button>
          </Stack>

          {activeHue && (
            <HueEditor
              hue={activeHue}
              onUpdate={(updates) => updateHue(activeHue.id, updates)}
              onRemove={() => removeHue(activeHue.id)}
              canRemove={hues.length > 1}
            />
          )}
        </Paper>
      </Container>
    </Box>
  );
}

function HueEditor({ hue, onUpdate, onRemove, canRemove }: HueEditorProps) {
  const [anchorDialogOpen, setAnchorDialogOpen] = useState(false);

  const updateShade = (index: number, updates: Partial<ShadeDefinition>) => {
    const newShades = [...hue.shades];
    newShades[index] = { ...newShades[index], ...updates };
    onUpdate({ shades: newShades });
  };

  const generateShades = () => {
    const lockedShades = hue.shades
      .map((shade: ShadeDefinition, idx: number) => ({ ...shade, index: idx }))
      .filter((s: ShadeDefinition & { index: number }) => s.locked);

    if (lockedShades.length === 0) return;

    const allIndices = hue.shades.map((_: ShadeDefinition, i: number) => i);
    const shadeValues = MUI_SHADE_VALUES.slice(); // [50, 100, 200, ..., 900]

    const hPoints = lockedShades
      .filter((s: ShadeDefinition & { index: number }) => s.selectedForH)
      .map((s: ShadeDefinition & { index: number }) => ({
        x: s.index,
        y: s.hsv.h,
      }));
    const sPoints = lockedShades
      .filter((s: ShadeDefinition & { index: number }) => s.selectedForS)
      .map((s: ShadeDefinition & { index: number }) => ({
        x: s.index,
        y: s.hsv.s,
      }));
    const vPoints = lockedShades
      .filter((s: ShadeDefinition & { index: number }) => s.selectedForV)
      .map((s: ShadeDefinition & { index: number }) => ({
        x: s.index,
        y: s.hsv.v,
      }));

    // Use extrapolation with fallback for each channel
    const hResult = hPoints.length > 0 
      ? extrapolateWithFallback(hPoints, allIndices, 'h', shadeValues)
      : { values: allIndices.map(() => 0), anchorUsed: false };
    
    const sResult = sPoints.length > 0 
      ? extrapolateWithFallback(sPoints, allIndices, 's', shadeValues)
      : { values: allIndices.map(() => 50), anchorUsed: false };
    
    const vResult = vPoints.length > 0 
      ? extrapolateWithFallback(vPoints, allIndices, 'v', shadeValues)
      : { values: allIndices.map(() => 50), anchorUsed: false };

    // Check if any channel used anchors
    const anyAnchorUsed = hResult.anchorUsed || sResult.anchorUsed || vResult.anchorUsed;

    const newShades = hue.shades.map((shade: ShadeDefinition, i: number) => {
      if (shade.locked) return shade;

      const h = ((hResult.values[i] % 360) + 360) % 360;
      const s = Math.max(0, Math.min(100, sResult.values[i]));
      const v = Math.max(0, Math.min(100, vResult.values[i]));

      const rgb = hsvToRgb(h, s, v);
      const color = rgbToHex(rgb.r, rgb.g, rgb.b);

      // Determine extrapolation method for this shade
      const minLocked = Math.min(...lockedShades.map(s => s.index));
      const maxLocked = Math.max(...lockedShades.map(s => s.index));
      
      let extrapolationMethod: 'interpolated' | 'linear' | 'anchored';
      if (i >= minLocked && i <= maxLocked) {
        extrapolationMethod = 'interpolated';
      } else if (anyAnchorUsed) {
        extrapolationMethod = 'anchored';
      } else {
        extrapolationMethod = 'linear';
      }

      return {
        ...shade,
        hsv: { h, s, v },
        color,
        extrapolationMethod,
      };
    });

    // Show dialog if anchors were used
    if (anyAnchorUsed) {
      setAnchorDialogOpen(true);
    }

    onUpdate({ shades: newShades });
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mt: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3, flexWrap: "wrap", gap: 2 }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ flexWrap: "wrap" }}
        >
          <TextField
            value={hue.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Hue name"
            size="small"
            variant="outlined"
          />
          <TextField
            value={hue.muiName}
            onChange={(e) => onUpdate({ muiName: e.target.value })}
            placeholder="MUI name (primary, secondary, etc.)"
            size="small"
            variant="outlined"
            sx={{ minWidth: 250 }}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="success" onClick={generateShades}>
            Generate Missing Shades
          </Button>
          {canRemove && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onRemove}
            >
              Remove
            </Button>
          )}
        </Stack>
      </Stack>

      <ShadeGrid shades={hue.shades} onShadeUpdate={updateShade} />

      <Box sx={{ mt: 4 }}>
        <CurveVisualization hue={hue} onUpdate={onUpdate} />
      </Box>

      {/* Anchor Warning Dialog */}
      <Dialog
        open={anchorDialogOpen}
        onClose={() => setAnchorDialogOpen(false)}
        aria-labelledby="anchor-dialog-title"
      >
        <DialogTitle id="anchor-dialog-title">
          Black/White Anchors Used
        </DialogTitle>
        <DialogContent>
          <Typography>
            Some extrapolated values went out of bounds (saturation or value &lt; 0 or &gt; 100), 
            so the generator fell back to using black and white anchor points to ensure valid colors.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Shades marked with &ldquo;Anchored&rdquo; badges used this fallback method for more natural color progression.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnchorDialogOpen(false)} autoFocus>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

function ShadeGrid({ shades, onShadeUpdate }: ShadeGridProps) {
  return (
    <Grid container spacing={2}>
      {shades.map((shade: ShadeDefinition, index: number) => (
        <Grid key={shade.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
          <ShadeCard
            shade={shade}
            onUpdate={(updates: Partial<ShadeDefinition>) =>
              onShadeUpdate(index, updates)
            }
          />
        </Grid>
      ))}
    </Grid>
  );
}

function ShadeCard({ shade, onUpdate }: ShadeCardProps) {
  const contrastWhite = useMemo(
    () => calculateContrast(shade.color, "#ffffff"),
    [shade.color]
  );
  const contrastBlack = useMemo(
    () => calculateContrast(shade.color, "#000000"),
    [shade.color]
  );

  const passesAA = contrastWhite >= 4.5 || contrastBlack >= 4.5;
  const passesAAA = contrastWhite >= 7 || contrastBlack >= 7;

  const textColor = contrastWhite > contrastBlack ? "#fff" : "#000";

  return (
    <Card
      sx={{
        bgcolor: shade.color,
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: 2,
        borderColor: shade.locked ? "primary.main" : "divider",
        position: "relative", // For absolute positioning of badge
      }}
    >
      {/* Extrapolation Method Badge */}
      {!shade.locked && shade.extrapolationMethod && (
        <Chip
          label={shade.extrapolationMethod === 'anchored' ? 'Anchored' : 
                 shade.extrapolationMethod === 'linear' ? 'Linear' : 'Interpolated'}
          size="small"
          color={shade.extrapolationMethod === 'anchored' ? 'warning' : 'info'}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: "0.65rem",
            height: 20,
            zIndex: 1,
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            color: textColor,
            fontWeight: "bold",
            mb: 1,
          }}
        >
          {shade.value}
        </Typography>

        <TextField
          value={shade.color}
          onChange={(e) => {
            const newColor = e.target.value;
            // Allow any input that starts with # and contains only valid hex characters
            if (/^#[0-9A-Fa-f]*$/.test(newColor) || newColor === "#") {
              // Only update HSV if we have a complete valid hex color
              if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                const hsv = hexToHsv(newColor);
                // Clear extrapolationMethod when user manually edits
                onUpdate({ color: newColor, hsv, extrapolationMethod: undefined });
              } else {
                // Update just the color display for partial input
                onUpdate({ color: newColor, hsv: shade.hsv });
              }
            }
          }}
          size="small"
          fullWidth
          sx={{
            mb: 1,
            "& .MuiInputBase-input": {
              fontFamily: "monospace",
              fontSize: "0.75rem",
            },
          }}
        />

        <Typography
          variant="caption"
          sx={{
            color: textColor,
            opacity: 0.7,
            fontFamily: "monospace",
            display: "block",
          }}
        >
          H:{Math.round(shade.hsv.h)} S:{Math.round(shade.hsv.s)} V:
          {Math.round(shade.hsv.v)}
        </Typography>
      </CardContent>

      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: textColor, opacity: 0.8, display: "block" }}
          >
            White: {contrastWhite.toFixed(2)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: textColor, opacity: 0.8, display: "block" }}
          >
            Black: {contrastBlack.toFixed(2)}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
            {passesAAA && (
              <Chip
                label="AAA"
                size="small"
                sx={{ height: 20, fontSize: "0.65rem" }}
              />
            )}
            {passesAA && (
              <Chip
                label="AA"
                size="small"
                sx={{ height: 20, fontSize: "0.65rem" }}
              />
            )}
            {!passesAA && (
              <Chip
                label="Fails"
                size="small"
                color="error"
                sx={{ height: 20, fontSize: "0.65rem" }}
              />
            )}
          </Stack>
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="small"
          color={shade.locked ? "primary" : "secondary"}
          startIcon={
            shade.locked ? (
              <LockIcon fontSize="small" />
            ) : (
              <LockOpenIcon fontSize="small" />
            )
          }
          onClick={() => onUpdate({ locked: !shade.locked })}
        >
          {shade.locked ? "Locked" : "Unlocked"}
        </Button>
      </CardContent>
    </Card>
  );
}

function CurveVisualization({ hue, onUpdate }: CurveVisualizationProps) {
  const chartData = useMemo(() => {
    return hue.shades.map((shade: ShadeDefinition, i: number) => ({
      index: i,
      value: shade.value,
      h: shade.hsv.h / 3.6, // Scale to 0-100 for chart display
      hRaw: shade.hsv.h, // Keep original for tooltip
      s: shade.hsv.s,
      v: shade.hsv.v,
      locked: shade.locked,
      selectedForH: shade.selectedForH,
      selectedForS: shade.selectedForS,
      selectedForV: shade.selectedForV,
    }));
  }, [hue.shades]);

  const CustomDot = ({
    cx,
    cy,
    payload,
    dataKey,
  }: {
    cx: number;
    cy: number;
    payload: ChartDataPoint;
    dataKey: string;
  }) => {
    const channel = dataKey;
    const selectedKey = `selectedFor${channel.toUpperCase()}`;
    const isSelected = payload[selectedKey];

    const toggleSelection = () => {
      const shadeIndex = payload.index;
      const newShades = [...hue.shades];
      newShades[shadeIndex] = {
        ...newShades[shadeIndex],
        [selectedKey]: !isSelected,
      };
      onUpdate({ shades: newShades });
    };

    const colors: Record<string, string> = {
      h: "#ef4444",
      s: "#22c55e",
      v: "#3b82f6",
    };

    return (
      <circle
        cx={cx}
        cy={cy}
        r={payload.locked ? 6 : 4}
        fill={isSelected ? colors[channel] : "#666"}
        stroke="white"
        strokeWidth={payload.locked ? 2 : 1}
        style={{ cursor: "pointer" }}
        onClick={toggleSelection}
      />
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        HSV Channel Curves
      </Typography>
      <Stack
        direction="row"
        spacing={3}
        sx={{ mb: 2, flexWrap: "wrap", fontSize: "0.75rem" }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 20, height: 3, bgcolor: "#ef4444" }} />
          <Typography variant="caption">
            Hue (H) 0-360° (scaled for display)
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 20, height: 3, bgcolor: "#22c55e" }} />
          <Typography variant="caption">Saturation (S) 0-100%</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 20, height: 3, bgcolor: "#3b82f6" }} />
          <Typography variant="caption">Value/Brightness (V) 0-100%</Typography>
        </Stack>
      </Stack>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 2, display: "block" }}
      >
        Click dots to toggle channel selection for interpolation. Filled dots =
        selected, empty = ignored. Larger dots = locked shades.
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="value" stroke="#666" tick={{ fill: "#a0a0a0" }} />
          <YAxis stroke="#666" tick={{ fill: "#a0a0a0" }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "6px",
              color: "#e0e0e0",
            }}
          />
          <Line
            type="monotone"
            dataKey="h"
            stroke="#ef4444"
            strokeWidth={2}
            dot={(props: {
              cx: number;
              cy: number;
              payload: ChartDataPoint;
            }) => {
              const { cx, cy, payload } = props;
              return (
                <CustomDot
                  key={`h-${payload.index}`}
                  cx={cx}
                  cy={cy}
                  payload={payload}
                  dataKey="h"
                />
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="s"
            stroke="#22c55e"
            strokeWidth={2}
            dot={(props: {
              cx: number;
              cy: number;
              payload: ChartDataPoint;
            }) => {
              const { cx, cy, payload } = props;
              return (
                <CustomDot
                  key={`s-${payload.index}`}
                  cx={cx}
                  cy={cy}
                  payload={payload}
                  dataKey="s"
                />
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={(props: {
              cx: number;
              cy: number;
              payload: ChartDataPoint;
            }) => {
              const { cx, cy, payload } = props;
              return (
                <CustomDot
                  key={`v-${payload.index}`}
                  cx={cx}
                  cy={cy}
                  payload={payload}
                  dataKey="v"
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default function PaletteGeneratorPage() {
  return <PaletteGenerator />;
}
