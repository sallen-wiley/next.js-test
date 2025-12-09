-- Fix all Supabase performance and security issues
-- Run this script to resolve the advisor warnings

-- STEP 1: Fix the function security issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'guest'
    );
    RETURN NEW;
END;
$$;

-- STEP 2: Fix RLS policies - drop all existing policies first
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable admin to update any user" ON user_profiles;
DROP POLICY IF EXISTS "Enable admin read access to all users" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow admins to update any profile" ON user_profiles;

-- STEP 3: Create optimized RLS policies with proper auth function calls
-- Use (select auth.uid()) to avoid re-evaluation per row

-- Read policy - everyone can read all profiles
CREATE POLICY "read_all_profiles" ON user_profiles
    FOR SELECT TO authenticated 
    USING (true);

-- Insert policy - users can only insert their own profile
CREATE POLICY "insert_own_profile" ON user_profiles
    FOR INSERT TO authenticated 
    WITH CHECK (id = (select auth.uid()));

-- Update policy - SINGLE policy that handles both self-updates and admin updates
CREATE POLICY "update_profiles" ON user_profiles
    FOR UPDATE TO authenticated 
    USING (
        -- User can update their own profile OR user is an admin
        id = (select auth.uid()) 
        OR 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = (select auth.uid()) AND role = 'admin'
        )
    )
    WITH CHECK (
        -- Same check for WITH CHECK clause
        id = (select auth.uid()) 
        OR 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = (select auth.uid()) AND role = 'admin'
        )
    );

-- STEP 4: Verify your admin user exists and create if needed
INSERT INTO user_profiles (id, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email), 'admin' 
FROM auth.users 
WHERE email = 'sallen@wiley.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- STEP 5: Verify the setup
SELECT 'Policy fix complete!' as status;
SELECT COUNT(*) as total_policies FROM pg_policies WHERE tablename = 'user_profiles';
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'user_profiles';
SELECT email, role FROM user_profiles WHERE role = 'admin';

-- STEP 6: Test the policies
SELECT 'Testing if admin can see all profiles...' as test;
-- This should work if you're logged in as admin
SELECT COUNT(*) as profile_count FROM user_profiles;