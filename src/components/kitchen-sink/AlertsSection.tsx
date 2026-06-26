"use client";
import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const ALERT_SEVERITIES = [
  { key: "success", label: "Success" },
  { key: "info", label: "Info" },
  { key: "warning", label: "Warning" },
  { key: "error", label: "Error" },
] as const;

const ALERT_VARIANTS = [
  { key: "standard", label: "Standard" },
  { key: "outlined", label: "Outlined" },
  { key: "filled", label: "Filled" },
] as const;

export const AlertsSection = React.memo(() => {
  const [openTransitionAlert, setOpenTransitionAlert] = React.useState(true);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Alerts
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based alert patterns for severity cues, visual variants, actions,
          and transition behavior.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-alert/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Alert docs
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
              Core Patterns
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Severity
                </Typography>
                <Stack sx={{ width: "100%" }} spacing={1.5}>
                  <Alert severity="success">This is a success Alert.</Alert>
                  <Alert severity="info">This is an info Alert.</Alert>
                  <Alert severity="warning">This is a warning Alert.</Alert>
                  <Alert severity="error">This is an error Alert.</Alert>
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Variants x Theme Colors
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  Each variant is shown with every theme alert color token.
                </Typography>
                <Stack sx={{ width: "100%" }} spacing={2}>
                  {ALERT_VARIANTS.map((variant) => (
                    <Box key={variant.key}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          typography: "mono" as const,
                          display: "block",
                          mb: 1,
                        }}
                      >
                        {variant.label}
                      </Typography>
                      <Stack spacing={1.25}>
                        {ALERT_SEVERITIES.map((severity) => (
                          <Alert
                            key={`${variant.key}-${severity.key}`}
                            variant={variant.key}
                            severity={severity.key}
                          >
                            {severity.label} {variant.label.toLowerCase()}{" "}
                            alert.
                          </Alert>
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Titles
                </Typography>
                <Stack sx={{ width: "100%" }} spacing={1.5}>
                  <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    This is a success Alert with an encouraging title.
                  </Alert>
                  <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    This is a warning Alert with a cautious title.
                  </Alert>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Actions + Icons
              </Typography>

              <Stack sx={{ width: "100%" }} spacing={1.5}>
                <Alert severity="warning" onClose={() => {}}>
                  This Alert displays the default close icon.
                </Alert>

                <Alert
                  severity="success"
                  action={
                    <Button color="inherit" size="small">
                      UNDO
                    </Button>
                  }
                >
                  This Alert uses a Button component for its action.
                </Alert>

                <Alert
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                >
                  This success Alert has a custom icon.
                </Alert>

                <Alert icon={false} severity="info">
                  This info Alert has no icon.
                </Alert>

                <Alert
                  iconMapping={{
                    success: <CheckCircleOutlineIcon fontSize="inherit" />,
                  }}
                >
                  This success Alert uses iconMapping to override the default
                  icon.
                </Alert>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Transition Pattern
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Collapse transition on dismiss and explicit re-open.
              </Typography>

              <Box sx={{ width: "100%" }}>
                <Collapse in={openTransitionAlert}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setOpenTransitionAlert(false)}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    Click the close icon to see the Collapse transition in
                    action.
                  </Alert>
                </Collapse>

                <Button
                  disabled={openTransitionAlert}
                  variant="outlined"
                  onClick={() => setOpenTransitionAlert(true)}
                >
                  Re-open
                </Button>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

AlertsSection.displayName = "AlertsSection";
