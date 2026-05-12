"use client";
import React from "react";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  Box,
  Grid,
  Link,
  Paper,
  Slider,
  Stack,
  Typography,
} from "@mui/material";

const temperatureMarks = [
  { value: 0, label: "0°C" },
  { value: 20, label: "20°C" },
  { value: 37, label: "37°C" },
  { value: 100, label: "100°C" },
];

const formatTemperature = (value: number) => `${value}°C`;

export const SlidersSection = React.memo(() => {
  const [continuousValue, setContinuousValue] = React.useState<number>(30);
  const [rangeValue, setRangeValue] = React.useState<number[]>([20, 37]);

  const handleContinuousChange = React.useCallback(
    (_event: Event, newValue: number | number[]) => {
      setContinuousValue(newValue as number);
    },
    [],
  );

  const handleRangeChange = React.useCallback(
    (_event: Event, newValue: number | number[]) => {
      setRangeValue(newValue as number[]);
    },
    [],
  );

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Sliders
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based slider patterns for continuous values, marked steps,
          ranges, and orientation variants.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-slider/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Slider docs
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
                  Continuous Slider
                </Typography>
                <Stack spacing={1.25}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VolumeDownIcon fontSize="small" />
                    <Slider
                      aria-label="Volume"
                      value={continuousValue}
                      onChange={handleContinuousChange}
                    />
                    <VolumeUpIcon fontSize="small" />
                  </Stack>
                  <Slider
                    disabled
                    defaultValue={30}
                    aria-label="Disabled slider"
                  />
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Discrete Marks
                </Typography>
                <Slider
                  aria-label="Temperature"
                  defaultValue={30}
                  getAriaValueText={formatTemperature}
                  valueLabelDisplay="auto"
                  shiftStep={30}
                  step={10}
                  marks
                  min={10}
                  max={110}
                />
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Range Slider
                </Typography>
                <Slider
                  getAriaLabel={() => "Temperature range"}
                  value={rangeValue}
                  onChange={handleRangeChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={formatTemperature}
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
                Size + Color + Orientation
              </Typography>

              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ typography: "mono" as const }}
                  >
                    Size
                  </Typography>
                  <Slider
                    size="small"
                    defaultValue={70}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                  />
                  <Slider
                    defaultValue={50}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ typography: "mono" as const }}
                  >
                    Color
                  </Typography>
                  <Slider
                    aria-label="Secondary"
                    defaultValue={30}
                    color="secondary"
                  />
                  <Slider
                    aria-label="Success"
                    defaultValue={65}
                    color="success"
                  />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ typography: "mono" as const }}
                  >
                    Vertical
                  </Typography>
                  <Stack
                    sx={{ height: 170, mt: 1 }}
                    spacing={2}
                    direction="row"
                  >
                    <Slider
                      aria-label="Vertical slider"
                      orientation="vertical"
                      defaultValue={30}
                      valueLabelDisplay="auto"
                      getAriaValueText={formatTemperature}
                    />
                    <Slider
                      aria-label="Vertical disabled slider"
                      orientation="vertical"
                      defaultValue={30}
                      valueLabelDisplay="auto"
                      disabled
                    />
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Track Modes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Demonstrates removed and inverted tracks using marked values.
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Typography
                    id="slider-track-false"
                    variant="subtitle2"
                    gutterBottom
                    sx={{ typography: "mono" as const }}
                  >
                    Removed track
                  </Typography>
                  <Slider
                    track={false}
                    aria-labelledby="slider-track-false"
                    getAriaValueText={formatTemperature}
                    defaultValue={30}
                    marks={temperatureMarks}
                  />
                </Box>

                <Box>
                  <Typography
                    id="slider-track-inverted"
                    variant="subtitle2"
                    gutterBottom
                    sx={{ typography: "mono" as const }}
                  >
                    Inverted track range
                  </Typography>
                  <Slider
                    track="inverted"
                    aria-labelledby="slider-track-inverted"
                    getAriaValueText={formatTemperature}
                    defaultValue={[20, 37]}
                    marks={temperatureMarks}
                  />
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

SlidersSection.displayName = "SlidersSection";
