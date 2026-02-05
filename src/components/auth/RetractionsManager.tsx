"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  TextField,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { createClient } from "@/utils/supabase/client";
import AdminLoadingState from "./AdminLoadingState";
import RoleGuard from "./RoleGuard";
import { useRoleAccess } from "@/hooks/useRoles";

interface Retraction {
  id: string;
  reviewer_id: string;
  retraction_reasons: string[] | null;
  created_at: string;
  reviewer_name?: string;
}

interface Reviewer {
  id: string;
  name: string;
  affiliation: string;
}

export default function RetractionsManager() {
  const [retractions, setRetractions] = useState<Retraction[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const { loading: permissionsLoading, permissions, profile } = useRoleAccess();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRetraction, setSelectedRetraction] =
    useState<Retraction | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [formData, setFormData] = useState({
    reviewer_id: "",
    retraction_reasons: [] as string[],
  });

  const [reasonInput, setReasonInput] = useState("");

  const supabase = createClient();

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [retractionsRes, reviewersRes] = await Promise.all([
        supabase
          .from("reviewer_retractions")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("potential_reviewers").select("id, name, affiliation"),
      ]);

      if (retractionsRes.error) throw retractionsRes.error;
      if (reviewersRes.error) throw reviewersRes.error;

      // Enrich retractions with reviewer names
      const enrichedRetractions = (retractionsRes.data || []).map((ret) => {
        const reviewer = reviewersRes.data?.find(
          (r) => r.id === ret.reviewer_id,
        );
        return {
          ...ret,
          reviewer_name: reviewer?.name,
        };
      });

      setRetractions(enrichedRetractions);
      setReviewers(reviewersRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setSnackbar({
        open: true,
        message: "Failed to load data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    // Wait for permissions to finish loading before checking
    if (permissionsLoading) {
      return; // Still loading permissions, don't do anything
    }

    // Only load data if user has permission
    if (permissions.canManageUsers) {
      loadData();
    } else {
      // User doesn't have permission, stop loading
      setLoading(false);
    }
  }, [permissionsLoading, permissions.canManageUsers, loadData]);

  const handleOpenDialog = (retraction?: Retraction) => {
    if (retraction) {
      setEditMode(true);
      setSelectedRetraction(retraction);
      setFormData({
        reviewer_id: retraction.reviewer_id,
        retraction_reasons: retraction.retraction_reasons || [],
      });
    } else {
      setEditMode(false);
      setSelectedRetraction(null);
      setFormData({
        reviewer_id: "",
        retraction_reasons: [],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedRetraction(null);
    setReasonInput("");
  };

  const handleAddReason = () => {
    if (reasonInput.trim()) {
      const newReasons = reasonInput
        .split(",")
        .map((reason) => reason.trim())
        .filter((reason) => reason.length > 0);

      setFormData({
        ...formData,
        retraction_reasons: [...formData.retraction_reasons, ...newReasons],
      });
      setReasonInput("");
    }
  };

  const handleRemoveReason = (index: number) => {
    setFormData({
      ...formData,
      retraction_reasons: formData.retraction_reasons.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const handleSubmit = async () => {
    if (!formData.reviewer_id) {
      showSnackbar("Reviewer is required", "error");
      return;
    }

    try {
      const submitData = {
        reviewer_id: formData.reviewer_id,
        retraction_reasons:
          formData.retraction_reasons.length > 0
            ? formData.retraction_reasons
            : null,
      };

      if (editMode && selectedRetraction) {
        const { error } = await supabase
          .from("reviewer_retractions")
          .update(submitData)
          .eq("id", selectedRetraction.id);

        if (error) throw error;
        showSnackbar("Retraction updated successfully", "success");
      } else {
        const { error } = await supabase
          .from("reviewer_retractions")
          .insert([submitData]);

        if (error) throw error;
        showSnackbar("Retraction added successfully", "success");
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error("Error saving retraction:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to save retraction",
        "error",
      );
    }
  };

  const handleDelete = async (id: string, reviewerName?: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the retraction for ${
          reviewerName || "this reviewer"
        }?`,
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("reviewer_retractions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      showSnackbar("Retraction deleted successfully", "success");
      loadData();
    } catch (error) {
      console.error("Error deleting retraction:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to delete retraction",
        "error",
      );
    }
  };

  // Show different messages for permissions vs data loading
  if (permissionsLoading) {
    return <AdminLoadingState message="Checking permissions..." />;
  }
  if (loading) {
    return <AdminLoadingState message="Loading retractions..." />;
  }

  return (
    <RoleGuard
      requiredPermission="canManageUsers"
      skipCheck={true}
      permissions={permissions}
      profile={profile}
    >
      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Reviewer Retractions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track retractions associated with reviewers
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Retraction
          </Button>
        </Stack>

        {retractions.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No retractions recorded. This table tracks reviewers with retraction
            history.
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reviewer</TableCell>
                <TableCell>Retraction Reasons</TableCell>
                <TableCell>Recorded Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {retractions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary">
                      No retractions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                retractions.map((retraction) => (
                  <TableRow key={retraction.id}>
                    <TableCell>
                      {retraction.reviewer_name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {retraction.retraction_reasons &&
                      retraction.retraction_reasons.length > 0 ? (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {retraction.retraction_reasons.map((reason, idx) => (
                            <Chip
                              key={idx}
                              label={reason}
                              size="small"
                              color="warning"
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No reasons specified
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(retraction.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(retraction)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDelete(retraction.id, retraction.reviewer_name)
                        }
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editMode ? "Edit Retraction" : "Add New Retraction"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Reviewer</InputLabel>
                <Select
                  value={formData.reviewer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewer_id: e.target.value })
                  }
                  label="Reviewer"
                  disabled={editMode}
                >
                  {reviewers.map((reviewer) => (
                    <MenuItem key={reviewer.id} value={reviewer.id}>
                      {reviewer.name} ({reviewer.affiliation})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Retraction Reasons
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    label="Add reason"
                    value={reasonInput}
                    onChange={(e) => setReasonInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddReason();
                      }
                    }}
                    fullWidth
                    size="small"
                    helperText="Enter one or more reasons separated by commas"
                  />
                  <Button onClick={handleAddReason} variant="outlined">
                    Add
                  </Button>
                </Stack>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {formData.retraction_reasons.map((reason, idx) => (
                    <Chip
                      key={idx}
                      label={reason}
                      onDelete={() => handleRemoveReason(idx)}
                      size="small"
                      color="warning"
                    />
                  ))}
                </Box>
              </Box>

              <Alert severity="warning">
                Retractions are serious records. Ensure accuracy before saving.
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="warning">
              {editMode ? "Update" : "Add"} Retraction
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </RoleGuard>
  );
}
