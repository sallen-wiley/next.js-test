import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if this is a password recovery flow
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Redirect to reset password page for recovery flows
        return NextResponse.redirect(new URL("/reset-password", request.url));
      }

      // Otherwise redirect to the next URL or home
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // If no code or error, redirect to login
  return NextResponse.redirect(new URL("/", request.url));
}
