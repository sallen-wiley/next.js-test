"use client";
import React from "react";
import {
  Box,
  CircularProgress,
  type CircularProgressProps,
  Grid,
  LinearProgress,
  type LinearProgressProps,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          inset: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number },
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export const ProgressSection = React.memo(() => {
  const [circularValue, setCircularValue] = React.useState(10);
  const [linearValue, setLinearValue] = React.useState(0);
  const [bufferValue, setBufferValue] = React.useState(10);
  const [bufferProgress, setBufferProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCircularValue((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setLinearValue((prev) => {
        if (prev >= 100) {
          return 0;
        }

        return Math.min(prev + 7, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setBufferProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setBufferValue(10);
          return 0;
        }

        const nextProgress = prevProgress + 1;

        if (nextProgress % 5 === 0) {
          setBufferValue((prevBuffer) =>
            Math.min(100, prevBuffer + 1 + Math.random() * 10),
          );
        }

        return nextProgress;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Progress
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based circular and linear progress patterns for indeterminate,
          determinate, color, size, and buffered loading states.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-progress/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Progress docs
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
              Circular Progress
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Indeterminate + Color
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ color: "grey.500" }}
                >
                  <CircularProgress />
                  <CircularProgress color="secondary" />
                  <CircularProgress color="success" />
                  <CircularProgress color="inherit" />
                </Stack>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Size + Determinate
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <CircularProgress size="30px" />
                  <CircularProgress size={40} />
                  <CircularProgress size="3rem" />
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  useFlexGap
                  flexWrap="wrap"
                >
                  <CircularProgress variant="determinate" value={25} />
                  <CircularProgress variant="determinate" value={50} />
                  <CircularProgress variant="determinate" value={75} />
                  <CircularProgress variant="determinate" value={100} />
                  <CircularProgress
                    variant="determinate"
                    value={circularValue}
                  />
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
                Linear Progress
              </Typography>

              <Stack spacing={2} sx={{ width: "100%" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Indeterminate
                  </Typography>
                  <LinearProgress />
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Color
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 0.5 }}>
                    <LinearProgress color="secondary" />
                    <LinearProgress color="success" />
                    <LinearProgress color="inherit" />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Determinate
                  </Typography>
                  <LinearProgress variant="determinate" value={linearValue} />
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Buffer
                  </Typography>
                  <LinearProgress
                    variant="buffer"
                    value={bufferProgress}
                    valueBuffer={bufferValue}
                  />
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ typography: "mono" as const }}
              >
                Value Labels
              </Typography>

              <Stack spacing={2}>
                <CircularProgressWithLabel value={circularValue} />
                <LinearProgressWithLabel value={linearValue} />
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
});

ProgressSection.displayName = "ProgressSection";
