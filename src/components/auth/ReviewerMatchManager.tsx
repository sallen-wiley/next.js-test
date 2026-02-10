"use client";

import { useState, useEffect } from "react";
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
  Alert,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Slider,
  TextField,
  Stack,
  Autocomplete,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  getAllManuscripts,
  getAllReviewers,
  getAllReviewerMatches,
  addReviewerMatch,
  removeReviewerMatch,
} from "@/services";
import type { Manuscript, PotentialReviewer } from "@/lib/supabase";
import AdminLoadingState from "./AdminLoadingState";
import RoleGuard from "./RoleGuard";
import { useRoleAccess } from "@/hooks/useRoles";

interface ReviewerMatch {
  id: string;
  manuscript_id: string;
  reviewer_id: string;
  match_score: number;
  calculated_at: string;
  is_initial_suggestion: boolean;
  conflicts_of_interest: string | null;
  potential_reviewers: {
    name: string;
    email: string;
    affiliation: string;
    expertise_areas: string[];
  };
  manuscripts: {
    title: string;
    journal: string;
    subject_area: string;
    status: string;
  };
}

const getScoreColor = (score: number): "error" | "warning" | "success" => {
  if (score >= 0.8) return "success";
  if (score >= 0.6) return "warning";
  return "error";
};

const getScoreLabel = (score: number): string => {
  if (score >= 0.9) return "Excellent Match";
  if (score >= 0.8) return "Very Good Match";
  if (score >= 0.7) return "Good Match";
  if (score >= 0.6) return "Moderate Match";
  return "Low Match";
};

export default function ReviewerMatchManager() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [reviewers, setReviewers] = useState<PotentialReviewer[]>([]);
  const [matches, setMatches] = useState<ReviewerMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { loading: permissionsLoading, permissions, profile } = useRoleAccess();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedManuscriptId, setSelectedManuscriptId] = useState("");
  const [selectedReviewerId, setSelectedReviewerId] = useState("");
  const [matchScore, setMatchScore] = useState(0.75); // 0-1 scale
  const [isInitialSuggestion, setIsInitialSuggestion] = useState(false);
  const [conflictsOfInterest, setConflictsOfInterest] = useState("");
  const [editingMatch, setEditingMatch] = useState<ReviewerMatch | null>(null);

  useEffect(() => {
    // Wait for permissions to finish loading before checking
    if (permissionsLoading) {
      return; // Still loading permissions, don't do anything
    }

    // Only load data if user has permission
    if (permissions.canAssignReviewers) {
      loadData();
    } else {
      // User doesn't have permission, stop loading
      setLoading(false);
    }
  }, [permissionsLoading, permissions.canAssignReviewers]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [manuscriptsData, reviewersData, matchesData] = await Promise.all([
        getAllManuscripts(),
        getAllReviewers(),
        getAllReviewerMatches(),
      ]);

      setManuscripts(manuscriptsData);
      setReviewers(reviewersData);
      setMatches(matchesData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMatch = async () => {
    if (!selectedManuscriptId || !selectedReviewerId) {
      setError("Please select both a manuscript and a reviewer");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await addReviewerMatch(
        selectedManuscriptId,
        selectedReviewerId,
        matchScore, // Already in 0-1 scale
        isInitialSuggestion,
        conflictsOfInterest,
      );
      setSuccess(
        `Reviewer match added with score ${Math.round(
          matchScore * 100,
        )}%. This reviewer will now appear in the "Suggested Reviewers" tab.`,
      );
      setDialogOpen(false);
      setSelectedManuscriptId("");
      setSelectedReviewerId("");
      setMatchScore(0.75);
      setIsInitialSuggestion(false);
      setConflictsOfInterest("");
      await loadData();
    } catch (err: unknown) {
      console.error("Error adding match:", err);
      setError(err instanceof Error ? err.message : "Failed to add match");
    }
  };

  const handleRemoveMatch = async (
    matchId: string,
    reviewerName: string,
    manuscriptTitle: string,
  ) => {
    if (
      !confirm(
        `Are you sure you want to remove the match between ${reviewerName} and "${manuscriptTitle}"?`,
      )
    ) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await removeReviewerMatch(matchId);
      setSuccess("Reviewer match removed");
      await loadData();
    } catch (err: unknown) {
      console.error("Error removing match:", err);
      setError(err instanceof Error ? err.message : "Failed to remove match");
    }
  };

  const handleOpenEditDialog = (match: ReviewerMatch) => {
    setEditingMatch(match);
    setMatchScore(match.match_score);
    setIsInitialSuggestion(match.is_initial_suggestion);
    setConflictsOfInterest(match.conflicts_of_interest || "");
    setEditDialogOpen(true);
  };

  const handleUpdateScore = async () => {
    if (!editingMatch) return;

    setError(null);
    setSuccess(null);

    try {
      const { updateReviewerMatch } = await import("@/services");
      await updateReviewerMatch(
        editingMatch.id,
        matchScore,
        isInitialSuggestion,
        conflictsOfInterest,
      );
      setSuccess("Match updated successfully");
      setEditDialogOpen(false);
      setEditingMatch(null);
      await loadData();
    } catch (err: unknown) {
      console.error("Error updating match:", err);
      setError(err instanceof Error ? err.message : "Failed to update match");
    }
  };

  // Show different messages for permissions vs data loading
  if (permissionsLoading) {
    return <AdminLoadingState message="Checking permissions..." />;
  }
  if (loading) {
    return <AdminLoadingState message="Loading reviewer matches..." />;
  }

  return (
    <RoleGuard
      requiredPermission="canAssignReviewers"
      skipCheck={true}
      permissions={permissions}
      profile={profile}
    >
      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Reviewer-Manuscript Matches
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage which reviewers appear as suggestions for specific
              manuscripts
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add Match
          </Button>
        </Stack>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            onClose={() => setSuccess(null)}
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        </Snackbar>

        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Note:</strong> These matches control which reviewers appear in
          the &quot;Suggested Reviewers&quot; tab. Higher scores appear first in
          the list.
        </Alert>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reviewer</TableCell>
                <TableCell>Manuscript</TableCell>
                <TableCell>Journal</TableCell>
                <TableCell>Expertise Match</TableCell>
                <TableCell>Match Score</TableCell>
                <TableCell>Added</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      No reviewer matches found. Click &quot;Add Match&quot; to
                      create suggested reviewers.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {match.potential_reviewers.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {match.potential_reviewers.email}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {match.potential_reviewers.affiliation}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                        {match.manuscripts.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {match.manuscripts.journal}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ maxWidth: 200 }}>
                        {match.potential_reviewers.expertise_areas
                          .slice(0, 2)
                          .map((area, idx) => (
                            <Chip
                              key={idx}
                              label={area}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        {match.potential_reviewers.expertise_areas.length >
                          2 && (
                          <Typography variant="caption" color="text.secondary">
                            +
                            {match.potential_reviewers.expertise_areas.length -
                              2}{" "}
                            more
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 120 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="h6"
                            color={`${getScoreColor(match.match_score)}.main`}
                          >
                            {Math.round(match.match_score * 100)}%
                          </Typography>
                          <TrendingUpIcon
                            fontSize="small"
                            color={getScoreColor(match.match_score)}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={match.match_score * 100}
                          color={getScoreColor(match.match_score)}
                          sx={{ mb: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {getScoreLabel(match.match_score)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(match.calculated_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Score">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(match)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove Match">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleRemoveMatch(
                              match.id,
                              match.potential_reviewers.name,
                              match.manuscripts.title,
                            )
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{ mt: 2, p: 2, bgcolor: "background.default", borderRadius: 1 }}
        >
          <Typography variant="caption" color="text.secondary">
            <strong>Total Matches:</strong> {matches.length} reviewer-manuscript
            pairings
          </Typography>
        </Box>

        {/* Add Match Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Reviewer Match</DialogTitle>
          <DialogContent sx={{ overflowX: "hidden" }}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <Autocomplete
                options={manuscripts}
                getOptionLabel={(option) => option.title}
                value={
                  manuscripts.find((m) => m.id === selectedManuscriptId) || null
                }
                onChange={(_, newValue) =>
                  setSelectedManuscriptId(newValue?.id || "")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Manuscript"
                    placeholder="Search manuscripts..."
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Box>
                      <Typography variant="body2">{option.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.journal} • {option.status}
                      </Typography>
                    </Box>
                  </li>
                )}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Reviewer</InputLabel>
                <Select
                  value={selectedReviewerId}
                  onChange={(e) => setSelectedReviewerId(e.target.value)}
                  label="Reviewer"
                >
                  {reviewers.map((reviewer) => (
                    <MenuItem key={reviewer.id} value={reviewer.id}>
                      {reviewer.name} - {reviewer.affiliation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography gutterBottom>
                  Match Score: <strong>{Math.round(matchScore * 100)}%</strong>{" "}
                  ({getScoreLabel(matchScore)})
                </Typography>
                <Slider
                  value={Math.round(matchScore * 100)}
                  onChange={(_, value) =>
                    setMatchScore(Math.round(value as number) / 100)
                  }
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: "0%" },
                    { value: 50, label: "50%" },
                    { value: 100, label: "100%" },
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value)}%`}
                  color={getScoreColor(matchScore)}
                />
                <Typography variant="caption" color="text.secondary">
                  Higher scores appear first in suggested reviewers list
                </Typography>
              </Box>

              <Box>
                <FormControl component="fieldset">
                  <label>
                    <input
                      type="checkbox"
                      checked={isInitialSuggestion}
                      onChange={(e) => setIsInitialSuggestion(e.target.checked)}
                    />
                    <Typography component="span" sx={{ ml: 1 }}>
                      Mark as initial AI suggestion
                    </Typography>
                  </label>
                </FormControl>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mt: 1 }}
                >
                  Check this if this match was generated by AI/algorithm during
                  initial ingestion
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Conflicts of Interest (Optional)
                </Typography>
                <TextField
                  value={conflictsOfInterest}
                  onChange={(e) => setConflictsOfInterest(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Describe any known conflicts (e.g., co-authorship, institutional affiliation)"
                  helperText="Free-form text describing potential conflicts"
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddMatch}
              variant="contained"
              disabled={!selectedManuscriptId || !selectedReviewerId}
            >
              Add Match
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Score Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Match Score</DialogTitle>
          <DialogContent>
            {editingMatch && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Reviewer: {editingMatch.potential_reviewers.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Manuscript: {editingMatch.manuscripts.title}
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography gutterBottom>
                    Match Score:{" "}
                    <strong>{Math.round(matchScore * 100)}%</strong> (
                    {getScoreLabel(matchScore)})
                  </Typography>
                  <Slider
                    value={Math.round(matchScore * 100)}
                    onChange={(_, value) =>
                      setMatchScore(Math.round(value as number) / 100)
                    }
                    min={0}
                    max={100}
                    step={5}
                    marks={[
                      { value: 0, label: "0%" },
                      { value: 50, label: "50%" },
                      { value: 100, label: "100%" },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${Math.round(value)}%`}
                    color={getScoreColor(matchScore)}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Adjust the match quality score (0-100%)
                  </Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <FormControl component="fieldset">
                    <label>
                      <input
                        type="checkbox"
                        checked={isInitialSuggestion}
                        onChange={(e) =>
                          setIsInitialSuggestion(e.target.checked)
                        }
                      />
                      <Typography component="span" sx={{ ml: 1 }}>
                        Mark as initial AI suggestion
                      </Typography>
                    </label>
                  </FormControl>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Conflicts of Interest
                  </Typography>
                  <TextField
                    value={conflictsOfInterest}
                    onChange={(e) => setConflictsOfInterest(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Describe any known conflicts"
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateScore} variant="contained">
              Update Score
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </RoleGuard>
  );
}
