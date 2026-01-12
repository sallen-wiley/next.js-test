import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import type { ShadeConfiguration } from "../types";

interface ShadeConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  currentConfig: ShadeConfiguration[];
  onSave: (newConfig: ShadeConfiguration[]) => void;
}

export default function ShadeConfigurationDialog({
  open,
  onClose,
  currentConfig,
  onSave,
}: ShadeConfigurationDialogProps) {
  const [countInput, setCountInput] = useState(String(currentConfig.length));
  const [configs, setConfigs] = useState(currentConfig);

  // Reset local state when dialog opens or currentConfig changes
  React.useEffect(() => {
    if (open) {
      setCountInput(String(currentConfig.length));
      setConfigs(currentConfig);
    }
  }, [open, currentConfig]);

  // Update configs array when count changes
  const handleCountChange = (inputValue: string) => {
    // Always update the input display
    setCountInput(inputValue);

    // Parse and validate
    const newCount = parseInt(inputValue, 10);

    // Only update configs if we have a valid number in range
    if (isNaN(newCount) || newCount < 1 || newCount > 20) return;

    if (newCount > configs.length) {
      // Add new configs with smart defaults
      const newConfigs = [...configs];
      for (let i = configs.length; i < newCount; i++) {
        newConfigs.push({
          id: String(i + 1),
          label: String((i + 1) * 100), // Smart default: 100, 200, 300, etc.
        });
      }
      setConfigs(newConfigs);
    } else {
      // Remove from end
      setConfigs(configs.slice(0, newCount));
    }
  };

  const handleLabelChange = (index: number, newLabel: string) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], label: newLabel };
    setConfigs(newConfigs);
  };

  const handleSave = () => {
    onSave(configs);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>Configure Shades</DialogTitle>
      <DialogContent>
        <TextField
          label="Number of Shades"
          type="number"
          value={countInput}
          onChange={(e) => handleCountChange(e.target.value)}
          onBlur={() => {
            // On blur, ensure we have a valid value
            const num = parseInt(countInput, 10);
            if (isNaN(num) || num < 1) {
              setCountInput("1");
            } else if (num > 20) {
              setCountInput("20");
            }
          }}
          slotProps={{ htmlInput: { min: 1, max: 20 } }}
          fullWidth
          sx={{ mb: 3, mt: 1 }}
          helperText="Choose between 1 and 20 shades"
          error={(() => {
            const num = parseInt(countInput, 10);
            return isNaN(num) || num < 1 || num > 20;
          })()}
        />

        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Shade Labels (from lightest to darkest)
        </Typography>

        <Stack spacing={2}>
          {configs.map((config, index) => (
            <TextField
              key={config.id}
              label={`Shade ${index + 1}`}
              value={config.label}
              onChange={(e) => handleLabelChange(index, e.target.value)}
              size="small"
              fullWidth
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={(() => {
            const num = parseInt(countInput, 10);
            return isNaN(num) || num < 1 || num > 20;
          })()}
        >
          Save Configuration
        </Button>
      </DialogActions>
    </Dialog>
  );
}
