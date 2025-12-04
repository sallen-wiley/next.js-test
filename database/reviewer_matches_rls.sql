-- Enable write operations for reviewer_manuscript_matches table
-- This allows authenticated users to add, update, and delete reviewer matches

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON reviewer_manuscript_matches;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON reviewer_manuscript_matches;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON reviewer_manuscript_matches;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON reviewer_manuscript_matches;

-- Create comprehensive RLS policies

-- Allow all authenticated users to read
CREATE POLICY "Enable read access for all users" 
ON reviewer_manuscript_matches 
FOR SELECT 
USING (true);

-- Allow authenticated users to insert (admins, designers, editors can create matches)
CREATE POLICY "Enable insert for authenticated users" 
ON reviewer_manuscript_matches 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update match scores
CREATE POLICY "Enable update for authenticated users" 
ON reviewer_manuscript_matches 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete matches
CREATE POLICY "Enable delete for authenticated users" 
ON reviewer_manuscript_matches 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

