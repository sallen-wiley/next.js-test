# Palette Generator Refactoring Plan

## Overview

Breaking down the monolithic 1,591-line `page.tsx` into maintainable components with database integration for saving/loading palettes.

## Target Directory Structure

```
src/app/palette-generator/
├── page.tsx                          # Main entry point (50-100 lines)
├── components/
│   ├── PaletteGenerator.tsx         # Main orchestrator (150-200 lines)
│   ├── HueEditor/
│   │   ├── index.tsx                # HueEditor main component
│   │   ├── HueEditorHeader.tsx      # Name/MUI key inputs
│   │   ├── ExtrapolationModeSelector.tsx
│   │   └── HueEditorDialogs.tsx     # Anchor/Delete/Config dialogs
│   ├── ShadeGrid/
│   │   ├── index.tsx                # Grid container
│   │   ├── ShadeCard.tsx            # Individual shade card
│   │   └── ShadeCardBadges.tsx      # Extrapolation/achromatic badges
│   ├── ShadeConfigurationDialog.tsx
│   ├── PaletteToolbar.tsx           # Export/Save/Load actions
│   └── PresetSelector.tsx           # Preset palette loader
├── utils/
│   ├── colorConversions.ts          # HSV/RGB/Hex utilities
│   ├── contrastCalculations.ts      # WCAG contrast
│   ├── interpolation.ts             # Spline/extrapolation functions
│   └── defaults.ts                  # Default values & constants
├── services/
│   └── paletteService.ts            # Supabase CRUD operations
├── types/
│   └── index.ts                     # All TypeScript interfaces
├── presets/
│   └── index.ts                     # Built-in preset palettes
├── ColorNameMapper.ts               # (existing)
├── D3CurveVisualization.tsx         # (existing)
└── REFACTOR_PLAN.md                 # This file
```

## Database Schema Design

### New Tables Required

#### `user_palettes`

Stores user-created and saved palettes.

```sql
CREATE TABLE user_palettes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  palette_data jsonb NOT NULL, -- Full HueSet[] array
  is_public boolean DEFAULT false,
  is_preset boolean DEFAULT false, -- System-managed presets
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE user_palettes ENABLE ROW LEVEL SECURITY;

-- Users can view their own palettes and public palettes
CREATE POLICY "Users can view own and public palettes"
  ON user_palettes FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_public = true
  );

-- Users can insert their own palettes
CREATE POLICY "Users can insert own palettes"
  ON user_palettes FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own palettes
CREATE POLICY "Users can update own palettes"
  ON user_palettes FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own palettes
CREATE POLICY "Users can delete own palettes"
  ON user_palettes FOR DELETE
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_user_palettes_user_id ON user_palettes(user_id);
CREATE INDEX idx_user_palettes_public ON user_palettes(is_public) WHERE is_public = true;
CREATE INDEX idx_user_palettes_preset ON user_palettes(is_preset) WHERE is_preset = true;
```

#### `palette_tags` (Optional - for categorization)

```sql
CREATE TABLE palette_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  palette_id uuid REFERENCES user_palettes(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(palette_id, tag)
);

CREATE INDEX idx_palette_tags_palette_id ON palette_tags(palette_id);
CREATE INDEX idx_palette_tags_tag ON palette_tags(tag);
```

## Refactoring Phases (Updated with Database Integration)

### **Phase 0: Database Setup** (New Phase)

**Goal**: Create database infrastructure for saving/loading palettes

**Tasks**:

1. Create migration file: `database/07_palette_storage.sql`
2. Create TypeScript types for database tables in `src/lib/supabase.ts`
3. Create `src/app/palette-generator/services/paletteService.ts` with CRUD operations:
   - `savePalette(userId, name, hues, isPublic)` → creates/updates user_palettes
   - `loadPalette(paletteId)` → fetches palette data
   - `listUserPalettes(userId)` → lists user's saved palettes
   - `listPublicPalettes()` → lists community/preset palettes
   - `deletePalette(paletteId)` → removes palette
4. Create preset palettes in `src/app/palette-generator/presets/index.ts`

**Files Created**:

- `database/07_palette_storage.sql`
- `src/app/palette-generator/services/paletteService.ts`
- `src/app/palette-generator/presets/index.ts`
- Updated: `src/lib/supabase.ts` (add UserPalette type)

**Estimated Lines**: ~250 lines

---

### **Phase 1: Extract Types & Utilities** (Foundation)

**Goal**: Separate business logic from UI components

**Tasks**:

1. Create `types/index.ts` with all interfaces (HSV, RGB, ShadeDefinition, HueSet, etc.)
2. Create `utils/colorConversions.ts`:
   - `hsvToRgb()`, `rgbToHsv()`, `hexToRgb()`, `rgbToHex()`, `hexToHsv()`
3. Create `utils/contrastCalculations.ts`:
   - `calculateContrast()`, `getLuminance()`
4. Create `utils/interpolation.ts`:
   - `splineInterpolation()`, `extrapolateLinear()`, `extrapolateWithAnchors()`, `extrapolateWithFallback()`
5. Create `utils/defaults.ts`:
   - `DEFAULT_SHADE_CONFIG`, `DEFAULT_PALETTE_COLORS`, `DEFAULT_HUE`, `MUI_PALETTE_KEYS`, `migrateHueSet()`

**Files Created**:

- `src/app/palette-generator/types/index.ts`
- `src/app/palette-generator/utils/colorConversions.ts`
- `src/app/palette-generator/utils/contrastCalculations.ts`
- `src/app/palette-generator/utils/interpolation.ts`
- `src/app/palette-generator/utils/defaults.ts`

**Estimated Lines**: ~400 lines extracted

---

### **Phase 2: Extract Dialogs & Smaller Components**

**Goal**: Create reusable, testable UI components

**Tasks**:

1. Create `components/ShadeConfigurationDialog.tsx` (180 lines)
2. Create `components/ShadeGrid/ShadeCardBadges.tsx`:
   - Extrapolation method badge
   - Achromatic indicator badge
3. Create `components/ShadeGrid/ShadeCard.tsx`:
   - Individual shade card with color picker, contrast info, lock button
   - Use ShadeCardBadges
4. Create `components/ShadeGrid/index.tsx`:
   - Grid container with responsive sizing
5. Create `components/HueEditor/HueEditorDialogs.tsx`:
   - Anchor warning dialog
   - Delete confirmation dialog

**Files Created**:

- `src/app/palette-generator/components/ShadeConfigurationDialog.tsx`
- `src/app/palette-generator/components/ShadeGrid/ShadeCardBadges.tsx`
- `src/app/palette-generator/components/ShadeGrid/ShadeCard.tsx`
- `src/app/palette-generator/components/ShadeGrid/index.tsx`
- `src/app/palette-generator/components/HueEditor/HueEditorDialogs.tsx`

**Estimated Lines**: ~450 lines extracted

---

### **Phase 3: Extract HueEditor Components**

**Goal**: Break down the complex HueEditor into manageable pieces

**Tasks**:

1. Create `components/HueEditor/HueEditorHeader.tsx`:
   - Hue name input with color name suggestion
   - MUI palette key selector
   - Delete hue button
2. Create `components/HueEditor/ExtrapolationModeSelector.tsx`:
   - Radio group for functional/functional-saturated/expressive modes
   - Generate button
   - Configure shades button
3. Create `components/HueEditor/index.tsx`:
   - Main orchestrator combining header, mode selector, D3 visualization, shade grid
   - State management for dialogs

**Files Created**:

- `src/app/palette-generator/components/HueEditor/HueEditorHeader.tsx`
- `src/app/palette-generator/components/HueEditor/ExtrapolationModeSelector.tsx`
- `src/app/palette-generator/components/HueEditor/index.tsx`

**Estimated Lines**: ~300 lines extracted

---

### **Phase 4: Database Integration Components** (New Phase)

**Goal**: Add save/load functionality with preset support

**Tasks**:

1. Create `components/PaletteToolbar.tsx`:
   - Export JSON (existing functionality)
   - **Save Palette** button (opens dialog)
   - **Load Palette** button (opens drawer/dialog)
   - Import JSON (new feature)
2. Create `components/PresetSelector.tsx`:
   - Grid/list of preset palettes
   - Preview cards with shade samples
   - Load preset action
3. Create `components/SavePaletteDialog.tsx`:
   - Name input
   - Description textarea
   - Public/private toggle
   - Save action
4. Create `components/LoadPaletteDialog.tsx`:
   - Tabs: "My Palettes" | "Presets" | "Public"
   - Search/filter functionality
   - Preview and load actions
5. Update `components/PaletteGenerator.tsx`:
   - Add state for loaded palette metadata
   - Add load/save handlers
   - Pass to toolbar

**Files Created**:

- `src/app/palette-generator/components/PaletteToolbar.tsx`
- `src/app/palette-generator/components/PresetSelector.tsx`
- `src/app/palette-generator/components/SavePaletteDialog.tsx`
- `src/app/palette-generator/components/LoadPaletteDialog.tsx`

**Estimated Lines**: ~350 lines

---

### **Phase 5: Main Component Refactoring**

**Goal**: Create clean orchestrator components

**Tasks**:

1. Create `components/PaletteGenerator.tsx`:
   - State management for hues, activeHueId
   - Tab navigation
   - Import all extracted components
   - Header configuration
   - **Add save/load integration**
2. Update `page.tsx`:
   - Minimal wrapper that imports PaletteGenerator
   - Authentication check (redirect if not signed in for save features)

**Files Created**:

- `src/app/palette-generator/components/PaletteGenerator.tsx`
- Updated: `src/app/palette-generator/page.tsx`

**Estimated Lines**: ~200 lines

---

## Testing Strategy

### Unit Tests (Future)

- Color conversion utilities (`utils/colorConversions.ts`)
- Contrast calculations (`utils/contrastCalculations.ts`)
- Interpolation functions (`utils/interpolation.ts`)

### Integration Tests (Future)

- Database service CRUD operations
- Preset loading
- Save/load palette workflows

### Manual Testing Checklist

- [ ] All existing functionality preserved
- [ ] Tabs switch between hues correctly
- [ ] Generate shades produces same results
- [ ] Lock/unlock shades works
- [ ] Color picker updates work
- [ ] Configuration dialog changes shade count
- [ ] Export JSON produces valid output
- [ ] **Save palette to database (authenticated users)**
- [ ] **Load saved palette from database**
- [ ] **Load preset palettes**
- [ ] **Public/private palette visibility**

---

## Migration Notes

### Import Updates

After each phase, update imports in dependent files. Use VS Code's "Organize Imports" feature.

### Backward Compatibility

The `migrateHueSet()` function ensures old saved JSON files still work with new structure.

### Database Palette Format

The `palette_data` JSONB field stores the full `HueSet[]` array, allowing complete restoration of generator state.

---

## Future Enhancements (Post-Refactor)

1. **Palette Sharing**:

   - Copy shareable link to public palettes
   - Embed palette in documentation

2. **Palette Variations**:

   - Fork/duplicate existing palettes
   - Create variations (lighter/darker, complementary hues)

3. **Export Formats**:

   - CSS variables
   - Sass variables
   - Tailwind config
   - Material-UI theme object
   - Figma color styles JSON

4. **Accessibility Tools**:

   - Batch WCAG compliance checker
   - Color blindness simulation

5. **Collaboration**:
   - Share palettes with team members
   - Comment/review system

---

## Success Metrics

- [x] Palette generator moved from `/experiments/palette-generator` to `/palette-generator`
- [x] All links updated across app
- [ ] Original 1,591-line file reduced to ~50-100 lines
- [ ] No more than 300 lines per component file
- [ ] All utilities have zero UI dependencies
- [ ] Database integration complete with RLS policies
- [ ] Preset palettes available
- [ ] Save/load functionality working
- [ ] All existing functionality preserved
- [ ] Performance maintained or improved (memoization)

---

## Timeline Estimate

- **Phase 0 (Database)**: 3-4 hours
- **Phase 1 (Types/Utils)**: 2-3 hours
- **Phase 2 (Dialogs/Grid)**: 3-4 hours
- **Phase 3 (HueEditor)**: 2-3 hours
- **Phase 4 (DB Integration UI)**: 4-5 hours
- **Phase 5 (Main Components)**: 2-3 hours
- **Testing & Polish**: 2-3 hours

**Total**: 18-25 hours

---

## Notes

- Each phase can be committed separately for safe rollback
- Use feature flags if needed to toggle database features
- Consider adding loading states for database operations
- Add error handling for Supabase connection failures
- Add optimistic updates for better UX when saving
