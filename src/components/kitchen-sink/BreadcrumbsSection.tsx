"use client";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Breadcrumbs,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export const BreadcrumbsSection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Breadcrumbs
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based breadcrumb patterns for location hierarchy, collapsed
          trails, and custom separators.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-breadcrumbs/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Breadcrumbs docs
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
              Basic + Current Page
            </Typography>

            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link underline="hover" color="inherit" href="#navigation">
                Home
              </Link>
              <Link underline="hover" color="inherit" href="#navigation">
                Library
              </Link>
              <Typography color="text.primary">Data</Typography>
            </Breadcrumbs>

            <Breadcrumbs aria-label="breadcrumb" maxItems={2}>
              <Link underline="hover" color="inherit" href="#navigation">
                Home
              </Link>
              <Link underline="hover" color="inherit" href="#navigation">
                Catalog
              </Link>
              <Link underline="hover" color="inherit" href="#navigation">
                Collections
              </Link>
              <Typography color="text.primary">Deep Page</Typography>
            </Breadcrumbs>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Custom Separator
            </Typography>

            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link underline="hover" color="inherit" href="#navigation">
                Workspace
              </Link>
              <Link underline="hover" color="inherit" href="#navigation">
                Reviewer Dashboard
              </Link>
              <Typography color="text.primary">Manage Reviewers</Typography>
            </Breadcrumbs>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

BreadcrumbsSection.displayName = "BreadcrumbsSection";
