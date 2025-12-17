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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { PotentialReviewerWithMatch } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { isInstitutionalEmail } from "@/utils/reviewerMetrics";

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
  retractions?: {
    retraction_reasons: string[];
  };
}

interface ReviewerProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  reviewerId: string | null;
  onAddToQueue?: (reviewerId: string) => void;
  onInvite?: (reviewerId: string) => void;
}

export default function ReviewerProfileDrawer({
  open,
  onClose,
  reviewerId,
  onAddToQueue,
  onInvite,
}: ReviewerProfileDrawerProps) {
  const [reviewer, setReviewer] = React.useState<ReviewerProfile | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch reviewer details when drawer opens
  React.useEffect(() => {
    if (open && reviewerId) {
      fetchReviewerProfile(reviewerId);
    }
  }, [open, reviewerId]);

  const fetchReviewerProfile = async (id: string) => {
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

      // Fetch publications
      const { data: publicationsData } = await supabase
        .from("reviewer_publications")
        .select("*")
        .eq("reviewer_id", id)
        .order("publication_date", { ascending: false })
        .limit(4); // Show top 4 in drawer

      // Fetch retractions
      const { data: retractionsData } = await supabase
        .from("reviewer_retractions")
        .select("*")
        .eq("reviewer_id", id)
        .single();

      // Combine all data
      const profile: ReviewerProfile = {
        ...reviewerData,
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
          publicationsData?.filter((p) => p.authors?.length === 1).length || 0,
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
        publications: publicationsData || [],
        retractions: retractionsData || undefined,
      };

      setReviewer(profile);
    } catch (err) {
      console.error("Error fetching reviewer profile:", err);
      setError("Failed to load reviewer profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate strong and weak points
  const getStrongPoints = (): string[] => {
    if (!reviewer) return [];
    const points: string[] = [];

    if (reviewer.email_is_institutional) {
      points.push("Institutional email");
    }
    if (reviewer.acceptance_rate > 50) {
      points.push("High acceptance rate");
    }
    if (reviewer.current_review_load === 0) {
      points.push("Available reviewer");
    }
    if (reviewer.completed_reviews && reviewer.completed_reviews > 10) {
      points.push("Active reviewer");
    }

    return points;
  };

  const getWeakPoints = (): string[] => {
    if (!reviewer) return [];
    const points: string[] = [];

    if (reviewer.retractions?.retraction_reasons?.length) {
      points.push("Retracted publication(s)");
    }
    if (reviewer.conflicts_of_interest) {
      points.push(reviewer.conflicts_of_interest);
    }
    if (reviewer.current_review_load >= (reviewer.max_review_capacity || 3)) {
      points.push("At capacity");
    }
    if (reviewer.acceptance_rate < 30) {
      points.push("Low acceptance rate");
    }

    return points;
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
          pb: 5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h3" sx={{ flexGrow: 1 }}>
          Reviewer Details
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ mt: -1, mr: -1 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
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
                  {reviewer.conflicts_of_interest && (
                    <Chip
                      label="CONFLICT OF INTEREST"
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                    />
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
            disabled={!onAddToQueue}
          >
            Add to Queue
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleInvite}
            disabled={!onInvite}
          >
            Invite Reviewer
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
