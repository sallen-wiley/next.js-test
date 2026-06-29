"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { TenantType } from "@/components/product/logos/types";
import type { ColorMode, ThemeName } from "@/contexts/ThemeContext";

export interface AppearancePinnedParams {
  theme: boolean;
  mode: boolean;
  logo: boolean;
}

export interface PendingAppearanceSync {
  active: boolean;
  theme?: ThemeName;
  mode?: ColorMode;
  logo?: TenantType;
}

type PendingAppearanceUpdates = Partial<Omit<PendingAppearanceSync, "active">>;

interface AppearanceUrlSyncContextType {
  pinned: AppearancePinnedParams;
  pinParams: (updates: Partial<AppearancePinnedParams>) => void;
  pending: PendingAppearanceSync;
  beginPendingSync: (updates: PendingAppearanceUpdates) => void;
  clearPendingSync: () => void;
}

const defaultPinnedState: AppearancePinnedParams = {
  theme: false,
  mode: false,
  logo: false,
};

const defaultPendingState: PendingAppearanceSync = {
  active: false,
};

const AppearanceUrlSyncContext = createContext<AppearanceUrlSyncContextType>({
  pinned: defaultPinnedState,
  pinParams: () => {},
  pending: defaultPendingState,
  beginPendingSync: () => {},
  clearPendingSync: () => {},
});

interface AppearanceUrlSyncProviderProps {
  children: React.ReactNode;
}

export const AppearanceUrlSyncProvider: React.FC<
  AppearanceUrlSyncProviderProps
> = ({ children }) => {
  const [pinned, setPinned] =
    useState<AppearancePinnedParams>(defaultPinnedState);
  const [pending, setPending] =
    useState<PendingAppearanceSync>(defaultPendingState);

  const pinParams = useCallback((updates: Partial<AppearancePinnedParams>) => {
    setPinned((current) => {
      const nextState: AppearancePinnedParams = {
        theme: current.theme || Boolean(updates.theme),
        mode: current.mode || Boolean(updates.mode),
        logo: current.logo || Boolean(updates.logo),
      };

      if (
        nextState.theme === current.theme &&
        nextState.mode === current.mode &&
        nextState.logo === current.logo
      ) {
        return current;
      }

      return nextState;
    });
  }, []);

  const beginPendingSync = useCallback((updates: PendingAppearanceUpdates) => {
    setPending((current) => {
      const nextState: PendingAppearanceSync = {
        active: true,
        theme: updates.theme,
        mode: updates.mode,
        logo: updates.logo,
      };

      if (
        current.active === nextState.active &&
        current.theme === nextState.theme &&
        current.mode === nextState.mode &&
        current.logo === nextState.logo
      ) {
        return current;
      }

      return nextState;
    });
  }, []);

  const clearPendingSync = useCallback(() => {
    setPending((current) => {
      if (!current.active) {
        return current;
      }

      return defaultPendingState;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      pinned,
      pinParams,
      pending,
      beginPendingSync,
      clearPendingSync,
    }),
    [beginPendingSync, clearPendingSync, pending, pinParams, pinned],
  );

  return (
    <AppearanceUrlSyncContext.Provider value={contextValue}>
      {children}
    </AppearanceUrlSyncContext.Provider>
  );
};

export const useAppearanceUrlSync = () => useContext(AppearanceUrlSyncContext);
