# Reviewer Suggestions Ingestion Tool

Ingests JSON manuscript data with reviewer suggestions and publication histories into Supabase for user testing.

## Features

- ✅ **Idempotent**: Safe to run multiple times with the same or updated JSON files
- ✅ **Smart deduplication**: Uses email for reviewers, system_id for manuscripts
- ✅ **Complete data migration**: Ingests all manuscript, reviewer, match, metric, and publication data
- ✅ **Comprehensive logging**: Detailed output for debugging
- ✅ **Error resilient**: Continues processing if individual items fail

## Prerequisites

- Node.js 18+ installed
- Access to your Supabase project
- Your Supabase service role key (from Dashboard > Settings > API)

## Setup

### 1. Run the schema migration

Open your Supabase SQL Editor and run the entire `schema_migration.sql` file. This will:

- Add new columns to existing tables (manuscripts, potential_reviewers, reviewer_manuscript_matches, reviewer_metrics)
- Create new tables (reviewer_publications, reviewer_retractions)
- Create helpful views for debugging
- Add necessary indexes for performance

The migration is idempotent, so it's safe to run multiple times.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **Important**: Use your **service role key**, not the anon key. The service role key has admin permissions needed for bulk operations.

## Usage

### Basic usage

```bash
node ingest.js path/to/reviewer_suggestions.json
```

### Example

```bash
node ingest.js ./reviewer_suggestions_7832738.json
```

### What gets ingested

The script processes:

1. **Manuscript data** → `manuscripts` table
   - Title, abstract, journal, article type, submission date
   - Authors array
   - System IDs for deduplication

2. **Reviewer data** → `potential_reviewers` table
   - Name, email, affiliation
   - ORCID, ROR IDs
   - Keywords/expertise areas
   - Board member status, previous reviewer flags

3. **Reviewer-manuscript matches** → `reviewer_manuscript_matches` table
   - Match scores
   - Initial suggestion flags
   - Conflicts of interest

4. **Reviewer metrics** → `reviewer_metrics` table
   - Review activity (number of reviews, completions, currently reviewing)
   - Publication statistics (citation count, year range, recent publications)

5. **Publications** → `reviewer_publications` table
   - Related publications (matching the manuscript topic)
   - Other publications (full bibliography)
   - DOI, journal, authors, publication dates

6. **Retractions** → `reviewer_retractions` table (if any)

## Output

The script provides detailed logging:

```
[2025-12-11T10:30:00.000Z] [INFO] Starting ingestion
[2025-12-11T10:30:00.100Z] [INFO] Upserting manuscript: Body weight changes and associated...
[2025-12-11T10:30:00.200Z] [INFO] Created manuscript: abc123...
[2025-12-11T10:30:00.300Z] [INFO] Processing reviewer 1/10: Tom Deliens
[2025-12-11T10:30:00.400Z] [INFO] Created reviewer: def456...
...
[2025-12-11T10:30:05.000Z] [INFO] ✅ Ingestion completed successfully!
[2025-12-11T10:30:05.000Z] [INFO] Manuscripts processed: 1
[2025-12-11T10:30:05.000Z] [INFO] Reviewers processed: 10
[2025-12-11T10:30:05.000Z] [INFO] Publications inserted: 234
```

## Deduplication Strategy

### Manuscripts
- **Primary key**: `system_id` (UUID from your editorial system)
- If a manuscript with the same `system_id` exists, it will be **updated**
- This allows you to re-ingest with updated data before user testing

### Reviewers  
- **Primary key**: `email` (unique constraint)
- If a reviewer with the same email exists, their data will be **updated**
- This prevents duplicate reviewer entries across multiple manuscript ingestions

### Publications
- **Primary key**: `reviewer_id + doi` (composite unique constraint)
- Duplicate publications for the same reviewer are automatically skipped
- Allows multiple ingestions without duplicating publication records

## Data Verification

After running the ingestion, verify your data using these helpful views:

### Check reviewer publication counts

```sql
SELECT * FROM reviewer_publication_summary
ORDER BY total_publications_count DESC
LIMIT 10;
```

### Check manuscript-reviewer matches with invitation status

```sql
SELECT * FROM manuscript_reviewer_matches_detailed
WHERE manuscript_custom_id = '7832738'
ORDER BY match_score DESC;
```

### Check specific reviewer's publications

```sql
SELECT 
  pr.name,
  pr.email,
  rp.title,
  rp.journal_name,
  rp.publication_date,
  rp.is_related
FROM potential_reviewers pr
JOIN reviewer_publications rp ON pr.id = rp.reviewer_id
WHERE pr.email = 'tom.deliens@vub.be'
ORDER BY rp.publication_date DESC;
```

## Troubleshooting

### "Missing required environment variables"

Make sure you've created a `.env` file with your Supabase credentials. Copy from `.env.example` and fill in your values.

### "PGRST204: Foreign key violation"

The schema migration might not have run completely. Re-run `schema_migration.sql` in your Supabase SQL Editor.

### "Duplicate key value violates unique constraint"

This is expected behaviour during re-ingestion. The script handles this gracefully by updating existing records rather than failing.

### Publications not appearing

Check that:
1. The JSON file has `relatedPublications` and/or `otherPublications` arrays
2. Publications have valid DOIs (null DOIs might cause issues with the unique constraint)
3. Run the verification query above to check the reviewer_publications table directly

## Re-running the Ingestion

It's completely safe to run the ingestion script multiple times:

1. **Same JSON file**: Updates will be applied to existing records
2. **Updated JSON file**: New data overwrites old data for the same manuscript/reviewers
3. **Different JSON file**: New manuscript and reviewers are added to the database

This is useful when:
- You receive updated data from your editorial system before user testing
- You need to test with multiple manuscripts
- You want to update reviewer information

## Multiple Manuscripts

To ingest multiple manuscripts:

```bash
node ingest.js manuscript_1.json
node ingest.js manuscript_2.json
node ingest.js manuscript_3.json
```

Each manuscript will be added to the database with its own set of reviewers and matches. Reviewers that appear across multiple manuscripts will be deduplicated by email.

## Schema Overview

### New columns added to existing tables

**manuscripts:**
- `system_id`, `submission_id`, `custom_id`, `article_type`

**potential_reviewers:**
- `external_id`, `pkg_id`, `given_names`, `surname`, `aff_ror_id`, `orcid_id`, `profile_url`, `reviewer_type`, `is_board_member`, `previous_reviewer`, `has_publications_saved`

**reviewer_manuscript_matches:**
- `is_initial_suggestion`, `conflicts_of_interest`

**reviewer_metrics:**
- `number_of_reviews`, `completed_reviews`, `currently_reviewing`, `citation_count`, `publication_year_from`, `publication_year_to`, `publication_count_last_year`, `last_publication_date`

### New tables created

**reviewer_publications:**
```
- id (PK)
- reviewer_id (FK)
- title, doi, journal_name
- authors (array)
- publication_date
- is_related (boolean)
```

**reviewer_retractions:**
```
- id (PK)
- reviewer_id (FK)
- retraction_reasons (array)
```

## Support

For issues or questions:
1. Check the detailed log output for error messages
2. Verify your data against the views provided above
3. Ensure the schema migration ran successfully

## License

MIT
