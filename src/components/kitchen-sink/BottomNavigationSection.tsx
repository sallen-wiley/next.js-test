"use client";
import React from "react";
import ArchiveIcon from "@mui/icons-material/Archive";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FolderIcon from "@mui/icons-material/Folder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const fixedNavigationItems = [
  {
    primary: "Brunch this week?",
    secondary:
      "I will be in the neighborhood this week. Let us grab a bite to eat.",
  },
  {
    primary: "Birthday gift",
    secondary:
      "Need ideas for a thoughtful gift and would love your suggestions.",
  },
  {
    primary: "Recipe to try",
    secondary: "I found a new BBQ recipe and want to test it this weekend.",
  },
  {
    primary: "Summer plans",
    secondary:
      "Who is interested in a backyard cookout this Saturday afternoon?",
  },
];

export const BottomNavigationSection = React.memo(() => {
  const [showLabelsValue, setShowLabelsValue] = React.useState(0);
  const [iconOnlyValue, setIconOnlyValue] = React.useState("recents");
  const [fixedValue, setFixedValue] = React.useState(0);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Bottom Navigation
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based bottom navigation patterns for primary destinations with
          icon and label behavior based on action count.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-bottom-navigation/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Bottom Navigation docs
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
              Core Patterns
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Three Actions (showLabels)
                </Typography>
                <Box sx={{ maxWidth: 500 }}>
                  <BottomNavigation
                    showLabels
                    value={showLabelsValue}
                    onChange={(_event, newValue) =>
                      setShowLabelsValue(newValue)
                    }
                  >
                    <BottomNavigationAction
                      label="Recents"
                      icon={<RestoreIcon />}
                    />
                    <BottomNavigationAction
                      label="Favorites"
                      icon={<FavoriteIcon />}
                    />
                    <BottomNavigationAction
                      label="Nearby"
                      icon={<LocationOnIcon />}
                    />
                  </BottomNavigation>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ typography: "mono" as const }}
                >
                  Four Actions (inactive icons only)
                </Typography>
                <Box sx={{ maxWidth: 500 }}>
                  <BottomNavigation
                    value={iconOnlyValue}
                    onChange={(_event, newValue) => setIconOnlyValue(newValue)}
                  >
                    <BottomNavigationAction
                      label="Recents"
                      value="recents"
                      icon={<RestoreIcon />}
                    />
                    <BottomNavigationAction
                      label="Favorites"
                      value="favorites"
                      icon={<FavoriteIcon />}
                    />
                    <BottomNavigationAction
                      label="Nearby"
                      value="nearby"
                      icon={<LocationOnIcon />}
                    />
                    <BottomNavigationAction
                      label="Folder"
                      value="folder"
                      icon={<FolderIcon />}
                    />
                  </BottomNavigation>
                </Box>
              </Box>
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
              Fixed Positioning Pattern
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Contained demo of the docs fixed-bottom pattern.
            </Typography>

            <Box
              sx={{
                position: "relative",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                height: 260,
                overflow: "auto",
                pb: 7,
              }}
            >
              <List dense>
                {fixedNavigationItems.map((item) => (
                  <ListItem key={item.primary} disablePadding>
                    <ListItemText
                      sx={{ px: 2, py: 1 }}
                      primary={item.primary}
                      secondary={item.secondary}
                    />
                  </ListItem>
                ))}
              </List>

              <Paper
                elevation={3}
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <BottomNavigation
                  showLabels
                  value={fixedValue}
                  onChange={(_event, newValue) => setFixedValue(newValue)}
                >
                  <BottomNavigationAction
                    label="Recents"
                    icon={<RestoreIcon />}
                  />
                  <BottomNavigationAction
                    label="Favorites"
                    icon={<FavoriteIcon />}
                  />
                  <BottomNavigationAction
                    label="Archive"
                    icon={<ArchiveIcon />}
                  />
                </BottomNavigation>
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

BottomNavigationSection.displayName = "BottomNavigationSection";
