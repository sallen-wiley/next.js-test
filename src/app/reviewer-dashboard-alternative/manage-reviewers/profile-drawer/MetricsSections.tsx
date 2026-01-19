"use client";

import * as React from "react";
import { Box, Typography, Grid, Paper, Stack } from "@mui/material";
import type { ReviewerProfile } from "./types";

interface MetricsSectionProps {
  reviewer: ReviewerProfile;
}

export function PublicationMetrics({ reviewer }: MetricsSectionProps) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Publication metrics
      </Typography>
      <Grid container spacing={1.5}>
        {reviewer.h_index && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 1.5 }}>
              <Typography variant="subtitle1">{reviewer.h_index}</Typography>
              <Typography variant="body2" color="text.secondary">
                h-index
              </Typography>
            </Paper>
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="subtitle1">
              {reviewer.solo_authored_count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Solo-authored
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="subtitle1">
              {reviewer.publications_last_5_years}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last 5 years
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export function CurrentWorkload({ reviewer }: MetricsSectionProps) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Current workload
      </Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="subtitle1">
              {reviewer.current_review_load || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Currently reviewing
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 1.5 }}>
            <Stack direction="row" spacing={0.5} alignItems="baseline">
              <Typography variant="subtitle1">
                {reviewer.total_invitations || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (last 6 months)
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Invitation received
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="subtitle1">
              {reviewer.days_since_last_review
                ? `${reviewer.days_since_last_review} days ago`
                : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last invitation response
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="subtitle1">
              {reviewer.average_review_time_days || "N/A"} days
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average speed
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export function ReviewerPerformance({ reviewer }: MetricsSectionProps) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Reviewer performance
      </Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="subtitle1">
              {reviewer.average_response_time_hours
                ? `${Math.round(
                    reviewer.average_response_time_hours / 24
                  )} days`
                : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average response time
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="subtitle1">
              {reviewer.acceptance_rate}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acceptance rate
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="subtitle1">
              {reviewer.completed_reviews || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reports submitted
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="subtitle1">
              {reviewer.days_since_last_review
                ? `${reviewer.days_since_last_review} ago`
                : "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last report submitted
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
