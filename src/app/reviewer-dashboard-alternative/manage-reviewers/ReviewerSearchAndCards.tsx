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
  Skeleton,
  Card,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Slider,
  Tooltip,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import EmailIcon from "@mui/icons-material/Email";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import type { PotentialReviewerWithMatch } from "@/lib/supabase";
import ReviewerCard from "./ReviewerCard";

export interface ReviewerFilters {
  availability: string[];
  institutionalEmail: boolean;
  country: string;
  responseTimeMax: number;
  reviewsLast12Months: number;
  totalReviewsMin: number;
  totalReviewsMax: number;
  assignedManuscriptsMax: number;
  publicationYearFrom: number;
  publicationYearTo: number;
  publishedArticlesMin: number;
  publishedInJournal: boolean;
  inAuthorsGroup: boolean;
}

interface ReviewerSearchAndCardsProps {
  filteredReviewers: PotentialReviewerWithMatch[];
  searchTerm: string;
  filters: ReviewerFilters;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: ReviewerFilters) => void;
  onInviteReviewer: (reviewerId: string) => void;
  onAddToQueue: (reviewerId: string) => void;
  onInviteManually: () => void;
  onClearFilters: () => void;
  onViewProfile: (reviewerId: string) => void;
}

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
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
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
                {(filters.availability.length > 0 ||
                  filters.institutionalEmail ||
                  filters.country !== "" ||
                  filters.responseTimeMax > 0 ||
                  filters.reviewsLast12Months > 0 ||
                  filters.totalReviewsMin > 0 ||
                  filters.totalReviewsMax < 1000 ||
                  filters.assignedManuscriptsMax > 0 ||
                  filters.publicationYearFrom > 0 ||
                  filters.publicationYearTo > 0 ||
                  filters.publishedArticlesMin > 0 ||
                  filters.publishedInJournal ||
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
              {(filters.availability.length > 0 ||
                filters.institutionalEmail ||
                filters.country !== "" ||
                filters.responseTimeMax > 0 ||
                filters.reviewsLast12Months > 0 ||
                filters.totalReviewsMin > 0 ||
                filters.totalReviewsMax < 1000 ||
                filters.assignedManuscriptsMax > 0 ||
                filters.publicationYearFrom > 0 ||
                filters.publicationYearTo > 0 ||
                filters.publishedArticlesMin > 0 ||
                filters.publishedInJournal ||
                filters.inAuthorsGroup) && (
                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {/* Availability chips */}
                    {filters.availability.map((status) => (
                      <Chip
                        key={status}
                        label={`Availability: ${
                          status.charAt(0).toUpperCase() + status.slice(1)
                        }`}
                        onDelete={() => {
                          onFiltersChange({
                            ...filters,
                            availability: filters.availability.filter(
                              (a) => a !== status,
                            ),
                          });
                        }}
                        color="neutral"
                        variant="outlined"
                      />
                    ))}

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
                    {(filters.totalReviewsMin > 0 ||
                      filters.totalReviewsMax < 1000) && (
                      <Chip
                        label={`Total Reviews: ${filters.totalReviewsMin}–${
                          filters.totalReviewsMax === 1000
                            ? "∞"
                            : filters.totalReviewsMax
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
                    {(filters.publicationYearFrom > 0 ||
                      filters.publicationYearTo > 0) && (
                      <Chip
                        label={`Publication Years: ${
                          filters.publicationYearFrom || "—"
                        }–${filters.publicationYearTo || "—"}`}
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
                  </Stack>
                </Box>
              )}

              {/* Filter Content*/}
              <Box>
                <Stack spacing={2}>
                  {/* Section 1: Demographics */}
                  <Stack spacing={2}>
                    {/* Availability */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 0.5, fontWeight: "bold" }}
                      >
                        Availability
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filters.availability.includes("available")}
                            onChange={(e) => {
                              const newAvailability = e.target.checked
                                ? [...filters.availability, "available"]
                                : filters.availability.filter(
                                    (a) => a !== "available",
                                  );
                              onFiltersChange({
                                ...filters,
                                availability: newAvailability,
                              });
                            }}
                            size="small"
                          />
                        }
                        label="Available"
                        sx={{ display: "block" }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filters.availability.includes("busy")}
                            onChange={(e) => {
                              const newAvailability = e.target.checked
                                ? [...filters.availability, "busy"]
                                : filters.availability.filter(
                                    (a) => a !== "busy",
                                  );
                              onFiltersChange({
                                ...filters,
                                availability: newAvailability,
                              });
                            }}
                            size="small"
                          />
                        }
                        label="Busy"
                        sx={{ display: "block" }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filters.availability.includes(
                              "unavailable",
                            )}
                            onChange={(e) => {
                              const newAvailability = e.target.checked
                                ? [...filters.availability, "unavailable"]
                                : filters.availability.filter(
                                    (a) => a !== "unavailable",
                                  );
                              onFiltersChange({
                                ...filters,
                                availability: newAvailability,
                              });
                            }}
                            size="small"
                          />
                        }
                        label="Unavailable"
                        sx={{ display: "block" }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filters.availability.includes(
                              "sabbatical",
                            )}
                            onChange={(e) => {
                              const newAvailability = e.target.checked
                                ? [...filters.availability, "sabbatical"]
                                : filters.availability.filter(
                                    (a) => a !== "sabbatical",
                                  );
                              onFiltersChange({
                                ...filters,
                                availability: newAvailability,
                              });
                            }}
                            size="small"
                          />
                        }
                        label="Sabbatical"
                        sx={{ display: "block" }}
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
                                sx={{ width: 60 }}
                                inputProps={{
                                  min: 1,
                                  max: 30,
                                  type: "number",
                                  step: 1,
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
                                sx={{ width: 60 }}
                                inputProps={{
                                  min: 0,
                                  max: 20,
                                  type: "number",
                                  step: 1,
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
                                sx={{ width: 70 }}
                                inputProps={{
                                  min: 0,
                                  max: 1000,
                                  type: "number",
                                  step: 1,
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
                                sx={{ width: 70 }}
                                inputProps={{
                                  min: 0,
                                  max: 1000,
                                  type: "number",
                                  step: 1,
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
                              Current review load (currently reviewing)
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
                                sx={{ width: 60 }}
                                inputProps={{
                                  min: 0,
                                  max: 10,
                                  type: "number",
                                  step: 1,
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
                                inputProps={{
                                  min: 1900,
                                  max: 2024,
                                  type: "number",
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
                                inputProps={{
                                  min: 1900,
                                  max: 2024,
                                  type: "number",
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
                                sx={{ width: 60 }}
                                inputProps={{
                                  min: 0,
                                  max: 100,
                                  type: "number",
                                  step: 1,
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
                          label={<Typography variant="body2">Yes</Typography>}
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
                          label={<Typography variant="body2">Yes</Typography>}
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
              {/* Card List (stacked, horizontal cards) */}
              {loading ? (
                <Stack spacing={2}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} variant="outlined" sx={{ p: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton
                          variant="rectangular"
                          width={24}
                          height={24}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton width="30%" />
                          <Skeleton width="50%" />
                        </Box>
                        <Skeleton
                          variant="rectangular"
                          width={90}
                          height={32}
                        />
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
                        Try adjusting your search term or filters to find more
                        reviewers
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
              ) : (
                <>
                  {/* Default Suggestions Title (only shown when not searching) */}
                  {!searchTerm && (
                    <Box
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 700 }}
                        component="h2"
                      >
                        Default suggestions ({filteredReviewers.length})
                      </Typography>
                      <Tooltip
                        title={
                          <Box sx={{ p: 1 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ mb: 1, fontWeight: "bold" }}
                            >
                              How are default suggestions created?
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Phase 1: Analyze Manuscript</strong>
                              <br />
                              We start by extracting key concepts from your
                              manuscript&apos;s title and abstract to understand
                              its main topics.
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Phase 2: Match Expertise</strong>
                              <br />
                              PKG compares these topics with reviewer profiles
                              using semantic search and keyword matching, while
                              checking for conflicts of interest and recent
                              publications.
                            </Typography>
                            <Typography variant="body2">
                              <strong>Phase 3: Rank and Recommend</strong>
                              <br />
                              Reviewers are ranked based on topic relevance,
                              availability, and past response behavior.
                              You&apos;ll receive a ranked list with profiles
                              and reasons for each suggestion.
                            </Typography>
                          </Box>
                        }
                        arrow
                        placement="right"
                      >
                        <IconButton
                          size="small"
                          sx={{ color: "text.secondary" }}
                        >
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}

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
                </>
              )}
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
