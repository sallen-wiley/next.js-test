// Shared active filter chips component
"use client";
import * as React from "react";
import { Box, Stack, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ReviewerFilters } from "./types";

interface ActiveFilterChipsProps {
  filters: ReviewerFilters;
  onFiltersChange: (filters: ReviewerFilters) => void;
  onClearAll: () => void;
  showClearAll?: boolean;
}

export function ActiveFilterChips({
  filters,
  onFiltersChange,
  onClearAll,
  showClearAll = true,
}: ActiveFilterChipsProps) {
  const hasActiveFilters =
    filters.hideUnavailable ||
    filters.institutionalEmail ||
    filters.country !== "" ||
    filters.role !== "" ||
    filters.responseTimeMax > 0 ||
    filters.reviewsLast12Months > 0 ||
    filters.totalReviewsMin > 0 ||
    filters.totalReviewsMax < 1000 ||
    filters.assignedManuscriptsMax > 0 ||
    filters.publicationYearFrom > 0 ||
    filters.publicationYearTo > 0 ||
    filters.publishedArticlesMin > 0 ||
    filters.publishedInJournal ||
    filters.previouslyReviewedForJournal ||
    filters.inAuthorsGroup;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {/* Hide Unavailable chip */}
        {filters.hideUnavailable && (
          <Chip
            label="Hide Unavailable Reviewers"
            onDelete={() => {
              onFiltersChange({
                ...filters,
                hideUnavailable: false,
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Institutional Email chip */}
        {filters.institutionalEmail && (
          <Chip
            label="Institutional Email Only"
            onDelete={() => {
              onFiltersChange({
                ...filters,
                institutionalEmail: false,
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Country chip */}
        {filters.country !== "" && (
          <Chip
            label={`Country: ${filters.country}`}
            onDelete={() => {
              onFiltersChange({
                ...filters,
                country: "",
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Role chip */}
        {filters.role !== "" && (
          <Chip
            label={`Role: ${filters.role}`}
            onDelete={() => {
              onFiltersChange({
                ...filters,
                role: "",
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Response Time chip */}
        {filters.responseTimeMax > 0 && (
          <Chip
            label={`Response Time: ≤${filters.responseTimeMax} days`}
            onDelete={() => {
              onFiltersChange({
                ...filters,
                responseTimeMax: 0,
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Reviews Last 12 Months chip */}
        {filters.reviewsLast12Months > 0 && (
          <Chip
            label={`Reviews (12mo): ≥${filters.reviewsLast12Months}`}
            onDelete={() => {
              onFiltersChange({
                ...filters,
                reviewsLast12Months: 0,
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Total Reviews chip */}
        {(filters.totalReviewsMin > 0 || filters.totalReviewsMax < 1000) && (
          <Chip
            label={`Total Reviews: ${filters.totalReviewsMin}–${
              filters.totalReviewsMax === 1000 ? "∞" : filters.totalReviewsMax
            }`}
            onDelete={() => {
              onFiltersChange({
                ...filters,
                totalReviewsMin: 0,
                totalReviewsMax: 1000,
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Assigned Manuscripts chip */}
        {filters.assignedManuscriptsMax > 0 && (
          <Chip
            label={`Currently Assigned: ≤${filters.assignedManuscriptsMax}`}
            onDelete={() => {
              onFiltersChange({
                ...filters,
                assignedManuscriptsMax: 0,
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Publication Years chip */}
        {(filters.publicationYearFrom > 0 || filters.publicationYearTo > 0) && (
          <Chip
            label={`Publication Years: ${filters.publicationYearFrom || "—"}–${
              filters.publicationYearTo || "—"
            }`}
            onDelete={() => {
              onFiltersChange({
                ...filters,
                publicationYearFrom: 0,
                publicationYearTo: 0,
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Published Articles chip */}
        {filters.publishedArticlesMin > 0 && (
          <Chip
            label={`Published Articles: ≥${filters.publishedArticlesMin}`}
            onDelete={() => {
              onFiltersChange({
                ...filters,
                publishedArticlesMin: 0,
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Published in Journal chip */}
        {filters.publishedInJournal && (
          <Chip
            label="Published in Journal"
            onDelete={() => {
              onFiltersChange({
                ...filters,
                publishedInJournal: false,
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Previously Reviewed for this Journal chip */}
        {filters.previouslyReviewedForJournal && (
          <Chip
            label="Previously Reviewed for this Journal"
            onDelete={() => {
              onFiltersChange({
                ...filters,
                previouslyReviewedForJournal: false,
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* In Authors Group chip */}
        {filters.inAuthorsGroup && (
          <Chip
            label="In Authors Group"
            onDelete={() => {
              onFiltersChange({
                ...filters,
                inAuthorsGroup: false,
              });
            }}
            color="neutral"
            variant="outlined"
          />
        )}

        {/* Clear All button */}
        {showClearAll && (
          <Chip
            label="Clear All Filters"
            onClick={onClearAll}
            color="neutral"
            variant="filled"
            deleteIcon={<CloseIcon />}
            onDelete={onClearAll}
          />
        )}
      </Stack>
    </Box>
  );
}
