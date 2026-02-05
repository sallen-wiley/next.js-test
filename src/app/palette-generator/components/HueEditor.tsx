import React, { useState, useMemo } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Link,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import D3CurveVisualization from "../D3CurveVisualization";
import { getColorName } from "../ColorNameMapper";
import ShadeConfigurationDialog from "./ShadeConfigurationDialog";
import ShadeGrid from "./ShadeGrid";
import { hsvToRgb, rgbToHex, hexToHsv } from "../utils/colorConversions";
import { extrapolateWithFallback } from "../utils/interpolation";
import { MUI_PALETTE_KEYS } from "../utils/defaults";
import type {
  HueEditorProps,
  ShadeDefinition,
  ShadeConfiguration,
} from "../types";

export default function HueEditor({
  hue,
  onUpdate,
  onRemove,
  canRemove,
  contrastTargetColor,
}: HueEditorProps) {
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
    [medianShade?.color], // Use color as dependency since it's always synced from HSV
  );

  const updateShade = React.useCallback(
    (shadeId: string, updates: Partial<ShadeDefinition>) => {
      // Use functional update to get current state and avoid stale closures
      onUpdate((currentHue) => ({
        shades: currentHue.shades.map((shade) =>
          shade.id === shadeId ? { ...shade, ...updates } : shade,
        ),
      }));
    },
    [onUpdate],
  );

  const handleConfigChange = (newConfig: ShadeConfiguration[]) => {
    // Create new shades array matching new config length
    const newShades = newConfig.map((config, newIndex) => {
      // Try to find corresponding old shade by proportional index
      const oldIndex = Math.round(
        (newIndex / Math.max(1, newConfig.length - 1)) *
          Math.max(1, hue.shades.length - 1),
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
          s.selectedForH && s.hsv.s > 1,
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
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
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

      <ShadeGrid
        shades={hue.shades}
        onShadeUpdate={updateShade}
        contrastTargetColor={contrastTargetColor}
      />

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
