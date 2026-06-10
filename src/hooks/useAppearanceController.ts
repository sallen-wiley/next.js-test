"use client";

import { useCallback } from "react";
import { useColorScheme } from "@mui/material/styles";
import type { TenantType } from "@/components/product/logos/types";
import { useLogoContext } from "@/contexts/LogoContext";
import type { ColorMode, ThemeName } from "@/contexts/ThemeContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useAppearanceUrlSync } from "@/contexts/AppearanceUrlSyncContext";
import { useAppearanceSearchParams } from "@/hooks/useAppearanceSearchParams";

export interface AppearanceUpdates {
  theme?: ThemeName | null;
  mode?: ColorMode | null;
  logo?: TenantType | null;
}

interface ApplyAppearanceOptions {
  syncUrl?: boolean;
  pinParams?: boolean;
}

export function useAppearanceController() {
  const { currentTheme, setTheme } = useThemeContext();
  const { mode, setMode } = useColorScheme();
  const { currentTenant, setTenant } = useLogoContext();
  const { pinParams } = useAppearanceUrlSync();
  const { updateAppearanceParams } = useAppearanceSearchParams();

  const applyAppearance = useCallback(
    (updates: AppearanceUpdates, options: ApplyAppearanceOptions = {}) => {
      const { syncUrl = false, pinParams: shouldPin = false } = options;

      if (updates.theme !== undefined) {
        if (shouldPin && updates.theme) {
          pinParams({ theme: true });
        }

        if (updates.theme && currentTheme !== updates.theme) {
          setTheme(updates.theme);
        }
      }

      if (updates.mode !== undefined) {
        if (shouldPin && updates.mode) {
          pinParams({ mode: true });
        }

        if (updates.mode && mode !== updates.mode) {
          setMode(updates.mode);
        }
      }

      if (updates.logo !== undefined) {
        if (shouldPin && updates.logo) {
          pinParams({ logo: true });
        }

        if (updates.logo && currentTenant !== updates.logo) {
          setTenant(updates.logo);
        }
      }

      if (syncUrl) {
        updateAppearanceParams(updates);
      }
    },
    [
      currentTenant,
      currentTheme,
      mode,
      pinParams,
      setMode,
      setTenant,
      setTheme,
      updateAppearanceParams,
    ],
  );

  return { applyAppearance };
}
