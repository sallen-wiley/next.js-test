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
  ReviewInvitationWithReviewer,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import QueueIcon from "@mui/icons-material/Queue";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

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
  const [invitations, setInvitations] = React.useState<
    ReviewInvitationWithReviewer[]
  >([]);
  const [queue, setQueue] = React.useState<InvitationQueueItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Configure header
  useHeaderConfig({
    logoAffix: "Review",
    containerProps: { maxWidth: false },
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
          startIcon={<ArrowBackIcon />}
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
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/reviewer-dashboard")}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const hasInvitedReviewers = invitations.length > 0;

  // Helper functions for invitation status display
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "pending":
        return "warning";
      case "declined":
        return "error";
      case "expired":
        return "default";
      case "completed":
        return "info";
      case "report_submitted":
        return "success";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircleIcon fontSize="small" />;
      case "pending":
        return <PendingIcon fontSize="small" />;
      case "declined":
        return <CancelIcon fontSize="small" />;
      case "report_submitted":
        return <AssignmentTurnedInIcon fontSize="small" />;
      default:
        return <MailOutlineIcon fontSize="small" />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back Navigation and Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/reviewer-dashboard")}
          size="small"
        >
          Back to Dashboard
        </Button>
        <Typography variant="body2" color="text.secondary">
          DASHBOARD / ARTICLE DETAILS
        </Typography>
      </Box>

      {/* Page Title */}
      <Typography variant="h4" component="h1" fontWeight={600} sx={{ mb: 3 }}>
        Article Details
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
              <Stack spacing={3}>
                {/* Sent Invitations Table */}
                {hasInvitedReviewers && (
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <MailOutlineIcon color="primary" />
                      Sent Invitations ({invitations.length})
                    </Typography>
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Reviewer</TableCell>
                            <TableCell>Invited Date</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell>Response Date</TableCell>
                            <TableCell>Due Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {invitations.map((invitation) => (
                            <TableRow key={invitation.id} hover>
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography variant="body2" fontWeight={500}>
                                    {invitation.reviewer_name}
                                  </Typography>
                                  {invitation.reviewer_affiliation && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {invitation.reviewer_affiliation}
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption">
                                  {new Date(
                                    invitation.invited_date
                                  ).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  icon={getStatusIcon(invitation.status)}
                                  label={invitation.status}
                                  color={
                                    getStatusColor(invitation.status) as
                                      | "success"
                                      | "warning"
                                      | "error"
                                      | "info"
                                      | "default"
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption">
                                  {invitation.response_date
                                    ? new Date(
                                        invitation.response_date
                                      ).toLocaleDateString()
                                    : "—"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption">
                                  {new Date(
                                    invitation.due_date
                                  ).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Queue Table */}
                {queue.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <QueueIcon color="primary" />
                      Invitation Queue ({queue.length})
                    </Typography>
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell width={80}>Position</TableCell>
                            <TableCell>Reviewer</TableCell>
                            <TableCell>Affiliation</TableCell>
                            <TableCell>Scheduled Send</TableCell>
                            <TableCell align="center">Priority</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {queue
                            .sort((a, b) => a.queue_position - b.queue_position)
                            .map((item) => (
                              <TableRow key={item.id} hover>
                                <TableCell>
                                  <Chip
                                    label={item.queue_position}
                                    color="primary"
                                    size="small"
                                    sx={{ fontWeight: "bold" }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Avatar
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        fontSize: "0.875rem",
                                      }}
                                    >
                                      {item.reviewer_name
                                        ? item.reviewer_name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                        : "?"}
                                    </Avatar>
                                    <Typography
                                      variant="body2"
                                      fontWeight={500}
                                    >
                                      {item.reviewer_name || "Unknown"}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {item.reviewer_affiliation || "—"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption">
                                    {new Date(
                                      item.scheduled_send_date
                                    ).toLocaleDateString()}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={item.priority}
                                    color={
                                      item.priority === "high"
                                        ? "error"
                                        : item.priority === "normal"
                                        ? "default"
                                        : "info"
                                    }
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Manage Reviewers Button */}
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleManageReviewers}
                  >
                    Manage Reviewers
                  </Button>
                </Box>
              </Stack>
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
