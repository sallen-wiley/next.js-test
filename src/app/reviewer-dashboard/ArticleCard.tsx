"use client";
import * as React from "react";
import { Box, Paper, Chip, Stack, Typography } from "@mui/material";

import type { ChipProps } from "@mui/material";
import type { ManuscriptTag } from "@/lib/supabase";
import { useThemeContext } from "@/contexts/ThemeContext";
import { renderMetricStat } from "./ReviewerMetricsDisplay";

export type ReviewerStats = {
  submitted?: number;
  overdue?: number;
  invalidated?: number;
  expired?: number;
  revoked?: number;
  accepted?: number;
  declined?: number;
  pending?: number;
  queued?: number;
};

type ArticleCardProps = {
  id: string;
  title: string;
  authors: string[];
  articleType: string;
  academicEditors: string[];
  journal: string;
  submittedOn: string;
  stateLabel: string;
  stateCode: string;
  stateColor?: ChipProps["color"];
  reviewerStats?: ReviewerStats;
  manuscriptTags?: ManuscriptTag[];
  onClick?: () => void;
};

export function ArticleCard({
  id,
  title,
  authors,
  articleType,
  academicEditors,
  journal,
  submittedOn,
  stateLabel,
  stateCode,
  stateColor,
  reviewerStats = {},
  manuscriptTags = [],
  onClick,
}: ArticleCardProps) {
  const { currentTheme } = useThemeContext();
  const titleColor = currentTheme === "phenom" ? "secondary" : "primary";

  const academicEditorLabel =
    academicEditors && academicEditors.length > 0
      ? academicEditors.join(", ")
      : "Unassigned";

  return (
    <Paper
      variant="outlined"
      sx={{
        borderColor: "divider",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        width: "100%",
      }}
      onClick={onClick}
    >
      {/* Colored left bar */}
      <Box
        sx={{
          width: 4,
          bgcolor: stateColor ? `${stateColor}.main` : "warning.main",
          flexShrink: 0,
        }}
      />

      {/* Content wrapper */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Main content */}
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography variant="subtitle2" color="text.secondary">
                  ID {id}
                </Typography>
                {manuscriptTags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{
                      textTransform: "uppercase",
                    }}
                  />
                ))}
              </Stack>

              <Stack direction="row" spacing={0}>
                <Chip
                  label={stateLabel}
                  color={stateColor || "warning"}
                  size="small"
                  sx={{
                    textTransform: "uppercase",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                />
                <Chip
                  label={stateCode}
                  color={stateColor || "warning"}
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: "uppercase",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderLeft: 0,
                  }}
                />
              </Stack>
            </Stack>

            <Typography variant="h6" color={titleColor} fontWeight={700}>
              {title}
            </Typography>

            <Stack spacing={1.5}>
              {/* Authors List - Future: Add role chips (CA, SA) when author roles added to schema */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography variant="body1" color="text.secondary">
                  {authors && authors.length > 0
                    ? authors.join(", ")
                    : "No authors"}
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
                flexWrap="wrap"
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  minWidth={220}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Article Type:
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {articleType}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  flexGrow={1}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Academic Editor:
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {academicEditorLabel}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Reviewers:
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    {renderMetricStat(reviewerStats.accepted, "accepted", ",")}
                    {renderMetricStat(reviewerStats.declined, "declined", ",")}
                    {renderMetricStat(reviewerStats.pending, "pending", ",")}
                    {renderMetricStat(reviewerStats.queued, "queued")}
                    <Typography variant="subtitle1" color="text.secondary">
                      |
                    </Typography>
                    {renderMetricStat(
                      reviewerStats.submitted,
                      "submitted",
                      ","
                    )}
                    {renderMetricStat(reviewerStats.overdue, "overdue", ",")}
                    {renderMetricStat(reviewerStats.invalidated, "invalidated")}
                    <Typography variant="subtitle1" color="text.secondary">
                      |
                    </Typography>
                    {renderMetricStat(reviewerStats.expired, "expired", ",")}
                    {renderMetricStat(reviewerStats.revoked, "revoked")}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {/* Bottom section */}
        <Box
          sx={[
            {
              bgcolor: "rgba(0, 0, 0, 0.05)",
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            },
            (theme) =>
              theme.applyStyles("dark", {
                bgcolor: "rgba(255, 255, 255, 0.05)",
              }),
          ]}
        >
          <Stack direction="row" spacing={0.5} alignItems="center" flexGrow={1}>
            <Typography variant="subtitle1" color="text.secondary">
              Journal:
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {journal}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="subtitle1" color="text.secondary">
              Submitted on:
            </Typography>
            <Typography variant="subtitle1" color="text.primary">
              {submittedOn}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
}
