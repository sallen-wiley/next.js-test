import GlobalHeader from "@/components/app/GlobalHeader";

export default function WoaaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GlobalHeader
        logoAffix="Open Access Accounts"
        fixed={false}
        containerProps={{ maxWidth: false }}
      />
      <main style={{ marginTop: 80 }}>{children}</main>
    </>
  );
}
