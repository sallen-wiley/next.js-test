"use client";
import * as React from "react";
import {
  Paper,
  Typography,
  Grid,
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
  Drawer,
  FormControlLabel,
  Checkbox,
  Slider,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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
  onClearFilters,
  onViewProfile,
}: ReviewerSearchAndCardsProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);
  const [tempFilters, setTempFilters] =
    React.useState<ReviewerFilters>(filters);

  // Track which filters are actively enabled (to prevent unmounting during interaction)
  const [activeFilters, setActiveFilters] = React.useState({
    responseTime: filters.responseTimeMax > 0,
    reviewsLast12Months: filters.reviewsLast12Months > 0,
    totalReviews: filters.totalReviewsMin > 0 || filters.totalReviewsMax < 1000,
    assignedManuscripts: filters.assignedManuscriptsMax > 0,
    publicationRecency:
      filters.publicationYearFrom > 0 || filters.publicationYearTo > 0,
    publishedArticles: filters.publishedArticlesMin > 0,
  });

  // Sync tempFilters with filters prop
  React.useEffect(() => {
    setTempFilters(filters);
    setActiveFilters({
      responseTime: filters.responseTimeMax > 0,
      reviewsLast12Months: filters.reviewsLast12Months > 0,
      totalReviews:
        filters.totalReviewsMin > 0 || filters.totalReviewsMax < 1000,
      assignedManuscripts: filters.assignedManuscriptsMax > 0,
      publicationRecency:
        filters.publicationYearFrom > 0 || filters.publicationYearTo > 0,
      publishedArticles: filters.publishedArticlesMin > 0,
    });
  }, [filters]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFilterClick = () => {
    setFilterDrawerOpen(true);
  };

  const handleFilterClose = () => {
    setFilterDrawerOpen(false);
    setTempFilters(filters); // Reset to original filters on cancel
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setFilterDrawerOpen(false);
  };

  const handleResetFilters = () => {
    onClearFilters();
    setFilterDrawerOpen(false);
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
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Find Reviewer" />
          <Tab label="Bookmarked Reviewers" />
        </Tabs>
        <Button
          variant="text"
          color="primary"
          startIcon={<PersonAddIcon />}
          sx={{ textTransform: "none" }}
        >
          Invite Manually
        </Button>
      </Box>

      {/* Tab Panel: Find Reviewer */}
      {activeTab === 0 && (
        <Box sx={{ p: 3 }}>
          {/* Search & Filter Section */}
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 3, bgcolor: "background.default" }}
          >
            <Grid container spacing={1} alignItems="flex-end">
              <Grid size={{ xs: 12, md: "grow" }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Search for reviewers"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by keyword, email or name..."
                />
              </Grid>
              <Grid size={{ xs: 12, md: "auto" }}>
                <Button
                  variant="contained"
                  size="medium"
                  color="neutral"
                  endIcon={<FilterListIcon />}
                  onClick={handleFilterClick}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Filter Drawer */}
          <Drawer
            open={filterDrawerOpen}
            onClose={handleFilterClose}
            anchor="right"
            slotProps={{
              paper: {
                sx: {
                  width: { xs: "100vw", sm: 400, md: 420 },
                  maxWidth: "100%",
                },
              },
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              {/* Filter Header */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Filters
                </Typography>
                <Button
                  size="small"
                  onClick={handleResetFilters}
                  sx={{ textTransform: "none" }}
                >
                  Reset filters
                </Button>
              </Box>

              {/* Filter Content - Scrollable */}
              <Box sx={{ p: 2, flex: 1, overflow: "auto" }}>
                <Stack spacing={2}>
                  {/* Section 1: Demographics */}
                  <Stack spacing={2}>
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
                            checked={tempFilters.institutionalEmail}
                            onChange={(e) =>
                              setTempFilters({
                                ...tempFilters,
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
                          value={tempFilters.country}
                          onChange={(e) =>
                            setTempFilters({
                              ...tempFilters,
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
                              checked={activeFilters.responseTime}
                              onChange={(e) => {
                                setActiveFilters({
                                  ...activeFilters,
                                  responseTime: e.target.checked,
                                });
                                setTempFilters({
                                  ...tempFilters,
                                  responseTimeMax: e.target.checked ? 7 : 0,
                                });
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
                        {activeFilters.responseTime && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              mt: 1,
                              px: 1,
                            }}
                          >
                            <Box sx={{ flex: 1, display: "flex" }}>
                              <Slider
                                value={
                                  typeof tempFilters.responseTimeMax ===
                                  "number"
                                    ? Math.max(1, tempFilters.responseTimeMax)
                                    : 1
                                }
                                onChange={(_, value) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    responseTimeMax:
                                      typeof value === "number"
                                        ? Math.max(1, value)
                                        : 1,
                                  })
                                }
                                min={1}
                                max={30}
                                size="small"
                              />
                            </Box>
                            <TextField
                              size="small"
                              value={tempFilters.responseTimeMax}
                              onChange={(e) =>
                                setTempFilters({
                                  ...tempFilters,
                                  responseTimeMax:
                                    e.target.value === ""
                                      ? 1
                                      : Number(e.target.value),
                                })
                              }
                              onBlur={() => {
                                if (tempFilters.responseTimeMax < 1) {
                                  setTempFilters({
                                    ...tempFilters,
                                    responseTimeMax: 1,
                                  });
                                } else if (tempFilters.responseTimeMax > 30) {
                                  setTempFilters({
                                    ...tempFilters,
                                    responseTimeMax: 30,
                                  });
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
                        )}
                      </Box>

                      {/* Reviews in Last 12 Months */}
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={activeFilters.reviewsLast12Months}
                              onChange={(e) => {
                                setActiveFilters({
                                  ...activeFilters,
                                  reviewsLast12Months: e.target.checked,
                                });
                                setTempFilters({
                                  ...tempFilters,
                                  reviewsLast12Months: e.target.checked ? 5 : 0,
                                });
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
                        {activeFilters.reviewsLast12Months && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              mt: 1,
                              px: 1,
                            }}
                          >
                            <Box sx={{ flex: 1, display: "flex" }}>
                              <Slider
                                value={
                                  typeof tempFilters.reviewsLast12Months ===
                                  "number"
                                    ? Math.max(
                                        0,
                                        tempFilters.reviewsLast12Months
                                      )
                                    : 0
                                }
                                onChange={(_, value) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    reviewsLast12Months:
                                      typeof value === "number"
                                        ? Math.max(0, value)
                                        : 0,
                                  })
                                }
                                min={0}
                                max={20}
                                size="small"
                              />
                            </Box>
                            <TextField
                              size="small"
                              value={tempFilters.reviewsLast12Months}
                              onChange={(e) =>
                                setTempFilters({
                                  ...tempFilters,
                                  reviewsLast12Months:
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                })
                              }
                              onBlur={() => {
                                if (tempFilters.reviewsLast12Months < 0) {
                                  setTempFilters({
                                    ...tempFilters,
                                    reviewsLast12Months: 0,
                                  });
                                } else if (
                                  tempFilters.reviewsLast12Months > 20
                                ) {
                                  setTempFilters({
                                    ...tempFilters,
                                    reviewsLast12Months: 20,
                                  });
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
                        )}
                      </Box>

                      {/* Total Reviews Completed - Range Slider */}
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                tempFilters.totalReviewsMin > 0 ||
                                tempFilters.totalReviewsMax < 1000
                              }
                              onChange={(e) =>
                                setTempFilters({
                                  ...tempFilters,
                                  totalReviewsMin: e.target.checked ? 150 : 0,
                                  totalReviewsMax: e.target.checked
                                    ? 200
                                    : 1000,
                                })
                              }
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
                        {(tempFilters.totalReviewsMin > 0 ||
                          tempFilters.totalReviewsMax < 1000) && (
                          <Box sx={{ mt: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                                px: 1,
                              }}
                            >
                              <TextField
                                size="small"
                                value={tempFilters.totalReviewsMin}
                                onChange={(e) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    totalReviewsMin:
                                      e.target.value === ""
                                        ? 0
                                        : Number(e.target.value),
                                  })
                                }
                                onBlur={() => {
                                  if (tempFilters.totalReviewsMin < 0) {
                                    setTempFilters({
                                      ...tempFilters,
                                      totalReviewsMin: 0,
                                    });
                                  } else if (
                                    tempFilters.totalReviewsMin > 1000
                                  ) {
                                    setTempFilters({
                                      ...tempFilters,
                                      totalReviewsMin: 1000,
                                    });
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
                                    Math.max(0, tempFilters.totalReviewsMin),
                                    Math.min(
                                      1000,
                                      Math.max(0, tempFilters.totalReviewsMax)
                                    ),
                                  ]}
                                  onChange={(_, value) => {
                                    if (Array.isArray(value)) {
                                      const [min, max] = value;
                                      setTempFilters({
                                        ...tempFilters,
                                        totalReviewsMin: Math.max(
                                          0,
                                          Math.min(1000, min)
                                        ),
                                        totalReviewsMax: Math.max(
                                          0,
                                          Math.min(1000, max)
                                        ),
                                      });
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
                                value={tempFilters.totalReviewsMax}
                                onChange={(e) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    totalReviewsMax:
                                      e.target.value === ""
                                        ? 1000
                                        : Number(e.target.value),
                                  })
                                }
                                onBlur={() => {
                                  if (tempFilters.totalReviewsMax < 0) {
                                    setTempFilters({
                                      ...tempFilters,
                                      totalReviewsMax: 0,
                                    });
                                  } else if (
                                    tempFilters.totalReviewsMax > 1000
                                  ) {
                                    setTempFilters({
                                      ...tempFilters,
                                      totalReviewsMax: 1000,
                                    });
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
                          </Box>
                        )}
                      </Box>

                      {/* Assigned Manuscripts */}
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={activeFilters.assignedManuscripts}
                              onChange={(e) => {
                                setActiveFilters({
                                  ...activeFilters,
                                  assignedManuscripts: e.target.checked,
                                });
                                setTempFilters({
                                  ...tempFilters,
                                  assignedManuscriptsMax: e.target.checked
                                    ? 2
                                    : 0,
                                });
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Assigned manuscripts
                            </Typography>
                          }
                        />
                        {activeFilters.assignedManuscripts && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              mt: 1,
                              px: 1,
                            }}
                          >
                            <Box sx={{ flex: 1, display: "flex" }}>
                              <Slider
                                value={
                                  typeof tempFilters.assignedManuscriptsMax ===
                                  "number"
                                    ? Math.max(
                                        0,
                                        tempFilters.assignedManuscriptsMax
                                      )
                                    : 0
                                }
                                onChange={(_, value) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    assignedManuscriptsMax:
                                      typeof value === "number"
                                        ? Math.max(0, value)
                                        : 0,
                                  })
                                }
                                min={0}
                                max={10}
                                size="small"
                              />
                            </Box>
                            <TextField
                              size="small"
                              value={tempFilters.assignedManuscriptsMax}
                              onChange={(e) =>
                                setTempFilters({
                                  ...tempFilters,
                                  assignedManuscriptsMax:
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                })
                              }
                              onBlur={() => {
                                if (tempFilters.assignedManuscriptsMax < 0) {
                                  setTempFilters({
                                    ...tempFilters,
                                    assignedManuscriptsMax: 0,
                                  });
                                } else if (
                                  tempFilters.assignedManuscriptsMax > 10
                                ) {
                                  setTempFilters({
                                    ...tempFilters,
                                    assignedManuscriptsMax: 10,
                                  });
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
                        )}
                      </Box>
                    </Stack>
                  </Box>

                  <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}>
                    <Stack spacing={2}>
                      {/* Publication Recency - Range */}
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={activeFilters.publicationRecency}
                              onChange={(e) => {
                                setActiveFilters({
                                  ...activeFilters,
                                  publicationRecency: e.target.checked,
                                });
                                setTempFilters({
                                  ...tempFilters,
                                  publicationYearFrom: e.target.checked
                                    ? 2020
                                    : 0,
                                  publicationYearTo: e.target.checked
                                    ? 2025
                                    : 0,
                                });
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Publication recency
                            </Typography>
                          }
                        />
                        {activeFilters.publicationRecency && (
                          <Box sx={{ mt: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                                px: 1,
                              }}
                            >
                              <TextField
                                size="small"
                                value={tempFilters.publicationYearFrom}
                                onChange={(e) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    publicationYearFrom:
                                      e.target.value === ""
                                        ? 1900
                                        : Number(e.target.value),
                                  })
                                }
                                onBlur={() => {
                                  if (tempFilters.publicationYearFrom < 1900) {
                                    setTempFilters({
                                      ...tempFilters,
                                      publicationYearFrom: 1900,
                                    });
                                  } else if (
                                    tempFilters.publicationYearFrom > 2025
                                  ) {
                                    setTempFilters({
                                      ...tempFilters,
                                      publicationYearFrom: 2025,
                                    });
                                  }
                                }}
                                sx={{ width: 70 }}
                                inputProps={{
                                  min: 1900,
                                  max: 2025,
                                  type: "number",
                                  step: 1,
                                }}
                              />
                              <Box sx={{ flex: 1, display: "flex" }}>
                                <Slider
                                  value={[
                                    Math.max(
                                      1900,
                                      tempFilters.publicationYearFrom
                                    ),
                                    Math.min(
                                      2025,
                                      Math.max(
                                        1900,
                                        tempFilters.publicationYearTo
                                      )
                                    ),
                                  ]}
                                  onChange={(_, value) => {
                                    if (Array.isArray(value)) {
                                      const [from, to] = value;
                                      setTempFilters({
                                        ...tempFilters,
                                        publicationYearFrom: Math.max(
                                          1900,
                                          Math.min(2025, from)
                                        ),
                                        publicationYearTo: Math.max(
                                          1900,
                                          Math.min(2025, to)
                                        ),
                                      });
                                    }
                                  }}
                                  min={1900}
                                  max={2025}
                                  disableSwap
                                  size="small"
                                />
                              </Box>
                              <TextField
                                size="small"
                                value={tempFilters.publicationYearTo}
                                onChange={(e) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    publicationYearTo:
                                      e.target.value === ""
                                        ? 2025
                                        : Number(e.target.value),
                                  })
                                }
                                onBlur={() => {
                                  if (tempFilters.publicationYearTo < 1900) {
                                    setTempFilters({
                                      ...tempFilters,
                                      publicationYearTo: 1900,
                                    });
                                  } else if (
                                    tempFilters.publicationYearTo > 2025
                                  ) {
                                    setTempFilters({
                                      ...tempFilters,
                                      publicationYearTo: 2025,
                                    });
                                  }
                                }}
                                sx={{ width: 70 }}
                                inputProps={{
                                  min: 1900,
                                  max: 2025,
                                  type: "number",
                                  step: 1,
                                }}
                              />
                            </Box>
                          </Box>
                        )}
                      </Box>

                      {/* Number of Published Articles */}
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={activeFilters.publishedArticles}
                              onChange={(e) => {
                                setActiveFilters({
                                  ...activeFilters,
                                  publishedArticles: e.target.checked,
                                });
                                setTempFilters({
                                  ...tempFilters,
                                  publishedArticlesMin: e.target.checked
                                    ? 5
                                    : 0,
                                });
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Number of published articles
                            </Typography>
                          }
                        />
                        {activeFilters.publishedArticles && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              mt: 1,
                              px: 1,
                            }}
                          >
                            <Box sx={{ flex: 1, display: "flex" }}>
                              <Slider
                                value={
                                  typeof tempFilters.publishedArticlesMin ===
                                  "number"
                                    ? Math.max(
                                        0,
                                        tempFilters.publishedArticlesMin
                                      )
                                    : 0
                                }
                                onChange={(_, value) =>
                                  setTempFilters({
                                    ...tempFilters,
                                    publishedArticlesMin:
                                      typeof value === "number"
                                        ? Math.max(0, value)
                                        : 0,
                                  })
                                }
                                min={0}
                                max={100}
                                size="small"
                              />
                            </Box>
                            <TextField
                              size="small"
                              value={tempFilters.publishedArticlesMin}
                              onChange={(e) =>
                                setTempFilters({
                                  ...tempFilters,
                                  publishedArticlesMin:
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value),
                                })
                              }
                              onBlur={() => {
                                if (tempFilters.publishedArticlesMin < 0) {
                                  setTempFilters({
                                    ...tempFilters,
                                    publishedArticlesMin: 0,
                                  });
                                } else if (
                                  tempFilters.publishedArticlesMin > 100
                                ) {
                                  setTempFilters({
                                    ...tempFilters,
                                    publishedArticlesMin: 100,
                                  });
                                }
                              }}
                              sx={{ width: 60 }}
                              inputProps={{
                                min: 0,
                                max: 100,
                                type: "number",
                                step: 1,
                              }}
                            />
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
                              checked={tempFilters.publishedInJournal}
                              onChange={(e) =>
                                setTempFilters({
                                  ...tempFilters,
                                  publishedInJournal: e.target.checked,
                                })
                              }
                              size="small"
                              disabled
                            />
                          }
                          label={
                            <Typography variant="body2" color="text.secondary">
                              Yes (coming soon)
                            </Typography>
                          }
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
                              checked={tempFilters.inAuthorsGroup}
                              onChange={(e) =>
                                setTempFilters({
                                  ...tempFilters,
                                  inAuthorsGroup: e.target.checked,
                                })
                              }
                              size="small"
                              disabled
                            />
                          }
                          label={
                            <Typography variant="body2" color="text.secondary">
                              Yes (coming soon)
                            </Typography>
                          }
                        />
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              {/* Filter Footer - Fixed at bottom */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderTop: 1,
                  borderColor: "divider",
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  flexShrink: 0,
                  bgcolor: "background.paper",
                }}
              >
                <Button
                  onClick={handleFilterClose}
                  sx={{ textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApplyFilters}
                  sx={{ textTransform: "uppercase" }}
                >
                  Apply Filters
                </Button>
              </Box>
            </Box>
          </Drawer>

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
