# ReX Component Inventory

**Purpose:** Track MUI component mapping and theming status for ReX design system migration.

**Status Legend:**
- ✅ Themed (ReX theme applied)
- 🔄 Vanilla (MUI default, not themed)
- ⏳ Pending (not yet implemented)
- 🎨 Custom (requires custom implementation beyond MUI)

---

## Component Mapping Table

| ReX Component Name | MUI Equivalent | Used In Screens | Themed | Notes |
|-------------------|----------------|-----------------|--------|-------|
| **Navigation & Layout** |
| Header | AppBar | All steps | ⏳ | Global navigation |
| Progress Stepper | Stepper | 3-13 | ⏳ | Linear progress indicator |
| Footer | Box | All steps | ⏳ | Action buttons container |
| **Data Display** |
| Submission Card | Card | 1, 2 | ⏳ | Manuscript card with status |
| Progress Card | Card | 2 | ⏳ | Kanban-style card |
| Status Badge | Chip | 1, 2, 13, 14 | ⏳ | Colored status indicators |
| Info Panel | Paper | Multiple | ⏳ | Informational sections |
| Data List | List | 1, 8 | ⏳ | Author list, submission list |
| **Inputs** |
| Text Field | TextField | 5, 6, 7, 9, 11 | ⏳ | Standard text input |
| Text Area | TextField (multiline) | 6 | ⏳ | Abstract input |
| File Upload | Button + Input | 4 | ⏳ | Manuscript file upload |
| Radio Group | RadioGroup | 3 | ⏳ | Article type selection |
| Checkbox | Checkbox | 11, 12 | ⏳ | Open access, agreements |
| Select Dropdown | Select | 3, 7, 10 | ⏳ | Category, affiliation picker |
| Autocomplete | Autocomplete | 7, 10 | ⏳ | Organization matching |
| **Actions** |
| Primary Button | Button (contained) | All steps | ⏳ | Next, Submit, Save |
| Secondary Button | Button (outlined) | All steps | ⏳ | Back, Cancel |
| Text Button | Button (text) | Multiple | ⏳ | Skip, Edit |
| Icon Button | IconButton | Multiple | ⏳ | Delete, Edit actions |
| FAB | Fab | 1 | ⏳ | Add new submission |
| **Feedback** |
| Success Screen | Box + Lottie | 15 | ⏳ | Confetti celebration |
| Alert | Alert | Multiple | ⏳ | Warnings, errors |
| Tooltip | Tooltip | Multiple | ⏳ | Help text |
| Progress Bar | LinearProgress | 2, 4 | ⏳ | Upload progress |
| **Custom Components** |
| Drag & Drop Zone | 🎨 Custom | 4 | ⏳ | File upload area |
| Organization Matcher | 🎨 Custom | 10 | ⏳ | Fuzzy search + selection |
| Author Manager | 🎨 Custom | 8, 9 | ⏳ | Add/edit/remove authors |

---

## Screen-by-Screen Component Breakdown

### 01 - My Submissions
- Card (submission cards)
- List (submission list)
- Chip (status badges)
- Button (view, edit actions)
- Fab (add new submission)
- AppBar (header)

### 02 - Progress Board
- Card (progress cards in columns)
- Chip (status indicators)
- Grid (kanban columns)
- Button (actions)

### 03 - Article Type
- RadioGroup (type selection)
- Select (category dropdown)
- Button (next, back)
- Stepper (progress indicator)

### 04 - Upload Manuscript
- 🎨 Custom Drag & Drop Zone
- Button (file picker, upload)
- LinearProgress (upload progress)
- List (uploaded files)
- IconButton (delete file)

### 05 - Title
- TextField (title input)
- TextField (subtitle input)
- Button (next, back)

### 06 - Abstract
- TextField (multiline, abstract)
- Typography (character count)
- Button (next, back)

### 07 - Affiliation
- Autocomplete (institution search)
- TextField (department, custom affiliation)
- List (added affiliations)
- Button (add, next, back)

### 08 - Authors
- List (author list)
- Button (add author, edit, delete)
- Card (author card)

### 09 - Author Details
- TextField (name, email, ORCID)
- Checkbox (corresponding author)
- Select (role/contribution)
- Button (save, cancel)

### 10 - Match Organizations
- 🎨 Custom Organization Matcher
- Autocomplete (search)
- List (suggestions, selected)
- Button (confirm match)

### 11 - Additional Information
- TextField (keywords, funding)
- Checkbox (declarations)
- Select (subject area)
- Button (next, back)

### 12 - Open Access
- RadioGroup (license selection)
- Checkbox (agreements)
- Typography (license details)
- Button (next, back)

### 13 - Final Review
- Paper (review sections)
- Typography (summary text)
- Chip (status indicators)
- Button (submit, edit)
- List (authors, affiliations)

### 14 - Submission Overview
- Paper (confirmation details)
- Typography (submission ID, date)
- Chip (status)
- Button (view, download)

### 15 - Confetti Screen
- 🎨 Lottie Animation (confetti)
- Typography (success message)
- Button (view submission, new submission)

---

## Theming Progress

**Phase 1: Foundation** ✅
- [x] Color palette defined
- [x] Typography scale defined
- [x] Spacing system defined
- [ ] Icon system (pending Figma export)

**Phase 2: Component Theming** ⏳
- [ ] Button variants
- [ ] Card styles
- [ ] TextField styles
- [ ] Chip styles
- [ ] AppBar/Footer styles

**Phase 3: Custom Components** ⏳
- [ ] Drag & Drop Zone
- [ ] Organization Matcher
- [ ] Author Manager
- [ ] Confetti Animation

---

## Implementation Strategy

### Step 1: Vanilla MUI (Current)
Build each screen with out-of-the-box MUI components. Focus on:
- Correct component selection
- Proper layout structure
- Functional behavior
- Data flow

### Step 2: ReX Theming (Next)
Apply ReX theme to all components:
- Colors from palette
- Typography variants
- Spacing using semantic scale (inline/component/sibling/group/layout)
- Border radius, shadows

### Step 3: Responsive (Final)
Adapt for mobile/tablet:
- Responsive grid breakpoints
- Mobile-specific layouts
- Touch-friendly interactions

---

**Last Updated:** 2026-01-12
