"use client";
import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import type { ChipProps } from "@mui/material";
import type { ManuscriptTag } from "@/lib/supabase";

type ArticleDetailsCardProps = {
  id: string;
  title: string;
  authors: string[];
  abstract?: string;
  articleType: string;
  section?: string;
  specialIssue?: string;
  academicEditor?: string;
  journal: string;
  submittedOn: string;
  stateLabel: string;
  stateCode: string;
  stateColor?: ChipProps["color"];
  manuscriptTags?: ManuscriptTag[];
};

export function ArticleDetailsCard({
  id,
  title,
  authors,
  abstract,
  articleType,
  section,
  specialIssue,
  academicEditor,
  journal,
  submittedOn,
  stateLabel,
  stateCode,
  stateColor,
  manuscriptTags = [],
}: ArticleDetailsCardProps) {
  return (
    <Box>
      {/* Article Card */}
      <Card
        variant="outlined"
        sx={{
          borderColor: "divider",
          borderRadius: "6px 6px 0 0",
          borderBottom: 0,
        }}
      >
        {/* Colored top bar */}
        <Box
          sx={{
            height: 4,
            bgcolor: stateColor ? `${stateColor}.main` : "warning.main",
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
        />

        <CardContent sx={{ p: 2 }}>
          <Stack spacing={2}>
            {/* Top row: ID, tags, status badges */}
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

            {/* Title - using text.primary color */}
            <Typography variant="h3" color="text.secondary" fontWeight={700}>
              {title}
            </Typography>

            {/* Authors with Show Affiliations button */}
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              flexWrap="wrap"
            >
              {authors.map((author, index) => (
                <React.Fragment key={author}>
                  <Typography
                    variant="body1"
                    color="secondary"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {author}
                  </Typography>
                  {index < authors.length - 1 && (
                    <Typography variant="body1" color="text.secondary">
                      ,
                    </Typography>
                  )}
                </React.Fragment>
              ))}
              <Button
                startIcon={<AddIcon />}
                size="small"
                color="secondary"
                sx={{ ml: 1, textTransform: "none", minWidth: "auto" }}
              >
                Show Affiliations
              </Button>
            </Stack>

            {/* Two-column metadata grid */}
            <Grid container spacing={2}>
              {/* Left column */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="subtitle1" color="text.secondary">
                      Article Type
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {articleType}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="subtitle1" color="text.secondary">
                      Journal
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {journal}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              {/* Right column */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={1.5}>
                  {section && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="subtitle1" color="text.secondary">
                        Section
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {section}
                      </Typography>
                    </Stack>
                  )}

                  {specialIssue && (
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Special Issue
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {specialIssue}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>

        {/* Bottom section with editors and submitted date */}
        <Box
          sx={{
            bgcolor: "rgba(0, 0, 0, 0.05)",
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            {academicEditor && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="subtitle1" color="text.secondary">
                  Academic Editor:
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {academicEditor}
                </Typography>
              </Stack>
            )}
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="subtitle1" color="text.secondary">
              Submitted on:
            </Typography>
            <Typography variant="subtitle2" color="text.primary">
              {submittedOn}
            </Typography>
          </Stack>
        </Box>
      </Card>

      {/* Additional Information - No gap, rounded bottom corners only */}
      <Card
        variant="outlined"
        sx={{
          borderColor: "divider",
          borderRadius: "0 0 6px 6px",
          borderTop: 0,
        }}
      >
        <Box
          sx={{
            bgcolor: "rgba(0, 0, 0, 0.05)",
            p: 2,
          }}
        >
          <Accordion defaultExpanded={false} disableGutters elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Abstract</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">{abstract}</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded={false} disableGutters elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Author Declaration</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                Author declarations will appear here.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded={false} disableGutters elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Files</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                Manuscript files will appear here.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Card>
    </Box>
  );
}
