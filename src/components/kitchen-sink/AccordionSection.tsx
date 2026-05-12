"use client";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export const AccordionSection = React.memo(() => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleExpandedChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Accordion
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based accordion patterns for grouped disclosures, controlled
          expansion, and optional action rows.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-accordion/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Accordion docs
          </Link>
          .
        </Typography>
      </Stack>

      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Basic Pattern
            </Typography>

            <Stack spacing={1}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Section One</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    Content for the first accordion section.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Section Two</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    Content for the second accordion section.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion disabled>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Disabled Section</Typography>
                </AccordionSummary>
              </Accordion>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Controlled + Actions
            </Typography>

            <Accordion
              expanded={expanded === "panel-1"}
              onChange={handleExpandedChange("panel-1")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Release Checklist</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Confirm QA status, content review, and deployment timing.
                </Typography>
              </AccordionDetails>
              <AccordionActions>
                <Button size="small">Cancel</Button>
                <Button size="small" variant="contained">
                  Save
                </Button>
              </AccordionActions>
            </Accordion>

            <Accordion
              expanded={expanded === "panel-2"}
              onChange={handleExpandedChange("panel-2")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Team Notes</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Capture decisions and follow-up items for the next sprint.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

AccordionSection.displayName = "AccordionSection";
