"use client";
import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthProvider";
import SupabaseAuth from "./SupabaseAuth";

interface AuthWrapperProps {
  children: React.ReactNode;
}

// Component that shows auth UI or children based on auth state
function AuthContent({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div>Loading...not mounted</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (!user) {
    return <SupabaseAuth />;
  }

  // User is authenticated
  return <>{children}</>;
}

// Main auth wrapper that conditionally enables authentication
export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [enableAuth, setEnableAuth] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEnableAuth(process.env.NEXT_PUBLIC_ENABLE_AUTH === "true");
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div>Loading...</div>;
  }

  // If auth is disabled, just render children
  if (!enableAuth) {
    return <>{children}</>;
  }

  // Auth is enabled, wrap with provider and auth logic
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  );
}
