import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from "@mui/material";
import { savePalette } from "../services/paletteService";
import { supabase } from "@/lib/supabase";
import { useRoleAccess } from "@/hooks/useRoles";
import type { HueSet } from "../types";

interface PaletteSaveDialogProps {
  open: boolean;
  onClose: () => void;
  currentPalette: HueSet[];
  currentPaletteId?: string | null;
  currentPaletteName?: string | null;
  onSaveSuccess?: (paletteId: string, paletteName: string) => void;
}

export default function PaletteSaveDialog({
  open,
  onClose,
  currentPalette,
  currentPaletteId,
  currentPaletteName,
  onSaveSuccess,
}: PaletteSaveDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user has permission to make palettes public (admins and designers only)
  const { requiresRole } = useRoleAccess();
  const canMakePublic = requiresRole(["admin", "designer"]);

  const isEditingExisting = !!currentPaletteId;

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      // If editing existing, pre-fill with current name
      setName(currentPaletteName || "");
      setDescription("");
      setIsPublic(false);
      setError(null);
    }
  }, [open, currentPaletteName]);

  const handleSave = async (saveAsNew: boolean = false) => {
    if (!name.trim()) {
      setError("Palette name is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const result = await savePalette(user.id, name.trim(), currentPalette, {
        description: description.trim() || undefined,
        isPublic,
        paletteId:
          !saveAsNew && currentPaletteId ? currentPaletteId : undefined,
      });

      // Success - notify parent with palette ID and name
      onSaveSuccess?.(result.id, result.name);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save palette. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditingExisting ? `Update "${currentPaletteName}"` : "Save Palette"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {isEditingExisting && (
            <Alert severity="info">
              You are updating an existing palette. Use &ldquo;Save As
              New&rdquo; to create a copy instead.
            </Alert>
          )}

          <TextField
            label="Palette Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            autoFocus
            placeholder="My Color Palette"
            helperText="Choose a descriptive name for your palette"
            error={!!error && !name.trim()}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="Optional description of your palette's purpose or theme"
            helperText="Add context about how this palette should be used"
          />

          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={!canMakePublic}
                />
              }
              label={
                canMakePublic
                  ? "Make this palette public (visible to all users)"
                  : "Make this palette public (requires admin or designer role)"
              }
            />
            {!canMakePublic && (
              <Alert severity="info" sx={{ ml: 0 }}>
                Public palettes are shared in the community library. Only admins
                and designers can create public palettes. Your palette will be
                saved as private.
              </Alert>
            )}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        {isEditingExisting && (
          <Button
            onClick={() => handleSave(true)}
            variant="outlined"
            disabled={saving || !name.trim()}
            startIcon={saving ? <CircularProgress size={16} /> : undefined}
          >
            Save As New
          </Button>
        )}
        <Button
          onClick={() => handleSave(false)}
          variant="contained"
          disabled={saving || !name.trim()}
          startIcon={saving ? <CircularProgress size={16} /> : undefined}
        >
          {saving ? "Saving..." : isEditingExisting ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
