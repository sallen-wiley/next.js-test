import GlobalHeader from "@/components/app/GlobalHeader";

export default function WoaaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalHeader
        logoAffix="WOAA Product"
        fixed={true}
        containerProps={{ maxWidth: "lg" }}
      />
      <main style={{ marginTop: 80 }}>{children}</main>
    </>
  );
}
