import * as React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

interface MetricsWidgetProps {
  highMatchCount: number;
  acceptedCount: number;
  pendingCount: number;
  queuedCount: number;
}

export function MetricsWidget({
  highMatchCount,
  acceptedCount,
  pendingCount,
  queuedCount,
}: MetricsWidgetProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="primary">
              {highMatchCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High Match Reviewers (90%+)
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="success.main">
              {acceptedCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accepted Invitations
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="warning.main">
              {pendingCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Responses
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="info.main">
              {queuedCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Queued Invitations
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
