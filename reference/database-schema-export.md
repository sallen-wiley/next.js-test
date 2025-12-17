# Database Schema Export

⚠️ **This document is DEPRECATED and may be outdated.**

## Get Current Schema

**Always use the schema export script for up-to-date information:**

```bash
node database/reviewer-ingestion/export-schema.js
```

This generates timestamped JSON exports in `database/schema-exports/` with complete metadata including:

- All column names, types, and constraints
- Foreign key relationships
- RLS policies
- Row counts and indexes

**Latest exports:** See `database/schema-exports/` directory

---

## Legacy Documentation (DO NOT TRUST - Use export script instead)

## Table Summary

All 8 tables exist and are verified: ✅

- `invitation_queue` - Queued reviewers awaiting invitation
- `manuscripts` - Manuscript submissions
- `potential_reviewers` - Reviewer database
- `review_invitations` - Sent invitations with status tracking
- `reviewer_manuscript_matches` - AI-generated match scores
- `reviewer_metrics` - Historical reviewer performance
- `user_manuscripts` - User-manuscript assignments
- `user_profiles` - User authentication and RBAC

## Table Structures

### invitation_queue

| Column              | Type        | Nullable | Default           |
| ------------------- | ----------- | -------- | ----------------- |
| id                  | uuid        | NO       | gen_random_uuid() |
| manuscript_id       | uuid        | YES      | null              |
| reviewer_id         | uuid        | YES      | null              |
| queue_position      | integer     | NO       | null              |
| created_date        | timestamptz | YES      | now()             |
| scheduled_send_date | timestamptz | NO       | null              |
| priority            | text        | YES      | 'normal'::text    |
| notes               | text        | YES      | null              |
| sent                | boolean     | YES      | false             |
| sent_at             | timestamptz | YES      | null              |

**Priority Values:** 'high', 'normal', 'low'
**Foreign Keys:** manuscript_id → manuscripts(id), reviewer_id → potential_reviewers(id)

### manuscripts

| Column          | Type        | Nullable | Default           |
| --------------- | ----------- | -------- | ----------------- |
| id              | uuid        | NO       | gen_random_uuid() |
| title           | text        | NO       | null              |
| authors         | ARRAY       | NO       | '{}'::text[]      |
| journal         | text        | NO       | null              |
| submission_date | timestamptz | YES      | now()             |
| doi             | text        | YES      | null              |
| abstract        | text        | YES      | null              |
| keywords        | ARRAY       | YES      | '{}'::text[]      |
| subject_area    | text        | YES      | null              |
| status          | text        | YES      | 'submitted'::text |
| editor_id       | text        | NO       | null              |
| created_at      | timestamptz | YES      | now()             |
| updated_at      | timestamptz | YES      | now()             |

**Status Values:** 'submitted', 'under_review', 'revision_required', 'accepted', 'rejected'

### potential_reviewers

| Column                   | Type        | Nullable | Default           |
| ------------------------ | ----------- | -------- | ----------------- |
| id                       | uuid        | NO       | gen_random_uuid() |
| name                     | text        | NO       | null              |
| email                    | text        | NO       | null              |
| affiliation              | text        | NO       | null              |
| department               | text        | YES      | null              |
| expertise_areas          | ARRAY       | YES      | '{}'::text[]      |
| current_review_load      | integer     | YES      | 0                 |
| max_review_capacity      | integer     | YES      | 3                 |
| average_review_time_days | integer     | YES      | 21                |
| recent_publications      | integer     | YES      | 0                 |
| h_index                  | integer     | YES      | null              |
| last_review_completed    | date        | YES      | null              |
| availability_status      | text        | YES      | 'available'::text |
| response_rate            | numeric     | YES      | 0.0               |
| quality_score            | numeric     | YES      | 0.0               |
| conflicts_of_interest    | ARRAY       | YES      | '{}'::text[]      |
| created_at               | timestamptz | YES      | now()             |
| updated_at               | timestamptz | YES      | now()             |

**Availability Status Values:** 'available', 'busy', 'unavailable', 'sabbatical'
**Unique Constraint:** email must be unique

### review_invitations

| Column                    | Type        | Nullable | Default           |
| ------------------------- | ----------- | -------- | ----------------- |
| id                        | uuid        | NO       | gen_random_uuid() |
| manuscript_id             | uuid        | YES      | null              |
| reviewer_id               | uuid        | YES      | null              |
| invited_date              | timestamptz | YES      | now()             |
| due_date                  | timestamptz | NO       | null              |
| status                    | text        | YES      | 'pending'::text   |
| response_date             | timestamptz | YES      | null              |
| queue_position            | integer     | YES      | null              |
| invitation_round          | integer     | YES      | 1                 |
| notes                     | text        | YES      | null              |
| reminder_count            | integer     | YES      | 0                 |
| estimated_completion_date | date        | YES      | null              |
| created_at                | timestamptz | YES      | now()             |
| updated_at                | timestamptz | YES      | now()             |

**Status Values:** 'pending', 'accepted', 'declined', 'expired', 'completed', 'overdue'
**Foreign Keys:** manuscript_id → manuscripts(id), reviewer_id → potential_reviewers(id)
**Note:** queue_position field appears to be legacy/unused (invitation_queue table handles queueing)

### reviewer_manuscript_matches

| Column        | Type        | Nullable | Default           |
| ------------- | ----------- | -------- | ----------------- |
| id            | uuid        | NO       | gen_random_uuid() |
| manuscript_id | uuid        | YES      | null              |
| reviewer_id   | uuid        | YES      | null              |
| match_score   | numeric     | NO       | null              |
| calculated_at | timestamptz | YES      | now()             |

**Unique Constraint:** (manuscript_id, reviewer_id) must be unique
**Foreign Keys:** manuscript_id → manuscripts(id), reviewer_id → potential_reviewers(id)

### reviewer_metrics

| Column                      | Type        | Nullable | Default           |
| --------------------------- | ----------- | -------- | ----------------- |
| id                          | uuid        | NO       | gen_random_uuid() |
| reviewer_id                 | uuid        | YES      | null              |
| total_invitations           | integer     | YES      | 0                 |
| total_acceptances           | integer     | YES      | 0                 |
| total_completions           | integer     | YES      | 0                 |
| average_response_time_hours | numeric     | YES      | 0.0               |
| average_review_time_days    | numeric     | YES      | 0.0               |
| current_load                | integer     | YES      | 0                 |
| last_activity_date          | timestamptz | YES      | null              |
| updated_at                  | timestamptz | YES      | now()             |

**Unique Constraint:** reviewer_id must be unique
**Foreign Key:** reviewer_id → potential_reviewers(id)

### user_manuscripts

| Column        | Type        | Nullable | Default           |
| ------------- | ----------- | -------- | ----------------- |
| id            | uuid        | NO       | gen_random_uuid() |
| user_id       | uuid        | NO       | null              |
| manuscript_id | uuid        | NO       | null              |
| assigned_date | timestamptz | YES      | now()             |
| role          | text        | YES      | 'editor'::text    |
| is_active     | boolean     | YES      | true              |
| created_at    | timestamptz | YES      | now()             |
| updated_at    | timestamptz | YES      | now()             |

**Role Values:** 'editor', 'author', 'collaborator', 'reviewer'
**Unique Constraint:** (user_id, manuscript_id) must be unique
**Foreign Keys:** user_id → user_profiles(id), manuscript_id → manuscripts(id)
**Purpose:** Links users to manuscripts they can manage/view in reviewer dashboard

### user_profiles

| Column      | Type        | Nullable | Default       |
| ----------- | ----------- | -------- | ------------- |
| id          | uuid        | NO       | null          |
| email       | text        | NO       | null          |
| full_name   | text        | YES      | null          |
| role        | text        | YES      | 'guest'::text |
| department  | text        | YES      | null          |
| permissions | ARRAY       | YES      | '{}'::text[]  |
| is_active   | boolean     | YES      | true          |
| last_login  | timestamptz | YES      | null          |
| created_at  | timestamptz | YES      | now()         |
| updated_at  | timestamptz | YES      | now()         |

**Role Values:** 'admin', 'editor', 'designer', 'product_manager', 'reviewer', 'guest'
**Unique Constraint:** email must be unique
**Foreign Key:** id → auth.users(id)

## Row Level Security Policies

### invitation_queue

- ✅ **Authenticated users can view queue** (SELECT) - auth.uid() IS NOT NULL
- ✅ **Authenticated users can insert to queue** (INSERT) - auth.uid() IS NOT NULL
- ✅ **Authenticated users can update queue** (UPDATE) - auth.uid() IS NOT NULL
- ✅ **Authenticated users can delete from queue** (DELETE) - auth.uid() IS NOT NULL

### manuscripts

- ✅ **Enable read access for all users** (SELECT) - public access
- ✅ **Enable insert for admin and designer** (INSERT) - no restrictions
- ✅ **Enable update for admin and designer** (UPDATE) - requires admin or designer role
- ✅ **Enable delete for admin and designer** (DELETE) - requires admin or designer role

### potential_reviewers

- ✅ **Enable read access for all users** (SELECT) - public access
- ✅ **Enable insert for admin and designer** (INSERT) - no restrictions
- ✅ **Enable update for admin and designer** (UPDATE) - requires admin or designer role
- ✅ **Enable delete for admin and designer** (DELETE) - requires admin or designer role

### review_invitations

- ✅ **Authenticated users can view invitations** (SELECT) - auth.uid() IS NOT NULL
- ✅ **Authenticated users can insert invitations** (INSERT) - auth.uid() IS NOT NULL
- ✅ **Authenticated users can update invitations** (UPDATE) - auth.uid() IS NOT NULL
- ✅ **Authenticated users can delete invitations** (DELETE) - auth.uid() IS NOT NULL

### reviewer_manuscript_matches

- ✅ **Enable read access for all users** (SELECT) - public access

### reviewer_metrics

- ✅ **Enable read access for all users** (SELECT) - public access

### user_manuscripts

- ✅ **Users can view own manuscript assignments** (SELECT) - user_id = auth.uid()
- ✅ **Admins and editors can view all assignments** (SELECT) - role in ('admin', 'editor')
- ✅ **Admins and editors can create assignments** (INSERT) - role in ('admin', 'editor')
- ✅ **Admins and editors can update assignments** (UPDATE) - role in ('admin', 'editor')
- ✅ **Admins can delete assignments** (DELETE) - role = 'admin'

### user_profiles

- ✅ **read_all_profiles** (SELECT) - authenticated users can read all profiles
- ✅ **insert_own_profile** (INSERT) - authenticated users can insert
- ✅ **update_profiles** (UPDATE) - users can update own profile OR admins can update any

## Key Relationships

### Foreign Key Constraints

**invitation_queue:**

- manuscript_id → manuscripts(id)
- reviewer_id → potential_reviewers(id)

**review_invitations:**

- manuscript_id → manuscripts(id)
- reviewer_id → potential_reviewers(id)

**reviewer_manuscript_matches:**

- manuscript_id → manuscripts(id)
- reviewer_id → potential_reviewers(id)

**reviewer_metrics:**

- reviewer_id → potential_reviewers(id)

**user_manuscripts:**

- user_id → user_profiles(id)
- manuscript_id → manuscripts(id)

**user_profiles:**

- id → auth.users(id) ON DELETE CASCADE

## Migration Status

### ✅ All Tables Verified (2025-12-04)

All 8 tables exist and have correct schemas:

- ✅ `invitation_queue` - Write policies enabled for authenticated users
- ✅ `manuscripts` - Public read, admin/designer write
- ✅ `potential_reviewers` - Public read, admin/designer write
- ✅ `review_invitations` - Write policies enabled for authenticated users
- ✅ `reviewer_manuscript_matches` - Public read access
- ✅ `reviewer_metrics` - Public read access
- ✅ `user_manuscripts` - Role-based access (users see own, admins/editors see all)
- ✅ `user_profiles` - Full RBAC implementation

### 🔄 Applied Migrations

- `user_manuscripts_migration.sql` - ✅ Applied
- `invitation_queue_rls.sql` - ✅ Applied (write operations enabled)
- `seed_reviewer_matches.sql` - ⚠️ Verify if needed (creates AI match scores)

## Notes

### invitation_queue vs review_invitations

The system uses **two separate tables** for the invitation workflow:

1. **`invitation_queue`** - Staging area for future invitations

   - Reviewers waiting to be invited
   - Has `queue_position` for ordering
   - Has `priority` field (high/normal/low)
   - Has `sent` boolean to track when moved to invitations
   - Has `scheduled_send_date` for automation

2. **`review_invitations`** - Active sent invitations
   - Invitations that have been sent to reviewers
   - Status tracking: pending → accepted/declined → completed/overdue
   - Has `queue_position` field (appears to be legacy/unused)
   - Response tracking with dates and reminder counts

**Workflow:** Queue item → (send action) → Review invitation

### Schema Export Process

To update this file in the future:

1. Run `database/export_current_schema.sql` in Supabase SQL Editor
2. Copy all 7 result sets
3. Update this markdown file with latest schema details
4. Verify table counts and constraints match

**Last verified:** 2025-12-04 - All 8 tables confirmed with complete RLS policies
