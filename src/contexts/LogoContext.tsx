"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { TenantType } from "@/components/product/PrimaryLogo";

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
  const availableTenants: TenantType[] = ["wiley", "sage", "ieee", "default"];

  // Load tenant preference from localStorage on mount
  useEffect(() => {
    const savedTenant = localStorage.getItem("app-logo-tenant") as TenantType;
    if (savedTenant && availableTenants.includes(savedTenant)) {
      setCurrentTenant(savedTenant);
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
    <LogoContext.Provider value={contextValue}>
      {children}
    </LogoContext.Provider>
  );
};