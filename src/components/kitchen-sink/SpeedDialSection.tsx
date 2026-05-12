"use client";
import React from "react";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import {
  Box,
  Grid,
  Link,
  Paper,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Typography,
} from "@mui/material";

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

export const SpeedDialSection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Speed Dial
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based speed dial pattern for exposing related high-priority
          actions from a single floating trigger.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-speed-dial/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Speed Dial docs
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
          Floating Action Cluster
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Demo is contained in a bounded area so page scrolling remains stable.
        </Typography>

        <Box
          sx={{
            position: "relative",
            height: 260,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <SpeedDial
            ariaLabel="quick actions"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </SpeedDial>
        </Box>
      </Paper>
    </Grid>
  );
});

SpeedDialSection.displayName = "SpeedDialSection";
