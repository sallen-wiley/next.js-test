import "@/themes/types";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LogoProvider } from "@/contexts/LogoContext";
import FabThemeSwitcher from "@/components/app/FabThemeSwitcher";
import AuthWrapper from "@/components/auth/AuthWrapper";

export const metadata = {
  title: "Material UI App",
  description: "Next.js application with Material UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider>
          <ThemeProvider defaultTheme="wiley">
            <LogoProvider defaultTenant="wiley">
              <CssBaseline />
              <AuthWrapper>
                {children}
                <FabThemeSwitcher />
              </AuthWrapper>
            </LogoProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
