# Reviewer Data Ingestion

This system provides both **CLI** and **UI-based** data ingestion for reviewer suggestions.

## Overview

The ingestion system is built with:

- **Shared TypeScript library** (`src/lib/ingestion/reviewerIngestion.ts`) - Core ingestion logic
- **CLI script** (`database/reviewer-ingestion/ingest.js`) - Command-line interface
- **Admin UI** (`/admin/data-ingestion`) - Web-based upload interface

## Security Model

### Client-Side (Admin UI)

- Uses authenticated user's Supabase token
- Protected by RLS (Row Level Security) policies
- Access restricted to admin role users only
- File validation (JSON only, max 10MB)

### Server-Side (CLI)

- Uses service role key from environment variables
- Bypasses RLS for batch operations
- Requires `.env.local` configuration

## Usage

### Admin UI (Recommended)

1. Navigate to **Admin Panel** → **Data Ingestion**
2. Click or drag a JSON file to upload
3. Click "Upload and Process"
4. Monitor real-time progress
5. View completion statistics

**Features:**

- Drag-and-drop file upload
- Real-time progress tracking
- Detailed error reporting
- Client-side validation

### CLI

```bash
node database/reviewer-ingestion/ingest.js <path-to-json-file>

# Example
node database/reviewer-ingestion/ingest.js ./data/reviewer_suggestions_7832738.json
```

**Features:**

- Timestamped logging
- Detailed console output
- Service role key access (bypasses RLS)
- Batch processing optimizations

## File Format

JSON file structure:

```json
{
  "manuscriptData": {
    "systemId": "...",
    "submissionId": "...",
    "title": "...",
    "authors": [
      { "givenNames": "...", "surname": "..." }
    ],
    "abstract": "...",
    "journalName": "...",
    "articleType": "...",
    "submittedDate": "...",
    "keywords": [...]
  },
  "reviewers": [
    {
      "id": "...",
      "email": "...",
      "givenNames": "...",
      "surname": "...",
      "aff": "...",
      "score": 0.95,
      "initialSuggestion": true,
      "conflictsOfInterest": "...",
      "isBoardMember": false,
      "previousReviewer": false,
      "hasPublicationsSaved": true,
      "keywords": [...],
      "publicationStats": {
        "hIndex": 25,
        "totalPublications": 50,
        "citationCount": 1200
      },
      "relatedPublications": [
        {
          "title": "...",
          "doi": "...",
          "journalName": "...",
          "authors": [...],
          "publicationDate": "..."
        }
      ],
      "otherPublications": [...],
      "retractions": {
        "retractionReasons": [...]
      }
    }
  ]
}
```

## Ingestion Process

1. **Manuscript Upsert**

   - Deduplicates by `system_id`
   - Updates existing or inserts new

2. **Reviewer Processing** (for each reviewer):

   - Upsert reviewer (deduplicate by email)
   - Create reviewer-manuscript match (with score)
   - Insert publications (deduplicate by `reviewer_id + DOI`)
   - Create publication-manuscript links (for related publications)
   - Insert retractions (if any)

3. **Statistics**
   - Manuscripts processed
   - Reviewers processed
   - Matches created
   - Publications inserted
   - Retractions inserted
   - Errors (with details)

## Database Tables Affected

- `manuscripts` - Manuscript submissions
- `potential_reviewers` - Reviewer database
- `reviewer_manuscript_matches` - AI-generated match scores
- `reviewer_publications` - Publication catalog
- `manuscript_publication_matches` - Related publications junction table
- `reviewer_retractions` - Retraction data

## Error Handling

### Validation

- File type must be `.json`
- File size limit: 10MB
- Required fields validated before processing

### Idempotency

- Safe to run multiple times
- Uses upsert operations (update or insert)
- Deduplicates on unique keys:
  - Manuscripts: `system_id`
  - Reviewers: `email`
  - Publications: `reviewer_id + DOI`
  - Matches: `manuscript_id + reviewer_id`

### Error Recovery

- Individual reviewer errors don't stop processing
- Errors collected and reported at end
- Partial ingestion possible (some reviewers succeed, others fail)

## Development

### Shared Library

Located at `src/lib/ingestion/reviewerIngestion.ts`

Key functions:

- `ingestReviewerData()` - Main ingestion function
- `validateIngestionData()` - Input validation
- `upsertManuscript()` - Manuscript processing
- `upsertReviewer()` - Reviewer processing
- `insertPublications()` - Publication processing

### CLI Script

Located at `database/reviewer-ingestion/ingest.js`

Uses shared library with console logging wrapper.

### Admin UI

Located at `src/app/admin/data-ingestion/page.tsx`

React component with:

- File upload with drag-and-drop
- Progress indicators
- Result display
- Error handling

## Testing

### Test Write Access

Verify admin RLS permissions:

```sql
INSERT INTO reviewer_publications (reviewer_id, title, doi)
VALUES (
  (SELECT id FROM potential_reviewers LIMIT 1),
  'Test Publication',
  'test-doi-' || gen_random_uuid()::text
)
RETURNING *;
```

### Test CLI Ingestion

```bash
# Use sample data file
node database/reviewer-ingestion/ingest.js ./database/reviewer-ingestion/reviewer_suggestions_7832738.json
```

### Test UI Ingestion

1. Sign in as admin user
2. Navigate to `/admin/data-ingestion`
3. Upload sample JSON file
4. Verify progress and results

## Troubleshooting

### "Missing required environment variables"

- CLI requires `.env.local` with:
  - `NEXT_PUBLIC_SUPABASE_URL` (or `SUPABASE_URL`)
  - `SUPABASE_SERVICE_ROLE_KEY`

### "Permission denied" errors

- Admin UI: Verify user has admin role
- CLI: Check service role key is correct
- Verify RLS policies allow writes

### "File too large"

- Max 10MB limit
- Split large datasets into multiple files

### TypeScript import errors

- CLI uses require() for `.ts` files
- Ensure TypeScript compilation works
- May need to pre-compile library for production use

## Future Enhancements

- [ ] Batch upload (multiple files)
- [ ] Background processing for large files
- [ ] Email notifications on completion
- [ ] Dry-run mode (preview without saving)
- [ ] Rollback capability
- [ ] Import history tracking
