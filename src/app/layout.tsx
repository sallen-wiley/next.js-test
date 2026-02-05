import "@/themes/types";

// import Script from "next/script";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LogoProvider } from "@/contexts/LogoContext";
import { HeaderProvider } from "@/contexts/HeaderContext";
import { AdminActionsProvider } from "@/contexts/AdminActionsContext";
import FabThemeSwitcher from "@/components/app/FabThemeSwitcher";
import AdminActionsFab from "@/components/app/AdminActionsFab";
import GlobalHeaderWrapper from "@/components/app/GlobalHeaderWrapper";
import AuthWrapper from "@/components/auth/AuthWrapper";

export const metadata = {
  title: "Publishing Platforms UX Test Ground",
  description:
    "Explore, design, and test publishing solutions with real-world visuals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* LogRocket Scripts */}
        {/* <Script
          src="https://cdn.lgrckt-in.com/LogRocket.min.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Script id="logrocket-init" strategy="beforeInteractive">
          {`window.LogRocket && window.LogRocket.init('p5tsjd/ppux-test');`}
        </Script> */}

        <InitColorSchemeScript attribute="data" />
        <AppRouterCacheProvider>
          <ThemeProvider defaultTheme="researchexchange">
            <LogoProvider defaultTenant="wiley2025">
              <CssBaseline />
              <AuthWrapper>
                <HeaderProvider>
                  <AdminActionsProvider>
                    <GlobalHeaderWrapper />
                    {children}
                    <FabThemeSwitcher />
                    <AdminActionsFab />
                  </AdminActionsProvider>
                </HeaderProvider>
              </AuthWrapper>
            </LogoProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
