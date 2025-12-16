"use client";
import * as React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  ListItemText,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import type { ManuscriptTag } from "@/lib/supabase";

export type FilterOption = {
  label: string;
  value: string;
  count?: number;
};

export type SelectOption = {
  label: string;
  value: string;
};

type FilterRailProps = {
  journalOptions: SelectOption[];
  statusOptions: SelectOption[];
  scopeOptions: FilterOption[];
  priorityOptions: FilterOption[];
  selectedJournal: string;
  selectedStatus: string;
  selectedScope: string;
  selectedPriority: string;
  selectedTags: ManuscriptTag[];
  onJournalChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onScopeChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onTagsChange: (tags: ManuscriptTag[]) => void;
  onReset: () => void;
};

export function FilterRail({
  journalOptions,
  statusOptions,
  scopeOptions,
  priorityOptions,
  selectedJournal,
  selectedStatus,
  selectedScope,
  selectedPriority,
  selectedTags,
  onJournalChange,
  onStatusChange,
  onScopeChange,
  onPriorityChange,
  onTagsChange,
  onReset,
}: FilterRailProps) {
  const theme = useTheme();

  const allTags: ManuscriptTag[] = [
    "commissioned",
    "rescinded",
    "transparent peer review",
    "transferred",
    "apc edited",
  ];

  return (
    <Box
      sx={{
        position: "sticky",
        top: theme.spacing(2),
        alignSelf: "flex-start",
        maxHeight: `calc(100vh - ${theme.spacing(4)})`,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2,
          boxShadow: "0px 4px 8px rgba(51, 51, 51, 0.11)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="text.secondary"
          >
            Filters
          </Typography>
          <Button
            size="small"
            color="primary"
            startIcon={<RestartAltIcon />}
            onClick={onReset}
          >
            Reset filters
          </Button>
        </Stack>

        <FormControl fullWidth size="small">
          <FormLabel sx={{ color: "text.secondary", fontWeight: 700 }}>
            Journal
          </FormLabel>
          <Select
            value={selectedJournal}
            onChange={(event) => onJournalChange(event.target.value)}
            displayEmpty
          >
            {journalOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Paper
          variant="outlined"
          sx={{
            borderColor: "divider",
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <FormLabel sx={{ color: "text.secondary", fontWeight: 700 }}>
              Scope
            </FormLabel>
          </Box>
          <RadioGroup
            value={selectedScope}
            onChange={(event) => onScopeChange(event.target.value)}
          >
            {scopeOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                label={
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Box component="span" sx={{ flex: 1 }}>
                      {option.label}
                    </Box>
                    {typeof option.count === "number" && (
                      <Box
                        component="span"
                        sx={{ fontWeight: 700, flexShrink: 0 }}
                      >
                        {option.count}
                      </Box>
                    )}
                  </Stack>
                }
                slotProps={{
                  typography: {
                    sx: {
                      display: "flex",
                      width: "100%",
                    },
                  },
                }}
                sx={{ mx: 0, px: 2, py: 0.5 }}
              />
            ))}
          </RadioGroup>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            borderColor: "divider",
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <FormLabel sx={{ color: "text.secondary", fontWeight: 700 }}>
              Priority
            </FormLabel>
          </Box>
          <RadioGroup
            value={selectedPriority}
            onChange={(event) => onPriorityChange(event.target.value)}
          >
            {priorityOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                label={
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Box component="span" sx={{ flex: 1 }}>
                      {option.label}
                    </Box>
                    {typeof option.count === "number" && (
                      <Box
                        component="span"
                        sx={{ fontWeight: 700, flexShrink: 0 }}
                      >
                        {option.count}
                      </Box>
                    )}
                  </Stack>
                }
                slotProps={{
                  typography: {
                    sx: {
                      display: "flex",
                      width: "100%",
                    },
                  },
                }}
                sx={{ mx: 0, px: 2, py: 0.5 }}
              />
            ))}
          </RadioGroup>
        </Paper>

        <FormControl fullWidth size="small">
          <FormLabel sx={{ color: "text.secondary", fontWeight: 700 }}>
            Status
          </FormLabel>
          <Select
            value={selectedStatus}
            onChange={(event) => onStatusChange(event.target.value)}
            displayEmpty
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <FormLabel sx={{ color: "text.secondary", fontWeight: 700, mb: 1 }}>
            Manuscript Tags
          </FormLabel>
          <Select
            multiple
            value={selectedTags}
            onChange={(event) => {
              const value = event.target.value;
              onTagsChange(
                typeof value === "string"
                  ? (value.split(",") as ManuscriptTag[])
                  : (value as ManuscriptTag[])
              );
            }}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>All tags</em>;
              }
              return selected
                .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1))
                .join(", ");
            }}
            displayEmpty
          >
            <MenuItem disabled value="">
              <em>Select tags to filter</em>
            </MenuItem>
            {allTags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                <Checkbox
                  checked={selectedTags.indexOf(tag) > -1}
                  size="small"
                />
                <ListItemText
                  primary={tag.charAt(0).toUpperCase() + tag.slice(1)}
                  sx={{ textTransform: "capitalize" }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
    </Box>
  );
}
