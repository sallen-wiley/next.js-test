"use client";
import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import type { ChipProps } from "@mui/material";
import type { ManuscriptTag } from "@/lib/supabase";

export type ReviewerStats = {
  invited?: number;
  agreed?: number;
  declined?: number;
  submitted?: number;
};

type ArticleCardProps = {
  id: string;
  title: string;
  authors: string[];
  badges?: string[];
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
  badges = [],
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
  const theme = useTheme();
  const academicEditorLabel =
    academicEditors && academicEditors.length > 0
      ? academicEditors.join(", ")
      : "Unassigned";

  const renderStat = (
    value: number | undefined,
    label: string,
    suffix?: string
  ) => {
    if (value === undefined) return null;
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography variant="body2" fontWeight={700} color="text.secondary">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
          {suffix ? "," : ""}
        </Typography>
      </Stack>
    );
  };

  return (
    <Box display="flex" width="100%">
      <Box
        sx={{
          width: 4,
          bgcolor: stateColor ? `${stateColor}.main` : "warning.main",
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 6,
        }}
      />
      <Card
        variant="outlined"
        sx={{
          borderColor: "divider",
          borderLeft: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: 6,
          borderBottomRightRadius: 6,
          width: "100%",
          cursor: onClick ? "pointer" : "default",
        }}
        onClick={onClick}
      >
        <CardContent sx={{ p: 2 }}>
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
                <Typography variant="body2" color="text.secondary">
                  ID {id}
                </Typography>
                {manuscriptTags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "text.secondary",
                      color: "text.secondary",
                      height: 18,
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
                    fontWeight: 700,
                    height: 18,
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
                    fontWeight: 700,
                    height: 18,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderLeft: 0,
                  }}
                />
              </Stack>
            </Stack>

            <Typography variant="h6" color="secondary" fontWeight={700}>
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
                <Typography variant="body2" color="text.secondary">
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
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    Article Type:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {articleType}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  flexGrow={1}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    Academic Editor:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {academicEditorLabel}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    Reviewer Reports:
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    {renderStat(reviewerStats.invited, "invited", ",")}
                    {renderStat(reviewerStats.agreed, "agreed", ",")}
                    {renderStat(reviewerStats.declined, "declined", ",")}
                    {renderStat(reviewerStats.submitted, "submitted")}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>

        <Box
          sx={{
            bgcolor: theme.palette.grey[100],
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center" flexGrow={1}>
            <Typography variant="body2" fontWeight={700} color="text.secondary">
              Journal:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {journal}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="body2" fontWeight={700} color="text.secondary">
              Submitted on:
            </Typography>
            <Typography variant="body2" color="text.primary">
              {submittedOn}
            </Typography>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
