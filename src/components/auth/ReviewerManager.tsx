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
} from "@/services";
import type { PotentialReviewer } from "@/lib/supabase";
import AdminLoadingState from "./AdminLoadingState";
import RoleGuard from "./RoleGuard";
import { useRoleAccess } from "@/hooks/useRoles";

const availabilityOptions = [
  { value: "available", label: "Available" },
  { value: "busy", label: "Busy" },
  { value: "unavailable", label: "Unavailable" },
  { value: "sabbatical", label: "Sabbatical" },
] as const;

export default function ReviewerManager() {
  const [reviewers, setReviewers] = React.useState<PotentialReviewer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { loading: permissionsLoading, permissions, profile } = useRoleAccess();
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

  // Form state - Complete schema fields
  const [formData, setFormData] = React.useState({
    // Basic Info
    name: "",
    email: "",
    affiliation: "",
    department: "",
    // Identity Fields
    external_id: "",
    pkg_id: "",
    given_names: "",
    surname: "",
    aff_ror_id: "",
    orcid_id: "",
    profile_url: "",
    reviewer_type: "",
    // Expertise
    expertise_areas: [] as string[],
    // Availability & Capacity
    current_review_load: 0,
    max_review_capacity: 3,
    average_review_time_days: 21,
    availability_status: "available" as
      | "available"
      | "busy"
      | "unavailable"
      | "sabbatical",
    // Metrics
    recent_publications: 0,
    h_index: undefined as number | undefined,
    last_review_completed: "" as string | undefined,
    is_board_member: false,
    previous_reviewer: false,
    has_publications_saved: false,
    // Review Statistics
    number_of_reviews: 0,
    completed_reviews: 0,
    currently_reviewing: 0,
    // Publication Statistics
    total_publications: undefined as number | undefined,
    citation_count: undefined as number | undefined,
    publication_year_from: undefined as number | undefined,
    publication_year_to: undefined as number | undefined,
    publication_count_last_year: undefined as number | undefined,
    last_publication_date: "" as string | undefined,
    // Invitation Statistics
    total_invitations: 0,
    total_acceptances: 0,
    total_completions: 0,
    average_response_time_hours: undefined as number | undefined,
    last_activity_date: "" as string | undefined,
  });

  const [expertiseInput, setExpertiseInput] = React.useState("");

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
    // Wait for permissions to finish loading before checking
    if (permissionsLoading) {
      return; // Still loading permissions, don't do anything
    }

    // Only load data if user has permission
    if (permissions.canViewReviewerData) {
      fetchReviewers();
    } else {
      // User doesn't have permission, stop loading
      setLoading(false);
    }
  }, [permissionsLoading, permissions.canViewReviewerData, fetchReviewers]);

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (reviewer?: PotentialReviewer) => {
    if (reviewer) {
      setEditMode(true);
      setSelectedReviewer(reviewer);
      const r = reviewer as unknown as Record<string, unknown>;
      setFormData({
        name: reviewer.name,
        email: reviewer.email,
        affiliation: reviewer.affiliation,
        department: reviewer.department || "",
        external_id: (r.external_id as string) || "",
        pkg_id: (r.pkg_id as string) || "",
        given_names: (r.given_names as string) || "",
        surname: (r.surname as string) || "",
        aff_ror_id: (r.aff_ror_id as string) || "",
        orcid_id: (r.orcid_id as string) || "",
        profile_url: (r.profile_url as string) || "",
        reviewer_type: (r.reviewer_type as string) || "",
        expertise_areas: reviewer.expertise_areas || [],
        current_review_load: reviewer.current_review_load,
        max_review_capacity: reviewer.max_review_capacity,
        average_review_time_days: reviewer.average_review_time_days,
        availability_status: reviewer.availability_status,
        recent_publications: reviewer.recent_publications,
        h_index: reviewer.h_index,
        last_review_completed: reviewer.last_review_completed ?? "",
        is_board_member: (r.is_board_member as boolean) || false,
        previous_reviewer: (r.previous_reviewer as boolean) || false,
        has_publications_saved: (r.has_publications_saved as boolean) || false,
        number_of_reviews: (r.number_of_reviews as number) || 0,
        completed_reviews: (r.completed_reviews as number) || 0,
        currently_reviewing: (r.currently_reviewing as number) || 0,
        total_publications: r.total_publications as number | undefined,
        citation_count: r.citation_count as number | undefined,
        publication_year_from: r.publication_year_from as number | undefined,
        publication_year_to: r.publication_year_to as number | undefined,
        publication_count_last_year: r.publication_count_last_year as
          | number
          | undefined,
        last_publication_date: (r.last_publication_date as string) ?? "",
        total_invitations: (r.total_invitations as number) || 0,
        total_acceptances: (r.total_acceptances as number) || 0,
        total_completions: (r.total_completions as number) || 0,
        average_response_time_hours: r.average_response_time_hours as
          | number
          | undefined,
        last_activity_date: (r.last_activity_date as string) ?? "",
      });
    } else {
      setEditMode(false);
      setSelectedReviewer(null);
      setFormData({
        name: "",
        email: "",
        affiliation: "",
        department: "",
        external_id: "",
        pkg_id: "",
        given_names: "",
        surname: "",
        aff_ror_id: "",
        orcid_id: "",
        profile_url: "",
        reviewer_type: "",
        expertise_areas: [],
        current_review_load: 0,
        max_review_capacity: 3,
        average_review_time_days: 21,
        availability_status: "available",
        recent_publications: 0,
        h_index: undefined,
        last_review_completed: "",
        is_board_member: false,
        previous_reviewer: false,
        has_publications_saved: false,
        number_of_reviews: 0,
        completed_reviews: 0,
        currently_reviewing: 0,
        total_publications: undefined,
        citation_count: undefined,
        publication_year_from: undefined,
        publication_year_to: undefined,
        publication_count_last_year: undefined,
        last_publication_date: "",
        total_invitations: 0,
        total_acceptances: 0,
        total_completions: 0,
        average_response_time_hours: undefined,
        last_activity_date: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setExpertiseInput("");
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

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.affiliation) {
      showSnackbar("Name, email, and affiliation are required", "error");
      return;
    }

    try {
      // Clean up formData to remove empty strings for UUID and date fields
      const cleanedData = {
        ...formData,
        // Convert empty strings to undefined for UUID fields
        external_id: formData.external_id || undefined,
        // Convert empty strings to undefined for date fields
        h_index: formData.h_index ?? undefined,
        last_review_completed: formData.last_review_completed || undefined,
        last_publication_date: formData.last_publication_date || undefined,
        last_activity_date: formData.last_activity_date || undefined,
        // Convert empty strings to undefined for optional numeric fields
        average_response_time_hours:
          formData.average_response_time_hours ?? undefined,
      };

      if (editMode && selectedReviewer) {
        await updateReviewer(selectedReviewer.id, cleanedData);
        showSnackbar("Reviewer updated successfully", "success");
      } else {
        await addReviewer(cleanedData);
        showSnackbar("Reviewer added successfully", "success");
      }
      handleCloseDialog();
      fetchReviewers();
    } catch (error) {
      console.error("Error saving reviewer:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to save reviewer",
        "error",
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
        "error",
      );
    }
  };

  const getStatusColor = (
    status: string,
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

  // Show different messages for permissions vs data loading
  if (permissionsLoading) {
    return <AdminLoadingState message="Checking permissions..." />;
  }
  if (loading) {
    return <AdminLoadingState message="Loading reviewers..." />;
  }

  return (
    <RoleGuard
      requiredPermission="canViewReviewerData"
      skipCheck={true}
      permissions={permissions}
      profile={profile}
    >
      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Reviewer Database
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage the pool of potential reviewers
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Reviewer
          </Button>
        </Stack>

        <Alert severity="info" sx={{ mb: 3 }}>
          Manage the pool of potential reviewers. This is separate from
          assigning reviewers to specific manuscripts.
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
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
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
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Given Names"
                        value={formData.given_names}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            given_names: e.target.value,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Surname"
                        value={formData.surname}
                        onChange={(e) =>
                          setFormData({ ...formData, surname: e.target.value })
                        }
                        fullWidth
                      />
                    </Stack>
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
                        setFormData({
                          ...formData,
                          affiliation: e.target.value,
                        })
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

              {/* Identity & External IDs */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Identity & External IDs
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="External ID"
                        value={formData.external_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            external_id: e.target.value,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="PKG ID"
                        value={formData.pkg_id}
                        onChange={(e) =>
                          setFormData({ ...formData, pkg_id: e.target.value })
                        }
                        fullWidth
                      />
                    </Stack>
                    <TextField
                      label="ORCID ID"
                      value={formData.orcid_id}
                      onChange={(e) =>
                        setFormData({ ...formData, orcid_id: e.target.value })
                      }
                      fullWidth
                      helperText="e.g., 0000-0002-1825-0097"
                    />
                    <TextField
                      label="ROR ID (Affiliation)"
                      value={formData.aff_ror_id}
                      onChange={(e) =>
                        setFormData({ ...formData, aff_ror_id: e.target.value })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Profile URL"
                      value={formData.profile_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile_url: e.target.value,
                        })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Reviewer Type"
                      value={formData.reviewer_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reviewer_type: e.target.value,
                        })
                      }
                      fullWidth
                      helperText="e.g., External, Editorial Board, Ad Hoc"
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Expertise */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
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
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
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

              {/* Status Flags */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Status & Flags
                  </Typography>
                  <Stack spacing={2}>
                    <FormControl component="fieldset">
                      <Stack direction="row" spacing={2}>
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.is_board_member}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                is_board_member: e.target.checked,
                              })
                            }
                          />
                          <Typography component="span" sx={{ ml: 1 }}>
                            Editorial Board Member
                          </Typography>
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.previous_reviewer}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                previous_reviewer: e.target.checked,
                              })
                            }
                          />
                          <Typography component="span" sx={{ ml: 1 }}>
                            Previous Reviewer
                          </Typography>
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.has_publications_saved}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                has_publications_saved: e.target.checked,
                              })
                            }
                          />
                          <Typography component="span" sx={{ ml: 1 }}>
                            Has Publications Saved
                          </Typography>
                        </label>
                      </Stack>
                    </FormControl>
                  </Stack>
                </CardContent>
              </Card>

              {/* Review Statistics */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Review Statistics
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Number of Reviews"
                        type="number"
                        value={formData.number_of_reviews}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            number_of_reviews: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Completed Reviews"
                        type="number"
                        value={formData.completed_reviews}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            completed_reviews: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Currently Reviewing"
                        type="number"
                        value={formData.currently_reviewing}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currently_reviewing: parseInt(e.target.value) || 0,
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

              {/* Publication Metrics */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Publication Metrics
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
                        label="Total Publications"
                        type="number"
                        value={formData.total_publications || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_publications: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                    </Stack>
                    <Stack direction="row" spacing={2}>
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
                      <TextField
                        label="Citation Count"
                        type="number"
                        value={formData.citation_count || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            citation_count: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Publication Year From"
                        type="number"
                        value={formData.publication_year_from || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            publication_year_from: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Publication Year To"
                        type="number"
                        value={formData.publication_year_to || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            publication_year_to: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Publications Last Year"
                        type="number"
                        value={formData.publication_count_last_year || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            publication_count_last_year: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Last Publication Date"
                        type="date"
                        value={formData.last_publication_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_publication_date: e.target.value || "",
                          })
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Invitation Statistics */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Invitation Statistics
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Total Invitations"
                        type="number"
                        value={formData.total_invitations}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_invitations: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Total Acceptances"
                        type="number"
                        value={formData.total_acceptances}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_acceptances: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Total Completions"
                        type="number"
                        value={formData.total_completions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_completions: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Avg Response Time (hours)"
                        type="number"
                        value={formData.average_response_time_hours || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            average_response_time_hours: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Last Activity Date"
                        type="date"
                        value={formData.last_activity_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_activity_date: e.target.value || "",
                          })
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Stack>
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
              This will fail if the reviewer has existing matches or
              invitations. Remove those first.
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
    </RoleGuard>
  );
}
