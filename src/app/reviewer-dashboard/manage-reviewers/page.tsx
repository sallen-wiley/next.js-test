"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import { useAdminActions } from "@/contexts/AdminActionsContext";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserProfile } from "@/hooks/useRoles";
import { usePageTheme } from "@/hooks/usePageTheme";
import {
  isInstitutionalEmail,
  calculateAcceptanceRate,
  daysSince,
} from "@/utils/reviewerMetrics";
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
  addReviewer,
  clearManuscriptReviewers,
  checkReviewersPublishedInJournal,
} from "@/services";
import ReviewerActionMenu from "./ReviewerActionMenu";
import { ArticleDetailsCard } from "../ArticleDetailsCard";
import { ReviewerSearchAndCards } from "./ReviewerSearchAndCards";
import { InvitationsAndQueuePanel } from "./InvitationsAndQueuePanel";
import { InviteReviewerModal } from "./InviteReviewerModal";
import {
  InvitationEmailModal,
  type EmailCustomization,
} from "./InvitationEmailModal";
import { getStatusLabel, getStatusColor } from "@/utils/manuscriptStatus";
import ReviewerProfileDrawer from "./ReviewerProfileDrawer";
import { useReviewerProfileDrawer } from "@/hooks/useReviewerProfileDrawer";
import ManageReviewersVersionSwitcher from "@/components/app/ManageReviewersVersionSwitcher";
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
        userTraits: Record<string, string | number | boolean>,
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
import ClearAllIcon from "@mui/icons-material/ClearAll";

// Mock data removed - using real database queries

export default function ReviewerInvitationDashboard() {
  // Force Phenom theme with light mode on this page (resets on each visit, allows manual switching during session)
  usePageTheme("phenom", { mode: "light" });

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
    [],
  );
  const [invitations, setInvitations] = React.useState<ReviewInvitation[]>([]);
  const [publishedInJournalMap, setPublishedInJournalMap] = React.useState<
    Map<string, boolean>
  >(new Map());

  // Combined reviewers list: merge suggested reviewers with match scores and all other reviewers
  const potentialReviewers = React.useMemo(() => {
    // Create a map of reviewer IDs from suggested reviewers (these have match scores)
    const suggestedMap = new Map(
      suggestedReviewers.map((reviewer) => [reviewer.id, reviewer]),
    );

    // Start with suggested reviewers
    const combined: PotentialReviewerWithMatch[] = [...suggestedReviewers];

    // Add reviewers from allReviewers that aren't in the suggested list
    allReviewers.forEach((reviewer) => {
      if (!suggestedMap.has(reviewer.id)) {
        // Type assertion for database fields not in interface
        const reviewerData = reviewer as PotentialReviewer &
          Record<string, unknown>;

        combined.push({
          ...reviewer,
          match_score: 0, // Default score for reviewers without matches
          conflicts_of_interest: "", // No conflicts since no match relationship exists
          email_is_institutional: isInstitutionalEmail(reviewer.email),
          acceptance_rate: calculateAcceptanceRate(
            (reviewerData.total_acceptances as number) || 0,
            (reviewerData.total_invitations as number) || 0,
          ),
          related_publications_count: 0, // Would need to fetch publications
          solo_authored_count: 0, // Would need to fetch publications
          publications_last_5_years: 0, // Would need to fetch publications
          days_since_last_review: daysSince(
            reviewerData.last_review_completed as string | undefined,
          ),
          published_in_journal: publishedInJournalMap.get(reviewer.id) || false,
        });
      }
    });

    return combined;
  }, [allReviewers, suggestedReviewers, publishedInJournalMap]);

  // Fetch all data when manuscript is loaded
  React.useEffect(() => {
    async function fetchAllData() {
      if (!manuscriptId || !manuscript) return;

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

        // Check journal publications for all reviewers
        if (manuscript.journal && allReviewersData.length > 0) {
          const reviewerIds = allReviewersData.map((r) => r.id);
          const journalMap = await checkReviewersPublishedInJournal(
            reviewerIds,
            manuscript.journal,
          );
          setPublishedInJournalMap(journalMap);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [manuscriptId, manuscript]);

  const [sortBy] = React.useState<string>("match_score");
  const [searchTerm, setSearchTerm] = React.useState("");

  // Initialize filters with default values
  const [filters, setFilters] = React.useState<
    import("./ReviewerSearchAndCards").ReviewerFilters
  >({
    hideUnavailable: false,
    institutionalEmail: false,
    country: "",
    role: "",
    responseTimeMax: 0,
    reviewsLast12Months: 0,
    totalReviewsMin: 0,
    totalReviewsMax: 1000,
    assignedManuscriptsMax: 0,
    publicationYearFrom: 0,
    publicationYearTo: 0,
    publishedArticlesMin: 0,
    publishedInJournal: false,
    previouslyReviewedForJournal: false,
    inAuthorsGroup: false,
  });
  // Multi-select removed; no selected reviewers state

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

  // Invite reviewer modal state
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);

  // Email preview modal state
  const [emailModalOpen, setEmailModalOpen] = React.useState(false);
  const [emailModalAction, setEmailModalAction] = React.useState<
    "invite" | "queue"
  >("invite");
  const [selectedReviewerForEmail, setSelectedReviewerForEmail] =
    React.useState<PotentialReviewerWithMatch | null>(null);

  // Reviewer profile drawer state
  const {
    open: profileDrawerOpen,
    reviewerId: profileReviewerId,
    scrollToSection: profileScrollToSection,
    openDrawer: openProfileDrawer,
    closeDrawer: closeProfileDrawer,
  } = useReviewerProfileDrawer();

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

  // Memoize the invited/queued IDs set for better performance
  const invitedOrQueuedIds = React.useMemo(() => {
    return new Set(
      reviewersWithStatus
        .filter((r) => r.invitation_status !== null)
        .map((r) => r.id),
    );
  }, [reviewersWithStatus]);

  // Filter and sort reviewers
  const filteredReviewers = React.useMemo(() => {
    // Pre-lowercase the search term once
    const search = searchTerm.toLowerCase();
    const hasSearchTerm = search.length > 0;

    const filtered = potentialReviewers.filter((reviewer) => {
      // Exclude reviewers who are already invited or queued
      if (invitedOrQueuedIds.has(reviewer.id)) {
        return false;
      }

      // Filter by search term first - if searching, bypass match_score filter
      if (hasSearchTerm) {
        // Pre-lowercase reviewer fields for comparison
        const nameLower = reviewer.name.toLowerCase();
        const affiliationLower = reviewer.affiliation.toLowerCase();

        const matchesSearch =
          nameLower.includes(search) ||
          affiliationLower.includes(search) ||
          reviewer.expertise_areas.some((area) =>
            area.toLowerCase().includes(search),
          );

        // If doesn't match search, exclude immediately
        if (!matchesSearch) {
          return false;
        }
        // If matches search, continue to other filters below
      } else {
        // When NOT searching, only show reviewers with a match relationship (match_score > 0)
        if (reviewer.match_score === 0) {
          return false;
        }
      }

      // Filter by availability (hide unavailable reviewers)
      if (
        filters.hideUnavailable &&
        reviewer.availability_status === "unavailable"
      ) {
        return false;
      }

      // Filter by institutional email
      if (filters.institutionalEmail && !isInstitutionalEmail(reviewer.email)) {
        return false;
      }

      // Filter by country
      if (
        filters.country &&
        !reviewer.affiliation
          ?.toLowerCase()
          .includes(filters.country.toLowerCase())
      ) {
        return false;
      }

      // Filter by response time
      if (filters.responseTimeMax > 0) {
        const responseTimeDays = reviewer.average_response_time_hours
          ? reviewer.average_response_time_hours / 24
          : reviewer.average_review_time_days || 0;
        if (responseTimeDays > filters.responseTimeMax) {
          return false;
        }
      }

      // Filter by reviews in last 12 months
      if (filters.reviewsLast12Months > 0) {
        const recentReviews = reviewer.publication_count_last_year || 0;
        if (recentReviews < filters.reviewsLast12Months) {
          return false;
        }
      }

      // Filter by total reviews completed (range)
      if (filters.totalReviewsMin > 0 || filters.totalReviewsMax < 1000) {
        const totalReviews =
          reviewer.completed_reviews || reviewer.total_completions || 0;
        if (
          totalReviews < filters.totalReviewsMin ||
          totalReviews > filters.totalReviewsMax
        ) {
          return false;
        }
      }

      // Filter by assigned manuscripts
      if (filters.assignedManuscriptsMax > 0) {
        if (reviewer.current_review_load > filters.assignedManuscriptsMax) {
          return false;
        }
      }

      // Filter by publication recency
      if (filters.publicationYearFrom > 0 || filters.publicationYearTo > 0) {
        const pubYearFrom = reviewer.publication_year_from || 0;
        const pubYearTo =
          reviewer.publication_year_to || new Date().getFullYear();

        if (
          filters.publicationYearFrom > 0 &&
          pubYearTo < filters.publicationYearFrom
        ) {
          return false;
        }
        if (
          filters.publicationYearTo > 0 &&
          pubYearFrom > filters.publicationYearTo
        ) {
          return false;
        }
      }

      // Filter by number of published articles
      if (filters.publishedArticlesMin > 0) {
        const totalPublications = reviewer.total_publications || 0;
        if (totalPublications < filters.publishedArticlesMin) {
          return false;
        }
      }

      // Filter by published in journal
      if (filters.publishedInJournal) {
        if (!reviewer.published_in_journal) {
          return false;
        }
      }

      // Note: inAuthorsGroup filter is disabled (coming soon)

      // All filters passed
      return true;
    });

    // Sort reviewers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "match_score":
          return b.match_score - a.match_score;
        case "current_load":
          return a.current_review_load - b.current_review_load;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [potentialReviewers, invitedOrQueuedIds, sortBy, filters, searchTerm]);

  const handleBackToArticle = () => {
    if (manuscriptId) {
      router.push(`/reviewer-dashboard/${manuscriptId}`);
    } else {
      router.push("/reviewer-dashboard");
    }
  };

  // Multi-select removed; no reviewer select handler

  // Interactive functions for demo purposes
  const showSnackbar = (
    message: string,
    severity: "success" | "info" | "warning" | "error" = "success",
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const showConfirmDialog = React.useCallback(
    (title: string, message: string, onConfirm: () => void) => {
      setConfirmDialog({
        open: true,
        title,
        message,
        onConfirm,
      });
    },
    [],
  );

  const handleInviteReviewer = async (reviewerId: string) => {
    const reviewer = potentialReviewers.find((r) => r.id === reviewerId);
    if (!reviewer || !manuscriptId) return;

    // Check if email modal is already open for a different reviewer
    if (
      emailModalOpen &&
      selectedReviewerForEmail &&
      selectedReviewerForEmail.id !== reviewerId
    ) {
      showConfirmDialog(
        "Discard Current Draft?",
        `You have an unsaved email draft for ${selectedReviewerForEmail.name}. Opening a new invitation will discard your changes. Continue?`,
        () => {
          // User confirmed - switch to new reviewer
          setSelectedReviewerForEmail(reviewer);
          setEmailModalAction("invite");
          setEmailModalOpen(true);
        },
      );
      return;
    }

    // Open email preview modal
    setSelectedReviewerForEmail(reviewer);
    setEmailModalAction("invite");
    setEmailModalOpen(true);
  };

  const handleConfirmInvite = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _customization: EmailCustomization,
  ) => {
    const reviewer = selectedReviewerForEmail;
    if (!reviewer || !manuscriptId) return;

    setEmailModalOpen(false);

    try {
      // Send the invitation to the database
      // TODO: Pass customization data (editorComment, signature) to backend
      await sendInvitation(manuscriptId, reviewer.id);

      // Multi-select removed; no selection to update

      // Refresh the reviewers with status and invitations to show the new invitation
      await refreshReviewerData();

      showSnackbar(`Invitation sent to ${reviewer.name}`, "success");

      // Open right panel to show the result
      setTimeout(() => setRightPanelOpen(true), 1000);
    } catch (error) {
      console.error("Error sending invitation:", error);
      showSnackbar("Failed to send invitation", "error");
    }
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

  const refreshInvitations = async () => {
    if (!manuscriptId) return;
    try {
      const invitationsData = await getManuscriptInvitations(manuscriptId);
      setInvitations(invitationsData);
    } catch (error) {
      console.error("Error refreshing invitations:", error);
    }
  };

  const refreshQueue = async () => {
    if (!manuscriptId) return;
    try {
      const queueData = await getManuscriptQueue(manuscriptId);
      setSimulatedQueue(queueData);
    } catch (error) {
      console.error("Error refreshing queue:", error);
    }
  };

  // Combined refresh for both reviewer status and invitations (updates MetricsWidget)
  const refreshReviewerData = async () => {
    await Promise.all([refreshReviewersWithStatus(), refreshInvitations()]);
  };

  // Combined refresh including queue (for queue operations)
  const refreshAllReviewerData = async () => {
    await Promise.all([
      refreshReviewersWithStatus(),
      refreshInvitations(),
      refreshQueue(),
    ]);
  };

  // Refresh reviewer lists when a reviewer is edited
  const refreshReviewerLists = async () => {
    if (!manuscriptId || !manuscript) return;
    try {
      const [reviewersData, allReviewersData] = await Promise.all([
        getManuscriptReviewers(manuscriptId),
        getAllReviewers(),
      ]);
      setSuggestedReviewers(reviewersData);
      setAllReviewers(allReviewersData);

      // Also refresh journal publications if needed
      if (manuscript.journal && allReviewersData.length > 0) {
        const reviewerIds = allReviewersData.map((r) => r.id);
        const journalMap = await checkReviewersPublishedInJournal(
          reviewerIds,
          manuscript.journal,
        );
        setPublishedInJournalMap(journalMap);
      }
    } catch (error) {
      console.error("Error refreshing reviewer lists:", error);
    }
  };

  const handleActionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    reviewer: ReviewerWithStatus,
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
      await refreshAllReviewerData();
      showSnackbar("Reviewer moved up in queue", "success");
    } catch (error: unknown) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to move reviewer",
        "error",
      );
    }
    handleActionMenuClose();
  };

  const handleMoveDown = async () => {
    if (!selectedReviewerForAction?.queue_id) return;

    try {
      await moveInQueue(selectedReviewerForAction.queue_id, "down");
      await refreshAllReviewerData();
      showSnackbar("Reviewer moved down in queue", "success");
    } catch (error: unknown) {
      showSnackbar(
        error instanceof Error ? error.message : "Failed to move reviewer",
        "error",
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
            false,
          );
          await refreshReviewerData();
          showSnackbar("Invitation revoked", "success");
        } catch {
          showSnackbar("Failed to revoke invitation", "error");
        }
      },
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
          await refreshAllReviewerData();
          showSnackbar("Removed from queue", "success");
        } catch {
          showSnackbar("Failed to remove from queue", "error");
        }
      },
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

          // Refresh all data including queue
          await refreshAllReviewerData();
          showSnackbar(
            `Invitation sent to ${selectedReviewerForAction.name}`,
            "success",
          );
        } catch {
          showSnackbar("Failed to send invitation", "error");
        }
      },
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
          await refreshReviewerData();
          showSnackbar("Invitation removed", "success");
        } catch {
          showSnackbar("Failed to remove invitation", "error");
        }
      },
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
    successMessage: string,
  ) => {
    if (!selectedReviewerForAction?.invitation_id) return;

    showConfirmDialog(title, message, async () => {
      try {
        await updateInvitationStatus(
          selectedReviewerForAction.invitation_id!,
          status,
        );
        await refreshReviewerData();
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
      `${selectedReviewerForAction?.name} marked as accepted`,
    );

  const handleForceDecline = () =>
    handleUpdateInvitationStatus(
      "declined",
      "Force Decline Invitation",
      `Manually mark ${selectedReviewerForAction?.name}'s invitation as declined?`,
      `${selectedReviewerForAction?.name} marked as declined`,
    );

  const handleViewProfile = () => {
    if (selectedReviewerForAction?.id) {
      openProfileDrawer(selectedReviewerForAction.id);
    }
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
      await refreshReviewerData();
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
            "Invalidated by editor",
          );
          await refreshReviewerData();
          showSnackbar("Report invalidated", "warning");
          handleActionMenuClose();
        } catch (error) {
          console.error("Error invalidating report:", error);
          showSnackbar("Failed to invalidate report", "error");
        }
      },
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
          await refreshReviewerData();
          showSnackbar("Report reinstated", "success");
          handleActionMenuClose();
        } catch (error) {
          console.error("Error reinstating report:", error);
          showSnackbar("Failed to reinstate report", "error");
        }
      },
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
          await refreshReviewerData();
          showSnackbar("Review cancelled", "info");
          handleActionMenuClose();
        } catch (error) {
          console.error("Error cancelling review:", error);
          showSnackbar("Failed to cancel review", "error");
        }
      },
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
        newState ? "success" : "info",
      );
    } catch {
      showSnackbar("Failed to toggle queue state", "error");
    }
  };

  const handleAddToQueue = (reviewerId: string) => {
    const reviewer = potentialReviewers.find((r) => r.id === reviewerId);
    if (!reviewer || !manuscriptId) return;

    // Check if email modal is already open for a different reviewer
    if (
      emailModalOpen &&
      selectedReviewerForEmail &&
      selectedReviewerForEmail.id !== reviewerId
    ) {
      showConfirmDialog(
        "Discard Current Draft?",
        `You have an unsaved email draft for ${selectedReviewerForEmail.name}. Opening a new invitation will discard your changes. Continue?`,
        () => {
          // User confirmed - switch to new reviewer
          setSelectedReviewerForEmail(reviewer);
          setEmailModalAction("queue");
          setEmailModalOpen(true);
        },
      );
      return;
    }

    // Open email preview modal
    setSelectedReviewerForEmail(reviewer);
    setEmailModalAction("queue");
    setEmailModalOpen(true);
  };

  const handleConfirmQueue = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _customization: EmailCustomization,
  ) => {
    const reviewer = selectedReviewerForEmail;
    if (!reviewer || !manuscriptId) return;

    setEmailModalOpen(false);

    try {
      // Add to database
      // TODO: Pass customization data (editorComment, signature) to backend
      const newQueueItem = await addToQueue(
        manuscriptId,
        reviewer.id,
        "normal",
      );

      if (newQueueItem) {
        // Refresh all data including queue
        await refreshAllReviewerData();

        // Multi-select removed; no selection to update
        showSnackbar(
          `${reviewer.name} added to queue (Position ${newQueueItem.queue_position})`,
          "info",
        );

        // Switch to queue tab to show the result
        setTimeout(() => setRightPanelOpen(true), 1000);
      }
    } catch (error) {
      console.error("Error adding to queue:", error);
      showSnackbar("Failed to add reviewer to queue", "error");
    }
  };

  // Batch invite removed

  // Handler to open the invite manually modal
  const handleOpenInviteModal = () => {
    setInviteModalOpen(true);
  };

  // Handler for inviting a manual reviewer directly
  const handleInviteManualReviewer = async (name: string, email: string) => {
    if (!manuscriptId) return;

    try {
      // First, add the reviewer to the database if they don't exist
      const newReviewer = await addReviewer({
        name: name || email.split("@")[0], // Use email prefix if name not provided
        email,
        affiliation: "",
        expertise_areas: [],
        availability_status: "available",
        current_review_load: 0,
        max_review_capacity: 5,
        average_review_time_days: 0,
        recent_publications: 0,
      });

      // Then send the invitation
      await sendInvitation(manuscriptId, newReviewer.id);

      // Refresh data to show the new invitation
      await refreshReviewerData();

      showSnackbar(`Invitation sent to ${name || email}`, "success");

      // Open right panel to show the result
      setTimeout(() => setRightPanelOpen(true), 500);
    } catch (error) {
      console.error("Error inviting manual reviewer:", error);
      if (error instanceof Error && error.message.includes("already exists")) {
        showSnackbar(
          "Reviewer with this email already exists. Use the Find Reviewer tab to invite them.",
          "warning",
        );
      } else {
        showSnackbar("Failed to invite reviewer", "error");
      }
      throw error; // Re-throw to keep modal open on error
    }
  };

  // Handler for adding a manual reviewer to queue
  const handleAddManualReviewerToQueue = async (
    name: string,
    email: string,
  ) => {
    if (!manuscriptId) return;

    try {
      // First, add the reviewer to the database if they don't exist
      const newReviewer = await addReviewer({
        name: name || email.split("@")[0], // Use email prefix if name not provided
        email,
        affiliation: "",
        expertise_areas: [],
        availability_status: "available",
        current_review_load: 0,
        max_review_capacity: 5,
        average_review_time_days: 0,
        recent_publications: 0,
      });

      // Then add to queue
      const queueItem = await addToQueue(
        manuscriptId,
        newReviewer.id,
        "normal",
      );

      // Refresh all data including queue
      await refreshAllReviewerData();

      showSnackbar(
        `${name || email} added to queue${
          queueItem ? ` (Position ${queueItem.queue_position})` : ""
        }`,
        "info",
      );

      // Open right panel to show the result
      setTimeout(() => setRightPanelOpen(true), 500);
    } catch (error) {
      console.error("Error adding manual reviewer to queue:", error);
      if (error instanceof Error && error.message.includes("already exists")) {
        showSnackbar(
          "Reviewer with this email already exists. Use the Find Reviewer tab to add them to the queue.",
          "warning",
        );
      } else {
        showSnackbar("Failed to add reviewer to queue", "error");
      }
      throw error; // Re-throw to keep modal open on error
    }
  };

  // Batch add to queue removed

  // Handler for clearing all invitations and queue
  const handleClearAllReviewers = React.useCallback(async () => {
    if (!manuscriptId) return;

    showConfirmDialog(
      "Clear All Invitations and Queue",
      `This will remove ALL pending invitations and queued reviewers for this manuscript. This action cannot be undone. Are you sure?`,
      async () => {
        try {
          const result = await clearManuscriptReviewers(manuscriptId);
          await refreshAllReviewerData();
          showSnackbar(
            `Cleared ${result.removedInvitations} invitation(s) and ${result.removedQueueItems} queue item(s)`,
            "success",
          );
        } catch (error) {
          console.error("Error clearing reviewers:", error);
          showSnackbar("Failed to clear reviewers", "error");
        }
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manuscriptId, showConfirmDialog]);

  // Configure header for reviewer dashboard
  // Memoize the version switcher component to prevent re-creation on every render
  const versionSwitcher = React.useMemo(
    () => <ManageReviewersVersionSwitcher />,
    [],
  );

  const headerConfig = React.useMemo(
    () => ({
      logoAffix: "Review",
      containerProps: { maxWidth: false as const },
      rightSlotPrefix: versionSwitcher,
    }),
    [versionSwitcher],
  );
  useHeaderConfig(headerConfig);

  // Register admin actions for this page (memoized to prevent re-renders)
  const adminActions = React.useMemo(
    () => [
      {
        id: "clear-reviewers",
        label: "Clear All Invitations & Queue",
        icon: <ClearAllIcon />,
        onClick: handleClearAllReviewers,
        destructive: true,
        tooltip: "Remove all pending invitations and queued reviewers",
      },
    ],
    [handleClearAllReviewers],
  );

  useAdminActions(adminActions);

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
            <Button
              color="neutral"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToArticle}
            >
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
                  id={manuscript.custom_id || manuscript.id.split("-")[0]}
                  title={manuscript.title}
                  authors={manuscript.authors || []}
                  abstract={manuscript.abstract}
                  articleType={manuscript.article_type ?? "undefined"}
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
                    manuscript.submission_date,
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

            {/* Reviewer Search and Cards Component */}
            <ReviewerSearchAndCards
              filteredReviewers={filteredReviewers}
              searchTerm={searchTerm}
              filters={filters}
              loading={loading}
              onSearchChange={setSearchTerm}
              onFiltersChange={setFilters}
              onInviteReviewer={handleInviteReviewer}
              onAddToQueue={handleAddToQueue}
              onInviteManually={handleOpenInviteModal}
              onClearFilters={() => {
                setSearchTerm("");
                setFilters({
                  hideUnavailable: false,
                  institutionalEmail: false,
                  country: "",
                  role: "",
                  responseTimeMax: 0,
                  reviewsLast12Months: 0,
                  totalReviewsMin: 0,
                  totalReviewsMax: 1000,
                  assignedManuscriptsMax: 0,
                  publicationYearFrom: 0,
                  publicationYearTo: 0,
                  publishedArticlesMin: 0,
                  publishedInJournal: false,
                  previouslyReviewedForJournal: false,
                  inAuthorsGroup: false,
                });
              }}
              onViewProfile={openProfileDrawer}
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

      {/* Email Preview Modal */}
      <InvitationEmailModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onConfirm={
          emailModalAction === "invite"
            ? handleConfirmInvite
            : handleConfirmQueue
        }
        reviewer={selectedReviewerForEmail}
        manuscript={manuscript}
        action={emailModalAction}
      />

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

      {/* Reviewer Profile Drawer */}
      <ReviewerProfileDrawer
        open={profileDrawerOpen}
        onClose={closeProfileDrawer}
        reviewerId={profileReviewerId}
        manuscriptId={manuscriptId}
        scrollToSection={profileScrollToSection}
        onAddToQueue={manuscriptId ? handleAddToQueue : undefined}
        onInvite={manuscriptId ? handleInviteReviewer : undefined}
        onReviewerUpdated={refreshReviewerLists}
      />

      {/* Invite Reviewer Manually Modal */}
      <InviteReviewerModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={handleInviteManualReviewer}
        onAddToQueue={handleAddManualReviewerToQueue}
      />
    </>
  );
}
