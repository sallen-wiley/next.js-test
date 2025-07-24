import AppClientShell from "../../../components/product/AppClientShell";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppClientShell>{children}</AppClientShell>;
}
