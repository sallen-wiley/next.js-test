-- STEP 1: First run the admin policies
-- Fix: Allow admins to update other users' roles
-- This adds a policy that allows admins to update any user's role

-- Add policy for admins to manage other users
CREATE POLICY "Enable admin to update any user" ON user_profiles
    FOR UPDATE TO authenticated 
    USING (
        -- Admin can update anyone
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        -- Admin can update anyone  
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Also add a policy for admins to read all users (if not already exists)
CREATE POLICY "Enable admin read access to all users" ON user_profiles
    FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- STEP 2: Make yourself an admin (REPLACE WITH YOUR EMAIL)
-- Check what users exist first
SELECT id, email, role FROM user_profiles;

-- If your profile doesn't exist, check auth.users
SELECT id, email FROM auth.users;

-- Create profile if missing (replace with your actual email)
INSERT INTO user_profiles (id, email, full_name, role)
SELECT id, email, email, 'admin' 
FROM auth.users 
WHERE email = 'your-email@domain.com'
AND id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Or just update existing profile to admin (replace with your actual email)
UPDATE user_profiles SET role = 'admin' WHERE email = 'your-email@domain.com';

-- STEP 3: Verify the admin user was created
SELECT id, email, role FROM user_profiles WHERE role = 'admin';

SELECT 'Setup complete! Check the results above.' as status;