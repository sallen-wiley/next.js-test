# Reviewer Profile Drawer - Data Flow & Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Reviewer Profile Drawer                  │
│                  (ReviewerProfileDrawer.tsx)                │
└─────────────────────────────────────────────────────────────┘
           ↓                      ↓                      ↓
    ┌─────────────┐      ┌──────────────────┐   ┌─────────────┐
    │   Fetch     │      │   Fetch          │   │   Fetch     │
    │ Reviewer    │      │ Publications     │   │ Retractions │
    │   Base      │      │   for Reviewer   │   │   (if any)  │
    │  Data       │      │                  │   │             │
    └─────────────┘      └──────────────────┘   └─────────────┘
           ↓                      ↓                      ↓
    ┌──────────────────────────────────────────────────────────┐
    │              Supabase Database Tables                    │
    │                                                          │
    │  • potential_reviewers                                 │
    │  • reviewer_publications                               │
    │  • reviewer_retractions                                │
    └──────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
ReviewerProfileDrawer (Main Component)
├── MUI Drawer (Container)
├── Header Section
│   ├── Title "Reviewer Details"
│   └── Close Button
├── Content Section (scrollable)
│   ├── User Info Card
│   │   ├── Name + External Links
│   │   ├── Email + Institution Badge
│   │   └── Alert Badges (Conflict, Previous)
│   ├── Divider
│   ├── Strong/Weak Points Alerts
│   ├── Relevant Publications Section
│   │   ├── Publication Cards
│   │   └── "See All" Link
│   ├── Publication Metrics Grid
│   ├── Keywords Section
│   ├── Current Workload Metrics
│   ├── Reviewer Performance Metrics
│   └── Feedback Widget
└── Footer Section
    ├── "Add to Queue" Button
    └── "Invite Reviewer" Button
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  User clicks "View Profile" on Reviewer Row                │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  onViewProfile(reviewerId) called                           │
│  → openDrawer(reviewerId) hook function                    │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  ReviewerProfileDrawer state updated:                       │
│  - open: true                                              │
│  - reviewerId: "uuid-123"                                  │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Drawer opens (animation: 300ms slide-in)                   │
│  useEffect triggers: open && reviewerId → fetch data       │
└─────────────────────────────────────────────────────────────┘
                         ↓
            ┌────────────┼────────────┐
            ↓            ↓            ↓
    ┌────────────┐ ┌──────────┐ ┌─────────────┐
    │ Fetch Base │ │ Fetch    │ │ Fetch       │
    │ Reviewer   │ │Publicat- │ │Retractions  │
    │ (parallel) │ │ions      │ │             │
    └────────────┘ └──────────┘ └─────────────┘
            ↓            ↓            ↓
            └────────────┼────────────┘
                         ↓
        ┌────────────────────────────────┐
        │ Combine Data with Calculations │
        │ - email_is_institutional       │
        │ - acceptance_rate (%)          │
        │ - publications_last_5_years    │
        │ - related_publications_count   │
        │ - etc.                         │
        └────────────────────────────────┘
                         ↓
        ┌────────────────────────────────┐
        │ setState(profile)               │
        └────────────────────────────────┘
                         ↓
        ┌────────────────────────────────┐
        │ Render Drawer Content           │
        │ (now with all data)             │
        └────────────────────────────────┘
```

## Database Query Strategy

### Query 1: Base Reviewer Data

```sql
SELECT * FROM potential_reviewers
WHERE id = $1
```

**Fields fetched:**

- Profile: name, email, affiliation, department
- Metrics: h_index, current_review_load, max_review_capacity
- Status: availability_status, previous_reviewer
- IDs: orcid_id, external_id, profile_url
- Counts: completed_reviews, total_invitations, total_acceptances

### Query 2: Publications

```sql
SELECT * FROM reviewer_publications
WHERE reviewer_id = $1
ORDER BY publication_date DESC
LIMIT 4  -- Top 4 in drawer
```

**Fields fetched:**

- title, doi, journal_name, publication_date
- authors[], is_related (boolean)

### Query 3: Retractions

```sql
SELECT * FROM reviewer_retractions
WHERE reviewer_id = $1
```

**Fields fetched:**

- retraction_reasons[] (array)

## Calculated Fields

These are computed from fetched data (client-side):

| Field                      | Calculation                                   | Source       |
| -------------------------- | --------------------------------------------- | ------------ |
| email_is_institutional     | Check if email domain is NOT public           | email field  |
| acceptance_rate            | (total_acceptances / total_invitations) × 100 | DB counts    |
| related_publications_count | Count where is_related = true                 | publications |
| solo_authored_count        | Count where authors.length = 1                | publications |
| publications_last_5_years  | Count where year >= current_year - 5          | publications |
| days_since_last_review     | Days between now and last_review_completed    | date field   |

## State Management

### Hook State (useReviewerProfileDrawer)

```typescript
{
  open: boolean,              // Drawer visibility
  reviewerId: string | null,  // Which reviewer to show
  openDrawer: (id) => void,   // Open with reviewer
  closeDrawer: () => void     // Close drawer
}
```

### Component State (ReviewerProfileDrawer)

```typescript
{
  reviewer: ReviewerProfile | null,  // All fetched data
  loading: boolean,                   // Fetching indicator
  error: string | null                // Error message
}
```

## Props & Callbacks

### Input Props

```typescript
interface ReviewerProfileDrawerProps {
  open: boolean; // Control visibility
  onClose: () => void; // Close signal
  reviewerId: string | null; // Reviewer to display
  onAddToQueue?: (id) => void; // Queue callback (optional)
  onInvite?: (id) => void; // Invite callback (optional)
}
```

### Callback Flow

```
User clicks "Add to Queue" button
        ↓
handleAddToQueue() called
        ↓
onAddToQueue(reviewer.id) callback fired (if provided)
        ↓
Parent component handles the action
        ↓
Parent can call closeDrawer() to close
```

## Component Integration Points

### On Manage Reviewers Page:

```
Page Component
├── useReviewerProfileDrawer hook (state management)
├── ReviewerSearchAndTable
│   └── onViewProfile callback passed down
│       └── Calls openDrawer(reviewerId)
└── ReviewerProfileDrawer component
    ├── Receives open, reviewerId from hook
    ├── Receives action callbacks from page
    └── Renders drawer
```

### Adding to New Page:

```
New Page Component
├── useReviewerProfileDrawer hook (new state)
├── Your Reviewer List/Table
│   └── Click handler calls openDrawer(id)
└── ReviewerProfileDrawer component
    └── Integrated same way
```

## Event Flow Diagram

```
┌──────────────────┐
│ User Interaction │
└────────┬─────────┘
         │
         ├─→ "View Profile" click
         │   ├─→ onViewProfile(id)
         │   └─→ openDrawer(id)
         │       └─→ setState({open: true, reviewerId: id})
         │
         ├─→ "Add to Queue" click
         │   ├─→ handleAddToQueue(id)
         │   └─→ onAddToQueue(id) [callback]
         │
         ├─→ "Invite Reviewer" click
         │   ├─→ handleInvite(id)
         │   └─→ onInvite(id) [callback]
         │
         └─→ Close (X or ESC)
             ├─→ onClose()
             └─→ closeDrawer()
                 └─→ setState({open: false})
```

## Styling & Theme Integration

```
MUI ThemeProvider
    ↓
ReviewerProfileDrawer picks up:
├── Primary color (buttons, links)
├── Background colors (paper, default)
├── Text colors (primary, secondary)
├── Spacing scale (8px base)
├── Typography variants (h3, body1, etc.)
├── Success/Warning/Error colors
└── Light/Dark mode (automatically)
```

## Responsive Breakpoints

```
xs (mobile: 0-599px)
├── Drawer width: 100% (full screen)
└── Layout: Vertical stack

sm (tablet: 600-959px)
├── Drawer width: 600px
├── Layout: Two columns (when space)
└── Typography: Slightly smaller

md+ (desktop: 960px+)
├── Drawer width: 780px
├── Layout: Full featured
└── Typography: Full size
```

## Error Handling Flow

```
fetchReviewerProfile(id)
    ↓
    ├─→ Try: Fetch base reviewer
    │   ├─→ Error? → setError() → Show Alert
    │   └─→ Success → Continue
    │
    ├─→ Try: Fetch publications
    │   ├─→ Error? → Log, continue (non-blocking)
    │   └─→ Success → Continue
    │
    ├─→ Try: Fetch retractions
    │   ├─→ Error? → Log, continue (non-blocking)
    │   └─→ Success → Continue
    │
    └─→ Finally: setLoading(false) → Render
```

## Performance Optimization

```
Optimization Techniques Used:

1. Lazy Loading
   └─ Data fetched only when drawer opens

2. Parallel Queries
   └─ All DB queries run simultaneously

3. Publications Limit
   └─ Show 4 in drawer, link to see all

4. Client-side Calculations
   └─ No extra DB queries for derived fields

5. Memoized Components
   └─ Prevent unnecessary re-renders

6. useCallback for Handlers
   └─ Stable function references
```

## Security Considerations

```
Row Level Security (RLS):
├─ Users can only read their own data
├─ potential_reviewers: Public read
├─ reviewer_publications: Public read
├─ reviewer_retractions: Public read
└─ Enforced at database level

Client-side Safety:
├─ No sensitive data in URLs
├─ All data from authenticated queries
├─ Error messages don't expose internal details
└─ User actions validated server-side
```

## Accessibility Features

```
Keyboard Navigation:
├─ Tab between buttons
├─ Enter to activate
├─ ESC to close drawer
└─ Focus trap when open

Screen Reader Support:
├─ Proper ARIA labels
├─ Semantic HTML structure
├─ Descriptive button labels
└─ Content hierarchy clear

Visual:
├─ High contrast colors
├─ Clear focus indicators
├─ Proper heading hierarchy
└─ Readable font sizes
```

## Configuration Points

Places where behavior can be customized:

```
Drawer Width (responsive):
└─ ReviewerProfileDrawer.tsx: PaperProps.sx.width

Publications Limit:
└─ .limit(4) in fetchReviewerProfile()

Sorting:
└─ .order() in queries

Colors/Spacing:
└─ theme palette and spacing scale

Strong/Weak Points Logic:
└─ getStrongPoints() and getWeakPoints() functions

Feedback Widget:
└─ Buttons array structure
```

---

## Quick Reference Table

| Aspect             | Location                      | Details                           |
| ------------------ | ----------------------------- | --------------------------------- |
| **Main Component** | `ReviewerProfileDrawer.tsx`   | ~700 lines                        |
| **State Hook**     | `useReviewerProfileDrawer.ts` | ~25 lines                         |
| **Integration**    | `manage-reviewers/page.tsx`   | Added drawer render               |
| **Table Button**   | `ReviewerSearchAndTable.tsx`  | Added visibility icon             |
| **Props**          | Component interface           | 5 props, 2 optional               |
| **Callbacks**      | onAddToQueue, onInvite        | Optional, handle actions          |
| **DB Queries**     | 3 parallel                    | Base + Publications + Retractions |
| **Calc Fields**    | Client-side                   | 5 derived metrics                 |
| **Styling**        | MUI sx props                  | Uses theme palette                |
| **Error State**    | Alert component               | User-friendly messages            |
| **Loading State**  | Typography                    | "Loading..." text                 |
| **Responsive**     | 3 breakpoints                 | xs/sm/md                          |
| **Animations**     | Drawer.Transition             | 300ms slide                       |

This architecture ensures the drawer is performant, maintainable, and easy to extend!
