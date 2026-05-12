"use client";
import React from "react";
import {
  Alert,
  Button,
  Grid,
  Link,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

export const SnackbarSection = React.memo(() => {
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const handleCloseSuccess = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseError = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Snackbar
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based alert snackbar patterns for transient feedback with
          explicit success and error treatment.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-snackbar/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Snackbar docs
          </Link>
          .
        </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ typography: "mono" as const }}
        >
          Core Patterns
        </Typography>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpenSuccess(true)}
          >
            Open Success Alert Snackbar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenError(true)}
          >
            Open Error Alert Snackbar
          </Button>
        </Stack>

        <Snackbar
          open={openSuccess}
          autoHideDuration={5000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSuccess}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Invitation sent successfully.
          </Alert>
        </Snackbar>

        <Snackbar
          open={openError}
          autoHideDuration={5000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Invitation failed. Please retry.
          </Alert>
        </Snackbar>
      </Paper>
    </Grid>
  );
});

SnackbarSection.displayName = "SnackbarSection";
