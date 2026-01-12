"use client";

import * as React from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Link as MuiLink,
  Stack,
  Tooltip,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import LinkIcon from "@mui/icons-material/Link";
import type { ReviewerProfile } from "./types";

interface ProfileOverviewProps {
  reviewer: ReviewerProfile;
}

export function ProfileOverview({ reviewer }: ProfileOverviewProps) {
  return (
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
              <VerifiedIcon fontSize="small" sx={{ color: "success.main" }} />
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
  );
}
