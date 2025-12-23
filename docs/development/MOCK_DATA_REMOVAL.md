# Mock Data Removal Guide

**Date**: December 23, 2025  
**Status**: In Progress

## Overview

This guide tracks the removal of mock data infrastructure from the application. The decision was made to focus solely on real Supabase data to reduce maintenance overhead.

## Completed Changes

### ✅ Documentation Updates

- **SETUP_GUIDE.md** - Removed all `USE_MOCK_DATA` references
- Simplified to two modes: auth enabled/disabled (no mock data mode)
- Updated environment variable examples
- Clarified database setup requirements

## Code Changes Required

### High Priority - Active Code Paths

#### 1. `src/services/dataService.ts`

**Lines**: 1, 409-450+  
**Issue**: Service class still checks `USE_MOCK_DATA` and has mock data fallbacks  
**Action Required**:

- Remove `useMockData` property
- Remove mock data conditional logic in methods
- Delete mock data constants (mockArticles, mockManuscript, etc.) if not used elsewhere
- Simplify methods to only use Supabase queries

#### 2. `src/app/api/articles/route.ts`

**Lines**: 1, 3, 7, 28, 115, 183, 227-228  
**Issue**: API route has `USE_MOCK_DATA` checks and imports mock data  
**Action Required**:

- Remove `USE_MOCK_DATA` constant
- Remove all conditional branches for mock data
- Remove import of `mockArticles`
- Simplify to Supabase-only implementation

### Low Priority - Documentation/Legacy

#### 3. `docs/development/WRITE_OPERATIONS_UPGRADE.md`

**Lines**: 6, 30, 51, 242-267  
**Issue**: Development guide references mock data workflow  
**Action Required**:

- Update to show Supabase-only workflow
- Remove mock data testing steps
- Update examples to use real database

#### 4. `docs/setup/DATA_SETUP_GUIDE.md`

**Lines**: 5, 7, 52, 70, 77, 101  
**Issue**: Setup guide still mentions mock data mode  
**Action Required**:

- Rewrite to focus on Supabase setup only
- Remove mock data sections
- Update quick start to require database

#### 5. `docs/setup/authentication-guide.md`

**Line**: 51  
**Issue**: Single reference to `USE_MOCK_DATA=false`  
**Action Required**:

- Remove the environment variable from example

#### 6. `docs/setup/TEST_USER_GUIDE.md`

**Line**: 63  
**Issue**: Single reference in environment example  
**Action Required**:

- Remove from environment variable list

### 🗑️ Legacy Data - Safe to Archive

The following mock data exports may be referenced by legacy code but should be phased out:

**From dataService.ts:**

- `mockArticles` (legacy article data)
- `mockManuscript` (sample manuscript)
- `mockPotentialReviewers` (sample reviewers)
- `mockReviewInvitations` (sample invitations)
- `mockInvitationQueue` (sample queue items)

**Recommendation**: Search for imports of these before deletion to ensure no breaking changes.

## Environment Variable Cleanup

### ❌ Remove Completely

- `USE_MOCK_DATA` - No longer supported

### ✅ Keep

- `NEXT_PUBLIC_SUPABASE_URL` - Required
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Required
- `NEXT_PUBLIC_ENABLE_AUTH` - Optional (default: false)
- `NEXT_PUBLIC_AUTH_TYPE` - Optional (default: supabase)

## Migration Steps for Developers

1. **Update `.env.local`** - Remove `USE_MOCK_DATA` line
2. **Verify database setup** - Ensure all tables exist in Supabase
3. **Test without mock data** - All features should work with real database
4. **Update code** - Remove mock data conditionals from any custom code

## Testing Checklist

Before removing mock data code, verify these features work with real database:

- [ ] Manuscript listing and filtering
- [ ] Reviewer search and filtering
- [ ] Invitation creation and management
- [ ] Queue management
- [ ] User authentication and RBAC
- [ ] All API endpoints in `/api/articles/`

## Rollback Plan

If issues arise:

1. Mock data code remains in codebase but inactive
2. Can temporarily re-enable by restoring `USE_MOCK_DATA` checks
3. Database is always the primary data source

## Next Steps

1. **Phase 1** (Immediate): Update all documentation ✅
2. **Phase 2** (Next PR): Remove code-level mock data infrastructure
3. **Phase 3** (Cleanup): Delete unused mock data exports and tests

## Notes

- The app has been running primarily on real data for months
- Mock data was mostly used during early development
- Removing mock data simplifies codebase and reduces confusion
- All new features should be built against real Supabase data only
