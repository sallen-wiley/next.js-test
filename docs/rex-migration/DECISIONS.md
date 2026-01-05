# ReX Migration: Decision Log

This document tracks all significant technical and design decisions made during the migration.

---

## 2026-01-05: Spacing System

**Context:** Need consistent spacing hierarchy for ReX component layouts.

**Decision:** Define 5-tier named spacing system based on 5px base unit.

**Named Spacing Scale:**

- **5px (1x) - inline**: Text elements (text↔legend, label↔helper)
- **10px (2x) - component**: Pieces within same component (title↔field, pill↔pill)
- **15px (3x) - sibling**: Related elements (fields, items, paragraphs)
- **30px (6x) - group**: Distinct sections (item groups, step sections)
- **60px (12x) - layout**: Major layout divisions (header↔content, footer)

**Usage in Code:**

```tsx
// Use MUI spacing function with semantic multipliers
<Box sx={{ mt: 1 }}>  {/* 5px - inline spacing */}
<Box sx={{ mt: 2 }}>  {/* 10px - component spacing */}
<Box sx={{ mb: 3 }}>  {/* 15px - sibling spacing */}
<Box sx={{ py: 6 }}>  {/* 30px - group spacing */}
<Box sx={{ mt: 12 }}> {/* 60px - layout spacing */}
```

**Rationale:**

- Provides clear hierarchy of spacing relationships
- Semantic names match design intent (inline/component/sibling/group/layout)
- Easy to remember (1/2/3/6/12 multipliers)
- Consistent with Figma designs
- Leverages MUI's built-in spacing function

**Impact:** Theme configured with `spacing: 5` (5px base). All components use semantic multipliers for spacing.

---

## 2026-01-05: Manual Figma Export Strategy

**Context:** Attempted to use Figma MCP extension for automated design token extraction.

**Problem:** FigmaAgent listening on ports 44950/44960, but VS Code MCP extension connecting to port 3845 (mismatch).

**Decision:** Use manual Figma export workflow instead of MCP.

**Rationale:**

- Manual export of tokens (JSON) and screens (PNG/SVG) is reliable
- No dependency on fragile MCP connection
- Tokens exported once, rarely change
- PNG/SVG exports provide precise visual reference

**Impact:** Figma MCP extension removed from VS Code. Manual export workflow documented.

---

## 2026-01-05: Documentation-First Approach

**Context:** 15 screens to migrate from Figma to MUI components.

**Decision:** Document all screens in Storybook with visual references BEFORE implementation.

**Rationale:**

- Provides complete visual reference library
- Establishes clear scope (what needs to be built)
- Allows batch review of all screens
- Documentation stories serve as "living spec" during implementation
- Can identify patterns and reusable components across screens

**Impact:** Created `/src/components/rex-flow/` directory with story files for each screen. Implementation phase deferred until documentation complete (or decision to interleave).

---

## 2026-01-05: Theme-Level Styling Philosophy

**Context:** Need to match Figma designs using MUI components.

**Decision:** Handle ALL styling at ReX theme level, avoid component-level style overrides.

**Rationale:**

- Maintains theme consistency
- Easier to maintain and update
- Better performance (theme computed once)
- Follows MUI best practices
- Allows theme to work with any standard MUI component

**Exceptions:**

- Spacing/positioning (`sx={{ mt: 2, p: 3 }}`)
- Explicit design requirements (e.g., hero sections with fixed colors)

**Impact:** ReX theme fully defines palette, typography, component defaults. Components use minimal `sx` props.

---

## 2026-01-05: Multi-State Screen Documentation

**Context:** Each Figma screen has multiple states (Default, Empty, Error, Draft, Revision, etc.).

**Decision:** Document all states for each screen in single story file using Tabs pattern.

**Rationale:**

- Keeps related states together
- Easy to compare states side-by-side
- Matches mental model (one screen, multiple states)
- Reduces file proliferation

**Implementation Pattern:**

```tsx
const states = [
  { name: "Default", image: "Desktop-Default.png" },
  { name: "Empty", image: "Desktop-Empty.png" },
  { name: "Error", image: "Desktop-Error.png" },
];
```

**Impact:** Each screen story includes Desktop/Mobile tabs and state selection within each tab.

---

## 2026-01-05: AI-Driven Documentation Updates

**Context:** Multi-month project requires keeping documentation in sync with progress.

**Problem:** Manual documentation updates are tedious and often forgotten, leading to stale tracker.

**Decision:** AI assistant updates documentation at end of each session based on work completed.

**Rationale:**

- AI has full context of session work
- Reduces friction (no manual checklist updates)
- Ensures documentation stays current
- Human focuses on coding, AI handles bookkeeping

**Workflow:**

1. Human says "session end" or runs command
2. AI reviews work done in session
3. AI updates README.md (status, checkboxes, dates)
4. AI updates DECISIONS.md (if decisions made)
5. AI updates NEXT_STEPS.md (if priorities changed)
6. AI runs validation (lint + build)
7. AI commits with descriptive message
8. Human reviews and pushes

**Impact:** Documentation maintenance automated. Tracker always reflects current state.

---

## 2026-01-05: Session Management Automation

**Context:** Long-running project with intermittent work sessions (months between sessions possible).

**Decision:** Automate session start recap and end workflow with shell scripts + VS Code tasks.

**Features Implemented:**

- **Session Start:** Auto-runs on folder open, shows status/commits/todos/next steps
- **Session End:** Interactive script validates, prompts doc updates, commits, pushes
- **VS Code Tasks:** Both accessible via Command Palette
- **npm scripts:** `npm run session:start` and `npm run session:end`

**Rationale:**

- Eliminates "where was I?" context switching cost
- Ensures clean commits (validation before commit)
- Standardizes git workflow
- Provides guardrails (prompts for doc updates)

**Impact:** Reduced session startup time. Consistent commit/push workflow. No forgotten documentation updates.

---

## [Future Decision Template]

## YYYY-MM-DD: Decision Title

**Context:** What situation led to this decision?

**Problem:** What problem were we solving?

**Decision:** What did we decide?

**Rationale:** Why did we choose this approach?

**Alternatives Considered:** What other options did we evaluate?

**Impact:** What changed as a result?

**Review Date:** When should we revisit this decision?
