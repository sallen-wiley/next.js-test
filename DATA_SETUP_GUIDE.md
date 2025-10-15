# Data Integration Setup Guide

This guide walks you through setting up real data integration with Supabase for your Next.js prototype app.

## Quick Start (Using Mock Data)

Your app is already working with mock data! No additional setup required.

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Visit the data demo page:**
   - Go to `http://localhost:3001` (or whatever port Next.js is using)
   - Click "Real Data Demo"
   - You'll see mock articles with search, pagination, and filtering

## Setting Up Real Data with Supabase

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → Sign up
3. Create a new project:
   - **Name**: "nextjs-test-data" (or your choice)
   - **Database Password**: Use a strong password
   - **Region**: Choose closest to you

### Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `database/schema.sql`
4. Click "Run" to create tables and insert sample data

### Step 3: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefg.supabase.co`)
   - **Anon key** (starts with `eyJ...`)

### Step 4: Update Environment Variables

1. Update your `.env.local` file:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   USE_MOCK_DATA=false
   ```

2. Restart your development server:
   ```bash
   npm run dev
   ```

### Step 5: Verify Real Data

1. Visit your data demo page
2. You should now see real data from Supabase
3. Try searching and filtering - it should work with the actual database

## Files You Created

- `src/lib/supabase.ts` - Supabase client configuration
- `src/hooks/useApi.ts` - Custom hooks for data fetching
- `src/services/dataService.ts` - Mock data service
- `src/app/api/articles/route.ts` - API route for articles
- `src/app/data-demo/page.tsx` - Demo page showing real data integration
- `database/schema.sql` - Database schema for Supabase

## Features Implemented

✅ **Mock Data Mode** - Works without any external services
✅ **Real Data Mode** - Integrates with Supabase when configured
✅ **Search & Filtering** - Search by title/abstract, filter by status
✅ **Pagination** - Handle large datasets efficiently
✅ **Loading States** - Proper loading and error handling
✅ **TypeScript Support** - Fully typed throughout
✅ **Responsive Design** - Works on all screen sizes

## Next Steps

1. **Add Authentication** - Implement user login/logout
2. **Real-time Updates** - Use Supabase subscriptions
3. **CRUD Operations** - Add create, update, delete functionality
4. **File Uploads** - Handle document attachments
5. **Advanced Filtering** - Date ranges, author filters, etc.

## Troubleshooting

**Port Issues**: If port 3000 is in use, Next.js will use 3001 automatically.

**TypeScript Errors**: Run `npm run build` to check for any remaining type issues.

**Supabase Connection**: Check your environment variables and ensure your Supabase project is active.

**Mock vs Real Data**: Toggle `USE_MOCK_DATA` in `.env.local` to switch between modes.
