"use client";
import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
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
  onJournalChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onScopeChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
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
  onJournalChange,
  onStatusChange,
  onScopeChange,
  onPriorityChange,
  onReset,
}: FilterRailProps) {
  const theme = useTheme();

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
          borderRadius: 1.5,
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
            borderRadius: 1.5,
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
                    <Typography variant="body2" color="text.secondary">
                      {option.label}
                    </Typography>
                    {typeof option.count === "number" && (
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color="text.secondary"
                      >
                        {option.count}
                      </Typography>
                    )}
                  </Stack>
                }
                sx={{ mx: 0, px: 2, py: 0.5 }}
              />
            ))}
          </RadioGroup>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            borderColor: "divider",
            borderRadius: 1.5,
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
                    <Typography variant="body2" color="text.secondary">
                      {option.label}
                    </Typography>
                    {typeof option.count === "number" && (
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color="text.secondary"
                      >
                        {option.count}
                      </Typography>
                    )}
                  </Stack>
                }
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
      </Paper>
    </Box>
  );
}
