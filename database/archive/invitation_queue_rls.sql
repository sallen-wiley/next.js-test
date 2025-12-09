-- Migration: Add RLS policies for invitation_queue write operations
-- Purpose: Allow authenticated users to manage invitation queue
-- Date: 2025-12-04

-- Drop existing read-only policy (will recreate with proper scope)
DROP POLICY IF EXISTS "Enable read access for all users" ON invitation_queue;

-- RLS Policy: Authenticated users can read all queue items
CREATE POLICY "Authenticated users can view queue" ON invitation_queue
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policy: Authenticated users can insert to queue
CREATE POLICY "Authenticated users can insert to queue" ON invitation_queue
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policy: Authenticated users can update queue items
CREATE POLICY "Authenticated users can update queue" ON invitation_queue
    FOR UPDATE 
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policy: Authenticated users can delete from queue
CREATE POLICY "Authenticated users can delete from queue" ON invitation_queue
    FOR DELETE 
    USING (auth.uid() IS NOT NULL);

-- Optional: Add the same policies for review_invitations if needed
DROP POLICY IF EXISTS "Enable read access for all users" ON review_invitations;

CREATE POLICY "Authenticated users can view invitations" ON review_invitations
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert invitations" ON review_invitations
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update invitations" ON review_invitations
    FOR UPDATE 
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete invitations" ON review_invitations
    FOR DELETE 
    USING (auth.uid() IS NOT NULL);

-- Verify policies are active
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('invitation_queue', 'review_invitations')
ORDER BY tablename, policyname;
