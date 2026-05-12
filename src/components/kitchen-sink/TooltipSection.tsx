"use client";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Button,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

const placements = ["top", "right", "bottom", "left"] as const;

export const TooltipSection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Tooltip
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based tooltip patterns for contextual help, placement control,
          and arrow treatment.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-tooltip/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Tooltip docs
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
              Placement Variants
            </Typography>

            <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
              {placements.map((placement) => (
                <Tooltip
                  key={placement}
                  title={`Tooltip on ${placement}`}
                  placement={placement}
                >
                  <Button variant="outlined" size="small">
                    {placement}
                  </Button>
                </Tooltip>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Arrow + Rich Message
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">Need more information?</Typography>
              <Tooltip
                arrow
                title="This action updates all selected records and cannot be undone."
              >
                <IconButton size="small" aria-label="help">
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

TooltipSection.displayName = "TooltipSection";
