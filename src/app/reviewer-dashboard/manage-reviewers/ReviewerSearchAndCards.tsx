"use client";
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
  Box,
  Skeleton,
  Card,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import type { PotentialReviewerWithMatch } from "@/lib/supabase";
import ReviewerCard from "./ReviewerCard";

interface ReviewerSearchAndCardsProps {
  filteredReviewers: PotentialReviewerWithMatch[];
  searchTerm: string;
  sortBy: string;
  filterAvailability: string[];
  loading: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onAvailabilityChange: (value: string[]) => void;
  onInviteReviewer: (reviewerId: string) => void;
  onAddToQueue: (reviewerId: string) => void;
  onClearFilters: () => void;
  onViewProfile: (reviewerId: string) => void;
}

export function ReviewerSearchAndCards({
  filteredReviewers,
  searchTerm,
  sortBy,
  filterAvailability,
  loading,
  onSearchChange,
  onSortChange,
  onAvailabilityChange,
  onInviteReviewer,
  onAddToQueue,
  onClearFilters,
  onViewProfile,
}: ReviewerSearchAndCardsProps) {
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
          <Grid size={{ xs: 12, md: 5 }}></Grid>
        </Grid>
      </Paper>

      {/* Card List (stacked, horizontal cards) */}
      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="rectangular" width={24} height={24} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="30%" />
                  <Skeleton width="50%" />
                </Box>
                <Skeleton variant="rectangular" width={90} height={32} />
              </Stack>
            </Card>
          ))}
        </Stack>
      ) : filteredReviewers.length === 0 ? (
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
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No reviewers match your search
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, textAlign: "center" }}
              >
                Try adjusting your search term or filters to find more reviewers
              </Typography>
              <Button variant="outlined" onClick={onClearFilters}>
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <PersonSearchIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
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
      ) : (
        <Stack spacing={2}>
          {filteredReviewers.map((reviewer) => (
            <ReviewerCard
              key={reviewer.id}
              reviewer={reviewer}
              onInvite={onInviteReviewer}
              onAddToQueue={onAddToQueue}
              onViewProfile={onViewProfile}
            />
          ))}
        </Stack>
      )}
    </>
  );
}
