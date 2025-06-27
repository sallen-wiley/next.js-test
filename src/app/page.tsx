"use client";
import { Container, Typography, Paper, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import ArticleCard from "@/components/product/ArticleCardFigma";

export default function Home() {
  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ my: 4 }}>
          <Grid size={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Notification and help centre demo
            </Typography>
          </Grid>
          <Grid size={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="body1">
                Look for the notification icon in the top right corner of the
                screen.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={12}>
            <Stack direction="column" spacing={4}>
              <ArticleCard />
              <ArticleCard />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
