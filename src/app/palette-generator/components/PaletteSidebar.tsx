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
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import CodeIcon from "@mui/icons-material/Code";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRoleAccess } from "@/hooks/useRoles";
import {
  savePalette,
  listUserPalettes,
  listPublicPalettes,
  deletePalette,
} from "../services/paletteService";
import {
  listLocalDrafts,
  saveLocalDraft,
  renameLocalDraft,
  deleteLocalDraft,
  getLocalDraftById,
  type LocalPaletteDraft,
} from "../services/localDraftService";
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
  onExport: (format: ExportFormat) => void;
  libraryRefreshToken?: number;
}

type LoadTabValue = "my-palettes" | "presets" | "public";
type ExportFormat = "json" | "css";

const LOCAL_DRAFT_ID_PREFIX = "local:";

function toLocalPaletteId(draftId: string): string {
  return `${LOCAL_DRAFT_ID_PREFIX}${draftId}`;
}

function fromLocalPaletteId(paletteId: string | null): string | null {
  if (!paletteId || !paletteId.startsWith(LOCAL_DRAFT_ID_PREFIX)) {
    return null;
  }

  return paletteId.slice(LOCAL_DRAFT_ID_PREFIX.length);
}

function isLocalPaletteId(paletteId: string | null): boolean {
  return fromLocalPaletteId(paletteId) !== null;
}

export default function PaletteSidebar({
  hues,
  currentPaletteId,
  currentPaletteName,
  contrastTargetColor,
  onContrastColorChange,
  onSaveSuccess,
  onLoad,
  onExport,
  libraryRefreshToken,
}: PaletteSidebarProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = Boolean(user?.id);

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
  const [localDrafts, setLocalDrafts] = useState<LocalPaletteDraft[]>([]);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameDraftId, setRenameDraftId] = useState<string | null>(null);
  const [renameDraftName, setRenameDraftName] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);

  // Export section state
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [saveMenuAnchor, setSaveMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const localCurrentPaletteId = fromLocalPaletteId(currentPaletteId);
  const canUpdateExisting = isAuthenticated
    ? Boolean(currentPaletteId && !isLocalPaletteId(currentPaletteId))
    : Boolean(localCurrentPaletteId);

  const refreshLocalDrafts = React.useCallback(() => {
    setLocalDrafts(listLocalDrafts());
  }, []);

  // Sync save form with current palette
  useEffect(() => {
    if (saveDialogOpen) {
      return;
    }

    setSaveName(currentPaletteName || "");

    if (!isAuthenticated) {
      const draftId = fromLocalPaletteId(currentPaletteId);
      if (!draftId) {
        setSaveDescription("");
        return;
      }

      const existing = getLocalDraftById(draftId);
      setSaveDescription(existing?.description || "");
      return;
    }

    // Keep description reset for cloud saves unless explicitly changed in dialog.
    setSaveDescription("");
  }, [currentPaletteId, currentPaletteName, isAuthenticated, saveDialogOpen]);

  // Load palettes when tab changes
  useEffect(() => {
    const loadPalettes = async () => {
      if (authLoading) {
        return;
      }

      setLoadingPalettes(true);
      setLoadError(null);

      try {
        if (loadTab === "my-palettes") {
          if (isAuthenticated && user?.id) {
            const palettes = await listUserPalettes(user.id);
            setMyPalettes(palettes);
            setLocalDrafts([]);
          } else {
            refreshLocalDrafts();
            setMyPalettes([]);
          }
        } else if (loadTab === "public") {
          const palettes = await listPublicPalettes();
          setPublicPalettes(palettes);
        }
      } catch (err) {
        if (err instanceof Error) {
          setLoadError(
            loadTab === "my-palettes" && !isAuthenticated
              ? "Sign in to load account palettes."
              : err.message,
          );
        } else {
          setLoadError("Failed to load palettes");
        }
      } finally {
        setLoadingPalettes(false);
      }
    };

    loadPalettes();
  }, [
    authLoading,
    isAuthenticated,
    loadTab,
    refreshLocalDrafts,
    user?.id,
    libraryRefreshToken,
  ]);

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

  const filterLocalDraftsBySearch = (
    drafts: LocalPaletteDraft[],
  ): LocalPaletteDraft[] => {
    if (!searchTerm.trim()) return drafts;
    const term = searchTerm.toLowerCase();
    return drafts.filter(
      (draft) =>
        draft.name.toLowerCase().includes(term) ||
        draft.description?.toLowerCase().includes(term),
    );
  };

  const handleOpenSaveDialog = () => {
    if (!saveName.trim()) {
      setSaveName(currentPaletteName || "");
    }

    if (!isAuthenticated) {
      const draftId = fromLocalPaletteId(currentPaletteId);
      if (draftId) {
        const draft = getLocalDraftById(draftId);
        setSaveDescription(draft?.description || "");
      }
    }

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

    if (!isAuthenticated) {
      const draftId = fromLocalPaletteId(currentPaletteId);
      if (draftId) {
        const draft = getLocalDraftById(draftId);
        setSaveDescription(draft?.description || "");
      }
    }

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
      if (!isAuthenticated) {
        const localDraft = saveLocalDraft({
          name: saveName.trim(),
          description: saveDescription.trim() || undefined,
          paletteData: hues,
          draftId:
            !saveAsNew && localCurrentPaletteId
              ? localCurrentPaletteId
              : undefined,
        });

        refreshLocalDrafts();
        onSaveSuccess(toLocalPaletteId(localDraft.id), localDraft.name);
        handleCloseSaveDialog();
        return;
      }

      if (!user?.id) {
        setSaveError("Sign in to save this palette to your account.");
        return;
      }

      const cloudPaletteId =
        !saveAsNew && currentPaletteId && !isLocalPaletteId(currentPaletteId)
          ? currentPaletteId
          : undefined;

      const result = await savePalette(user.id, saveName.trim(), hues, {
        description: saveDescription.trim() || undefined,
        isPublic,
        paletteId: cloudPaletteId,
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
      if (!isAuthenticated) {
        const deleted = deleteLocalDraft(paletteId);
        if (!deleted) {
          throw new Error("Draft not found");
        }

        refreshLocalDrafts();

        if (currentPaletteId === toLocalPaletteId(paletteId)) {
          onSaveSuccess("", "");
        }

        return;
      }

      if (!user?.id) {
        throw new Error("Sign in to delete account palettes.");
      }

      await deletePalette(paletteId, user.id);
      setMyPalettes((prev) => prev.filter((p) => p.id !== paletteId));

      // Clear current palette if it was deleted
      if (currentPaletteId === paletteId) {
        onSaveSuccess("", "");
      }
    } catch (err) {
      if (err instanceof Error) {
        setLoadError(err.message);
      } else {
        setLoadError("Failed to delete palette");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenRenameDialog = (
    draft: LocalPaletteDraft,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();
    setRenameDraftId(draft.id);
    setRenameDraftName(draft.name);
    setRenameError(null);
    setRenameDialogOpen(true);
  };

  const handleConfirmRename = () => {
    if (!renameDraftId) {
      return;
    }

    try {
      const renamed = renameLocalDraft(renameDraftId, renameDraftName);
      refreshLocalDrafts();

      if (currentPaletteId === toLocalPaletteId(renameDraftId)) {
        onSaveSuccess(toLocalPaletteId(renamed.id), renamed.name);
      }

      setRenameDialogOpen(false);
      setRenameDraftId(null);
      setRenameDraftName("");
      setRenameError(null);
    } catch (err) {
      if (err instanceof Error) {
        setRenameError(err.message);
      } else {
        setRenameError("Failed to rename draft");
      }
    }
  };

  const handleCloseRenameDialog = () => {
    if (saving) {
      return;
    }

    setRenameDialogOpen(false);
    setRenameDraftId(null);
    setRenameDraftName("");
    setRenameError(null);
  };

  const handleExport = (format: ExportFormat) => {
    setExportMenuAnchor(null);
    onExport(format);
  };

  const filteredMyPalettes = filterPalettes(myPalettes);
  const filteredPublicPalettes = filterPalettes(publicPalettes);
  const filteredLocalDrafts = filterLocalDraftsBySearch(localDrafts);

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
            {canUpdateExisting ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  endIcon={<ArrowDropDownIcon />}
                  onClick={(e) => setSaveMenuAnchor(e.currentTarget)}
                  fullWidth
                  size="small"
                >
                  {isAuthenticated ? "Update Palette" : "Update Local Draft"}
                </Button>
                <Menu
                  anchorEl={saveMenuAnchor}
                  open={Boolean(saveMenuAnchor)}
                  onClose={() => setSaveMenuAnchor(null)}
                >
                  <MenuItem onClick={handleUpdateExisting}>
                    <ListItemText
                      primary={
                        isAuthenticated
                          ? "Update Palette"
                          : "Update Local Draft"
                      }
                    />
                  </MenuItem>
                  <MenuItem onClick={handleSaveAsNew}>
                    <ListItemText
                      primary={isAuthenticated ? "Save As New" : "Save Copy"}
                    />
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
                {isAuthenticated ? "Save Palette" : "Save Local Draft"}
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
            <Tab
              label={isAuthenticated ? "Personal" : "Local Drafts"}
              value="my-palettes"
            />
            <Tab label="Public" value="public" />
            <Tab label="Presets" value="presets" />
          </Tabs>

          {!isAuthenticated && loadTab === "my-palettes" && (
            <Alert
              severity="info"
              sx={{ mb: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => router.push("/auth/login")}
                >
                  Sign In
                </Button>
              }
            >
              Local drafts are saved only in this browser. Sign in to save and
              sync palettes to your account.
            </Alert>
          )}

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
                (isAuthenticated
                  ? filteredMyPalettes.map((palette) => (
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
                    ))
                  : filteredLocalDrafts.map((draft) => (
                      <ListItem
                        key={draft.id}
                        disablePadding
                        secondaryAction={
                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              edge="end"
                              onClick={(e) => handleOpenRenameDialog(draft, e)}
                              size="small"
                              aria-label="Rename local draft"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={(e) => handleDeletePalette(draft.id, e)}
                              disabled={deletingId === draft.id}
                              size="small"
                              aria-label="Delete local draft"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        }
                      >
                        <ListItemButton
                          onClick={() =>
                            handleLoadPalette(
                              draft.palette_data,
                              toLocalPaletteId(draft.id),
                              draft.name,
                            )
                          }
                        >
                          <ListItemText
                            primary={draft.name}
                            secondary={
                              <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                              >
                                {draft.description && (
                                  <Typography variant="caption" sx={{ mr: 1 }}>
                                    {draft.description}
                                  </Typography>
                                )}
                                <Chip
                                  icon={<SaveIcon />}
                                  label="Local"
                                  size="small"
                                  variant="outlined"
                                />
                              </Stack>
                            }
                            slotProps={{
                              secondary: { component: "div" },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    )))}

              {loadTab === "my-palettes" &&
                (isAuthenticated
                  ? filteredMyPalettes.length === 0
                  : filteredLocalDrafts.length === 0) && (
                  <ListItem>
                    <ListItemText
                      primary={
                        isAuthenticated
                          ? "No account palettes yet"
                          : "No local drafts yet"
                      }
                      secondary={
                        isAuthenticated
                          ? "Save your current palette to start your library."
                          : "Save a local draft to keep working without signing in."
                      }
                    />
                  </ListItem>
                )}

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
                filteredPublicPalettes.map((palette) => (
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

              {loadTab === "public" && filteredPublicPalettes.length === 0 && (
                <ListItem>
                  <ListItemText primary="No public palettes found" />
                </ListItem>
              )}

              {loadTab === "presets" && PRESET_PALETTES.length === 0 && (
                <ListItem>
                  <ListItemText primary="No presets available" />
                </ListItem>
              )}
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
          {canUpdateExisting
            ? isAuthenticated
              ? "Update Palette"
              : "Update Local Draft"
            : isAuthenticated
            ? "Save Palette"
            : "Save Local Draft"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {saveError && (
              <Alert severity="error" onClose={() => setSaveError(null)}>
                {saveError}
              </Alert>
            )}

            {!isAuthenticated && (
              <Alert
                severity="info"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => router.push("/auth/login")}
                  >
                    Sign In
                  </Button>
                }
              >
                This draft is saved only in this browser.
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
                  disabled={!canMakePublic || !isAuthenticated}
                />
              }
              label="Make this palette public"
            />
            {isAuthenticated && !canMakePublic && (
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
              ? isAuthenticated
                ? "Save As New"
                : "Save Copy"
              : canUpdateExisting
              ? "Update"
              : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={renameDialogOpen}
        onClose={handleCloseRenameDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Rename Local Draft</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {renameError && (
              <Alert severity="error" onClose={() => setRenameError(null)}>
                {renameError}
              </Alert>
            )}
            <TextField
              label="Draft Name"
              value={renameDraftName}
              onChange={(event) => setRenameDraftName(event.target.value)}
              fullWidth
              required
              autoFocus
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRenameDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmRename}
            disabled={!renameDraftName.trim()}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
