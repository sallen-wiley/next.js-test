# Database SQL Scripts

This directory contains SQL migration scripts for the manuscript review system database.

## Quick Start

### Fresh Database Setup

For a **brand new database**, run these files **in order**:

```sql
-- 1. Create all tables and indexes
\i 01_core_tables.sql

-- 2. Set up Row Level Security policies
\i 02_rls_policies.sql

-- 3. (Optional) Populate with sample data
\i 03_seed_data.sql
```

### Reset Existing Database

To **completely reset** an existing database:

```sql
-- WARNING: Deletes all data!
\i 00_cleanup.sql

-- Then run setup files 01, 02, 03 as above
```

## File Organization

### Core Setup Files (numbered)

| File                   | Purpose                                    | Run Order |
| ---------------------- | ------------------------------------------ | --------- |
| `00_cleanup.sql`       | **⚠️ Drops all tables** - use with caution | Optional  |
| `01_core_tables.sql`   | Creates all tables, indexes, constraints   | First     |
| `02_rls_policies.sql`  | Sets up Row Level Security policies        | Second    |
| `03_seed_data.sql`     | Populates sample data for testing          | Optional  |
| `99_export_schema.sql` | Exports current schema to markdown         | Utility   |

### Legacy Files (archive folder)

Old migration files have been moved to `archive/`. These are kept for historical reference but should **not** be run on new databases.

## Schema Overview

### Tables Created

1. **user_profiles** - User authentication and RBAC
2. **manuscripts** - Manuscript submissions with workflow status
3. **potential_reviewers** - Reviewer database with expertise
4. **user_manuscripts** - Links users to manuscripts they manage
5. **reviewer_manuscript_matches** - AI-generated reviewer suggestions
6. **invitation_queue** - Queued invitations waiting to be sent
7. **review_invitations** - Active sent invitations with status tracking
8. **reviewer_metrics** - Aggregated reviewer performance metrics

### Key Features

- ✅ **Row Level Security (RLS)** on all tables
- ✅ **Foreign key constraints** for data integrity
- ✅ **Indexes** for query performance
- ✅ **Check constraints** for data validation
- ✅ **Default values** for common fields
- ✅ **Timestamps** (created_at, updated_at) on all tables

## Workflow Explanation

### Reviewer Invitation Flow

```
1. AI generates match scores → reviewer_manuscript_matches
2. User adds reviewer to queue → invitation_queue
3. System sends invitation → review_invitations (queue.sent = true)
4. Reviewer responds → review_invitations.status updated
5. Metrics updated → reviewer_metrics
```

### User Access Pattern

```
1. User logs in → user_profiles (linked to auth.users)
2. User assigned to manuscript → user_manuscripts
3. User views dashboard → shows manuscripts via user_manuscripts join
4. User manages reviewers → creates invitation_queue + review_invitations
```

## Security Model

### Role-Based Access Control (RBAC)

**Roles:** `admin`, `editor`, `designer`, `product_manager`, `reviewer`, `guest`

| Action            | Allowed Roles           | Table                       |
| ----------------- | ----------------------- | --------------------------- |
| View manuscripts  | Public (all users)      | manuscripts                 |
| Create manuscript | Authenticated users     | manuscripts                 |
| Edit manuscript   | admin, designer, editor | manuscripts                 |
| Delete manuscript | admin, designer         | manuscripts                 |
| View reviewers    | Public (all users)      | potential_reviewers         |
| Add reviewer      | Authenticated users     | potential_reviewers         |
| Edit reviewer     | admin, designer         | potential_reviewers         |
| Manage queue      | Authenticated users     | invitation_queue            |
| Send invitations  | Authenticated users     | review_invitations          |
| View own assigned | User (own manuscripts)  | user_manuscripts            |
| View all assigned | admin, editor           | user_manuscripts            |
| View match scores | Public (all users)      | reviewer_manuscript_matches |

### RLS Helper Functions

```sql
-- Check if user has specific role
has_role('admin') → boolean

-- Check if user has any of the specified roles
has_any_role(ARRAY['admin', 'editor']) → boolean
```

## Data Types & Constraints

### Status Enums

**manuscripts.status** (workflow states):

- `submitted`, `pending_editor_assignment`, `awaiting_reviewers`
- `under_review`, `reviews_in_progress`, `reviews_complete`
- `revision_required`, `minor_revision`, `major_revision`
- `conditionally_accepted`, `accepted`, `rejected`, `desk_rejected`, `withdrawn`

**review_invitations.status**:

- `pending`, `accepted`, `declined`, `expired`, `completed`, `overdue`

**potential_reviewers.availability_status**:

- `available`, `busy`, `unavailable`, `sabbatical`

**invitation_queue.priority**:

- `high`, `normal`, `low`

### Special Fields

**manuscripts.manuscript_tags** (text array, nullable):

- `NULL` = tags not yet evaluated
- `[]` = evaluated, no tags apply
- `['commissioned', 'transparent peer review']` = has tags

**manuscripts.version** (integer):

- `1` = original submission
- `2+` = revision number

## Export Current Schema

To update schema documentation:

```sql
-- Run this in Supabase SQL Editor
\i 99_export_schema.sql

-- Copy results to: reference/database-schema-export.md
```

## Common Tasks

### Add New User

```sql
-- User profile is created automatically on first login via auth trigger
-- To manually assign role:
UPDATE user_profiles
SET role = 'editor'
WHERE email = 'user@example.com';
```

### Assign Manuscript to User

```sql
INSERT INTO user_manuscripts (user_id, manuscript_id, role)
VALUES (
  (SELECT id FROM user_profiles WHERE email = 'editor@example.com'),
  'manuscript-uuid-here',
  'editor'
);
```

### Generate AI Match Scores

```sql
-- Insert match scores for a manuscript
INSERT INTO reviewer_manuscript_matches (manuscript_id, reviewer_id, match_score)
VALUES
  ('manuscript-uuid', 'reviewer-uuid-1', 0.85),
  ('manuscript-uuid', 'reviewer-uuid-2', 0.72),
  ('manuscript-uuid', 'reviewer-uuid-3', 0.68);
```

### Queue Reviewers for Invitation

```sql
INSERT INTO invitation_queue (
  manuscript_id,
  reviewer_id,
  queue_position,
  scheduled_send_date,
  priority
)
VALUES
  ('manuscript-uuid', 'reviewer-uuid-1', 1, NOW() + INTERVAL '1 day', 'high'),
  ('manuscript-uuid', 'reviewer-uuid-2', 2, NOW() + INTERVAL '2 days', 'normal');
```

## Troubleshooting

### RLS Policy Issues

If you get permission errors:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Verify your user role
SELECT role FROM user_profiles WHERE id = auth.uid();

-- View active policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### Missing Foreign Key Data

```sql
-- Check for orphaned records
SELECT m.id, m.title
FROM manuscripts m
LEFT JOIN user_manuscripts um ON m.id = um.manuscript_id
WHERE um.id IS NULL;
```

### Performance Issues

```sql
-- Check if indexes exist
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public';

-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM manuscripts
WHERE status = 'under_review';
```

## Migration History

**Current Version:** 2.0 (2025-12-09)

- v2.0: Complete rewrite with clean numbered migration files
- v1.x: Legacy incremental migrations (archived)

## Best Practices

1. **Always run migrations in order** (00 → 01 → 02 → 03)
2. **Test in development** before running in production
3. **Backup before cleanup** - `00_cleanup.sql` is destructive
4. **Export schema regularly** using `99_export_schema.sql`
5. **Keep documentation updated** in `reference/database-schema-export.md`
6. **Use transactions** when running multiple statements:
   ```sql
   BEGIN;
   -- your statements here
   COMMIT; -- or ROLLBACK if something fails
   ```

## Support

- **Schema Reference**: See `reference/database-schema-export.md`
- **Field Assumptions**: See `docs/development/field-assumptions.md`
- **Data Setup Guide**: See `docs/setup/DATA_SETUP_GUIDE.md`
