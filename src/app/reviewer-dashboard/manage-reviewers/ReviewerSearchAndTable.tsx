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
  LinearProgress,
  Tooltip,
  Avatar,
  Box,
  Skeleton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import QueueIcon from "@mui/icons-material/Queue";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import type { PotentialReviewerWithMatch } from "@/lib/supabase";

interface ReviewerSearchAndTableProps {
  filteredReviewers: PotentialReviewerWithMatch[];
  selectedReviewers: string[];
  searchTerm: string;
  sortBy: string;
  filterAvailability: string[];
  minMatchScore: number;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onAvailabilityChange: (value: string[]) => void;
  onMinMatchScoreChange: (value: number) => void;
  onReviewerSelect: (reviewerId: string) => void;
  onInviteReviewer: (reviewerId: string) => void;
  onAddToQueue: (reviewerId: string) => void;
  onBatchInvite: () => void;
  onBatchAddToQueue: () => void;
  onClearFilters: () => void;
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

export function ReviewerSearchAndTable({
  filteredReviewers,
  selectedReviewers,
  searchTerm,
  sortBy,
  filterAvailability,
  minMatchScore,
  loading,
  onSearchChange,
  onSortChange,
  onAvailabilityChange,
  onMinMatchScoreChange,
  onReviewerSelect,
  onInviteReviewer,
  onAddToQueue,
  onBatchInvite,
  onBatchAddToQueue,
  onClearFilters,
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
          Showing suggested reviewers with match scores by default. Search to
          find any reviewer in the full database.
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
                <MenuItem value="response_rate">Response Rate</MenuItem>
                <MenuItem value="quality_score">Quality Score</MenuItem>
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
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              label="Min Match Score (%)"
              type="number"
              value={Math.round(minMatchScore * 100)}
              onChange={(e) =>
                onMinMatchScoreChange(Number(e.target.value) / 100)
              }
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
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
                <TableCell>Reviewer</TableCell>
                <TableCell align="center">Match Score</TableCell>
                <TableCell align="center">Availability</TableCell>
                <TableCell align="center">Current Load</TableCell>
                <TableCell align="center">Response Rate</TableCell>
                <TableCell align="center">Quality Score</TableCell>
                <TableCell align="center">Avg Review Time</TableCell>
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
                    {Array.from({ length: 7 }).map((_, i) => (
                      <TableCell key={i} align="center">
                        <Skeleton width={60} sx={{ mx: "auto" }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredReviewers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
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
                        disabled={reviewer.conflicts_of_interest.length > 0}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {reviewer.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {reviewer.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            {reviewer.affiliation}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              flexWrap: "wrap",
                            }}
                          >
                            {reviewer.expertise_areas
                              .slice(0, 3)
                              .map((area) => (
                                <Chip
                                  key={area}
                                  label={area}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: "0.7rem",
                                  }}
                                />
                              ))}
                          </Box>
                          {reviewer.conflicts_of_interest.length > 0 && (
                            <Chip
                              label={`Conflict: ${reviewer.conflicts_of_interest.join(
                                ", "
                              )}`}
                              color="error"
                              size="small"
                              icon={<CancelIcon />}
                              sx={{
                                mt: 1,
                                fontWeight: 600,
                                "& .MuiChip-label": {
                                  fontWeight: 600,
                                },
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Typography variant="h6" color="primary">
                          {Math.round(reviewer.match_score * 100)}%
                        </Typography>
                        {reviewer.match_score >= 0.9 && (
                          <StarIcon color="warning" fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={reviewer.availability_status}
                        color={
                          getAvailabilityColor(reviewer.availability_status) as
                            | "success"
                            | "warning"
                            | "error"
                            | "info"
                            | "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <Typography variant="body2">
                          {reviewer.current_review_load}/
                          {reviewer.max_review_capacity}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={
                            (reviewer.current_review_load /
                              reviewer.max_review_capacity) *
                            100
                          }
                          sx={{ mt: 0.5, width: 40 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        color={
                          reviewer.response_rate >= 80
                            ? "success.main"
                            : "warning.main"
                        }
                      >
                        {reviewer.response_rate}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="primary">
                        {reviewer.quality_score}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {reviewer.average_review_time_days} days
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip
                          title={
                            reviewer.conflicts_of_interest.length > 0
                              ? "Cannot invite - Conflict of interest"
                              : "Invite immediately"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              disabled={
                                reviewer.conflicts_of_interest.length > 0
                              }
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
                            reviewer.conflicts_of_interest.length > 0
                              ? "Cannot queue - Conflict of interest"
                              : "Add to queue"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="secondary"
                              disabled={
                                reviewer.conflicts_of_interest.length > 0
                              }
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
