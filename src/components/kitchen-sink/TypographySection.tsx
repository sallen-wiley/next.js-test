"use client";
import React from "react";
import { Paper, Typography, Stack, Grid, Link } from "@mui/material";

export const TypographySection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Typography Stack
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Typography styles are built and managed by each platform. The examples
          here are baseline defaults that can be used as a starting point.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Applications vary in data density and use cases, so some may need
          fewer heading levels, some may need more, and heading sizes may be
          larger or smaller depending on context.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-typography/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Typography docs
          </Link>
          .
        </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ typography: "mono" as const }}
              >
                Headings (h1-h6)
              </Typography>
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="h4">Heading 4</Typography>
              <Typography variant="h5">Heading 5</Typography>
              <Typography variant="h6">Heading 6</Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ typography: "mono" as const, mt: 2 }}
              >
                Supporting Variants
              </Typography>
              <Typography variant="caption">Caption text</Typography>
              <Typography variant="overline">Overline text</Typography>
              <Typography variant="button">Button Text</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ typography: "mono" as const }}
              >
                Body & Subtitle
              </Typography>
              <Typography variant="subtitle1">Subtitle 1</Typography>
              <Typography variant="subtitle2">Subtitle 2</Typography>
              <Typography variant="body1">
                Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
              <Typography variant="body1">
                Body with link: Review the{" "}
                <Link href="#" underline="hover">
                  typography guidelines
                </Link>{" "}
                for usage recommendations.
              </Typography>
              <Typography variant="body2">
                Body 2: Smaller body text for secondary information.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
});

TypographySection.displayName = "TypographySection";
