"use client";
import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";

export const CardsSection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Cards
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Docs-based card patterns for grouped content blocks, media previews,
          and action rows.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-card/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Card docs
          </Link>
          .
        </Typography>
      </Stack>

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Basic Card</Typography>
              <Typography variant="body2" color="text.secondary">
                Use cards to group related content and actions.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              alt="abstract gradient placeholder"
              image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%238b5cf6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='300' fill='url(%23grad)'/%3E%3C/svg%3E"
            />
            <CardContent>
              <Typography variant="h6">Media Card</Typography>
              <Typography variant="body2" color="text.secondary">
                Media can be paired with title, description, and actions.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Open</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Outlined Card</Typography>
              <Typography variant="body2" color="text.secondary">
                Outlined variant for lower-emphasis surfaces in dense layouts.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="outlined">
                Configure
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
});

CardsSection.displayName = "CardsSection";
