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
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { PotentialReviewerWithMatch } from "@/lib/supabase";

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
                color={
                  getAvailabilityColor(reviewer.availability_status) as
                    | "success"
                    | "warning"
                    | "error"
                    | "info"
                    | "default"
                }
                sx={{
                  height: 20,
                  textTransform: "capitalize",
                  alignSelf: "flex-start",
                }}
              />
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ minWidth: 0 }}
              >
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                  {reviewer.name}
                </Typography>
                {orcidId && (
                  <Tooltip title={orcidId}>
                    <FingerprintIcon
                      sx={{
                        fontSize: 16,
                        color: (theme) =>
                          (theme.vars || theme).palette.text.secondary,
                      }}
                    />
                  </Tooltip>
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary" noWrap>
                {reviewer.affiliation}
              </Typography>
              <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{ minWidth: 0 }}
              >
                <Typography variant="body2" color="text.secondary" noWrap>
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
              <Typography variant="body2" color="text.secondary">
                Top keywords:
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "normal" }}
              >
                {reviewer.expertise_areas.slice(0, 5).join("; ")}
                {reviewer.expertise_areas.length > 5 ? ";" : ""}
              </Typography>
              <MuiLink
                component="button"
                type="button"
                color="primary"
                underline="hover"
                onClick={() => onViewProfile(reviewer.id)}
                sx={{ fontWeight: 600, alignSelf: "flex-start" }}
              >
                View Publications
              </MuiLink>
            </Stack>
          </Grid>

          {/* Column 3: Open Profile action (auto width) */}
          <Grid
            size={{ xs: "auto", md: "auto" }}
            display="flex"
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
            alignItems="flex-start"
          >
            <MuiLink
              component="button"
              type="button"
              color="primary"
              underline="hover"
              onClick={() => onViewProfile(reviewer.id)}
              sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
            >
              Open Profile
            </MuiLink>
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
          color="primary"
          underline="hover"
          sx={{ fontWeight: 600 }}
        >
          Rate Suggestion
        </MuiLink>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            size="small"
            color="primary"
            onClick={() => onInvite(reviewer.id)}
            startIcon={<MailOutlineIcon />}
          >
            Invite Now
          </Button>
          <Button
            size="small"
            variant="outlined"
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
