import * as React from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Skeleton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import QueueIcon from "@mui/icons-material/Queue";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// Removed unused Star icon
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { PotentialReviewerWithMatch } from "@/lib/supabase";

interface ReviewerSearchAndTableProps {
  filteredReviewers: PotentialReviewerWithMatch[];
  selectedReviewers: string[];
  searchTerm: string;
  sortBy: string;
  filterAvailability: string[];
  loading: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onAvailabilityChange: (value: string[]) => void;
  onReviewerSelect: (reviewerId: string) => void;
  onInviteReviewer: (reviewerId: string) => void;
  onAddToQueue: (reviewerId: string) => void;
  onBatchInvite: () => void;
  onBatchAddToQueue: () => void;
  onClearFilters: () => void;
  onViewProfile: (reviewerId: string) => void;
}

const getAvailabilityColor = (status: string) => {
  switch (status) {
    case "available":
      return "success";
    case "busy":
      return "warning";
    case "unavailable":
      return "error";
    case "sabbatical":
      return "info";
    default:
      return "default";
  }
};

// Helper function to check if reviewer has conflicts
const hasConflicts = (conflicts: string | string[] | undefined) => {
  if (!conflicts) return false;
  if (typeof conflicts === "string") return conflicts.trim().length > 0;
  return conflicts.length > 0;
};

// Helper function to display conflicts
const getConflictsDisplay = (conflicts: string | string[] | undefined) => {
  if (!conflicts) return "";
  if (typeof conflicts === "string") return conflicts;
  return conflicts.join(", ");
};

export function ReviewerSearchAndTable({
  filteredReviewers,
  selectedReviewers,
  searchTerm,
  sortBy,
  filterAvailability,
  loading,
  onSearchChange,
  onSortChange,
  onAvailabilityChange,
  onReviewerSelect,
  onInviteReviewer,
  onAddToQueue,
  onBatchInvite,
  onBatchAddToQueue,
  onClearFilters,
  onViewProfile,
}: ReviewerSearchAndTableProps) {
  return (
    <>
      {/* Search & Filter Reviewers */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterListIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Search & Filter Reviewers
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Showing reviewers with AI-generated match scores for this manuscript.
          Use search to browse all reviewers in the database.
        </Alert>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Search reviewers"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Name, affiliation, expertise..."
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => onSortChange(e.target.value)}
              >
                <MenuItem value="match_score">Match Score</MenuItem>
                <MenuItem value="current_load">Current Load</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Availability</InputLabel>
              <Select
                multiple
                value={filterAvailability}
                label="Availability"
                onChange={(e) =>
                  onAvailabilityChange(e.target.value as string[])
                }
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="busy">Busy</MenuItem>
                <MenuItem value="unavailable">Unavailable</MenuItem>
                <MenuItem value="sabbatical">Sabbatical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                disabled={selectedReviewers.length === 0}
                startIcon={<MailOutlineIcon />}
                onClick={onBatchInvite}
              >
                Invite Selected ({selectedReviewers.length})
              </Button>
              <Button
                variant="outlined"
                disabled={selectedReviewers.length === 0}
                startIcon={<QueueIcon />}
                onClick={onBatchAddToQueue}
              >
                Add to Queue ({selectedReviewers.length})
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Reviewers Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>Name & Affiliation</TableCell>
                <TableCell align="center">Match</TableCell>
                <TableCell align="center">Avail</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">ORCID</TableCell>
                <TableCell>Expertise</TableCell>
                <TableCell align="center">Conflict</TableCell>
                <TableCell align="center">Related Pubs</TableCell>
                <TableCell align="center">H-Index</TableCell>
                <TableCell align="center">Solo Pubs</TableCell>
                <TableCell align="center">5yr Pubs</TableCell>
                <TableCell align="center">Current</TableCell>
                <TableCell align="center">Accept %</TableCell>
                <TableCell align="center">Completed</TableCell>
                <TableCell align="center">Last Review</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell padding="checkbox">
                      <Skeleton variant="rectangular" width={18} height={18} />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton width="60%" />
                          <Skeleton width="40%" />
                        </Box>
                      </Box>
                    </TableCell>
                    {Array.from({ length: 15 }).map((_, i) => (
                      <TableCell key={i} align="center">
                        <Skeleton width={60} sx={{ mx: "auto" }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredReviewers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={17}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 8,
                        px: 3,
                      }}
                    >
                      {searchTerm ? (
                        <>
                          <SearchOffIcon
                            sx={{
                              fontSize: 64,
                              color: "text.secondary",
                              mb: 2,
                            }}
                          />
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                          >
                            No reviewers match your search
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3, textAlign: "center" }}
                          >
                            Try adjusting your search term or filters to find
                            more reviewers
                          </Typography>
                          <Button variant="outlined" onClick={onClearFilters}>
                            Clear Filters
                          </Button>
                        </>
                      ) : (
                        <>
                          <PersonSearchIcon
                            sx={{
                              fontSize: 64,
                              color: "text.secondary",
                              mb: 2,
                            }}
                          />
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                          >
                            No reviewers available
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: "center" }}
                          >
                            All matching reviewers have been invited or queued
                          </Typography>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviewers.map((reviewer) => (
                  <TableRow
                    key={reviewer.id}
                    hover
                    selected={selectedReviewers.includes(reviewer.id)}
                  >
                    <TableCell padding="checkbox">
                      <input
                        type="checkbox"
                        checked={selectedReviewers.includes(reviewer.id)}
                        onChange={() => onReviewerSelect(reviewer.id)}
                        disabled={hasConflicts(reviewer.conflicts_of_interest)}
                      />
                    </TableCell>
                    {/* Name & Affiliation */}
                    <TableCell>
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {reviewer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reviewer.affiliation}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Match Score */}
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={
                          reviewer.match_score === 0
                            ? "text.disabled"
                            : reviewer.match_score >= 0.8
                            ? "success.main"
                            : "text.primary"
                        }
                      >
                        {reviewer.match_score === 0
                          ? "—"
                          : `${Math.round(reviewer.match_score * 100)}%`}
                      </Typography>
                    </TableCell>

                    {/* Availability */}
                    <TableCell align="center">
                      <Chip
                        label={reviewer.availability_status.substring(0, 4)}
                        color={
                          getAvailabilityColor(reviewer.availability_status) as
                            | "success"
                            | "warning"
                            | "error"
                            | "default"
                        }
                        size="small"
                        sx={{ fontSize: "0.7rem", height: 20 }}
                      />
                    </TableCell>

                    {/* Email with validation icon */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                        }}
                      >
                        <Tooltip title={reviewer.email}>
                          <Typography
                            variant="caption"
                            noWrap
                            sx={{ maxWidth: 120 }}
                          >
                            {reviewer.email.split("@")[0]}
                          </Typography>
                        </Tooltip>
                        {reviewer.email_is_institutional && (
                          <Tooltip title="Institutional email">
                            <CheckCircleIcon
                              sx={{ fontSize: 14, color: "success.main" }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>

                    {/* ORCID */}
                    <TableCell align="center">
                      {reviewer.orcid_id ? (
                        <Tooltip title={reviewer.orcid_id}>
                          <Typography variant="caption" color="primary">
                            ✓
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>

                    {/* Expertise */}
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                          maxWidth: 200,
                        }}
                      >
                        {reviewer.expertise_areas
                          .slice(0, 2)
                          .map((area, idx) => (
                            <Chip
                              key={idx}
                              label={area}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.65rem", height: 18 }}
                            />
                          ))}
                        {reviewer.expertise_areas.length > 2 && (
                          <Chip
                            label={`+${reviewer.expertise_areas.length - 2}`}
                            size="small"
                            sx={{ fontSize: "0.65rem", height: 18 }}
                          />
                        )}
                      </Box>
                    </TableCell>

                    {/* Conflict */}
                    <TableCell align="center">
                      {hasConflicts(reviewer.conflicts_of_interest) ? (
                        <Tooltip
                          title={getConflictsDisplay(
                            reviewer.conflicts_of_interest
                          )}
                        >
                          <CancelIcon
                            sx={{ fontSize: 18, color: "error.main" }}
                          />
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>

                    {/* Related Publications */}
                    <TableCell align="center">
                      <Typography variant="body2">
                        {reviewer.related_publications_count}
                      </Typography>
                    </TableCell>

                    {/* H-Index */}
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={500}>
                        {reviewer.h_index ?? "—"}
                      </Typography>
                    </TableCell>

                    {/* Solo Authored */}
                    <TableCell align="center">
                      <Typography variant="body2">
                        {reviewer.solo_authored_count}
                      </Typography>
                    </TableCell>

                    {/* Publications Last 5 Years */}
                    <TableCell align="center">
                      <Typography variant="body2">
                        {reviewer.publications_last_5_years}
                      </Typography>
                    </TableCell>

                    {/* Current Reviews */}
                    <TableCell align="center">
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {reviewer.current_review_load}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          /{reviewer.max_review_capacity}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Acceptance Rate */}
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        color={
                          reviewer.acceptance_rate >= 80
                            ? "success.main"
                            : reviewer.acceptance_rate >= 50
                            ? "warning.main"
                            : "text.secondary"
                        }
                      >
                        {reviewer.acceptance_rate}%
                      </Typography>
                    </TableCell>

                    {/* Completed Reviews */}
                    <TableCell align="center">
                      <Typography variant="body2">
                        {reviewer.completed_reviews || 0}
                      </Typography>
                    </TableCell>

                    {/* Last Review Date */}
                    <TableCell align="center">
                      {reviewer.days_since_last_review !== null ? (
                        <Tooltip
                          title={new Date(
                            reviewer.last_review_completed!
                          ).toLocaleDateString()}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {reviewer.days_since_last_review}d ago
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          Never
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="View full profile">
                          <IconButton
                            size="small"
                            onClick={() => onViewProfile(reviewer.id)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            hasConflicts(reviewer.conflicts_of_interest)
                              ? "Cannot invite - Conflict of interest"
                              : "Invite immediately"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              disabled={hasConflicts(
                                reviewer.conflicts_of_interest
                              )}
                              onClick={() => onInviteReviewer(reviewer.id)}
                              sx={{
                                "&.Mui-disabled": {
                                  color: (theme) =>
                                    theme.vars?.palette?.error?.main ||
                                    "#ccff00",
                                  opacity: 0.8,
                                },
                              }}
                            >
                              <MailOutlineIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip
                          title={
                            hasConflicts(reviewer.conflicts_of_interest)
                              ? "Cannot queue - Conflict of interest"
                              : "Add to queue"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="secondary"
                              disabled={hasConflicts(
                                reviewer.conflicts_of_interest
                              )}
                              onClick={() => onAddToQueue(reviewer.id)}
                              sx={{
                                "&.Mui-disabled": {
                                  color: (theme) =>
                                    theme.vars?.palette?.error?.main ||
                                    "#ccff00",
                                  opacity: 0.8,
                                },
                              }}
                            >
                              <QueueIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
