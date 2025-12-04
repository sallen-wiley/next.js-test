# Schema Update Summary - December 4, 2025

## ✅ Completed Tasks

### 1. Schema Export from Supabase

- Created `database/export_current_schema.sql` - comprehensive query to extract schema
- Verified all 8 tables exist in production
- Exported column definitions, constraints, foreign keys, and RLS policies

### 2. Updated Documentation

- **`reference/database-schema-export.md`** - Fully updated with live data
  - All 8 table structures documented
  - CHECK constraints for status values
  - UNIQUE constraints
  - Foreign key relationships
  - RLS policies for all tables
  - Added notes about two-table queue system

### 3. Key Findings

#### Two-Table Queue System Confirmed ✅

The system uses **two separate tables** for the reviewer invitation workflow:

**`invitation_queue` table:**

- Purpose: Staging area for reviewers waiting to be invited
- Fields: `queue_position`, `priority`, `scheduled_send_date`, `sent`, `sent_at`
- Use case: Editor queues reviewers in order, system sends them out over time

**`review_invitations` table:**

- Purpose: Active invitations that have been sent to reviewers
- Fields: `status`, `invited_date`, `response_date`, `reminder_count`, `due_date`
- Status values: 'pending', 'accepted', 'declined', 'expired', 'completed', 'overdue'
- Note: Has a `queue_position` field that appears to be legacy/unused

#### All Migrations Applied ✅

- `user_manuscripts_migration.sql` - Applied
- `invitation_queue_rls.sql` - Applied (write operations enabled)
- All RLS policies are active and correct

## 📋 Schema Status

### Tables (8 total)

1. ✅ `invitation_queue` - Queue for future invitations
2. ✅ `manuscripts` - Manuscript submissions
3. ✅ `potential_reviewers` - Reviewer database
4. ✅ `review_invitations` - Sent invitations
5. ✅ `reviewer_manuscript_matches` - AI match scores
6. ✅ `reviewer_metrics` - Historical performance
7. ✅ `user_manuscripts` - User-manuscript assignments
8. ✅ `user_profiles` - User auth and RBAC

### RLS Policies

- ✅ All tables have proper Row Level Security enabled
- ✅ `invitation_queue` - Authenticated users can read/write
- ✅ `review_invitations` - Authenticated users can read/write
- ✅ `manuscripts` - Public read, admin/designer write
- ✅ `potential_reviewers` - Public read, admin/designer write
- ✅ `user_manuscripts` - Role-based (users see own, admins/editors see all)
- ✅ `user_profiles` - Full RBAC implementation

## 🔄 Next Steps for Queue UX Update

Based on the verified schema, we can now proceed with:

1. **Database Changes Needed:**

   - Add 'report_submitted' to `review_invitations.status` CHECK constraint
   - (Optional) Add `queue_active` boolean to `manuscripts` table

2. **TypeScript Type Updates:**

   - Update `ReviewInvitation` interface in `src/lib/supabase.ts`
   - Add new combined types for UX (ReviewerWithStatus)

3. **Data Service Functions:**

   - Create combined query to get reviewers with their current status
   - Add queue management functions (move up/down, revoke, etc.)

4. **UI Implementation:**
   - Build unified Queue & Invitations tab with MUI DataGrid
   - Implement row ordering for queued reviewers
   - Add 3-dot menu with contextual actions
   - Add queue control toggle (start/stop auto-send)

## 📁 Updated Files

- ✅ `reference/database-schema-export.md` - Complete schema documentation
- ✅ `database/export_current_schema.sql` - Reusable export query
- ✅ This summary document

## 🔍 Verification Commands

To re-verify schema in future:

```sql
-- Run in Supabase SQL Editor
\i database/export_current_schema.sql
```

To check table existence:

```sql
SELECT tablename,
       CASE WHEN tablename IN (
           SELECT tablename FROM pg_tables WHERE schemaname = 'public'
       ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (VALUES
    ('invitation_queue'), ('manuscripts'), ('potential_reviewers'),
    ('review_invitations'), ('reviewer_manuscript_matches'),
    ('reviewer_metrics'), ('user_manuscripts'), ('user_profiles')
) AS expected(tablename);
```

## 📚 Reference

- Schema export: `reference/database-schema-export.md`
- Export query: `database/export_current_schema.sql`
- TypeScript types: `src/lib/supabase.ts`
- Data services: `src/services/dataService.ts`

---

**Status:** Schema documentation is now current and verified ✅  
**Ready for:** Queue UX implementation planning
