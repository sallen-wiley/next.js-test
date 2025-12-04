-- Reviewer Invitation System Database Schema

-- Create user_profiles table to extend Supabase auth with roles and metadata
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('admin', 'editor', 'designer', 'product_manager', 'reviewer', 'guest')) DEFAULT 'guest',
    department TEXT,
    permissions TEXT[] DEFAULT '{}', -- Additional fine-grained permissions
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Create policy for users to update their own profile (except role)
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (role = (SELECT role FROM user_profiles WHERE id = auth.uid()));

-- Create policy for admins to manage all profiles
CREATE POLICY "Admins can manage all profiles" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'guest')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile for new users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sample user roles data (you can update these after creating users)
-- This will be populated when users are created

-- Create manuscripts table
CREATE TABLE IF NOT EXISTS manuscripts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    authors TEXT[] NOT NULL DEFAULT '{}',
    journal TEXT NOT NULL,
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    doi TEXT,
    abstract TEXT,
    keywords TEXT[] DEFAULT '{}',
    subject_area TEXT,
    status TEXT CHECK (status IN ('submitted', 'under_review', 'revision_required', 'accepted', 'rejected')) DEFAULT 'submitted',
    editor_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create potential_reviewers table
CREATE TABLE IF NOT EXISTS potential_reviewers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    affiliation TEXT NOT NULL,
    department TEXT,
    expertise_areas TEXT[] DEFAULT '{}',
    current_review_load INTEGER DEFAULT 0,
    max_review_capacity INTEGER DEFAULT 3,
    average_review_time_days INTEGER DEFAULT 21,
    recent_publications INTEGER DEFAULT 0,
    h_index INTEGER,
    last_review_completed DATE,
    availability_status TEXT CHECK (availability_status IN ('available', 'busy', 'unavailable', 'sabbatical')) DEFAULT 'available',
    response_rate DECIMAL(5,2) DEFAULT 0.0, -- 0-100
    quality_score DECIMAL(5,2) DEFAULT 0.0, -- 0-100
    conflicts_of_interest TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviewer_manuscript_matches table (for storing match scores)
CREATE TABLE IF NOT EXISTS reviewer_manuscript_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manuscript_id UUID REFERENCES manuscripts(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES potential_reviewers(id) ON DELETE CASCADE,
    match_score DECIMAL(5,2) NOT NULL, -- 0-100
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(manuscript_id, reviewer_id)
);

-- Create review_invitations table
CREATE TABLE IF NOT EXISTS review_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manuscript_id UUID REFERENCES manuscripts(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES potential_reviewers(id) ON DELETE CASCADE,
    invited_date TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'completed', 'overdue', 'report_submitted')) DEFAULT 'pending',
    response_date TIMESTAMPTZ,
    queue_position INTEGER, -- null if sent immediately, number if queued
    invitation_round INTEGER DEFAULT 1, -- 1st choice, 2nd choice, etc.
    notes TEXT,
    reminder_count INTEGER DEFAULT 0,
    estimated_completion_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invitation_queue table
CREATE TABLE IF NOT EXISTS invitation_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manuscript_id UUID REFERENCES manuscripts(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES potential_reviewers(id) ON DELETE CASCADE,
    queue_position INTEGER NOT NULL,
    created_date TIMESTAMPTZ DEFAULT NOW(),
    scheduled_send_date TIMESTAMPTZ NOT NULL,
    priority TEXT CHECK (priority IN ('high', 'normal', 'low')) DEFAULT 'normal',
    notes TEXT,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ
);

-- Create reviewer_metrics table (for tracking historical performance)
CREATE TABLE IF NOT EXISTS reviewer_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_id UUID REFERENCES potential_reviewers(id) ON DELETE CASCADE,
    total_invitations INTEGER DEFAULT 0,
    total_acceptances INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    average_response_time_hours DECIMAL(8,2) DEFAULT 0.0,
    average_review_time_days DECIMAL(8,2) DEFAULT 0.0,
    current_load INTEGER DEFAULT 0,
    last_activity_date TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(reviewer_id)
);

-- Insert sample data using proper UUIDs
-- We'll let the database generate UUIDs and create sample data step by step

-- Insert sample manuscripts
INSERT INTO manuscripts (title, authors, journal, submission_date, abstract, keywords, subject_area, status, editor_id) VALUES
(
    'Deep Learning Approaches for Natural Language Processing in Scientific Literature',
    ARRAY['Dr. Sarah Chen', 'Prof. Michael Rodriguez', 'Dr. Jennifer Liu'],
    'Journal of Computational Linguistics',
    '2024-10-01T09:00:00Z',
    'This paper presents novel deep learning approaches for extracting and analyzing scientific literature, focusing on transformer architectures and their applications in academic text processing.',
    ARRAY['deep learning', 'natural language processing', 'transformers', 'scientific literature', 'text mining'],
    'Computer Science - Computational Linguistics',
    'under_review',
    'editor-001'
),
(
    'Machine Learning Applications in Climate Change Prediction',
    ARRAY['Dr. Emily Watson', 'Prof. James Miller'],
    'Environmental Science Journal',
    '2024-09-15T10:30:00Z',
    'A comprehensive study on using machine learning algorithms to predict climate change patterns and their impact on global ecosystems.',
    ARRAY['machine learning', 'climate change', 'prediction models', 'environmental science'],
    'Environmental Science',
    'submitted',
    'editor-002'
),
(
    'Quantum Computing Algorithms for Cryptographic Applications',
    ARRAY['Prof. Alexander Kim', 'Dr. Maria Santos', 'Dr. Robert Johnson'],
    'Quantum Information Science',
    '2024-08-20T14:15:00Z',
    'Investigation of quantum computing algorithms and their potential applications in modern cryptographic systems and security protocols.',
    ARRAY['quantum computing', 'cryptography', 'algorithms', 'security'],
    'Computer Science - Quantum Computing',
    'revision_required',
    'editor-001'
),
(
    'Biomedical Engineering Innovations in Drug Delivery Systems',
    ARRAY['Dr. Lisa Chang', 'Prof. Michael Brown'],
    'Biomedical Engineering Review',
    '2024-07-10T11:45:00Z',
    'Novel approaches to targeted drug delivery using nanotechnology and biocompatible materials for enhanced therapeutic efficacy.',
    ARRAY['biomedical engineering', 'drug delivery', 'nanotechnology', 'therapeutics'],
    'Biomedical Engineering',
    'accepted',
    'editor-003'
),
(
    'Artificial Intelligence in Medical Diagnosis: A Systematic Review',
    ARRAY['Dr. Jennifer Park', 'Prof. David Wilson', 'Dr. Amanda Lee'],
    'Medical AI Journal',
    '2024-06-05T16:20:00Z',
    'Systematic review of artificial intelligence applications in medical diagnosis, examining accuracy, reliability, and clinical implementation challenges.',
    ARRAY['artificial intelligence', 'medical diagnosis', 'systematic review', 'healthcare'],
    'Medical Informatics',
    'under_review',
    'editor-002'
),
(
    'Sustainable Energy Storage Solutions for Smart Grid Systems',
    ARRAY['Prof. Thomas Anderson', 'Dr. Sarah Kim'],
    'Renewable Energy Technology',
    '2024-05-22T09:10:00Z',
    'Analysis of sustainable energy storage technologies and their integration into smart grid systems for improved energy efficiency.',
    ARRAY['sustainable energy', 'energy storage', 'smart grid', 'renewable technology'],
    'Engineering - Energy Systems',
    'submitted',
    'editor-003'
);

-- Insert sample potential reviewers
INSERT INTO potential_reviewers (name, email, affiliation, department, expertise_areas, current_review_load, max_review_capacity, average_review_time_days, recent_publications, h_index, last_review_completed, availability_status, response_rate, quality_score, conflicts_of_interest) VALUES
(
    'Dr. Alice Thompson',
    'a.thompson@stanford.edu',
    'Stanford University',
    'Computer Science',
    ARRAY['natural language processing', 'machine learning', 'computational linguistics'],
    2, 4, 21, 12, 45,
    '2024-09-15',
    'available',
    85.0, 92.0,
    ARRAY[]::TEXT[]
),
(
    'Prof. David Kim',
    'd.kim@mit.edu',
    'MIT',
    'Electrical Engineering and Computer Science',
    ARRAY['deep learning', 'neural networks', 'artificial intelligence'],
    3, 3, 18, 8, 38,
    '2024-08-20',
    'busy',
    92.0, 88.0,
    ARRAY[]::TEXT[]
),
(
    'Dr. Maria Gonzalez',
    'm.gonzalez@berkeley.edu',
    'UC Berkeley',
    'Linguistics',
    ARRAY['computational linguistics', 'text processing', 'corpus linguistics'],
    1, 5, 25, 15, 52,
    '2024-09-30',
    'available',
    78.0, 95.0,
    ARRAY[]::TEXT[]
),
(
    'Prof. Robert Zhang',
    'r.zhang@toronto.ca',
    'University of Toronto',
    'Computer Science',
    ARRAY['deep learning', 'transformers', 'language models'],
    0, 4, 19, 18, 41,
    '2024-08-15',
    'available',
    90.0, 93.0,
    ARRAY['Dr. Sarah Chen']
);

-- Note: For match scores, invitations, and queue entries, 
-- you would normally get the actual UUIDs from the above inserts
-- For demo purposes, we'll create these relationships after the main data is inserted
-- You can run additional queries to link them based on email/title matching

-- Enable Row Level Security (optional)
ALTER TABLE manuscripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE potential_reviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviewer_manuscript_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviewer_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for demo access (allows public read)
CREATE POLICY "Enable read access for all users" ON manuscripts FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON potential_reviewers FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON reviewer_manuscript_matches FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON review_invitations FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON invitation_queue FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON reviewer_metrics FOR SELECT USING (true);

-- Create useful indexes
CREATE INDEX idx_manuscripts_status ON manuscripts(status);
CREATE INDEX idx_manuscripts_editor ON manuscripts(editor_id);
CREATE INDEX idx_reviewers_availability ON potential_reviewers(availability_status);
CREATE INDEX idx_reviewers_expertise ON potential_reviewers USING GIN(expertise_areas);
CREATE INDEX idx_match_scores_manuscript ON reviewer_manuscript_matches(manuscript_id);
CREATE INDEX idx_invitations_manuscript ON review_invitations(manuscript_id);
CREATE INDEX idx_invitations_status ON review_invitations(status);
CREATE INDEX idx_queue_manuscript ON invitation_queue(manuscript_id);
CREATE INDEX idx_queue_position ON invitation_queue(queue_position);