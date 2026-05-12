"use client";
import React from "react";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { DrawerProps } from "@mui/material";

const drawerItems = ["Inbox", "Starred", "Send email", "Drafts"];

export const DrawerSection = React.memo(() => {
  const [anchor, setAnchor] = React.useState<DrawerProps["anchor"]>("left");
  const [open, setOpen] = React.useState(false);

  const toggleDrawer =
    (nextOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(nextOpen);
    };

  const drawerContent = (
    <Box sx={{ width: 280 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {drawerItems.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Drawer
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based drawer pattern for temporary side navigation and contextual
          panel content.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-drawer/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Drawer docs
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
          Temporary Drawer
        </Typography>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {(["left", "right", "top", "bottom"] as const).map((nextAnchor) => (
            <Button
              key={nextAnchor}
              variant="outlined"
              onClick={() => {
                setAnchor(nextAnchor);
                setOpen(true);
              }}
            >
              Open {nextAnchor}
            </Button>
          ))}
        </Stack>

        <Drawer anchor={anchor} open={open} onClose={toggleDrawer(false)}>
          {drawerContent}
        </Drawer>
      </Paper>
    </Grid>
  );
});

DrawerSection.displayName = "DrawerSection";
