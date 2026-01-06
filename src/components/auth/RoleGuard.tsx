"use client";

import React from "react";
import { Typography, Paper } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import WarningIcon from "@mui/icons-material/Warning";
import { useRoleAccess } from "@/hooks/useRoles";
import { UserRole, RolePermissions } from "@/types/roles";
import AdminLoadingState from "./AdminLoadingState";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: keyof RolePermissions;
  fallback?: React.ReactNode;
  showFallback?: boolean;
  /** Skip permission check if already verified (for performance optimization) */
  skipCheck?: boolean;
  /** Pass already-loaded permissions to avoid redundant hook call */
  permissions?: RolePermissions;
  /** Pass already-loaded profile to avoid redundant hook call */
  profile?: { role: UserRole } | null;
}

export default function RoleGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback,
  showFallback = true,
  skipCheck = false,
  permissions: providedPermissions,
  profile: providedProfile,
}: RoleGuardProps) {
  // Always call hook (React rules), but use provided values when skipCheck is true
  const { profile, hasPermission, requiresRole, loading, permissions } =
    useRoleAccess();

  // Use provided values if available (when skipCheck is true), otherwise use hook values
  const effectiveProfile = providedProfile ?? profile;
  const effectivePermissions = providedPermissions ?? permissions;

  // Wait for permissions to load before checking (unless skipCheck is true)
  // Show loading state instead of null to prevent blank screen
  if (!skipCheck && loading) {
    return <AdminLoadingState message="Checking permissions..." />;
  }

  // If skipCheck is true, we assume permissions are already verified
  // Skip the loading check and use provided permissions/profile directly
  if (skipCheck) {
    // Quick check using provided permissions/profile
    if (requiredRole) {
      const userRole = effectiveProfile?.role;
      const roleArray = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];
      if (!userRole || !roleArray.includes(userRole)) {
        if (!showFallback) return null;
        return (
          fallback || (
            <Paper
              sx={{ p: 3, textAlign: "center", bgcolor: "warning.lighter" }}
            >
              <LockIcon sx={{ fontSize: 48, color: "warning.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Access Restricted
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This feature requires{" "}
                {Array.isArray(requiredRole)
                  ? requiredRole.join(" or ")
                  : requiredRole}{" "}
                access.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Your current role: <strong>{userRole || "guest"}</strong>
              </Typography>
            </Paper>
          )
        );
      }
    }

    if (
      requiredPermission &&
      effectivePermissions &&
      !effectivePermissions[requiredPermission]
    ) {
      if (!showFallback) return null;
      return (
        fallback || (
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "error.lighter" }}>
            <WarningIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Permission Required
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You don&apos;t have permission to access this feature.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Required: <strong>{requiredPermission}</strong>
            </Typography>
          </Paper>
        )
      );
    }

    // Permission check passed, render children
    return <>{children}</>;
  }

  // Check role requirement
  if (requiredRole && !requiresRole(requiredRole)) {
    if (!showFallback) return null;

    return (
      fallback || (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "warning.lighter" }}>
          <LockIcon sx={{ fontSize: 48, color: "warning.main", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Access Restricted
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This feature requires{" "}
            {Array.isArray(requiredRole)
              ? requiredRole.join(" or ")
              : requiredRole}{" "}
            access.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Your current role: <strong>{profile?.role || "guest"}</strong>
          </Typography>
        </Paper>
      )
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (!showFallback) return null;

    return (
      fallback || (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "error.lighter" }}>
          <WarningIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Permission Required
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don&apos;t have permission to access this feature.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Required: <strong>{requiredPermission}</strong>
          </Typography>
        </Paper>
      )
    );
  }

  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard requiredRole="admin" fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function EditorOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard requiredRole={["admin", "editor"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function StaffOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard
      requiredRole={["admin", "editor", "designer", "product_manager"]}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}
