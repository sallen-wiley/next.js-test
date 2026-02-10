import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/admin/users
 * Fetches all users with email confirmation status from auth.users
 * Requires admin role
 */
export async function GET() {
  try {
    // Verify admin access using the regular authenticated client
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return NextResponse.json(
        { error: "Failed to fetch profiles" },
        { status: 500 },
      );
    }

    // Try to fetch auth data if admin client is available
    const adminClient = createAdminClient();
    let authUsers = null;

    if (adminClient) {
      const { data, error: authError } =
        await adminClient.auth.admin.listUsers();
      if (authError) {
        console.error("Error fetching auth users:", authError);
        // Continue without auth data rather than failing
      } else {
        authUsers = data;
      }
    }

    // Merge auth data with profile data (if available)
    const users = profiles.map((profile) => {
      const authUser = authUsers?.users.find((u) => u.id === profile.id);
      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        is_active: profile.is_active,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        last_login: profile.last_login,
        email_confirmed_at: authUser?.email_confirmed_at || null,
        last_sign_in_at: authUser?.last_sign_in_at || null,
      };
    });

    return NextResponse.json(
      {
        users,
        hasAdminAccess: !!adminClient, // Let client know if admin features are available
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/users
 * Updates user email confirmation status
 * Requires admin role
 */
export async function PATCH(request: NextRequest) {
  try {
    // Verify admin access
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { userId, emailConfirmed } = body;

    if (!userId || typeof emailConfirmed !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Use admin client to update email confirmation status
    const adminClient = createAdminClient();

    if (!adminClient) {
      return NextResponse.json(
        {
          error:
            "Admin features unavailable. Configure SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 503 },
      );
    }

    if (emailConfirmed) {
      // Confirm the user's email
      const { data, error } = await adminClient.auth.admin.updateUserById(
        userId,
        {
          email_confirm: true,
        },
      );

      if (error) {
        console.error("Error confirming email:", error);
        return NextResponse.json(
          { error: "Failed to confirm email" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Email confirmed",
        user: data.user,
      });
    } else {
      // Unconfirm the user's email by setting email_confirmed_at to null
      // This requires a direct database update since the admin API doesn't have an "unconfirm" method
      const { error } = await adminClient
        .from("auth.users")
        .update({ email_confirmed_at: null })
        .eq("id", userId);

      if (error) {
        console.error("Error unconfirming email:", error);
        return NextResponse.json(
          { error: "Failed to unconfirm email" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Email confirmation removed",
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
