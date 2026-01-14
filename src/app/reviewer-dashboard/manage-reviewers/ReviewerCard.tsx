"use client";
import * as React from "react";
import {
  Card,
  Typography,
  Chip,
  Stack,
  Box,
  Tooltip,
  Button,
  Link as MuiLink,
  Grid,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { SvgIcon, IconButton } from "@mui/material";
import type { PotentialReviewerWithMatch } from "@/lib/supabase";

// ORCID Icon Component
const OrcidIcon = (props: React.ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} viewBox="0 0 1024 1024">
    <circle cx="512" cy="512" r="512" fill="#a6ce39" />
    <path
      d="M373.7 709.3h-50.4V358.5h50.4v350.8zm74-350.8h136.2c129.7 0 186.7 92.7 186.7 175.5 0 90.1-70.4 175.5-186 175.5H447.7v-351zm50.4 305.6h80.2c114.3 0 140.5-86.8 140.5-130 0-70.4-44.9-130-143.1-130h-77.6v260zM381.6 285.5c0 18-14.7 33.1-33.1 33.1-18.3 0-33.1-15.1-33.1-33.1 0-18.3 14.7-33.1 33.1-33.1 18.3 0 33.1 15.1 33.1 33.1z"
      fill="#fff"
    />
  </SvgIcon>
);

type ReviewerCardProps = {
  reviewer: PotentialReviewerWithMatch;
  onInvite: (reviewerId: string) => void;
  onAddToQueue: (reviewerId: string) => void;
  onViewProfile: (reviewerId: string) => void;
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

const hasConflicts = (conflicts?: string | string[]) => {
  if (!conflicts) return false;
  if (typeof conflicts === "string") return conflicts.trim().length > 0;
  return conflicts.length > 0;
};

export default function ReviewerCard({
  reviewer,
  onInvite,
  onAddToQueue,
  onViewProfile,
}: ReviewerCardProps) {
  const conflict = hasConflicts(reviewer.conflicts_of_interest);
  // Some deployments' types may omit optional profile fields like ORCID.
  // Safely extract if present without changing global types.
  const orcidId = (reviewer as unknown as Record<string, unknown>)[
    "orcid_id"
  ] as string | undefined;

  return (
    <Card
      variant="outlined"
      sx={{
        p: 0,
        borderRadius: 1.5,
        borderColor: (theme) => (theme.vars || theme).palette.divider,
      }}
    >
      {/* Top content as 3 columns */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="flex-start">
          {/* Column 1: Availability, Name + ORCID, Affiliation, Email (grow) */}
          <Grid size={{ xs: 12, md: "grow" }}>
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              <Chip
                label={reviewer.availability_status}
                size="small"
                variant="outlined"
                color={
                  getAvailabilityColor(reviewer.availability_status) as
                    | "success"
                    | "warning"
                    | "error"
                    | "info"
                    | "default"
                }
                sx={{
                  textTransform: "uppercase",
                  alignSelf: "flex-start",
                }}
              />
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ minWidth: 0 }}
              >
                <Typography variant="body1" fontWeight={700} noWrap>
                  {reviewer.name}
                </Typography>
                {orcidId && (
                  <Tooltip title={orcidId}>
                    <OrcidIcon
                      sx={{
                        fontSize: 16,
                      }}
                    />
                  </Tooltip>
                )}
                <Tooltip title="Add to bookmarks">
                  <IconButton size="small">
                    <BookmarkBorderIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Typography variant="body1" color="text.secondary" noWrap>
                {reviewer.affiliation}
              </Typography>
              <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{ minWidth: 0 }}
              >
                <Typography variant="body1" color="text.secondary" noWrap>
                  {reviewer.email}
                </Typography>
                {reviewer.email_is_institutional && (
                  <Tooltip title="Institutional email">
                    <CheckCircleIcon
                      sx={{
                        fontSize: 16,
                        color: (theme) =>
                          (theme.vars || theme).palette.success.main,
                      }}
                    />
                  </Tooltip>
                )}
                {conflict && (
                  <Tooltip title="Conflict of interest">
                    <CancelIcon
                      sx={{
                        fontSize: 16,
                        color: (theme) =>
                          (theme.vars || theme).palette.error.main,
                      }}
                    />
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          </Grid>

          {/* Column 2: Keywords (first 5) + View Publications (grow) */}
          <Grid size={{ xs: 12, md: "grow" }}>
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              <Typography variant="body1" color="text.secondary">
                Top keywords:
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ whiteSpace: "normal" }}
              >
                {reviewer.expertise_areas.slice(0, 5).join("; ")}
                {reviewer.expertise_areas.length > 5 ? ";" : ""}
              </Typography>
              <Button
                variant="text"
                size="small"
                color="secondary"
                onClick={() => onViewProfile(reviewer.id)}
                endIcon={<ChevronRightIcon />}
                sx={{
                  alignSelf: "flex-start",
                }}
              >
                View Publications
              </Button>
            </Stack>
          </Grid>

          {/* Column 3: Open Profile action (auto width) */}
          <Grid
            size={{ xs: "auto", md: "auto" }}
            display="flex"
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
            alignItems="flex-start"
          >
            <Button
              variant="text"
              size="small"
              color="secondary"
              onClick={() => onViewProfile(reviewer.id)}
              endIcon={<OpenInFullIcon />}
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              Open Profile
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: (theme) => (theme.vars || theme).palette.action.hover,
          borderTop: "1px solid",
          borderColor: (theme) => (theme.vars || theme).palette.divider,
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <MuiLink
          component="button"
          type="button"
          color="secondary"
          underline="hover"
          sx={{ fontWeight: 600 }}
        >
          Rate Suggestion
        </MuiLink>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            color="secondary"
            onClick={() => onInvite(reviewer.id)}
            startIcon={<MailOutlineIcon />}
            disabled={conflict}
          >
            Invite Now
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="neutral"
            onClick={() => onAddToQueue(reviewer.id)}
            disabled={conflict}
          >
            Add To Queue
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
