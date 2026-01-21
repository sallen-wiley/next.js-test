"use client";
import React from "react";
import {
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
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

  const steps = [
    "Select campaign settings",
    "Create an ad group",
    "Create an ad",
  ];

  return (
    <Grid size={12}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Navigation
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
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
            <Typography variant="h6" gutterBottom>
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
            <Typography variant="h6" gutterBottom>
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
      </Grid>
    </Grid>
  );
});

NavigationSection.displayName = "NavigationSection";
