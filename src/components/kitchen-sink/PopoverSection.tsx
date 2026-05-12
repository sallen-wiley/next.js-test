"use client";
import React from "react";
import {
  Box,
  Button,
  Grid,
  Link,
  Paper,
  Popover,
  Stack,
  Typography,
} from "@mui/material";

export const PopoverSection = React.memo(() => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Popover
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based popover pattern for anchored supplementary context that is
          less disruptive than a dialog.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-popover/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Popover docs
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
          Anchored Popover
        </Typography>

        <Button
          variant="outlined"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          Open Popover
        </Button>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box sx={{ p: 2, maxWidth: 280 }}>
            <Typography
              variant="subtitle2"
              sx={{ typography: "mono" as const }}
            >
              Reviewer Insight
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This reviewer is available and has completed 12 similar reviews in
              the last 6 months.
            </Typography>
          </Box>
        </Popover>
      </Paper>
    </Grid>
  );
});

PopoverSection.displayName = "PopoverSection";
