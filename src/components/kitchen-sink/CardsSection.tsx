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
              <Typography variant="h6" sx={{ typography: "mono" as const }}>
                Basic Card
              </Typography>
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
              image="https://picsum.photos/seed/mui-card/600/300"
            />
            <CardContent>
              <Typography variant="h6" sx={{ typography: "mono" as const }}>
                Media Card
              </Typography>
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
              <Typography variant="h6" sx={{ typography: "mono" as const }}>
                Outlined Card
              </Typography>
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
