# Archived SQL Files

This directory contains legacy migration files from the incremental development process.

## ⚠️ Do Not Use These Files

These files are kept for **historical reference only**. They represent the evolution of the database schema during development.

**For new database setup, use the numbered files in the parent directory:**

- `01_core_tables.sql`
- `02_rls_policies.sql`
- `03_seed_data.sql`

## Archive Contents

### Files Moved from Root (2025-12-09)

- `add_manuscript_tags.sql` - Added manuscript_tags column (superseded by 01_core_tables.sql)
- `add_manuscript_version.sql` - Added version field (superseded by 01_core_tables.sql)
- `add_report_submitted_status.sql` - Added status values (superseded by 01_core_tables.sql)
- `admin_role_implicit_access.sql` - RLS policy updates (superseded by 02_rls_policies.sql)
- `allow_null_manuscript_tags.sql` - Changed tags default to NULL (superseded by 01_core_tables.sql)
- `enable_write_operations.sql` - RLS policy updates (superseded by 02_rls_policies.sql)
- `final_setup.sql` - Legacy setup script (superseded by 01_core_tables.sql)
- `fix_editor_id_nullable.sql` - Schema correction (no longer needed)
- `invitation_queue_rls.sql` - RLS policies (superseded by 02_rls_policies.sql)
- `remove_editor_id_from_manuscripts.sql` - Removed editor_id FK (superseded by 01_core_tables.sql)
- `reviewer_matches_rls.sql` - RLS policies (superseded by 02_rls_policies.sql)
- `schema.sql` - Original schema (superseded by 01_core_tables.sql)
- `seed_reviewer_matches.sql` - Sample data (superseded by 03_seed_data.sql)
- `setup.sql` - Original setup script (superseded by 01_core_tables.sql)
- `update_manuscript_statuses.sql` - Status enum updates (superseded by 01_core_tables.sql)
- `user_manuscripts_migration.sql` - User-manuscript junction table (superseded by 01_core_tables.sql)

### Original Archive Files

- `fix_rls_policies.sql` - Early RLS policy fixes
- `role_system_update.sql` - RBAC implementation updates

## Migration Path

If you have an existing database with these legacy migrations applied:

**Option 1: Continue with incremental updates (not recommended)**

- Your database may work, but schema could drift from documentation

**Option 2: Fresh start (recommended)**

```sql
-- Backup your data first!
\i 00_cleanup.sql
\i 01_core_tables.sql
\i 02_rls_policies.sql
-- Restore your data
```

## Why These Were Archived

During development, the database schema evolved through many small incremental migrations. This created:

- **Complexity**: Hard to understand full schema state
- **Inconsistency**: Different environments might have different migration states
- **Documentation drift**: Hard to keep docs in sync with many files

The new numbered migration system provides:

- **Single source of truth**: One file per major component
- **Idempotent operations**: Can be re-run safely
- **Clear ordering**: Obvious execution sequence
- **Better documentation**: Schema matches code matches docs

## Historical Context

These files represent the development journey from:

- Initial schema design
- Adding user-manuscript relationships
- Implementing RLS policies
- Adding manuscript tags and versioning
- Refining status workflows
- Optimizing for the reviewer dashboard

All of this learning is now consolidated into the clean v2.0 migration files.
