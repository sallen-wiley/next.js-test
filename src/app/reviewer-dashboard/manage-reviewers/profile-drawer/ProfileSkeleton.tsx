"use client";

import * as React from "react";
import { Stack, Box, Skeleton, Paper, Grid, Divider } from "@mui/material";

export function ProfileSkeleton() {
  return (
    <Stack spacing={2}>
      {/* Profile Header Skeleton */}
      <Box>
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Skeleton variant="text" width="60%" height={32} />
          </Stack>
          <Skeleton variant="text" width="80%" height={24} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="circular" width={20} height={20} />
          </Stack>
        </Stack>
      </Box>

      <Divider />

      {/* Strong/Weak Points Skeleton */}
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} />
          </Paper>
        </Grid>
      </Grid>

      {/* Publications Skeleton */}
      <Box>
        <Skeleton variant="text" width="50%" height={24} sx={{ mb: 1 }} />
        <Stack spacing={1}>
          {[1, 2, 3, 4].map((i) => (
            <Paper key={i} variant="outlined" sx={{ p: 2 }}>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton
                variant="text"
                width="60%"
                height={16}
                sx={{ mt: 0.5 }}
              />
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* Publication Metrics Skeleton */}
      <Box>
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
        <Grid container spacing={1.5}>
          {[1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 4 }}>
              <Paper sx={{ p: 1.5 }}>
                <Skeleton variant="text" width="40%" height={28} />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={16}
                  sx={{ mt: 0.5 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Current Workload Skeleton */}
      <Box>
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
        <Grid container spacing={1.5}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 1.5 }}>
                <Skeleton variant="text" width="50%" height={28} />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={16}
                  sx={{ mt: 0.5 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Reviewer Performance Skeleton */}
      <Box>
        <Skeleton variant="text" width="50%" height={24} sx={{ mb: 1 }} />
        <Grid container spacing={1.5}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 6, sm: 3 }}>
              <Paper sx={{ p: 1.5 }}>
                <Skeleton variant="text" width="50%" height={28} />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={16}
                  sx={{ mt: 0.5 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
