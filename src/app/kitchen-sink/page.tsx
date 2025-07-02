"use client";
import { Container, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function Home() {
  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ my: 4 }}>
          <Grid size={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Kitchen sink
            </Typography>
          </Grid>
          <Grid size={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="body1">
                This is a placeholder page for the kitchen sink demo. It
                showcases various components and layouts that can be used in a
                typical application.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
