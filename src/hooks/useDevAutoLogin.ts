"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const DEV_EMAIL = process.env.NEXT_PUBLIC_DEV_EMAIL;
const DEV_PASSWORD = process.env.NEXT_PUBLIC_DEV_PASSWORD;

/**
 * Dev-only hook that automatically signs in using credentials stored in
 * NEXT_PUBLIC_DEV_EMAIL and NEXT_PUBLIC_DEV_PASSWORD. Fires once per mount
 * when no session exists and the app is running in development mode.
 *
 * Add to .env.local (gitignored):
 *   NEXT_PUBLIC_DEV_EMAIL=you@example.com
 *   NEXT_PUBLIC_DEV_PASSWORD=yourdevpassword
 *
 * This hook is a no-op in production (NODE_ENV !== 'development').
 */
export function useDevAutoLogin({
  enabled,
  hasUser,
  loading,
}: {
  enabled: boolean;
  hasUser: boolean;
  loading: boolean;
}) {
  const { signIn } = useAuth();
  const attempted = useRef(false);
  const [attempting, setAttempting] = useState(false);

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";

    if (
      !isDev ||
      !enabled ||
      !DEV_EMAIL ||
      !DEV_PASSWORD ||
      loading ||
      hasUser ||
      attempted.current
    ) {
      return;
    }

    attempted.current = true;
    setAttempting(true);

    signIn(DEV_EMAIL, DEV_PASSWORD)
      .then(({ error }) => {
        if (error) {
          console.warn("[dev auto-login] Failed:", error.message);
        } else {
          console.info("[dev auto-login] Signed in as", DEV_EMAIL);
        }
      })
      .finally(() => {
        setAttempting(false);
      });
  }, [enabled, hasUser, loading, signIn]);

  return { attempting };
}
