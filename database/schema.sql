-- Reviewer Invitation System Database Schema

-- Create manuscripts table
CREATE TABLE manuscripts (
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
CREATE TABLE potential_reviewers (
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
CREATE TABLE reviewer_manuscript_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manuscript_id UUID REFERENCES manuscripts(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES potential_reviewers(id) ON DELETE CASCADE,
    match_score DECIMAL(5,2) NOT NULL, -- 0-100
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(manuscript_id, reviewer_id)
);

-- Create review_invitations table
CREATE TABLE review_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manuscript_id UUID REFERENCES manuscripts(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES potential_reviewers(id) ON DELETE CASCADE,
    invited_date TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'completed', 'overdue')) DEFAULT 'pending',
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
CREATE TABLE invitation_queue (
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
CREATE TABLE reviewer_metrics (
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

-- Insert sample manuscript
INSERT INTO manuscripts (id, title, authors, journal, submission_date, abstract, keywords, subject_area, status, editor_id) VALUES
(
    'ms-001',
    'Deep Learning Approaches for Natural Language Processing in Scientific Literature',
    ARRAY['Dr. Sarah Chen', 'Prof. Michael Rodriguez', 'Dr. Jennifer Liu'],
    'Journal of Computational Linguistics',
    '2024-10-01T09:00:00Z',
    'This paper presents novel deep learning approaches for extracting and analyzing scientific literature, focusing on transformer architectures and their applications in academic text processing.',
    ARRAY['deep learning', 'natural language processing', 'transformers', 'scientific literature', 'text mining'],
    'Computer Science - Computational Linguistics',
    'under_review',
    'editor-001'
);

-- Insert sample potential reviewers
INSERT INTO potential_reviewers (id, name, email, affiliation, department, expertise_areas, current_review_load, max_review_capacity, average_review_time_days, recent_publications, h_index, last_review_completed, availability_status, response_rate, quality_score, conflicts_of_interest) VALUES
(
    'rev-001',
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
    'rev-002',
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
    'rev-003',
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
    'rev-006',
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

-- Insert reviewer-manuscript match scores
INSERT INTO reviewer_manuscript_matches (manuscript_id, reviewer_id, match_score) VALUES
('ms-001', 'rev-001', 95.0),
('ms-001', 'rev-002', 88.0),
('ms-001', 'rev-003', 91.0),
('ms-001', 'rev-006', 93.0);

-- Insert sample review invitations
INSERT INTO review_invitations (id, manuscript_id, reviewer_id, invited_date, due_date, status, response_date, invitation_round, reminder_count, notes) VALUES
(
    'inv-001',
    'ms-001', 'rev-001',
    '2024-10-10T10:00:00Z',
    '2024-11-10T23:59:59Z',
    'accepted',
    '2024-10-12T14:30:00Z',
    1, 0,
    null
),
(
    'inv-002',
    'ms-001', 'rev-003',
    '2024-10-10T10:00:00Z',
    '2024-11-10T23:59:59Z',
    'pending',
    null,
    1, 1,
    'Sent reminder on Oct 13'
),
(
    'inv-003',
    'ms-001', 'rev-006',
    '2024-10-10T10:00:00Z',
    '2024-11-10T23:59:59Z',
    'declined',
    '2024-10-11T09:15:00Z',
    1, 0,
    'Declined due to conflict of interest with author Dr. Sarah Chen'
);

-- Insert sample invitation queue
INSERT INTO invitation_queue (id, manuscript_id, reviewer_id, queue_position, created_date, scheduled_send_date, priority, notes) VALUES
(
    'queue-001',
    'ms-001', 'rev-002',
    1,
    '2024-10-12T15:00:00Z',
    '2024-10-17T09:00:00Z',
    'high',
    'Backup reviewer - high match score'
);

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