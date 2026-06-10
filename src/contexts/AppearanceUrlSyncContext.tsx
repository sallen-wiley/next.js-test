"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface AppearancePinnedParams {
  theme: boolean;
  mode: boolean;
  logo: boolean;
}

interface AppearanceUrlSyncContextType {
  pinned: AppearancePinnedParams;
  pinParams: (updates: Partial<AppearancePinnedParams>) => void;
}

const defaultPinnedState: AppearancePinnedParams = {
  theme: false,
  mode: false,
  logo: false,
};

const AppearanceUrlSyncContext = createContext<AppearanceUrlSyncContextType>({
  pinned: defaultPinnedState,
  pinParams: () => {},
});

interface AppearanceUrlSyncProviderProps {
  children: React.ReactNode;
}

export const AppearanceUrlSyncProvider: React.FC<
  AppearanceUrlSyncProviderProps
> = ({ children }) => {
  const [pinned, setPinned] =
    useState<AppearancePinnedParams>(defaultPinnedState);

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

  const contextValue = useMemo(
    () => ({
      pinned,
      pinParams,
    }),
    [pinned, pinParams],
  );

  return (
    <AppearanceUrlSyncContext.Provider value={contextValue}>
      {children}
    </AppearanceUrlSyncContext.Provider>
  );
};

export const useAppearanceUrlSync = () => useContext(AppearanceUrlSyncContext);
