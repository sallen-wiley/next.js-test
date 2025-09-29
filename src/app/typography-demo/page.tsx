"use client";
import {
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Box,
  Divider,
} from "@mui/material";
import AppHeader from "@/components/app/AppHeader";

export default function TypographyDemo() {
  return (
    <>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h2" gutterBottom>
            Mixed Typography System Demo
          </Typography>

          <Typography variant="body1" paragraph>
            This page demonstrates our mixed font system where headings use
            serif fonts, buttons use monospace fonts, and body text uses
            sans-serif fonts. Use the floating action button on the right to
            switch between themes and color modes!
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* Headings Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              Headings (Serif Font - Source Serif 4)
            </Typography>
            <Stack spacing={2}>
              <Typography variant="h1">
                Heading 1 - The largest heading
              </Typography>
              <Typography variant="h2">Heading 2 - A large heading</Typography>
              <Typography variant="h3">Heading 3 - A medium heading</Typography>
              <Typography variant="h4">
                Heading 4 - A smaller heading
              </Typography>
              <Typography variant="h5">Heading 5 - A small heading</Typography>
              <Typography variant="h6">
                Heading 6 - The smallest heading
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Body Text Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              Body Text (Sans-serif Font - Inter)
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1">
                <strong>Body 1:</strong> This is the primary body text style.
                It&apos;s used for most content and provides excellent
                readability. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </Typography>
              <Typography variant="body2">
                <strong>Body 2:</strong> This is the secondary body text style,
                typically smaller than body1. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </Typography>
              <Typography variant="subtitle1">
                <strong>Subtitle 1:</strong> Used for section subtitles and
                important secondary text.
              </Typography>
              <Typography variant="subtitle2">
                <strong>Subtitle 2:</strong> A smaller subtitle variant for less
                prominent sections.
              </Typography>
              <Typography variant="caption">
                <strong>Caption:</strong> Small text used for image captions,
                footnotes, or metadata.
              </Typography>
              <Typography variant="overline">
                <strong>Overline:</strong> All caps text for labels and
                categories.
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Buttons Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              Interactive Elements (Monospace Font - IBM Plex Mono)
            </Typography>
            <Typography variant="body1" paragraph>
              All buttons use a monospace font to give them a distinctive,
              technical appearance:
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{ gap: 2, flexWrap: "wrap" }}
            >
              <Button variant="contained" color="primary">
                Primary Button
              </Button>
              <Button variant="outlined" color="secondary">
                Secondary Button
              </Button>
              <Button variant="text">Text Button</Button>
              <Button variant="contained" size="small">
                Small Button
              </Button>
              <Button variant="contained" size="large">
                Large Button
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Typography in Context */}
          <Box>
            <Typography variant="h3" gutterBottom>
              Typography in Context
            </Typography>
            <Typography variant="body1" paragraph>
              Here&apos;s how the mixed typography system works together in a
              real content scenario:
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
              <Typography variant="h4" gutterBottom>
                Article Title Using Serif Font
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Subtitle in Sans-serif for Better Readability
              </Typography>
              <Typography variant="body1" paragraph>
                The article content uses a clean sans-serif font (Inter) for
                optimal readability. This creates a pleasant reading experience
                while the serif headings provide visual hierarchy and elegance.
              </Typography>
              <Typography variant="body2" paragraph>
                Secondary content and descriptions use Body 2, which is slightly
                smaller but maintains the same font family for consistency.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Button variant="contained" sx={{ mr: 2 }}>
                  Read More
                </Button>
                <Button variant="outlined">Share Article</Button>
              </Box>
              <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                Published on September 25, 2025 • 5 min read
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
