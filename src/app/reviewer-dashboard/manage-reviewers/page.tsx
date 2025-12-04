"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserProfile } from "@/hooks/useRoles";
import {
  getManuscriptById,
  getManuscriptQueue,
  addToQueue,
  getManuscriptReviewers,
  getManuscriptInvitations,
  getAllReviewers,
  getReviewersWithStatus,
  revokeInvitation,
  removeInvitation,
  updateInvitationStatus,
  moveInQueue,
  removeFromQueue,
  getQueueControlState,
  toggleQueueActive,
  sendInvitation,
} from "@/services/dataService";
import UnifiedQueueTab from "./UnifiedQueueTab";
import ReviewerActionMenu from "./ReviewerActionMenu";
import type {
  Manuscript,
  InvitationQueueItem,
  PotentialReviewer,
  PotentialReviewerWithMatch,
  ReviewInvitation,
  ReviewerWithStatus,
  QueueControlState,
} from "@/lib/supabase";

// LogRocket type declaration
declare global {
  interface Window {
    LogRocket?: {
      identify: (
        userId: string,
        userTraits: Record<string, string | number | boolean>
      ) => void;
      init: (appId: string) => void;
    };
  }
}
import {
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  Avatar,
  Alert,
  Tabs,
  Tab,
  Badge,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import QueueIcon from "@mui/icons-material/Queue";
import FilterListIcon from "@mui/icons-material/FilterList";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";

// Mock data removed - using real database queries

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reviewer-tabpanel-${index}`}
      aria-labelledby={`reviewer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ReviewerInvitationDashboard() {
  // Authentication and user data
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { profile } = useUserProfile();

  // Get manuscript ID from URL params
  const manuscriptId = searchParams?.get("manuscriptId") || null;
  const [manuscript, setManuscript] = React.useState<Manuscript | null>(null);

  // LogRocket user identification
  React.useEffect(() => {
    if (user && profile && typeof window !== "undefined" && window.LogRocket) {
      window.LogRocket.identify(user.id, {
        name: profile.full_name || profile.email.split("@")[0],
        email: profile.email,
        role: profile.role,
        department: profile.department || "Unknown",
        isActive: profile.is_active,
        // Add custom variables for this dashboard context
        currentPage: "reviewer-dashboard-manage",
        manuscriptId: manuscriptId || "unknown",
        userAgent: navigator.userAgent,
        createdAt: profile.created_at,
        lastLogin: profile.last_login || "Never",
      });
    }
  }, [user, profile, manuscriptId]);

  // Fetch manuscript data
  React.useEffect(() => {
    async function fetchManuscript() {
      if (!manuscriptId) {
        router.push("/reviewer-dashboard");
        return;
      }

      try {
        const data = await getManuscriptById(manuscriptId);
        if (data) {
          setManuscript(data);
        } else {
          setSnackbarMessage("Manuscript not found");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          router.push("/reviewer-dashboard");
        }
      } catch (error) {
        console.error("Error fetching manuscript:", error);
        setSnackbarMessage("Error loading manuscript");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }

    fetchManuscript();
  }, [manuscriptId, router]);

  // Fetch queue data when manuscript is loaded
  React.useEffect(() => {
    async function fetchQueue() {
      if (!manuscriptId) return;

      try {
        const queueData = await getManuscriptQueue(manuscriptId);
        setSimulatedQueue(queueData);
      } catch (error) {
        console.error("Error fetching queue:", error);
      }
    }

    fetchQueue();
  }, [manuscriptId]);

  // State for real database data
  const [suggestedReviewers, setSuggestedReviewers] = React.useState<
    PotentialReviewerWithMatch[]
  >([]);
  const [allReviewers, setAllReviewers] = React.useState<PotentialReviewer[]>(
    []
  );
  const [invitations, setInvitations] = React.useState<ReviewInvitation[]>([]);

  // Combined reviewers list: merge suggested reviewers with match scores and all other reviewers
  const potentialReviewers = React.useMemo(() => {
    // Create a map of reviewer IDs from suggested reviewers (these have match scores)
    const suggestedMap = new Map(
      suggestedReviewers.map((reviewer) => [reviewer.id, reviewer])
    );

    // Start with suggested reviewers
    const combined: PotentialReviewerWithMatch[] = [...suggestedReviewers];

    // Add reviewers from allReviewers that aren't in the suggested list
    allReviewers.forEach((reviewer) => {
      if (!suggestedMap.has(reviewer.id)) {
        combined.push({
          ...reviewer,
          match_score: 0, // Default score for reviewers without matches
        });
      }
    });

    return combined;
  }, [allReviewers, suggestedReviewers]);

  // Fetch suggested reviewers, invitations, and all reviewers when manuscript is loaded
  React.useEffect(() => {
    async function fetchReviewersData() {
      if (!manuscriptId) return;

      try {
        const [reviewersData, invitationsData, allReviewersData] =
          await Promise.all([
            getManuscriptReviewers(manuscriptId),
            getManuscriptInvitations(manuscriptId),
            getAllReviewers(), // Load all reviewers upfront for search functionality
          ]);
        setSuggestedReviewers(reviewersData);
        setInvitations(invitationsData);
        setAllReviewers(allReviewersData);
      } catch (error) {
        console.error("Error fetching reviewers:", error);
        showSnackbar("Failed to load reviewers", "error");
      }
    }

    fetchReviewersData();
  }, [manuscriptId]);

  // Fetch reviewers with status for unified queue/invitations view
  React.useEffect(() => {
    async function fetchReviewersWithStatusData() {
      if (!manuscriptId) return;

      try {
        const [statusData, queueControlData] = await Promise.all([
          getReviewersWithStatus(manuscriptId),
          getQueueControlState(manuscriptId),
        ]);
        setReviewersWithStatus(statusData);
        setQueueControl(queueControlData);
      } catch (error) {
        console.error("Error fetching reviewers with status:", error);
        showSnackbar("Failed to load reviewer status data", "error");
      }
    }

    fetchReviewersWithStatusData();
  }, [manuscriptId]);

  const [tabValue, setTabValue] = React.useState(0);
  const [sortBy, setSortBy] = React.useState<string>("match_score");
  const [filterAvailability, setFilterAvailability] = React.useState<string[]>([
    "available",
  ]);
  const [minMatchScore, setMinMatchScore] = React.useState<number>(70);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedReviewers, setSelectedReviewers] = React.useState<string[]>(
    []
  );

  // New state for unified queue/invitations view
  const [reviewersWithStatus, setReviewersWithStatus] = React.useState<
    ReviewerWithStatus[]
  >([]);
  const [queueControl, setQueueControl] =
    React.useState<QueueControlState | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const [selectedReviewerForAction, setSelectedReviewerForAction] =
    React.useState<ReviewerWithStatus | null>(null);

  // State for interactive features
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [simulatedQueue, setSimulatedQueue] = React.useState<
    InvitationQueueItem[]
  >([]);

  // Filter and sort reviewers
  const filteredReviewers = React.useMemo(() => {
    // Create a Set of reviewer IDs that are already invited or queued
    // Only exclude reviewers who have an actual invitation_status
    const invitedOrQueuedIds = new Set(
      reviewersWithStatus
        .filter((r) => r.invitation_status !== null)
        .map((r) => r.id)
    );

    const filtered = potentialReviewers.filter((reviewer) => {
      // Exclude reviewers who are already invited or queued
      if (invitedOrQueuedIds.has(reviewer.id)) {
        return false;
      }

      // Filter by availability
      if (
        filterAvailability.length > 0 &&
        !filterAvailability.includes(reviewer.availability_status)
      ) {
        return false;
      }

      // Filter by minimum match score only if there's no search term
      // When searching, we want to include all reviewers regardless of match score
      if (!searchTerm && reviewer.match_score < minMatchScore) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          reviewer.name.toLowerCase().includes(search) ||
          reviewer.affiliation.toLowerCase().includes(search) ||
          reviewer.expertise_areas.some((area) =>
            area.toLowerCase().includes(search)
          )
        );
      }

      return true;
    });

    // Sort reviewers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "match_score":
          return b.match_score - a.match_score;
        case "response_rate":
          return b.response_rate - a.response_rate;
        case "quality_score":
          return b.quality_score - a.quality_score;
        case "current_load":
          return a.current_review_load - b.current_review_load;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    potentialReviewers,
    reviewersWithStatus,
    sortBy,
    filterAvailability,
    minMatchScore,
    searchTerm,
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBackToArticle = () => {
    if (manuscriptId) {
      router.push(`/reviewer-dashboard/${manuscriptId}`);
    } else {
      router.push("/reviewer-dashboard");
    }
  };

  const handleReviewerSelect = (reviewerId: string) => {
    setSelectedReviewers((prev) =>
      prev.includes(reviewerId)
        ? prev.filter((id) => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  // Interactive functions for demo purposes
  const showSnackbar = (
    message: string,
    severity: "success" | "info" | "warning" | "error" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const showConfirmDialog = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleInviteReviewer = async (reviewerId: string) => {
    const reviewer = potentialReviewers.find((r) => r.id === reviewerId);
    if (!reviewer || !manuscriptId) return;

    showConfirmDialog(
      "Send Invitation",
      `Send review invitation to ${reviewer.name} (${reviewer.affiliation})?`,
      async () => {
        try {
          // Send the invitation to the database
          await sendInvitation(manuscriptId, reviewerId);

          // Remove from selected reviewers
          setSelectedReviewers((prev) =>
            prev.filter((id) => id !== reviewerId)
          );

          // Refresh the reviewers with status to show the new invitation
          await refreshReviewersWithStatus();

          showSnackbar(`Invitation sent to ${reviewer.name}`, "success");

          // Switch to invitations tab to show the result
          setTimeout(() => setTabValue(1), 1000);
        } catch (error) {
          console.error("Error sending invitation:", error);
          showSnackbar("Failed to send invitation", "error");
        }
      }
    );
  };

  // New handlers for unified queue/invitations tab
  const refreshReviewersWithStatus = async () => {
    if (!manuscriptId) return;
    try {
      const statusData = await getReviewersWithStatus(manuscriptId);
      setReviewersWithStatus(statusData);
    } catch (error) {
      console.error("Error refreshing reviewer status:", error);
    }
  };

  const handleActionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    reviewer: ReviewerWithStatus
  ) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedReviewerForAction(reviewer);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedReviewerForAction(null);
  };

  const handleMoveUp = async () => {
    if (!selectedReviewerForAction?.queue_id) return;

    try {
      await moveInQueue(selectedReviewerForAction.queue_id, "up");
      await refreshReviewersWithStatus();
      showSnackbar("Reviewer moved up in queue", "success");
    } catch (error: unknown) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to move reviewer",
        "error"
      );
    }
    handleActionMenuClose();
  };

  const handleMoveDown = async () => {
    if (!selectedReviewerForAction?.queue_id) return;

    try {
      await moveInQueue(selectedReviewerForAction.queue_id, "down");
      await refreshReviewersWithStatus();
      showSnackbar("Reviewer moved down in queue", "success");
    } catch (error: unknown) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to move reviewer",
        "error"
      );
    }
    handleActionMenuClose();
  };

  const handleRevokeInvitation = () => {
    if (!selectedReviewerForAction?.invitation_id) return;

    showConfirmDialog(
      "Revoke Invitation",
      `Revoke invitation to ${selectedReviewerForAction.name}? This will mark the invitation as expired.`,
      async () => {
        try {
          await revokeInvitation(
            selectedReviewerForAction.invitation_id!,
            false
          );
          await refreshReviewersWithStatus();
          showSnackbar("Invitation revoked", "success");
        } catch {
          showSnackbar("Failed to revoke invitation", "error");
        }
      }
    );
    handleActionMenuClose();
  };

  const handleRemoveFromQueue = () => {
    if (!selectedReviewerForAction?.queue_id) return;

    showConfirmDialog(
      "Remove from Queue",
      `Remove ${selectedReviewerForAction.name} from the invitation queue?`,
      async () => {
        try {
          await removeFromQueue(selectedReviewerForAction.queue_id!);
          await refreshReviewersWithStatus();
          showSnackbar("Removed from queue", "success");
        } catch {
          showSnackbar("Failed to remove from queue", "error");
        }
      }
    );
    handleActionMenuClose();
  };

  const handleInviteFromQueue = () => {
    if (!selectedReviewerForAction?.queue_id || !manuscriptId) return;

    showConfirmDialog(
      "Send Invitation",
      `Send invitation to ${selectedReviewerForAction.name} immediately? They will be removed from the queue.`,
      async () => {
        try {
          // First remove from queue
          await removeFromQueue(selectedReviewerForAction.queue_id!);

          // Then send invitation
          await sendInvitation(manuscriptId, selectedReviewerForAction.id);

          // Refresh the data
          await refreshReviewersWithStatus();
          showSnackbar(
            `Invitation sent to ${selectedReviewerForAction.name}`,
            "success"
          );
        } catch {
          showSnackbar("Failed to send invitation", "error");
        }
      }
    );
    handleActionMenuClose();
  };

  const handleRemoveInvitation = () => {
    if (!selectedReviewerForAction?.invitation_id) return;

    showConfirmDialog(
      "Remove Invitation",
      `Remove invitation for ${selectedReviewerForAction.name}? This will reset them back to the potential reviewers list.`,
      async () => {
        try {
          await removeInvitation(selectedReviewerForAction.invitation_id!);
          await refreshReviewersWithStatus();
          showSnackbar("Invitation removed", "success");
        } catch {
          showSnackbar("Failed to remove invitation", "error");
        }
      }
    );
    handleActionMenuClose();
  };

  const handleForceAccept = () => {
    if (!selectedReviewerForAction?.invitation_id) return;

    showConfirmDialog(
      "Force Accept Invitation",
      `Manually mark ${selectedReviewerForAction.name}'s invitation as accepted? This will set their status to "accepted" and assign a review due date.`,
      async () => {
        try {
          await updateInvitationStatus(
            selectedReviewerForAction.invitation_id!,
            "accepted"
          );
          await refreshReviewersWithStatus();
          showSnackbar(
            `${selectedReviewerForAction.name} marked as accepted`,
            "success"
          );
        } catch {
          showSnackbar("Failed to update invitation status", "error");
        }
      }
    );
    handleActionMenuClose();
  };

  const handleForceDecline = () => {
    if (!selectedReviewerForAction?.invitation_id) return;

    showConfirmDialog(
      "Force Decline Invitation",
      `Manually mark ${selectedReviewerForAction.name}'s invitation as declined?`,
      async () => {
        try {
          await updateInvitationStatus(
            selectedReviewerForAction.invitation_id!,
            "declined"
          );
          await refreshReviewersWithStatus();
          showSnackbar(
            `${selectedReviewerForAction.name} marked as declined`,
            "success"
          );
        } catch {
          showSnackbar("Failed to update invitation status", "error");
        }
      }
    );
    handleActionMenuClose();
  };

  const handleViewProfile = () => {
    // Placeholder for future implementation
    showSnackbar("Profile view coming soon", "info");
    handleActionMenuClose();
  };

  const handleReadReport = () => {
    // Placeholder for future implementation
    showSnackbar("Report viewer coming soon", "info");
    handleActionMenuClose();
  };

  const handleToggleQueue = async () => {
    if (!manuscriptId || !queueControl) return;

    const newState = !queueControl.queue_active;
    try {
      await toggleQueueActive(manuscriptId, newState);
      setQueueControl({ ...queueControl, queue_active: newState });
      showSnackbar(
        `Queue ${newState ? "activated" : "paused"}`,
        newState ? "success" : "info"
      );
    } catch {
      showSnackbar("Failed to toggle queue state", "error");
    }
  };

  const handleAddToQueue = (reviewerId: string) => {
    const reviewer = potentialReviewers.find((r) => r.id === reviewerId);
    if (!reviewer || !manuscriptId) return;

    showConfirmDialog(
      "Add to Queue",
      `Add ${reviewer.name} to the invitation queue?`,
      async () => {
        try {
          // Add to database
          const newQueueItem = await addToQueue(
            manuscriptId,
            reviewerId,
            "normal"
          );

          if (newQueueItem) {
            // Refresh the reviewers with status data
            await refreshReviewersWithStatus();

            // Update local state
            setSimulatedQueue((prev) => [...prev, newQueueItem]);
            setSelectedReviewers((prev) =>
              prev.filter((id) => id !== reviewerId)
            );
            showSnackbar(
              `${reviewer.name} added to queue (Position ${newQueueItem.queue_position})`,
              "info"
            );

            // Switch to queue tab to show the result
            setTimeout(() => setTabValue(1), 1000);
          }
        } catch (error) {
          console.error("Error adding to queue:", error);
          showSnackbar("Failed to add reviewer to queue", "error");
        }
      }
    );
  };

  const handleBatchInvite = () => {
    if (selectedReviewers.length === 0) return;

    const reviewerNames = selectedReviewers
      .map((id) => potentialReviewers.find((r) => r.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    showConfirmDialog(
      "Send Batch Invitations",
      `Send invitations to ${selectedReviewers.length} reviewers: ${reviewerNames}?`,
      () => {
        selectedReviewers.forEach((reviewerId) => {
          const newInvitation = {
            id: `inv-${Date.now()}-${reviewerId}`,
            manuscript_id: "ms-001",
            reviewer_id: reviewerId,
            invited_date: new Date().toISOString(),
            due_date: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "pending" as const,
            invitation_round: 1,
            reminder_count: 0,
            notes: "Batch invitation via dashboard",
          };

          setInvitations((prev) => [...prev, newInvitation]);
        });

        setSelectedReviewers([]);
        showSnackbar(`Sent ${selectedReviewers.length} invitations`, "success");
        setTimeout(() => setTabValue(1), 1000);
      }
    );
  };

  const handleBatchAddToQueue = () => {
    if (selectedReviewers.length === 0 || !manuscriptId) return;

    const reviewerNames = selectedReviewers
      .map((id) => potentialReviewers.find((r) => r.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    showConfirmDialog(
      "Add to Queue",
      `Add ${selectedReviewers.length} reviewers to queue: ${reviewerNames}?`,
      async () => {
        try {
          // Add all reviewers to queue
          const addPromises = selectedReviewers.map((reviewerId) =>
            addToQueue(manuscriptId, reviewerId, "normal")
          );

          const results: (InvitationQueueItem | null)[] = await Promise.all(
            addPromises
          );

          // Update local state with new queue items
          const newItems = results.filter(
            (item): item is InvitationQueueItem => item !== null
          );
          setSimulatedQueue((prev) => [...prev, ...newItems]);
          setSelectedReviewers([]);

          showSnackbar(`Added ${newItems.length} reviewers to queue`, "info");
          setTimeout(() => setTabValue(1), 1000);
        } catch (error) {
          console.error("Error batch adding to queue:", error);
          showSnackbar("Failed to add reviewers to queue", "error");
        }
      }
    );
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available":
        return "success";
      case "busy":
        return "warning";
      case "unavailable":
        return "error";
      case "sabbatical":
        return "info";
      default:
        return "default";
    }
  };

  // Configure header for reviewer dashboard
  useHeaderConfig({
    logoAffix: "Review",
    containerProps: { maxWidth: false },
  });

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToArticle}
                size="small"
              >
                Back to Article Details
              </Button>
              <Typography variant="body2" color="text.secondary">
                DASHBOARD / ARTICLE DETAILS / MANAGE REVIEWERS
              </Typography>
            </Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              Manage Reviewers
            </Typography>

            {/* Manuscript Details Card - Dynamic Data */}
            {manuscript && (
              <Card
                sx={{
                  mb: 3,
                  display: "flex",
                  borderRadius: 1.5,
                  overflow: "hidden",
                  borderLeft: "4px solid",
                  borderLeftColor: "primary.main",
                }}
              >
                <CardContent sx={{ flex: 1, p: 0, pb: "0 !important" }}>
                  {/* Header Section */}
                  <Box sx={{ p: 2, pb: 1 }}>
                    {/* Top Row - Status */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={manuscript.status
                          .toUpperCase()
                          .replace("_", " ")}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                          height: 20,
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                        }}
                      />
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      color="secondary"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        lineHeight: 1.5,
                        mb: 2,
                      }}
                    >
                      {manuscript.title}
                    </Typography>

                    {/* Authors Row */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.primary">
                        {manuscript.authors.join(", ")}
                      </Typography>
                    </Box>

                    {/* Details Row */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      {manuscript.subject_area && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700 }}
                            color="text.secondary"
                          >
                            Subject Area:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {manuscript.subject_area}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700 }}
                          color="text.secondary"
                        >
                          Editor ID:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {manuscript.editor_id}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Footer Section */}
                  <Box
                    sx={[
                      {
                        bgcolor: "background.default",
                        p: 2,
                        pt: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid",
                        borderTopColor: "divider",
                      },
                      (theme) =>
                        theme.applyStyles("dark", {
                          bgcolor: "action.hover",
                        }),
                    ]}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700 }}
                        color="text.secondary"
                      >
                        Journal:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {manuscript.journal}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700 }}
                        color="text.secondary"
                      >
                        Submitted on:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 400, color: "text.primary" }}
                      >
                        {new Date(
                          manuscript.submission_date
                        ).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              pt: 1,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="reviewer dashboard tabs"
            >
              <Tab
                label={
                  <Badge
                    badgeContent={filteredReviewers.length}
                    color="primary"
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonAddIcon fontSize="small" />
                      Potential Reviewers
                    </Box>
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge
                    badgeContent={
                      reviewersWithStatus.filter((r) => r.invitation_status)
                        .length
                    }
                    color="secondary"
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <QueueIcon fontSize="small" />
                      Queue & Invitations
                    </Box>
                  </Badge>
                }
              />
            </Tabs>
          </Box>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* Potential Reviewers Tab */}
          <Grid container spacing={3}>
            {/* Filters and Controls */}
            <Grid size={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <FilterListIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Search & Filter Reviewers
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Showing suggested reviewers with match scores by default.
                  Search to find any reviewer in the full database.
                </Alert>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="Search reviewers"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Name, affiliation, expertise..."
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Sort by</InputLabel>
                      <Select
                        value={sortBy}
                        label="Sort by"
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <MenuItem value="match_score">Match Score</MenuItem>
                        <MenuItem value="response_rate">Response Rate</MenuItem>
                        <MenuItem value="quality_score">Quality Score</MenuItem>
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
                          setFilterAvailability(e.target.value as string[])
                        }
                      >
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="busy">Busy</MenuItem>
                        <MenuItem value="unavailable">Unavailable</MenuItem>
                        <MenuItem value="sabbatical">Sabbatical</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      fullWidth
                      label="Min Match Score"
                      type="number"
                      value={minMatchScore}
                      onChange={(e) => setMinMatchScore(Number(e.target.value))}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        disabled={selectedReviewers.length === 0}
                        startIcon={<MailOutlineIcon />}
                        onClick={handleBatchInvite}
                      >
                        Invite Selected ({selectedReviewers.length})
                      </Button>
                      <Button
                        variant="outlined"
                        disabled={selectedReviewers.length === 0}
                        startIcon={<QueueIcon />}
                        onClick={handleBatchAddToQueue}
                      >
                        Add to Queue
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Reviewers Table */}
            <Grid size={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">Select</TableCell>
                      <TableCell>Reviewer</TableCell>
                      <TableCell align="center">Match Score</TableCell>
                      <TableCell align="center">Availability</TableCell>
                      <TableCell align="center">Current Load</TableCell>
                      <TableCell align="center">Response Rate</TableCell>
                      <TableCell align="center">Quality Score</TableCell>
                      <TableCell align="center">Avg Review Time</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReviewers.map((reviewer) => (
                      <TableRow
                        key={reviewer.id}
                        hover
                        sx={{
                          backgroundColor:
                            reviewer.conflicts_of_interest.length > 0
                              ? (theme) =>
                                  theme.vars?.palette?.error?.main
                                    ? `${theme.vars.palette.error.main}08`
                                    : "rgba(211, 47, 47, 0.03)"
                              : "inherit",
                          borderLeft:
                            reviewer.conflicts_of_interest.length > 0
                              ? (theme) =>
                                  `4px solid ${
                                    theme.vars?.palette?.error?.main ||
                                    "#d32f2f"
                                  }`
                              : "4px solid transparent",
                          "&:hover": {
                            backgroundColor:
                              reviewer.conflicts_of_interest.length > 0
                                ? (theme) =>
                                    theme.vars?.palette?.error?.main
                                      ? `${theme.vars.palette.error.main}12`
                                      : "rgba(211, 47, 47, 0.06)"
                                : (theme) =>
                                    theme.vars?.palette?.action?.hover ||
                                    "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Box
                            sx={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedReviewers.includes(reviewer.id)}
                              onChange={() => handleReviewerSelect(reviewer.id)}
                              disabled={
                                reviewer.conflicts_of_interest.length > 0
                              }
                              style={{
                                opacity:
                                  reviewer.conflicts_of_interest.length > 0
                                    ? 0.5
                                    : 1,
                                cursor:
                                  reviewer.conflicts_of_interest.length > 0
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            />
                            {reviewer.conflicts_of_interest.length > 0 && (
                              <CancelIcon
                                sx={{
                                  position: "absolute",
                                  top: "-2px",
                                  right: "-8px",
                                  fontSize: 16,
                                  color: "error.main",
                                  pointerEvents: "none",
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              {reviewer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  color:
                                    reviewer.conflicts_of_interest.length > 0
                                      ? "text.primary"
                                      : "inherit",
                                  opacity:
                                    reviewer.conflicts_of_interest.length > 0
                                      ? 0.8
                                      : 1,
                                }}
                              >
                                {reviewer.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color:
                                    reviewer.conflicts_of_interest.length > 0
                                      ? "text.secondary"
                                      : "text.secondary",
                                  opacity:
                                    reviewer.conflicts_of_interest.length > 0
                                      ? 0.7
                                      : 1,
                                }}
                              >
                                {reviewer.affiliation}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {reviewer.department}
                              </Typography>
                              <Box sx={{ mt: 0.5 }}>
                                {reviewer.expertise_areas
                                  .slice(0, 3)
                                  .map((area, index) => (
                                    <Chip
                                      key={index}
                                      label={area}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        mr: 0.5,
                                        mb: 0.5,
                                        fontSize: "0.7rem",
                                      }}
                                    />
                                  ))}
                              </Box>
                              {reviewer.conflicts_of_interest.length > 0 && (
                                <Chip
                                  label={`Conflict: ${reviewer.conflicts_of_interest.join(
                                    ", "
                                  )}`}
                                  color="error"
                                  size="small"
                                  icon={<CancelIcon />}
                                  sx={{
                                    mt: 1,
                                    fontWeight: 600,
                                    "& .MuiChip-label": {
                                      fontWeight: 600,
                                    },
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="h6" color="primary">
                              {reviewer.match_score}%
                            </Typography>
                            {reviewer.match_score >= 90 && (
                              <StarIcon color="warning" fontSize="small" />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={reviewer.availability_status}
                            color={
                              getAvailabilityColor(
                                reviewer.availability_status
                              ) as
                                | "success"
                                | "warning"
                                | "error"
                                | "info"
                                | "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box>
                            <Typography variant="body2">
                              {reviewer.current_review_load}/
                              {reviewer.max_review_capacity}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (reviewer.current_review_load /
                                  reviewer.max_review_capacity) *
                                100
                              }
                              sx={{ mt: 0.5, width: 40 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            color={
                              reviewer.response_rate >= 80
                                ? "success.main"
                                : "warning.main"
                            }
                          >
                            {reviewer.response_rate}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="primary">
                            {reviewer.quality_score}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {reviewer.average_review_time_days} days
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <Tooltip
                              title={
                                reviewer.conflicts_of_interest.length > 0
                                  ? "Cannot invite - Conflict of interest"
                                  : "Invite immediately"
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  disabled={
                                    reviewer.conflicts_of_interest.length > 0
                                  }
                                  onClick={() =>
                                    handleInviteReviewer(reviewer.id)
                                  }
                                  sx={{
                                    "&.Mui-disabled": {
                                      color: (theme) =>
                                        theme.vars?.palette?.error?.main ||
                                        "#d32f2f",
                                      opacity: 0.8,
                                    },
                                  }}
                                >
                                  <MailOutlineIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip
                              title={
                                reviewer.conflicts_of_interest.length > 0
                                  ? "Cannot queue - Conflict of interest"
                                  : "Add to queue"
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  color="secondary"
                                  disabled={
                                    reviewer.conflicts_of_interest.length > 0
                                  }
                                  onClick={() => handleAddToQueue(reviewer.id)}
                                  sx={{
                                    "&.Mui-disabled": {
                                      color: (theme) =>
                                        theme.vars?.palette?.error?.main ||
                                        "#d32f2f",
                                      opacity: 0.8,
                                    },
                                  }}
                                >
                                  <QueueIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Queue & Invitations Tab - Unified View */}
          <UnifiedQueueTab
            reviewersWithStatus={reviewersWithStatus}
            queueControl={queueControl}
            onToggleQueue={handleToggleQueue}
            onActionMenuOpen={handleActionMenuOpen}
          />
        </TabPanel>

        {/* Reviewer Action Menu */}
        <ReviewerActionMenu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={handleActionMenuClose}
          selectedReviewer={selectedReviewerForAction}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onRemoveFromQueue={handleRemoveFromQueue}
          onInviteFromQueue={handleInviteFromQueue}
          onRevokeInvitation={handleRevokeInvitation}
          onRemoveInvitation={handleRemoveInvitation}
          onForceAccept={handleForceAccept}
          onForceDecline={handleForceDecline}
          onReadReport={handleReadReport}
          onViewProfile={handleViewProfile}
        />

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary">
                  {potentialReviewers.filter((r) => r.match_score >= 90).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High Match Reviewers (90%+)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="success.main">
                  {invitations.filter((i) => i.status === "accepted").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accepted Invitations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="warning.main">
                  {invitations.filter((i) => i.status === "pending").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Responses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="info.main">
                  {simulatedQueue.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Queued Invitations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({
            open: false,
            title: "",
            message: "",
            onConfirm: () => {},
          })
        }
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({
                open: false,
                title: "",
                message: "",
                onConfirm: () => {},
              })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              confirmDialog.onConfirm();
              setConfirmDialog({
                open: false,
                title: "",
                message: "",
                onConfirm: () => {},
              });
            }}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
