# Database Cleanup Summary

**Date:** 2025-12-09  
**Action:** Reorganized SQL migration files into clean, numbered system

## What Changed

### New File Structure

```
database/
├── README.md                     # 📘 Complete guide to database setup
├── 00_cleanup.sql                # ⚠️  Drop all tables (reset database)
├── 01_core_tables.sql            # 🏗️  Create all tables, indexes, constraints
├── 02_rls_policies.sql           # 🔒 Set up Row Level Security
├── 03_seed_data.sql              # 🌱 Sample data (to be created)
├── 99_export_schema.sql          # 📊 Export current schema
└── archive/
    ├── README.md                 # Archive documentation
    └── [16 legacy files]         # Old incremental migrations
```

### Files Created

| File                   | Purpose                                           | Lines |
| ---------------------- | ------------------------------------------------- | ----- |
| `00_cleanup.sql`       | Complete database reset (drops all tables)        | ~50   |
| `01_core_tables.sql`   | Creates all 8 tables with indexes and constraints | ~450  |
| `02_rls_policies.sql`  | Sets up all RLS policies and helper functions     | ~350  |
| `99_export_schema.sql` | Exports schema for documentation updates          | ~100  |
| `README.md`            | Comprehensive database documentation              | ~450  |
| `archive/README.md`    | Legacy file documentation                         | ~150  |

### Files to Archive (Manual Step Required)

The following files should be **moved to `archive/`** folder:

- ✅ `add_manuscript_tags.sql`
- ✅ `add_manuscript_version.sql`
- ✅ `add_report_submitted_status.sql`
- ✅ `admin_role_implicit_access.sql`
- ✅ `allow_null_manuscript_tags.sql`
- ✅ `enable_write_operations.sql`
- ✅ `final_setup.sql`
- ✅ `fix_editor_id_nullable.sql`
- ✅ `invitation_queue_rls.sql`
- ✅ `remove_editor_id_from_manuscripts.sql`
- ✅ `reviewer_matches_rls.sql`
- ✅ `schema.sql`
- ✅ `seed_reviewer_matches.sql`
- ✅ `setup.sql`
- ✅ `update_manuscript_statuses.sql`
- ✅ `user_manuscripts_migration.sql`

## Schema Consolidation

### Tables Defined in `01_core_tables.sql`

All 8 tables with complete definitions:

1. **user_profiles** - User auth and RBAC (links to auth.users)
2. **manuscripts** - Submissions with 14 workflow statuses
3. **potential_reviewers** - Reviewer database with metrics
4. **user_manuscripts** - User-manuscript assignments (dashboard access)
5. **reviewer_manuscript_matches** - AI match scores (suggested reviewers)
6. **invitation_queue** - Queued invitations with priority
7. **review_invitations** - Active invitations with status tracking
8. **reviewer_metrics** - Aggregated performance data

### Security Defined in `02_rls_policies.sql`

Complete RLS implementation:

- ✅ RLS enabled on all 8 tables
- ✅ Helper functions: `has_role()`, `has_any_role()`
- ✅ 24 total policies covering all CRUD operations
- ✅ Role-based access (admin, editor, designer, reviewer, guest)
- ✅ Public read for reviewers/manuscripts (demo-friendly)
- ✅ User-scoped access for own manuscript assignments

## Key Improvements

### Before (v1.x - Incremental)

- 16+ migration files in root directory
- Unclear execution order
- Some files conflicted or superseded others
- Hard to understand current schema state
- Documentation drift

### After (v2.0 - Clean)

- 4 numbered core files (clear order)
- Single source of truth for each component
- Idempotent operations (safe to re-run)
- Complete documentation in README.md
- Legacy files archived with context

## Migration Strategy

### For Fresh Databases

Run in order:

```sql
\i 01_core_tables.sql
\i 02_rls_policies.sql
\i 03_seed_data.sql  -- optional
```

### For Existing Databases

**Option 1: Keep current (if working)**

- No action needed
- Current schema should match 01_core_tables.sql output
- RLS policies should match 02_rls_policies.sql

**Option 2: Reset to clean state**

```sql
-- ⚠️ Backup data first!
\i 00_cleanup.sql
\i 01_core_tables.sql
\i 02_rls_policies.sql
-- Restore data
```

## Testing Needed

Before finalizing, verify:

1. ✅ Current live database schema matches `01_core_tables.sql` output
2. ✅ Current RLS policies match `02_rls_policies.sql` definitions
3. ⚠️ Test fresh database setup (run 01 + 02 in clean environment)
4. ⚠️ Test 00_cleanup.sql (verify complete reset works)
5. ⚠️ Create 03_seed_data.sql with sample data
6. ⚠️ Update `reference/database-schema-export.md` using 99_export_schema.sql

## Next Steps

### Immediate Actions

1. **Move legacy files** to archive/ (commands below)
2. **Test fresh setup** in development environment
3. **Create seed data** file (03_seed_data.sql)
4. **Update schema export** using 99_export_schema.sql

### PowerShell Commands to Archive Files

```powershell
# Move legacy files to archive
Move-Item database\add_manuscript_tags.sql database\archive\
Move-Item database\add_manuscript_version.sql database\archive\
Move-Item database\add_report_submitted_status.sql database\archive\
Move-Item database\admin_role_implicit_access.sql database\archive\
Move-Item database\allow_null_manuscript_tags.sql database\archive\
Move-Item database\enable_write_operations.sql database\archive\
Move-Item database\final_setup.sql database\archive\
Move-Item database\fix_editor_id_nullable.sql database\archive\
Move-Item database\invitation_queue_rls.sql database\archive\
Move-Item database\remove_editor_id_from_manuscripts.sql database\archive\
Move-Item database\reviewer_matches_rls.sql database\archive\
Move-Item database\schema.sql database\archive\
Move-Item database\seed_reviewer_matches.sql database\archive\
Move-Item database\setup.sql database\archive\
Move-Item database\update_manuscript_statuses.sql database\archive\
Move-Item database\user_manuscripts_migration.sql database\archive\

# Remove the old export script (replaced by 99_export_schema.sql)
Remove-Item database\export_current_schema.sql
```

## Documentation Updates

### Files Updated

- ✅ Created `database/README.md` - comprehensive guide
- ✅ Created `database/archive/README.md` - legacy context
- ✅ Updated `.github/copilot-instructions.md` - references new structure

### Files to Update

- ⚠️ `reference/database-schema-export.md` - run 99_export_schema.sql to refresh
- ⚠️ `docs/setup/database-setup.md` - update to reference new numbered files
- ⚠️ `docs/setup/DATA_SETUP_GUIDE.md` - update migration instructions

## Benefits

### Developer Experience

- Clear, numbered execution order
- Single file per major component
- Comprehensive inline documentation
- Easy to understand current state

### Maintenance

- Reduced file count (4 vs 16+)
- No conflicting migrations
- Idempotent operations
- Version-controlled schema

### Onboarding

- New developers run 2-3 files total
- README explains everything
- Legacy context preserved in archive
- Clear migration path from old to new

## Schema Version

**Current Version:** 2.0

**Breaking Changes:** None (schema is identical, just reorganized)

**Migration Required:** No (existing databases work as-is)

**Recommendation:** Archive old files, use new numbered system going forward
