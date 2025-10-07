"use client";

import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';

export default function OnboardingDemosPage() {
  const router = useRouter();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Onboarding Workflow Demos
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose a demo to see different onboarding patterns in action
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Modal Slides Onboarding
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A modal-based onboarding experience with multiple slides. Users can navigate
                through steps using Next/Back buttons or close the modal at any time.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/onboarding-demos/modal-slides')}
              >
                Try Modal Demo
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <QuizIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Tooltip Guided Tour
              </Typography>
              <Typography variant="body2" color="text.secondary">
                An interactive guided tour using tooltips and popovers to highlight specific
                elements on the page. Users click through each step to learn about features.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={() => router.push('/onboarding-demos/tooltip-tour')}
              >
                Try Tooltip Demo
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}