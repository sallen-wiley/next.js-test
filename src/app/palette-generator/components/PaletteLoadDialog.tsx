import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Tabs,
  Tab,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import {
  listUserPalettes,
  listPublicPalettes,
  deletePalette,
} from "../services/paletteService";
import { supabase } from "@/lib/supabase";
import { PRESET_PALETTES } from "../presets";
import type { UserPalette, UserPaletteWithAuthor } from "@/lib/supabase";
import type { HueSet } from "../types";

interface PaletteLoadDialogProps {
  open: boolean;
  onClose: () => void;
  onLoad: (palette: HueSet[], paletteId?: string, paletteName?: string) => void;
}

type TabValue = "my-palettes" | "presets" | "public";

export default function PaletteLoadDialog({
  open,
  onClose,
  onLoad,
}: PaletteLoadDialogProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("my-palettes");
  const [myPalettes, setMyPalettes] = useState<UserPalette[]>([]);
  const [publicPalettes, setPublicPalettes] = useState<UserPaletteWithAuthor[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    paletteId: string | null;
    paletteName: string | null;
  }>({ open: false, paletteId: null, paletteName: null });

  // Load palettes when dialog opens or tab changes
  useEffect(() => {
    if (!open) return;

    const loadPalettes = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeTab === "my-palettes") {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user?.id) {
            throw new Error("User not authenticated");
          }
          const palettes = await listUserPalettes(user.id);
          setMyPalettes(palettes);
        } else if (activeTab === "public") {
          const palettes = await listPublicPalettes();
          setPublicPalettes(palettes);
        }
        // Presets are static, no loading needed
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load palettes. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPalettes();
  }, [open, activeTab]);

  // Filter palettes based on search term
  const filterPalettes = <T extends UserPalette | UserPaletteWithAuthor>(
    palettes: T[]
  ): T[] => {
    if (!searchTerm.trim()) return palettes;
    const term = searchTerm.toLowerCase();
    return palettes.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        ("author_name" in p && p.author_name?.toLowerCase().includes(term))
    );
  };

  const handleLoadPalette = (
    paletteData: HueSet[] | undefined,
    paletteId?: string,
    paletteName?: string
  ) => {
    if (!paletteData || !Array.isArray(paletteData)) {
      console.error("Invalid palette data:", paletteData);
      setError("Failed to load palette: Invalid data format");
      return;
    }
    onLoad(paletteData, paletteId, paletteName);
    onClose();
  };

  const handleDeletePalette = async (
    paletteId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent triggering the load action

    // Find the palette name for the confirmation dialog
    const palette = myPalettes.find((p) => p.id === paletteId);
    setConfirmDelete({
      open: true,
      paletteId,
      paletteName: palette?.name || "this palette",
    });
  };

  const handleConfirmDelete = async () => {
    const paletteId = confirmDelete.paletteId;
    if (!paletteId) return;

    setDeletingId(paletteId);
    setError(null);
    setConfirmDelete({ open: false, paletteId: null, paletteName: null });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      await deletePalette(paletteId, user.id);

      // Remove from local state
      setMyPalettes((prev) => prev.filter((p) => p.id !== paletteId));

      // Also remove from public palettes if it was there
      setPublicPalettes((prev) => prev.filter((p) => p.id !== paletteId));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete palette. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, paletteId: null, paletteName: null });
  };

  const renderPaletteList = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    let palettes: UserPalette[] = [];
    let emptyMessage = "";

    if (activeTab === "my-palettes") {
      palettes = filterPalettes(myPalettes);
      emptyMessage = searchTerm
        ? "No palettes found matching your search"
        : "You haven't saved any palettes yet. Create one and click Save to get started!";
    } else if (activeTab === "public") {
      palettes = filterPalettes(publicPalettes);
      emptyMessage = searchTerm
        ? "No public palettes found matching your search"
        : "No public palettes available yet";
    }

    // Render presets tab
    if (activeTab === "presets") {
      const filteredPresets = PRESET_PALETTES.filter((preset) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
          preset.name.toLowerCase().includes(term) ||
          preset.description.toLowerCase().includes(term)
        );
      });

      if (filteredPresets.length === 0) {
        return (
          <Typography color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
            No presets found matching your search
          </Typography>
        );
      }

      return (
        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {filteredPresets.map((preset) => (
            <ListItem key={preset.name} disablePadding>
              <ListItemButton onClick={() => handleLoadPalette(preset.data)}>
                <ListItemText
                  primary={
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="body1">{preset.name}</Typography>
                      <Chip
                        icon={<StarIcon />}
                        label="Preset"
                        size="small"
                        color="warning"
                      />
                    </Stack>
                  }
                  secondary={
                    <>
                      {preset.description && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5, display: "block" }}
                        >
                          {preset.description}
                        </Typography>
                      )}
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.disabled"
                        sx={{ display: "block" }}
                      >
                        {preset.data.length}{" "}
                        {preset.data.length === 1 ? "hue" : "hues"}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      );
    }

    // Render database palettes (my-palettes or public)
    if (palettes.length === 0) {
      return (
        <Typography color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
          {emptyMessage}
        </Typography>
      );
    }

    return (
      <List sx={{ maxHeight: 400, overflow: "auto" }}>
        {palettes.map((palette) => {
          const paletteWithAuthor = palette as UserPaletteWithAuthor;
          const authorName = paletteWithAuthor.author_name;

          return (
            <ListItem
              key={palette.id}
              disablePadding
              secondaryAction={
                activeTab === "my-palettes" ? (
                  <Tooltip title="Delete palette">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => handleDeletePalette(palette.id, e)}
                      disabled={deletingId === palette.id}
                      color="error"
                    >
                      {deletingId === palette.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                ) : undefined
              }
            >
              <ListItemButton
                onClick={() =>
                  handleLoadPalette(
                    palette.palette_data,
                    palette.id,
                    palette.name
                  )
                }
              >
                <ListItemText
                  primary={
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="body1">{palette.name}</Typography>
                      {palette.is_public && (
                        <Chip
                          icon={<PublicIcon />}
                          label="Public"
                          size="small"
                          color="info"
                        />
                      )}
                      {!palette.is_public && activeTab === "my-palettes" && (
                        <Chip
                          icon={<LockIcon />}
                          label="Private"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  }
                  secondary={
                    <>
                      {palette.description && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5, display: "block" }}
                        >
                          {palette.description}
                        </Typography>
                      )}
                      <Stack
                        component="span"
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                      >
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.disabled"
                        >
                          {palette.palette_data.length}{" "}
                          {palette.palette_data.length === 1 ? "hue" : "hues"} •
                          Updated{" "}
                          {new Date(palette.updated_at).toLocaleDateString()}
                        </Typography>
                        {authorName && (
                          <>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.disabled"
                            >
                              •
                            </Typography>
                            <PersonIcon
                              sx={{ fontSize: 14, color: "text.disabled" }}
                            />
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.disabled"
                            >
                              {authorName}
                            </Typography>
                          </>
                        )}
                      </Stack>
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Load Palette</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
            >
              <Tab label="My Palettes" value="my-palettes" />
              <Tab label="Presets" value="presets" />
              <Tab label="Public Library" value="public" />
            </Tabs>

            <TextField
              placeholder={`Search ${
                activeTab === "my-palettes"
                  ? "your palettes"
                  : activeTab === "presets"
                  ? "presets"
                  : "public library"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ minHeight: 200 }}>{renderPaletteList()}</Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete.open}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Palette?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{confirmDelete.paletteName}</strong>? This action cannot be
            undone.
          </Typography>
          {confirmDelete.paletteId &&
            publicPalettes.some(
              (p) => p.id === confirmDelete.paletteId && p.is_public
            ) && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                This palette is currently public and will be removed from the
                public library.
              </Alert>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
