-- Enable role-based write operations for manuscripts table
-- This script adds policies that restrict write operations to admin and designer roles only

-- Drop existing policies if they exist (both old and new names)
DROP POLICY IF EXISTS "Enable insert for all users" ON manuscripts;
DROP POLICY IF EXISTS "Enable update for all users" ON manuscripts;
DROP POLICY IF EXISTS "Enable delete for all users" ON manuscripts;
DROP POLICY IF EXISTS "Enable insert for admin and designer" ON manuscripts;
DROP POLICY IF EXISTS "Enable update for admin and designer" ON manuscripts;
DROP POLICY IF EXISTS "Enable delete for admin and designer" ON manuscripts;

-- Create role-based write policies for manuscripts table
CREATE POLICY "Enable insert for admin and designer" ON manuscripts
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'designer') AND is_active = true
  )
);

CREATE POLICY "Enable update for admin and designer" ON manuscripts
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'designer') AND is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'designer') AND is_active = true
  )
);

CREATE POLICY "Enable delete for admin and designer" ON manuscripts
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'designer') AND is_active = true
  )
);

-- Add similar policies for potential_reviewers table
DROP POLICY IF EXISTS "Enable insert for all users" ON potential_reviewers;
DROP POLICY IF EXISTS "Enable update for all users" ON potential_reviewers;
DROP POLICY IF EXISTS "Enable delete for all users" ON potential_reviewers;
DROP POLICY IF EXISTS "Enable insert for admin and designer" ON potential_reviewers;
DROP POLICY IF EXISTS "Enable update for admin and designer" ON potential_reviewers;
DROP POLICY IF EXISTS "Enable delete for admin and designer" ON potential_reviewers;

CREATE POLICY "Enable insert for admin and designer" ON potential_reviewers
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'designer') AND is_active = true
  )
);

CREATE POLICY "Enable update for admin and designer" ON potential_reviewers
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'designer') AND is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'designer') AND is_active = true
  )
);

CREATE POLICY "Enable delete for admin and designer" ON potential_reviewers
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'designer') AND is_active = true
  )
);

-- Note: These policies ensure that only users with admin or designer roles can:
-- 1. Create new manuscripts/reviewers
-- 2. Update existing records
-- 3. Delete records
-- 
-- All users can still read data (via existing read policies)
-- The is_active = true check ensures only active users can perform write operations