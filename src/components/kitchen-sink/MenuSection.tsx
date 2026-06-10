"use client";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  Grid,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const profileActions = ["Profile", "My account", "Logout"];
const activeProfileAction = "My account";

export const MenuSection = React.memo(() => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [iconAnchorEl, setIconAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );

  const menuOpen = Boolean(anchorEl);
  const iconMenuOpen = Boolean(iconAnchorEl);

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Menu
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based menu patterns for anchored actions and icon-triggered
          overflow controls.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-menu/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Menu docs
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
              Basic Anchored Menu
            </Typography>

            <Button
              variant="outlined"
              onClick={(event) => setAnchorEl(event.currentTarget)}
              aria-controls={menuOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
            >
              Open Menu
            </Button>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
            >
              {profileActions.map((action) => (
                <MenuItem
                  key={action}
                  selected={action === activeProfileAction}
                  onClick={() => setAnchorEl(null)}
                >
                  {action}
                </MenuItem>
              ))}
            </Menu>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Icon Trigger
            </Typography>

            <IconButton
              aria-label="more actions"
              aria-controls={iconMenuOpen ? "icon-menu" : undefined}
              aria-haspopup="true"
              onClick={(event) => setIconAnchorEl(event.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              id="icon-menu"
              anchorEl={iconAnchorEl}
              open={iconMenuOpen}
              onClose={() => setIconAnchorEl(null)}
            >
              <MenuItem onClick={() => setIconAnchorEl(null)}>
                <ListItemText>Duplicate</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setIconAnchorEl(null)}>
                <ListItemText>Archive</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setIconAnchorEl(null)}>
                <ListItemIcon>
                  <MoreVertIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>More options</ListItemText>
              </MenuItem>
            </Menu>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

MenuSection.displayName = "MenuSection";
