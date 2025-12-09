-- Seed reviewer_manuscript_matches for test manuscript
-- Purpose: Create AI-suggested matches between reviewers and the NLP manuscript
-- Date: 2025-12-04

-- Clear any existing matches for this manuscript (if re-running)
DELETE FROM reviewer_manuscript_matches 
WHERE manuscript_id = 'bedb091e-cbae-4e61-bdc8-e0d22d18ef13';

-- Insert matches for "Deep Learning Approaches for NLP" manuscript
-- Match scores based on expertise alignment

-- Dr. Alice Thompson - Perfect match (NLP + ML + Computational Linguistics)
INSERT INTO reviewer_manuscript_matches (manuscript_id, reviewer_id, match_score)
VALUES (
  'bedb091e-cbae-4e61-bdc8-e0d22d18ef13',
  'f769e138-06bf-46fb-bedc-43b1302adb94',
  95.5
);

-- Prof. David Kim - Strong match (Deep Learning + Neural Networks + AI)
INSERT INTO reviewer_manuscript_matches (manuscript_id, reviewer_id, match_score)
VALUES (
  'bedb091e-cbae-4e61-bdc8-e0d22d18ef13',
  'bbe513df-c29a-4c5c-a6a6-971d47e7eb32',
  88.0
);

-- Dr. Maria Gonzalez - Good match (Computational Linguistics + Text Processing)
INSERT INTO reviewer_manuscript_matches (manuscript_id, reviewer_id, match_score)
VALUES (
  'bedb091e-cbae-4e61-bdc8-e0d22d18ef13',
  '81761e88-8891-4891-914e-c653c578b58a',
  82.5
);

-- Prof. Robert Zhang - Excellent match (Deep Learning + Transformers + Language Models)
INSERT INTO reviewer_manuscript_matches (manuscript_id, reviewer_id, match_score)
VALUES (
  'bedb091e-cbae-4e61-bdc8-e0d22d18ef13',
  '0ae1c77d-e153-4e38-a2a9-3fd7d2ddc3ec',
  92.0
);

-- Verify matches were created
SELECT 
  rmm.match_score,
  pr.name,
  pr.affiliation,
  pr.expertise_areas,
  pr.availability_status
FROM reviewer_manuscript_matches rmm
JOIN potential_reviewers pr ON pr.id = rmm.reviewer_id
WHERE rmm.manuscript_id = 'bedb091e-cbae-4e61-bdc8-e0d22d18ef13'
ORDER BY rmm.match_score DESC;
