"use client";

import * as React from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

export function FeedbackWidget() {
  return (
    <Paper sx={{ p: 2, borderRadius: 1.5 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        How accurate is this reviewer suggestion?
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button color="neutral" variant="outlined" size="small">
          Not accurate at all
        </Button>
        <Button color="neutral" variant="outlined" size="small">
          Somewhat accurate
        </Button>
        <Button color="neutral" variant="outlined" size="small">
          Accurate
        </Button>
      </Stack>
    </Paper>
  );
}

interface ProfileFooterProps {
  onAddToQueue?: () => void;
  onInvite?: () => void;
  hasConflicts: boolean;
}

export function ProfileFooter({
  onAddToQueue,
  onInvite,
  hasConflicts,
}: ProfileFooterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        justifyContent: "flex-end",
        p: 3,
        borderTop: 1,
        borderColor: "divider",
        boxShadow: (theme) =>
          `0px -6px 16px color-mix(in srgb, ${theme.palette.neutral.main} 8%, transparent)`,
      }}
    >
      <Button
        variant="outlined"
        size="large"
        onClick={onAddToQueue}
        disabled={!onAddToQueue || hasConflicts}
      >
        Add to Queue
      </Button>
      <Button
        variant="contained"
        size="large"
        onClick={onInvite}
        disabled={!onInvite || hasConflicts}
      >
        Invite Reviewer
      </Button>
    </Box>
  );
}
