"use client";
import { HeaderProvider } from "@/contexts/HeaderContext";
import ConfigurableHeader from "@/components/app/ConfigurableHeader";

export default function WoaaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderProvider
      defaultConfig={{
        logoAffix: "Open Access Accounts",
        fixed: false,
      }}
    >
      <ConfigurableHeader />
      <main>{children}</main>
    </HeaderProvider>
  );
}
