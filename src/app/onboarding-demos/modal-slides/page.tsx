"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Modal,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  Card,
  CardContent,
  LinearProgress,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  outline: 'none',
} as const;

const steps = [
  {
    label: 'Welcome',
    title: 'Welcome to Our Platform!',
    content: 'Thank you for joining us! This quick tour will help you get started and make the most of our features.',
    icon: <PlayArrowIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
  },
  {
    label: 'Dashboard',
    title: 'Your Dashboard',
    content: 'Your dashboard is your central hub. Here you can see an overview of all your activities, recent updates, and quick access to important features.',
    icon: <DashboardIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
  },
  {
    label: 'Navigation',
    title: 'Easy Navigation',
    content: 'Use the sidebar navigation to explore different sections. Everything is organized logically to help you find what you need quickly.',
    icon: <NotificationsIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
  },
  {
    label: 'Settings',
    title: 'Customize Your Experience',
    content: 'Visit the settings page to personalize your experience. You can adjust preferences, update your profile, and configure notifications.',
    icon: <SettingsIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
  },
  {
    label: 'Support',
    title: 'Get Help When You Need It',
    content: 'Our support team is here to help! You can access help documentation, submit tickets, or chat with our support team anytime.',
    icon: <HelpIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
  },
];

export default function ModalSlidesDemo() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      // Tour completed
      setOpen(false);
      setActiveStep(0);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
  };

  const handleStartTour = () => {
    setActiveStep(0);
    setOpen(true);
  };

  const currentStep = steps[activeStep];
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Demo Page Content */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Modal Slides Onboarding Demo
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          This demonstrates a modal-based onboarding workflow with multiple slides
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={handleStartTour}
          sx={{ mr: 2 }}
        >
          Start Onboarding Tour
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.push('/onboarding-demos')}
        >
          Back to Demos
        </Button>
      </Box>

      {/* Sample Dashboard Content */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <DashboardIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your main overview and analytics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <SettingsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customize your experience
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <HelpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Help & Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get assistance when you need it
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Onboarding Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="onboarding-modal-title"
        aria-describedby="onboarding-modal-description"
      >
        <Paper sx={modalStyle}>
          {/* Modal Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="h2">
              Getting Started Tour
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ px: 2, pt: 2 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Step {activeStep + 1} of {steps.length}
            </Typography>
          </Box>

          {/* Stepper */}
          <Box sx={{ px: 2, py: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Modal Content */}
          <Box sx={{ p: 4, textAlign: 'center', minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {currentStep.icon}
            <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 2 }}>
              {currentStep.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {currentStep.content}
            </Typography>
          </Box>

          {/* Modal Footer */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={activeStep === steps.length - 1 ? null : <ArrowForwardIcon />}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Container>
  );
}