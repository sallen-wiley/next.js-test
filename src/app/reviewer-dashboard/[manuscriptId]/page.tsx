"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getManuscriptById,
  getManuscriptInvitations,
  getManuscriptQueue,
} from "@/services/dataService";
import type {
  Manuscript,
  ReviewInvitation,
  InvitationQueueItem,
} from "@/lib/supabase";

import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArticleIcon from "@mui/icons-material/Article";

export default function ArticleDetailsPage({
  params,
}: {
  params: Promise<{ manuscriptId: string }>;
}) {
  const router = useRouter();
  const { user } = useAuth();

  // Unwrap params Promise (Next.js 15 requirement)
  const unwrappedParams = React.use(params);
  const manuscriptId = unwrappedParams.manuscriptId;

  const [manuscript, setManuscript] = React.useState<Manuscript | null>(null);
  const [invitations, setInvitations] = React.useState<ReviewInvitation[]>([]);
  const [queue, setQueue] = React.useState<InvitationQueueItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Configure header
  useHeaderConfig({
    logoAffix: "Article Details",
    containerProps: { maxWidth: "lg" },
  });

  // Fetch manuscript by ID from params
  React.useEffect(() => {
    async function fetchData() {
      if (!user?.id || !manuscriptId) return;

      setLoading(true);
      setError(null);
      try {
        const manuscriptData = await getManuscriptById(manuscriptId);
        if (!manuscriptData) {
          setError("Manuscript not found");
          return;
        }

        setManuscript(manuscriptData);

        // Fetch invitations and queue for this manuscript
        const [invites, queueItems] = await Promise.all([
          getManuscriptInvitations(manuscriptId),
          getManuscriptQueue(manuscriptId),
        ]);
        setInvitations(invites);
        setQueue(queueItems);
      } catch (error) {
        console.error("Error fetching manuscript:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load manuscript"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, manuscriptId]);

  const handleManageReviewers = () => {
    if (manuscript) {
      router.push(
        `/reviewer-dashboard/manage-reviewers?manuscriptId=${manuscript.id}`
      );
    }
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArticleIcon />}
          onClick={() => router.push("/reviewer-dashboard")}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!manuscript) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="info">
          No manuscript found. Please contact an administrator.
        </Alert>
        <Button
          startIcon={<ArticleIcon />}
          onClick={() => router.push("/reviewer-dashboard")}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const invitedCount = invitations.filter(
    (inv) => inv.status !== "declined"
  ).length;
  const hasInvitedReviewers = invitedCount > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Navigation */}
      <Button
        startIcon={<ArticleIcon />}
        onClick={() => router.push("/reviewer-dashboard")}
        sx={{ mb: 2 }}
      >
        BACK
      </Button>

      {/* Breadcrumb */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        DASHBOARD / ARTICLE DETAILS
      </Typography>

      {/* Article Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "background.paper" }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
          sx={{ mb: 2 }}
        >
          <Box>
            <Chip
              label={`ID ${manuscript.id.split("-")[0]}`}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label="COMMISSIONED"
              size="small"
              sx={{ mr: 1 }}
              color="primary"
            />
            <Chip label="TRANSFERRED" size="small" />
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Typography variant="caption" color="text.secondary">
              Updated on{" "}
              {new Date(manuscript.submission_date).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }
              )}
            </Typography>
          </Box>
        </Stack>

        <Typography variant="h5" component="h1" fontWeight={600} sx={{ mb: 2 }}>
          {manuscript.title}
        </Typography>

        {/* Authors */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {manuscript.authors.map((author, index) => (
            <Chip
              key={index}
              label={author}
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>

        {/* Metadata Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Article Type
            </Typography>
            <Typography variant="body1">Expression of Concern</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Section
            </Typography>
            <Typography variant="body1">{manuscript.subject_area}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Journal
            </Typography>
            <Typography variant="body1">{manuscript.journal}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Special Issue
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {manuscript.submission_date}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Triage Editor
            </Typography>
            <Typography variant="body1">{manuscript.editor_id}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Academic Editor
            </Typography>
            <Typography variant="body1">Sarah Prist</Typography>
          </Box>
          <Box sx={{ gridColumn: "span 2" }}>
            <Typography variant="body2" color="text.secondary">
              Submitted on
            </Typography>
            <Typography variant="body1">
              {new Date(manuscript.submission_date).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}{" "}
              (
              {Math.floor(
                (Date.now() - new Date(manuscript.submission_date).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days)
            </Typography>
          </Box>
        </Box>

        {/* Collapsible Sections */}
        <Box sx={{ mt: 3 }}>
          <Accordion defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={500}>Abstract</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{manuscript.abstract}</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={500}>Author Declaration</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                Author declarations will appear here.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={500}>Files</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                Manuscript files will appear here.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>

      {/* Reviewers Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "background.paper" }}>
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={2} alignItems="center" width="100%">
              <Typography fontWeight={500}>Reviewers</Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Reports: <strong>0</strong> Submitted
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>1</strong> Overdue
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>2</strong> Invalidated
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Invitations: <strong>0</strong> Queued
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>0</strong> Accepted
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>0</strong> Pending
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>0</strong> Declined
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>0</strong> Expired
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>0</strong> Revoked
                </Typography>
              </Box>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            {!hasInvitedReviewers && queue.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 6,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  No reviewers invited yet.
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleManageReviewers}
                  sx={{ minWidth: 180 }}
                >
                  Manage Reviewers
                </Button>
              </Box>
            ) : (
              <Box>
                {hasInvitedReviewers && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {invitedCount} reviewer{invitedCount !== 1 ? "s" : ""}{" "}
                    invited
                  </Typography>
                )}
                {queue.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ mb: 1 }}
                    >
                      Queued Invitations ({queue.length})
                    </Typography>
                    <Stack spacing={1}>
                      {queue.map((item) => (
                        <Paper
                          key={item.id}
                          elevation={0}
                          sx={{
                            p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "background.default",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {item.reviewer_name}
                            </Typography>
                            <Chip
                              label={`Priority: ${item.priority}`}
                              size="small"
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Scheduled:{" "}
                              {new Date(
                                item.scheduled_send_date
                              ).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleManageReviewers}
                >
                  Manage Reviewers
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Additional Sections */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "background.paper" }}>
        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={500}>Your Editorial Decision</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              Editorial decision interface will appear here.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, bgcolor: "background.paper" }}>
        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={500}>Activity Log</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              Activity log will appear here.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Container>
  );
}
