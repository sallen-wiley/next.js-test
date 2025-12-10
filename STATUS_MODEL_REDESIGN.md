# Review Invitation Status Model Redesign

## Overview

This document describes the complete redesign of the review invitation status model to align with Figma design specifications. The new model introduces derived states (overdue, expired) calculated at runtime rather than stored in the database, and adds new statuses for report management workflow.

## Status Model Changes

### Old Status Values (Removed)
- ~~`expired`~~ - Now derived from `pending` + past `invitation_expiration_date`
- ~~`completed`~~ - Renamed to `report_submitted`
- ~~`overdue`~~ - Now derived from `accepted` + past `due_date`

### New Status Values

| Status | Description | When Used | Can Transition To |
|--------|-------------|-----------|-------------------|
| `pending` | Invitation sent, awaiting response | Initial state after sending invitation | `accepted`, `declined`, `revoked` |
| `accepted` | Reviewer accepted invitation | Reviewer accepts review request | `report_submitted`, `declined`, `revoked` |
| `declined` | Reviewer declined invitation | Reviewer declines review request | `revoked` (editor can revoke declined) |
| `report_submitted` | Review report submitted | Reviewer submits review | `invalidated` |
| `invalidated` | Report invalidated by editor | Editor flags report as invalid | `report_submitted` (can be reinstated), `revoked` |
| `revoked` | Invitation cancelled/revoked | Editor cancels invitation | _(terminal state)_ |

### Derived States (Runtime Only)

These states are NOT stored in the database but calculated when displaying invitations:

- **Overdue**: `status = 'accepted'` AND `due_date < now()`
  - Displayed as dual-chip: `[Accepted]` + `[Overdue]` badge
  - Counted in BOTH "Accepted" and "Overdue" statistics

- **Expired**: `status = 'pending'` AND `invitation_expiration_date < now()`
  - Displayed as dual-chip: `[Pending]` + `[Expired]` badge
  - Counted separately from regular pending invitations

## Database Schema Changes

### New Columns Added

```sql
-- When pending invitation expires (default: 14 days from invited_date)
invitation_expiration_date TIMESTAMP WITH TIME ZONE

-- When report was invalidated (only set when status = 'invalidated')
report_invalidated_date TIMESTAMP WITH TIME ZONE

-- Free-form notes for status changes (reasons, context)
notes TEXT
```

### Updated Constraint

```sql
ALTER TABLE review_invitations
ADD CONSTRAINT review_invitations_status_check
CHECK (status IN (
  'pending',
  'accepted',
  'declined',
  'report_submitted',
  'invalidated',
  'revoked'
));
```

### Migration Strategy

```sql
-- Migrate old statuses to new model
UPDATE review_invitations SET status = 'report_submitted' WHERE status = 'completed';
UPDATE review_invitations SET status = 'accepted' WHERE status = 'overdue';
UPDATE review_invitations SET status = 'pending' WHERE status = 'expired';

-- Set default expiration dates for pending invitations
UPDATE review_invitations
SET invitation_expiration_date = invited_date + INTERVAL '14 days'
WHERE status = 'pending' AND invitation_expiration_date IS NULL;
```

## TypeScript Type Updates

### ReviewInvitation Interface

```typescript
export interface ReviewInvitation {
  id: string;
  manuscript_id: string;
  reviewer_id: string;
  invited_date: string;
  due_date: string;
  status:
    | "pending"
    | "accepted"
    | "declined"
    | "report_submitted"
    | "invalidated"
    | "revoked";
  response_date?: string;
  queue_position?: number;
  invitation_round: number;
  notes?: string;
  reminder_count: number;
  estimated_completion_date?: string;
  invitation_expiration_date?: string; // NEW
  report_invalidated_date?: string;    // NEW
}
```

### Reviewer Statistics

```typescript
export interface ReviewerStatsExtended {
  invited: number;      // Total sent
  agreed: number;       // Accepted
  declined: number;     // Declined
  submitted: number;    // Report submitted
  pending: number;      // Pending (includes expired)
  expired: number;      // Derived: pending + past expiration
  overdue: number;      // Derived: accepted + past due date
  invalidated: number;  // Invalidated reports
  revoked: number;      // Revoked invitations
}
```

## New Service Functions

### Report Management

```typescript
// Testing: Submit a review report
await submitReport(invitationId: string)

// Invalidate a submitted report (can be reversed)
await invalidateReport(invitationId: string, reason?: string)

// Reinstate an invalidated report
await uninvalidateReport(invitationId: string)

// Permanently cancel a review
await cancelReview(invitationId: string, reason?: string)

// Set invitation expiration (default: 14 days)
await setInvitationExpiration(invitationId: string, expirationDate?: string)
```

### Updated Functions

```typescript
// Now uses 'revoked' status instead of 'expired'
await revokeInvitation(invitationId: string, addBackToQueue?: boolean)
```

## UI/UX Changes

### Status Display Utility

New `getStatusDisplay()` utility returns display configuration:

```typescript
interface StatusDisplay {
  primaryStatus: ReviewInvitation["status"];
  badgeStatus?: "overdue" | "expired";
  primaryLabel: string;
  badgeLabel?: string;
  primaryColor: "default" | "primary" | "error" | "warning" | "success";
  badgeColor?: "warning" | "error";
}
```

### Dual-Chip Display Pattern

```tsx
<Box sx={{ display: "flex", gap: 0.5 }}>
  {/* Primary status chip */}
  <Chip label="Accepted" color="primary" size="small" />
  
  {/* Badge chip (if overdue/expired) */}
  {isOverdue && (
    <Chip 
      icon={<WarningIcon />}
      label="Overdue" 
      color="warning" 
      size="small" 
    />
  )}
</Box>
```

### Updated Menu Actions

**Reviewer Action Menu:**
- ✅ Submit Report (testing) - For `accepted` reviewers
- ✅ Force Accept - For `pending`/`declined` reviewers
- ✅ Force Decline - For `accepted`/`pending` reviewers
- ✅ Revoke Invitation - For `pending` OR `declined` (NEW: can revoke declined)
- ✅ Read Report - For `report_submitted` reviewers
- ✅ Invalidate Report - For `report_submitted` reviewers
- ✅ Reinstate Report - For `invalidated` reviewers
- ✅ Cancel Review - For `invalidated` or `revoked` reviewers
- ✅ Remove Invitation - For non-pending reviewers

## Statistics Calculation Logic

```typescript
function calculateReviewerStats(invitations) {
  const now = new Date();
  const stats = { invited: 0, agreed: 0, declined: 0, ... };
  
  invitations.forEach(invitation => {
    switch (invitation.status) {
      case "accepted":
        stats.agreed++;
        // Check for overdue (dual count)
        if (new Date(invitation.due_date) < now) {
          stats.overdue++;
        }
        break;
      case "pending":
        stats.pending++;
        // Check for expired (separate count)
        if (invitation.invitation_expiration_date && 
            new Date(invitation.invitation_expiration_date) < now) {
          stats.expired++;
        }
        break;
      case "report_submitted":
        stats.submitted++;
        break;
      case "invalidated":
        stats.invalidated++;
        break;
      case "revoked":
        stats.revoked++;
        break;
    }
  });
  
  return stats;
}
```

## Status Color Scheme

| Status | Color | Semantic Meaning |
|--------|-------|------------------|
| `pending` | default (gray) | Neutral, waiting |
| `accepted` | primary (blue) | Active, in progress |
| `declined` | default (gray) | Neutral, no action needed |
| `report_submitted` | success (green) | Completed successfully |
| `invalidated` | error (red) | Problem requiring attention |
| `revoked` | default (gray) | Neutral, cancelled |
| **overdue** (badge) | warning (orange) | Attention needed |
| **expired** (badge) | error (red) | Critical attention |

## Workflow Examples

### Happy Path: Successful Review

1. Editor sends invitation → `pending`
2. Reviewer accepts → `accepted`
3. Reviewer submits report → `report_submitted`
4. Editor approves report → (workflow complete)

### Deadline Management

1. Editor sends invitation → `pending` (expiration set to +14 days)
2. Reviewer accepts → `accepted` (due_date set to +30 days)
3. Review passes due_date → Still `accepted` + **Overdue** badge
4. Reviewer submits late report → `report_submitted`

### Report Invalidation & Reinstatement

1. Reviewer submits report → `report_submitted`
2. Editor finds issue → `invalidated` (with reason in notes)
3. Editor reconsiders → Reinstate → `report_submitted`
4. Report workflow continues

### Invitation Cancellation

1. Editor sends invitation → `pending`
2. Reviewer never responds → Still `pending` + **Expired** badge
3. Editor revokes → `revoked` (terminal state)

OR

1. Reviewer declines → `declined`
2. Editor revokes anyway → `revoked` (terminal state, can be used for record-keeping)

## Testing Checklist

- [x] Database migration script created
- [x] TypeScript types updated
- [x] Stats calculation handles derived states
- [x] Service functions implemented
- [x] Status display utility created
- [x] Menu actions wired up
- [ ] Run database migration
- [ ] Test all status transitions
- [ ] Verify dual-chip display
- [ ] Test stats accuracy (overdue counted twice)
- [ ] Verify RLS policies work with new statuses
- [ ] Test expiration date defaults (14 days)
- [ ] Validate menu action visibility per status

## Files Modified

### Database
- `database/03_status_model_update.sql` - Migration script

### TypeScript Types
- `src/lib/supabase.ts` - ReviewInvitation interface

### Utilities
- `src/utils/reviewerStats.ts` - Statistics calculation
- `src/utils/statusDisplay.ts` - Status display logic (NEW)

### Services
- `src/services/dataService.ts` - CRUD operations

### Components
- `src/app/reviewer-dashboard/manage-reviewers/page.tsx` - Main page with handlers
- `src/app/reviewer-dashboard/manage-reviewers/ReviewerActionMenu.tsx` - Menu actions
- `src/app/reviewer-dashboard/manage-reviewers/UnifiedQueueTab.tsx` - Dual-chip display

## Migration Execution

To apply the new status model to your Supabase database:

1. **Backup data** (recommended before any schema changes)
2. **Run migration script**:
   ```sql
   -- Execute database/03_status_model_update.sql in Supabase SQL Editor
   ```
3. **Verify migration**:
   ```sql
   -- Check status distribution
   SELECT status, COUNT(*) FROM review_invitations GROUP BY status;
   
   -- Check for pending without expiration
   SELECT COUNT(*) FROM review_invitations 
   WHERE status = 'pending' AND invitation_expiration_date IS NULL;
   ```
4. **Restart development server** to pick up type changes
5. **Test workflows** in UI

## Design Decisions & Rationale

### Why Derived States?

**Overdue** and **Expired** are derived at runtime rather than stored because:
- Reduces data redundancy (due_date already exists)
- Prevents stale data (always accurate)
- Simplifies database constraints
- Matches Figma design intent (dual-status display)

### Why Dual-Chip Display?

Displays primary status + contextual badge:
- Preserves workflow state (Accepted)
- Adds temporal context (Overdue)
- Enables filtering by either dimension
- Matches design system patterns

### Why Allow Revoking Declined Invitations?

User confirmed this is valuable for:
- Record-keeping consistency
- Handling edge cases
- Administrative cleanup
- Workflow completeness

### Default Expiration: 14 Days

Based on user confirmation:
- Industry standard for review invitations
- Balances urgency with flexibility
- Aligns with typical response times
- Can be customized per invitation if needed

## Future Enhancements

Potential additions not in current scope:
- Auto-expire pending invitations (scheduled job)
- Email reminders before expiration
- Customizable expiration periods per journal
- Bulk report validation workflow
- Report version history
- Reviewer performance metrics tied to timeliness
