// Default suggestions header with tooltip explaining the matching algorithm
"use client";
import * as React from "react";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface DefaultSuggestionsHeaderProps {
  count: number;
}

export function DefaultSuggestionsHeader({
  count,
}: DefaultSuggestionsHeaderProps) {
  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 700 }} component="h2">
        Default suggestions ({count})
      </Typography>
      <Tooltip
        title={
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              How are default suggestions created?
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Phase 1: Analyze Manuscript</strong>
              <br />
              We start by extracting key concepts from your manuscript&apos;s
              title and abstract to understand its main topics.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Phase 2: Match Expertise</strong>
              <br />
              PKG compares these topics with reviewer profiles using semantic
              search and keyword matching, while checking for conflicts of
              interest and recent publications.
            </Typography>
            <Typography variant="body2">
              <strong>Phase 3: Rank and Recommend</strong>
              <br />
              Reviewers are ranked based on topic relevance, availability, and
              past response behavior. You&apos;ll receive a ranked list with
              profiles and reasons for each suggestion.
            </Typography>
          </Box>
        }
        arrow
        placement="right"
      >
        <IconButton size="small" sx={{ color: "text.secondary" }}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
