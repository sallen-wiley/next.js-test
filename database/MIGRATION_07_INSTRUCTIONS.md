# How to Run the Palette Storage Migration

## Prerequisites

- Access to Supabase SQL Editor
- Admin role in `user_profiles` table (for seeding presets)

## Step 1: Run the Migration

1. Open your Supabase project
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `database/07_palette_storage.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter`

## Step 2: Verify Table Creation

Run this query to confirm the table was created:

```sql
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_palettes'
ORDER BY ordinal_position;
```

Expected output: 9 columns (id, user_id, name, description, palette_data, is_public, is_preset, created_at, updated_at)

## Step 3: Verify Indexes

```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'user_palettes';
```

Expected output: 5 indexes (user_id, public, preset, public_preset, created)

## Step 4: Verify RLS Policies

```sql
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'user_palettes';
```

Expected output: 4 policies (SELECT, INSERT, UPDATE, DELETE)

## Step 5: Update Schema Export

Back in your local terminal:

```bash
node database/reviewer-ingestion/export-schema.js
```

This will create a new schema export in `database/schema-exports/` with the updated schema including `user_palettes`.

## Step 6: (Optional) Seed Preset Palettes

If you want to populate the database with the 5 built-in presets, you can use the preset service or manually insert them.

### Option A: Use the Application (Recommended)

Once Phase 4 is complete, there will be an admin UI to seed presets.

### Option B: Manual SQL Insert

Create a preset palette manually:

```sql
INSERT INTO user_palettes (
  user_id,
  name,
  description,
  palette_data,
  is_public,
  is_preset
)
VALUES (
  (SELECT id FROM user_profiles WHERE role = 'admin' LIMIT 1),
  'Material Blue',
  'Standard Material-UI blue palette',
  -- See PHASE_0_COMPLETE.md for full JSON data
  '[]'::jsonb,
  true,
  true
);
```

## Troubleshooting

### Error: "permission denied for table user_palettes"

- Make sure you're running the migration as a database admin/owner
- RLS policies are enabled, so regular users won't be able to bypass them

### Error: "constraint name_not_empty violated"

- Palette name cannot be empty
- Make sure the name field has a value

### Error: "palette_data must be a JSON array"

- The palette_data field expects a JSONB array
- Verify the JSON structure matches `HueSet[]`

### Error: "user cannot create presets"

- Regular users cannot set `is_preset = true`
- Only direct SQL (bypassing RLS) can create presets
- Use an admin account or run via SQL editor

## Testing the Migration

### Test 1: User Can View Public Palettes

```sql
-- Should return presets and public palettes
SELECT id, name, is_public, is_preset
FROM user_palettes
WHERE is_public = true;
```

### Test 2: User Can Insert Own Palette

```sql
-- Replace <your-user-id> with actual user ID
INSERT INTO user_palettes (user_id, name, palette_data, is_public, is_preset)
VALUES (
  '<your-user-id>',
  'Test Palette',
  '[]'::jsonb,
  false,
  false
)
RETURNING id, name;
```

### Test 3: User Cannot Create Preset

```sql
-- This should FAIL due to RLS policy
INSERT INTO user_palettes (user_id, name, palette_data, is_public, is_preset)
VALUES (
  auth.uid(),
  'Fake Preset',
  '[]'::jsonb,
  true,
  true  -- This will be rejected
)
RETURNING id;
```

Expected: Error "new row violates row-level security policy"

## Next Steps

After successful migration:

1. ✅ Palette storage infrastructure is ready
2. ✅ Service layer is implemented (`paletteService.ts`)
3. ✅ TypeScript types are defined
4. ✅ Preset palettes are defined in code
5. 🔄 **Next**: Proceed to Phase 1 - Extract types and utilities from `page.tsx`

See `REFACTOR_PLAN.md` for complete refactoring roadmap.
