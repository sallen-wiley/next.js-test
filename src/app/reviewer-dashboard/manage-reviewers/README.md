# ReviewerProfileDrawer Component (Reviewer Dashboard Demo)

This component is colocated with the reviewer dashboard manage-reviewers demo to keep the feature’s UI together.

## Usage

```tsx
import ReviewerProfileDrawer from "@/app/reviewer-dashboard/manage-reviewers/ReviewerProfileDrawer";
import { useReviewerProfileDrawer } from "@/hooks/useReviewerProfileDrawer";

export default function MyPage() {
  const { open, reviewerId, openDrawer, closeDrawer } =
    useReviewerProfileDrawer();

  return (
    <>
      <Button onClick={() => openDrawer("reviewer-uuid-here")}>
        View Profile
      </Button>
      <ReviewerProfileDrawer
        open={open}
        onClose={closeDrawer}
        reviewerId={reviewerId}
      />
    </>
  );
}
```

For full feature documentation, see the original guide formerly at `src/components/reviewer/README.md`.
