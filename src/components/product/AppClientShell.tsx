"use client";
import { useState } from "react";
import GlobalHeader from "../app/GlobalHeader";
import HeaderActions from "./HeaderActions";
import NotificationCenter from "./NotificationCenter";
import AppMenuDrawer from "../app/AppMenuDrawer";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import SupportMenuFabMenu from "./SupportMenuFabMenu";
// import SupportMenu from "./SupportMenu";

export default function AppClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount] = useState(3); // Replace with your own logic if needed
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerWidth = 240;
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // Drawer is always open in permanent mode on desktop, otherwise controlled
  const drawerVariant = isDesktop ? "permanent" : "temporary";
  const drawerIsOpen = isDesktop ? true : drawerOpen;

  return (
    <Box sx={{ width: "100%" }}>
      {/* AppBar/Header - always at the top */}
      <GlobalHeader
        logoAffix="Open Access Dashboard"
        fixed={true}
        containerProps={{ maxWidth: false }}
        rightSlot={
          <HeaderActions
            onNotificationClick={() => setNotificationOpen(true)}
            unreadCount={unreadCount}
          />
        }
        onMenuClick={!isDesktop ? () => setDrawerOpen(true) : undefined}
      />
      <NotificationCenter
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
      {/* Main flex row: Drawer + Content */}
      <Box sx={{ display: "flex", width: "100%" }}>
        <AppMenuDrawer
          open={drawerIsOpen}
          onClose={() => setDrawerOpen(false)}
          variant={drawerVariant}
        />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: { md: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
          }}
        >
          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1 }}>
            {children}
          </Box>
          <SupportMenuFabMenu />
          {/* <SupportMenu /> */}
        </Box>
      </Box>
    </Box>
  );
}
