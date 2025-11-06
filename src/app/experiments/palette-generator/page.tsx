"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import D3CurveVisualization from './D3CurveVisualization';
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Tooltip,
  Switch,
  FormGroup,
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
  hue: HueSet; // NEW: For passing to ShadeCard
  onShadeUpdate: (index: number, updates: Partial<ShadeDefinition>) => void;
}

interface ShadeCardProps {
  shade: ShadeDefinition;
  hue: HueSet; // NEW: For hue context and mode information
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

// Draggable chart interfaces
interface DragPoint {
  index: number;
  x: number;
  y: number;
  locked: boolean;
  selected: boolean;
  isDragging?: boolean;
  channel: 'h' | 's' | 'v';
}

interface CurveSettings {
  showH: boolean;
  showS: boolean;
  showV: boolean;
  smoothMode: boolean;
}

interface DragState {
  isDragging: boolean;
  dragPoint: DragPoint | null;
  startY: number;
  chartRect: DOMRect | null;
  originalValue: number; // Store original value for smooth mode
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
const extrapolateLinear = (
  points: InterpolationPoint[],
  targetIndices: number[]
): number[] => {
  points.sort((a, b) => a.x - b.x);

  return targetIndices.map((idx) => {
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
  channel: "h" | "s" | "v",
  shadeValues: number[],
  mode: "functional" | "functional-saturated" | "expressive"
): number[] => {
  const minShade = shadeValues[0]; // 50
  const maxShade = shadeValues[shadeValues.length - 1]; // 900
  const range = maxShade - minShade; // 850

  // Calculate virtual indices for pure white (shade 0) and pure black (shade 1000)
  const whiteIndex = (-minShade / range) * (shadeValues.length - 1);
  const blackIndex = ((1000 - minShade) / range) * (shadeValues.length - 1);

  const extendedPoints = [...points];
  const minLockedIndex = points[0].x;
  const maxLockedIndex = points[points.length - 1].x;

  // Add anchors based on channel
  if (channel === "h") {
    // Hue: keep constant at edge values
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: whiteIndex, y: points[0].y });
    }
    if (maxLockedIndex < shadeValues.length - 1) {
      extendedPoints.push({ x: blackIndex, y: points[points.length - 1].y });
    }
  } else if (channel === "s") {
    // Saturation: white always has no saturation, dark end depends on mode
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: whiteIndex, y: 0 }); // White anchor (light end)
    }
    if (maxLockedIndex < shadeValues.length - 1) {
      let darkS = 0; // Default to natural black

      if (mode === "functional") {
        darkS = 0; // Natural black (S=0)
      } else if (mode === "functional-saturated") {
        darkS = 100; // Rich saturated darks (S=100)
      } else if (mode === "expressive") {
        // In expressive mode, maintain last saturation level for smoother curves
        darkS = points[points.length - 1].y;
      }

      extendedPoints.push({ x: blackIndex, y: darkS });
    }
  } else if (channel === "v") {
    // Value: white is full brightness, black has no brightness
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: whiteIndex, y: 100 }); // White anchor (light end)
    }
    if (maxLockedIndex < shadeValues.length - 1) {
      extendedPoints.push({ x: blackIndex, y: 0 }); // Black anchor (dark end)
    }
  }

  return splineInterpolation(extendedPoints, targetIndices);
};

const extrapolateWithFallback = (
  points: InterpolationPoint[],
  targetIndices: number[],
  channel: "h" | "s" | "v",
  shadeValues: number[],
  mode: "functional" | "functional-saturated" | "expressive"
): { values: number[]; anchorUsed: boolean } => {
  // Special handling for hue (always constant for monochromatic palettes)
  if (channel === "h") {
    // For hue, use linear extrapolation in both modes (hue should be constant)
    const extrapolated = extrapolateLinear(points, targetIndices);
    return { values: extrapolated, anchorUsed: false };
  }

  // FUNCTIONAL MODES: Always use anchors for S and V
  if (mode === "functional" || mode === "functional-saturated") {
    const anchored = extrapolateWithAnchors(
      points,
      targetIndices,
      channel,
      shadeValues,
      mode
    );
    return { values: anchored, anchorUsed: true };
  }

  // EXPRESSIVE MODE: Use linear extrapolation with clamping
  if (mode === "expressive") {
    // Step 1: Always use linear extrapolation for natural curve
    const extrapolated = extrapolateLinear(points, targetIndices);

    // Step 2: Clamp invalid values to valid range while preserving trajectory
    const clampedValues = extrapolated.map((value) => {
      // Clamp S and V to 0-100 (hue already handled above)
      return Math.max(0, Math.min(100, value));
    });

    return { values: clampedValues, anchorUsed: false };
  }

  // Fallback (should never reach here)
  return { values: targetIndices.map(() => 50), anchorUsed: false };
};

const MUI_SHADE_VALUES = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;

const DEFAULT_HUE: HueSet = {
  id: "1",
  name: "primary",
  muiName: "primary",
  extrapolationMode: "functional",
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
              <Typography variant="h3" component="h1" gutterBottom>
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

    // HUE: Only use saturated colors (ignore achromatic shades)
    const hPoints = lockedShades
      .filter(
        (s: ShadeDefinition & { index: number }) =>
          s.selectedForH && s.hsv.s > 1
      )
      .map((s: ShadeDefinition & { index: number }) => ({
        x: s.index,
        y: s.hsv.h,
      }));

    // If no saturated points, find first saturated shade or default to 0
    const defaultHue = lockedShades.find((s) => s.hsv.s > 1)?.hsv.h ?? 0;

    // SATURATION & VALUE: Use all locked shades (including achromatic)
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
    const mode = hue.extrapolationMode; // Get mode from hue

    const hResult =
      hPoints.length > 0
        ? extrapolateWithFallback(hPoints, allIndices, "h", shadeValues, mode)
        : { values: allIndices.map(() => defaultHue), anchorUsed: false };

    const sResult =
      sPoints.length > 0
        ? extrapolateWithFallback(sPoints, allIndices, "s", shadeValues, mode)
        : { values: allIndices.map(() => 50), anchorUsed: false };

    const vResult =
      vPoints.length > 0
        ? extrapolateWithFallback(vPoints, allIndices, "v", shadeValues, mode)
        : { values: allIndices.map(() => 50), anchorUsed: false };

    // Check if any channel used anchors
    const anyAnchorUsed =
      hResult.anchorUsed || sResult.anchorUsed || vResult.anchorUsed;

    const newShades = hue.shades.map((shade: ShadeDefinition, i: number) => {
      if (shade.locked) return shade;

      const h = ((hResult.values[i] % 360) + 360) % 360;
      const s = Math.max(0, Math.min(100, sResult.values[i]));
      const v = Math.max(0, Math.min(100, vResult.values[i]));

      const rgb = hsvToRgb(h, s, v);
      const color = rgbToHex(rgb.r, rgb.g, rgb.b);

      // Determine extrapolation method for this shade
      const minLocked = Math.min(...lockedShades.map((s) => s.index));
      const maxLocked = Math.max(...lockedShades.map((s) => s.index));

      let extrapolationMethod: "interpolated" | "linear" | "adjusted";
      if (i >= minLocked && i <= maxLocked) {
        extrapolationMethod = "interpolated";
      } else if (anyAnchorUsed) {
        extrapolationMethod = "adjusted";
      } else {
        extrapolationMethod = "linear";
      }

      return {
        ...shade,
        hsv: { h, s, v },
        color,
        extrapolationMethod,
        generationMode: mode, // Store the mode used for generation
      };
    });

    // Show dialog if anchors were used (only in expressive mode)
    if (anyAnchorUsed && hue.extrapolationMode === "expressive") {
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

      {/* Extrapolation Mode Selector */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel id="extrapolation-mode-label">Extrapolation Mode</FormLabel>
        <RadioGroup
          row
          aria-labelledby="extrapolation-mode-label"
          value={hue.extrapolationMode}
          onChange={(e) =>
            onUpdate({
              extrapolationMode: e.target.value as
                | "functional"
                | "functional-saturated"
                | "expressive",
            })
          }
        >
          <FormControlLabel
            value="functional"
            control={<Radio />}
            label="UI Functional"
          />
          <FormControlLabel
            value="functional-saturated"
            control={<Radio />}
            label="UI Functional (Rich Darks)"
          />
          <FormControlLabel
            value="expressive"
            control={<Radio />}
            label="Brand Expressive"
          />
        </RadioGroup>
        <FormHelperText>
          UI Functional: Natural blacks (S=0) for text and backgrounds. UI
          Functional (Rich Darks): Saturated darks (S=100) for rich UI elements.
          Brand Expressive: Maintains color saturation curve for illustrations.
        </FormHelperText>
      </FormControl>

      <ShadeGrid shades={hue.shades} hue={hue} onShadeUpdate={updateShade} />

      <Box sx={{ mt: 4 }}>
        <D3CurveVisualization hue={hue} onUpdate={onUpdate} />
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
            Some extrapolated values went out of bounds (saturation or value
            &lt; 0 or &gt; 100), so the generator fell back to using black and
            white anchor points to ensure valid colors.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Shades marked with &ldquo;Adjusted&rdquo; badges used this fallback
            method for more natural color progression.
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

function ShadeGrid({ shades, hue, onShadeUpdate }: ShadeGridProps) {
  return (
    <Grid container spacing={2}>
      {shades.map((shade: ShadeDefinition, index: number) => (
        <Grid key={shade.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
          <ShadeCard
            shade={shade}
            hue={hue}
            onUpdate={(updates: Partial<ShadeDefinition>) =>
              onShadeUpdate(index, updates)
            }
          />
        </Grid>
      ))}
    </Grid>
  );
}

function ShadeCard({ shade, hue, onUpdate }: ShadeCardProps) {
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
  const isAchromatic = shade.hsv.s < 1;

  const handleColorChange = (newColor: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      // Get context hue from other saturated shades in the palette
      const saturatedShades = hue.shades.filter((s) => s.hsv.s > 1);
      const contextHue =
        saturatedShades.length > 0 ? saturatedShades[0].hsv.h : shade.hsv.h;

      const hsv = hexToHsv(newColor);

      // If the new color is achromatic, use context hue
      if (hsv.s < 1) {
        hsv.h = contextHue;
      }

      // Clear extrapolationMethod when user manually edits
      onUpdate({
        color: newColor,
        hsv,
        extrapolationMethod: undefined,
        generationMode: undefined,
      });
    }
  };

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
      {/* Top Right Chip Container */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          display: "flex",
          flexDirection: "row",
          gap: 0.5,
          alignItems: "flex-start",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          maxWidth: "calc(100% - 16px)", // Prevent overflow beyond card bounds
        }}
      >
        {/* Extrapolation Method Badge */}
        {!shade.locked && shade.extrapolationMethod && (
          <Tooltip
            title={
              shade.extrapolationMethod === "interpolated"
                ? "Generated by interpolating between locked shades"
                : shade.extrapolationMethod === "linear"
                ? "Generated by extending the color curve linearly"
                : shade.extrapolationMethod === "adjusted"
                ? shade.generationMode === "functional"
                  ? "Generated using UI-optimized curves (trending toward white/black)"
                  : "Generated using adjusted curves to prevent invalid colors"
                : ""
            }
            placement="top"
          >
            <Chip
              label={
                shade.extrapolationMethod === "interpolated"
                  ? "Interpolated"
                  : shade.extrapolationMethod === "linear"
                  ? "Extrapolated"
                  : shade.extrapolationMethod === "adjusted"
                  ? shade.generationMode === "functional"
                    ? "UI Mode"
                    : "Adjusted"
                  : ""
              }
              size="small"
              color={
                shade.extrapolationMethod === "adjusted" &&
                shade.generationMode === "expressive"
                  ? "warning" // Yellow warning in expressive mode (indicates fallback)
                  : "info" // Blue info badge otherwise
              }
            />
          </Tooltip>
        )}

        {/* Achromatic Indicator Badge */}
        {isAchromatic && (
          <Tooltip
            title="This color has very low saturation (S < 1) and is considered achromatic (neutral). Its hue won't affect interpolation between other colors."
            placement="top"
          >
            <Chip
              label="Achromatic"
              size="small"
              variant="filled"
              color="neutral"
            />
          </Tooltip>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            color: textColor,
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
                handleColorChange(newColor);
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
              color: textColor, // Use calculated text color for proper contrast
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: `${textColor}40`, // Semi-transparent border using text color
              },
              "&:hover fieldset": {
                borderColor: `${textColor}60`, // Slightly more opaque on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: textColor, // Full opacity when focused
              },
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
              <Tooltip title="Meets WCAG AAA standard (7:1 contrast ratio) - excellent for all text">
                <Chip label="AAA" size="small" color="success" />
              </Tooltip>
            )}
            {passesAA && (
              <Tooltip title="Meets WCAG AA standard (4.5:1 contrast ratio) - good for normal text">
                <Chip label="AA" size="small" color="primary" />
              </Tooltip>
            )}
            {!passesAA && (
              <Tooltip title="Fails WCAG standards - insufficient contrast for text accessibility">
                <Chip label="Fails" size="small" color="error" />
              </Tooltip>
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
  const chartRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragPoint: null,
    startY: 0,
    chartRect: null,
    originalValue: 0,
  });

  // Track temporary drag position for visual feedback only
  const [tempDragData, setTempDragData] = useState<{
    index: number;
    channel: 'h' | 's' | 'v';
    value: number;
  } | null>(null);

  // Curve visibility settings
  const [curveSettings, setCurveSettings] = useState<CurveSettings>({
    showH: true,
    showS: true,
    showV: true,
    smoothMode: false,
  });

  // Chart data for Recharts - includes temporary drag data for visual feedback
  const chartData = useMemo(() => {
    console.log('Rebuilding chartData with tempDragData:', tempDragData); // Debug
    return hue.shades.map((shade: ShadeDefinition, i: number) => {
      let h = shade.hsv.h / 3.6; // Scale to 0-100 for chart display
      let s = shade.hsv.s;
      let v = shade.hsv.v;
      
      // Override with temporary drag data if this point is being dragged
      if (tempDragData && tempDragData.index === i) {
        console.log(`Applying tempDragData to index ${i}:`, tempDragData); // Debug
        if (tempDragData.channel === 'h') h = tempDragData.value / 3.6;
        else if (tempDragData.channel === 's') s = tempDragData.value;
        else if (tempDragData.channel === 'v') v = tempDragData.value;
      }
      
      return {
        index: i,
        value: shade.value,
        h,
        hRaw: h * 3.6, // Keep original scale for tooltip
        s,
        v,
        locked: shade.locked,
        selectedForH: shade.selectedForH,
        selectedForS: shade.selectedForS,
        selectedForV: shade.selectedForV,
      };
    });
  }, [hue.shades, tempDragData]);

  // Calculate actual positions of points for drag overlay
  const [overlayPoints, setOverlayPoints] = useState<Array<{
    index: number;
    channel: 'h' | 's' | 'v';
    x: number;
    y: number;
    selected: boolean;
    locked: boolean;
  }>>([]);

  // Function to update overlay positions
  const updatePositions = useCallback(() => {
    if (!chartRef.current) return;
    
    const chartContainer = chartRef.current;
    const svgElement = chartContainer.querySelector('svg');
    if (!svgElement) return;
    
    // Find the actual chart area by looking for the clipping rectangle or chart group
    const clipPath = svgElement.querySelector('defs clipPath rect');
    const chartGroup = svgElement.querySelector('.recharts-cartesian-grid');
    
    let chartArea = { x: 0, y: 0, width: 0, height: 0 };
    
    if (clipPath) {
      // Use the clipping rectangle which defines the actual chart plotting area
      chartArea = {
        x: parseFloat(clipPath.getAttribute('x') || '0'),
        y: parseFloat(clipPath.getAttribute('y') || '0'),
        width: parseFloat(clipPath.getAttribute('width') || '0'),
        height: parseFloat(clipPath.getAttribute('height') || '0'),
      };
      console.log('Chart area from clipPath:', chartArea);
    } else if (chartGroup) {
      // Fallback: use the cartesian grid to determine chart area
      const gridRect = chartGroup.getBoundingClientRect();
      const containerRect = chartContainer.getBoundingClientRect();
      chartArea = {
        x: gridRect.left - containerRect.left,
        y: gridRect.top - containerRect.top,
        width: gridRect.width,
        height: gridRect.height,
      };
      console.log('Chart area from grid:', chartArea);
    }
    
    // If we still don't have dimensions, inspect actual data points
    if (chartArea.width === 0 || chartArea.height === 0) {
      // Find all actual data point circles
      const dataCircles = Array.from(svgElement.querySelectorAll('circle')).filter(circle => {
        const fill = circle.getAttribute('fill');
        const r = parseFloat(circle.getAttribute('r') || '0');
        // Filter for actual data points (not grid dots or other elements)
        return fill && fill !== 'none' && fill !== 'transparent' && r > 3;
      });
      
      if (dataCircles.length > 0) {
        const positions = dataCircles.map(circle => ({
          x: parseFloat(circle.getAttribute('cx') || '0'),
          y: parseFloat(circle.getAttribute('cy') || '0'),
        }));
        
        const minX = Math.min(...positions.map(p => p.x));
        const maxX = Math.max(...positions.map(p => p.x));
        const minY = Math.min(...positions.map(p => p.y));
        const maxY = Math.max(...positions.map(p => p.y));
        
        chartArea = {
          x: minX - 20, // Add some padding
          y: minY - 20,
          width: maxX - minX + 40,
          height: maxY - minY + 40,
        };
        console.log('Chart area from data points:', chartArea);
      }
    }
    
    // Fallback to manual calculation if DOM inspection fails
    if (chartArea.width === 0 || chartArea.height === 0) {
      const containerRect = chartContainer.getBoundingClientRect();
      chartArea = {
        x: 65,
        y: 25,
        width: containerRect.width - 120,
        height: 240,
      };
      console.log('Chart area fallback:', chartArea);
    }
    
    const newPoints: typeof overlayPoints = [];
    
    hue.shades.forEach((shade, index) => {
      const x = chartArea.x + (index / (hue.shades.length - 1)) * chartArea.width;
      
      if (curveSettings.showH) {
        const hValue = shade.hsv.h / 3.6; // Scale to 0-100 for display
        const y = chartArea.y + chartArea.height - (hValue / 100) * chartArea.height;
        newPoints.push({
          index,
          channel: 'h',
          x,
          y,
          selected: shade.selectedForH,
          locked: shade.locked,
        });
      }
      
      if (curveSettings.showS) {
        const y = chartArea.y + chartArea.height - (shade.hsv.s / 100) * chartArea.height;
        newPoints.push({
          index,
          channel: 's',
          x,
          y,
          selected: shade.selectedForS,
          locked: shade.locked,
        });
      }
      
      if (curveSettings.showV) {
        const y = chartArea.y + chartArea.height - (shade.hsv.v / 100) * chartArea.height;
        newPoints.push({
          index,
          channel: 'v',
          x,
          y,
          selected: shade.selectedForV,
          locked: shade.locked,
        });
      }
    });
    
    setOverlayPoints(newPoints);
  }, [hue.shades, curveSettings]);

  // Update overlay positions after chart renders
  useEffect(() => {
    // Update positions after a short delay to ensure chart is rendered
    const timer = setTimeout(updatePositions, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [updatePositions]);

  // Separate effect for resize handling
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized, updating positions'); // Debug
      // Add a small delay to let the chart re-render first
      setTimeout(updatePositions, 150);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updatePositions]);

  // Gaussian falloff for smooth mode (equalizer-style)
  const applyGaussianFalloff = useCallback((targetIndex: number, newValue: number, originalValue: number, channel: 'h' | 's' | 'v') => {
    if (!curveSettings.smoothMode) return [];

    const sigma = 0.8; // Tighter falloff for more localized effect
    const maxDistance = 2; // Only affect immediate neighbors (1-2 points away)
    const lockedIndices = hue.shades
      .map((shade, idx) => ({ shade, idx }))
      .filter(({ shade }) => shade.locked)
      .map(({ idx }) => idx);

    const newShades = [...hue.shades];
    const delta = newValue - originalValue; // How much the dragged point moved

    hue.shades.forEach((shade, index) => {
      if (index === targetIndex || shade.locked) return;

      const distance = Math.abs(index - targetIndex);
      
      // Only affect nearby points (equalizer-style)
      if (distance > maxDistance) return;

      // Check if there's a locked point between target and current index
      const hasLockedBetween = lockedIndices.some(lockedIdx => 
        (lockedIdx > Math.min(targetIndex, index) && lockedIdx < Math.max(targetIndex, index))
      );

      if (hasLockedBetween) return;

      // Calculate influence with much stronger falloff
      const influence = Math.exp(-Math.pow(distance, 2) / (2 * Math.pow(sigma, 2)));
      
      // Scale the influence to be more reasonable (max 50% for immediate neighbors)
      const scaledInfluence = influence * 0.5;
      const adjustment = delta * scaledInfluence;

      const currentShadeValue = channel === 'h' ? shade.hsv.h : 
                               channel === 's' ? shade.hsv.s : 
                               shade.hsv.v;
      
      let newShadeValue = currentShadeValue + adjustment;
      
      // Clamp values
      if (channel === 'h') {
        newShadeValue = ((newShadeValue % 360) + 360) % 360;
      } else {
        newShadeValue = Math.max(0, Math.min(100, newShadeValue));
      }

      const newHsv = { ...shade.hsv };
      newHsv[channel] = newShadeValue;
      
      const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
      const color = rgbToHex(rgb.r, rgb.g, rgb.b);

      newShades[index] = {
        ...shade,
        hsv: newHsv,
        color,
        extrapolationMethod: undefined,
      };
    });

    return newShades;
  }, [curveSettings.smoothMode, hue.shades]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    console.log('handleMouseMove called, isDragging:', dragState.isDragging); // Debug
    if (!dragState.isDragging || !dragState.dragPoint || !dragState.chartRect) return;

    console.log('Processing mouse move for drag'); // Debug

    // Calculate chart dimensions (matching Recharts layout)
    const chartHeight = 240; // ResponsiveContainer height minus margins
    const chartTop = 30; // Top margin in Recharts
    
    // Get mouse position relative to chart
    const currentY = e.clientY - dragState.chartRect.top - chartTop;
    const normalizedY = Math.max(0, Math.min(1, 1 - (currentY / chartHeight))); // Invert Y axis
    
    let newValue: number;
    if (dragState.dragPoint.channel === 'h') {
      newValue = normalizedY * 360; // Hue: 0-360 degrees
    } else {
      newValue = normalizedY * 100; // Saturation/Value: 0-100%
    }

    console.log('Setting tempDragData:', { index: dragState.dragPoint.index, channel: dragState.dragPoint.channel, value: newValue }); // Debug

    // Only update temporary visual data, not the actual chart data
    setTempDragData({
      index: dragState.dragPoint.index,
      channel: dragState.dragPoint.channel,
      value: newValue
    });
  }, [dragState]);

  const handleMouseUp = useCallback(() => {
    // Apply the final changes to the actual data
    if (tempDragData && dragState.dragPoint) {
      const newShades = [...hue.shades];
      const shadeIndex = tempDragData.index;
      const shade = newShades[shadeIndex];
      
      if (!shade.locked) {
        const newHsv = { ...shade.hsv };
        newHsv[tempDragData.channel] = tempDragData.value;
        
        const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
        const color = rgbToHex(rgb.r, rgb.g, rgb.b);

        newShades[shadeIndex] = {
          ...shade,
          hsv: newHsv,
          color,
          extrapolationMethod: undefined,
        };

        // Apply smooth mode falloff if enabled
        let finalShades = newShades;
        if (curveSettings.smoothMode) {
          finalShades = applyGaussianFalloff(shadeIndex, tempDragData.value, dragState.originalValue, tempDragData.channel);
          // Update the main dragged point in the smooth result
          finalShades[shadeIndex] = {
            ...finalShades[shadeIndex],
            hsv: newHsv,
            color,
            extrapolationMethod: undefined,
          };
        }

        onUpdate({ shades: finalShades });
      }
    }

    // Clear drag state and temporary data
    setDragState({
      isDragging: false,
      dragPoint: null,
      startY: 0,
      chartRect: null,
      originalValue: 0,
    });
    setTempDragData(null);
  }, [tempDragData, dragState, hue.shades, curveSettings.smoothMode, applyGaussianFalloff, onUpdate]);

  // Set up global mouse events
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // Track hover state for better visual feedback
  const [hoveredPoint, setHoveredPoint] = useState<{index: number, channel: string} | null>(null);

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
    const isDragging = dragState.isDragging && 
                     dragState.dragPoint?.index === payload.index && 
                     dragState.dragPoint?.channel === channel;
    const isHovered = hoveredPoint?.index === payload.index && hoveredPoint?.channel === channel;

    const colors: Record<string, string> = {
      h: "#ef4444",
      s: "#22c55e",
      v: "#3b82f6",
    };

    const baseRadius = payload.locked ? 8 : 6;
    let radius = baseRadius;
    if (isDragging) radius = baseRadius + 4;
    else if (isHovered) radius = baseRadius + 2;

    return (
      <g>
        {/* Hover ring for visual feedback */}
        {isHovered && (
          <circle
            cx={cx}
            cy={cy}
            r={radius + 4}
            fill="none"
            stroke={colors[channel]}
            strokeWidth={1}
            strokeOpacity={0.5}
          />
        )}
        
        {/* Shadow for dragging state */}
        {isDragging && (
          <circle
            cx={cx + 3}
            cy={cy + 3}
            r={radius}
            fill="rgba(0,0,0,0.6)"
          />
        )}
        
        {/* Lock icon background for locked points */}
        {payload.locked && (
          <circle
            cx={cx}
            cy={cy}
            r={12}
            fill="rgba(255,255,255,0.95)"
            stroke={colors[channel]}
            strokeWidth={2}
          />
        )}
        
        {/* Main point */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill={isSelected ? colors[channel] : "#666"}
          stroke="white"
          strokeWidth={payload.locked ? 3 : 2}
          style={{ 
            filter: isDragging ? 'brightness(1.4) drop-shadow(0 0 4px rgba(255,255,255,0.8))' : 
                   isHovered ? 'brightness(1.2)' : 'none',
          }}
        />
        
        {/* Selection indicator ring for selected points */}
        {isSelected && !payload.locked && (
          <circle
            cx={cx}
            cy={cy}
            r={radius + 2}
            fill="none"
            stroke={colors[channel]}
            strokeWidth={2}
            strokeDasharray="3,2"
          />
        )}
        
        {/* Lock icon for locked points */}
        {payload.locked && (
          <text
            x={cx}
            y={cy + 2}
            textAnchor="middle"
            fontSize="12"
            fill={colors[channel]}
            style={{ fontWeight: 'bold' }}
          >
            🔒
          </text>
        )}
      </g>
    );
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">
          HSV Channel Curves
        </Typography>
        
        {/* Curve Controls */}
        <Stack direction="row" spacing={2} alignItems="center">
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={curveSettings.showH}
                  onChange={(e) => setCurveSettings(prev => ({ ...prev, showH: e.target.checked }))}
                  size="small"
                />
              }
              label={<Typography variant="caption" sx={{ color: "#ef4444" }}>H</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={curveSettings.showS}
                  onChange={(e) => setCurveSettings(prev => ({ ...prev, showS: e.target.checked }))}
                  size="small"
                />
              }
              label={<Typography variant="caption" sx={{ color: "#22c55e" }}>S</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={curveSettings.showV}
                  onChange={(e) => setCurveSettings(prev => ({ ...prev, showV: e.target.checked }))}
                  size="small"
                />
              }
              label={<Typography variant="caption" sx={{ color: "#3b82f6" }}>V</Typography>}
            />
          </FormGroup>
          
          <FormControlLabel
            control={
              <Switch
                checked={curveSettings.smoothMode}
                onChange={(e) => setCurveSettings(prev => ({ ...prev, smoothMode: e.target.checked }))}
                size="small"
              />
            }
            label={<Typography variant="caption">Smooth Mode</Typography>}
          />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={3}
        sx={{ mb: 2, flexWrap: "wrap", fontSize: "0.75rem" }}
      >
        {curveSettings.showH && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 20, height: 3, bgcolor: "#ef4444" }} />
            <Typography variant="caption">
              Hue (H) 0-360° (scaled for display)
            </Typography>
          </Stack>
        )}
        {curveSettings.showS && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 20, height: 3, bgcolor: "#22c55e" }} />
            <Typography variant="caption">Saturation (S) 0-100%</Typography>
          </Stack>
        )}
        {curveSettings.showV && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 20, height: 3, bgcolor: "#3b82f6" }} />
            <Typography variant="caption">Value/Brightness (V) 0-100%</Typography>
          </Stack>
        )}
      </Stack>
      
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 2, display: "block" }}
      >
        Click dots to toggle channel selection for interpolation. Drag selected unlocked points vertically to adjust values.
        {curveSettings.smoothMode && " Smooth mode applies Gaussian falloff to adjacent points."}
      </Typography>

      <Box 
        ref={chartRef}
        sx={{ position: 'relative', width: '100%', height: 300 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart 
            data={chartData}
            style={{ pointerEvents: 'none' }} // Disable all Recharts interactions
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="value" stroke="#666" tick={{ fill: "#a0a0a0" }} />
            <YAxis stroke="#666" tick={{ fill: "#a0a0a0" }} domain={[0, 100]} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "6px",
                color: "#e0e0e0",
              }}
            />
            
            {/* Hue Line */}
            {curveSettings.showH && (
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
            )}
            
            {/* Saturation Line */}
            {curveSettings.showS && (
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
            )}
            
            {/* Value Line */}
            {curveSettings.showV && (
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
            )}
          </LineChart>
        </ResponsiveContainer>

        {/* Drag overlay with click and drag handling */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none', // Allow chart events to pass through by default
          }}
        >
          {overlayPoints.map((point, index) => (
            <Box
              key={`${point.channel}-${point.index}-${index}`}
              onMouseEnter={(e) => {
                e.stopPropagation(); // Prevent chart from seeing this event
                setHoveredPoint({ index: point.index, channel: point.channel });
              }}
              onMouseLeave={(e) => {
                e.stopPropagation(); // Prevent chart from seeing this event
                setHoveredPoint(null);
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent chart from seeing this event
                console.log('Click on point:', point); // Debug
                const shadeIndex = point.index;
                const selectedKey = `selectedFor${point.channel.toUpperCase()}`;
                const newShades = [...hue.shades];
                newShades[shadeIndex] = {
                  ...newShades[shadeIndex],
                  [selectedKey]: !point.selected,
                };
                onUpdate({ shades: newShades });
              }}
              onMouseDown={(e) => {
                e.stopPropagation(); // Prevent chart from seeing this event
                console.log('Mouse down on point:', point); // Debug
                if (!point.selected || point.locked || !chartRef.current) {
                  console.log('Drag blocked - selected:', point.selected, 'locked:', point.locked); // Debug
                  return;
                }

                e.preventDefault();
                const chartRect = chartRef.current.getBoundingClientRect();
                
                // Get the original value for the channel being dragged
                const shade = hue.shades[point.index];
                const originalValue = point.channel === 'h' ? shade.hsv.h : 
                                     point.channel === 's' ? shade.hsv.s : 
                                     shade.hsv.v;
                
                console.log('Starting drag with original value:', originalValue); // Debug
                
                setDragState({
                  isDragging: true,
                  dragPoint: { 
                    index: point.index, 
                    x: point.x,
                    y: point.y,
                    locked: point.locked,
                    selected: point.selected,
                    channel: point.channel,
                    isDragging: true 
                  },
                  startY: e.clientY,
                  chartRect,
                  originalValue,
                });
              }}
              sx={{
                position: 'absolute',
                left: point.x - 15,
                top: point.y - 15,
                width: 30,
                height: 30,
                cursor: point.selected && !point.locked ? 'ns-resize' : 'pointer',
                zIndex: 10,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: point.selected ? 
                  (point.channel === 'h' ? '#ef4444' : 
                   point.channel === 's' ? '#22c55e' : '#3b82f6') : 
                  'rgba(255,255,255,0.8)',
                bgcolor: point.selected ? 
                  (point.channel === 'h' ? 'rgba(239,68,68,0.2)' : 
                   point.channel === 's' ? 'rgba(34,197,94,0.2)' : 
                   'rgba(59,130,246,0.2)') : 
                  'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease-in-out',
                pointerEvents: 'auto', // Only this specific circle should capture events
                '&:hover': {
                  transform: 'scale(1.1)',
                  borderColor: point.channel === 'h' ? '#ef4444' : 
                              point.channel === 's' ? '#22c55e' : '#3b82f6',
                  bgcolor: point.channel === 'h' ? 'rgba(239,68,68,0.3)' : 
                          point.channel === 's' ? 'rgba(34,197,94,0.3)' : 
                          'rgba(59,130,246,0.3)',
                  boxShadow: `0 0 12px ${point.channel === 'h' ? 'rgba(239,68,68,0.5)' : 
                                        point.channel === 's' ? 'rgba(34,197,94,0.5)' : 
                                        'rgba(59,130,246,0.5)'}`,
                },
                // Special styling for locked points
                ...(point.locked && {
                  borderColor: 'rgba(156,163,175,0.8)',
                  bgcolor: 'rgba(156,163,175,0.2)',
                  cursor: 'not-allowed',
                  '&:hover': {
                    transform: 'none',
                    borderColor: 'rgba(156,163,175,0.8)',
                    bgcolor: 'rgba(156,163,175,0.2)',
                    boxShadow: 'none',
                  }
                })
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default function PaletteGeneratorPage() {
  return <PaletteGenerator />;
}
