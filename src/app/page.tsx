"use client";

import {
  Container,
  Typography,
  Alert,
  Box,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import NotificationCenter from "../components/product/NotificationCenter";

export default function Home() {
  return (
    <>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Material UI - Next.js Example
          </Typography>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="body1" paragraph>
              This is a simple example of using Material UI with Next.js.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary">
                Primary Button
              </Button>
              <Button variant="outlined" color="secondary">
                Secondary Button
              </Button>
            </Stack>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="success">This is a success Alert.</Alert>
              <Alert severity="info">This is an info Alert.</Alert>
              <Alert severity="warning">This is a warning Alert.</Alert>
              <Alert severity="error">This is an error Alert.</Alert>
            </Stack>
          </Paper>
        </Box>
      </Container>
      <NotificationCenter />
    </>
  );
}
