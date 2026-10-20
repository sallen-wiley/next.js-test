import React from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

export type ArticleSummaryMetadata = {
  label: string;
  value: string;
};

export type ArticleSummaryCardProps = {
  title: string;
  metadata: ArticleSummaryMetadata[];
  actionLabel?: string;
};

export function ArticleSummaryCard({
  title,
  metadata,
  actionLabel = "Submit",
}: ArticleSummaryCardProps) {
  return (
    <Paper>
      <Stack spacing={2} sx={{ px: 4, py: 2 }}>
        <Stack direction="row" spacing={4} alignItems="flex-start">
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton aria-label="More actions">
            <MoreHorizRoundedIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "max-content 1fr",
            columnGap: 2,
            rowGap: 0.5,
          }}
        >
          {metadata.map(({ label, value }) => (
            <React.Fragment key={label}>
              <Typography variant="body1">{label}</Typography>
              <Typography variant="body1" sx={{ fontWeight: "fontWeightBold" }}>
                {value}
              </Typography>
            </React.Fragment>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button color="primary" size="large" variant="contained">
            {actionLabel}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
