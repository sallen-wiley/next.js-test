# ReX Components Migration Tracker

**Project Goal:** Migrate ReX Components design system from Figma to Storybook using Material UI with custom ReX theme.

**Strategy:** "Best of both worlds" - Use MUI components wrapped with ReX theme to achieve Figma visual fidelity with MUI flexibility.

---

## Current Status

**Phase:** Documentation (2 of 15 screens documented) + Session Automation Complete
**Last Updated:** 2026-01-05
**Next Session Focus:** Continue documenting remaining 13 screens (02-Progress Board next)

## Phases Overview

### ✅ Phase 1: Foundation (COMPLETE)

- [x] Create ReX theme from Figma tokens
- [x] Color palette (semantic colors, grayscale, brand colors)
- [x] Typography scale (Open Sans family)
- [x] Theme registered in multi-theme system
- [x] Storybook color & typography showcase pages
- [x] Session management automation (start/end scripts)
- [x] Project documentation structure (README, DECISIONS, NEXT_STEPS, SESSION_WORKFLOW)

**Files Created:**

- `/src/themes/rex/` - Complete theme structure
- `/src/components/tokens/RexColorPalette.stories.tsx`
- `/src/components/tokens/RexTypography.stories.tsx`
- `/docs/rex-migration/` - Project tracking documentation
- `/.github/scripts/session-start.sh` - Automatic recap on folder open
- `/.github/scripts/session-end.sh` - Validation & commit workflow

---

### 🔄 Phase 2: Screen Documentation (IN PROGRESS - 2/15)

Document all screens with Figma exports as visual reference for implementation.

#### Pre-Submission Screens

- [x] **00. Overview** - Landing page for flow documentation
- [x] **01. My Submissions** - Dashboard with submission list (Desktop/Mobile, Default/Empty states)
- [ ] **02. Progress Board** - Kanban-style submission tracking

#### Submission Flow Screens

- [ ] **03. Article Type Selection** - Choose manuscript type
- [ ] **04. Upload Manuscript** - File upload interface
- [ ] **05. Title & Abstract** - Text input forms
- [ ] **06. Affiliation** - Institution/organization selection
- [ ] **07. Authors** - Author list management
- [ ] **08. Author Details** - Individual author information
- [ ] **09. Match Organizations** - Organization matching UI
- [ ] **10. Additional Information** - Supplementary fields
- [ ] **11. Open Access** - License selection

#### Review & Completion Screens

- [ ] **12. Final Review** - Pre-submission summary
- [ ] **13. Submission Overview** - Post-submission confirmation
- [ ] **14. Confetti Screen** - Success celebration

**Current Files:**

- `/src/components/rex-flow/00-Overview.stories.tsx`
- `/src/components/rex-flow/01-MySubmissions.stories.tsx`

**Assets:**

- `/reference/ReX steps/` - PNG/SVG exports from Figma (Desktop, Mobile, multiple states)

---

### 📋 Phase 3: Component Implementation (NOT STARTED)

Build functional MUI components for each screen using ReX theme.

**Priority Order (TBD):**

1. My Submissions Dashboard
2. Upload Manuscript
3. Title & Abstract
4. [... to be determined based on user priority]

**Implementation Pattern:**

1. Create component file in `/src/components/rex/[component-name].tsx`
2. Create story file in `/src/components/rex/[component-name].stories.tsx`
3. Apply ReX theme styling
4. Match Figma visual design
5. Add interactions/behaviors
6. Test across all themes for compatibility
7. Document props and usage

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

4. **Multi-State Documentation:** Each screen documented with all states (Default, Empty, Error, Draft, Revision, etc.).

5. **Responsive Documentation:** Desktop + Mobile layouts documented separately.

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

**Theme Features:**

- ✅ Light/Dark mode support via colorSchemes
- ✅ Custom palette colors (neutral, black, white)
- ✅ Component overrides for Button, Chip
- ✅ MUI Grid system compatibility

### Image Display Pattern

Storybook stories use `backgroundImage` to display Figma exports:

```tsx
sx={{
  width: "100%",
  height: "800px",
  backgroundImage: `url(/reference/ReX steps/1 - My submissions/Desktop-Default.png)`,
  backgroundSize: "contain",
  backgroundPosition: "top center",
  backgroundRepeat: "no-repeat",
}}
```

---

## Questions to Answer

1. **Implementation Priority:** Which screen should be built first?
2. **Data Integration:** When to connect to Supabase vs mock data?
3. **Navigation Flow:** How do screens connect? (React Router? Next.js pages?)
4. **State Management:** Local state? Context API? Redux?
5. **Validation Strategy:** Inline? On submit? Real-time?

---

## Resources

- **Figma File:** [Link to Figma project]
- **Figma Tokens:** `/reference/Proposed.tokens.json`
- **Design Exports:** `/reference/ReX steps/`
- **Theme Code:** `/src/themes/rex/`
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
