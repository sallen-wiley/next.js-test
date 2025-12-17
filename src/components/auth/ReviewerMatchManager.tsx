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
  CircularProgress,
  LinearProgress,
  Slider,
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
  updateReviewerMatchScore,
  removeReviewerMatch,
} from "@/services/dataService";
import type { Manuscript, PotentialReviewer } from "@/lib/supabase";

interface ReviewerMatch {
  id: string;
  manuscript_id: string;
  reviewer_id: string;
  match_score: number;
  calculated_at: string;
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

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedManuscriptId, setSelectedManuscriptId] = useState("");
  const [selectedReviewerId, setSelectedReviewerId] = useState("");
  const [matchScore, setMatchScore] = useState(0.75);
  const [editingMatch, setEditingMatch] = useState<ReviewerMatch | null>(null);

  useEffect(() => {
    loadData();
  }, []);

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
        matchScore
      );
      setSuccess(
        `Reviewer match added with score ${matchScore}. This reviewer will now appear in the "Suggested Reviewers" tab.`
      );
      setDialogOpen(false);
      setSelectedManuscriptId("");
      setSelectedReviewerId("");
      setMatchScore(0.75);
      await loadData();
    } catch (err: unknown) {
      console.error("Error adding match:", err);
      setError(err instanceof Error ? err.message : "Failed to add match");
    }
  };

  const handleRemoveMatch = async (
    matchId: string,
    reviewerName: string,
    manuscriptTitle: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to remove the match between ${reviewerName} and "${manuscriptTitle}"?`
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
    setEditDialogOpen(true);
  };

  const handleUpdateScore = async () => {
    if (!editingMatch) return;

    setError(null);
    setSuccess(null);

    try {
      await updateReviewerMatchScore(editingMatch.id, matchScore);
      setSuccess("Match score updated successfully");
      setEditDialogOpen(false);
      setEditingMatch(null);
      await loadData();
    } catch (err: unknown) {
      console.error("Error updating score:", err);
      setError(err instanceof Error ? err.message : "Failed to update score");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              Reviewer-Manuscript Match Suggestions
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
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Note:</strong> These matches control which reviewers appear in
          the &quot;Suggested Reviewers&quot; tab. Higher scores appear first in
          the list.
        </Alert>

        <TableContainer>
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
                              match.manuscripts.title
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
      </Paper>

      {/* Add Match Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Reviewer Match</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Manuscript</InputLabel>
              <Select
                value={selectedManuscriptId}
                onChange={(e) => setSelectedManuscriptId(e.target.value)}
                label="Manuscript"
              >
                {manuscripts.map((manuscript) => (
                  <MenuItem key={manuscript.id} value={manuscript.id}>
                    {manuscript.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                Match Score: <strong>{matchScore}</strong>
              </Typography>
              <Slider
                value={matchScore}
                onChange={(_, value) => setMatchScore(value as number)}
                min={0}
                max={100}
                step={5}
                marks={[
                  { value: 0, label: "0" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" },
                ]}
                valueLabelDisplay="auto"
              />
              <Typography variant="caption" color="text.secondary">
                Higher scores appear first in suggested reviewers list
              </Typography>
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
                  Match Score: <strong>{Math.round(matchScore * 100)}%</strong>{" "}
                  ({getScoreLabel(matchScore)})
                </Typography>
                <Slider
                  value={matchScore * 100}
                  onChange={(_, value) =>
                    setMatchScore((value as number) / 100)
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
                  valueLabelFormat={(value) => `${value}%`}
                  color={getScoreColor(matchScore)}
                />
                <Typography variant="caption" color="text.secondary">
                  Adjust the match quality score (0-100%)
                </Typography>
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
  );
}
