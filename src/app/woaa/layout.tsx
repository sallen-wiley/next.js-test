import AppClientShell from "../../components/product/AppClientShell";

export default function WoaaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppClientShell>{children}</AppClientShell>;
}
