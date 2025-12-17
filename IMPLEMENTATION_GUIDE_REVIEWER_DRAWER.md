# Reviewer Profile Drawer - Implementation Guide

## Overview

I've created a portable, reusable **ReviewerProfileDrawer** component that displays comprehensive reviewer profile information in a MUI drawer that slides in from the right side of the screen. This component is fully integrated with your database schema and can be used anywhere in your application.

## Files Created

### 1. **ReviewerProfileDrawer Component**

📁 `src/components/reviewer/ReviewerProfileDrawer.tsx`

The main drawer component that:

- Fetches real-time reviewer data from Supabase
- Displays comprehensive reviewer profile information
- Shows publications, metrics, workload, and performance stats
- Provides action callbacks for "Add to Queue" and "Invite Reviewer"
- Automatically calculates strong/weak points based on reviewer data
- Includes external profile links (ORCiD, Scopus, Semantic Scholar)

**Key Features:**

- ✅ Portable - Works on any page with reviewer context
- ✅ Real-time data fetching from Supabase
- ✅ Error handling and loading states
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Themed with your MUI configuration
- ✅ Full accessibility support

### 2. **useReviewerProfileDrawer Hook**

📁 `src/hooks/useReviewerProfileDrawer.ts`

A custom React hook that manages drawer state:

- Manages `open/close` state
- Manages `reviewerId` to display
- Provides `openDrawer()` and `closeDrawer()` functions
- Handles animation timing gracefully

### 3. **Documentation**

📁 `src/components/reviewer/README.md`

Comprehensive usage guide including:

- Installation and setup instructions
- Props reference
- Usage examples (basic, with callbacks, in tables, etc.)
- Data sources and database access requirements
- Styling and customization options
- Accessibility features
- Troubleshooting guide

## Integration with Manage Reviewers Page

### Changes Made:

1. **ReviewerSearchAndTable.tsx**

   - Added `onViewProfile` callback prop
   - Added "View Profile" button (visibility icon) to the actions column
   - Placed before "Invite" and "Add to Queue" buttons

2. **manage-reviewers/page.tsx**
   - Imported `ReviewerProfileDrawer` and `useReviewerProfileDrawer` hook
   - Added drawer state management using the hook
   - Passed `onViewProfile` callback to `ReviewerSearchAndTable`
   - Rendered drawer component with proper callbacks
   - Drawer automatically receives `onAddToQueue` and `onInvite` handlers

## Data Architecture

The component fetches data from multiple Supabase tables:

### Primary Data Sources:

- **potential_reviewers** - Base reviewer information
- **reviewer_publications** - Publication history (title, DOI, journal, authors, dates)
- **reviewer_retractions** - Retraction information (if any)

### Extended Fields Used:

```typescript
// From potential_reviewers
- id, name, email, affiliation, department
- expertise_areas[], current_review_load, max_review_capacity
- average_review_time_days, h_index, last_review_completed
- availability_status, total_invitations, total_acceptances
- completed_reviews, orcid_id, profile_url, external_id
- previous_reviewer, email_is_institutional

// Calculated/Derived Fields
- match_score (from reviewer_manuscript_matches)
- conflicts_of_interest (from reviewer_manuscript_matches)
- acceptance_rate, related_publications_count, solo_authored_count
- publications_last_5_years, days_since_last_review
```

## Cross-Reference: Figma Design vs. Database

The drawer is designed to match your Figma wireframe with all available data:

| Figma Section            | Data Source                 | Database Fields                                                                          |
| ------------------------ | --------------------------- | ---------------------------------------------------------------------------------------- |
| **Profile Header**       | potential_reviewers         | name, email, affiliation, orcid_id                                                       |
| **Email Badge**          | Calculated                  | email_is_institutional                                                                   |
| **Conflict Tag**         | reviewer_manuscript_matches | conflicts_of_interest                                                                    |
| **Previous Reviewer**    | potential_reviewers         | previous_reviewer                                                                        |
| **External Links**       | potential_reviewers         | orcid_id, profile_url                                                                    |
| **Strong/Weak Points**   | Multiple tables             | acceptance_rate, retractions, current_load, email                                        |
| **Publications**         | reviewer_publications       | All publication fields                                                                   |
| **Publication Metrics**  | potential_reviewers         | h_index, solo_authored_count, publications_last_5_years                                  |
| **Keywords**             | potential_reviewers         | expertise_areas[]                                                                        |
| **Current Workload**     | potential_reviewers         | current_review_load, total_invitations, days_since_last_review, average_review_time_days |
| **Reviewer Performance** | potential_reviewers         | average_response_time_hours, acceptance_rate, completed_reviews, days_since_last_review  |
| **Feedback Widget**      | UI Only                     | N/A (buttons for future integration)                                                     |
| **Action Buttons**       | Callbacks                   | onAddToQueue, onInvite                                                                   |

## Usage Example

### Basic Implementation (Manage Reviewers Page):

```tsx
import ReviewerProfileDrawer from "@/components/reviewer/ReviewerProfileDrawer";
import { useReviewerProfileDrawer } from "@/hooks/useReviewerProfileDrawer";

export default function ManageReviewersPage() {
  const { open, reviewerId, openDrawer, closeDrawer } =
    useReviewerProfileDrawer();

  return (
    <>
      {/* Your table with click handlers */}
      <Button onClick={() => openDrawer("reviewer-uuid")}>View Profile</Button>

      {/* The drawer */}
      <ReviewerProfileDrawer
        open={open}
        onClose={closeDrawer}
        reviewerId={reviewerId}
        onAddToQueue={(id) => handleAddToQueue(id)}
        onInvite={(id) => handleInviteReviewer(id)}
      />
    </>
  );
}
```

## API Reference

### ReviewerProfileDrawer Props

```typescript
interface ReviewerProfileDrawerProps {
  open: boolean; // Controls visibility
  onClose: () => void; // Close callback
  reviewerId: string | null; // UUID to load
  onAddToQueue?: (reviewerId: string) => void; // Add to queue callback
  onInvite?: (reviewerId: string) => void; // Invite callback
}
```

### useReviewerProfileDrawer Hook

```typescript
interface UseReviewerProfileDrawerReturn {
  open: boolean; // Current open state
  reviewerId: string | null; // Current reviewer ID
  openDrawer: (id: string) => void; // Open drawer with reviewer
  closeDrawer: () => void; // Close drawer
}
```

## Displayed Sections

### 1. Profile Header

- Reviewer name with external profile links
- Email with institutional verification badge
- Affiliation
- Conflict of interest alerts
- Previous reviewer status

### 2. Smart Insights

- **Strong Points**: Institutional email, high acceptance rate, available, active
- **Weak Points**: Retractions, conflicts, at capacity, low acceptance rate

### 3. Relevant Publications

- Top 4 recent publications (expandable to see all)
- Co-author and retraction badges
- Journal name and publication year

### 4. Publication Metrics

- h-index
- Solo-authored publications count
- Recent publications (last 5 years)

### 5. Current Workload

- Currently reviewing
- Invitations received (last 6 months)
- Last invitation response
- Average speed

### 6. Reviewer Performance

- Average response time
- Acceptance rate percentage
- Reports submitted
- Last report submitted date

### 7. Keywords/Expertise

- Array of expertise areas

### 8. Feedback Widget

- Three-button system: "Not Accurate", "Somewhat Accurate", "Accurate"

### 9. Action Buttons

- "Add to Queue" (if callback provided)
- "Invite Reviewer" (if callback provided)

## Performance Considerations

- ✅ Data fetched only when drawer opens
- ✅ Publications limited to top 4 to reduce DOM nodes
- ✅ Efficient Supabase queries with specific field selection
- ✅ Automatic cleanup on unmount
- ✅ Loading and error states for better UX

## Responsive Design

| Breakpoint    | Drawer Width | Behavior          |
| ------------- | ------------ | ----------------- |
| xs (mobile)   | 100%         | Full screen width |
| sm (tablet)   | 600px        | Narrower sidebar  |
| md+ (desktop) | 780px        | Full featured     |

## Accessibility

- ✅ Keyboard navigation (ESC to close)
- ✅ Proper ARIA labels on buttons
- ✅ Focus management when opening/closing
- ✅ Screen reader friendly content structure
- ✅ Semantic HTML structure
- ✅ Color contrast compliance

## Portability

This component can be used on:

1. **Manage Reviewers Page** ✅ (Already integrated)
2. **Article Details Page** - Show reviewer profile from list
3. **Search Results** - Show profile from search results
4. **Reviewer Metrics Dashboard** - Compare reviewers
5. **Any page with reviewer data** - Generic reusable component

To add to other pages:

```tsx
// 1. Import
import ReviewerProfileDrawer from "@/components/reviewer/ReviewerProfileDrawer";
import { useReviewerProfileDrawer } from "@/hooks/useReviewerProfileDrawer";

// 2. Add hook to your component
const { open, reviewerId, openDrawer, closeDrawer } = useReviewerProfileDrawer();

// 3. Add click handler to your reviewer element
<Button onClick={() => openDrawer(reviewer.id)}>View Profile</Button>

// 4. Render the drawer
<ReviewerProfileDrawer
  open={open}
  onClose={closeDrawer}
  reviewerId={reviewerId}
  onAddToQueue={onAddToQueue}  // Optional
  onInvite={onInvite}          // Optional
/>
```

## Database Schema Compatibility

The component is designed to work with your schema including:

- ✅ potential_reviewers table with all fields
- ✅ reviewer_publications table
- ✅ reviewer_retractions table
- ✅ reviewer_manuscript_matches table (for match scores)
- ✅ RLS policies (authenticated read access)

## Error Handling

The component includes:

- Error alerts if data fetch fails
- Loading states while fetching
- Graceful handling of missing fields
- Console logging for debugging
- User-friendly error messages

## Styling

The component uses:

- ✅ MUI theme integration (respects your current theme)
- ✅ Proper spacing using MUI spacing scale
- ✅ Color tokens from theme palette
- ✅ Responsive Grid with size prop (newer MUI syntax)
- ✅ Paper and Alert components for visual hierarchy

## Future Enhancements

Potential features to add:

- [ ] Pagination for publications list
- [ ] Export profile as PDF
- [ ] Email preview before sending invitation
- [ ] Custom notes field for internal tracking
- [ ] Reviewer comparison (side-by-side view)
- [ ] Historical review quality metrics
- [ ] Timeline of reviewer activity
- [ ] Custom feedback submission

## Troubleshooting

### Drawer doesn't open?

- Check `open` prop is `true`
- Verify `reviewerId` is a valid UUID
- Check browser console for errors

### Data not loading?

- Check Supabase connection
- Verify RLS policies allow read access
- Check table names match your schema
- Look for console errors

### Actions not working?

- Ensure callback functions are provided
- Check callback implementation for errors
- Verify manuscript context is available

## Files Summary

```
src/
├── components/
│   └── reviewer/
│       ├── ReviewerProfileDrawer.tsx    (Main component - 700+ lines)
│       └── README.md                     (Detailed documentation)
├── hooks/
│   └── useReviewerProfileDrawer.ts       (State management hook - 25 lines)
└── app/
    └── reviewer-dashboard/
        └── manage-reviewers/
            ├── page.tsx                  (Updated with drawer integration)
            └── ReviewerSearchAndTable.tsx (Added onViewProfile prop)
```

## Next Steps

1. **Test the drawer** on the Manage Reviewers page
2. **Add to other pages** using the portability guide above
3. **Customize styling** if needed (see README.md)
4. **Extend functionality** with additional actions
5. **Monitor performance** with larger datasets

## Related Components

- `ReviewerSearchAndTable` - Table with reviewer list
- `InvitationsAndQueuePanel` - Queue and invitations management
- `ArticleDetailsCard` - Manuscript metadata display

## Questions?

Refer to:

- `src/components/reviewer/README.md` - Detailed usage guide
- Component inline comments - Implementation details
- Database schema - Field documentation
- Type definitions in `src/lib/supabase.ts` - Data structure reference
