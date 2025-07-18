"use client";
import AppHeader from "@/components/app/AppHeader";
import ArticleCard from "@/components/product/ArticleCardFigma";
import { Container, Typography, Paper, Link, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function Home() {
  return (
    <>
      <AppHeader />
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ my: 4 }}>
          <Grid size={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Publishing Platforms test ground
            </Typography>
          </Grid>
          <Grid size={12}>
            <Stack direction="column" spacing={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="body1">
                  <Link href="/woaa">WOAA</Link>
                </Typography>
              </Paper>
              <ArticleCard />
              <ArticleCard />
              <ArticleCard />
              <ArticleCard />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
