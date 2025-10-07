"use client";

import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Popover,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Fab,
  Badge,
  Backdrop,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle as AccountCircleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'app-bar',
    title: 'Navigation Bar',
    content: 'This is your main navigation bar. It contains quick access to key features and your account settings.',
    target: 'tour-app-bar',
    placement: 'bottom',
  },
  {
    id: 'menu-button',
    title: 'Menu Button',
    content: 'Click here to open the sidebar navigation menu and access all sections of the application.',
    target: 'tour-menu-button',
    placement: 'bottom',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    content: 'Stay updated with important notifications and alerts. The badge shows you how many unread notifications you have.',
    target: 'tour-notifications',
    placement: 'bottom',
  },
  {
    id: 'profile',
    title: 'Your Profile',
    content: 'Access your account settings, profile information, and sign out options from here.',
    target: 'tour-profile',
    placement: 'bottom',
  },
  {
    id: 'sidebar',
    title: 'Sidebar Navigation',
    content: 'Navigate between different sections of the app using this sidebar. Each section is clearly organized for easy access.',
    target: 'tour-sidebar',
    placement: 'right',
  },
  {
    id: 'main-content',
    title: 'Main Content Area',
    content: 'This is where the main content of each section appears. The layout adapts to show relevant information for each page.',
    target: 'tour-main-content',
    placement: 'top',
  },
  {
    id: 'fab',
    title: 'Quick Actions',
    content: 'Use this floating action button to quickly create new items or access frequently used actions.',
    target: 'tour-fab',
    placement: 'left',
  },
];

export default function TooltipTourDemo() {
  const router = useRouter();
  const [isTouring, setIsTouring] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const elementRefs = useRef<Record<string, HTMLElement | null>>({});

  const currentStep = tourSteps[currentStepIndex];
  const isLastStep = currentStepIndex === tourSteps.length - 1;

  const startTour = () => {
    setIsTouring(true);
    setCurrentStepIndex(0);
    setDrawerOpen(true); // Open drawer for sidebar tour steps
    showCurrentStep();
  };

  const showCurrentStep = React.useCallback(() => {
    if (currentStep) {
      const targetElement = elementRefs.current[currentStep.target];
      if (targetElement) {
        setAnchorEl(targetElement);
        
        // Special handling for sidebar step
        if (currentStep.id === 'sidebar') {
          setDrawerOpen(true);
        }
      }
    }
  }, [currentStep]);

  const nextStep = () => {
    if (isLastStep) {
      endTour();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const endTour = () => {
    setIsTouring(false);
    setCurrentStepIndex(0);
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  React.useEffect(() => {
    if (isTouring) {
      // Small delay to ensure elements are rendered
      setTimeout(showCurrentStep, 100);
    }
  }, [currentStepIndex, isTouring, showCurrentStep]);

  const setRef = (id: string) => (element: HTMLElement | null) => {
    elementRefs.current[id] = element;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Tour Backdrop */}
      <Backdrop
        open={isTouring}
        sx={{ 
          zIndex: (theme) => theme.zIndex.modal - 1,
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
      />

      {/* App Bar */}
      <AppBar 
        position="fixed" 
        ref={setRef('tour-app-bar')}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          ...(isTouring && currentStep?.target === 'tour-app-bar' && {
            zIndex: (theme) => theme.zIndex.modal + 1,
            position: 'relative'
          })
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            ref={setRef('tour-menu-button')}
            sx={{ 
              mr: 2,
              ...(isTouring && currentStep?.target === 'tour-menu-button' && {
                zIndex: (theme) => theme.zIndex.modal + 1,
                position: 'relative'
              })
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tooltip Tour Demo
          </Typography>
          
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <SearchIcon />
          </IconButton>
          
          <IconButton 
            color="inherit" 
            ref={setRef('tour-notifications')}
            sx={{ 
              mr: 1,
              ...(isTouring && currentStep?.target === 'tour-notifications' && {
                zIndex: (theme) => theme.zIndex.modal + 1,
                position: 'relative'
              })
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton 
            color="inherit"
            ref={setRef('tour-profile')}
            sx={{
              ...(isTouring && currentStep?.target === 'tour-profile' && {
                zIndex: (theme) => theme.zIndex.modal + 1,
                position: 'relative'
              })
            }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            ...(isTouring && currentStep?.target === 'tour-sidebar' && {
              zIndex: (theme) => theme.zIndex.modal + 1,
              position: 'relative'
            })
          },
        }}
      >
        <Toolbar />
        <Box 
          sx={{ overflow: 'auto' }}
          ref={setRef('tour-sidebar')}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="Help & Support" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: drawerOpen ? 0 : '-240px',
          ...(isTouring && currentStep?.target === 'tour-main-content' && {
            zIndex: (theme) => theme.zIndex.modal + 1,
            position: 'relative'
          })
        }}
      >
        <Toolbar />
        
        <Container 
          maxWidth="lg"
          ref={setRef('tour-main-content')}
        >
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" component="h1" gutterBottom>
              Tooltip Guided Tour Demo
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              This demonstrates an interactive guided tour using tooltips and popovers
            </Typography>
            {!isTouring && (
              <>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  onClick={startTour}
                  sx={{ mr: 2 }}
                >
                  Start Guided Tour
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/onboarding-demos')}
                >
                  Back to Demos
                </Button>
              </>
            )}
          </Box>

          {/* Sample Content Cards */}
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <Card>
              <CardContent>
                <DashboardIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Analytics Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View comprehensive analytics and insights about your data
                </Typography>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <SettingsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  System Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure your preferences and system settings
                </Typography>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <HelpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Documentation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access help articles and support documentation
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        ref={setRef('tour-fab')}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          ...(isTouring && currentStep?.target === 'tour-fab' && {
            zIndex: (theme) => theme.zIndex.modal + 1,
            position: 'relative'
          })
        }}
      >
        <AddIcon />
      </Fab>

      {/* Tour Popover */}
      <Popover
        open={isTouring && Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={endTour}
        anchorOrigin={{
          vertical: currentStep?.placement === 'top' ? 'top' : 'bottom',
          horizontal: currentStep?.placement === 'left' ? 'left' : currentStep?.placement === 'right' ? 'right' : 'center',
        }}
        transformOrigin={{
          vertical: currentStep?.placement === 'bottom' ? 'top' : 'bottom',
          horizontal: currentStep?.placement === 'right' ? 'left' : currentStep?.placement === 'left' ? 'right' : 'center',
        }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }}
      >
        <Paper sx={{ p: 3, maxWidth: 350 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h3">
              {currentStep?.title}
            </Typography>
            <IconButton size="small" onClick={endTour}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {currentStep?.content}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {currentStepIndex + 1} of {tourSteps.length}
            </Typography>
            <Button
              variant="contained"
              onClick={nextStep}
              endIcon={!isLastStep ? <ArrowForwardIcon /> : null}
              size="small"
            >
              {isLastStep ? 'Finish Tour' : 'Next'}
            </Button>
          </Box>
        </Paper>
      </Popover>
    </Box>
  );
}