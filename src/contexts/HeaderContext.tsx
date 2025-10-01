"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface HeaderConfig {
  logoAffix?: string;
  fixed?: boolean;
  containerProps?: {
    maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
    fixed?: boolean;
  };
  rightSlot?: ReactNode;
  onMenuClick?: () => void;
}

interface HeaderContextType {
  config: HeaderConfig;
  updateConfig: (newConfig: Partial<HeaderConfig>) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({
  children,
  defaultConfig = {},
}: {
  children: ReactNode;
  defaultConfig?: HeaderConfig;
}) {
  const [config, setConfig] = useState<HeaderConfig>(defaultConfig);

  const updateConfig = React.useCallback((newConfig: Partial<HeaderConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const contextValue = React.useMemo(
    () => ({
      config,
      updateConfig,
    }),
    [config, updateConfig]
  );

  return (
    <HeaderContext.Provider value={contextValue}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within HeaderProvider");
  }
  return context;
}

// Hook for pages to configure header
export function useHeaderConfig(config: HeaderConfig) {
  const { updateConfig } = useHeader();

  React.useEffect(() => {
    updateConfig(config);

    // Cleanup on unmount - reset to defaults
    return () => updateConfig({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    updateConfig,
    config.logoAffix,
    config.fixed,
    config.containerProps?.maxWidth,
    config.containerProps?.fixed,
    // Note: config.rightSlot and config.onMenuClick are excluded
    // as they would cause infinite re-renders due to new objects/functions
    // on every render. The config will still update with these values.
  ]);
}
