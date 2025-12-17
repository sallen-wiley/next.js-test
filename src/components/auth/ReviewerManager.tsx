"use client";
import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Snackbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAllReviewers,
  addReviewer,
  updateReviewer,
  deleteReviewer,
} from "@/services/dataService";
import type { PotentialReviewer } from "@/lib/supabase";

const availabilityOptions = [
  { value: "available", label: "Available" },
  { value: "busy", label: "Busy" },
  { value: "unavailable", label: "Unavailable" },
  { value: "sabbatical", label: "Sabbatical" },
] as const;

export default function ReviewerManager() {
  const [reviewers, setReviewers] = React.useState<PotentialReviewer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [selectedReviewer, setSelectedReviewer] =
    React.useState<PotentialReviewer | null>(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    affiliation: "",
    department: "",
    expertise_areas: [] as string[],
    current_review_load: 0,
    max_review_capacity: 3,
    average_review_time_days: 21,
    recent_publications: 0,
    h_index: undefined as number | undefined,
    last_review_completed: "" as string | undefined,
    availability_status: "available" as
      | "available"
      | "busy"
      | "unavailable"
      | "sabbatical",
    conflicts_of_interest: [] as string[],
  });

  const [expertiseInput, setExpertiseInput] = React.useState("");
  const [conflictInput, setConflictInput] = React.useState("");

  const fetchReviewers = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllReviewers();
      setReviewers(data);
    } catch (error) {
      console.error("Error fetching reviewers:", error);
      showSnackbar("Failed to load reviewers", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchReviewers();
  }, [fetchReviewers]);

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" = "success"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (reviewer?: PotentialReviewer) => {
    if (reviewer) {
      setEditMode(true);
      setSelectedReviewer(reviewer);
      setFormData({
        name: reviewer.name,
        email: reviewer.email,
        affiliation: reviewer.affiliation,
        department: reviewer.department || "",
        expertise_areas: reviewer.expertise_areas || [],
        current_review_load: reviewer.current_review_load,
        max_review_capacity: reviewer.max_review_capacity,
        average_review_time_days: reviewer.average_review_time_days,
        recent_publications: reviewer.recent_publications,
        h_index: reviewer.h_index,
        last_review_completed: reviewer.last_review_completed ?? "",
        availability_status: reviewer.availability_status,
        conflicts_of_interest: reviewer.conflicts_of_interest || [],
      });
    } else {
      setEditMode(false);
      setSelectedReviewer(null);
      setFormData({
        name: "",
        email: "",
        affiliation: "",
        department: "",
        expertise_areas: [],
        current_review_load: 0,
        max_review_capacity: 3,
        average_review_time_days: 21,
        recent_publications: 0,
        h_index: undefined,
        last_review_completed: "",
        availability_status: "available",
        conflicts_of_interest: [],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setExpertiseInput("");
    setConflictInput("");
  };

  const handleAddExpertise = () => {
    if (expertiseInput.trim()) {
      setFormData({
        ...formData,
        expertise_areas: [...formData.expertise_areas, expertiseInput.trim()],
      });
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (index: number) => {
    setFormData({
      ...formData,
      expertise_areas: formData.expertise_areas.filter((_, i) => i !== index),
    });
  };

  const handleAddConflict = () => {
    if (conflictInput.trim()) {
      setFormData({
        ...formData,
        conflicts_of_interest: [
          ...formData.conflicts_of_interest,
          conflictInput.trim(),
        ],
      });
      setConflictInput("");
    }
  };

  const handleRemoveConflict = (index: number) => {
    setFormData({
      ...formData,
      conflicts_of_interest: formData.conflicts_of_interest.filter(
        (_, i) => i !== index
      ),
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.affiliation) {
      showSnackbar("Name, email, and affiliation are required", "error");
      return;
    }

    try {
      if (editMode && selectedReviewer) {
        await updateReviewer(selectedReviewer.id, {
          ...formData,
          h_index: formData.h_index ?? undefined,
          last_review_completed: formData.last_review_completed || undefined,
        });
        showSnackbar("Reviewer updated successfully", "success");
      } else {
        await addReviewer({
          ...formData,
          h_index: formData.h_index ?? undefined,
          last_review_completed: formData.last_review_completed || undefined,
        });
        showSnackbar("Reviewer added successfully", "success");
      }
      handleCloseDialog();
      fetchReviewers();
    } catch (error) {
      console.error("Error saving reviewer:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to save reviewer",
        "error"
      );
    }
  };

  const handleOpenDeleteDialog = (reviewer: PotentialReviewer) => {
    setSelectedReviewer(reviewer);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedReviewer) return;

    try {
      await deleteReviewer(selectedReviewer.id);
      showSnackbar("Reviewer deleted successfully", "success");
      setDeleteDialogOpen(false);
      fetchReviewers();
    } catch (error) {
      console.error("Error deleting reviewer:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to delete reviewer",
        "error"
      );
    }
  };

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case "available":
        return "success";
      case "busy":
        return "warning";
      case "unavailable":
      case "sabbatical":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return <Typography>Loading reviewers...</Typography>;
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Reviewer Database
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Reviewer
        </Button>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        Manage the pool of potential reviewers. This is separate from assigning
        reviewers to specific manuscripts.
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Affiliation</TableCell>
              <TableCell>Expertise</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Review Load</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewers.map((reviewer) => (
              <TableRow key={reviewer.id}>
                <TableCell>{reviewer.name}</TableCell>
                <TableCell>{reviewer.email}</TableCell>
                <TableCell>
                  {reviewer.affiliation}
                  {reviewer.department && (
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      {reviewer.department}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {reviewer.expertise_areas.slice(0, 2).map((area, idx) => (
                      <Chip
                        key={idx}
                        label={area}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 0.5 }}
                      />
                    ))}
                    {reviewer.expertise_areas.length > 2 && (
                      <Chip
                        label={`+${reviewer.expertise_areas.length - 2}`}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 0.5 }}
                      />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={reviewer.availability_status}
                    size="small"
                    color={getStatusColor(reviewer.availability_status)}
                  />
                </TableCell>
                <TableCell>
                  {reviewer.current_review_load} /{" "}
                  {reviewer.max_review_capacity}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(reviewer)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDeleteDialog(reviewer)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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
          {editMode ? "Edit Reviewer" : "Add New Reviewer"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Basic Information */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Basic Information
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    fullWidth
                  />
                  <TextField
                    label="Affiliation"
                    value={formData.affiliation}
                    onChange={(e) =>
                      setFormData({ ...formData, affiliation: e.target.value })
                    }
                    required
                    fullWidth
                  />
                  <TextField
                    label="Department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    fullWidth
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Expertise */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Expertise Areas
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    label="Add expertise area"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddExpertise()
                    }
                    size="small"
                    fullWidth
                  />
                  <Button onClick={handleAddExpertise} variant="outlined">
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {formData.expertise_areas.map((area, idx) => (
                    <Chip
                      key={idx}
                      label={area}
                      onDelete={() => handleRemoveExpertise(idx)}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Availability & Capacity */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Availability & Capacity
                </Typography>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Availability Status</InputLabel>
                    <Select
                      value={formData.availability_status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availability_status: e.target.value as
                            | "available"
                            | "busy"
                            | "unavailable"
                            | "sabbatical",
                        })
                      }
                      label="Availability Status"
                    >
                      {availabilityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Current Review Load"
                      type="number"
                      value={formData.current_review_load}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          current_review_load: parseInt(e.target.value) || 0,
                        })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Max Review Capacity"
                      type="number"
                      value={formData.max_review_capacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_review_capacity: parseInt(e.target.value) || 3,
                        })
                      }
                      fullWidth
                    />
                  </Stack>
                  <TextField
                    label="Average Review Time (days)"
                    type="number"
                    value={formData.average_review_time_days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        average_review_time_days:
                          parseInt(e.target.value) || 21,
                      })
                    }
                    fullWidth
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Metrics */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Performance Metrics
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Recent Publications"
                      type="number"
                      value={formData.recent_publications}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recent_publications: parseInt(e.target.value) || 0,
                        })
                      }
                      fullWidth
                    />
                    <TextField
                      label="H-Index"
                      type="number"
                      value={formData.h_index || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          h_index: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      fullWidth
                    />
                  </Stack>
                  <TextField
                    label="Last Review Completed"
                    type="date"
                    value={formData.last_review_completed || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        last_review_completed: e.target.value || "",
                      })
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Conflicts of Interest */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Conflicts of Interest
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    label="Add conflict (author name or manuscript ID)"
                    value={conflictInput}
                    onChange={(e) => setConflictInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddConflict()}
                    size="small"
                    fullWidth
                  />
                  <Button onClick={handleAddConflict} variant="outlined">
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {formData.conflicts_of_interest.map((conflict, idx) => (
                    <Chip
                      key={idx}
                      label={conflict}
                      onDelete={() => handleRemoveConflict(idx)}
                      color="warning"
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? "Update" : "Add"} Reviewer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Reviewer</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{selectedReviewer?.name}</strong>? This action cannot be
            undone.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This will fail if the reviewer has existing matches or invitations.
            Remove those first.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
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
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
