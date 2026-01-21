"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { TenantType } from "@/components/product/logos/types";

// Logo context interface
interface LogoContextType {
  currentTenant: TenantType;
  setTenant: (tenant: TenantType) => void;
  availableTenants: TenantType[];
}

// Create the context
const LogoContext = createContext<LogoContextType | undefined>(undefined);

// Hook to use the logo context
export const useLogoContext = () => {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error("useLogoContext must be used within a LogoProvider");
  }
  return context;
};

// Logo provider component
interface LogoProviderProps {
  children: React.ReactNode;
  defaultTenant?: TenantType;
}

export const LogoProvider: React.FC<LogoProviderProps> = ({
  children,
  defaultTenant = "default",
}) => {
  const [currentTenant, setCurrentTenant] = useState<TenantType>(defaultTenant);

  // Available tenant options
  const availableTenants: TenantType[] = [
    "wiley",
    "wiley2025",
    "sage",
    "ieee",
    "re-light-stacked",
    "re-bold-stacked",
    "re-light-allcaps",
    "re-bold-allcaps",
    "re-bold",
    "default",
  ];

  // Load tenant preference from localStorage on mount
  useEffect(() => {
    const savedTenant = localStorage.getItem("app-logo-tenant");

    // Migrate old "researchexchange" value to "re-light-stacked"
    if (savedTenant === "researchexchange") {
      setCurrentTenant("re-light-stacked");
      localStorage.setItem("app-logo-tenant", "re-light-stacked");
    } else if (
      savedTenant &&
      availableTenants.includes(savedTenant as TenantType)
    ) {
      setCurrentTenant(savedTenant as TenantType);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save tenant to localStorage when it changes
  const setTenant = (tenant: TenantType) => {
    setCurrentTenant(tenant);
    localStorage.setItem("app-logo-tenant", tenant);
  };

  const contextValue: LogoContextType = {
    currentTenant,
    setTenant,
    availableTenants,
  };

  return (
    <LogoContext.Provider value={contextValue}>{children}</LogoContext.Provider>
  );
};
