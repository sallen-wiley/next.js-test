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

interface Publication {
  id: string;
  reviewer_id: string;
  title: string;
  doi: string | null;
  journal_name: string | null;
  authors: string[] | null;
  publication_date: string | null;
  is_related: boolean;
  created_at: string;
  reviewer_name?: string;
}

interface Reviewer {
  id: string;
  name: string;
  affiliation: string;
}

export default function PublicationsManager() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const { loading: permissionsLoading, permissions, profile } = useRoleAccess();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPublication, setSelectedPublication] =
    useState<Publication | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [formData, setFormData] = useState({
    reviewer_id: "",
    title: "",
    doi: "",
    journal_name: "",
    authors: [] as string[],
    publication_date: "",
  });

  const [authorInput, setAuthorInput] = useState("");

  const supabase = createClient();

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [publicationsRes, reviewersRes] = await Promise.all([
        supabase
          .from("reviewer_publications")
          .select("*")
          .order("publication_date", { ascending: false, nullsFirst: false }),
        supabase.from("potential_reviewers").select("id, name, affiliation"),
      ]);

      if (publicationsRes.error) throw publicationsRes.error;
      if (reviewersRes.error) throw reviewersRes.error;

      // Enrich publications with reviewer names
      const enrichedPublications = (publicationsRes.data || []).map((pub) => {
        const reviewer = reviewersRes.data?.find(
          (r) => r.id === pub.reviewer_id
        );
        return {
          ...pub,
          reviewer_name: reviewer?.name,
        };
      });

      setPublications(enrichedPublications);
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
  }, []);

  useEffect(() => {
    // Wait for permissions to finish loading before checking
    if (permissionsLoading) {
      return; // Still loading permissions, don't do anything
    }

    // Only load data if user has permission
    if (permissions.canViewReviewerData) {
      loadData();
    } else {
      // User doesn't have permission, stop loading
      setLoading(false);
    }
  }, [permissionsLoading, permissions.canViewReviewerData, loadData]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (publication?: Publication) => {
    if (publication) {
      setEditMode(true);
      setSelectedPublication(publication);
      setFormData({
        reviewer_id: publication.reviewer_id,
        title: publication.title,
        doi: publication.doi || "",
        journal_name: publication.journal_name || "",
        authors: publication.authors || [],
        publication_date: publication.publication_date || "",
      });
    } else {
      setEditMode(false);
      setSelectedPublication(null);
      setFormData({
        reviewer_id: "",
        title: "",
        doi: "",
        journal_name: "",
        authors: [],
        publication_date: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedPublication(null);
    setAuthorInput("");
  };

  const handleAddAuthor = () => {
    if (authorInput.trim()) {
      const newAuthors = authorInput
        .split(",")
        .map((author) => author.trim())
        .filter((author) => author.length > 0);

      setFormData({
        ...formData,
        authors: [...formData.authors, ...newAuthors],
      });
      setAuthorInput("");
    }
  };

  const handleRemoveAuthor = (index: number) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!formData.reviewer_id || !formData.title) {
      showSnackbar("Reviewer and title are required", "error");
      return;
    }

    try {
      const submitData = {
        reviewer_id: formData.reviewer_id,
        title: formData.title,
        doi: formData.doi || null,
        journal_name: formData.journal_name || null,
        authors: formData.authors.length > 0 ? formData.authors : null,
        publication_date: formData.publication_date || null,
      };

      if (editMode && selectedPublication) {
        const { error } = await supabase
          .from("reviewer_publications")
          .update(submitData)
          .eq("id", selectedPublication.id);

        if (error) throw error;
        showSnackbar("Publication updated successfully", "success");
      } else {
        const { error } = await supabase
          .from("reviewer_publications")
          .insert([submitData]);

        if (error) throw error;
        showSnackbar("Publication added successfully", "success");
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error("Error saving publication:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to save publication",
        "error"
      );
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("reviewer_publications")
        .delete()
        .eq("id", id);

      if (error) throw error;
      showSnackbar("Publication deleted successfully", "success");
      loadData();
    } catch (error) {
      console.error("Error deleting publication:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to delete publication",
        "error"
      );
    }
  };

  // Show different messages for permissions vs data loading
  if (permissionsLoading) {
    return <AdminLoadingState message="Checking permissions..." />;
  }
  if (loading) {
    return <AdminLoadingState message="Loading publications..." />;
  }

  return (
    <RoleGuard
      requiredPermission="canViewReviewerData"
      skipCheck={true}
      permissions={permissions}
      profile={profile}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Reviewer Publications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage reviewer publication history
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Publication
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Reviewer</TableCell>
                <TableCell>Journal</TableCell>
                <TableCell>Authors</TableCell>
                <TableCell>Publication Date</TableCell>
                <TableCell>DOI</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {publications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">
                      No publications found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                publications.map((pub) => (
                  <TableRow key={pub.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {pub.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{pub.reviewer_name || "Unknown"}</TableCell>
                    <TableCell>{pub.journal_name || "—"}</TableCell>
                    <TableCell>
                      {pub.authors && pub.authors.length > 0 ? (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {pub.authors.slice(0, 2).map((author, idx) => (
                            <Chip key={idx} label={author} size="small" />
                          ))}
                          {pub.authors.length > 2 && (
                            <Chip
                              label={`+${pub.authors.length - 2} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {pub.publication_date
                        ? new Date(pub.publication_date).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {pub.doi ? (
                        <Typography variant="caption">{pub.doi}</Typography>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(pub)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(pub.id, pub.title)}
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
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editMode ? "Edit Publication" : "Add New Publication"}
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

              <TextField
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                fullWidth
                multiline
                rows={2}
              />

              <TextField
                label="Journal Name"
                value={formData.journal_name}
                onChange={(e) =>
                  setFormData({ ...formData, journal_name: e.target.value })
                }
                fullWidth
              />

              <TextField
                label="DOI"
                value={formData.doi}
                onChange={(e) =>
                  setFormData({ ...formData, doi: e.target.value })
                }
                fullWidth
                helperText="e.g., 10.1234/example.doi"
              />

              <Box>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    label="Add Author"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAuthor();
                      }
                    }}
                    fullWidth
                    size="small"
                    helperText="Enter one or more authors separated by commas"
                  />
                  <Button onClick={handleAddAuthor} variant="outlined">
                    Add
                  </Button>
                </Stack>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {formData.authors.map((author, idx) => (
                    <Chip
                      key={idx}
                      label={author}
                      onDelete={() => handleRemoveAuthor(idx)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <TextField
                label="Publication Date"
                type="date"
                value={formData.publication_date}
                onChange={(e) =>
                  setFormData({ ...formData, publication_date: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editMode ? "Update" : "Add"} Publication
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
