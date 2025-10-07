"use client";

import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { useLogoContext } from "@/contexts/LogoContext";
import type { TenantType } from "@/components/product/PrimaryLogo";

// Tenant metadata for better UX
const tenantMetadata: Record<
  TenantType,
  { label: string; description: string; color: string }
> = {
  wiley: {
    label: "Wiley",
    description: "Professional academic publishing",
    color: "#3F51B5",
  },
  sage: {
    label: "Sage",
    description: "Research and educational content",
    color: "#2E8B57",
  },
  ieee: {
    label: "IEEE",
    description: "Electrical and electronics engineering",
    color: "#295FA3",
  },
  default: {
    label: "Default",
    description: "Standard brand logo",
    color: "#1976D2",
  },
};

interface LogoSwitcherProps {
  variant?: "select" | "chips";
  showDescription?: boolean;
}

export const LogoSwitcher: React.FC<LogoSwitcherProps> = ({
  variant = "select",
  showDescription = true,
}) => {
  const { currentTenant, setTenant, availableTenants } = useLogoContext();

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const tenantName = event.target.value as TenantType;
    setTenant(tenantName);
  };

  const handleChipClick = (tenantName: TenantType) => {
    setTenant(tenantName);
  };

  if (variant === "chips") {
    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Choose Logo:
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {availableTenants.map((tenantName) => {
            const meta = tenantMetadata[tenantName];
            return (
              <Chip
                key={tenantName}
                label={meta.label}
                onClick={() => handleChipClick(tenantName)}
                color={currentTenant === tenantName ? "primary" : "default"}
                variant={currentTenant === tenantName ? "filled" : "outlined"}
                sx={{
                  borderColor:
                    currentTenant === tenantName ? meta.color : undefined,
                  "&:hover": {
                    backgroundColor:
                      currentTenant === tenantName
                        ? undefined
                        : `${meta.color}20`,
                  },
                }}
              />
            );
          })}
        </Box>
        {showDescription && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            {tenantMetadata[currentTenant].description}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="logo-select-label">Logo</InputLabel>
        <Select
          labelId="logo-select-label"
          id="logo-select"
          value={currentTenant}
          label="Logo"
          onChange={handleSelectChange}
        >
          {availableTenants.map((tenantName) => {
            const meta = tenantMetadata[tenantName];
            return (
              <MenuItem key={tenantName} value={tenantName}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: meta.color,
                    }}
                  />
                  <Box>
                    <Typography variant="body2">{meta.label}</Typography>
                    {showDescription && (
                      <Typography variant="caption" color="text.secondary">
                        {meta.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LogoSwitcher;