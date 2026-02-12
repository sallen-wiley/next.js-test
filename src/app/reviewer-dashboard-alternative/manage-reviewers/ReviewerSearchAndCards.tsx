"use client";
import * as React from "react";
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Stack,
  Box,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Slider,
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import type { ReviewerSearchAndCardsProps } from "@/components/reviewer-dashboard/types";
import { useSearchDebounce } from "@/hooks/useSearchDebounce";
import { ActiveFilterChips } from "@/components/reviewer-dashboard/ActiveFilterChips";
import { ReviewerCardList } from "@/components/reviewer-dashboard/ReviewerCardList";
import { DefaultSuggestionsHeader } from "@/components/reviewer-dashboard/DefaultSuggestionsHeader";
import ReviewerCard from "./ReviewerCard";

// Re-export for backward compatibility
export type { ReviewerFilters } from "@/components/reviewer-dashboard/types";

export function ReviewerSearchAndCards({
  filteredReviewers,
  searchTerm,
  filters,
  loading,
  onSearchChange,
  onFiltersChange,
  onInviteReviewer,
  onAddToQueue,
  onInviteManually,
  onClearFilters,
  onViewProfile,
}: ReviewerSearchAndCardsProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [displayLimit, setDisplayLimit] = React.useState(50);

  // Use shared debounce hook
  const { localSearchTerm, setLocalSearchTerm, isFiltering } =
    useSearchDebounce({
      initialSearchTerm: searchTerm,
      onSearchChange,
    });

  // Reset display limit when search term or filters change
  React.useEffect(() => {
    setDisplayLimit(50);
  }, [searchTerm, filters]);

  // Local temp state for slider values (before applying)
  const [tempResponseTime, setTempResponseTime] = React.useState(7);
  const [tempReviewsLast12Months, setTempReviewsLast12Months] =
    React.useState(5);
  const [tempTotalReviewsMin, setTempTotalReviewsMin] = React.useState(150);
  const [tempTotalReviewsMax, setTempTotalReviewsMax] = React.useState(200);
  const [tempAssignedManuscripts, setTempAssignedManuscripts] =
    React.useState(3);
  const [tempPublicationYearFrom, setTempPublicationYearFrom] =
    React.useState(2019);
  const [tempPublicationYearTo, setTempPublicationYearTo] =
    React.useState(2024);
  const [tempPublishedArticlesMin, setTempPublishedArticlesMin] =
    React.useState(10);

  // Sync temp values when filters change externally
  React.useEffect(() => {
    if (filters.responseTimeMax > 0)
      setTempResponseTime(filters.responseTimeMax);
    if (filters.reviewsLast12Months > 0)
      setTempReviewsLast12Months(filters.reviewsLast12Months);
    if (filters.totalReviewsMin > 0)
      setTempTotalReviewsMin(filters.totalReviewsMin);
    if (filters.totalReviewsMax < 1000)
      setTempTotalReviewsMax(filters.totalReviewsMax);
    if (filters.assignedManuscriptsMax > 0)
      setTempAssignedManuscripts(filters.assignedManuscriptsMax);
    if (filters.publicationYearFrom > 0)
      setTempPublicationYearFrom(filters.publicationYearFrom);
    if (filters.publicationYearTo > 0)
      setTempPublicationYearTo(filters.publicationYearTo);
    if (filters.publishedArticlesMin > 0)
      setTempPublishedArticlesMin(filters.publishedArticlesMin);
  }, [filters]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleResetFilters = () => {
    onClearFilters();
  };

  return (
    <Paper sx={{ mb: 3 }}>
      {/* Tab Bar with Invite Manually button */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Tabs value={activeTab} onChange={handleTabChange} textColor="inherit">
          <Tab label="Find Reviewer" />
          <Tab label="Bookmarked Reviewers" />
        </Tabs>
        <Button
          variant="text"
          color="neutral"
          startIcon={<EmailIcon />}
          onClick={onInviteManually}
          sx={{ textTransform: "none" }}
        >
          Invite Manually
        </Button>
      </Box>

      {/* Tab Panel: Find Reviewer */}
      {activeTab === 0 && (
        <Box sx={{ p: 3 }}>
          {/* Search Section */}
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 3, bgcolor: "background.default" }}
          >
            <TextField
              fullWidth
              size="small"
              label="Search for reviewers"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="Search by keyword, email or name..."
              slotProps={{
                input: { sx: { backgroundColor: "background.paper" } },
              }}
            />
          </Paper>

          {/* Two-Column Layout */}
          <Box sx={{ display: "flex", gap: 0 }}>
            {/* Left Column - 300px */}
            <Box sx={{ width: 300, flexShrink: 0, pr: 3 }}>
              {/* Filter Header */}
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Filters
                </Typography>
                {(filters.hideUnavailable ||
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
                  filters.inAuthorsGroup) && (
                  <Button
                    size="small"
                    color="secondary"
                    onClick={handleResetFilters}
                    sx={{ textTransform: "none" }}
                  >
                    Reset filters
                  </Button>
                )}
              </Box>

              {/* Active Filter Chips */}
              <ActiveFilterChips
                filters={filters}
                onFiltersChange={onFiltersChange}
                onClearAll={onClearFilters}
                showClearAll={false}
              />

              {/* Filter Content*/}
              <Box>
                <Stack spacing={2}>
                  {/* Section 1: Demographics */}
                  <Stack spacing={2}>
                    {/* Hide Unavailable */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 0.5, fontWeight: "bold" }}
                      >
                        Hide unavailable reviewers
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filters.hideUnavailable}
                            onChange={(e) =>
                              onFiltersChange({
                                ...filters,
                                hideUnavailable: e.target.checked,
                              })
                            }
                            size="small"
                          />
                        }
                        label="Yes"
                      />
                    </Box>

                    {/* Institutional Email */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 0.5, fontWeight: "bold" }}
                      >
                        Institutional Email
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filters.institutionalEmail}
                            onChange={(e) =>
                              onFiltersChange({
                                ...filters,
                                institutionalEmail: e.target.checked,
                              })
                            }
                            size="small"
                          />
                        }
                        label="Yes"
                      />
                    </Box>

                    {/* Country - Placeholder for future implementation */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 0.5, fontWeight: "bold" }}
                      >
                        Country
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={filters.country}
                          onChange={(e) =>
                            onFiltersChange({
                              ...filters,
                              country: e.target.value,
                            })
                          }
                          displayEmpty
                        >
                          <MenuItem value="">All Countries</MenuItem>
                          <MenuItem value="USA">USA</MenuItem>
                          <MenuItem value="UK">UK</MenuItem>
                          <MenuItem value="Canada">Canada</MenuItem>
                          <MenuItem value="Germany">Germany</MenuItem>
                          <MenuItem value="Australia">Australia</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Role */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 0.5, fontWeight: "bold" }}
                      >
                        Role
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={filters.role}
                          onChange={(e) =>
                            onFiltersChange({
                              ...filters,
                              role: e.target.value as string,
                            })
                          }
                          displayEmpty
                        >
                          <MenuItem value="">All Roles</MenuItem>
                          <MenuItem value="Role A" disabled>
                            Role A
                          </MenuItem>
                          <MenuItem value="Role B" disabled>
                            Role B
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Stack>

                  <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
                    <Stack spacing={2}>
                      {/* Response Time */}
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filters.responseTimeMax > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Apply immediately with default value
                                  onFiltersChange({
                                    ...filters,
                                    responseTimeMax: 7,
                                  });
                                } else {
                                  // Clear the filter
                                  onFiltersChange({
                                    ...filters,
                                    responseTimeMax: 0,
                                  });
                                }
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Response Time (average days)
                            </Typography>
                          }
                        />
                        {filters.responseTimeMax > 0 && (
                          <Box sx={{ mt: 1, px: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <Box sx={{ flex: 1, display: "flex" }}>
                                <Slider
                                  value={Math.max(1, tempResponseTime)}
                                  onChange={(_, value) =>
                                    setTempResponseTime(
                                      typeof value === "number"
                                        ? Math.max(1, value)
                                        : 1,
                                    )
                                  }
                                  min={1}
                                  max={30}
                                  size="small"
                                />
                              </Box>
                              <TextField
                                size="small"
                                value={tempResponseTime}
                                onChange={(e) =>
                                  setTempResponseTime(
                                    e.target.value === ""
                                      ? 1
                                      : Number(e.target.value),
                                  )
                                }
                                onBlur={() => {
                                  if (tempResponseTime < 1) {
                                    setTempResponseTime(1);
                                  } else if (tempResponseTime > 30) {
                                    setTempResponseTime(30);
                                  }
                                }}
                                slotProps={{
                                  htmlInput: {
                                    min: 1,
                                    max: 30,
                                    type: "number",
                                    step: 1,
                                  },
                                }}
                              />
                            </Box>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => {
                                onFiltersChange({
                                  ...filters,
                                  responseTimeMax: tempResponseTime,
                                });
                              }}
                              sx={{ mt: 1, textTransform: "none" }}
                              fullWidth
                            >
                              Apply
                            </Button>
                          </Box>
                        )}
                      </Box>

                      {/* Reviews in Last 12 Months */}
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filters.reviewsLast12Months > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Apply immediately with default value
                                  onFiltersChange({
                                    ...filters,
                                    reviewsLast12Months: 5,
                                  });
                                } else {
                                  // Clear the filter
                                  onFiltersChange({
                                    ...filters,
                                    reviewsLast12Months: 0,
                                  });
                                }
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Reviews completed in the last 12 months
                            </Typography>
                          }
                        />
                        {filters.reviewsLast12Months > 0 && (
                          <Box sx={{ mt: 1, px: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <Box sx={{ flex: 1, display: "flex" }}>
                                <Slider
                                  value={Math.max(0, tempReviewsLast12Months)}
                                  onChange={(_, value) =>
                                    setTempReviewsLast12Months(
                                      typeof value === "number"
                                        ? Math.max(0, value)
                                        : 0,
                                    )
                                  }
                                  min={0}
                                  max={20}
                                  size="small"
                                />
                              </Box>
                              <TextField
                                size="small"
                                value={tempReviewsLast12Months}
                                onChange={(e) =>
                                  setTempReviewsLast12Months(
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                  )
                                }
                                onBlur={() => {
                                  if (tempReviewsLast12Months < 0) {
                                    setTempReviewsLast12Months(0);
                                  } else if (tempReviewsLast12Months > 20) {
                                    setTempReviewsLast12Months(20);
                                  }
                                }}
                                slotProps={{
                                  htmlInput: {
                                    min: 0,
                                    max: 20,
                                    type: "number",
                                    step: 1,
                                  },
                                }}
                              />
                            </Box>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => {
                                onFiltersChange({
                                  ...filters,
                                  reviewsLast12Months: tempReviewsLast12Months,
                                });
                              }}
                              sx={{ mt: 1, textTransform: "none" }}
                              fullWidth
                            >
                              Apply
                            </Button>
                          </Box>
                        )}
                      </Box>

                      {/* Total Reviews Completed - Range Slider */}
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                filters.totalReviewsMin > 0 ||
                                filters.totalReviewsMax < 1000
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Apply immediately with default values
                                  onFiltersChange({
                                    ...filters,
                                    totalReviewsMin: 150,
                                    totalReviewsMax: 200,
                                  });
                                } else {
                                  // Clear the filter
                                  onFiltersChange({
                                    ...filters,
                                    totalReviewsMin: 0,
                                    totalReviewsMax: 1000,
                                  });
                                }
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Total reviews completed
                            </Typography>
                          }
                        />
                        {(filters.totalReviewsMin > 0 ||
                          filters.totalReviewsMax < 1000) && (
                          <Box sx={{ mt: 1, px: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                size="small"
                                value={tempTotalReviewsMin}
                                onChange={(e) =>
                                  setTempTotalReviewsMin(
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                  )
                                }
                                onBlur={() => {
                                  if (tempTotalReviewsMin < 0) {
                                    setTempTotalReviewsMin(0);
                                  } else if (tempTotalReviewsMin > 1000) {
                                    setTempTotalReviewsMin(1000);
                                  }
                                }}
                                slotProps={{
                                  htmlInput: {
                                    min: 0,
                                    max: 1000,
                                    type: "number",
                                    step: 1,
                                  },
                                }}
                              />
                              <Box sx={{ display: "flex", flex: 1 }}>
                                <Slider
                                  value={[
                                    Math.max(0, tempTotalReviewsMin),
                                    Math.min(
                                      1000,
                                      Math.max(0, tempTotalReviewsMax),
                                    ),
                                  ]}
                                  onChange={(_, value) => {
                                    if (Array.isArray(value)) {
                                      const [min, max] = value;
                                      setTempTotalReviewsMin(
                                        Math.max(0, Math.min(1000, min)),
                                      );
                                      setTempTotalReviewsMax(
                                        Math.max(0, Math.min(1000, max)),
                                      );
                                    }
                                  }}
                                  min={0}
                                  max={1000}
                                  disableSwap
                                  size="small"
                                />
                              </Box>
                              <TextField
                                size="small"
                                value={tempTotalReviewsMax}
                                onChange={(e) =>
                                  setTempTotalReviewsMax(
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                  )
                                }
                                onBlur={() => {
                                  if (tempTotalReviewsMax < 0) {
                                    setTempTotalReviewsMax(0);
                                  } else if (tempTotalReviewsMax > 1000) {
                                    setTempTotalReviewsMax(1000);
                                  }
                                }}
                                slotProps={{
                                  htmlInput: {
                                    min: 0,
                                    max: 1000,
                                    type: "number",
                                    step: 1,
                                  },
                                }}
                              />
                            </Box>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => {
                                onFiltersChange({
                                  ...filters,
                                  totalReviewsMin: tempTotalReviewsMin,
                                  totalReviewsMax: tempTotalReviewsMax,
                                });
                              }}
                              sx={{ mt: 1, textTransform: "none" }}
                              fullWidth
                            >
                              Apply
                            </Button>
                          </Box>
                        )}
                      </Box>

                      {/* Current Review Load */}
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filters.assignedManuscriptsMax > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Apply immediately with default value
                                  onFiltersChange({
                                    ...filters,
                                    assignedManuscriptsMax: 3,
                                  });
                                } else {
                                  // Clear the filter
                                  onFiltersChange({
                                    ...filters,
                                    assignedManuscriptsMax: 0,
                                  });
                                }
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Currently reviewing
                            </Typography>
                          }
                        />
                        {filters.assignedManuscriptsMax > 0 && (
                          <Box sx={{ mt: 1, px: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <Box sx={{ flex: 1, display: "flex" }}>
                                <Slider
                                  value={Math.max(0, tempAssignedManuscripts)}
                                  onChange={(_, value) =>
                                    setTempAssignedManuscripts(
                                      typeof value === "number"
                                        ? Math.max(0, value)
                                        : 0,
                                    )
                                  }
                                  min={0}
                                  max={10}
                                  size="small"
                                />
                              </Box>
                              <TextField
                                size="small"
                                value={tempAssignedManuscripts}
                                onChange={(e) =>
                                  setTempAssignedManuscripts(
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                  )
                                }
                                onBlur={() => {
                                  if (tempAssignedManuscripts < 0) {
                                    setTempAssignedManuscripts(0);
                                  } else if (tempAssignedManuscripts > 10) {
                                    setTempAssignedManuscripts(10);
                                  }
                                }}
                                slotProps={{
                                  htmlInput: {
                                    min: 0,
                                    max: 10,
                                    type: "number",
                                    step: 1,
                                  },
                                }}
                              />
                            </Box>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => {
                                onFiltersChange({
                                  ...filters,
                                  assignedManuscriptsMax:
                                    tempAssignedManuscripts,
                                });
                              }}
                              sx={{ mt: 1, textTransform: "none" }}
                              fullWidth
                            >
                              Apply
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Stack>
                  </Box>

                  <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
                    <Stack spacing={2}>
                      {/* Publication Year Range */}
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                filters.publicationYearFrom > 0 ||
                                filters.publicationYearTo > 0
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Apply immediately with default values
                                  onFiltersChange({
                                    ...filters,
                                    publicationYearFrom: 2019,
                                    publicationYearTo: 2024,
                                  });
                                } else {
                                  // Clear the filter
                                  onFiltersChange({
                                    ...filters,
                                    publicationYearFrom: 0,
                                    publicationYearTo: 0,
                                  });
                                }
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Publication Year Range
                            </Typography>
                          }
                        />
                        {(filters.publicationYearFrom > 0 ||
                          filters.publicationYearTo > 0) && (
                          <Box sx={{ mt: 1, px: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                size="small"
                                label="From"
                                value={tempPublicationYearFrom || ""}
                                onChange={(e) =>
                                  setTempPublicationYearFrom(
                                    Number(e.target.value),
                                  )
                                }
                                slotProps={{
                                  htmlInput: {
                                    min: 1900,
                                    max: 2024,
                                    type: "number",
                                  },
                                }}
                                sx={{ flex: 1 }}
                              />
                              <TextField
                                size="small"
                                label="To"
                                value={tempPublicationYearTo || ""}
                                onChange={(e) =>
                                  setTempPublicationYearTo(
                                    Number(e.target.value),
                                  )
                                }
                                slotProps={{
                                  htmlInput: {
                                    min: 1900,
                                    max: 2024,
                                    type: "number",
                                  },
                                }}
                                sx={{ flex: 1 }}
                              />
                            </Box>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => {
                                onFiltersChange({
                                  ...filters,
                                  publicationYearFrom: tempPublicationYearFrom,
                                  publicationYearTo: tempPublicationYearTo,
                                });
                              }}
                              sx={{ mt: 1, textTransform: "none" }}
                              fullWidth
                            >
                              Apply
                            </Button>
                          </Box>
                        )}
                      </Box>

                      {/* Published Articles */}
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filters.publishedArticlesMin > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Apply immediately with default value
                                  onFiltersChange({
                                    ...filters,
                                    publishedArticlesMin: 10,
                                  });
                                } else {
                                  // Clear the filter
                                  onFiltersChange({
                                    ...filters,
                                    publishedArticlesMin: 0,
                                  });
                                }
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Published Articles (minimum)
                            </Typography>
                          }
                        />
                        {filters.publishedArticlesMin > 0 && (
                          <Box sx={{ mt: 1, px: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <Box sx={{ flex: 1, display: "flex" }}>
                                <Slider
                                  value={Math.max(0, tempPublishedArticlesMin)}
                                  onChange={(_, value) =>
                                    setTempPublishedArticlesMin(
                                      typeof value === "number"
                                        ? Math.max(0, value)
                                        : 0,
                                    )
                                  }
                                  min={0}
                                  max={100}
                                  size="small"
                                />
                              </Box>
                              <TextField
                                size="small"
                                value={tempPublishedArticlesMin}
                                onChange={(e) =>
                                  setTempPublishedArticlesMin(
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                  )
                                }
                                slotProps={{
                                  htmlInput: {
                                    min: 0,
                                    max: 100,
                                    type: "number",
                                    step: 1,
                                  },
                                }}
                              />
                            </Box>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => {
                                onFiltersChange({
                                  ...filters,
                                  publishedArticlesMin:
                                    tempPublishedArticlesMin,
                                });
                              }}
                              sx={{ mt: 1, textTransform: "none" }}
                              fullWidth
                            >
                              Apply
                            </Button>
                          </Box>
                        )}
                      </Box>

                      {/* Published in this Journal */}
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 0.5, fontWeight: "bold" }}
                        >
                          Published in this Journal
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filters.publishedInJournal}
                              onChange={(e) =>
                                onFiltersChange({
                                  ...filters,
                                  publishedInJournal: e.target.checked,
                                })
                              }
                              size="small"
                            />
                          }
                          label="Yes"
                        />
                      </Box>

                      {/* Previously Reviewed for this Journal */}
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 0.5, fontWeight: "bold" }}
                        >
                          Previously reviewed for this journal
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filters.previouslyReviewedForJournal}
                              onChange={(e) =>
                                onFiltersChange({
                                  ...filters,
                                  previouslyReviewedForJournal:
                                    e.target.checked,
                                })
                              }
                              size="small"
                              disabled
                            />
                          }
                          label="Yes"
                        />
                      </Box>

                      {/* In Author's Group */}
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 0.5, fontWeight: "bold" }}
                        >
                          In the author&apos;s group
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={filters.inAuthorsGroup}
                              onChange={(e) =>
                                onFiltersChange({
                                  ...filters,
                                  inAuthorsGroup: e.target.checked,
                                })
                              }
                              size="small"
                              disabled
                            />
                          }
                          label="Yes"
                        />
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Box>

            {/* Vertical Divider */}
            <Divider orientation="vertical" flexItem />

            {/* Right Column - Reviewer Cards */}
            <Box sx={{ flex: 1, minWidth: 0, pl: 3 }}>
              {/* Reviewer Card List */}
              {!searchTerm && (
                <DefaultSuggestionsHeader count={filteredReviewers.length} />
              )}
              <ReviewerCardList
                reviewers={filteredReviewers}
                loading={loading}
                isFiltering={isFiltering}
                displayLimit={displayLimit}
                searchTerm={searchTerm}
                onInvite={onInviteReviewer}
                onAddToQueue={onAddToQueue}
                onViewProfile={onViewProfile}
                onLoadMore={() => setDisplayLimit((prev) => prev + 50)}
                onClearFilters={onClearFilters}
                ReviewerCardComponent={ReviewerCard}
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Tab Panel: Bookmarked Reviewers */}
      {activeTab === 1 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Bookmarked reviewers will appear here.
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
