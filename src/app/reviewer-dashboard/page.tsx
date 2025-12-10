"use client";
import * as React from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getUserManuscripts,
  getManuscriptInvitationStats,
} from "@/services/dataService";
import type { ManuscriptWithUserRole } from "@/lib/supabase";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { ArticleCard } from "./ArticleCard";
import { FilterRail, type FilterOption, type SelectOption } from "./FilterRail";
import { getStatusLabel, getStatusColor } from "@/utils/manuscriptStatus";
import type { ManuscriptTag } from "@/lib/supabase";

export default function ArticleListingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [manuscripts, setManuscripts] = useState<ManuscriptWithUserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [invitationStatsMap, setInvitationStatsMap] = useState<
    Map<
      string,
      {
        invited: number;
        agreed: number;
        declined: number;
        submitted: number;
      }
    >
  >(new Map());

  const [filters, setFilters] = useState({
    journal: "all",
    status: "all",
    scope: "assigned",
    priority: "action-required",
    tags: [] as ManuscriptTag[],
  });

  useHeaderConfig({
    logoAffix: "Review",
    containerProps: { maxWidth: false },
  });

  React.useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const userManuscripts = await getUserManuscripts(user.id);
        setManuscripts(userManuscripts);

        // Fetch invitation stats for all manuscripts
        const manuscriptIds = userManuscripts.map((m) => m.id);
        const statsMap = await getManuscriptInvitationStats(manuscriptIds);
        setInvitationStatsMap(statsMap);
      } catch (error) {
        console.error("Error fetching manuscripts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  // Scroll to top when page changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const journalOptions: SelectOption[] = useMemo(() => {
    const unique = Array.from(new Set(manuscripts.map((m) => m.journal)));
    return [
      { label: "All", value: "all" },
      ...unique.map((j) => ({ label: j, value: j })),
    ];
  }, [manuscripts]);

  const statusOptions: SelectOption[] = useMemo(() => {
    const unique = Array.from(new Set(manuscripts.map((m) => m.status)));
    return [
      { label: "All", value: "all" },
      ...unique.map((s) => ({ label: s.replace(/_/g, " "), value: s })),
    ];
  }, [manuscripts]);

  const scopeOptions: FilterOption[] = useMemo(
    () => [
      {
        label: "My assigned manuscripts",
        value: "assigned",
        count: manuscripts.length,
      },
      { label: "All manuscripts", value: "all", count: manuscripts.length },
    ],
    [manuscripts.length]
  );

  const priorityOptions: FilterOption[] = [
    {
      label: "Action required",
      value: "action-required",
      count: manuscripts.length,
    },
    { label: "In progress", value: "in-progress", count: 0 },
    { label: "Finalized", value: "finalized", count: 0 },
    { label: "All", value: "all", count: manuscripts.length },
  ];

  const filteredManuscripts = useMemo(() => {
    const filtered = manuscripts.filter((m) => {
      const journalMatch =
        filters.journal === "all" || m.journal === filters.journal;
      const statusMatch =
        filters.status === "all" || m.status === filters.status;
      const tagsMatch =
        filters.tags.length === 0 ||
        filters.tags.some((tag) => m.manuscript_tags?.includes(tag));
      return journalMatch && statusMatch && tagsMatch;
    });

    // Sort by updated_at timestamp (fallback to submission_date if updated_at is not available)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.updated_at || a.submission_date).getTime();
      const dateB = new Date(b.updated_at || b.submission_date).getTime();
      return sort === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [manuscripts, filters, sort]);
  const ITEMS_PER_PAGE = 10;
  const paginatedManuscripts = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredManuscripts.slice(startIndex, endIndex);
  }, [filteredManuscripts, page]);

  const handleReset = () => {
    setFilters({
      journal: "all",
      status: "all",
      scope: "assigned",
      priority: "action-required",
      tags: [],
    });
    setSort("latest");
    setPage(1);
  };

  const handleViewArticle = (manuscriptId: string) => {
    router.push(`/reviewer-dashboard/${manuscriptId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (manuscripts.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" fontWeight={600} sx={{ mb: 3 }}>
          My Articles
        </Typography>
        <Alert severity="info">
          No manuscripts assigned to you. Please contact an administrator.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3, lg: 3 }}>
          <FilterRail
            journalOptions={journalOptions}
            statusOptions={statusOptions}
            scopeOptions={scopeOptions}
            priorityOptions={priorityOptions}
            selectedJournal={filters.journal}
            selectedStatus={filters.status}
            selectedScope={filters.scope}
            selectedPriority={filters.priority}
            selectedTags={filters.tags}
            onJournalChange={(value) =>
              setFilters((prev) => ({ ...prev, journal: value }))
            }
            onStatusChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
            onScopeChange={(value) =>
              setFilters((prev) => ({ ...prev, scope: value }))
            }
            onPriorityChange={(value) =>
              setFilters((prev) => ({ ...prev, priority: value }))
            }
            onTagsChange={(tags) => setFilters((prev) => ({ ...prev, tags }))}
            onReset={handleReset}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 9, lg: 9 }}>
          <Stack spacing={2} sx={{ px: { xs: 0, md: 2 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="subtitle1" fontWeight={700}>
                  Action Required
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing manuscripts{" "}
                  {filteredManuscripts.length > 0 ? "1" : "0"}-
                  {filteredManuscripts.length} of {filteredManuscripts.length}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ minWidth: 220 }}
              >
                <FormLabel
                  sx={{
                    color: "text.secondary",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Sort by:
                </FormLabel>
                <FormControl size="small" fullWidth>
                  <Select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    <MenuItem value="latest">
                      Last updated (latest first)
                    </MenuItem>
                    <MenuItem value="oldest">
                      Last updated (oldest first)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>

            <Stack spacing={2}>
              {paginatedManuscripts.map((manuscript) => {
                const submittedDate = new Date(manuscript.submission_date);
                const submittedFormatted =
                  submittedDate.toLocaleDateString("en-GB");
                const academicEditors =
                  manuscript.assignedEditors?.map(
                    (editor) => editor.full_name || editor.email
                  ) || [];

                // Get real invitation stats for this manuscript
                const stats = invitationStatsMap.get(manuscript.id) || {
                  invited: 0,
                  agreed: 0,
                  declined: 0,
                  submitted: 0,
                };

                return (
                  <ArticleCard
                    key={manuscript.id}
                    id={manuscript.id.split("-")[0]}
                    title={manuscript.title}
                    authors={manuscript.authors}
                    articleType={manuscript.subject_area || "Research Article"}
                    academicEditors={academicEditors}
                    journal={manuscript.journal}
                    submittedOn={`${submittedFormatted}`}
                    stateLabel={getStatusLabel(manuscript.status)}
                    stateCode={`V${manuscript.version || 1}`}
                    stateColor={getStatusColor(manuscript.status)}
                    manuscriptTags={manuscript.manuscript_tags}
                    reviewerStats={stats}
                    onClick={() => handleViewArticle(manuscript.id)}
                  />
                );
              })}
            </Stack>

            <Box display="flex" justifyContent="flex-end" sx={{ pt: 1 }}>
              <Pagination
                count={Math.max(
                  1,
                  Math.ceil(filteredManuscripts.length / ITEMS_PER_PAGE)
                )}
                page={page}
                onChange={(_event, value) => setPage(value)}
                variant="outlined"
                shape="rounded"
                size="small"
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
