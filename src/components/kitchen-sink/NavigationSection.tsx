"use client";
import React from "react";
import {
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Pagination,
  Stepper,
  Step,
  StepLabel,
  BottomNavigation,
  BottomNavigationAction,
  Stack,
  Box,
  Grid,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

export const NavigationSection = React.memo(() => {
  const [tabValue, setTabValue] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);
  const [bottomNavValue, setBottomNavValue] = React.useState(0);
  const paginationSizes = ["large", "medium", "small"] as const;

  const steps = [
    "Select campaign settings",
    "Create an ad group",
    "Create an ad",
  ];

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Navigation
      </Typography>
      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Tabs
            </Typography>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
            >
              <Tab label="Overview" />
              <Tab label="Details" />
              <Tab label="Settings" />
            </Tabs>
            <Box sx={{ p: 2 }}>
              {tabValue === 0 && <Typography>Overview content</Typography>}
              {tabValue === 1 && <Typography>Details content</Typography>}
              {tabValue === 2 && <Typography>Settings content</Typography>}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Stepper
            </Typography>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => prev - 1)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={() => setActiveStep((prev) => prev + 1)}
                disabled={activeStep === steps.length - 1}
              >
                Next
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Bottom Navigation
            </Typography>
            <BottomNavigation
              value={bottomNavValue}
              onChange={(_, newValue) => setBottomNavValue(newValue)}
              showLabels
            >
              <BottomNavigationAction label="Home" icon={<HomeIcon />} />
              <BottomNavigationAction
                label="Favorites"
                icon={<FavoriteIcon />}
              />
              <BottomNavigationAction
                label="Archive"
                icon={<LibraryBooksIcon />}
              />
            </BottomNavigation>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Pagination
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Outlined rounded pagination in large, medium, and small sizes with
              2 siblings and 2 boundaries.
            </Typography>

            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="body2">Outlined + Rounded</Typography>
              {paginationSizes.map((size) => (
                <Pagination
                  key={`outlined-rounded-${size}`}
                  count={20}
                  defaultPage={10}
                  size={size}
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                  siblingCount={2}
                  boundaryCount={2}
                />
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

NavigationSection.displayName = "NavigationSection";
