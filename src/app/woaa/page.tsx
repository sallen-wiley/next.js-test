"use client";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Link,
  Stack,
  Grid,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function Home() {
  const theme = useTheme();

  // Resources array using theme colors for gradients
  const resources = [
    {
      title: "Account Dashboard",
      description: "Manage your open access accounts and view analytics.",
      icon: (
        <DashboardIcon
          sx={{
            fontSize: 48,
            color: (theme.vars || theme).palette.text.primary,
          }}
        />
      ),
      href: "/woaa/dashboard",
      gradient: `linear-gradient(135deg, ${
        (theme.vars || theme).palette.background.default
      } 0%, ${(theme.vars || theme).palette.background.paper} 100%)`,
    },
    {
      title: "Notification Center",
      description: "View and manage notifications for your account.",
      icon: (
        <NotificationsActiveIcon
          sx={{
            fontSize: 48,
            color: (theme.vars || theme).palette.text.primary,
          }}
        />
      ),
      href: "/experiments/notification-admin",
      gradient: `linear-gradient(135deg, ${
        (theme.vars || theme).palette.background.paper
      } 0%, ${(theme.vars || theme).palette.background.default} 100%)`,
    },
    {
      title: "Preferences",
      description: "Set your notification and account preferences.",
      icon: (
        <SettingsIcon
          sx={{
            fontSize: 48,
            color: (theme.vars || theme).palette.text.secondary,
          }}
        />
      ),
      href: "/experiments/notification-preferences",
      gradient: `linear-gradient(135deg, ${
        (theme.vars || theme).palette.background.default
      } 30%, ${(theme.vars || theme).palette.background.paper} 100%)`,
    },
    {
      title: "Support",
      description: "Contact support or access help resources.",
      icon: (
        <SupportAgentIcon
          sx={{
            fontSize: 48,
            color: (theme.vars || theme).palette.text.secondary,
          }}
        />
      ),
      href: "#",
      gradient: `linear-gradient(135deg, ${
        (theme.vars || theme).palette.background.paper
      } 30%, ${(theme.vars || theme).palette.background.default} 100%)`,
    },
  ];

  // Configure header for this specific page
  useHeaderConfig({
    logoAffix: "Wiley Open Access Accounts",
    containerProps: { maxWidth: "xl" },
  });

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          width: "100vw",
          minHeight: 320,
          position: "relative",
          background: `linear-gradient(90deg, ${
            (theme.vars || theme).palette.background.default
          } 0%, ${(theme.vars || theme).palette.background.paper} 100%)`,
          display: "flex",
          alignItems: "center",
          py: 6,
          mb: 6,
          overflow: "hidden",
        }}
      >
        {/* Hero Icon as background graphic */}
        <DashboardIcon
          sx={{
            position: "absolute",
            right: { xs: 16, md: 64 },
            top: { xs: 32, md: 48 },
            fontSize: { xs: 120, md: 200 },
            color: (theme.vars || theme).palette.action.disabled,
            opacity: 0.1,
            zIndex: 0,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h2"
            color={(theme.vars || theme).palette.text.primary}
            fontWeight={700}
            gutterBottom
          >
            Wiley Open Access Account Admin
          </Typography>
          <Typography
            variant="h5"
            color={(theme.vars || theme).palette.text.secondary}
            sx={{ maxWidth: 600 }}
          >
            Welcome to your customer admin dashboard. Manage your open access
            accounts, notifications, and preferences all in one place.
          </Typography>
        </Container>
      </Box>
      {/* Resource Cards Grid */}
      <Container maxWidth="xl" sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Quick Links
        </Typography>
        <Grid container spacing={4}>
          {resources.map((resource) => (
            <Grid
              size={{ xs: 12, sm: 12, md: 6, lg: 3, xl: 3 }}
              key={resource.title}
            >
              <Card
                sx={{
                  height: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: resource.gradient,
                  color: (theme.vars || theme).palette.text.primary,
                  boxShadow: 3,
                  borderRadius: 3,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.03)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={resource.href}
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ mb: 2 }}>{resource.icon}</Box>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      color={(theme.vars || theme).palette.text.primary}
                    >
                      {resource.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={(theme.vars || theme).palette.text.secondary}
                    >
                      {resource.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          background: (theme.vars || theme).palette.background.paper,
          color: (theme.vars || theme).palette.text.primary,
          py: 4,
          mt: "auto",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2">
              © {new Date().getFullYear()} Wiley. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link href="#" color="inherit" underline="hover">
                Privacy Policy
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Terms of Service
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
