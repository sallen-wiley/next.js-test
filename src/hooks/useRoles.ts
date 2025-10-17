"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/utils/supabase/client";
import {
  UserProfile,
  UserRole,
  getRolePermissions,
  RolePermissions,
} from "@/types/roles";

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      if (!user) return;

      console.log("Attempting to fetch profile for user:", {
        id: user.id,
        email: user.email,
      });

      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        console.log("Profile fetch result:", { data, error });

        if (error) {
          // If profile doesn't exist, create it
          if (error.code === "PGRST116") {
            const { data: newProfile, error: createError } = await supabase
              .from("user_profiles")
              .insert({
                id: user.id,
                email: user.email || "",
                full_name:
                  user.user_metadata?.full_name || user.email?.split("@")[0],
                role: "guest" as UserRole,
              })
              .select()
              .single();

            if (createError) {
              setError("Failed to create user profile");
              console.error("Profile creation error:", createError);
            } else {
              setProfile(newProfile);
            }
          } else {
            // Better error logging with explicit JSON stringification
            const errorMessage = error?.message || "Unknown error";
            const errorCode = error?.code || "No code";
            const errorDetails = error?.details || "No details";

            setError(`Failed to fetch user profile: ${errorMessage}`);
            console.error("Profile fetch error:", {
              message: errorMessage,
              code: errorCode,
              details: errorDetails,
              hint: error?.hint,
              fullError: JSON.stringify(error, null, 2),
              userId: user?.id,
              userEmail: user?.email,
            });
          }
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError("Failed to load user profile");
        console.error("Profile error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, supabase]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return false;

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("id", profile.id);

      if (error) {
        console.error("Profile update error:", error);
        return false;
      }

      setProfile({ ...profile, ...updates });
      return true;
    } catch (err) {
      console.error("Profile update error:", err);
      return false;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    role: profile?.role || "guest",
    permissions: profile
      ? getRolePermissions(profile.role)
      : getRolePermissions("guest"),
  };
}

export function useRoleAccess() {
  const { profile, role, permissions } = useUserProfile();

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  const requiresRole = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!profile) return false;

    const required = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];
    return required.includes(profile.role);
  };

  const isAdmin = () => profile?.role === "admin";
  const isEditor = () => profile?.role === "editor";
  const isDesigner = () => profile?.role === "designer";
  const isProductManager = () => profile?.role === "product_manager";

  return {
    profile,
    role,
    permissions,
    hasPermission,
    requiresRole,
    isAdmin,
    isEditor,
    isDesigner,
    isProductManager,
  };
}
