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
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import QueueIcon from "@mui/icons-material/Queue";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { ArticleCard } from "../ArticleCard";
import { ArticleDetailsCard } from "../ArticleDetailsCard";
import { InvitedReviewerCard } from "../InvitedReviewerCard";
import { getStatusLabel, getStatusColor } from "@/utils/manuscriptStatus";

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

  // Accordion expansion state
  const [expandedAccordions, setExpandedAccordions] = React.useState({
    reviewers: true,
    decision: false,
    activityLog: false,
  });

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

  // Helper function to calculate reviewer stats from invitations
  const getReviewerStats = () => {
    const invited = invitations.length;
    const agreed = invitations.filter(
      (inv) => inv.status === "accepted"
    ).length;
    const declined = invitations.filter(
      (inv) => inv.status === "declined"
    ).length;
    const submitted = invitations.filter(
      (inv) => inv.status === "report_submitted" || inv.status === "completed"
    ).length;

    return { invited, agreed, declined, submitted };
  };

  // Helper functions for invitation status display (for table)
  const getInvitationStatusColor = (status: string) => {
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

  const hasInvitedReviewers = invitations.length > 0;
  const reviewerStats = getReviewerStats();

  // Format submission date for display
  const submittedDate = new Date(manuscript.submission_date);
  const submittedFormatted = submittedDate.toLocaleDateString("en-GB");

  // Format updated date
  const updatedDate = manuscript.updated_at
    ? new Date(manuscript.updated_at)
    : submittedDate;
  const updatedFormatted = updatedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Get academic editors from manuscript
  const academicEditors =
    manuscript.assignedEditors?.map(
      (editor) => editor.full_name || editor.email
    ) || [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Navigation and Meta Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        {/* Left: Back button and breadcrumb */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/reviewer-dashboard")}
            size="small"
          >
            Back
          </Button>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            Dashboard / Article Details
          </Typography>
        </Box>

        {/* Right: Meta actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton size="small" aria-label="view">
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" aria-label="download">
            <DownloadOutlinedIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            Updated on {updatedFormatted}
          </Typography>
          <Select
            value={manuscript.version || 1}
            size="small"
            sx={{ minWidth: 100 }}
          >
            <MenuItem value={manuscript.version || 1}>
              Version {manuscript.version || 1}
            </MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Article Details Card with integrated additional information */}
      <Box sx={{ mb: 3 }}>
        <ArticleDetailsCard
          id={manuscript.id.split("-")[0]}
          title={manuscript.title}
          authors={manuscript.authors}
          abstract={manuscript.abstract}
          badges={[]}
          articleType={manuscript.subject_area || "Research Article"}
          section="Physical, Chemical and Earth Sciences"
          specialIssue="Advanced PHWR Safety Technology: PHWR Challenging Issues for Safe Operation and Long-Term Sustainability"
          triageEditor="Tedi Smith"
          academicEditor={
            academicEditors.length > 0
              ? academicEditors.join(", ")
              : "Unassigned"
          }
          journal={manuscript.journal}
          submittedOn={submittedFormatted}
          stateLabel={getStatusLabel(manuscript.status)}
          stateCode={`V${manuscript.version || 1}`}
          stateColor={getStatusColor(manuscript.status)}
          manuscriptTags={manuscript.manuscript_tags}
        />
      </Box>

      {/* Reviewers Section */}
      <Accordion
        expanded={expandedAccordions.reviewers}
        onChange={() =>
          setExpandedAccordions((prev) => ({
            ...prev,
            reviewers: !prev.reviewers,
          }))
        }
        sx={{ mb: 3 }}
      >
        <AccordionSummary
          expandIcon={null}
          sx={{
            bgcolor: "background.default",
            flexDirection: "row",
            "& .MuiAccordionSummary-content": {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              my: 1.5,
            },
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Custom expand icon on the left */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "secondary.main",
              }}
            >
              {expandedAccordions.reviewers ? <RemoveIcon /> : <AddIcon />}
            </Box>
            <Typography fontWeight={500}>Reviewers</Typography>
          </Stack>
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
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {/* Header row with counts */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              px: 2,
              pt: 3,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Invited Reviewers ({invitations.length})
            </Typography>
            {queue.length > 0 && (
              <Button
                variant="text"
                color="secondary"
                size="small"
                sx={{ textTransform: "none" }}
                onClick={() =>
                  router.push(
                    `/reviewer-dashboard/manage-reviewers?manuscriptId=${manuscript?.id}&tab=queue`
                  )
                }
              >
                View Queued Reviewers ({queue.length})
              </Button>
            )}
          </Box>

          {!hasInvitedReviewers && queue.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                px: 2,
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
            <>
              {/* Invited Reviewer Cards */}
              {hasInvitedReviewers && (
                <Box sx={{ px: 2 }}>
                  <Stack spacing={2}>
                    {invitations.map((invitation) => {
                      // Calculate time left for pending invitations
                      const invitedDate = new Date(invitation.invited_date);
                      const dueDate = new Date(invitation.due_date);
                      const today = new Date();
                      const daysUntilDue = Math.ceil(
                        (dueDate.getTime() - today.getTime()) /
                          (1000 * 60 * 60 * 24)
                      );

                      return (
                        <InvitedReviewerCard
                          key={invitation.id}
                          reviewerName={invitation.reviewer_name || "Unknown"}
                          affiliation={invitation.reviewer_affiliation}
                          status={invitation.status}
                          invitedDate={invitedDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          responseDate={
                            invitation.response_date
                              ? new Date(
                                  invitation.response_date
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : undefined
                          }
                          dueDate={dueDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          timeLeftToRespond={
                            invitation.status === "pending"
                              ? `${daysUntilDue} days`
                              : undefined
                          }
                          reportSubmissionDeadline={
                            invitation.status === "accepted"
                              ? `${daysUntilDue} days left`
                              : undefined
                          }
                          daysLeft={
                            invitation.status === "accepted"
                              ? daysUntilDue
                              : undefined
                          }
                          onForceAccept={() =>
                            console.log("Force accept", invitation.id)
                          }
                          onForceDecline={() =>
                            console.log("Force decline", invitation.id)
                          }
                          onRevokeInvitation={() =>
                            console.log("Revoke", invitation.id)
                          }
                          onRemoveInvitation={() =>
                            console.log("Remove", invitation.id)
                          }
                          onReadReport={() =>
                            console.log("Read report", invitation.id)
                          }
                          onViewProfile={() =>
                            console.log("View profile", invitation.reviewer_id)
                          }
                          onExtendDeadline={() =>
                            console.log("Extend deadline", invitation.id)
                          }
                        />
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {/* Footer with Manage Reviewers Button */}
              <Box
                sx={{
                  bgcolor: "background.default",
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleManageReviewers}
                >
                  Manage Reviewers
                </Button>
              </Box>
            </>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Editorial Decision Section */}
      <Accordion
        expanded={expandedAccordions.decision}
        onChange={() =>
          setExpandedAccordions((prev) => ({
            ...prev,
            decision: !prev.decision,
          }))
        }
        sx={{ mb: 3 }}
      >
        <AccordionSummary
          expandIcon={null}
          sx={{
            bgcolor: "background.default",
            flexDirection: "row",
            "& .MuiAccordionSummary-content": {
              display: "flex",
              alignItems: "center",
              my: 1.5,
            },
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "secondary.main",
              }}
            >
              {expandedAccordions.decision ? <RemoveIcon /> : <AddIcon />}
            </Box>
            <Typography fontWeight={500}>Your Editorial Decision</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary">
            Editorial decision interface will appear here.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Activity Log Section */}
      <Accordion
        expanded={expandedAccordions.activityLog}
        onChange={() =>
          setExpandedAccordions((prev) => ({
            ...prev,
            activityLog: !prev.activityLog,
          }))
        }
      >
        <AccordionSummary
          expandIcon={null}
          sx={{
            bgcolor: "background.default",
            flexDirection: "row",
            "& .MuiAccordionSummary-content": {
              display: "flex",
              alignItems: "center",
              my: 1.5,
            },
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "secondary.main",
              }}
            >
              {expandedAccordions.activityLog ? <RemoveIcon /> : <AddIcon />}
            </Box>
            <Typography fontWeight={500}>Activity Log</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary">
            Activity log will appear here.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
