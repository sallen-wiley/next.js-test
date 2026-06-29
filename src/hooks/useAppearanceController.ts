"use client";

import { useCallback, useEffect, useRef } from "react";
import { useColorScheme } from "@mui/material/styles";
import type { TenantType } from "@/components/product/logos/types";
import { useLogoContext } from "@/contexts/LogoContext";
import type { ColorMode, ThemeName } from "@/contexts/ThemeContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import {
  useAppearanceUrlSync,
  type AppearancePinnedParams,
} from "@/contexts/AppearanceUrlSyncContext";
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
  const { pinParams, beginPendingSync } = useAppearanceUrlSync();
  const { updateAppearanceParams } = useAppearanceSearchParams();

  const currentThemeRef = useRef(currentTheme);
  const modeRef = useRef(mode);
  const currentTenantRef = useRef(currentTenant);

  useEffect(() => {
    currentThemeRef.current = currentTheme;
  }, [currentTheme]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    currentTenantRef.current = currentTenant;
  }, [currentTenant]);

  const applyAppearance = useCallback(
    (updates: AppearanceUpdates, options: ApplyAppearanceOptions = {}) => {
      const { syncUrl = false, pinParams: shouldPin = false } = options;
      const pinUpdates: Partial<AppearancePinnedParams> = {};

      // Phase 1: apply local state updates first.
      if (updates.theme !== undefined) {
        if (updates.theme && currentThemeRef.current !== updates.theme) {
          setTheme(updates.theme);
          currentThemeRef.current = updates.theme;
        }

        if (shouldPin && updates.theme) {
          pinUpdates.theme = true;
        }
      }

      if (updates.mode !== undefined) {
        if (updates.mode && modeRef.current !== updates.mode) {
          setMode(updates.mode);
          modeRef.current = updates.mode;
        }

        if (shouldPin && updates.mode) {
          pinUpdates.mode = true;
        }
      }

      if (updates.logo !== undefined) {
        if (updates.logo && currentTenantRef.current !== updates.logo) {
          setTenant(updates.logo);
          currentTenantRef.current = updates.logo;
        }

        if (shouldPin && updates.logo) {
          pinUpdates.logo = true;
        }
      }

      // Phase 2: pin requested parameters after state updates are queued.
      if (
        shouldPin &&
        (pinUpdates.theme || pinUpdates.mode || pinUpdates.logo)
      ) {
        pinParams(pinUpdates);
      }

      // Phase 3: sync URL once local + pin intent are established.
      if (syncUrl) {
        beginPendingSync({
          theme: updates.theme ?? undefined,
          mode: updates.mode ?? undefined,
          logo: updates.logo ?? undefined,
        });
        updateAppearanceParams(updates);
      }
    },
    [
      beginPendingSync,
      pinParams,
      setMode,
      setTenant,
      setTheme,
      updateAppearanceParams,
    ],
  );

  return { applyAppearance };
}
