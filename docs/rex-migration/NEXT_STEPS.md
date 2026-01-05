# ReX Migration: Next Steps

**Last Updated:** 2026-01-05 (Session automation complete)

---

## Immediate Next Actions

### Option A: Continue Documentation (Recommended)

**Goal:** Complete all 14 remaining screen documentation stories.

**Why:** Establishes complete visual reference before implementation. Allows holistic review of entire flow.

**Estimated Time:** 3-4 hours (pattern established, just replicate)

**Tasks:**

1. Create `02-ProgressBoard.stories.tsx` - Kanban board view
2. Create `03-ArticleType.stories.tsx` - Type selection UI
3. Create `04-UploadManuscript.stories.tsx` - File upload
4. ... (continue through 14-Confetti)

**Pattern to Follow:**

```tsx
// Same structure as 01-MySubmissions.stories.tsx
// 1. Desktop/Mobile tabs
// 2. State selection within each tab
// 3. backgroundImage display of PNG exports
// 4. Key features documentation
```

---

### Option B: Start Implementation

**Goal:** Build first functional component to validate approach.

**Why:** Tests the "MUI + ReX theme = Figma match" hypothesis early. Provides concrete feedback on implementation complexity.

**Recommended First Component:** My Submissions Dashboard (screen 01)

**Why This Screen:**

- Already documented
- Relatively simple layout (list view)
- Core functionality (view submissions)
- No complex forms/validation yet

**Tasks:**

1. Create `/src/components/rex/SubmissionsList.tsx`
2. Create `/src/components/rex/SubmissionCard.tsx`
3. Apply ReX theme styling
4. Match Figma layout exactly
5. Add empty state handling
6. Test responsive behavior
7. Create story showing both Figma reference + live component

**Questions to Answer First:**

- Should this be a Next.js page or standalone component?
- Mock data or connect to Supabase immediately?
- How to handle navigation (click on submission)?

---

### Option C: Hybrid Approach

**Goal:** Document AND implement in parallel.

**Pattern:**

1. Document screen (create story with Figma exports)
2. Implement component for that screen
3. Add implementation story showing live component
4. Move to next screen

**Pros:**

- Steady visible progress
- Immediate feedback on implementation challenges
- Can adjust documentation approach based on implementation learnings

**Cons:**

- Slower overall (context switching)
- May discover design patterns late that affect earlier components

---

## Questions to Decide

Before proceeding, we need clarity on:

### 1. Implementation Priority

- **Question:** Which screen is most important to implement first?
- **Options:**
  - My Submissions (entry point)
  - Upload Manuscript (core functionality)
  - Title & Abstract (simplest form)
  - User's choice

### 2. Data Strategy

- **Question:** How to handle data during implementation?
- **Options:**
  - Start with mock data (faster)
  - Connect to Supabase immediately (more realistic)
  - Hybrid (mock for early screens, real data later)

### 3. Routing/Navigation

- **Question:** How do screens connect?
- **Options:**
  - Next.js App Router pages (`/app/rex/submissions/`, etc.)
  - Standalone components (routing handled separately)
  - Single-page flow (wizard pattern)

### 4. State Management

- **Question:** How to manage form data across screens?
- **Options:**
  - React Context API
  - URL params (Next.js searchParams)
  - Redux/Zustand
  - React Hook Form + Context

### 5. Validation Approach

- **Question:** When and how to validate form inputs?
- **Options:**
  - On blur (immediate feedback)
  - On submit (all at once)
  - Real-time (as user types)
  - Mixed (different rules for different fields)

---

## Blockers & Dependencies

**None currently.** All tooling and foundation work complete.

---

## Success Criteria

How do we know each phase is "done"?

### Documentation Phase Complete:

- [ ] All 15 screens have story files
- [ ] All states documented (Desktop/Mobile, all variants)
- [ ] Key features documented for each screen
- [ ] Visual reference images display correctly
- [ ] No ESLint errors
- [ ] Storybook builds successfully

### Implementation Phase Complete (per screen):

- [ ] Component matches Figma design pixel-perfect
- [ ] All states implemented (empty, error, loading, etc.)
- [ ] Responsive (Desktop + Mobile)
- [ ] Accessible (WCAG AA)
- [ ] Theme-aware (works with other themes)
- [ ] Story file shows component in action
- [ ] Props documented with TypeScript types
- [ ] Edge cases handled

---

## Recommended Path Forward

**My Recommendation:** **Option A (Complete Documentation)**

**Reasoning:**

1. Fast progress (pattern established, just replicate)
2. Complete visual reference for entire project
3. Can review all screens before coding
4. Easier to identify reusable patterns
5. Documentation serves as "definition of done" for implementation

**Next Session Should:**

1. Create stories for screens 2-5 (Progress Board through Upload)
2. Review all documentation together
3. Identify common UI patterns
4. Plan component architecture
5. THEN start implementation

**Estimated Timeline:**

- Documentation complete: 1-2 more sessions
- First component implementation: 1 session (proof of concept)
- Full implementation: 8-12 weeks (depends on complexity)

---

## Notes for Future Sessions

- Always run `npm run validate` before committing
- Update this file at end of each session
- Archive completed phases monthly
- Keep README.md in sync with progress
