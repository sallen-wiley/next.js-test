"use client";
import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Avatar,
  Badge,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export const BadgesSection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Badges
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based badge patterns for unread counts, dot indicators, and
          overlap behavior with icons and avatars.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-badge/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Badge docs
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
              Count + Dot Patterns
            </Typography>

            <Stack direction="row" spacing={3} alignItems="center" useFlexGap>
              <Badge badgeContent={4} color="primary">
                <MailIcon />
              </Badge>

              <Badge badgeContent={120} max={99} color="secondary">
                <NotificationsIcon />
              </Badge>

              <Badge color="error" variant="dot">
                <ShoppingCartIcon />
              </Badge>
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
              Avatar + IconButton
            </Typography>

            <Stack direction="row" spacing={3} alignItems="center" useFlexGap>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                color="success"
              >
                <Avatar alt="Reviewer" sx={{ width: 48, height: 48 }}>
                  RV
                </Avatar>
              </Badge>

              <Badge badgeContent={7} color="error">
                <IconButton color="primary" aria-label="notifications">
                  <NotificationsIcon />
                </IconButton>
              </Badge>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

BadgesSection.displayName = "BadgesSection";
