import * as React from "react";
import { Box, Typography, IconButton, Tooltip, Paper } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface MetricsWidgetProps {
  submittedCount: number;
  overdueCount: number;
  invalidatedCount: number;
  expiredCount: number;
  revokedCount: number;
  acceptedCount: number;
  declinedCount: number;
  pendingCount: number;
  queuedCount: number;
}

export function MetricsWidget({
  submittedCount,
  overdueCount,
  invalidatedCount,
  expiredCount,
  revokedCount,
  acceptedCount,
  declinedCount,
  pendingCount,
  queuedCount,
}: MetricsWidgetProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Reports Section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Reports
          </Typography>
          <Tooltip title="Number of reviewer reports for this manuscript">
            <IconButton size="small" sx={{ p: 0.5 }}>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {submittedCount}
          </Typography>
          <Typography variant="body1">Submitted,</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {overdueCount}
          </Typography>
          <Typography variant="body1">Overdue,</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "83px",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {invalidatedCount}
            </Typography>
            <Typography variant="body1">Invalidated</Typography>
          </Box>
        </Box>
      </Box>

      {/* Invitations Section */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, py: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Invitations
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {expiredCount}
            </Typography>
            <Typography variant="body1">Expired,</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {revokedCount}
            </Typography>
            <Typography variant="body1">Revoked</Typography>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              bgcolor: "background.default",
              flex: 1,
              px: 1.5,
              py: 1.25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="overline">Accepted</Typography>
            <Typography variant="h5">{acceptedCount}</Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "background.default",
              flex: 1,
              px: 1.5,
              py: 1.25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="overline">Declined</Typography>
            <Typography variant="h5">{declinedCount}</Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "background.default",
              flex: 1,
              px: 1.5,
              py: 1.25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="overline">Pending</Typography>
            <Typography variant="h5">{pendingCount}</Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "background.default",
              flex: 1,
              px: 1.5,
              py: 1.25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="overline">Queued</Typography>
            <Typography variant="h5">{queuedCount}</Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
