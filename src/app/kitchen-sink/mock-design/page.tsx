"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import {
  ArticleSummaryCard,
  type ArticleSummaryMetadata,
} from "@/components/product/ArticleSummaryCard";

const articleTitle =
  "Maternal heavy metal exposure during pregnancy in the Electronic Waste Disassembly Area: the relationship between gestational weight gain and infant birth weight";

const articleMetadata: ArticleSummaryMetadata[] = [
  { label: "Article type:", value: "Original Research" },
  { label: "Corresponding Author:", value: "James Kendle" },
];

const checkboxLabels = ["Check 1", "Check 2", "Check 3"];

const articleCards = [1, 2, 3];

export default function MockDesignPage() {
  useHeaderConfig({
    logoAffix: "Mock Design",
    containerProps: { maxWidth: "lg" },
  });

  return (
    <Box sx={{ py: 4, pb: 12 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 1 }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ typography: "mono" as const }}
          >
            Mock Design
          </Typography>
          <Button
            component={Link}
            href="/kitchen-sink"
            variant="outlined"
            size="small"
          >
            Back to Kitchen Sink
          </Button>
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Recreated from the Figma mock: a left control rail beside a stack of
          article summary surfaces, with a full-width action below.
        </Typography>

        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems="flex-start"
          >
            <Stack
              spacing={3}
              alignItems="center"
              sx={{ width: { xs: "100%", md: 300 }, flexShrink: 0 }}
            >
              <Button color="primary" size="large" variant="contained">
                I am a button
              </Button>

              <FormControl component="fieldset">
                <FormLabel>Check boxes form label</FormLabel>
                <FormGroup>
                  {checkboxLabels.map((label) => (
                    <FormControlLabel
                      key={label}
                      control={<Checkbox size="medium" color="primary" />}
                      labelPlacement="end"
                      label={label}
                    />
                  ))}
                </FormGroup>
                <FormHelperText>Helper text</FormHelperText>
              </FormControl>

              <Paper sx={{ width: "100%" }}>
                <FormControlLabel
                  control={<Switch color="primary" size="medium" />}
                  label="I am a switch label"
                />
              </Paper>

              <Box
                sx={{
                  width: 100,
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1">
                  I am plain text in a rectangle
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={3} sx={{ flexGrow: 1, width: "100%" }}>
              {articleCards.map((card) => (
                <ArticleSummaryCard
                  key={card}
                  title={articleTitle}
                  metadata={articleMetadata}
                />
              ))}
            </Stack>
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              px: 2,
              py: 5,
            }}
          >
            <Button color="primary" size="large" variant="contained">
              I am a button inside an autolayout with custom padding and gap and
              alignment
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
