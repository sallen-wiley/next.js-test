"use client";
import { useState } from "react";
import AXHeader from "@/components/product/AXHeader";
import NotificationCenter from "@/components/product/NotificationCenter";

export default function HeaderClient() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount] = useState(3); // You can replace this with your own logic

  return (
    <>
      <AXHeader
        onNotificationClick={() => setNotificationOpen(true)}
        unreadCount={unreadCount}
      />
      <NotificationCenter
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </>
  );
}
