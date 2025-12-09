"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Checkbox,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Manuscript, ManuscriptTag } from "@/lib/supabase";
import type { UserProfile } from "@/types/roles";
import {
  getStatusOptions,
  getStatusLabel,
  getStatusColor,
} from "@/utils/manuscriptStatus";
import {
  getAllManuscripts,
  createManuscript,
  updateManuscript,
  deleteManuscript,
  getAllUsers,
} from "@/services/dataService";

interface FormData {
  title: string;
  authors: string[];
  journal: string;
  submission_date: string;
  doi?: string;
  abstract: string;
  keywords: string[];
  subject_area: string;
  status: Manuscript["status"];
  version?: number;
  manuscript_tags: ManuscriptTag[];
  editorIds: string[];
}

const emptyFormData: FormData = {
  title: "",
  authors: [],
  journal: "",
  submission_date: new Date().toISOString().split("T")[0],
  doi: undefined,
  abstract: "",
  keywords: [],
  subject_area: "",
  status: "submitted",
  version: 1,
  manuscript_tags: [],
  editorIds: [],
};

function toDateInputValue(value: string): string {
  // Ensure value is formatted as YYYY-MM-DD for date inputs
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split("T")[0];
}

export default function ManuscriptManager() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingManuscript, setEditingManuscript] = useState<Manuscript | null>(
    null
  );
  const [deletingManuscript, setDeletingManuscript] =
    useState<Manuscript | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Input states for chip arrays
  const [authorInput, setAuthorInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  // Available manuscript tags
  const allTags: ManuscriptTag[] = [
    "commissioned",
    "rescinded",
    "transparent peer review",
    "transferred",
    "apc edited",
  ];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [manuscriptsData, usersData] = await Promise.all([
        getAllManuscripts(),
        getAllUsers(),
      ]);
      setManuscripts(manuscriptsData);
      setUsers(usersData);
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
  }

  function handleOpenDialog(manuscript?: Manuscript) {
    if (manuscript) {
      setEditingManuscript(manuscript);
      setFormData({
        title: manuscript.title,
        authors: manuscript.authors,
        journal: manuscript.journal,
        submission_date: toDateInputValue(manuscript.submission_date),
        doi: manuscript.doi,
        abstract: manuscript.abstract,
        keywords: manuscript.keywords,
        subject_area: manuscript.subject_area,
        status: manuscript.status,
        version: manuscript.version || 1,
        manuscript_tags: manuscript.manuscript_tags || [],
        editorIds: manuscript.assignedEditorIds || [],
      });
    } else {
      setEditingManuscript(null);
      setFormData(emptyFormData);
    }
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    setDialogOpen(false);
    setEditingManuscript(null);
    setFormData(emptyFormData);
    setAuthorInput("");
    setKeywordInput("");
  }

  function handleOpenDeleteDialog(manuscript: Manuscript) {
    setDeletingManuscript(manuscript);
    setDeleteDialogOpen(true);
  }

  function handleCloseDeleteDialog() {
    setDeleteDialogOpen(false);
    setDeletingManuscript(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingManuscript) {
        // Update existing manuscript
        await updateManuscript(editingManuscript.id, formData);
        setSnackbar({
          open: true,
          message: "Manuscript updated successfully",
          severity: "success",
        });
      } else {
        // Create new manuscript
        await createManuscript(formData);
        setSnackbar({
          open: true,
          message: "Manuscript created successfully",
          severity: "success",
        });
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error("Error saving manuscript:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "Failed to save manuscript",
        severity: "error",
      });
    }
  }

  async function handleDelete() {
    if (!deletingManuscript) return;

    try {
      await deleteManuscript(deletingManuscript.id);
      setSnackbar({
        open: true,
        message: "Manuscript deleted successfully",
        severity: "success",
      });
      handleCloseDeleteDialog();
      loadData();
    } catch (error) {
      console.error("Error deleting manuscript:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete manuscript",
        severity: "error",
      });
    }
  }

  function handleAddAuthor() {
    if (authorInput.trim()) {
      // Split by comma and trim each author name
      const newAuthors = authorInput
        .split(",")
        .map((author) => author.trim())
        .filter((author) => author.length > 0);

      setFormData((prev) => ({
        ...prev,
        authors: [...prev.authors, ...newAuthors],
      }));
      setAuthorInput("");
    }
  }

  function handleDeleteAuthor(authorToDelete: string) {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((author) => author !== authorToDelete),
    }));
  }

  function handleAddKeyword() {
    if (keywordInput.trim()) {
      // Split by comma and trim each keyword
      const newKeywords = keywordInput
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);

      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, ...newKeywords],
      }));
      setKeywordInput("");
    }
  }

  function handleDeleteKeyword(keywordToDelete: string) {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((keyword) => keyword !== keywordToDelete),
    }));
  }
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading manuscripts...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Manuscript Database</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Manuscript
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Authors</TableCell>
              <TableCell>Journal</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Subject Area</TableCell>
              <TableCell>Editor</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manuscripts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography color="text.secondary">
                    No manuscripts found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              manuscripts.map((manuscript) => (
                <TableRow key={manuscript.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {manuscript.title}
                    </Typography>
                    {manuscript.doi && (
                      <Typography variant="caption" color="text.secondary">
                        DOI: {manuscript.doi}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        maxWidth: 200,
                      }}
                    >
                      {manuscript.authors.slice(0, 2).map((author, idx) => (
                        <Chip key={idx} label={author} size="small" />
                      ))}
                      {manuscript.authors.length > 2 && (
                        <Chip
                          label={`+${manuscript.authors.length - 2} more`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{manuscript.journal}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(manuscript.status)}
                      color={getStatusColor(manuscript.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        maxWidth: 200,
                      }}
                    >
                      {manuscript.manuscript_tags &&
                      manuscript.manuscript_tags.length > 0 ? (
                        manuscript.manuscript_tags.map((tag, idx) => (
                          <Chip
                            key={idx}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: "capitalize" }}
                          />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          None
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{manuscript.subject_area}</TableCell>
                  <TableCell>
                    {manuscript.assignedEditors &&
                    manuscript.assignedEditors.length > 0
                      ? manuscript.assignedEditors
                          .map((editor) => editor.full_name || editor.email)
                          .join(", ")
                      : "Unassigned"}
                  </TableCell>
                  <TableCell>
                    {new Date(manuscript.submission_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(manuscript)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDeleteDialog(manuscript)}
                      title="Delete"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
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
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingManuscript ? "Edit Manuscript" : "Add New Manuscript"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
            >
              <TextField
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                fullWidth
              />

              <Box>
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
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
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {formData.authors.map((author, idx) => (
                    <Chip
                      key={idx}
                      label={author}
                      onDelete={() => handleDeleteAuthor(author)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <TextField
                label="Journal"
                value={formData.journal}
                onChange={(e) =>
                  setFormData({ ...formData, journal: e.target.value })
                }
                required
                fullWidth
              />

              <TextField
                label="Subject Area"
                value={formData.subject_area}
                onChange={(e) =>
                  setFormData({ ...formData, subject_area: e.target.value })
                }
                required
                fullWidth
              />

              <TextField
                label="Abstract"
                value={formData.abstract}
                onChange={(e) =>
                  setFormData({ ...formData, abstract: e.target.value })
                }
                required
                multiline
                rows={4}
                fullWidth
              />

              <Box>
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    label="Add Keyword"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    fullWidth
                    size="small"
                    helperText="Enter one or more keywords separated by commas"
                  />
                  <Button onClick={handleAddKeyword} variant="outlined">
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {formData.keywords.map((keyword, idx) => (
                    <Chip
                      key={idx}
                      label={keyword}
                      onDelete={() => handleDeleteKeyword(keyword)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                >
                  {getStatusOptions().map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Manuscript Tags</InputLabel>
                <Select
                  multiple
                  value={formData.manuscript_tags}
                  label="Manuscript Tags"
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      manuscript_tags:
                        typeof value === "string"
                          ? (value.split(",") as ManuscriptTag[])
                          : (value as ManuscriptTag[]),
                    });
                  }}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>None</em>;
                    }
                    return selected
                      .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1))
                      .join(", ");
                  }}
                >
                  {allTags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      <Checkbox
                        checked={formData.manuscript_tags.indexOf(tag) > -1}
                        size="small"
                      />
                      <ListItemText
                        primary={tag.charAt(0).toUpperCase() + tag.slice(1)}
                        sx={{ textTransform: "capitalize" }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Version"
                type="number"
                value={formData.version || 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    version: parseInt(e.target.value) || 1,
                  })
                }
                required
                fullWidth
                inputProps={{ min: 1, step: 1 }}
                helperText="Manuscript version number (e.g., 1 for initial submission, 2 for first revision)"
              />

              <Autocomplete
                multiple
                options={users.filter((u) => u.role === "editor")}
                getOptionLabel={(option) => option.full_name || option.email}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.full_name || option.email}
                  </li>
                )}
                value={users.filter((u) => formData.editorIds.includes(u.id))}
                onChange={(_, newValue) => {
                  setFormData({
                    ...formData,
                    editorIds: newValue.map((u) => u.id),
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Academic Editors" />
                )}
              />

              <TextField
                label="Submission Date"
                type="date"
                value={formData.submission_date}
                onChange={(e) =>
                  setFormData({ ...formData, submission_date: e.target.value })
                }
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="DOI (Optional)"
                value={formData.doi || ""}
                onChange={(e) =>
                  setFormData({ ...formData, doi: e.target.value || undefined })
                }
                fullWidth
                placeholder="10.1000/example.doi"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingManuscript ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the manuscript &quot;
            {deletingManuscript?.title}&quot;?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. The manuscript must not have any
            existing matches, invitations, or assignments.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
