import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Popover,
  Tabs,
  Tab,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ClearIcon from "@mui/icons-material/Clear";
import type { HueSet } from "../types";

interface ContrastColorPickerProps {
  value: string | null;
  onChange: (color: string | null) => void;
  hues: HueSet[];
  label?: string;
}

export default function ContrastColorPicker({
  value,
  onChange,
  hues,
  label = "Custom Contrast Color",
}: ContrastColorPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [inputValue, setInputValue] = useState(value || "");

  // Sync input value when prop changes
  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleShadeSelect = (color: string) => {
    onChange(color);
    handleClosePopover();
  };

  const handleClear = () => {
    onChange(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <TextField
        label={label}
        value={inputValue}
        onChange={(e) => {
          const color = e.target.value.toUpperCase();
          setInputValue(color);
          // Only update parent if it's a valid complete hex color
          if (/^#[0-9A-F]{6}$/.test(color)) {
            onChange(color);
          } else if (!color) {
            onChange(null);
          }
        }}
        onBlur={() => {
          // On blur, reset to valid value or empty
          if (inputValue && !/^#[0-9A-F]{6}$/.test(inputValue)) {
            setInputValue(value || "");
          }
        }}
        size="small"
        fullWidth
        placeholder="#000000"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton size="small" onClick={handleOpenPopover}>
                <ColorLensIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                title="Clear color"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ width: 400, maxHeight: 500 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            {hues.map((hue, index) => (
              <Tab key={hue.id} label={hue.name} value={index} />
            ))}
          </Tabs>

          {hues.map((hue, index) => (
            <Box
              key={hue.id}
              role="tabpanel"
              hidden={activeTab !== index}
              sx={{ p: 2 }}
            >
              {activeTab === index && (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Select a shade from {hue.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(60px, 1fr))",
                      gap: 1,
                      maxHeight: 350,
                      overflow: "auto",
                    }}
                  >
                    {hue.shades.map((shade) => (
                      <Button
                        key={shade.id}
                        onClick={() => handleShadeSelect(shade.color)}
                        sx={{
                          bgcolor: shade.color,
                          color: shade.hsv.v > 50 ? "#000" : "#fff",
                          minHeight: 60,
                          border: value === shade.color ? 3 : 1,
                          borderColor:
                            value === shade.color ? "primary.main" : "divider",
                          "&:hover": {
                            bgcolor: shade.color,
                            opacity: 0.9,
                          },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 0.5,
                        }}
                      >
                        <Typography variant="caption" fontWeight="bold">
                          {shade.label}
                        </Typography>
                        <Typography variant="caption" fontSize="0.6rem">
                          {shade.color}
                        </Typography>
                      </Button>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          ))}
        </Box>
      </Popover>
    </Box>
  );
}
