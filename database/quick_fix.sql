-- Simple Fix: Remove Problematic RLS Policies
-- This is the quickest fix for the infinite recursion issue

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Enable read access for authenticated users" ON user_profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON user_profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for own profile" ON user_profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create your admin profile right now
INSERT INTO user_profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    'admin'
FROM auth.users 
WHERE email = 'sallen@wiley.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

SELECT 'RLS fixed and admin profile created for sallen@wiley.com' as status;