'use client';

import { Container, Typography, Box, Button, Stack, Paper } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="sm">
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
        </Paper>
      </Box>
    </Container>
  );
}