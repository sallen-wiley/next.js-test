"use client";
import AppClientShell from "../../../components/product/AppClientShell";
import { useHeaderConfig } from "@/contexts/HeaderContext";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Opt out of global header - AppClientShell has its own GlobalHeader
  useHeaderConfig({ hideHeader: true });

  return <AppClientShell>{children}</AppClientShell>;
}
