"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Stack,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// Individual icon imports for better tree-shaking
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useHeaderConfig } from "@/contexts/HeaderContext";

// Type imports
import type { HueSet } from "./types";

// Utility imports
import { DEFAULT_HUE, migrateHueSet } from "./utils/defaults";

// Component imports
import HueEditor from "./components/HueEditor";
import PaletteSaveDialog from "./components/PaletteSaveDialog";
import PaletteLoadDialog from "./components/PaletteLoadDialog";

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
    null
  );

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

  const handleLoadPalette = (
    loadedPalette: HueSet[],
    paletteId?: string,
    paletteName?: string
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

    setLoadDialogOpen(false);
  };

  // Configure header for palette generator
  useHeaderConfig({
    logoAffix: "Palette Generator",
    containerProps: { maxWidth: "xl" },
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
                  icon={<SaveIcon />}
                  iconPosition={isDesktop ? "start" : undefined}
                  label={isDesktop ? "Save" : undefined}
                  onClick={() => setSaveDialogOpen(true)}
                  aria-label="Save Palette"
                  sx={{
                    minWidth: { xs: 48, sm: 90 },
                  }}
                />
                <Tab
                  icon={<FolderOpenIcon />}
                  iconPosition={isDesktop ? "start" : undefined}
                  label={isDesktop ? "Load" : undefined}
                  onClick={() => setLoadDialogOpen(true)}
                  aria-label="Load Palette"
                  sx={{
                    minWidth: { xs: 48, sm: 90 },
                  }}
                />
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

      {/* Save Dialog */}
      <PaletteSaveDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        currentPalette={hues}
        currentPaletteId={currentPaletteId}
        currentPaletteName={currentPaletteName}
        onSaveSuccess={(paletteId, paletteName) => {
          setCurrentPaletteId(paletteId);
          setCurrentPaletteName(paletteName);
          setSaveDialogOpen(false);
        }}
      />

      {/* Load Dialog */}
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
