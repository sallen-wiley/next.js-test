// Shared reviewer card list component with loading states and empty states
"use client";
import * as React from "react";
import { Box, Stack, Card, Skeleton, Typography, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import type { PotentialReviewerWithMatch } from "@/lib/supabase";

interface ReviewerCardListProps {
  reviewers: PotentialReviewerWithMatch[];
  loading: boolean;
  isFiltering: boolean;
  displayLimit: number;
  searchTerm: string;
  onInvite: (reviewerId: string) => void;
  onAddToQueue: (reviewerId: string) => void;
  onViewProfile: (reviewerId: string) => void;
  onLoadMore: () => void;
  onClearFilters: () => void;
  ReviewerCardComponent: React.ComponentType<{
    reviewer: PotentialReviewerWithMatch;
    onInvite: (reviewerId: string) => void;
    onAddToQueue: (reviewerId: string) => void;
    onViewProfile: (reviewerId: string) => void;
  }>;
}

export function ReviewerCardList({
  reviewers,
  loading,
  isFiltering,
  displayLimit,
  searchTerm,
  onInvite,
  onAddToQueue,
  onViewProfile,
  onLoadMore,
  onClearFilters,
  ReviewerCardComponent,
}: ReviewerCardListProps) {
  // Loading skeletons
  if (loading || isFiltering) {
    return (
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
    );
  }

  // Empty state
  if (reviewers.length === 0) {
    return (
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
    );
  }

  // Reviewer cards
  return (
    <>
      <Stack spacing={2}>
        {reviewers.slice(0, displayLimit).map((reviewer) => (
          <ReviewerCardComponent
            key={reviewer.id}
            reviewer={reviewer}
            onInvite={onInvite}
            onAddToQueue={onAddToQueue}
            onViewProfile={onViewProfile}
          />
        ))}
      </Stack>

      {/* Load More Button */}
      {reviewers.length > displayLimit && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="outlined" color="neutral" onClick={onLoadMore}>
            Load More ({reviewers.length - displayLimit} remaining)
          </Button>
        </Box>
      )}
    </>
  );
}
