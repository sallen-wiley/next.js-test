-- Migration: Palette Storage System
-- Description: Add tables for storing user-created color palettes
-- Created: 2026-01-12
-- Author: Database Migration

-- ============================================================================
-- TABLE: user_palettes
-- ============================================================================
-- Purpose: Store user-created and system preset color palettes
-- Each palette contains the complete HueSet[] data structure from the generator

CREATE TABLE IF NOT EXISTS user_palettes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  palette_data jsonb NOT NULL, -- Full HueSet[] array with all shade definitions
  is_public boolean DEFAULT false,
  is_preset boolean DEFAULT false, -- True for system-managed preset palettes
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT name_not_empty CHECK (char_length(name) > 0),
  CONSTRAINT palette_data_is_array CHECK (jsonb_typeof(palette_data) = 'array')
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for user lookup (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_user_palettes_user_id 
  ON user_palettes(user_id);

-- Index for public palette browsing
CREATE INDEX IF NOT EXISTS idx_user_palettes_public 
  ON user_palettes(is_public) 
  WHERE is_public = true;

-- Index for preset palette loading
CREATE INDEX IF NOT EXISTS idx_user_palettes_preset 
  ON user_palettes(is_preset) 
  WHERE is_preset = true;

-- Composite index for public preset queries
CREATE INDEX IF NOT EXISTS idx_user_palettes_public_preset 
  ON user_palettes(is_public, is_preset);

-- Index for recent palettes (ordering by creation date)
CREATE INDEX IF NOT EXISTS idx_user_palettes_created 
  ON user_palettes(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE user_palettes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own palettes and all public palettes
CREATE POLICY "Users can view own and public palettes"
  ON user_palettes FOR SELECT
  USING (
    user_id = auth.uid() 
    OR is_public = true
  );

-- Policy: Users can insert their own palettes
-- Note: Cannot set is_preset = true (only admins via direct SQL)
CREATE POLICY "Users can insert own palettes"
  ON user_palettes FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND is_preset = false
  );

-- Policy: Users can update their own non-preset palettes
CREATE POLICY "Users can update own palettes"
  ON user_palettes FOR UPDATE
  USING (
    user_id = auth.uid() 
    AND is_preset = false
  );

-- Policy: Users can delete their own non-preset palettes
CREATE POLICY "Users can delete own palettes"
  ON user_palettes FOR DELETE
  USING (
    user_id = auth.uid() 
    AND is_preset = false
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Automatically update updated_at timestamp on row modification
CREATE OR REPLACE FUNCTION update_user_palettes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_palettes_updated_at
  BEFORE UPDATE ON user_palettes
  FOR EACH ROW
  EXECUTE FUNCTION update_user_palettes_updated_at();

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE user_palettes IS 'Stores user-created color palettes and system presets from the HSV Palette Generator';
COMMENT ON COLUMN user_palettes.id IS 'Unique identifier for the palette';
COMMENT ON COLUMN user_palettes.user_id IS 'Owner of the palette (references auth.users)';
COMMENT ON COLUMN user_palettes.name IS 'Display name for the palette';
COMMENT ON COLUMN user_palettes.description IS 'Optional description of palette purpose/theme';
COMMENT ON COLUMN user_palettes.palette_data IS 'Complete HueSet[] array from palette generator (JSONB)';
COMMENT ON COLUMN user_palettes.is_public IS 'Whether palette is visible to all users';
COMMENT ON COLUMN user_palettes.is_preset IS 'System-managed preset (cannot be modified by users)';
COMMENT ON COLUMN user_palettes.created_at IS 'Timestamp when palette was created';
COMMENT ON COLUMN user_palettes.updated_at IS 'Timestamp when palette was last modified (auto-updated)';

-- ============================================================================
-- VERIFICATION QUERY (for testing)
-- ============================================================================

-- Verify table was created successfully
-- SELECT table_name, column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'user_palettes' 
-- ORDER BY ordinal_position;
