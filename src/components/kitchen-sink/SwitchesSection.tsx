"use client";
import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

const switchLabel = { inputProps: { "aria-label": "Switch demo" } };

export const SwitchesSection = React.memo(() => {
  const [controlledChecked, setControlledChecked] = React.useState(true);
  const [channelState, setChannelState] = React.useState({
    email: true,
    sms: false,
    dashboard: true,
  });

  const handleControlledChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setControlledChecked(event.target.checked);
    },
    [],
  );

  const handleChannelChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      setChannelState((prev) => ({
        ...prev,
        [name]: checked,
      }));
    },
    [],
  );

  const enabledChannels = Object.values(channelState).filter(Boolean).length;

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Switches
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based switch patterns for binary settings, including controlled
          state and grouped preferences.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-switch/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Switch docs
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
                  Basic Switches
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Switch {...switchLabel} defaultChecked />
                  <Switch {...switchLabel} />
                  <Switch {...switchLabel} disabled defaultChecked />
                  <Switch {...switchLabel} disabled />
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Label + Required
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Checked by default"
                  />
                  <FormControlLabel
                    required
                    control={<Switch />}
                    label="Required"
                  />
                  <FormControlLabel
                    disabled
                    control={<Switch />}
                    label="Disabled"
                  />
                </FormGroup>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Controlled Switch
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={controlledChecked}
                      onChange={handleControlledChange}
                      inputProps={{ "aria-label": "controlled switch" }}
                    />
                  }
                  label={
                    controlledChecked
                      ? "Notifications enabled"
                      : "Notifications disabled"
                  }
                />
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
                Size + Color
              </Typography>

              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ minWidth: 48, typography: "mono" as const }}
                  >
                    Size
                  </Typography>
                  <Switch
                    inputProps={{ "aria-label": "small switch" }}
                    defaultChecked
                    size="small"
                  />
                  <Switch
                    inputProps={{ "aria-label": "medium switch" }}
                    defaultChecked
                  />
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                  sx={{ gap: 1 }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ minWidth: 48, typography: "mono" as const }}
                  >
                    Color
                  </Typography>
                  <Switch defaultChecked color="primary" />
                  <Switch defaultChecked color="secondary" />
                  <Switch defaultChecked color="warning" />
                  <Switch defaultChecked color="default" />
                </Stack>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                FormGroup + Placement
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Group related toggles with a label and helper text.
              </Typography>

              <FormControl>
                <FormLabel component="legend">Notification channels</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={channelState.email}
                        onChange={handleChannelChange}
                        name="email"
                      />
                    }
                    label="Email"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={channelState.sms}
                        onChange={handleChannelChange}
                        name="sms"
                      />
                    }
                    label="SMS"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={channelState.dashboard}
                        onChange={handleChannelChange}
                        name="dashboard"
                      />
                    }
                    label="Dashboard"
                  />
                </FormGroup>
                <FormHelperText>
                  {enabledChannels} channel{enabledChannels === 1 ? "" : "s"}{" "}
                  enabled
                </FormHelperText>
              </FormControl>

              <Box sx={{ mt: 2.5 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Label placement</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      value="end"
                      control={<Switch color="primary" />}
                      label="End"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="bottom"
                      control={<Switch color="primary" />}
                      label="Bottom"
                      labelPlacement="bottom"
                    />
                  </FormGroup>
                </FormControl>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

SwitchesSection.displayName = "SwitchesSection";
