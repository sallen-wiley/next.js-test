"use client";
import GlobalHeader from "./GlobalHeader";
import { useHeader } from "@/contexts/HeaderContext";

export default function ConfigurableHeader() {
  const { config } = useHeader();

  return (
    <GlobalHeader
      logoAffix={config.logoAffix || "Publishing Platforms"}
      fixed={config.fixed ?? true}
      containerProps={config.containerProps || { maxWidth: false }}
      rightSlot={config.rightSlot}
      onMenuClick={config.onMenuClick}
    />
  );
}
