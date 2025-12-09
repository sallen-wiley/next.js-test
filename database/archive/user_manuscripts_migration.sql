-- Migration: Add user_manuscripts junction table
-- Purpose: Link users to manuscripts for reviewer dashboard workflow
-- Date: 2025-12-04

-- Create user_manuscripts junction table
CREATE TABLE IF NOT EXISTS user_manuscripts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    manuscript_id UUID REFERENCES manuscripts(id) ON DELETE CASCADE NOT NULL,
    assigned_date TIMESTAMPTZ DEFAULT NOW(),
    role TEXT CHECK (role IN ('editor', 'author', 'collaborator', 'reviewer')) DEFAULT 'editor',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, manuscript_id)
);

-- Create index for faster lookups
CREATE INDEX idx_user_manuscripts_user_id ON user_manuscripts(user_id);
CREATE INDEX idx_user_manuscripts_manuscript_id ON user_manuscripts(manuscript_id);
CREATE INDEX idx_user_manuscripts_active ON user_manuscripts(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE user_manuscripts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own manuscript assignments
CREATE POLICY "Users can view own manuscript assignments" ON user_manuscripts
    FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Admins and editors can view all assignments
CREATE POLICY "Admins and editors can view all assignments" ON user_manuscripts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'editor')
            AND is_active = true
        )
    );

-- RLS Policy: Admins and editors can create assignments
CREATE POLICY "Admins and editors can create assignments" ON user_manuscripts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'editor')
            AND is_active = true
        )
    );

-- RLS Policy: Admins and editors can update assignments
CREATE POLICY "Admins and editors can update assignments" ON user_manuscripts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'editor')
            AND is_active = true
        )
    );

-- RLS Policy: Admins can delete assignments
CREATE POLICY "Admins can delete assignments" ON user_manuscripts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
            AND is_active = true
        )
    );

-- Insert sample data: Assign first manuscript to test users
-- Note: Update user_id values with actual UUIDs from your user_profiles table
-- Example query to get user IDs:
-- SELECT id, email, role FROM user_profiles WHERE role IN ('editor', 'admin');

-- Sample assignment (uncomment and update user_id after getting actual UUID):
-- INSERT INTO user_manuscripts (user_id, manuscript_id, role)
-- SELECT 
--     (SELECT id FROM user_profiles WHERE email = 'your-email@example.com' LIMIT 1),
--     id,
--     'editor'
-- FROM manuscripts 
-- WHERE title = 'Deep Learning Approaches for Natural Language Processing in Scientific Literature'
-- LIMIT 1;

-- Function to automatically assign manuscript creator as editor
CREATE OR REPLACE FUNCTION assign_manuscript_creator()
RETURNS TRIGGER AS $$
BEGIN
    -- If editor_id looks like a UUID, try to assign
    IF NEW.editor_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        INSERT INTO user_manuscripts (user_id, manuscript_id, role)
        VALUES (NEW.editor_id::uuid, NEW.id, 'editor')
        ON CONFLICT (user_id, manuscript_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-assign on manuscript creation
CREATE OR REPLACE TRIGGER on_manuscript_created
    AFTER INSERT ON manuscripts
    FOR EACH ROW EXECUTE FUNCTION assign_manuscript_creator();

COMMENT ON TABLE user_manuscripts IS 'Junction table linking users to manuscripts they can manage';
COMMENT ON COLUMN user_manuscripts.role IS 'User role for this manuscript: editor (manages review process), author (manuscript creator), collaborator (can view/comment), reviewer (invited to review)';
