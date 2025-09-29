import "@/themes/types";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { ThemeProvider } from "@/contexts/ThemeContext";
import FabThemeSwitcher from "@/components/app/FabThemeSwitcher";

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
            <CssBaseline />
            {children}
            <FabThemeSwitcher />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
