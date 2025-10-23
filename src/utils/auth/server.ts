import { createClient } from "@/utils/supabase/server";
import { UserRole } from "@/types/roles";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Get the authenticated user and their profile from the server-side request
 */
export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient();

    // Get the current user from the session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("No authenticated user found:", userError?.message);
      return null;
    }

    // Get the user profile to access their role
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.log("No user profile found:", profileError?.message);
      return null;
    }

    return {
      id: user.id,
      email: user.email || "",
      role: profile.role as UserRole,
    };
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}

/**
 * Check if the current user has one of the required roles
 */
export async function hasRequiredRole(
  requiredRoles: UserRole[]
): Promise<{ authorized: boolean; user: AuthUser | null }> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { authorized: false, user: null };
  }

  const authorized = requiredRoles.includes(user.role);
  return { authorized, user };
}

/**
 * Check if the current user can perform write operations (admin or designer)
 */
export async function canWrite(): Promise<{
  authorized: boolean;
  user: AuthUser | null;
}> {
  return hasRequiredRole(["admin", "designer"]);
}

/**
 * Check if the current user can perform delete operations (admin or designer)
 */
export async function canDelete(): Promise<{
  authorized: boolean;
  user: AuthUser | null;
}> {
  return hasRequiredRole(["admin", "designer"]);
}
