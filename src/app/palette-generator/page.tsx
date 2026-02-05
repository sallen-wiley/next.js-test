"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Stack,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Grid,
  Chip,
  Drawer,
  IconButton,
} from "@mui/material";
// Individual icon imports for better tree-shaking
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useHeaderConfig } from "@/contexts/HeaderContext";

// Type imports
import type { HueSet } from "./types";

// Utility imports
import { DEFAULT_HUE, migrateHueSet } from "./utils/defaults";

// Component imports
import HueEditor from "./components/HueEditor";
import PaletteSaveDialog from "./components/PaletteSaveDialog";
import PaletteLoadDialog from "./components/PaletteLoadDialog";
import PaletteSidebar from "./components/PaletteSidebar";

const CONTRAST_COLOR_STORAGE_KEY = "paletteGenerator.contrastTargetColor";

function PaletteGenerator() {
  const [hues, setHues] = useState<HueSet[]>(() => {
    const initialHues = [DEFAULT_HUE];
    return initialHues.map(migrateHueSet);
  });
  const [activeHueId, setActiveHueId] = useState<string>("1");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [currentPaletteId, setCurrentPaletteId] = useState<string | null>(null);
  const [currentPaletteName, setCurrentPaletteName] = useState<string | null>(
    null,
  );
  const [savedPalette, setSavedPalette] = useState<HueSet[] | null>(null);
  const [contrastTargetColor, setContrastTargetColor] = useState<string | null>(
    null,
  );
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const activeHue = hues.find((h) => h.id === activeHueId);

  // Load contrast color from localStorage on mount
  useEffect(() => {
    const storedColor = localStorage.getItem(CONTRAST_COLOR_STORAGE_KEY);
    if (storedColor && /^#[0-9A-Fa-f]{6}$/.test(storedColor)) {
      setContrastTargetColor(storedColor);
    }
  }, []);

  // Save contrast color to localStorage when it changes
  useEffect(() => {
    if (contrastTargetColor) {
      localStorage.setItem(CONTRAST_COLOR_STORAGE_KEY, contrastTargetColor);
    } else {
      localStorage.removeItem(CONTRAST_COLOR_STORAGE_KEY);
    }
  }, [contrastTargetColor]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (!savedPalette) return hues.length > 0;
    return JSON.stringify(hues) !== JSON.stringify(savedPalette);
  };

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
    updates: Partial<HueSet> | ((current: HueSet) => Partial<HueSet>),
  ) => {
    setHues((currentHues) =>
      currentHues.map((h) => {
        if (h.id !== id) return h;
        const actualUpdates =
          typeof updates === "function" ? updates(h) : updates;
        return { ...h, ...actualUpdates };
      }),
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

  const handleLoadPalette = (
    loadedPalette: HueSet[],
    paletteId?: string,
    paletteName?: string,
  ) => {
    // Validate palette data
    if (
      !loadedPalette ||
      !Array.isArray(loadedPalette) ||
      loadedPalette.length === 0
    ) {
      console.error("Invalid palette data received:", loadedPalette);
      return;
    }

    // Migrate loaded palette to ensure compatibility
    const migratedPalette = loadedPalette.map(migrateHueSet);
    setHues(migratedPalette);

    // Set active hue to first hue in loaded palette
    if (migratedPalette.length > 0) {
      setActiveHueId(migratedPalette[0].id);
    }

    // Track the loaded palette (presets don't have IDs)
    setCurrentPaletteId(paletteId || null);
    setCurrentPaletteName(paletteName || null);
    setSavedPalette(paletteId ? migratedPalette : null);

    setLoadDialogOpen(false);
    setMobileDrawerOpen(false);
  };

  const handleSaveSuccess = (paletteId: string, paletteName: string) => {
    setCurrentPaletteId(paletteId);
    setCurrentPaletteName(paletteName);
    setSavedPalette([...hues]); // Snapshot current state
    setSaveDialogOpen(false);
    setMobileDrawerOpen(false);
  };

  // Configure header for palette generator
  useHeaderConfig({
    logoAffix: "Palette Generator",
    containerProps: { maxWidth: false },
  });

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Container maxWidth={false} sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {/* Left Column: Editor (9/12) */}
            <Grid size={{ xs: 12, lg: 9 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 4 }}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h3" component="h1">
                      HSV Palette Generator
                    </Typography>
                    {hasUnsavedChanges() && (
                      <Chip
                        label="Unsaved Changes"
                        color="warning"
                        size="small"
                      />
                    )}
                  </Stack>
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
                <Box sx={{ flexShrink: 0, display: { lg: "none" } }}>
                  <IconButton
                    onClick={() => setMobileDrawerOpen(true)}
                    color="primary"
                    aria-label="Open options"
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Box>

              {activeHue && (
                <HueEditor
                  hue={activeHue}
                  onUpdate={(updates) => updateHue(activeHue.id, updates)}
                  onRemove={() => removeHue(activeHue.id)}
                  canRemove={hues.length > 1}
                  contrastTargetColor={contrastTargetColor}
                />
              )}
            </Grid>

            {/* Right Column: Sidebar (3/12, desktop only) */}
            <Grid
              size={{ xs: 12, lg: 3 }}
              sx={{ display: { xs: "none", lg: "block" } }}
            >
              <Box
                sx={{
                  position: "sticky",
                  top: 80,
                  maxHeight: "calc(100vh - 100px)",
                  overflow: "hidden",
                }}
              >
                <PaletteSidebar
                  hues={hues}
                  currentPaletteId={currentPaletteId}
                  currentPaletteName={currentPaletteName}
                  contrastTargetColor={contrastTargetColor}
                  onContrastColorChange={setContrastTargetColor}
                  onSaveSuccess={handleSaveSuccess}
                  onLoad={handleLoadPalette}
                  onExportJson={exportPalette}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mobile Bottom Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          display: { lg: "none" },
          "& .MuiDrawer-paper": {
            maxHeight: { xs: "90vh", sm: "70vh" },
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          {/* Drag handle indicator */}
          <Box
            sx={{
              width: 40,
              height: 4,
              bgcolor: "divider",
              borderRadius: 2,
              mx: "auto",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 8,
            }}
          />
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Palette Options
          </Typography>
          <IconButton onClick={() => setMobileDrawerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ height: "100%", overflow: "auto" }}>
          <PaletteSidebar
            hues={hues}
            currentPaletteId={currentPaletteId}
            currentPaletteName={currentPaletteName}
            contrastTargetColor={contrastTargetColor}
            onContrastColorChange={setContrastTargetColor}
            onSaveSuccess={handleSaveSuccess}
            onLoad={handleLoadPalette}
            onExportJson={exportPalette}
          />
        </Box>
      </Drawer>

      {/* Legacy Save Dialog (for backward compatibility - can be removed) */}
      <PaletteSaveDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        currentPalette={hues}
        currentPaletteId={currentPaletteId}
        currentPaletteName={currentPaletteName}
        onSaveSuccess={handleSaveSuccess}
      />

      {/* Legacy Load Dialog (for backward compatibility - can be removed) */}
      <PaletteLoadDialog
        open={loadDialogOpen}
        onClose={() => setLoadDialogOpen(false)}
        onLoad={handleLoadPalette}
      />
    </>
  );
}

export default function PaletteGeneratorPage() {
  return <PaletteGenerator />;
}
