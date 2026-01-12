# Phase 0 Complete: Database Setup for Palette Generator

## ✅ Completed Tasks

### 1. Directory Structure

- **Moved** palette generator from `/experiments/palette-generator` to `/palette-generator`
- **Updated** all links across:
  - `SETUP_GUIDE.md`
  - `README.md` (directory structure + routes)
  - `src/app/page.tsx` (landing page link)
  - Documentation remains in `docs/components/palette-generator.md`

### 2. Database Migration Created

**File**: `database/07_palette_storage.sql`

**Table**: `user_palettes`

- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `name` (text, required)
- `description` (text, optional)
- `palette_data` (jsonb, HueSet[] array)
- `is_public` (boolean, default false)
- `is_preset` (boolean, default false)
- `created_at` (timestamptz)
- `updated_at` (timestamptz, auto-updated)

**Indexes Created**:

- User lookup: `idx_user_palettes_user_id`
- Public palettes: `idx_user_palettes_public`
- Preset palettes: `idx_user_palettes_preset`
- Public + preset: `idx_user_palettes_public_preset`
- Recent palettes: `idx_user_palettes_created`

**RLS Policies**:

- ✅ Users can view own + public palettes
- ✅ Users can insert own palettes (not presets)
- ✅ Users can update own non-preset palettes
- ✅ Users can delete own non-preset palettes
- ✅ Presets can only be created via direct SQL (admin)

**Triggers**:

- ✅ Auto-update `updated_at` timestamp on modifications

### 3. TypeScript Types Added

**File**: `src/lib/supabase.ts`

**New Types**:

```typescript
UserPalette; // Database table row
PaletteData; // HueSet[] array
HueSet; // Hue configuration with shades
ShadeDefinition; // Individual shade with color/HSV
ShadeConfiguration; // Shade count and labels
HSV; // Hue/Saturation/Value color model
```

### 4. Palette Service Created

**File**: `src/app/palette-generator/services/paletteService.ts`

**Functions**:

- `savePalette()` - Create or update palette
- `loadPalette()` - Load specific palette by ID (auto-migrates old formats)
- `listUserPalettes()` - List user's saved palettes
- `listPublicPalettes()` - List community shared palettes
- `listPresetPalettes()` - List system presets
- `deletePalette()` - Delete user's palette
- `duplicatePalette()` - Fork existing palette
- `searchPalettes()` - Search by name

**Utilities**:

- `migratePaletteData()` - Migrate old palette formats to current structure
- `generateMuiThemeExport()` - Convert HueSet[] to MUI palette format
- `generateFullExport()` - Generate complete export JSON (matches page.tsx format)
- `exportPaletteAsJson()` - Export palette as downloadable JSON blob
- `downloadPalette()` - Download palette as JSON file

**Error Handling**:

- Custom `PaletteServiceError` class
- Detailed error messages with codes
- RLS policy enforcement

### 5. Preset Palettes Created

**File**: `src/app/palette-generator/presets/index.ts`

**5 Preset Palettes**:

1. **Material Blue** - Standard MUI blue (functional mode)
2. **Sage Green** - Calming nature palette (functional mode)
3. **Sunset Orange** - Vibrant sunset (expressive mode)
4. **Purple Rain** - Rich saturated darks (functional-saturated mode)
5. **Forest Green** - Natural green (functional mode)

**Preset Registry**:

- `PresetPaletteInfo` interface with metadata
- `PRESET_PALETTES` array with all presets
- Helper functions:
  - `getPresetById(id)`
  - `getPresetsByCategory(category)`
  - `getPresetsByTag(tag)`

**Categories**: material, nature, vibrant, neutral, custom

### 6. Documentation Updated

#### database/README.md

- ✅ Added `07_palette_storage.sql` to migration file list
- ✅ Added `user_palettes` to table list
- ✅ Added "Palette Generator Flow" section
- ✅ Added palette RBAC permissions table
- ✅ Added "Save User Palette" common task
- ✅ Added "Create System Preset Palette" task
- ✅ Added "Load Preset Palettes" task

#### .github/copilot-instructions.md

- ✅ Added `user_palettes` table documentation
- ✅ Added palette service reference
- ✅ Added RLS policy details

## 📋 Next Steps: Run Migration

### Step 1: Run Migration in Supabase

1. Open Supabase SQL Editor
2. Copy contents of `database/07_palette_storage.sql`
3. Execute the SQL
4. Verify table creation:
   ```sql
   SELECT table_name, column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'user_palettes'
   ORDER BY ordinal_position;
   ```

### Step 2: (Optional) Seed Preset Palettes

Run this SQL to populate system presets from the TypeScript definitions:

```sql
-- Insert Material Blue preset
INSERT INTO user_palettes (user_id, name, description, palette_data, is_public, is_preset)
VALUES (
  (SELECT id FROM user_profiles WHERE role = 'admin' LIMIT 1),
  'Material Blue',
  'Standard Material-UI blue palette',
  '[{"id":"mui-blue","name":"Blue","muiName":"blue","extrapolationMode":"functional","shadeConfig":[{"id":"1","label":"50"},{"id":"2","label":"100"},{"id":"3","label":"200"},{"id":"4","label":"300"},{"id":"5","label":"400"},{"id":"6","label":"500"},{"id":"7","label":"600"},{"id":"8","label":"700"},{"id":"9","label":"800"},{"id":"10","label":"900"}],"shades":[{"id":"shade-1","label":"50","color":"#E3F2FD","locked":true,"hsv":{"h":207,"s":11,"v":99},"selectedForH":true,"selectedForS":true,"selectedForV":true},{"id":"shade-2","label":"100","color":"#BBDEFB","locked":false,"hsv":{"h":207,"s":26,"v":98},"selectedForH":true,"selectedForS":true,"selectedForV":true},{"id":"shade-3","label":"200","color":"#90CAF9","locked":false,"hsv":{"h":207,"s":42,"v":98},"selectedForH":true,"selectedForS":true,"selectedForV":true},{"id":"shade-4","label":"300","color":"#64B5F6","locked":false,"hsv":{"h":207,"s":59,"v":96},"selectedForH":true,"selectedForS":true,"selectedForV":true},{"id":"shade-5","label":"400","color":"#42A5F5","locked":false,"hsv":{"h":207,"s":73,"v":96},"selectedForH":true,"selectedForS":true,"selectedForV":true},{"id":"shade-6","label":"500","color":"#2196F3","locked":true,"hsv":{"h":207,"s":86,"v":95},"selectedForH":true,"selectedForS":true,"selectedForV":true},{"id":"shade-7","label":"600","color":"#1E88E5","locked":false,"hsv":{"h":207,"s":87,"v":90},"selectedForH":true,"selectedForS":true,"selectedForV":true},{"id":"shade-8","label":"700","color":"#1976D2","locked":false,"hsv":{"h":210,"s":88,"v":82},"selectedForH":true,"selectedForS":true,"selectedForV":true},{"id":"shade-9","label":"800","color":"#1565C0","locked":false,"hsv":{"h":210,"s":89,"v":75},"selectedForH":true,"selectedForS":true,"selectedForV":true},{"id":"shade-10","label":"900","color":"#0D47A1","locked":true,"hsv":{"h":210,"s":92,"v":63},"selectedForH":true,"selectedForS":true,"selectedForV":true}]}]'::jsonb,
  true,
  true
);

-- Repeat for other presets (Sage Green, Sunset Orange, Purple Rain, Forest Green)
-- See src/app/palette-generator/presets/index.ts for complete JSON data
```

### Step 3: Update Schema Export

```bash
node database/reviewer-ingestion/export-schema.js
```

This will create a new schema export including the `user_palettes` table.

## 🎯 What's Next: Phase 1

**Phase 1: Extract Types & Utilities**

Now that database infrastructure is ready, proceed with component refactoring:

1. Create `src/app/palette-generator/types/index.ts`
2. Create `src/app/palette-generator/utils/colorConversions.ts`
3. Create `src/app/palette-generator/utils/contrastCalculations.ts`
4. Create `src/app/palette-generator/utils/interpolation.ts`
5. Create `src/app/palette-generator/utils/defaults.ts`

This will extract ~400 lines from the monolithic `page.tsx`.

## 📊 Files Created/Modified

### Created (5 files)

- ✅ `database/07_palette_storage.sql` (157 lines)
- ✅ `src/lib/supabase.ts` (added 55 lines of types)
- ✅ `src/app/palette-generator/services/paletteService.ts` (450 lines)
- ✅ `src/app/palette-generator/presets/index.ts` (367 lines)
- ✅ `src/app/palette-generator/REFACTOR_PLAN.md` (full refactoring plan)

### Modified (4 files)

- ✅ `database/README.md` (updated migration list, tables, workflows, tasks)
- ✅ `.github/copilot-instructions.md` (added user_palettes documentation)
- ✅ `SETUP_GUIDE.md` (updated palette generator URL)
- ✅ `README.md` (updated directory structure + routes)
- ✅ `src/app/page.tsx` (updated landing page link)

### Total Lines Added

~1030 lines of new code + documentation

## ✨ Features Enabled

After running the migration, the palette generator will support:

- ✅ **Save Palettes** - Users can save their work to database
- ✅ **Load Palettes** - Users can load previously saved palettes (auto-migrates old formats)
- ✅ **Export to JSON** - Download palettes in full export format (matches existing exportPalette())
- ✅ **Public Sharing** - Users can share palettes publicly
- ✅ **Preset Loading** - 5 built-in preset palettes available
- ✅ **Palette Management** - CRUD operations via service layer
- ✅ **Search** - Find palettes by name
- ✅ **Forking** - Duplicate existing palettes
- ✅ **Backward Compatibility** - Old palette formats auto-migrate on load

All features are secured with RLS policies and respect user authentication.

## 🔧 Technical Decisions

**Storage Strategy**: Store minimal data (HueSet[] only)

- `palette_data` contains only the source-of-truth HueSet[] array
- `muiTheme` export format is regenerated on-demand via `generateMuiThemeExport()`
- `version`, `colorSpace` metadata added during export via `generateFullExport()`
- **Benefits**: Smaller storage, no redundancy, easier updates
- **Tradeoff**: Slight computation overhead when exporting (negligible)

**Migration Strategy**: Automatic on load

- `loadPalette()` auto-migrates old formats via `migratePaletteData()`
- Ensures backward compatibility with any previously saved palettes
- No manual migration required

**Export Compatibility**: Matches existing page.tsx format

- `generateFullExport()` produces identical JSON to current `exportPalette()`
- Users can save/load between database and file-based exports seamlessly
