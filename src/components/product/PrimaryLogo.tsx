import type {} from "@mui/material/themeCssVarsAugmentation";
import React from "react";
import { Box, Typography, Link, Skeleton } from "@mui/material";
import { useTheme, useColorScheme } from "@mui/material/styles";
import { useLogoContext } from "@/contexts/LogoContext";
import type { TenantType, LogoConfig } from "./logos/types";
import {
  defaultLogo,
  wileyLogo,
  wiley2025Logo,
  sageLogo,
  ieeeLogo,
  reLightStackedLogo,
  reBoldStackedLogo,
  reLightAllcapsLogo,
  reBoldAllcapsLogo,
  reBoldLogo,
} from "./logos";

// Map tenant types to their logo configurations
const tenantLogos: Record<TenantType, LogoConfig> = {
  default: defaultLogo,
  wiley: wileyLogo,
  wiley2025: wiley2025Logo,
  sage: sageLogo,
  ieee: ieeeLogo,
  "re-light-stacked": reLightStackedLogo,
  "re-bold-stacked": reBoldStackedLogo,
  "re-light-allcaps": reLightAllcapsLogo,
  "re-bold-allcaps": reBoldAllcapsLogo,
  "re-bold": reBoldLogo,
};

interface PrimaryLogoProps {
  /** The affix text to show next to the logo. If not provided, affix is hidden. */
  affix?: string;
  /** The tenant type to determine which logo to display. If not provided, uses context value. */
  tenant?: TenantType;
  /** Override the logo color. If not provided, uses theme-based color. */
  color?: string;
}

/**
 * PrimaryLogo component renders tenant-specific logos with an optional affix text.
 * Supports multiple tenants with different logo designs and maintains theme responsiveness.
 * If no tenant is specified, it uses the tenant from LogoContext.
 */
export default function PrimaryLogo({
  affix,
  tenant,
  color,
}: PrimaryLogoProps) {
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const { currentTenant } = useLogoContext();

  // If affix is not provided, do not show the affix section
  const showAffix = Boolean(affix);

  // Use provided tenant or fall back to context tenant
  const activeTenant: TenantType = (tenant || currentTenant) as TenantType;

  // Get the logo configuration for the selected tenant
  // Fallback to "default" if the tenant doesn't exist (e.g., old localStorage values)
  const logoConfig = tenantLogos[activeTenant] || tenantLogos["default"];

  // Determine SVG fill color based on current color scheme or override
  // Handle system mode by checking systemMode
  const currentMode = mode === "system" ? systemMode : mode;

  // Show skeleton during SSR or when color scheme is not resolved
  const isLoading = !mode || (mode === "system" && !systemMode);

  const getLogoColor = () => {
    if (color) return color; // Override color takes precedence

    if (currentMode === "dark") {
      return "white"; // All logos use white in dark mode
    }

    // Light mode colors - tenant specific
    switch (activeTenant) {
      case "sage":
        return "#001F83";
      case "ieee":
        return "#00629B";
      case "re-light-stacked":
      case "re-bold-stacked":
        return "black";
      case "wiley2025":
        return "black"; // Wordmark color for wiley2025
      case "wiley":
      case "default":
      default:
        return "black";
    }
  };

  const getWiley2025LogomarkColor = () => {
    return currentMode === "dark" ? "#00d975" : "#003b44";
  };

  const logoFillColor = getLogoColor();

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        <Box
          maxHeight={40}
          maxWidth={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Skeleton
            variant="rectangular"
            width={logoConfig.width}
            height={logoConfig.height}
            sx={{ borderRadius: 1 }}
          />
        </Box>
        {showAffix && (
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <Skeleton
              variant="rectangular"
              width={2}
              height={42}
              sx={{ borderRadius: 1, mx: 2 }}
            />
            <Skeleton variant="text" width={120} height={24} />
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
      <Box
        maxHeight={40}
        maxWidth={229}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Link
          href="/"
          underline="none"
          sx={{ display: "flex", maxWidth: "100%", maxHeight: "100%" }}
        >
          <svg
            viewBox={logoConfig.viewBox}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            style={{
              color: logoFillColor,
              width: "100%",
              height: "100%",
              maxWidth: "300px",
              maxHeight: "40px",
            }}
          >
            {activeTenant === "wiley2025" && (
              <style>
                {`
                  .wiley2025-logomark {
                    fill: ${getWiley2025LogomarkColor()};
                  }
                  .wiley2025-wordmark {
                    fill: ${logoFillColor};
                  }
                `}
              </style>
            )}
            {logoConfig.path}
          </svg>
        </Link>
      </Box>
      {showAffix && (
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <Box
            sx={{
              width: "2px",
              height: 42,
              bgcolor: (theme.vars || theme).palette.divider,
              borderRadius: 1,
              mx: 2,
            }}
          />
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 24,
              lineHeight: "24px",
              color: "text.primary",
              whiteSpace: "nowrap",
            }}
          >
            {affix ?? "{site.name}"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
