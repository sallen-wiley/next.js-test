# Password Reset Setup Guide

## Implementation Complete ✅

Your Next.js app now has full password reset functionality integrated with Supabase Auth and Material-UI theming.

## What Was Added

### 1. Environment Variable
**File: `.env.local`**
- Added `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- Used for password reset redirect URLs

### 2. Auth Callback Route Handler
**File: `src/app/auth/callback/route.ts`**
- Handles Supabase auth code exchange
- Redirects to `/reset-password` for recovery flows
- Compatible with your existing SSR setup using `@supabase/ssr`

### 3. Reset Password Page
**File: `src/app/reset-password/page.tsx`**
- Material-UI styled password reset form
- Session validation before allowing password reset
- Password confirmation validation
- Auto-redirect to home after successful reset
- Uses MUI components: Container, Paper, TextField, Button, Alert

### 4. Enhanced AuthProvider
**File: `src/components/auth/AuthProvider.tsx`**
- Added `resetPasswordForEmail()` method
- Added `updatePassword()` method
- Both methods integrated with existing auth context

### 5. Updated Sign-In Component
**File: `src/components/auth/SupabaseAuth.tsx`**
- Added "Forgot Password" tab (3rd tab)
- Integrated password reset email trigger
- Success/error handling with MUI Alerts
- Consistent styling with your existing theme

## User Flow

1. **User clicks "Forgot Password" tab** → enters email
2. **Supabase sends email** with magic link to `/auth/callback?code=...`
3. **Callback route exchanges code** for session → redirects to `/reset-password`
4. **User enters new password** → password is updated
5. **User redirected to home** → can sign in with new password

## Supabase Dashboard Configuration Required

### 1. Navigate to Authentication → URL Configuration

Add these redirect URLs:
- `http://localhost:3000/auth/callback`
- `http://localhost:3000/reset-password`

When deploying to production, also add:
- `https://yourdomain.com/auth/callback`
- `https://yourdomain.com/reset-password`

### 2. Update Email Template (Optional but Recommended)

Navigate to: **Authentication → Email Templates → Reset Password**

Change the confirmation URL to:
```
{{ .SiteURL }}/auth/callback?code={{ .TokenHash }}&type=recovery
```

This ensures the magic link points to your callback handler.

## Testing

1. Start your dev server: `npm run dev`
2. Navigate to your sign-in page
3. Click "Forgot Password" tab
4. Enter an email address registered in Supabase
5. Check your email for the reset link
6. Click the link → should redirect to reset password page
7. Enter new password → should redirect to home

## Production Deployment

Before deploying to production:

1. **Update `.env.local` or Vercel environment variables:**
   ```
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. **Add production URLs to Supabase dashboard:**
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: Add both callback and reset-password URLs

## Security Notes

- Password reset links expire based on Supabase settings (default: 1 hour)
- Session validation ensures only users with valid recovery sessions can reset
- Passwords must be minimum 6 characters (enforced client and server-side)
- All routes use your existing SSR-compatible Supabase setup
- Rate limiting is handled by Supabase Auth

## Troubleshooting

**Link doesn't work?**
- Check Supabase dashboard redirect URLs are configured
- Verify `NEXT_PUBLIC_SITE_URL` matches your domain
- Check email template uses `/auth/callback` endpoint

**Session invalid error?**
- User may have clicked expired link (check Supabase token expiry settings)
- Ensure callback route successfully exchanges code for session

**Password doesn't update?**
- Check browser console for errors
- Verify user has valid session in reset-password page
- Ensure password meets minimum requirements (6+ characters)

## Compatible Packages

This implementation uses:
- `@supabase/ssr` (your existing setup)
- `@supabase/supabase-js` (via your client wrapper)
- Material-UI v7 (matching your theme system)
- Next.js App Router (compatible with Next.js 15.3.2)
