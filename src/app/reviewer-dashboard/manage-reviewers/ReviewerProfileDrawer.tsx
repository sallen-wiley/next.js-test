"use client";

import * as React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Alert,
  Chip,
  Button,
  Link as MuiLink,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditIcon from "@mui/icons-material/Edit";
import { PotentialReviewerWithMatch } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { isInstitutionalEmail } from "@/utils/reviewerMetrics";
import { useRoleAccess } from "@/hooks/useRoles";
import { updateReviewer } from "@/services/dataService";
import type { PotentialReviewer } from "@/lib/supabase";

// Extended type with publication and retraction data
interface ReviewerProfile extends PotentialReviewerWithMatch {
  // Additional fields from potential_reviewers table
  orcid_id?: string;
  profile_url?: string;
  external_id?: string;
  previous_reviewer?: boolean;
  completed_reviews?: number;
  total_invitations?: number;
  average_response_time_hours?: number;

  // Extended data
  publications?: Array<{
    id: string;
    title: string;
    doi?: string;
    journal_name?: string;
    authors?: string[];
    publication_date?: string;
    is_related: boolean;
  }>;
  all_publications?: Array<{
    id: string;
    title: string;
    doi?: string;
    journal_name?: string;
    authors?: string[];
    publication_date?: string;
    is_related: boolean;
  }>;
  retractions?: {
    retraction_reasons: string[];
  };
  // Manuscript context for strong/weak point analysis
  manuscript_authors?: string[];
  manuscript_journal?: string | null;
  recent_invitations?: Array<{
    status: string;
    invited_date: string;
    response_date?: string;
  }>;
}

// Type for publication object
interface Publication {
  id: string;
  title: string;
  doi?: string;
  journal_name?: string;
  authors?: string[];
  publication_date?: string;
  is_related: boolean;
}

// Type for manuscript match data
interface ManuscriptMatch {
  id: string;
  manuscript_id: string;
  reviewer_id: string;
  match_score: number;
  calculated_at: string;
  conflicts_of_interest: string | null;
}

interface ReviewerProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  reviewerId: string | null;
  manuscriptId?: string | null;
  onAddToQueue?: (reviewerId: string) => void;
  onInvite?: (reviewerId: string) => void;
}

const availabilityOptions = [
  { value: "available", label: "Available" },
  { value: "busy", label: "Busy" },
  { value: "unavailable", label: "Unavailable" },
  { value: "sabbatical", label: "Sabbatical" },
] as const;

export default function ReviewerProfileDrawer({
  open,
  onClose,
  reviewerId,
  manuscriptId,
  onAddToQueue,
  onInvite,
}: ReviewerProfileDrawerProps) {
  const [reviewer, setReviewer] = React.useState<ReviewerProfile | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [matchData, setMatchData] = React.useState<ManuscriptMatch | null>(
    null
  );
  const [matchLoading, setMatchLoading] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editDialogTab, setEditDialogTab] = React.useState(0);
  const [publicationsDialogOpen, setPublicationsDialogOpen] =
    React.useState(false);
  const [publicationEditDialogOpen, setPublicationEditDialogOpen] =
    React.useState(false);
  const [selectedPublication, setSelectedPublication] =
    React.useState<Publication | null>(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });
  const { isAdmin } = useRoleAccess();

  // Form state for editing - Complete schema matching admin form
  const [formData, setFormData] = React.useState<Partial<PotentialReviewer>>({
    name: "",
    email: "",
    affiliation: "",
    department: "",
    expertise_areas: [],
    current_review_load: 0,
    max_review_capacity: 3,
    average_review_time_days: 21,
    availability_status: "available",
    recent_publications: 0,
    h_index: undefined,
    last_review_completed: undefined,
    is_board_member: false,
    previous_reviewer: false,
    has_publications_saved: false,
    orcid_id: "",
    profile_url: "",
    external_id: "",
    pkg_id: "",
    given_names: "",
    surname: "",
    aff_ror_id: "",
    reviewer_type: "",
    number_of_reviews: 0,
    completed_reviews: 0,
    currently_reviewing: 0,
    total_publications: undefined,
    citation_count: undefined,
    publication_year_from: undefined,
    publication_year_to: undefined,
    publication_count_last_year: undefined,
    last_publication_date: undefined,
    total_invitations: 0,
    total_acceptances: 0,
    total_completions: 0,
    average_response_time_hours: undefined,
    last_activity_date: undefined,
  });
  const [expertiseInput, setExpertiseInput] = React.useState("");

  // Match form state for editing
  const [matchFormData, setMatchFormData] = React.useState<
    Partial<ManuscriptMatch>
  >({});

  // Publication form state
  const [publicationFormData, setPublicationFormData] = React.useState({
    title: "",
    doi: "",
    journal_name: "",
    authors: [] as string[],
    publication_date: "",
    is_related: false,
  });
  const [authorInput, setAuthorInput] = React.useState("");

  const fetchReviewerProfile = React.useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        // Fetch base reviewer data
        const { data: reviewerData, error: reviewerError } = await supabase
          .from("potential_reviewers")
          .select("*")
          .eq("id", id)
          .single();

        if (reviewerError) throw reviewerError;

        // Fetch manuscript data if manuscriptId is provided (for author/journal checks)
        let manuscriptData: { authors: string[]; journal: string } | null =
          null;
        let manuscriptConflicts: string | null = null;
        if (manuscriptId) {
          const { data: manuscript } = await supabase
            .from("manuscripts")
            .select("authors, journal")
            .eq("id", manuscriptId)
            .single();

          manuscriptData = manuscript;

          const { data: matchData, error: matchError } = await supabase
            .from("reviewer_manuscript_matches")
            .select("conflicts_of_interest")
            .eq("manuscript_id", manuscriptId)
            .eq("reviewer_id", id)
            .single();

          console.log("Match data for conflicts:", {
            manuscriptId,
            reviewerId: id,
            matchData,
            matchError,
            conflicts: matchData?.conflicts_of_interest,
          });

          manuscriptConflicts = matchData?.conflicts_of_interest || null;
        }

        // Fetch publications (all for analysis, show top 4 in UI)
        const { data: publicationsData } = await supabase
          .from("reviewer_publications")
          .select("*")
          .eq("reviewer_id", id)
          .order("publication_date", { ascending: false });

        // Fetch recent invitation history (last 3 invitations)
        const { data: recentInvitationsData } = await supabase
          .from("review_invitations")
          .select("status, invited_date, response_date")
          .eq("reviewer_id", id)
          .order("invited_date", { ascending: false })
          .limit(3);

        // Fetch retractions
        const { data: retractionsData } = await supabase
          .from("reviewer_retractions")
          .select("*")
          .eq("reviewer_id", id)
          .single();

        // Combine all data
        const profile: ReviewerProfile = {
          ...reviewerData,
          conflicts_of_interest: manuscriptConflicts || "",
          match_score: 0, // Will be populated if from manuscript matches
          email_is_institutional: isInstitutionalEmail(reviewerData.email),
          acceptance_rate:
            reviewerData.total_invitations > 0
              ? Math.round(
                  (reviewerData.total_acceptances /
                    reviewerData.total_invitations) *
                    100
                )
              : 0,
          related_publications_count:
            publicationsData?.filter((p) => p.is_related).length || 0,
          solo_authored_count:
            publicationsData?.filter((p) => p.authors?.length === 1).length ||
            0,
          publications_last_5_years:
            publicationsData?.filter((p) => {
              if (!p.publication_date) return false;
              const pubYear = new Date(p.publication_date).getFullYear();
              const currentYear = new Date().getFullYear();
              return currentYear - pubYear <= 5;
            }).length || 0,
          days_since_last_review: reviewerData.last_review_completed
            ? Math.floor(
                (Date.now() -
                  new Date(reviewerData.last_review_completed).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : null,
          publications: publicationsData?.slice(0, 4) || [],
          retractions: retractionsData || undefined,
          // Add manuscript context for strong/weak point checks
          manuscript_authors: manuscriptData?.authors || [],
          manuscript_journal: manuscriptData?.journal || null,
          recent_invitations: recentInvitationsData || [],
          // Store all publications for analysis
          all_publications: publicationsData || [],
        };

        setReviewer(profile);
      } catch (err) {
        console.error("Error fetching reviewer profile:", err);
        setError("Failed to load reviewer profile. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [manuscriptId]
  );

  // Fetch reviewer details when drawer opens
  React.useEffect(() => {
    if (open && reviewerId) {
      fetchReviewerProfile(reviewerId);
    }
  }, [open, reviewerId, fetchReviewerProfile]);

  // Fetch manuscript match data separately for the edit dialog tab
  React.useEffect(() => {
    async function fetchMatchData() {
      if (!open || !reviewerId || !manuscriptId) {
        setMatchData(null);
        return;
      }

      setMatchLoading(true);
      try {
        const { data, error } = await supabase
          .from("reviewer_manuscript_matches")
          .select("*")
          .eq("reviewer_id", reviewerId)
          .eq("manuscript_id", manuscriptId)
          .single();

        if (error) {
          // Not an error if no match exists - just means no relationship
          if (error.code !== "PGRST116") {
            console.error("Error fetching match data:", error);
          }
          setMatchData(null);
        } else {
          setMatchData(data);
          setMatchFormData(data); // Initialize form with current data
        }
      } catch (err) {
        console.error("Error fetching match data:", err);
        setMatchData(null);
        setMatchFormData({});
      } finally {
        setMatchLoading(false);
      }
    }

    fetchMatchData();
  }, [open, reviewerId, manuscriptId]);

  // Calculate strong and weak points based on Figma design checklist
  const getStrongPoints = (): string[] => {
    if (!reviewer) return [];
    const points: string[] = [];

    // 1. ✓ Institutional email - NOT Gmail/Yahoo/etc.
    if (reviewer.email_is_institutional) {
      points.push("Institutional email");
    }

    // 2. ✓ Response rate < 3 days
    if (
      reviewer.average_response_time_hours &&
      reviewer.average_response_time_hours < 72
    ) {
      const days = Math.round(reviewer.average_response_time_hours / 24);
      points.push(`Fast response (<${days} day${days !== 1 ? "s" : ""})`);
    }

    // 3. ✓ Sends report on average within 5 days
    if (
      reviewer.average_review_time_days &&
      reviewer.average_review_time_days <= 5
    ) {
      points.push(`Quick reviews (≤${reviewer.average_review_time_days} days)`);
    }

    // 4. ✓ Published in similar scope (related publications)
    if (
      reviewer.related_publications_count &&
      reviewer.related_publications_count > 0
    ) {
      points.push(
        `${reviewer.related_publications_count} related publication${
          reviewer.related_publications_count !== 1 ? "s" : ""
        }`
      );
    }

    // 5. ✓ Published in the last 5 years
    if (reviewer.last_publication_date) {
      const lastPubDate = new Date(reviewer.last_publication_date);
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
      if (lastPubDate >= fiveYearsAgo) {
        points.push("Recently published");
      }
    }

    // 6. ✓ Has been an author for this journal
    if (reviewer.manuscript_journal && reviewer.all_publications) {
      const hasJournalPub = reviewer.all_publications.some(
        (pub) => pub.journal_name === reviewer.manuscript_journal
      );
      if (hasJournalPub) {
        points.push("Published in this journal");
      }
    }

    return points;
  };

  const getWeakPoints = (): string[] => {
    if (!reviewer) return [];
    const points: string[] = [];

    console.log("Weak Points Analysis:", {
      average_response_time_hours: reviewer.average_response_time_hours,
      average_review_time_days: reviewer.average_review_time_days,
      manuscript_authors: reviewer.manuscript_authors,
      last_publication_date: reviewer.last_publication_date,
      retractions: reviewer.retractions,
      recent_invitations: reviewer.recent_invitations,
      conflicts_of_interest: reviewer.conflicts_of_interest,
    });

    // 1. ⚠ Conflict of Interest
    if (
      reviewer.conflicts_of_interest &&
      reviewer.conflicts_of_interest.trim().length > 0
    ) {
      points.push("Conflict of Interest");
    }

    // 2. ⚠ Response rate > 30 days
    if (
      reviewer.average_response_time_hours &&
      reviewer.average_response_time_hours > 720
    ) {
      const days = Math.round(reviewer.average_response_time_hours / 24);
      points.push(`Slow to respond (${days}+ days)`);
    }

    // 3. ⚠ Sends report on average after > 60 days
    if (
      reviewer.average_review_time_days &&
      reviewer.average_review_time_days > 60
    ) {
      points.push(`Slow reviews (${reviewer.average_review_time_days}+ days)`);
    }

    // 4. ⚠ Is an author of this manuscript
    if (reviewer.manuscript_authors && reviewer.manuscript_authors.length > 0) {
      // Check if reviewer email or name matches any manuscript author
      const isAuthor = reviewer.manuscript_authors.some(
        (author) =>
          author
            .toLowerCase()
            .includes(reviewer.email.split("@")[0].toLowerCase()) ||
          author.toLowerCase().includes(reviewer.name.toLowerCase())
      );
      if (isAuthor) {
        points.push("⚠️ Author of this manuscript");
      }
    }

    // 5. ⚠ Has not published in the last 5 years
    if (reviewer.last_publication_date) {
      const lastPubDate = new Date(reviewer.last_publication_date);
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
      if (lastPubDate < fiveYearsAgo) {
        const years = Math.floor(
          (Date.now() - lastPubDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
        );
        points.push(`No recent publications (${years}+ years)`);
      }
    }

    // 6. ⚠ Has retractions on record
    if (reviewer.retractions?.retraction_reasons?.length) {
      points.push(
        `${reviewer.retractions.retraction_reasons.length} retraction${
          reviewer.retractions.retraction_reasons.length !== 1 ? "s" : ""
        }`
      );
    }

    // 7. ⚠ Didn't respond to the last 3 invites
    if (
      reviewer.recent_invitations &&
      reviewer.recent_invitations.length >= 3
    ) {
      const lastThree = reviewer.recent_invitations.slice(0, 3);
      const allDeclined = lastThree.every(
        (inv) => inv.status === "declined" || inv.status === "expired"
      );
      if (allDeclined) {
        points.push("Declined last 3 invitations");
      }
    }

    // 7. ⚠ Unavailable status (not from checklist, but important indicator)
    if (
      reviewer.availability_status &&
      reviewer.availability_status !== "available"
    ) {
      const statusLabel =
        reviewer.availability_status.charAt(0).toUpperCase() +
        reviewer.availability_status.slice(1);
      points.push(statusLabel);
    }

    // 8. ⚠ At or over capacity (not from checklist, but important indicator)
    if (reviewer.current_review_load >= reviewer.max_review_capacity) {
      points.push("At capacity");
    }

    console.log("Weak Points Result:", points);
    return points;
  };

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
    if (!reviewer) return;

    // Populate form with current reviewer data - complete schema
    setFormData({
      name: reviewer.name,
      email: reviewer.email,
      affiliation: reviewer.affiliation,
      department: reviewer.department || "",
      expertise_areas: reviewer.expertise_areas || [],
      current_review_load: reviewer.current_review_load || 0,
      max_review_capacity: reviewer.max_review_capacity || 3,
      average_review_time_days: reviewer.average_review_time_days || 21,
      availability_status: reviewer.availability_status || "available",
      recent_publications: reviewer.recent_publications || 0,
      h_index: reviewer.h_index,
      last_review_completed: reviewer.last_review_completed,
      is_board_member: reviewer.is_board_member || false,
      previous_reviewer: reviewer.previous_reviewer || false,
      has_publications_saved: reviewer.has_publications_saved || false,
      orcid_id: reviewer.orcid_id || "",
      profile_url: reviewer.profile_url || "",
      external_id: reviewer.external_id || "",
      pkg_id: reviewer.pkg_id || "",
      given_names: reviewer.given_names || "",
      surname: reviewer.surname || "",
      aff_ror_id: reviewer.aff_ror_id || "",
      reviewer_type: reviewer.reviewer_type || "",
      number_of_reviews: reviewer.number_of_reviews || 0,
      completed_reviews: reviewer.completed_reviews || 0,
      currently_reviewing: reviewer.currently_reviewing || 0,
      total_publications: reviewer.total_publications,
      citation_count: reviewer.citation_count,
      publication_year_from: reviewer.publication_year_from,
      publication_year_to: reviewer.publication_year_to,
      publication_count_last_year: reviewer.publication_count_last_year,
      last_publication_date: reviewer.last_publication_date,
      total_invitations: reviewer.total_invitations || 0,
      total_acceptances: reviewer.total_acceptances || 0,
      total_completions: reviewer.total_completions || 0,
      average_response_time_hours: reviewer.average_response_time_hours,
      last_activity_date: reviewer.last_activity_date,
    });

    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleAddExpertise = () => {
    if (
      expertiseInput.trim() &&
      !formData.expertise_areas?.includes(expertiseInput.trim())
    ) {
      setFormData({
        ...formData,
        expertise_areas: [
          ...(formData.expertise_areas || []),
          expertiseInput.trim(),
        ],
      });
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (index: number) => {
    setFormData({
      ...formData,
      expertise_areas: formData.expertise_areas?.filter((_, i) => i !== index),
    });
  };

  const handleSaveReviewer = async () => {
    if (!reviewer) return;

    try {
      await updateReviewer(reviewer.id, formData as PotentialReviewer);
      showSnackbar("Reviewer updated successfully", "success");
      handleCloseEditDialog();
      // Refresh reviewer data
      fetchReviewerProfile(reviewer.id);
    } catch (error) {
      console.error("Error updating reviewer:", error);
      showSnackbar("Failed to update reviewer", "error");
    }
  };

  const handleSaveMatchData = async () => {
    if (!matchData || !matchFormData.match_score) return;

    try {
      const { error } = await supabase
        .from("reviewer_manuscript_matches")
        .update({
          match_score: matchFormData.match_score,
          conflicts_of_interest: matchFormData.conflicts_of_interest,
        })
        .eq("id", matchData.id);

      if (error) throw error;

      showSnackbar("Match data updated successfully", "success");
      handleCloseEditDialog();
      // Refresh match data
      setMatchData({ ...matchData, ...matchFormData });
    } catch (error) {
      console.error("Error updating match data:", error);
      showSnackbar("Failed to update match data", "error");
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

  // Publications management handlers
  const handleOpenPublicationsDialog = () => {
    setPublicationsDialogOpen(true);
  };

  const handleClosePublicationsDialog = () => {
    setPublicationsDialogOpen(false);
  };

  const handleOpenPublicationEdit = (publication: Publication) => {
    setSelectedPublication(publication);
    setPublicationFormData({
      title: publication.title,
      doi: publication.doi || "",
      journal_name: publication.journal_name || "",
      authors: publication.authors || [],
      publication_date: publication.publication_date || "",
      is_related: publication.is_related,
    });
    setPublicationEditDialogOpen(true);
  };

  const handleClosePublicationEdit = () => {
    setPublicationEditDialogOpen(false);
    setSelectedPublication(null);
    setAuthorInput("");
  };

  const handleAddAuthor = () => {
    if (authorInput.trim()) {
      const newAuthors = authorInput
        .split(",")
        .map((author) => author.trim())
        .filter((author) => author.length > 0);

      setPublicationFormData({
        ...publicationFormData,
        authors: [...publicationFormData.authors, ...newAuthors],
      });
      setAuthorInput("");
    }
  };

  const handleRemoveAuthor = (index: number) => {
    setPublicationFormData({
      ...publicationFormData,
      authors: publicationFormData.authors.filter((_, i) => i !== index),
    });
  };

  const handleSavePublication = async () => {
    if (!selectedPublication || !reviewer) return;

    try {
      const { error } = await supabase
        .from("reviewer_publications")
        .update({
          title: publicationFormData.title,
          doi: publicationFormData.doi || null,
          journal_name: publicationFormData.journal_name || null,
          authors:
            publicationFormData.authors.length > 0
              ? publicationFormData.authors
              : null,
          publication_date: publicationFormData.publication_date || null,
          is_related: publicationFormData.is_related,
        })
        .eq("id", selectedPublication.id);

      if (error) throw error;

      showSnackbar("Publication updated successfully", "success");
      handleClosePublicationEdit();
      // Refresh reviewer data
      fetchReviewerProfile(reviewer.id);
    } catch (error) {
      console.error("Error updating publication:", error);
      showSnackbar("Failed to update publication", "error");
    }
  };

  return (
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
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          p: 3,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Reviewer Details
        </Typography>
        <Stack direction="row" spacing={1}>
          {isAdmin() && reviewer && (
            <Tooltip title="Edit Reviewer">
              <IconButton
                onClick={handleOpenEditDialog}
                size="small"
                sx={{ mt: -1 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={onClose} size="small" sx={{ mt: -1, mr: -1 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 3 }}>
        {loading && (
          <Stack spacing={2}>
            {/* Profile Header Skeleton */}
            <Box>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Skeleton variant="text" width="60%" height={32} />
                </Stack>
                <Skeleton variant="text" width="80%" height={24} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="circular" width={20} height={20} />
                </Stack>
              </Stack>
            </Box>

            <Divider />

            {/* Strong/Weak Points Skeleton */}
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ p: 2 }}>
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={24}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton variant="text" width="100%" height={20} />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper sx={{ p: 2 }}>
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={24}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton variant="text" width="100%" height={20} />
                </Paper>
              </Grid>
            </Grid>

            {/* Publications Skeleton */}
            <Box>
              <Skeleton variant="text" width="50%" height={24} sx={{ mb: 1 }} />
              <Stack spacing={1}>
                {[1, 2, 3, 4].map((i) => (
                  <Paper key={i} variant="outlined" sx={{ p: 2 }}>
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={16}
                      sx={{ mt: 0.5 }}
                    />
                  </Paper>
                ))}
              </Stack>
            </Box>

            {/* Publication Metrics Skeleton */}
            <Box>
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
              <Grid container spacing={1.5}>
                {[1, 2, 3].map((i) => (
                  <Grid key={i} size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 1.5 }}>
                      <Skeleton variant="text" width="40%" height={28} />
                      <Skeleton
                        variant="text"
                        width="80%"
                        height={16}
                        sx={{ mt: 0.5 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Current Workload Skeleton */}
            <Box>
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
              <Grid container spacing={1.5}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid key={i} size={{ xs: 6, sm: 3 }}>
                    <Paper sx={{ p: 1.5 }}>
                      <Skeleton variant="text" width="50%" height={28} />
                      <Skeleton
                        variant="text"
                        width="80%"
                        height={16}
                        sx={{ mt: 0.5 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Reviewer Performance Skeleton */}
            <Box>
              <Skeleton variant="text" width="50%" height={24} sx={{ mb: 1 }} />
              <Grid container spacing={1.5}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid key={i} size={{ xs: 6, sm: 3 }}>
                    <Paper sx={{ p: 1.5 }}>
                      <Skeleton variant="text" width="50%" height={28} />
                      <Skeleton
                        variant="text"
                        width="80%"
                        height={16}
                        sx={{ mt: 0.5 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {reviewer && (
          <Stack spacing={2}>
            {/* User Info */}
            <Box>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="subtitle1">{reviewer.name}</Typography>
                  {reviewer.orcid_id && (
                    <Tooltip title="ORCID Profile">
                      <IconButton
                        size="small"
                        href={`https://orcid.org/${reviewer.orcid_id}`}
                        target="_blank"
                        sx={{ p: 0.5 }}
                      >
                        <LinkIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton
                    size="small"
                    href={`mailto:${reviewer.email}`}
                    sx={{ p: 0.5 }}
                  >
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Typography variant="body1" color="text.secondary">
                  {reviewer.affiliation}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body1" color="text.secondary">
                    {reviewer.email}
                  </Typography>
                  {reviewer.email_is_institutional && (
                    <Tooltip title="Institutional email verified">
                      <VerifiedIcon
                        fontSize="small"
                        sx={{ color: "success.main" }}
                      />
                    </Tooltip>
                  )}
                </Stack>

                {/* Alert Chips */}
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {reviewer.conflicts_of_interest &&
                    reviewer.conflicts_of_interest.trim().length > 0 && (
                      <Tooltip title={reviewer.conflicts_of_interest.trim()}>
                        <Chip
                          label="CONFLICT OF INTEREST"
                          size="small"
                          variant="outlined"
                          color="error"
                          sx={{
                            textTransform: "uppercase",
                            fontWeight: "bold",
                          }}
                        />
                      </Tooltip>
                    )}
                  {reviewer.previous_reviewer && (
                    <Chip
                      label="REVIEWED PREVIOUS VERSION"
                      size="small"
                      variant="outlined"
                      color="warning"
                      sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                    />
                  )}
                </Stack>

                {/* External Profile Links */}
                {(reviewer.orcid_id ||
                  reviewer.profile_url ||
                  reviewer.external_id) && (
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    {reviewer.orcid_id && (
                      <MuiLink
                        href={`https://orcid.org/${reviewer.orcid_id}`}
                        target="_blank"
                        underline="hover"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "primary.main",
                          fontWeight: 600,
                        }}
                      >
                        ORCiD
                      </MuiLink>
                    )}
                    {reviewer.profile_url?.includes("scopus") && (
                      <MuiLink
                        href={reviewer.profile_url}
                        target="_blank"
                        underline="hover"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "primary.main",
                          fontWeight: 600,
                        }}
                      >
                        Scopus
                      </MuiLink>
                    )}
                    {reviewer.profile_url?.includes("semanticscholar") && (
                      <MuiLink
                        href={reviewer.profile_url}
                        target="_blank"
                        underline="hover"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "primary.main",
                          fontWeight: 600,
                        }}
                      >
                        Semantic Scholar
                      </MuiLink>
                    )}
                  </Stack>
                )}
              </Stack>
            </Box>

            <Divider />

            {/* Strong/Weak Points */}
            <Grid container spacing={1.5}>
              {getStrongPoints().length > 0 && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Alert severity="success" icon={<CheckCircleIcon />}>
                    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                      Strong Points
                    </Typography>
                    <Typography variant="body2">
                      {getStrongPoints().join(", ")}
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {getWeakPoints().length > 0 && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Alert severity="warning" icon={<WarningIcon />}>
                    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                      Weak Points
                    </Typography>
                    <Typography variant="body2">
                      {getWeakPoints().join(", ")}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>

            {/* Relevant Publications */}
            {reviewer.publications && reviewer.publications.length > 0 && (
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Relevant Publications (Last 5 Years)
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {isAdmin() && (
                      <Tooltip title="Manage Publications">
                        <IconButton
                          size="small"
                          onClick={handleOpenPublicationsDialog}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {reviewer.publications.length > 4 && (
                      <Button
                        size="small"
                        endIcon={<OpenInNewIcon />}
                        sx={{ textTransform: "none" }}
                      >
                        See all {reviewer.publications.length}
                      </Button>
                    )}
                  </Stack>
                </Stack>

                <Stack spacing={1}>
                  {reviewer.publications.slice(0, 4).map((pub) => (
                    <Paper
                      key={pub.id}
                      variant="outlined"
                      sx={{ p: 2, borderRadius: 1.5 }}
                    >
                      <Stack spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body1">{pub.title}</Typography>
                          {pub.is_related && (
                            <Chip
                              label="CO-AUTHOR"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                          {reviewer.retractions?.retraction_reasons.some(() =>
                            pub.title.toLowerCase().includes("retract")
                          ) && (
                            <Chip
                              label="RETRACTED"
                              size="small"
                              color="error"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <Typography variant="overline">
                            {pub.journal_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            •
                          </Typography>
                          <Typography variant="overline">
                            {pub.publication_date
                              ? new Date(pub.publication_date).getFullYear()
                              : "N/A"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Publication Metrics */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Publication metrics
              </Typography>
              <Grid container spacing={1.5}>
                {reviewer.h_index && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 1.5 }}>
                      <Typography variant="subtitle1">
                        {reviewer.h_index}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        h-index
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1">
                      {reviewer.solo_authored_count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Solo-authored
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1">
                      {reviewer.publications_last_5_years}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last 5 years
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Keywords */}
            {reviewer.expertise_areas &&
              reviewer.expertise_areas.length > 0 && (
                <Box>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="subtitle1">Keywords</Typography>
                    <Tooltip title="Reviewer's areas of expertise">
                      <HelpOutlineIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Stack>
                  <Typography variant="body1" color="text.secondary">
                    {reviewer.expertise_areas.join(", ")}
                  </Typography>
                </Box>
              )}

            {/* Current Workload */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Current workload
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1">
                      {reviewer.current_review_load || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Currently reviewing
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5 }}>
                    <Stack direction="row" spacing={0.5} alignItems="baseline">
                      <Typography variant="subtitle1">
                        {reviewer.total_invitations || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (last 6 months)
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Invitation received
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1">
                      {reviewer.days_since_last_review
                        ? `${reviewer.days_since_last_review} days ago`
                        : "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last invitation response
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1">
                      {reviewer.average_review_time_days || "N/A"} days
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average speed
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Reviewer Performance */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Reviewer performance
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1">
                      {reviewer.average_response_time_hours
                        ? `${Math.round(
                            reviewer.average_response_time_hours / 24
                          )} days`
                        : "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average response time
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1">
                      {reviewer.acceptance_rate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Acceptance rate
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1">
                      {reviewer.completed_reviews || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reports submitted
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1">
                      {reviewer.days_since_last_review
                        ? `${reviewer.days_since_last_review} ago`
                        : "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last report submitted
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Feedback Widget */}
            <Paper sx={{ p: 2, borderRadius: 1.5 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                How accurate is this reviewer suggestion?
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" size="small">
                  Not accurate at all
                </Button>
                <Button variant="outlined" size="small">
                  Somewhat accurate
                </Button>
                <Button variant="outlined" size="small">
                  Accurate
                </Button>
              </Stack>
            </Paper>
          </Stack>
        )}
      </Box>

      {/* Footer Actions */}
      {reviewer && (
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            justifyContent: "flex-end",
            p: 3,
            borderTop: 1,
            borderColor: "divider",
            boxShadow: "0px -6px 16px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Button
            variant="outlined"
            size="large"
            onClick={handleAddToQueue}
            disabled={!onAddToQueue || hasConflicts()}
          >
            Add to Queue
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleInvite}
            disabled={!onInvite || hasConflicts()}
          >
            Invite Reviewer
          </Button>
        </Box>
      )}

      {/* Edit Reviewer Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Reviewer</DialogTitle>
        <DialogContent>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={editDialogTab}
              onChange={(_, newValue) => setEditDialogTab(newValue)}
            >
              <Tab label="Reviewer Details" />
              <Tab label="Manuscript Match" disabled={!manuscriptId} />
            </Tabs>
          </Box>

          {/* Tab Panel: Reviewer Details */}
          {editDialogTab === 0 && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Basic Information */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Basic Information
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      fullWidth
                    />
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Given Names"
                        value={formData.given_names}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            given_names: e.target.value,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Surname"
                        value={formData.surname}
                        onChange={(e) =>
                          setFormData({ ...formData, surname: e.target.value })
                        }
                        fullWidth
                      />
                    </Stack>
                    <TextField
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      label="Affiliation"
                      value={formData.affiliation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          affiliation: e.target.value,
                        })
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      label="Department"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      fullWidth
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Identity & External IDs */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Identity & External IDs
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="External ID"
                        value={formData.external_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            external_id: e.target.value,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="PKG ID"
                        value={formData.pkg_id}
                        onChange={(e) =>
                          setFormData({ ...formData, pkg_id: e.target.value })
                        }
                        fullWidth
                      />
                    </Stack>
                    <TextField
                      label="ORCID ID"
                      value={formData.orcid_id}
                      onChange={(e) =>
                        setFormData({ ...formData, orcid_id: e.target.value })
                      }
                      fullWidth
                      helperText="e.g., 0000-0002-1825-0097"
                    />
                    <TextField
                      label="ROR ID (Affiliation)"
                      value={formData.aff_ror_id}
                      onChange={(e) =>
                        setFormData({ ...formData, aff_ror_id: e.target.value })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Profile URL"
                      value={formData.profile_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile_url: e.target.value,
                        })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Reviewer Type"
                      value={formData.reviewer_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reviewer_type: e.target.value,
                        })
                      }
                      fullWidth
                      helperText="e.g., External, Editorial Board, Ad Hoc"
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Expertise */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Expertise Areas
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <TextField
                      label="Add expertise area"
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddExpertise()
                      }
                      size="small"
                      fullWidth
                    />
                    <Button onClick={handleAddExpertise} variant="outlined">
                      Add
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {formData.expertise_areas?.map((area, idx) => (
                      <Chip
                        key={idx}
                        label={area}
                        onDelete={() => handleRemoveExpertise(idx)}
                        sx={{ mb: 0.5 }}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Availability & Capacity */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Availability & Capacity
                  </Typography>
                  <Stack spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>Availability Status</InputLabel>
                      <Select
                        value={formData.availability_status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availability_status: e.target.value as
                              | "available"
                              | "busy"
                              | "unavailable"
                              | "sabbatical",
                          })
                        }
                        label="Availability Status"
                      >
                        {availabilityOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Current Review Load"
                        type="number"
                        value={formData.current_review_load}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            current_review_load: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Max Review Capacity"
                        type="number"
                        value={formData.max_review_capacity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            max_review_capacity: parseInt(e.target.value) || 3,
                          })
                        }
                        fullWidth
                      />
                    </Stack>
                    <TextField
                      label="Average Review Time (days)"
                      type="number"
                      value={formData.average_review_time_days}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          average_review_time_days:
                            parseInt(e.target.value) || 21,
                        })
                      }
                      fullWidth
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Status Flags */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Status & Flags
                  </Typography>
                  <Stack spacing={2}>
                    <FormControl component="fieldset">
                      <Stack direction="row" spacing={2}>
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.is_board_member}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                is_board_member: e.target.checked,
                              })
                            }
                          />
                          <Typography component="span" sx={{ ml: 1 }}>
                            Editorial Board Member
                          </Typography>
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.previous_reviewer}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                previous_reviewer: e.target.checked,
                              })
                            }
                          />
                          <Typography component="span" sx={{ ml: 1 }}>
                            Previous Reviewer
                          </Typography>
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.has_publications_saved}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                has_publications_saved: e.target.checked,
                              })
                            }
                          />
                          <Typography component="span" sx={{ ml: 1 }}>
                            Has Publications Saved
                          </Typography>
                        </label>
                      </Stack>
                    </FormControl>
                  </Stack>
                </CardContent>
              </Card>

              {/* Review Statistics */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Review Statistics
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Number of Reviews"
                        type="number"
                        value={formData.number_of_reviews}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            number_of_reviews: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Completed Reviews"
                        type="number"
                        value={formData.completed_reviews}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            completed_reviews: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Currently Reviewing"
                        type="number"
                        value={formData.currently_reviewing}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currently_reviewing: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                    </Stack>
                    <TextField
                      label="Last Review Completed"
                      type="date"
                      value={formData.last_review_completed || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          last_review_completed: e.target.value || "",
                        })
                      }
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Publication Metrics */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Publication Metrics
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Recent Publications"
                        type="number"
                        value={formData.recent_publications}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recent_publications: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Total Publications"
                        type="number"
                        value={formData.total_publications || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_publications: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="H-Index"
                        type="number"
                        value={formData.h_index || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            h_index: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Citation Count"
                        type="number"
                        value={formData.citation_count || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            citation_count: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Publication Year From"
                        type="number"
                        value={formData.publication_year_from || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            publication_year_from: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Publication Year To"
                        type="number"
                        value={formData.publication_year_to || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            publication_year_to: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Publications Last Year"
                        type="number"
                        value={formData.publication_count_last_year || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            publication_count_last_year: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Last Publication Date"
                        type="date"
                        value={formData.last_publication_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_publication_date: e.target.value || "",
                          })
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Invitation Statistics */}
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Invitation Statistics
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Total Invitations"
                        type="number"
                        value={formData.total_invitations}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_invitations: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Total Acceptances"
                        type="number"
                        value={formData.total_acceptances}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_acceptances: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Total Completions"
                        type="number"
                        value={formData.total_completions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            total_completions: parseInt(e.target.value) || 0,
                          })
                        }
                        fullWidth
                      />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Avg Response Time (hours)"
                        type="number"
                        value={formData.average_response_time_hours || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            average_response_time_hours: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Last Activity Date"
                        type="date"
                        value={formData.last_activity_date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_activity_date: e.target.value || "",
                          })
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Tab Panel: Manuscript Match */}
          {editDialogTab === 1 && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              {matchLoading ? (
                <Stack spacing={2}>
                  <Skeleton variant="rectangular" height={120} />
                  <Skeleton variant="rectangular" height={80} />
                  <Skeleton variant="rectangular" height={80} />
                </Stack>
              ) : matchData ? (
                <>
                  {/* Match Score */}
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                      >
                        Match Score
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Typography variant="h3" color="primary.main">
                          {(matchData.match_score * 100).toFixed(0)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          AI-generated match quality
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Calculated on{" "}
                        {new Date(matchData.calculated_at).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Conflicts of Interest */}
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                      >
                        Conflicts of Interest
                      </Typography>
                      <TextField
                        multiline
                        rows={4}
                        fullWidth
                        value={
                          matchFormData.conflicts_of_interest ??
                          matchData.conflicts_of_interest ??
                          ""
                        }
                        onChange={(e) => {
                          setMatchFormData({
                            ...matchFormData,
                            conflicts_of_interest: e.target.value,
                          });
                        }}
                        placeholder="No conflicts of interest identified for this manuscript"
                        helperText="Manuscript-specific conflicts of interest for this reviewer"
                      />
                    </CardContent>
                  </Card>

                  {/* Match Details */}
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                      >
                        Match Details
                      </Typography>
                      <Stack spacing={2}>
                        <TextField
                          label="Match Score (0-1)"
                          type="number"
                          value={
                            matchFormData.match_score ?? matchData.match_score
                          }
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setMatchFormData({
                              ...matchFormData,
                              match_score: isNaN(value)
                                ? 0
                                : Math.min(1, Math.max(0, value)),
                            });
                          }}
                          inputProps={{ min: 0, max: 1, step: 0.01 }}
                          fullWidth
                          helperText="Match quality score (displayed as percentage to users)"
                        />
                        <Stack direction="row" spacing={2}>
                          <TextField
                            label="Manuscript ID"
                            value={matchData.manuscript_id}
                            fullWidth
                            disabled
                            InputProps={{ sx: { fontFamily: "monospace" } }}
                          />
                          <TextField
                            label="Reviewer ID"
                            value={matchData.reviewer_id}
                            fullWidth
                            disabled
                            InputProps={{ sx: { fontFamily: "monospace" } }}
                          />
                        </Stack>
                        <TextField
                          label="Match Relationship ID"
                          value={matchData.id}
                          fullWidth
                          disabled
                          InputProps={{ sx: { fontFamily: "monospace" } }}
                        />
                        <TextField
                          label="Calculated At"
                          value={new Date(
                            matchData.calculated_at
                          ).toLocaleString()}
                          fullWidth
                          disabled
                        />
                      </Stack>
                    </CardContent>
                  </Card>

                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Note:</strong> This match data is stored in the
                      reviewer_manuscript_matches table. Match scores are
                      AI-generated based on expertise alignment, publication
                      history, and other factors.
                    </Typography>
                  </Alert>
                </>
              ) : (
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center", py: 4 }}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      No match relationship found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This reviewer has not been matched to the current
                      manuscript. Match relationships are created when reviewers
                      are suggested based on AI analysis.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            onClick={async () => {
              if (editDialogTab === 0) {
                // Save reviewer details
                await handleSaveReviewer();
              } else {
                // Save match data
                await handleSaveMatchData();
              }
            }}
            variant="contained"
            disabled={
              editDialogTab === 0
                ? !formData.name || !formData.email || !formData.affiliation
                : !matchData || !matchFormData.match_score
            }
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Publications List Dialog */}
      <Dialog
        open={publicationsDialogOpen}
        onClose={handleClosePublicationsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Manage Publications - {reviewer?.name}</DialogTitle>
        <DialogContent>
          {reviewer?.all_publications &&
          reviewer.all_publications.length > 0 ? (
            <Stack spacing={1} sx={{ mt: 2 }}>
              {reviewer.all_publications.map((pub) => (
                <Paper
                  key={pub.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body1" fontWeight={500}>
                        {pub.title}
                      </Typography>
                      {pub.is_related && (
                        <Chip
                          label="Related"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {pub.journal_name || "No journal"}
                      </Typography>
                      {pub.publication_date && (
                        <>
                          <Typography variant="caption" color="text.secondary">
                            •
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(pub.publication_date).getFullYear()}
                          </Typography>
                        </>
                      )}
                    </Stack>
                    {pub.authors && pub.authors.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {pub.authors.slice(0, 3).map((author, idx) => (
                          <Chip key={idx} label={author} size="small" />
                        ))}
                        {pub.authors.length > 3 && (
                          <Chip
                            label={`+${pub.authors.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    )}
                  </Stack>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenPublicationEdit(pub)}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography
              color="text.secondary"
              sx={{ py: 4, textAlign: "center" }}
            >
              No publications found for this reviewer
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePublicationsDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Publication Edit Dialog */}
      <Dialog
        open={publicationEditDialogOpen}
        onClose={handleClosePublicationEdit}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Publication</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              value={publicationFormData.title}
              onChange={(e) =>
                setPublicationFormData({
                  ...publicationFormData,
                  title: e.target.value,
                })
              }
              required
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label="Journal Name"
              value={publicationFormData.journal_name}
              onChange={(e) =>
                setPublicationFormData({
                  ...publicationFormData,
                  journal_name: e.target.value,
                })
              }
              fullWidth
            />

            <TextField
              label="DOI"
              value={publicationFormData.doi}
              onChange={(e) =>
                setPublicationFormData({
                  ...publicationFormData,
                  doi: e.target.value,
                })
              }
              fullWidth
              helperText="e.g., 10.1234/example.doi"
            />

            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  label="Add Author"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAuthor();
                    }
                  }}
                  fullWidth
                  size="small"
                  helperText="Enter one or more authors separated by commas"
                />
                <Button onClick={handleAddAuthor} variant="outlined">
                  Add
                </Button>
              </Stack>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {publicationFormData.authors.map((author, idx) => (
                  <Chip
                    key={idx}
                    label={author}
                    onDelete={() => handleRemoveAuthor(idx)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            <TextField
              label="Publication Date"
              type="date"
              value={publicationFormData.publication_date}
              onChange={(e) =>
                setPublicationFormData({
                  ...publicationFormData,
                  publication_date: e.target.value,
                })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={publicationFormData.is_related}
                  onChange={(e) =>
                    setPublicationFormData({
                      ...publicationFormData,
                      is_related: e.target.checked,
                    })
                  }
                />
              }
              label="Related to current manuscript"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePublicationEdit}>Cancel</Button>
          <Button
            onClick={handleSavePublication}
            variant="contained"
            disabled={!publicationFormData.title}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

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
    </Drawer>
  );
}
