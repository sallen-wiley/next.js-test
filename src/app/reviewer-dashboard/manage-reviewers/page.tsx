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
  submitReport,
  invalidateReport,
  uninvalidateReport,
  cancelReview,
} from "@/services/dataService";
import ReviewerActionMenu from "./ReviewerActionMenu";
import { ArticleDetailsCard } from "../ArticleDetailsCard";
import { ReviewerSearchAndTable } from "./ReviewerSearchAndTable";
import { InvitationsAndQueuePanel } from "./InvitationsAndQueuePanel";
import { getStatusLabel, getStatusColor } from "@/utils/manuscriptStatus";
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
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  Breadcrumbs,
  Link,
} from "@mui/material";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Mock data removed - using real database queries

export default function ReviewerInvitationDashboard() {
  // Authentication and user data
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { profile } = useUserProfile();

  // Get manuscript ID from URL params
  const manuscriptId = searchParams?.get("manuscriptId") || null;
  const [manuscript, setManuscript] = React.useState<Manuscript | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Panel state with localStorage persistence (default open)
  const [rightPanelOpen, setRightPanelOpen] = React.useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("reviewerPanelOpen");
      return stored !== null ? stored === "true" : true; // default to true
    }
    return true;
  });

  // Persist panel state to localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("reviewerPanelOpen", String(rightPanelOpen));
    }
  }, [rightPanelOpen]);

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

  // Fetch all data when manuscript is loaded
  React.useEffect(() => {
    async function fetchAllData() {
      if (!manuscriptId) return;

      setLoading(true);
      try {
        const [
          reviewersData,
          invitationsData,
          allReviewersData,
          statusData,
          queueControlData,
        ] = await Promise.all([
          getManuscriptReviewers(manuscriptId),
          getManuscriptInvitations(manuscriptId),
          getAllReviewers(),
          getReviewersWithStatus(manuscriptId),
          getQueueControlState(manuscriptId),
        ]);
        setSuggestedReviewers(reviewersData);
        setInvitations(invitationsData);
        setAllReviewers(allReviewersData);
        setReviewersWithStatus(statusData);
        setQueueControl(queueControlData);
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [manuscriptId]);

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

          // Open right panel to show the result
          setTimeout(() => setRightPanelOpen(true), 1000);
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

  // Consolidated handler for invitation status updates
  const handleUpdateInvitationStatus = (
    status:
      | "accepted"
      | "declined"
      | "pending"
      | "report_submitted"
      | "invalidated"
      | "revoked",
    title: string,
    message: string,
    successMessage: string
  ) => {
    if (!selectedReviewerForAction?.invitation_id) return;

    showConfirmDialog(title, message, async () => {
      try {
        await updateInvitationStatus(
          selectedReviewerForAction.invitation_id!,
          status
        );
        await refreshReviewersWithStatus();
        showSnackbar(successMessage, "success");
      } catch {
        showSnackbar("Failed to update invitation status", "error");
      }
    });
    handleActionMenuClose();
  };

  const handleForceAccept = () =>
    handleUpdateInvitationStatus(
      "accepted",
      "Force Accept Invitation",
      `Manually mark ${selectedReviewerForAction?.name}'s invitation as accepted? This will set their status to "accepted" and assign a review due date.`,
      `${selectedReviewerForAction?.name} marked as accepted`
    );

  const handleForceDecline = () =>
    handleUpdateInvitationStatus(
      "declined",
      "Force Decline Invitation",
      `Manually mark ${selectedReviewerForAction?.name}'s invitation as declined?`,
      `${selectedReviewerForAction?.name} marked as declined`
    );

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

  const handleSubmitReport = async () => {
    if (!selectedReviewerForAction?.invitation_id) return;

    try {
      await submitReport(selectedReviewerForAction.invitation_id);
      await refreshReviewersWithStatus();
      showSnackbar("Report submitted successfully (testing)", "success");
      handleActionMenuClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      showSnackbar("Failed to submit report", "error");
    }
  };

  const handleInvalidateReport = async () => {
    if (!selectedReviewerForAction?.invitation_id) return;

    showConfirmDialog(
      "Invalidate Report",
      `Invalidate the report from ${selectedReviewerForAction.name}? This can be reversed later.`,
      async () => {
        try {
          await invalidateReport(
            selectedReviewerForAction.invitation_id!,
            "Invalidated by editor"
          );
          await refreshReviewersWithStatus();
          showSnackbar("Report invalidated", "warning");
          handleActionMenuClose();
        } catch (error) {
          console.error("Error invalidating report:", error);
          showSnackbar("Failed to invalidate report", "error");
        }
      }
    );
  };

  const handleReinstateReport = async () => {
    if (!selectedReviewerForAction?.invitation_id) return;

    showConfirmDialog(
      "Reinstate Report",
      `Reinstate the report from ${selectedReviewerForAction.name}?`,
      async () => {
        try {
          await uninvalidateReport(selectedReviewerForAction.invitation_id!);
          await refreshReviewersWithStatus();
          showSnackbar("Report reinstated", "success");
          handleActionMenuClose();
        } catch (error) {
          console.error("Error reinstating report:", error);
          showSnackbar("Failed to reinstate report", "error");
        }
      }
    );
  };

  const handleCancelReview = async () => {
    if (!selectedReviewerForAction?.invitation_id) return;

    showConfirmDialog(
      "Cancel Review",
      `Permanently cancel the review from ${selectedReviewerForAction.name}? This marks the review as cancelled.`,
      async () => {
        try {
          await cancelReview(selectedReviewerForAction.invitation_id!);
          await refreshReviewersWithStatus();
          showSnackbar("Review cancelled", "info");
          handleActionMenuClose();
        } catch (error) {
          console.error("Error cancelling review:", error);
          showSnackbar("Failed to cancel review", "error");
        }
      }
    );
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
            setTimeout(() => setRightPanelOpen(true), 1000);
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
        setTimeout(() => setRightPanelOpen(true), 1000);
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
          setTimeout(() => setRightPanelOpen(true), 1000);
        } catch (error) {
          console.error("Error batch adding to queue:", error);
          showSnackbar("Failed to add reviewers to queue", "error");
        }
      }
    );
  };

  // Configure header for reviewer dashboard
  useHeaderConfig({
    logoAffix: "Review",
    containerProps: { maxWidth: false },
  });

  return (
    <>
      <Box sx={{ width: "100%", py: 4 }}>
        {/* Navigation Row: Back button, breadcrumbs, and panel toggle */}
        <Box
          sx={{
            px: 3,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={handleBackToArticle}>
              Back
            </Button>
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ textTransform: "uppercase" }}
            >
              <Link
                underline="hover"
                color="inherit"
                href="/reviewer-dashboard"
              >
                Dashboard
              </Link>
              <Link
                underline="hover"
                color="inherit"
                href={`/reviewer-dashboard/${manuscriptId}`}
              >
                Article Details
              </Link>
              <Typography
                sx={{ color: "text.primary", textTransform: "uppercase" }}
              >
                Manage Reviewers
              </Typography>
            </Breadcrumbs>
          </Box>
          <Button
            variant="text"
            color="secondary"
            endIcon={
              rightPanelOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />
            }
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
          >
            {rightPanelOpen ? "Hide" : "Show"} Invitations & Queue
          </Button>
        </Box>

        {/* Two-Column Layout */}
        <Box sx={{ px: 3, display: "flex" }}>
          {/* Left Column: Potential Reviewers */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Article Details Card */}
            {manuscript && (
              <Box sx={{ mb: 3 }}>
                <ArticleDetailsCard
                  id={manuscript.id.split("-")[0]}
                  title={manuscript.title}
                  authors={manuscript.authors || []}
                  abstract={manuscript.abstract}
                  articleType={manuscript.article_type ?? "undefined"}
                  section="{{Physical, Chemical and Earth Sciences}}"
                  specialIssue="{{Advanced PHWR Safety Technology: PHWR Challenging Issues for Safe Operation and Long-Term Sustainability}}"
                  academicEditor={
                    manuscript.assignedEditors &&
                    manuscript.assignedEditors.length > 0
                      ? manuscript.assignedEditors
                          .map((editor) => editor.full_name || editor.email)
                          .join(", ")
                      : "Unassigned"
                  }
                  journal={manuscript.journal}
                  submittedOn={new Date(
                    manuscript.submission_date
                  ).toLocaleDateString("en-GB")}
                  stateLabel={getStatusLabel(manuscript.status)}
                  stateCode={`V${manuscript.version || 1}`}
                  stateColor={getStatusColor(manuscript.status)}
                  manuscriptTags={manuscript.manuscript_tags}
                  collapsible
                  defaultExpanded={false}
                />
              </Box>
            )}

            {/* Reviewer Search and Table Component */}
            <ReviewerSearchAndTable
              filteredReviewers={filteredReviewers}
              selectedReviewers={selectedReviewers}
              searchTerm={searchTerm}
              sortBy={sortBy}
              filterAvailability={filterAvailability}
              minMatchScore={minMatchScore}
              loading={loading}
              onSearchChange={setSearchTerm}
              onSortChange={setSortBy}
              onAvailabilityChange={setFilterAvailability}
              onMinMatchScoreChange={setMinMatchScore}
              onReviewerSelect={handleReviewerSelect}
              onInviteReviewer={handleInviteReviewer}
              onAddToQueue={handleAddToQueue}
              onBatchInvite={handleBatchInvite}
              onBatchAddToQueue={handleBatchAddToQueue}
              onClearFilters={() => {
                setSearchTerm("");
                setFilterAvailability(["available"]);
                setMinMatchScore(70);
              }}
            />
          </Box>

          {/* Right Column: Collapsible Panel with Metrics + Queue/Invitations */}
          <Collapse
            in={rightPanelOpen}
            orientation="horizontal"
            timeout={{ enter: 300, exit: 300 }}
            collapsedSize={0}
          >
            <InvitationsAndQueuePanel
              reviewersWithStatus={reviewersWithStatus}
              queueControl={queueControl}
              invitations={invitations}
              queue={simulatedQueue}
              highMatchCount={
                potentialReviewers.filter((r) => r.match_score >= 90).length
              }
              onToggleQueue={handleToggleQueue}
              onActionMenuOpen={handleActionMenuOpen}
            />
          </Collapse>
        </Box>
      </Box>

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
        onSubmitReport={handleSubmitReport}
        onInvalidateReport={handleInvalidateReport}
        onReinstateReport={handleReinstateReport}
        onCancelReview={handleCancelReview}
      />

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
