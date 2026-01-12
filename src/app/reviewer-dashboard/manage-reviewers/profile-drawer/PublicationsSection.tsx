"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Button,
  Paper,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import type { ReviewerProfile } from "./types";

interface PublicationsSectionProps {
  reviewer: ReviewerProfile;
  isAdmin: boolean;
  onManagePublications?: () => void;
}

export function PublicationsSection({
  reviewer,
  isAdmin,
  onManagePublications,
}: PublicationsSectionProps) {
  if (!reviewer.publications || reviewer.publications.length === 0) {
    return null;
  }

  return (
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
          {isAdmin && onManagePublications && (
            <Tooltip title="Manage Publications">
              <IconButton
                size="small"
                onClick={onManagePublications}
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
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="overline">{pub.journal_name}</Typography>
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
  );
}

interface KeywordsSection {
  expertise_areas: string[];
}

export function KeywordsSection({ expertise_areas }: KeywordsSection) {
  if (!expertise_areas || expertise_areas.length === 0) {
    return null;
  }

  return (
    <Box>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle1">Keywords</Typography>
        <Tooltip title="Reviewer's areas of expertise">
          <HelpOutlineIcon fontSize="small" color="action" />
        </Tooltip>
      </Stack>
      <Typography variant="body1" color="text.secondary">
        {expertise_areas.join(", ")}
      </Typography>
    </Box>
  );
}
