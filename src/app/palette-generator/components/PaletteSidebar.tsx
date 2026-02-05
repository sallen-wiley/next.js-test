import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import CodeIcon from "@mui/icons-material/Code";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { supabase } from "@/lib/supabase";
import { useRoleAccess } from "@/hooks/useRoles";
import {
  savePalette,
  listUserPalettes,
  listPublicPalettes,
  deletePalette,
  downloadCssVariables,
} from "../services/paletteService";
import { PRESET_PALETTES } from "../presets";
import type { UserPalette, UserPaletteWithAuthor } from "@/lib/supabase";
import type { HueSet } from "../types";
import ContrastColorPicker from "./ContrastColorPicker";

interface PaletteSidebarProps {
  hues: HueSet[];
  currentPaletteId: string | null;
  currentPaletteName: string | null;
  contrastTargetColor: string | null;
  onContrastColorChange: (color: string | null) => void;
  onSaveSuccess: (paletteId: string, paletteName: string) => void;
  onLoad: (palette: HueSet[], paletteId?: string, paletteName?: string) => void;
  onExportJson: () => void;
}

type LoadTabValue = "my-palettes" | "presets" | "public";
type ExportFormat = "json" | "css";

export default function PaletteSidebar({
  hues,
  currentPaletteId,
  currentPaletteName,
  contrastTargetColor,
  onContrastColorChange,
  onSaveSuccess,
  onLoad,
  onExportJson,
}: PaletteSidebarProps) {
  // Contrast picker state (top of sidebar)
  // This is passed through props

  // Save section state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveDescription, setSaveDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { requiresRole } = useRoleAccess();
  const canMakePublic = requiresRole(["admin", "designer"]);

  // Load section state
  const [loadTab, setLoadTab] = useState<LoadTabValue>("my-palettes");
  const [myPalettes, setMyPalettes] = useState<UserPalette[]>([]);
  const [publicPalettes, setPublicPalettes] = useState<UserPaletteWithAuthor[]>(
    [],
  );
  const [loadingPalettes, setLoadingPalettes] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Export section state
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [saveMenuAnchor, setSaveMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  // Sync save form with current palette
  useEffect(() => {
    setSaveName(currentPaletteName || "");
    // isPublic and description will be loaded when editing existing palette
  }, [currentPaletteName]);

  // Load palettes when tab changes
  useEffect(() => {
    const loadPalettes = async () => {
      setLoadingPalettes(true);
      setLoadError(null);

      try {
        if (loadTab === "my-palettes") {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user?.id) {
            throw new Error("User not authenticated");
          }
          const palettes = await listUserPalettes(user.id);
          setMyPalettes(palettes);
        } else if (loadTab === "public") {
          const palettes = await listPublicPalettes();
          setPublicPalettes(palettes);
        }
      } catch (err) {
        if (err instanceof Error) {
          setLoadError(err.message);
        } else {
          setLoadError("Failed to load palettes");
        }
      } finally {
        setLoadingPalettes(false);
      }
    };

    loadPalettes();
  }, [loadTab]);

  // Filter palettes by search term
  const filterPalettes = <T extends UserPalette | UserPaletteWithAuthor>(
    palettes: T[],
  ): T[] => {
    if (!searchTerm.trim()) return palettes;
    const term = searchTerm.toLowerCase();
    return palettes.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        ("author_name" in p && p.author_name?.toLowerCase().includes(term)),
    );
  };

  const handleOpenSaveDialog = () => {
    setSaveDialogOpen(true);
    setSaveError(null);
  };

  const handleCloseSaveDialog = () => {
    setSaveDialogOpen(false);
    setSaveError(null);
  };

  const handleSaveAsNew = () => {
    setSaveMenuAnchor(null);
    // Pre-fill with copy suffix and clear palette ID to force new save
    setSaveName(currentPaletteName ? `${currentPaletteName} (Copy)` : "");
    // Temporarily clear the current palette ID for this save operation
    // We'll handle this in the save dialog
    setSaveDialogOpen(true);
    setSaveError(null);
  };

  const handleUpdateExisting = () => {
    setSaveMenuAnchor(null);
    handleOpenSaveDialog();
  };

  const handleSave = async (saveAsNew: boolean = false) => {
    if (!saveName.trim()) {
      setSaveError("Palette name is required");
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const result = await savePalette(user.id, saveName.trim(), hues, {
        description: saveDescription.trim() || undefined,
        isPublic,
        paletteId: saveAsNew ? undefined : currentPaletteId || undefined,
      });

      onSaveSuccess(result.id, result.name);

      // Reload palettes if we're on "my-palettes" tab
      if (loadTab === "my-palettes") {
        const palettes = await listUserPalettes(user.id);
        setMyPalettes(palettes);
      }

      handleCloseSaveDialog();
    } catch (err) {
      if (err instanceof Error) {
        setSaveError(err.message);
      } else {
        setSaveError("Failed to save palette");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLoadPalette = (
    paletteData: HueSet[] | undefined,
    paletteId?: string,
    paletteName?: string,
  ) => {
    if (!paletteData || !Array.isArray(paletteData)) {
      setLoadError("Invalid palette data");
      return;
    }
    onLoad(paletteData, paletteId, paletteName);
  };

  const handleDeletePalette = async (
    paletteId: string,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this palette?")) {
      return;
    }

    setDeletingId(paletteId);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      await deletePalette(paletteId, user.id);
      setMyPalettes(myPalettes.filter((p) => p.id !== paletteId));

      // Clear current palette if it was deleted
      if (currentPaletteId === paletteId) {
        onSaveSuccess("", "");
      }
    } catch (err) {
      console.error("Failed to delete palette:", err);
      alert("Failed to delete palette");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = (format: ExportFormat) => {
    setExportMenuAnchor(null);
    if (format === "json") {
      onExportJson();
    } else if (format === "css") {
      const filename = currentPaletteName
        ? `${currentPaletteName.replace(/\s+/g, "-").toLowerCase()}.css`
        : undefined;
      downloadCssVariables(hues, filename);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Scrollable content area */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {/* SECTION 1: Save Buttons */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={6}>
            {currentPaletteId ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  endIcon={<ArrowDropDownIcon />}
                  onClick={(e) => setSaveMenuAnchor(e.currentTarget)}
                  fullWidth
                  size="small"
                >
                  Update Palette
                </Button>
                <Menu
                  anchorEl={saveMenuAnchor}
                  open={Boolean(saveMenuAnchor)}
                  onClose={() => setSaveMenuAnchor(null)}
                >
                  <MenuItem onClick={handleUpdateExisting}>
                    <ListItemText primary="Update Palette" />
                  </MenuItem>
                  <MenuItem onClick={handleSaveAsNew}>
                    <ListItemText primary="Save As New" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleOpenSaveDialog}
                fullWidth
                size="small"
              >
                Save Palette
              </Button>
            )}
          </Grid>
          <Grid size={6}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={(e) => setExportMenuAnchor(e.currentTarget)}
              fullWidth
              size="small"
            >
              Export
            </Button>
            <Menu
              anchorEl={exportMenuAnchor}
              open={Boolean(exportMenuAnchor)}
              onClose={() => setExportMenuAnchor(null)}
            >
              <MenuItem onClick={() => handleExport("json")}>
                <ListItemIcon>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Export JSON"
                  secondary="Full palette data"
                />
              </MenuItem>
              <MenuItem onClick={() => handleExport("css")}>
                <ListItemIcon>
                  <CodeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Export CSS" secondary="CSS variables" />
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* SECTION 2: Contrast Picker */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Contrast Testing
          </Typography>
          <ContrastColorPicker
            value={contrastTargetColor}
            onChange={onContrastColorChange}
            hues={hues}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* SECTION 3: Palettes */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Palettes
          </Typography>

          <Tabs
            value={loadTab}
            onChange={(_, newValue) => setLoadTab(newValue)}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab label="Personal" value="my-palettes" />
            <Tab label="Public" value="public" />
            <Tab label="Presets" value="presets" />
          </Tabs>

          {loadTab !== "presets" && (
            <TextField
              placeholder="Search palettes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {loadingPalettes && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {loadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loadError}
            </Alert>
          )}

          {!loadingPalettes && (
            <List dense sx={{ maxHeight: 400, overflow: "auto" }}>
              {/* My Palettes Tab */}
              {loadTab === "my-palettes" &&
                filterPalettes(myPalettes).map((palette) => (
                  <ListItem
                    key={palette.id}
                    disablePadding
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={(e) => handleDeletePalette(palette.id, e)}
                        disabled={deletingId === palette.id}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      onClick={() =>
                        handleLoadPalette(
                          palette.palette_data,
                          palette.id,
                          palette.name,
                        )
                      }
                    >
                      <ListItemText
                        primary={palette.name}
                        secondary={
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            {palette.description && (
                              <Typography variant="caption" sx={{ mr: 1 }}>
                                {palette.description}
                              </Typography>
                            )}
                            {palette.is_public && (
                              <Chip
                                icon={<PublicIcon />}
                                label="Public"
                                size="small"
                                color="primary"
                              />
                            )}
                            {!palette.is_public && (
                              <Chip
                                icon={<LockIcon />}
                                label="Private"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        }
                        slotProps={{
                          secondary: { component: "div" },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}

              {/* Presets Tab */}
              {loadTab === "presets" &&
                PRESET_PALETTES.map((preset) => (
                  <ListItem key={preset.name} disablePadding>
                    <ListItemButton
                      onClick={() => handleLoadPalette(preset.data)}
                    >
                      <ListItemText
                        primary={preset.name}
                        secondary={
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            {preset.description && (
                              <Typography variant="caption" sx={{ mr: 1 }}>
                                {preset.description}
                              </Typography>
                            )}
                            <Chip
                              icon={<StarIcon />}
                              label="Preset"
                              size="small"
                              color="warning"
                            />
                          </Stack>
                        }
                        slotProps={{
                          secondary: { component: "div" },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}

              {/* Public Tab */}
              {loadTab === "public" &&
                filterPalettes(publicPalettes).map((palette) => (
                  <ListItem key={palette.id} disablePadding>
                    <ListItemButton
                      onClick={() =>
                        handleLoadPalette(
                          palette.palette_data,
                          palette.id,
                          palette.name,
                        )
                      }
                    >
                      <ListItemText
                        primary={palette.name}
                        secondary={
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            {palette.description && (
                              <Typography variant="caption" sx={{ mr: 1 }}>
                                {palette.description}
                              </Typography>
                            )}
                            {palette.author_name && (
                              <Chip
                                icon={<PersonIcon />}
                                label={palette.author_name}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        }
                        slotProps={{
                          secondary: { component: "div" },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          )}
        </Box>
      </Box>

      {/* Save Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={handleCloseSaveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentPaletteId ? "Update Palette" : "Save Palette"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {saveError && (
              <Alert severity="error" onClose={() => setSaveError(null)}>
                {saveError}
              </Alert>
            )}

            <TextField
              label="Palette Name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              fullWidth
              required
              autoFocus
              error={!!saveError && !saveName.trim()}
            />

            <TextField
              label="Description"
              value={saveDescription}
              onChange={(e) => setSaveDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={!canMakePublic}
                />
              }
              label="Make this palette public"
            />
            {!canMakePublic && (
              <Typography variant="caption" color="text.secondary">
                Only admins and designers can make palettes public
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaveDialog} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSave(saveName.endsWith("(Copy)"))}
            disabled={saving || !saveName.trim()}
            startIcon={saving && <CircularProgress size={16} />}
          >
            {saving
              ? "Saving..."
              : saveName.endsWith("(Copy)")
              ? "Save As New"
              : currentPaletteId
              ? "Update"
              : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
