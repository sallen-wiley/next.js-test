# Creating Test Users for Your Demo

## Option 1: Simple Manual Creation (Recommended for Testing)

The easiest way to create test users is directly in the Supabase dashboard:

### Steps:

1. Go to [your Supabase dashboard](https://supabase.com/dashboard/project/rofjxefqomndhyrassig)
2. Navigate to **Authentication > Users**
3. Click **"Add user"**
4. Create users with simple emails and passwords:

```
Email: designer@test.com
Password: test1234

Email: product@test.com
Password: test1234

Email: reviewer@test.com
Password: test1234
```

### Share Credentials

Simply send these credentials to your team via Slack, email, or however you normally communicate:

> **Test App Access**
>
> URL: https://your-app.vercel.app
>
> **Login Credentials:**
>
> - Designer: `designer@test.com` / `test1234`
> - Product Manager: `product@test.com` / `test1234`
> - Reviewer: `reviewer@test.com` / `test1234`

## Option 2: Admin Interface (Built-in)

I've created an admin interface for you at `/admin` that can create users programmatically:

1. Set `ENABLE_AUTH=true` in your `.env.local`
2. Visit `http://localhost:3000/admin`
3. Use the "Create Test User" interface

## Option 3: Quick Environment Toggle

For development, you can still bypass auth entirely:

```bash
# In .env.local
NEXT_PUBLIC_ENABLE_AUTH=false    # No login required
NEXT_PUBLIC_ENABLE_AUTH=true     # Requires Supabase login
```

## Current Settings

```bash
# Your current .env.local
NEXT_PUBLIC_ENABLE_AUTH=true                   # Auth enabled
NEXT_PUBLIC_AUTH_TYPE=supabase                # Uses Supabase when enabled
USE_MOCK_DATA=false                           # Using real Supabase data
```

## Recommendation

For your demo, I'd suggest:

1. **Start with auth disabled** (`NEXT_PUBLIC_ENABLE_AUTH=false`) for initial testing
2. **Create 3-4 test accounts** manually in Supabase dashboard
3. **Enable auth** (`NEXT_PUBLIC_ENABLE_AUTH=true`) when you want to demo user management
4. **Share simple credentials** with your team via your usual communication method

The manual approach in the Supabase dashboard is actually faster than building user management features, and perfect for testing/demo scenarios!
