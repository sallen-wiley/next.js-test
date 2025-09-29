"use client";
import GlobalHeader from "@/components/app/GlobalHeader";
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
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { blue } from "@mui/material/colors";

const resources = [
  {
    title: "Account Dashboard",
    description: "Manage your open access accounts and view analytics.",
    icon: <DashboardIcon sx={{ fontSize: 48, color: blue[500] }} />,
    href: "/woaa/dashboard",
    gradient: `linear-gradient(135deg, ${blue[700]} 0%, ${blue[500]} 100%)`,
  },
  {
    title: "Notification Center",
    description: "View and manage notifications for your account.",
    icon: <NotificationsActiveIcon sx={{ fontSize: 48, color: blue[500] }} />,
    href: "/experiments/notification-admin",
    gradient: `linear-gradient(135deg, ${blue[800]} 0%, ${blue[700]} 100%)`,
  },
  {
    title: "Preferences",
    description: "Set your notification and account preferences.",
    icon: <SettingsIcon sx={{ fontSize: 48, color: blue[500] }} />,
    href: "/experiments/notification-preferences",
    gradient: `linear-gradient(135deg, ${blue[900]} 0%, ${blue[800]} 100%)`,
  },
  {
    title: "Support",
    description: "Contact support or access help resources.",
    icon: <SupportAgentIcon sx={{ fontSize: 48, color: blue[500] }} />,
    href: "#",
    gradient: `linear-gradient(135deg, ${blue[600]} 0%, ${blue[700]} 100%)`,
  },
];

export default function Home() {
  return (
    <>
      <GlobalHeader
        logoAffix="Open Access Accounts"
        fixed={false}
        containerProps={{ maxWidth: "xl" }}
        rightSlot={
          <Button
            variant="contained"
            color="primary"
            href="/login"
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Log In
          </Button>
        }
      />
      {/* Hero Section */}
      <Box
        sx={{
          width: "100vw",
          minHeight: 320,
          position: "relative",
          background: `linear-gradient(90deg, ${blue[900]} 0%, ${blue[700]} 100%)`,
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
            color: "rgba(255,255,255,0.08)",
            zIndex: 0,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h2" color="white" fontWeight={700} gutterBottom>
            Wiley Open Access Account Admin
          </Typography>
          <Typography variant="h5" color="white" sx={{ maxWidth: 600 }}>
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
                  color: "#fff",
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
                      color="#fff"
                    >
                      {resource.title}
                    </Typography>
                    <Typography variant="body2" color="#e3f2fd">
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
          background: "#222",
          color: "#fff",
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
