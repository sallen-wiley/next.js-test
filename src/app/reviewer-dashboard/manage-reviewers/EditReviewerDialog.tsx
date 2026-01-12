"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Stack,
  TextField,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Skeleton,
} from "@mui/material";
import { supabase } from "@/lib/supabase";
import type { PotentialReviewer } from "@/lib/supabase";
import type { ReviewerProfile, ManuscriptMatch } from "./profile-drawer/types";

interface EditReviewerDialogProps {
  open: boolean;
  onClose: () => void;
  reviewer: ReviewerProfile;
  manuscriptId?: string | null;
  onSave: (formData: Partial<PotentialReviewer>) => Promise<void>;
}

const availabilityOptions = [
  { value: "available", label: "Available" },
  { value: "busy", label: "Busy" },
  { value: "unavailable", label: "Unavailable" },
  { value: "sabbatical", label: "On Sabbatical" },
] as const;

export default function EditReviewerDialog({
  open,
  onClose,
  reviewer,
  manuscriptId,
  onSave,
}: EditReviewerDialogProps) {
  const [editDialogTab, setEditDialogTab] = React.useState(0);
  const [matchData, setMatchData] = React.useState<ManuscriptMatch | null>(
    null
  );
  const [matchLoading, setMatchLoading] = React.useState(false);
  const [expertiseInput, setExpertiseInput] = React.useState("");

  const [formData, setFormData] = React.useState<Partial<PotentialReviewer>>(
    {}
  );

  // Initialize form data when dialog opens
  React.useEffect(() => {
    if (open && reviewer) {
      setFormData({
        name: reviewer.name,
        email: reviewer.email,
        affiliation: reviewer.affiliation,
        department: reviewer.department || "",
        expertise_areas: reviewer.expertise_areas || [],
        current_review_load: reviewer.current_review_load || 0,
        max_review_capacity: reviewer.max_review_capacity || 3,
        average_review_time_days: reviewer.average_review_time_days || 21,
        availability_status: reviewer.availability_status || "available",
        recent_publications: reviewer.recent_publications || 0,
        h_index: reviewer.h_index,
        last_review_completed: reviewer.last_review_completed,
        is_board_member: reviewer.is_board_member || false,
        previous_reviewer: reviewer.previous_reviewer || false,
        has_publications_saved: reviewer.has_publications_saved || false,
        orcid_id: reviewer.orcid_id || "",
        profile_url: reviewer.profile_url || "",
        external_id: reviewer.external_id || "",
        pkg_id: reviewer.pkg_id || "",
        given_names: reviewer.given_names || "",
        surname: reviewer.surname || "",
        aff_ror_id: reviewer.aff_ror_id || "",
        reviewer_type: reviewer.reviewer_type || "",
        number_of_reviews: reviewer.number_of_reviews || 0,
        completed_reviews: reviewer.completed_reviews || 0,
        currently_reviewing: reviewer.currently_reviewing || 0,
        total_publications: reviewer.total_publications,
        citation_count: reviewer.citation_count,
        publication_year_from: reviewer.publication_year_from,
        publication_year_to: reviewer.publication_year_to,
        publication_count_last_year: reviewer.publication_count_last_year,
        last_publication_date: reviewer.last_publication_date,
        total_invitations: reviewer.total_invitations || 0,
        total_acceptances: reviewer.total_acceptances || 0,
        total_completions: reviewer.total_completions || 0,
        average_response_time_hours: reviewer.average_response_time_hours,
        last_activity_date: reviewer.last_activity_date,
      });
    }
  }, [open, reviewer]);

  // Fetch manuscript match data
  React.useEffect(() => {
    async function fetchMatchData() {
      if (!open || !reviewer || !manuscriptId) {
        setMatchData(null);
        return;
      }

      setMatchLoading(true);
      try {
        const { data, error } = await supabase
          .from("reviewer_manuscript_matches")
          .select("*")
          .eq("reviewer_id", reviewer.id)
          .eq("manuscript_id", manuscriptId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching match data:", error);
        }
        setMatchData(data || null);
      } catch (err) {
        console.error("Error fetching match data:", err);
      } finally {
        setMatchLoading(false);
      }
    }

    fetchMatchData();
  }, [open, reviewer, manuscriptId]);

  const handleAddExpertise = () => {
    if (
      expertiseInput.trim() &&
      !formData.expertise_areas?.includes(expertiseInput.trim())
    ) {
      setFormData({
        ...formData,
        expertise_areas: [
          ...(formData.expertise_areas || []),
          expertiseInput.trim(),
        ],
      });
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (index: number) => {
    setFormData({
      ...formData,
      expertise_areas: formData.expertise_areas?.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    await onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Reviewer</DialogTitle>
      <DialogContent>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={editDialogTab}
            onChange={(_, newValue) => setEditDialogTab(newValue)}
          >
            <Tab label="Reviewer Details" />
            <Tab label="Manuscript Match" disabled={!manuscriptId} />
          </Tabs>
        </Box>

        {/* Tab Panel: Reviewer Details */}
        {editDialogTab === 0 && (
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
                  {formData.expertise_areas?.map((area, idx) => (
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
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}

        {/* Tab Panel: Manuscript Match */}
        {editDialogTab === 1 && (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {matchLoading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : matchData ? (
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Match Score
                  </Typography>
                  <Typography variant="h3" color="primary.main">
                    {(matchData.match_score * 100).toFixed(0)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Calculated on{" "}
                    {new Date(matchData.calculated_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Typography>
                No match data available for this manuscript.
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
