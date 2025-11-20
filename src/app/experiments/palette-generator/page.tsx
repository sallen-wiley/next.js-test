"use client";

import React, { useState, useMemo } from "react";
import D3CurveVisualization from "./D3CurveVisualization";
import { getColorName } from "./ColorNameMapper";
import {
  Box,
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
  Tabs,
  Tab,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  useMediaQuery,
  useTheme,
  Link,
} from "@mui/material";
// Individual icon imports for better tree-shaking
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ColorizeIcon from "@mui/icons-material/Colorize";
import SettingsIcon from "@mui/icons-material/Settings";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AppHeader from "@/components/app/AppHeader";

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

interface ShadeConfiguration {
  id: string; // "1", "2", "3"... (sequential IDs)
  label: string; // "50", "100" or "Lightest", "Base" etc. (user editable)
}

interface ShadeDefinition {
  id: string;
  label: string; // Display label: "50", "Lightest", etc.
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
  shadeConfig: ShadeConfiguration[]; // Shade count and labels configuration
}

interface InterpolationPoint {
  x: number;
  y: number;
}

// Component prop interfaces
interface HueEditorProps {
  hue: HueSet;
  onUpdate: (
    updates: Partial<HueSet> | ((current: HueSet) => Partial<HueSet>)
  ) => void;
  onRemove: () => void;
  canRemove: boolean;
}

interface ShadeGridProps {
  shades: ShadeDefinition[];
  onShadeUpdate: (shadeId: string, updates: Partial<ShadeDefinition>) => void;
}

interface ShadeCardProps {
  shade: ShadeDefinition;
  onUpdate: (updates: Partial<ShadeDefinition>) => void;
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
  shadeCount: number[],
  mode: "functional" | "functional-saturated" | "expressive"
): number[] => {
  // Calculate virtual indices for pure white and pure black anchors
  // These are positioned just outside the actual shade range
  const whiteIndex = -0.5; // Just before first shade (lighter than lightest)
  const blackIndex = shadeCount.length - 0.5; // Just after last shade (darker than darkest)

  const extendedPoints = [...points];
  const minLockedIndex = points[0].x;
  const maxLockedIndex = points[points.length - 1].x;

  // Add anchors based on channel
  if (channel === "h") {
    // Hue: keep constant at edge values
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: whiteIndex, y: points[0].y });
    }
    if (maxLockedIndex < shadeCount.length - 1) {
      extendedPoints.push({ x: blackIndex, y: points[points.length - 1].y });
    }
  } else if (channel === "s") {
    // Saturation: white always has no saturation, dark end depends on mode
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: whiteIndex, y: 0 }); // White anchor (light end)
    }
    if (maxLockedIndex < shadeCount.length - 1) {
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
    // Value: white is full brightness, dark end depends on mode
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: whiteIndex, y: 100 }); // White anchor (light end)
    }
    if (maxLockedIndex < shadeCount.length - 1) {
      let darkV = 0; // Default to pure black

      if (mode === "functional" || mode === "functional-saturated") {
        darkV = 0; // Natural black (V=0) for UI elements
      } else if (mode === "expressive") {
        // In expressive mode, maintain last brightness level for smoother curves
        // This prevents aggressive black trending
        darkV = points[points.length - 1].y;
      }

      extendedPoints.push({ x: blackIndex, y: darkV });
    }
  }

  return splineInterpolation(extendedPoints, targetIndices);
};

const extrapolateWithFallback = (
  points: InterpolationPoint[],
  targetIndices: number[],
  channel: "h" | "s" | "v",
  shadeCount: number[],
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
      shadeCount,
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

const DEFAULT_SHADE_CONFIG: ShadeConfiguration[] = [
  { id: "1", label: "50" },
  { id: "2", label: "100" },
  { id: "3", label: "200" },
  { id: "4", label: "300" },
  { id: "5", label: "400" },
  { id: "6", label: "500" },
  { id: "7", label: "600" },
  { id: "8", label: "700" },
  { id: "9", label: "800" },
  { id: "10", label: "900" },
];

// Default color palette values
const DEFAULT_PALETTE_COLORS: Record<number, string> = {
  50: "#f5fafa",
  100: "#dfeef0",
  200: "#c3dfe2",
  300: "#a6ced1",
  400: "#87b9be",
  500: "#68a3a8",
  600: "#45848a",
  700: "#245e64",
  800: "#0d383d",
  900: "#02181a",
};

// Standard MUI palette keys
const MUI_PALETTE_KEYS = [
  "red",
  "pink",
  "purple",
  "deepPurple",
  "indigo",
  "blue",
  "lightBlue",
  "cyan",
  "teal",
  "green",
  "lightGreen",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deepOrange",
  "brown",
  "grey",
  "blueGrey",
] as const;

const DEFAULT_HUE: HueSet = {
  id: "1",
  name: "primary",
  muiName: "primary",
  extrapolationMode: "functional",
  shadeConfig: DEFAULT_SHADE_CONFIG,
  shades: DEFAULT_SHADE_CONFIG.map((config) => {
    const color = DEFAULT_PALETTE_COLORS[Number(config.label)] || "#808080";
    const hsv = hexToHsv(color);
    return {
      id: `shade-${config.id}`,
      label: config.label,
      color,
      locked: false,
      hsv,
      selectedForH: true,
      selectedForS: true,
      selectedForV: true,
    };
  }),
};

// Migration function for old palette format
const migrateHueSet = (hue: HueSet): HueSet => {
  // If already has shadeConfig, no migration needed
  if (hue.shadeConfig) {
    return hue;
  }

  // Migrate from old format (shades with .value) to new format (shadeConfig)
  const shadeConfig = hue.shades.map((shade, index) => ({
    id: String(index + 1),
    // @ts-expect-error - old format might have .value property
    label: String(shade.value || (index + 1) * 100),
  }));

  return {
    ...hue,
    shadeConfig,
    shades: hue.shades.map((shade, index) => ({
      ...shade,
      // @ts-expect-error - old format might have .value property
      label: String(shade.value || (index + 1) * 100),
    })),
  };
};

function PaletteGenerator() {
  const [hues, setHues] = useState<HueSet[]>(() => {
    const initialHues = [DEFAULT_HUE];
    return initialHues.map(migrateHueSet);
  });
  const [activeHueId, setActiveHueId] = useState<string>("1");

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const activeHue = hues.find((h) => h.id === activeHueId);

  const addHue = () => {
    const newId = String(Date.now());
    const migratedDefaultHue = migrateHueSet(DEFAULT_HUE);
    const newHue = {
      ...migratedDefaultHue,
      id: newId,
      name: `hue-${hues.length + 1}`,
      muiName: "",
      shades: migratedDefaultHue.shades.map((s) => ({
        ...s,
        id: `${newId}-${s.id}`,
      })),
    };
    setHues([...hues, newHue]);
    setActiveHueId(newId);
  };

  const removeHue = (id: string) => {
    setHues((currentHues) => {
      const filtered = currentHues.filter((h) => h.id !== id);
      if (activeHueId === id && filtered.length > 0) {
        setActiveHueId(filtered[0].id);
      }
      return filtered;
    });
  };

  const updateHue = (
    id: string,
    updates: Partial<HueSet> | ((current: HueSet) => Partial<HueSet>)
  ) => {
    setHues((currentHues) =>
      currentHues.map((h) => {
        if (h.id !== id) return h;
        const actualUpdates =
          typeof updates === "function" ? updates(h) : updates;
        return { ...h, ...actualUpdates };
      })
    );
  };

  const exportPalette = () => {
    const muiTheme: { palette: Record<string, Record<string, string>> } = {
      palette: {},
    };

    hues.forEach((hue) => {
      const colorSet: Record<string, string> = {};
      hue.shades.forEach((shade) => {
        colorSet[shade.label] = shade.color;
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
    <>
      <AppHeader />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
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
                Generate harmonious color palettes using HSV interpolation.
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              mb: 4,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Box sx={{ flexGrow: 1, minWidth: 0, overflow: "hidden" }}>
              <Tabs
                value={activeHueId}
                onChange={(event, newValue) => {
                  if (newValue === "add-hue") {
                    addHue();
                  } else {
                    setActiveHueId(newValue);
                  }
                }}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="hue selection tabs"
                sx={{
                  "& .MuiTabs-scrollButtons.Mui-disabled": {
                    opacity: 0.3,
                  },
                }}
              >
                {hues.map((hue) => (
                  <Tab key={hue.id} label={hue.name} value={hue.id} />
                ))}
                <Tab
                  icon={<AddIcon />}
                  iconPosition={isDesktop ? "start" : undefined}
                  label={isDesktop ? "Add Hue" : undefined}
                  value="add-hue"
                  aria-label="Add Hue"
                  sx={{
                    minWidth: { xs: 48, sm: 90 },
                  }}
                />
              </Tabs>
            </Box>
            <Box sx={{ flexShrink: 0 }}>
              <Tabs value={false} aria-label="actions">
                <Tab
                  icon={<DownloadIcon />}
                  iconPosition={isDesktop ? "start" : undefined}
                  label={isDesktop ? "Export JSON" : undefined}
                  onClick={exportPalette}
                  aria-label="Export JSON"
                  sx={{
                    minWidth: { xs: 48, sm: 90 },
                  }}
                />
              </Tabs>
            </Box>
          </Box>

          {activeHue && (
            <HueEditor
              hue={activeHue}
              onUpdate={(updates) => updateHue(activeHue.id, updates)}
              onRemove={() => removeHue(activeHue.id)}
              canRemove={hues.length > 1}
            />
          )}
        </Container>
      </Box>
    </>
  );
}

function HueEditor({ hue, onUpdate, onRemove, canRemove }: HueEditorProps) {
  const [anchorDialogOpen, setAnchorDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Track local hue name to prevent resets during graph updates
  const [localName, setLocalName] = useState(hue.name);
  const [localMuiName, setLocalMuiName] = useState(hue.muiName);

  // Sync local state when hue prop changes from external updates (tab switch, etc.)
  // But NOT when just shades change (to preserve user input during dragging)
  const prevHueIdRef = React.useRef(hue.id);
  React.useEffect(() => {
    if (prevHueIdRef.current !== hue.id) {
      // Different hue selected - sync everything
      setLocalName(hue.name);
      setLocalMuiName(hue.muiName);
      prevHueIdRef.current = hue.id;
    }
  }, [hue.id, hue.name, hue.muiName]);

  // Memoize color name suggestion to prevent expensive recalculation on every render
  const medianIndex = Math.floor(hue.shades.length / 2);
  const medianShade = hue.shades[medianIndex];
  const suggestedColorName = useMemo(
    () => getColorName(medianShade?.hsv || { h: 0, s: 0, v: 50 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [medianShade?.color] // Use color as dependency since it's always synced from HSV
  );

  const updateShade = React.useCallback(
    (shadeId: string, updates: Partial<ShadeDefinition>) => {
      // Use functional update to get current state and avoid stale closures
      onUpdate((currentHue) => ({
        shades: currentHue.shades.map((shade) =>
          shade.id === shadeId ? { ...shade, ...updates } : shade
        ),
      }));
    },
    [onUpdate]
  );

  const handleConfigChange = (newConfig: ShadeConfiguration[]) => {
    // Create new shades array matching new config length
    const newShades = newConfig.map((config, newIndex) => {
      // Try to find corresponding old shade by proportional index
      const oldIndex = Math.round(
        (newIndex / Math.max(1, newConfig.length - 1)) *
          Math.max(1, hue.shades.length - 1)
      );
      const oldShade = hue.shades[oldIndex];

      return {
        id: `${hue.id}-shade-${config.id}`,
        label: config.label,
        color: oldShade?.color || "#808080",
        locked: false, // Unlock everything when restructuring
        hsv: oldShade?.hsv || hexToHsv("#808080"),
        selectedForH: true,
        selectedForS: true,
        selectedForV: true,
      };
    });

    onUpdate({ shadeConfig: newConfig, shades: newShades });
  };

  const generateShades = () => {
    const lockedShades = hue.shades
      .map((shade: ShadeDefinition, idx: number) => ({ ...shade, index: idx }))
      .filter((s: ShadeDefinition & { index: number }) => s.locked);

    if (lockedShades.length === 0) return;

    const allIndices = hue.shades.map((_: ShadeDefinition, i: number) => i);

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
        ? extrapolateWithFallback(hPoints, allIndices, "h", allIndices, mode)
        : { values: allIndices.map(() => defaultHue), anchorUsed: false };

    const sResult =
      sPoints.length > 0
        ? extrapolateWithFallback(sPoints, allIndices, "s", allIndices, mode)
        : { values: allIndices.map(() => 50), anchorUsed: false };

    const vResult =
      vPoints.length > 0
        ? extrapolateWithFallback(vPoints, allIndices, "v", allIndices, mode)
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
    <Box sx={{ mb: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3, flexWrap: "wrap", gap: 2 }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="start"
          sx={{ flexWrap: "wrap" }}
        >
          <TextField
            label="Hue Name"
            value={localName}
            onChange={(e) => {
              setLocalName(e.target.value);
              onUpdate({ name: e.target.value });
            }}
            placeholder="Hue name"
            size="small"
            variant="outlined"
            helperText={
              <>
                Suggested: {suggestedColorName} |{" "}
                <Link
                  component="button"
                  // variant="body2"
                  onClick={() => {
                    setLocalName(suggestedColorName);
                    onUpdate({ name: suggestedColorName });
                  }}
                  sx={{ verticalAlign: "baseline" }}
                >
                  use this
                </Link>
              </>
            }
          />
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel id="mui-palette-key-label">MUI Palette Key</InputLabel>
            <Select
              labelId="mui-palette-key-label"
              label="MUI Palette Key"
              value={localMuiName}
              onChange={(e) => {
                setLocalMuiName(e.target.value);
                onUpdate({ muiName: e.target.value });
              }}
            >
              {MUI_PALETTE_KEYS.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Optional. Select closest MUI palette key
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={2}>
          {canRemove && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Hue
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
          sx={{
            flexDirection: { xs: "column", md: "row" },
          }}
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
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size="auto">
            <Button
              variant="contained"
              color="primary"
              onClick={generateShades}
            >
              Generate Missing Shades
            </Button>
          </Grid>
          <Grid size="auto">
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setConfigDialogOpen(true)}
            >
              Configure Shades
            </Button>
          </Grid>
        </Grid>
      </FormControl>

      <Box sx={{ mb: 4 }}>
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
          <D3CurveVisualization shades={hue.shades} onUpdate={onUpdate} />
        </Paper>
      </Box>

      <ShadeGrid shades={hue.shades} onShadeUpdate={updateShade} />

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

      {/* Shade Configuration Dialog */}
      <ShadeConfigurationDialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        currentConfig={hue.shadeConfig}
        onSave={handleConfigChange}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Hue &quot;{hue.name}&quot;?
        </DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            Are you sure you want to delete this hue? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              onRemove();
            }}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ShadeGrid({ shades, onShadeUpdate }: ShadeGridProps) {
  return (
    <Grid container spacing={2}>
      {shades.map((shade: ShadeDefinition) => (
        <Grid key={shade.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
          <ShadeCardWrapper shade={shade} onShadeUpdate={onShadeUpdate} />
        </Grid>
      ))}
    </Grid>
  );
}

// Wrapper component to memoize the onUpdate callback per shade
const ShadeCardWrapper = React.memo(
  function ShadeCardWrapper({
    shade,
    onShadeUpdate,
  }: {
    shade: ShadeDefinition;
    onShadeUpdate: (shadeId: string, updates: Partial<ShadeDefinition>) => void;
  }) {
    const handleUpdate = React.useCallback(
      (updates: Partial<ShadeDefinition>) => {
        onShadeUpdate(shade.id, updates);
      },
      [shade.id, onShadeUpdate]
    );

    return <ShadeCard shade={shade} onUpdate={handleUpdate} />;
  },
  (prevProps, nextProps) => {
    // Only re-render if shade actually changed
    return (
      prevProps.shade === nextProps.shade &&
      prevProps.onShadeUpdate === nextProps.onShadeUpdate
    );
  }
);

const ShadeCard = React.memo(
  function ShadeCard({ shade, onUpdate }: ShadeCardProps) {
    const colorInputRef = React.useRef<HTMLInputElement>(null);
    const [hexInput, setHexInput] = React.useState(shade.color);

    // Sync local hex input with shade.color when shade changes externally
    React.useEffect(() => {
      setHexInput(shade.color);
    }, [shade.color]);

    const contrastWhite = useMemo(
      () => calculateContrast(shade.color, "#ffffff"),
      [shade.color]
    );
    const contrastBlack = useMemo(
      () => calculateContrast(shade.color, "#000000"),
      [shade.color]
    );

    const { passesAA, passesAAA, textColor, isAchromatic } = useMemo(() => {
      const cWhite = contrastWhite;
      const cBlack = contrastBlack;
      return {
        passesAA: cWhite >= 4.5 || cBlack >= 4.5,
        passesAAA: cWhite >= 7 || cBlack >= 7,
        textColor: cWhite > cBlack ? "#fff" : "#000",
        isAchromatic: shade.hsv.s < 1,
      };
    }, [contrastWhite, contrastBlack, shade.hsv.s]);

    const handleColorChange = React.useCallback(
      (newColor: string) => {
        // Normalize to uppercase for consistency
        const normalizedColor = newColor.toUpperCase();
        if (/^#[0-9A-F]{6}$/.test(normalizedColor)) {
          const hsv = hexToHsv(normalizedColor);

          // If the new color is achromatic, preserve the current shade's hue
          // This prevents the hue from being set to 0 and affecting interpolation
          if (hsv.s < 1) {
            hsv.h = shade.hsv.h;
          }

          // Clear extrapolationMethod when user manually edits
          onUpdate({
            color: normalizedColor,
            hsv,
            extrapolationMethod: undefined,
            generationMode: undefined,
          });
        }
      },
      [shade.hsv.h, onUpdate]
    );

    // Note: shade.hsv.h is a primitive value, safe to use in dependencies

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
            {shade.label}
          </Typography>

          <TextField
            value={hexInput}
            onChange={(e) => {
              const newColor = e.target.value.toUpperCase();

              // Allow typing only valid hex characters
              if (/^#[0-9A-F]{0,6}$/.test(newColor) || newColor === "") {
                setHexInput(newColor);

                // Only update parent state if we have a complete valid hex color
                if (/^#[0-9A-F]{6}$/.test(newColor)) {
                  handleColorChange(newColor);
                }
              }
            }}
            onBlur={() => {
              // On blur, reset to valid color if input is invalid
              if (!/^#[0-9A-F]{6}$/.test(hexInput)) {
                setHexInput(shade.color);
              }
            }}
            size="small"
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Pick color"
                      onClick={() => colorInputRef.current?.click()}
                      edge="end"
                      size="small"
                      sx={{ color: textColor }}
                    >
                      <ColorizeIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              mb: 1,
              "& .MuiInputBase-input": {
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: textColor, // Use calculated text color for proper contrast
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: textColor, // Border matches contrast text color
                  opacity: 0.8,
                },
                "&:hover fieldset": {
                  borderColor: textColor,
                  opacity: 0.9,
                },
                "&.Mui-focused fieldset": {
                  borderColor: textColor,
                  opacity: 1,
                },
              },
            }}
          />

          {/* Hidden native color picker input */}
          <Box
            component="input"
            type="color"
            value={shade.color}
            onChange={(e) => handleColorChange(e.target.value)}
            ref={colorInputRef}
            sx={{
              position: "absolute",
              opacity: 0,
              width: 0,
              height: 0,
              pointerEvents: "none",
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
            onClick={() => {
              const newLockedState = !shade.locked;
              onUpdate({
                locked: newLockedState,
                // Keep all channels selected/visible
                selectedForH: true,
                selectedForS: true,
                selectedForV: true,
              });
            }}
          >
            {shade.locked ? "Locked" : "Unlocked"}
          </Button>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if shade data actually changed
    const prev = prevProps.shade;
    const next = nextProps.shade;

    return (
      prev.id === next.id &&
      prev.color === next.color &&
      prev.label === next.label &&
      prev.locked === next.locked &&
      prev.extrapolationMethod === next.extrapolationMethod &&
      prev.generationMode === next.generationMode &&
      prev.hsv.h === next.hsv.h &&
      prev.hsv.s === next.hsv.s &&
      prev.hsv.v === next.hsv.v
    );
  }
);

interface ShadeConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  currentConfig: ShadeConfiguration[];
  onSave: (newConfig: ShadeConfiguration[]) => void;
}

function ShadeConfigurationDialog({
  open,
  onClose,
  currentConfig,
  onSave,
}: ShadeConfigurationDialogProps) {
  const [countInput, setCountInput] = useState(String(currentConfig.length));
  const [configs, setConfigs] = useState(currentConfig);

  // Reset local state when dialog opens or currentConfig changes
  React.useEffect(() => {
    if (open) {
      setCountInput(String(currentConfig.length));
      setConfigs(currentConfig);
    }
  }, [open, currentConfig]);

  // Update configs array when count changes
  const handleCountChange = (inputValue: string) => {
    // Always update the input display
    setCountInput(inputValue);

    // Parse and validate
    const newCount = parseInt(inputValue, 10);

    // Only update configs if we have a valid number in range
    if (isNaN(newCount) || newCount < 1 || newCount > 20) return;

    if (newCount > configs.length) {
      // Add new configs with smart defaults
      const newConfigs = [...configs];
      for (let i = configs.length; i < newCount; i++) {
        newConfigs.push({
          id: String(i + 1),
          label: String((i + 1) * 100), // Smart default: 100, 200, 300, etc.
        });
      }
      setConfigs(newConfigs);
    } else {
      // Remove from end
      setConfigs(configs.slice(0, newCount));
    }
  };

  const handleLabelChange = (index: number, newLabel: string) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], label: newLabel };
    setConfigs(newConfigs);
  };

  const handleSave = () => {
    onSave(configs);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>Configure Shades</DialogTitle>
      <DialogContent>
        <TextField
          label="Number of Shades"
          type="number"
          value={countInput}
          onChange={(e) => handleCountChange(e.target.value)}
          onBlur={() => {
            // On blur, ensure we have a valid value
            const num = parseInt(countInput, 10);
            if (isNaN(num) || num < 1) {
              setCountInput("1");
            } else if (num > 20) {
              setCountInput("20");
            }
          }}
          slotProps={{ htmlInput: { min: 1, max: 20 } }}
          fullWidth
          sx={{ mb: 3, mt: 1 }}
          helperText="Choose between 1 and 20 shades"
          error={(() => {
            const num = parseInt(countInput, 10);
            return isNaN(num) || num < 1 || num > 20;
          })()}
        />

        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Shade Labels (from lightest to darkest)
        </Typography>

        <Stack spacing={2}>
          {configs.map((config, index) => (
            <TextField
              key={config.id}
              label={`Shade ${index + 1}`}
              value={config.label}
              onChange={(e) => handleLabelChange(index, e.target.value)}
              size="small"
              fullWidth
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={(() => {
            const num = parseInt(countInput, 10);
            return isNaN(num) || num < 1 || num > 20;
          })()}
        >
          Save Configuration
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function PaletteGeneratorPage() {
  return <PaletteGenerator />;
}
