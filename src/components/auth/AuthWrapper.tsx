"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "./AuthProvider";
import SupabaseAuth from "./SupabaseAuth";
import FullPageLoader from "../app/FullPageLoader";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const PUBLIC_EXACT_PATHS = new Set([
  "/",
  "/kitchen-sink",
  "/wiley-copyeditor",
  "/experiments/workflow-builder",
  "/reset-password",
]);

const PUBLIC_PREFIX_PATHS = ["/onboarding-demos", "/woaa"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT_PATHS.has(pathname)) {
    return true;
  }

  return PUBLIC_PREFIX_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// Component that shows auth UI or children based on auth state
function AuthContent({
  children,
  enableAuth,
}: AuthWrapperProps & { enableAuth: boolean }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  // When auth is disabled, always render app content.
  if (!enableAuth) {
    return <>{children}</>;
  }

  const routePath = pathname || "/";

  // Public routes remain accessible without authentication.
  if (isPublicPath(routePath)) {
    return <>{children}</>;
  }

  if (loading) {
    return <FullPageLoader message="Authenticating..." />;
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
  const [mounted, setMounted] = useState(false);
  const enableAuth = process.env.NEXT_PUBLIC_ENABLE_AUTH === "true";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  // Always mount AuthProvider so auth/role hooks remain safe in public routes.
  return (
    <AuthProvider>
      <AuthContent enableAuth={enableAuth}>{children}</AuthContent>
    </AuthProvider>
  );
}
