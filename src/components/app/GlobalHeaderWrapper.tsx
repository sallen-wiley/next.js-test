"use client";
import React from "react";
import GlobalHeader from "./GlobalHeader";
import { useHeader } from "@/contexts/HeaderContext";

/**
 * GlobalHeaderWrapper component integrates GlobalHeader with HeaderContext
 * This allows pages to configure the header via useHeaderConfig hook
 */
const GlobalHeaderWrapper: React.FC = () => {
  const { config } = useHeader();

  // If hideHeader is true, don't render the header
  if (config.hideHeader) {
    return null;
  }

  return <GlobalHeader {...config} />;
};

export default GlobalHeaderWrapper;
