# ReX Components Migration Tracker

**Project Goal:** Migrate ReX Components design system from Figma to Storybook using Material UI with custom ReX theme.

**Strategy:** "Best of both worlds" - Use MUI components wrapped with ReX theme to achieve Figma visual fidelity with MUI flexibility.

---

## Current Status

**Phase:** Vanilla MUI Implementation (15/15 placeholders ready)
**Last Updated:** 2026-01-12
**Next Session Focus:** Start vanilla MUI implementation (screen 01 or 03)

## Phases Overview

### ✅ Phase 1: Foundation (MOSTLY COMPLETE)

- [x] Create ReX theme from Figma tokens
- [x] Color palette (semantic colors, grayscale, brand colors)
- [x] Typography scale (Open Sans family)
- [x] Spacing system (5-tier: inline/component/sibling/group/layout)
- [x] Theme registered in multi-theme system
- [x] Storybook color & typography showcase pages
- [x] Session management automation (start/end scripts)
- [x] Project documentation structure (README, DECISIONS, NEXT_STEPS, SESSION_WORKFLOW)
- [ ] **Icon system** - Export from Figma, create React components, Storybook showcase

**Files Created:**

- `/src/themes/rex/` - Complete theme structure with spacing system
- `/src/components/tokens/RexColorPalette.stories.tsx`
- `/src/components/tokens/RexTypography.stories.tsx`
- `/docs/rex-migration/` - Project tracking documentation
- `/.github/scripts/session-start.sh` - Automatic recap on folder open
- `/.github/scripts/session-end.sh` - Validation & commit workflow

**Pending:**

- `/src/components/rex/icons/` - Custom SVG icon components (awaiting Figma export)
- `/src/components/tokens/RexIcons.stories.tsx` - Icon showcase

---

### ✅ Phase 2: Screen Documentation (COMPLETE - 15/15)

All screens now have placeholder stories in Storybook. Ready for vanilla MUI implementation.

**New Approach:** 3-phase implementation strategy
1. **Vanilla MUI** - Build with out-of-the-box MUI components
2. **ReX Theming** - Apply ReX theme (colors, typography, spacing)
3. **Responsive** - Adapt for mobile/tablet

#### Pre-Submission Screens

- [x] **00. Overview** - Landing page for flow documentation
- [x] **01. My Submissions** - Dashboard with submission list
- [x] **02. Progress Board** - Kanban-style submission tracking

#### Submission Flow Screens

- [x] **03. Article Type** - Choose manuscript type and category
- [x] **04. Upload Manuscript** - File upload interface with drag & drop
- [x] **05. Title** - Enter manuscript title and subtitle
- [x] **06. Abstract** - Provide manuscript abstract
- [x] **07. Affiliation** - Add institutional affiliations with autocomplete
- [x] **08. Authors** - Manage author list (add/edit/delete)
- [x] **09. Author Details** - Individual author information form
- [x] **10. Match Organizations** - Fuzzy matching for organization standardization
- [x] **11. Additional Information** - Keywords, funding, declarations
- [x] **12. Open Access** - License selection and agreements

#### Review & Completion Screens

- [x] **13. Final Review** - Pre-submission summary with validation
- [x] **14. Submission Overview** - Post-submission confirmation
- [x] **15. Confetti Screen** - Success celebration with animation

**All Placeholder Stories Created:**

| # | Page | Storybook | Code | Status |
|---|------|-----------|------|--------|
| 00 | Overview | [📖 View](http://localhost:6006/?path=/story/rex-flow-00-overview--placeholder) | [📄 Code](../../src/components/rex-flow/00-Overview.stories.tsx) | Placeholder |
| 01 | My Submissions | [📖 View](http://localhost:6006/?path=/story/rex-flow-01-my-submissions--placeholder) | [📄 Code](../../src/components/rex-flow/01-MySubmissions.stories.tsx) | Placeholder |
| 02 | Progress Board | [📖 View](http://localhost:6006/?path=/story/rex-flow-02-progress-board--placeholder) | [📄 Code](../../src/components/rex-flow/02-ProgressBoard.stories.tsx) | Placeholder |
| 03 | Article Type | [📖 View](http://localhost:6006/?path=/story/rex-flow-03-article-type--placeholder) | [📄 Code](../../src/components/rex-flow/03-ArticleType.stories.tsx) | Placeholder |
| 04 | Upload Manuscript | [📖 View](http://localhost:6006/?path=/story/rex-flow-04-upload-manuscript--placeholder) | [📄 Code](../../src/components/rex-flow/04-UploadManuscript.stories.tsx) | Placeholder |
| 05 | Title | [📖 View](http://localhost:6006/?path=/story/rex-flow-05-title--placeholder) | [📄 Code](../../src/components/rex-flow/05-Title.stories.tsx) | Placeholder |
| 06 | Abstract | [📖 View](http://localhost:6006/?path=/story/rex-flow-06-abstract--placeholder) | [📄 Code](../../src/components/rex-flow/06-Abstract.stories.tsx) | Placeholder |
| 07 | Affiliation | [📖 View](http://localhost:6006/?path=/story/rex-flow-07-affiliation--placeholder) | [📄 Code](../../src/components/rex-flow/07-Affiliation.stories.tsx) | Placeholder |
| 08 | Authors | [📖 View](http://localhost:6006/?path=/story/rex-flow-08-authors--placeholder) | [📄 Code](../../src/components/rex-flow/08-Authors.stories.tsx) | Placeholder |
| 09 | Author Details | [📖 View](http://localhost:6006/?path=/story/rex-flow-09-author-details--placeholder) | [📄 Code](../../src/components/rex-flow/09-AuthorDetails.stories.tsx) | Placeholder |
| 10 | Match Organizations | [📖 View](http://localhost:6006/?path=/story/rex-flow-10-match-organizations--placeholder) | [📄 Code](../../src/components/rex-flow/10-MatchOrganizations.stories.tsx) | Placeholder |
| 11 | Additional Information | [📖 View](http://localhost:6006/?path=/story/rex-flow-11-additional-information--placeholder) | [📄 Code](../../src/components/rex-flow/11-AdditionalInformation.stories.tsx) | Placeholder |
| 12 | Open Access | [📖 View](http://localhost:6006/?path=/story/rex-flow-12-open-access--placeholder) | [📄 Code](../../src/components/rex-flow/12-OpenAccess.stories.tsx) | Placeholder |
| 13 | Final Review | [📖 View](http://localhost:6006/?path=/story/rex-flow-13-final-review--placeholder) | [📄 Code](../../src/components/rex-flow/13-FinalReview.stories.tsx) | Placeholder |
| 14 | Submission Overview | [📖 View](http://localhost:6006/?path=/story/rex-flow-14-submission-overview--placeholder) | [📄 Code](../../src/components/rex-flow/14-SubmissionOverview.stories.tsx) | Placeholder |
| 15 | Confetti Screen | [📖 View](http://localhost:6006/?path=/story/rex-flow-15-confetti-screen--placeholder) | [📄 Code](../../src/components/rex-flow/15-ConfettiScreen.stories.tsx) | Placeholder |

**Assets:**

- `/reference/ReX steps/` - PNG/SVG exports from Figma (Desktop, Mobile, multiple states)

---

### 📋 Phase 3: Vanilla MUI Implementation (READY TO START)

Build each screen with out-of-the-box MUI components (no custom styling yet).

**Implementation Approach:**

**Step 1: Vanilla MUI (Current Phase)**
- Use MUI components with default styling
- Focus on structure and layout
- Implement functionality and data flow
- No ReX theme application yet

**Step 2: ReX Theming (Next Phase)**
- Apply ReX theme colors, typography, spacing
- Match Figma visual design
- Theme-level customization only

**Step 3: Responsive (Final Phase)**
- Mobile/tablet breakpoints
- Touch-friendly interactions
- Responsive layouts

**Component Inventory:**
- See `/docs/rex-migration/COMPONENTS.md` for complete MUI component mapping
- Tracks which MUI components are used in each screen
- Documents theming status per component

**Priority Order:**

1. **01 - My Submissions** (vanilla implementation first)
2. **03 - Article Type** (simple form, good starting point)
3. **05 - Title** (basic text input)
4. **06 - Abstract** (multiline text)
5. **04 - Upload Manuscript** (custom drag & drop)
6. [... continue screen by screen]

---

### 🧪 Phase 4: Integration & Testing (NOT STARTED)

- [ ] Connect components to data layer (Supabase)
- [ ] Add form validation
- [ ] Implement navigation flow
- [ ] Test responsive behavior
- [ ] Accessibility audit
- [ ] Cross-browser testing

---

## Key Decisions Made

1. **Manual Figma Export > MCP:** Figma MCP connection failed (port mismatch). Manual token export + PNG/SVG screens proved more reliable.

2. **Documentation First:** Document all screens with visual reference before implementation to maintain design fidelity.

3. **Theme-Level Styling:** All styling handled at ReX theme level, minimal component overrides.

4. **3-Phase Implementation:** Vanilla MUI → ReX Theming → Responsive (instead of building everything at once).

5. **Component Inventory:** Created COMPONENTS.md to track MUI mappings and theming status.

---

## Technical Notes

### ReX Theme Specifications

**Colors:**

- **Semantic:** neutral, success, attention, danger, warning, information
- **Grayscale:** darker, dark, light, lighter, background
- **Brands:** Open Access (#611D69), ORCID (#A6CE39)

**Typography (Open Sans):**

- h1: 25px / 400 (Main Title)
- h2: 20px / 600 (Subtitle)
- h3: 20px / 400 (Item Title)
- body1: 14px / 400 (Text)
- button: 14px / 600 (Button)

**Spacing System:**

- 1 (5px) - inline: Text elements
- 2 (10px) - component: Within-component spacing
- 3 (15px) - sibling: Related elements
- 6 (30px) - group: Distinct sections
- 12 (60px) - layout: Major divisions

**Theme Features:**

- ✅ Light/Dark mode support via colorSchemes
- ✅ Custom palette colors (neutral, black, white)
- ✅ Component overrides for Button, Chip
- ✅ MUI Grid system compatibility

---

## Resources

- **Figma File:** [Link to Figma project]
- **Figma Tokens:** `/reference/Proposed.tokens.json`
- **Design Exports:** `/reference/ReX steps/`
- **Theme Code:** `/src/themes/rex/`
- **Component Inventory:** `/docs/rex-migration/COMPONENTS.md`
- **Storybook:** Run `npm run storybook` to view documentation

---

## Session Workflow

**When starting a new session:**

1. Read this tracker to understand current status
2. Review "Next Session Focus" section
3. Check git log for recent changes
4. Run `npm run validate` to ensure clean state

**When ending a session:**

1. Update "Current Status" and "Last Updated"
2. Update phase checklists with completed items
3. Add any new technical notes or decisions
4. Set "Next Session Focus" for future work
5. Commit changes with descriptive message

---

## Archive

Completed phases and decisions will be moved to `/docs/archive/rex-migration-YYYY-MM/` monthly.
