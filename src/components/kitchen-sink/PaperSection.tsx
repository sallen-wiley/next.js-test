"use client";
import React from "react";
import { Grid, Link, Paper, Stack, Typography } from "@mui/material";

export const PaperSection = React.memo(() => {
  const elevations = [0, 1, 3, 8, 16] as const;

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Paper
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based paper patterns for elevation depth and outlined surfaces.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-paper/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Paper docs
          </Link>
          .
        </Typography>
      </Stack>

      <Grid container spacing={2} alignItems="stretch">
        {elevations.map((elevation) => (
          <Grid key={elevation} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Paper sx={{ p: 2, height: "100%" }} elevation={elevation}>
              <Typography
                variant="subtitle2"
                sx={{ typography: "mono" as const }}
              >
                Elevation {elevation}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Surface depth demonstration.
              </Typography>
            </Paper>
          </Grid>
        ))}

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
            <Typography
              variant="subtitle2"
              sx={{ typography: "mono" as const }}
            >
              Outlined Variant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use this for lower-emphasis grouped content.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

PaperSection.displayName = "PaperSection";
