"use client";
import AppHeader from "@/components/app/AppHeader";
import {
  Container,
  Typography,
  Paper,
  Link,
  Stack,
  Grid,
  Box,
} from "@mui/material";

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
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ my: 4 }}>
          <Grid size={12}>
            <Stack direction="column" spacing={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="body1">
                  <Link href="/onboarding-demos">
                    Onboarding Workflow Demos
                  </Link>
                </Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="body1">
                  <Link href="/woaa">WOAA</Link>
                </Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="body1">
                  <Link href="/kitchen-sink">Kitchen sink</Link>
                </Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="body1">
                  <Link href="/reviewer-dashboard">
                    Reviewer Invitation Dashboard
                  </Link>
                </Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="body1">
                  <Link href="/data-demo">Real Data Demo</Link>
                </Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="body1">
                  <Link href="/typography-demo">Typography Demo</Link>
                </Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="body1">
                  <Link href="/experiments/notifications/admin">
                    Notifications admin
                  </Link>
                </Typography>
                <Typography variant="body1">
                  <Link href="/experiments/notifications/history">
                    Notifications history
                  </Link>
                </Typography>
                <Typography variant="body1">
                  <Link href="/experiments/notifications/preferences">
                    Notifications preferences
                  </Link>
                </Typography>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
