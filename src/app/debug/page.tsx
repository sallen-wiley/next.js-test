"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DebugPage() {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const { user } = useAuth();
  const supabase = createClient();

  const runDatabaseTests = async () => {
    setLoading(true);
    setTestResults([]);
    const results: string[] = [];

    // Test 1: Basic connection
    try {
      const { error } = await supabase
        .from("manuscripts")
        .select("count")
        .limit(1);
      results.push(
        error
          ? `❌ Connection Failed: ${error.message}`
          : "✅ Supabase connected"
      );
    } catch {
      results.push("❌ Connection Error: Cannot reach Supabase");
    }

    // Test 2: Check user_profiles table
    try {
      const { error } = await supabase
        .from("user_profiles")
        .select("count")
        .limit(1);
      results.push(
        error
          ? `❌ user_profiles table: ${error.message}`
          : "✅ user_profiles table exists"
      );
    } catch {
      results.push("❌ user_profiles table: Does not exist or no access");
    }

    // Test 3: Current user
    if (user) {
      results.push(
        `✅ User authenticated: ${user.email} (ID: ${user.id.slice(0, 8)}...)`
      );

      // Test 4: Try to fetch user profile
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          results.push(
            `❌ Profile fetch failed: ${error.message} (Code: ${error.code})`
          );
          if (error.code === "PGRST116") {
            results.push(
              "💡 This means no profile exists - need to run role_system_update.sql"
            );
          }
        } else {
          results.push(`✅ Profile found: Role = ${data.role}`);
        }
      } catch {
        results.push("❌ Profile fetch error: Unexpected error");
      }
    } else {
      results.push("❌ No authenticated user");
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Database Debug Page
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
        Use this page to diagnose database connection and role system issues.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={runDatabaseTests}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Testing..." : "Run Database Tests"}
        </Button>
      </Box>

      {testResults.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Test Results
          </Typography>
          {testResults.map((result, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{
                fontFamily: "monospace",
                mb: 1,
                color: result.startsWith("❌")
                  ? "error.main"
                  : result.startsWith("💡")
                  ? "warning.main"
                  : "success.main",
              }}
            >
              {result}
            </Typography>
          ))}
        </Paper>
      )}

      {testResults.some((r) => r.includes("role_system_update.sql")) && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Action Required:</strong> It looks like the user_profiles
            table hasn&apos;t been created yet.
            <br />
            <br />
            <strong>To fix this:</strong>
            <br />
            1. Go to your{" "}
            <a
              href="https://supabase.com/dashboard/project/rofjxefqomndhyrassig"
              target="_blank"
              rel="noopener"
            >
              Supabase Dashboard
            </a>
            <br />
            2. Navigate to SQL Editor
            <br />
            3. Copy and paste the contents of{" "}
            <code>database/role_system_update.sql</code>
            <br />
            4. Click Run
            <br />
            5. Come back and test again
          </Typography>
        </Alert>
      )}
    </Container>
  );
}
