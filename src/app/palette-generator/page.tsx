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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Alert,
} from "@mui/material";
// Individual icon imports for better tree-shaking
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import { useAuth } from "@/components/auth/AuthProvider";

// Type imports
import type { HueSet } from "./types";

// Utility imports
import { DEFAULT_HUE, migrateHueSet } from "./utils/defaults";

// Component imports
import HueEditor from "./components/HueEditor";
import PaletteSidebar from "./components/PaletteSidebar";
import { downloadCssVariables, savePalette } from "./services/paletteService";
import {
  listLocalDrafts,
  deleteLocalDraft,
  type LocalPaletteDraft,
} from "./services/localDraftService";

const CONTRAST_COLOR_STORAGE_KEY = "paletteGenerator.contrastTargetColor";
const IMPORT_PROMPT_DISMISS_PREFIX = "paletteGenerator.importPromptDismissed.";

type ExportTokenNamingMode = "mui-key" | "hue-name";
type ExportFormat = "json" | "css";

function PaletteGenerator() {
  const { user, loading: authLoading } = useAuth();

  const [hues, setHues] = useState<HueSet[]>(() => {
    const initialHues = [DEFAULT_HUE];
    return initialHues.map(migrateHueSet);
  });
  const [activeHueId, setActiveHueId] = useState<string>("1");
  const [currentPaletteId, setCurrentPaletteId] = useState<string | null>(null);
  const [currentPaletteName, setCurrentPaletteName] = useState<string | null>(
    null,
  );
  const [savedPalette, setSavedPalette] = useState<HueSet[] | null>(null);
  const [contrastTargetColor, setContrastTargetColor] = useState<string | null>(
    null,
  );
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportTokenNamingMode, setExportTokenNamingMode] =
    useState<ExportTokenNamingMode>("mui-key");
  const [pendingExportFormat, setPendingExportFormat] =
    useState<ExportFormat>("json");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [draftsPendingImport, setDraftsPendingImport] = useState<
    LocalPaletteDraft[]
  >([]);
  const [importingDrafts, setImportingDrafts] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [libraryRefreshToken, setLibraryRefreshToken] = useState(0);

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

  const getImportDismissKey = (userId: string) =>
    `${IMPORT_PROMPT_DISMISS_PREFIX}${userId}`;

  useEffect(() => {
    if (authLoading || !user?.id) {
      return;
    }

    const localDrafts = listLocalDrafts();
    if (localDrafts.length === 0) {
      return;
    }

    const dismissKey = getImportDismissKey(user.id);
    const dismissed =
      typeof window !== "undefined" &&
      sessionStorage.getItem(dismissKey) === "true";

    if (dismissed) {
      return;
    }

    setDraftsPendingImport(localDrafts);
    setImportError(null);
    setImportDialogOpen(true);
  }, [authLoading, user?.id]);

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

  const getExportTokenKey = (
    hue: HueSet,
    namingMode: ExportTokenNamingMode,
    index: number,
  ) => {
    const hueName = hue.name.trim();
    const muiKey = hue.muiName.trim();

    if (namingMode === "hue-name") {
      return hueName || muiKey || `hue-${index + 1}`;
    }

    return muiKey || hueName || `hue-${index + 1}`;
  };

  const exportPalette = (namingMode: ExportTokenNamingMode) => {
    const muiTheme: { palette: Record<string, Record<string, string>> } = {
      palette: {},
    };

    hues.forEach((hue, index) => {
      const colorSet: Record<string, string> = {};
      hue.shades.forEach((shade) => {
        colorSet[shade.label] = shade.color;
      });
      const tokenKey = getExportTokenKey(hue, namingMode, index);
      muiTheme.palette[tokenKey] = colorSet;
    });

    const exportData = {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      colorSpace: "hsv",
      tokenNamingMode: namingMode,
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

  const exportCssPalette = (namingMode: ExportTokenNamingMode) => {
    const filename = currentPaletteName
      ? `${currentPaletteName.replace(/\s+/g, "-").toLowerCase()}.css`
      : undefined;

    downloadCssVariables(hues, filename, namingMode);
  };

  const handleExportRequest = (format: ExportFormat) => {
    setPendingExportFormat(format);
    setExportDialogOpen(true);
  };

  const handleConfirmExportJson = () => {
    if (pendingExportFormat === "json") {
      exportPalette(exportTokenNamingMode);
    } else {
      exportCssPalette(exportTokenNamingMode);
    }
    setExportDialogOpen(false);
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

    setMobileDrawerOpen(false);
  };

  const handleSaveSuccess = (paletteId: string, paletteName: string) => {
    setCurrentPaletteId(paletteId);
    setCurrentPaletteName(paletteName);
    setSavedPalette([...hues]); // Snapshot current state
    setMobileDrawerOpen(false);
  };

  const dismissImportPrompt = () => {
    if (user?.id && typeof window !== "undefined") {
      sessionStorage.setItem(getImportDismissKey(user.id), "true");
    }

    setImportDialogOpen(false);
    setImportError(null);
  };

  const handleImportLocalDrafts = async () => {
    if (!user?.id || draftsPendingImport.length === 0) {
      setImportDialogOpen(false);
      return;
    }

    setImportingDrafts(true);
    setImportError(null);

    const importedDraftIds: string[] = [];
    let failed = 0;

    try {
      for (const draft of draftsPendingImport) {
        try {
          await savePalette(user.id, draft.name, draft.palette_data, {
            description: draft.description,
            isPublic: false,
          });
          importedDraftIds.push(draft.id);
        } catch {
          failed += 1;
        }
      }

      importedDraftIds.forEach((draftId) => {
        deleteLocalDraft(draftId);
      });

      const remainingDrafts = listLocalDrafts();
      setDraftsPendingImport(remainingDrafts);

      if (importedDraftIds.length > 0) {
        const label = importedDraftIds.length === 1 ? "draft" : "drafts";
        setImportNotice(
          `Imported ${importedDraftIds.length} local ${label} to your account.`,
        );
        setLibraryRefreshToken((prev) => prev + 1);
      }

      if (failed > 0) {
        const noun = failed === 1 ? "draft" : "drafts";
        setImportError(
          `${failed} ${noun} could not be imported and remain local.`,
        );
      } else {
        dismissImportPrompt();
      }

      if (remainingDrafts.length === 0 && user?.id && typeof window !== "undefined") {
        sessionStorage.setItem(getImportDismissKey(user.id), "true");
        setImportDialogOpen(false);
      }
    } finally {
      setImportingDrafts(false);
    }
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
                  {importNotice && (
                    <Alert
                      severity="success"
                      sx={{ mt: 2 }}
                      onClose={() => setImportNotice(null)}
                    >
                      {importNotice}
                    </Alert>
                  )}
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
                  onExport={handleExportRequest}
                  libraryRefreshToken={libraryRefreshToken}
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
            onExport={handleExportRequest}
            libraryRefreshToken={libraryRefreshToken}
          />
        </Box>
      </Drawer>

      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {pendingExportFormat === "json"
            ? "Export JSON Tokens"
            : "Export CSS Variables"}
        </DialogTitle>
        <DialogContent>
          <FormControl sx={{ mt: 1 }}>
            <FormLabel id="json-token-naming-mode-label">
              Token naming strategy
            </FormLabel>
            <RadioGroup
              aria-labelledby="json-token-naming-mode-label"
              value={exportTokenNamingMode}
              onChange={(event) =>
                setExportTokenNamingMode(
                  event.target.value as ExportTokenNamingMode,
                )
              }
            >
              <FormControlLabel
                value="mui-key"
                control={<Radio />}
                label="Use MUI palette key (fallback to hue name)"
              />
              <FormControlLabel
                value="hue-name"
                control={<Radio />}
                label="Use hue name (fallback to MUI palette key)"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmExportJson}>
            {pendingExportFormat === "json" ? "Export JSON" : "Export CSS"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={importDialogOpen}
        onClose={importingDrafts ? undefined : dismissImportPrompt}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import Local Drafts?</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              You have {draftsPendingImport.length} local
              {draftsPendingImport.length === 1 ? " draft" : " drafts"} saved
              in this browser. Import them to your account as private palettes?
            </Typography>

            {importError && (
              <Alert severity="warning" onClose={() => setImportError(null)}>
                {importError}
              </Alert>
            )}

            <Stack spacing={1}>
              {draftsPendingImport.slice(0, 5).map((draft) => (
                <Typography key={draft.id} variant="body2">
                  - {draft.name}
                </Typography>
              ))}
              {draftsPendingImport.length > 5 && (
                <Typography variant="caption" color="text.secondary">
                  + {draftsPendingImport.length - 5} more drafts
                </Typography>
              )}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={dismissImportPrompt} disabled={importingDrafts}>
            Not Now
          </Button>
          <Button
            variant="contained"
            onClick={handleImportLocalDrafts}
            disabled={importingDrafts || draftsPendingImport.length === 0}
          >
            {importingDrafts ? "Importing..." : "Import Drafts"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function PaletteGeneratorPage() {
  return <PaletteGenerator />;
}
