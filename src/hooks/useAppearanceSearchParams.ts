"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { TenantType } from "@/components/product/logos/types";
import type { ColorMode, ThemeName } from "@/contexts/ThemeContext";
import { appearanceQueryParamKeys } from "@/lib/appearanceUrlParams";

interface AppearanceParamUpdates {
  theme?: ThemeName | null;
  mode?: ColorMode | null;
  logo?: TenantType | null;
}

export function useAppearanceSearchParams() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateAppearanceParams = useCallback(
    (updates: AppearanceParamUpdates) => {
      if (!pathname) {
        return;
      }

      const nextParams = new URLSearchParams(searchParams?.toString() ?? "");

      if (updates.theme !== undefined) {
        if (updates.theme) {
          nextParams.set(appearanceQueryParamKeys.theme, updates.theme);
        } else {
          nextParams.delete(appearanceQueryParamKeys.theme);
        }
      }

      if (updates.mode !== undefined) {
        if (updates.mode) {
          nextParams.set(appearanceQueryParamKeys.mode, updates.mode);
        } else {
          nextParams.delete(appearanceQueryParamKeys.mode);
        }
      }

      if (updates.logo !== undefined) {
        if (updates.logo) {
          nextParams.set(appearanceQueryParamKeys.logo, updates.logo);
        } else {
          nextParams.delete(appearanceQueryParamKeys.logo);
        }
      }

      const nextSearchString = nextParams.toString();
      const currentSearchString = searchParams?.toString() ?? "";

      if (nextSearchString === currentSearchString) {
        return;
      }

      router.replace(
        nextSearchString ? `${pathname}?${nextSearchString}` : pathname,
        { scroll: false },
      );
    },
    [pathname, router, searchParams],
  );

  return { updateAppearanceParams };
}
