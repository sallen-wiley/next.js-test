"use client";
import React from "react";
import { Box, Grid, Link, Stack, Typography } from "@mui/material";
import {
  ArticleSummaryCard,
  type ArticleSummaryMetadata,
} from "@/components/product/ArticleSummaryCard";

const metadata: ArticleSummaryMetadata[] = [
  { label: "Article type:", value: "Original Research" },
  { label: "Corresponding Author:", value: "James Kendle" },
];

export const ArticleSummarySection = React.memo(() => {
  return (
    <Grid size={12}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ typography: "mono" as const, mt: 4 }}
      >
        Article Summary Paper
      </Typography>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Paper surface combining a title, an overflow action, a label/value
          metadata grid, and a trailing primary action.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reference:{" "}
          <Link
            href="https://mui.com/material-ui/react-paper/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            official MUI Paper docs
          </Link>
          .
        </Typography>
      </Stack>

      <Box sx={{ maxWidth: 600 }}>
        <ArticleSummaryCard
          title="Maternal heavy metal exposure during pregnancy in the Electronic Waste Disassembly Area: the relationship between gestational weight gain and infant birth weight"
          metadata={metadata}
        />
      </Box>
    </Grid>
  );
});

ArticleSummarySection.displayName = "ArticleSummarySection";
