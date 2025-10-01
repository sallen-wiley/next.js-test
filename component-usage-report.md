# Component Usage Analysis Report

## Components in src/components/

### 🟢 USED Components

#### src/components/app/

1. **AppHeader.tsx** ✅ USED

   - Used in: `src/app/page.tsx`, `src/app/typography-demo/page.tsx`
   - Imports: `PrimaryLogo` from product

2. **FabThemeSwitcher.tsx** ✅ USED

   - Used in: `src/app/layout.tsx` (main app layout)

3. **GlobalHeader.tsx** ✅ USED

   - Used in: `src/app/woaa/page.tsx`, `src/app/woaa/layout.example.tsx`, `src/app/woaa/dashboard/layout.tsx`
   - Used in: `src/components/product/AppClientShell.tsx`
   - Imports: `PrimaryLogo` from product

4. **AppMenuDrawer.tsx** ✅ USED
   - Used in: `src/components/product/AppClientShell.tsx`

#### src/components/product/

1. **PrimaryLogo.tsx** ✅ USED

   - Used in: `AppHeader.tsx`, `GlobalHeader.tsx`

2. **Notification.tsx** ✅ USED

   - Used in: `src/app/experiments/notifications/admin/NotificationPreview.tsx`
   - Used in: `src/app/experiments/notifications/preferences/page.tsx`

3. **ArticleCardFigma.tsx** ✅ USED

   - Used in: `src/app/woaa/dashboard/page.tsx`

4. **AppClientShell.tsx** ✅ USED

   - Used in: `src/app/experiments/notifications/layout.tsx`
   - Imports: `HeaderActions`, `NotificationCenter`, `SupportMenuFabMenu`

5. **HeaderActions.tsx** ✅ USED (indirectly)

   - Used in: `AppClientShell.tsx`, `PPHeader.tsx`

6. **NotificationCenter.tsx** ✅ USED (indirectly)

   - Used in: `AppClientShell.tsx`

7. **SupportMenuFabMenu.tsx** ✅ USED (indirectly)

   - Used in: `AppClientShell.tsx`
   - Imports: `LiveChat`

8. **LiveChat.tsx** ✅ USED (indirectly)

   - Used in: `SupportMenuFabMenu.tsx`, `SupportMenu.tsx`

9. **PPHeader.tsx** ✅ USED (indirectly)
   - May be used via `AppClientShell` or similar patterns
   - Imports: `HeaderActions`

### 🔴 UNUSED Components

#### src/components/app/

1. **ThemeSwitcher.tsx** ❌ UNUSED
   - No imports found in codebase
   - Only self-references in the component file
   - Note: `FabThemeSwitcher` is used instead

#### src/components/product/

1. **ArticleCard.tsx** ❌ UNUSED

   - No imports found (Note: ArticleCardFigma is used instead)

2. **DraftStatusAlert.tsx** ❌ UNUSED

   - No imports found

3. **DueByAlert.tsx** ❌ UNUSED

   - No imports found

4. **ReturnedToDraftAlert.tsx** ❌ UNUSED

   - No imports found

5. **SupportMenu.tsx** 🤔 CONDITIONALLY USED

   - Has commented import in `AppClientShell.tsx`
   - Imports: `LiveChat` (suggesting it's functional)
   - May be swapped with `SupportMenuFabMenu`

6. **SupportMenuSpeedDial.tsx** ❌ UNUSED

   - No imports found

7. **TypeReturnedToDraft.tsx** ❌ UNUSED
   - No imports found

#### src/components/kitchen-sink/

1. **Button.tsx** ❌ UNUSED
   - No imports found in codebase

### 📊 Summary

**Used Components:** 13 out of 21 total components (62%)

- src/components/app/: 4 out of 5 components used (80%)
- src/components/product/: 9 out of 16 components used (56%)
- src/components/kitchen-sink/: 0 out of 1 components used (0%)

**Unused Components:** 8 out of 21 total components (38%)

### 📝 Notes

1. Most unused components are in the `product` directory and appear to be UI components that may have been created for design exploration or future features.

2. Many unused components appear to be alert/notification related components that might be used in features not yet implemented.

3. The `kitchen-sink/Button.tsx` component appears to be a showcase component that's not imported anywhere.

4. Several components have Storybook stories (`.stories.tsx` files) which suggests they're documented and potentially ready for use, just not yet implemented in the application.

5. Some components like `ThemeSwitcher.tsx` exist but `FabThemeSwitcher.tsx` is used instead, suggesting it might be an older version.

### 🧹 Cleanup Recommendations

**Safe to remove (high confidence):**

- Components with no imports and no clear future purpose
- Consider keeping if they have Storybook documentation for future use

**Investigate further:**

- Components that might be used in dynamic imports or string-based references
- Components that might be part of planned features
