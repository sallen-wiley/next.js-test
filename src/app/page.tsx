"use client";
import AppHeader from "@/components/app/AppHeader";
import { Container, Typography, Paper, Link, Grid, Box } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

interface ClickableCardProps {
  href: string;
  title: string;
  description?: string;
}

function ClickableCard({ href, title, description }: ClickableCardProps) {
  return (
    <Link href={href} sx={{ textDecoration: "none" }}>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          height: "100%",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: (theme) => theme.shadows[3],
            transform: "translateY(-4px)",
          },
        }}
      >
        <Typography variant="body1" color="text.primary">
          {title}
        </Typography>
        {description && (
          <Typography variant="caption" display="block" color="text.secondary">
            {description}
          </Typography>
        )}
      </Paper>
    </Link>
  );
}

interface FeaturedCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeaturedCard({ href, icon, title, description }: FeaturedCardProps) {
  return (
    <Link href={href} sx={{ textDecoration: "none" }}>
      <Paper
        elevation={2}
        sx={{
          p: 4,
          height: "100%",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: (theme) => theme.shadows[6],
            transform: "translateY(-6px)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            color: (theme) => (theme.vars || theme).palette.primary.main,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Paper>
    </Link>
  );
}

function Hero() {
  const imageUrl =
    "https://images.unsplash.com/photo-1670859956807-049df98c4fb8?auto=format&fit=crop&w=1920&q=80";
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 240,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        mb: 4,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 6 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h4" component="h1" color="white">
            Publishing Platforms UX Test Ground
          </Typography>
          <Typography variant="body1" component="h2" color="white">
            Explore, design, and test publishing solutions with real-world
            visuals
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default function Home() {
  return (
    <>
      <AppHeader />
      <Hero />

      {/* Featured Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Featured Tools
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FeaturedCard
              href="/experiments/palette-generator"
              icon={<PaletteIcon sx={{ fontSize: 40 }} />}
              title="HSV Palette Generator"
              description="Generate harmonious color palettes using HSV interpolation for your design system"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FeaturedCard
              href="/kitchen-sink"
              icon={<DashboardIcon sx={{ fontSize: 40 }} />}
              title="Kitchen Sink"
              description="Explore the complete MUI component library with all themes and variants"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FeaturedCard
              href="/onboarding-demos"
              icon={<PersonAddIcon sx={{ fontSize: 40 }} />}
              title="Onboarding Workflows"
              description="Experience user onboarding flows and workflow demonstrations"
            />
          </Grid>
        </Grid>
      </Container>

      {/* All Demos Section */}
      <Container maxWidth="lg">
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          All Demos
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ClickableCard href="/woaa" title="WOAA" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ClickableCard
              href="/reviewer-dashboard"
              title="Reviewer Invitation Dashboard"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ClickableCard href="/data-demo" title="Real Data Demo" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ClickableCard
              href="/write-demo"
              title="Write Operations Demo"
              description="Test creating articles with mock and real data"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ClickableCard
              href="/experiments/notifications/admin"
              title="Notifications admin"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ClickableCard
              href="/experiments/notifications/history"
              title="Notifications history"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ClickableCard
              href="/experiments/notifications/preferences"
              title="Notifications preferences"
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
