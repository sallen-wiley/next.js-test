"use client";
import * as React from "react";
import {
  Box,
  Chip,
  Stack,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Paper,
  Collapse,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
  collapsible?: boolean;
  defaultExpanded?: boolean;
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
  collapsible = false,
  defaultExpanded = true,
}: ArticleDetailsCardProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const toggleExpanded = () => {
    if (collapsible) {
      setExpanded((prev) => !prev);
    }
  };

  // When not collapsible, always show content
  const isExpanded = collapsible ? expanded : true;

  return (
    <Paper
      elevation={3}
      sx={{
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Colored top bar */}
      <Box
        sx={{
          height: 4,
          bgcolor: stateColor ? `${stateColor}.main` : "warning.main",
        }}
      />

      {/* Main content */}
      <Box sx={{ p: 2 }}>
        {/* Top row: ID, tags, status badges - ALWAYS VISIBLE */}
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

        {/* Title with optional chevron */}
        <Box
          onClick={toggleExpanded}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            mt: 2,
            ...(collapsible && {
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }),
          }}
        >
          {collapsible && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.secondary",
                pt: 0.5,
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          )}
          <Typography
            variant="h5"
            color="text.secondary"
            fontWeight={700}
            sx={{
              flex: 1,
              ...(collapsible &&
                !expanded && {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }),
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Collapsible or always-visible content */}
        <Collapse in={isExpanded} timeout="auto">
          <Stack spacing={2} sx={{ pt: 2 }}>
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
        </Collapse>
      </Box>

      {/* Bottom section with editors and submitted date */}
      <Collapse in={isExpanded} timeout="auto">
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
      </Collapse>

      {/* Additional Information with accordions */}
      <Collapse in={isExpanded} timeout="auto">
        <Box
          sx={[
            {
              bgcolor: "rgba(0, 0, 0, 0.05)",
              px: 2,
              pb: 2,
            },
            (theme) =>
              theme.applyStyles("dark", {
                bgcolor: "rgba(255, 255, 255, 0.05)",
              }),
          ]}
        >
          <Accordion disableGutters elevation={0}>
            <AccordionSummary
              expandIcon={null}
              sx={{
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.secondary",
                  transition: "transform 0.2s",
                  ".Mui-expanded &": {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <ChevronRightIcon />
              </Box>
              <Typography variant="h6" color="text.secondary">
                Abstract
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">{abstract}</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion disableGutters elevation={0}>
            <AccordionSummary
              expandIcon={null}
              sx={{
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.secondary",
                  transition: "transform 0.2s",
                  ".Mui-expanded &": {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <ChevronRightIcon />
              </Box>
              <Typography variant="h6" color="text.secondary">
                Author Declaration
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                Author declarations will appear here.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion disableGutters elevation={0}>
            <AccordionSummary
              expandIcon={null}
              sx={{
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.secondary",
                  transition: "transform 0.2s",
                  ".Mui-expanded &": {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <ChevronRightIcon />
              </Box>
              <Typography variant="h6" color="text.secondary">
                Files
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                Manuscript files will appear here.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Collapse>
    </Paper>
  );
}
