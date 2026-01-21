"use client";
import React from "react";
import { Paper, Typography, Stack, Grid } from "@mui/material";

export const TypographySection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Typography Stack
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="h4">Heading 4</Typography>
              <Typography variant="h5">Heading 5</Typography>
              <Typography variant="h6">Heading 6</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">Subtitle 1</Typography>
              <Typography variant="subtitle2">Subtitle 2</Typography>
              <Typography variant="body1">
                Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
              <Typography variant="body2">
                Body 2: Smaller body text for secondary information.
              </Typography>
              <Typography variant="button">Button Text</Typography>
              <Typography variant="caption">Caption text</Typography>
              <Typography variant="overline">Overline text</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
});

TypographySection.displayName = "TypographySection";
