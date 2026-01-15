"use client";

import * as React from "react";
import { Drawer, Box, Stack, Divider, Alert, Snackbar } from "@mui/material";
import { useRoleAccess } from "@/hooks/useRoles";
import { updateReviewer } from "@/services/dataService";
import { supabase } from "@/lib/supabase";
import type { PotentialReviewer } from "@/lib/supabase";

// Import extracted components
import { ProfileHeader } from "./profile-drawer/ProfileHeader";
import { ProfileSkeleton } from "./profile-drawer/ProfileSkeleton";
import { ProfileOverview } from "./profile-drawer/ProfileOverview";
import { StrongWeakPoints } from "./profile-drawer/StrongWeakPoints";
import {
  PublicationsSection,
  KeywordsSection,
} from "./profile-drawer/PublicationsSection";
import {
  PublicationMetrics,
  CurrentWorkload,
  ReviewerPerformance,
} from "./profile-drawer/MetricsSections";
import { FeedbackWidget, ProfileFooter } from "./profile-drawer/ProfileFooter";
import { useProfileData } from "./profile-drawer/useProfileData";

// Edit dialogs - will be created separately
import EditReviewerDialog from "./EditReviewerDialog";
import PublicationsManagementDialog from "./PublicationsManagementDialog";

interface ReviewerProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  reviewerId: string | null;
  manuscriptId?: string | null;
  scrollToSection?: string;
  onAddToQueue?: (reviewerId: string) => void;
  onInvite?: (reviewerId: string) => void;
  onReviewerUpdated?: () => void;
}

export default function ReviewerProfileDrawer({
  open,
  onClose,
  reviewerId,
  manuscriptId,
  scrollToSection,
  onAddToQueue,
  onInvite,
  onReviewerUpdated,
}: ReviewerProfileDrawerProps) {
  const { isAdmin } = useRoleAccess();
  const { reviewer, loading, error, refetch } = useProfileData({
    open,
    reviewerId,
    manuscriptId,
  });

  const publicationsSectionRef = React.useRef<HTMLDivElement>(null);

  // Scroll to section when drawer opens with scrollToSection parameter
  React.useEffect(() => {
    if (
      open &&
      scrollToSection === "publications" &&
      publicationsSectionRef.current &&
      !loading
    ) {
      // Wait for drawer animation to complete before scrolling
      setTimeout(() => {
        publicationsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 350);
    }
  }, [open, scrollToSection, loading]);

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [publicationsDialogOpen, setPublicationsDialogOpen] =
    React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  const hasConflicts = (): boolean => {
    return !!(
      reviewer?.conflicts_of_interest &&
      reviewer.conflicts_of_interest.trim().length > 0
    );
  };

  const handleAddToQueue = () => {
    if (reviewer && onAddToQueue) {
      onAddToQueue(reviewer.id);
    }
  };

  const handleInvite = () => {
    if (reviewer && onInvite) {
      onInvite(reviewer.id);
    }
  };

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleSaveReviewer = async (formData: Partial<PotentialReviewer>) => {
    if (!reviewer) return;

    try {
      // Remove computed fields that shouldn't be updated
      const updateData = { ...formData };
      const fieldsToRemove = [
        "id",
        "match_score",
        "email_is_institutional",
        "acceptance_rate",
        "related_publications_count",
        "solo_authored_count",
        "publications_last_5_years",
        "days_since_last_review",
      ] as const;

      fieldsToRemove.forEach((field) => {
        delete (updateData as Record<string, unknown>)[field];
      });

      await updateReviewer(reviewer.id, updateData);
      showSnackbar("Reviewer updated successfully", "success");
      handleCloseEditDialog();
      refetch();
      if (onReviewerUpdated) {
        onReviewerUpdated();
      }
    } catch (error) {
      console.error("Error updating reviewer:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to update reviewer",
        "error"
      );
    }
  };

  const handleOpenPublicationsDialog = () => {
    setPublicationsDialogOpen(true);
  };

  const handleClosePublicationsDialog = () => {
    setPublicationsDialogOpen(false);
  };

  const handleSavePublication = async (publicationData: {
    id: string;
    title: string;
    doi?: string;
    journal_name?: string;
    authors?: string[];
    publication_date?: string;
    is_related: boolean;
  }) => {
    if (!reviewer || !manuscriptId) return;

    try {
      // Update publication metadata
      const { error } = await supabase
        .from("reviewer_publications")
        .update({
          title: publicationData.title,
          doi: publicationData.doi || null,
          journal_name: publicationData.journal_name || null,
          authors:
            publicationData.authors && publicationData.authors.length > 0
              ? publicationData.authors
              : null,
          publication_date: publicationData.publication_date || null,
        })
        .eq("id", publicationData.id);

      if (error) throw error;

      // Handle is_related via junction table
      if (publicationData.is_related) {
        await supabase.from("manuscript_publication_matches").upsert(
          {
            manuscript_id: manuscriptId,
            publication_id: publicationData.id,
          },
          { onConflict: "manuscript_id,publication_id" }
        );
      } else {
        await supabase
          .from("manuscript_publication_matches")
          .delete()
          .eq("manuscript_id", manuscriptId)
          .eq("publication_id", publicationData.id);
      }

      showSnackbar("Publication updated successfully", "success");
      refetch();
    } catch (error) {
      console.error("Error updating publication:", error);
      showSnackbar("Failed to update publication", "error");
    }
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        ModalProps={{
          sx: { zIndex: (theme) => theme.zIndex.drawer },
        }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 600, md: 780 },
              maxWidth: "100vw",
              zIndex: (theme) => theme.zIndex.drawer,
            },
          },
        }}
      >
        {/* Header */}
        <ProfileHeader
          onClose={onClose}
          onEdit={handleOpenEditDialog}
          showEditButton={isAdmin() && !!reviewer}
        />

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflow: "auto", p: 3 }}>
          {loading && <ProfileSkeleton />}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {reviewer && (
            <Stack spacing={2}>
              <ProfileOverview reviewer={reviewer} />
              <Divider />
              <StrongWeakPoints reviewer={reviewer} />
              <PublicationsSection
                ref={publicationsSectionRef}
                reviewer={reviewer}
                isAdmin={isAdmin()}
                onManagePublications={handleOpenPublicationsDialog}
              />
              <PublicationMetrics reviewer={reviewer} />
              <KeywordsSection
                expertise_areas={reviewer.expertise_areas || []}
              />
              <CurrentWorkload reviewer={reviewer} />
              <ReviewerPerformance reviewer={reviewer} />
              <FeedbackWidget />
            </Stack>
          )}
        </Box>

        {/* Footer Actions */}
        {reviewer && (
          <ProfileFooter
            onAddToQueue={onAddToQueue ? handleAddToQueue : undefined}
            onInvite={onInvite ? handleInvite : undefined}
            hasConflicts={hasConflicts()}
          />
        )}
      </Drawer>

      {/* Edit Reviewer Dialog */}
      {reviewer && (
        <EditReviewerDialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          reviewer={reviewer}
          manuscriptId={manuscriptId}
          onSave={handleSaveReviewer}
        />
      )}

      {/* Publications Management Dialog */}
      {reviewer && manuscriptId && (
        <PublicationsManagementDialog
          open={publicationsDialogOpen}
          onClose={handleClosePublicationsDialog}
          reviewer={reviewer}
          manuscriptId={manuscriptId}
          onSave={handleSavePublication}
        />
      )}

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
