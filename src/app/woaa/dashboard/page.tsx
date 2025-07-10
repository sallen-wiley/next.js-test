"use client";
import ArticleCard from "@/components/product/ArticleCardFigma";
import { Container, Typography, Paper, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function Home() {
  return (
    <>
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid size={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Wiley Open Access Accounts Dashboard
            </Typography>
          </Grid>
          <Grid size={12}>
            <Stack direction="column" spacing={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="body1">
                  This is a placeholder page for the WOAA Dashboard.
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
