"use client";
import React from "react";
import {
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export const DividerSection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Divider
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based divider patterns for visual hierarchy in lists and between
          grouped content blocks.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-divider/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Divider docs
          </Link>
          .
        </Typography>
      </Stack>

      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper>
            <List aria-label="divided list example">
              <ListItem>
                <ListItemText primary="Inbox" secondary="14 unread" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="Drafts" secondary="3 pending edits" />
              </ListItem>
              <Divider component="li" variant="inset" />
              <ListItem>
                <ListItemText
                  primary="Archived"
                  secondary="This divider uses the inset variant"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ typography: "mono" as const }}
            >
              Vertical + Labeled
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ mb: 2 }}
            >
              <Typography variant="body2">Design</Typography>
              <Typography variant="body2">Build</Typography>
              <Typography variant="body2">Review</Typography>
            </Stack>

            <Divider textAlign="left">SECTION BREAK</Divider>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
});

DividerSection.displayName = "DividerSection";
