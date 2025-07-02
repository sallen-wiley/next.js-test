"use client";
import ArticleCard from "@/components/product/ArticleCardFigma";
import { Container, Typography, Paper, Link, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function Home() {
  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Publishing Platforms test ground
            </Typography>
          </Grid>
          <Grid size={12}>
            <Stack direction="column" spacing={4}>
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
