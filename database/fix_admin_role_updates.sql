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

SELECT 'Admin role update policies added successfully!' as status;