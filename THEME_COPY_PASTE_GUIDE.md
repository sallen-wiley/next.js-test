# Theme Copy/Paste Guide

The Wiley theme has been refactored to make it easy to copy and create new theme variations. Here's how to create a new theme from the Wiley theme:

## Quick Copy/Paste Steps

### 1. Copy the Theme Directory

```bash
cp -r src/themes/wiley src/themes/your-new-theme
```

### 2. Update Brand Colors (Optional)

Edit `src/themes/your-new-theme/brandColors.ts`:

```typescript
export const brandColors = {
  blue: {
    dark: "#YourNewBlue",
    medium: "#YourMediumBlue",
    bright: "#YourBrightBlue",
  },
  // ... update other colors as needed
};
```

### 3. Update Typography (Optional)

Edit `src/themes/your-new-theme/index.ts`:

```typescript
typography: {
  fontFamily: "'Your Font Family'", // Change font
  // other typography settings...
},
```

And update the font loading CSS in the same file:

```typescript
styleOverrides: `
  @font-face {
    font-family: 'Your Font Family';
    // ... font loading CSS
  }
`,
```

### 4. Register the Theme

Add your theme to `src/themes/index.ts`:

```typescript
import yourNewTheme from "./your-new-theme";

export const themes = {
  // ... existing themes
  yourNewTheme: yourNewTheme,
};

export { /* existing exports */, yourNewTheme };
```

### 5. Add Theme Metadata

Add metadata to `src/components/app/FabThemeSwitcher.tsx`:

```typescript
const themeMetadata: Record<ThemeName, ...> = {
  // ... existing themes
  yourNewTheme: {
    label: "Your New Theme",
    description: "Description of your theme",
    color: "#YourPrimaryColor",
    icon: "🎨",
  },
};
```

## What's Been Simplified

The original Wiley theme had these portability issues that have been fixed:

### ❌ Before (Hard to Copy)

- Theme variable named `wileyTheme` throughout
- Self-referencing `wileyTheme.breakpoints.up()`
- Brand-specific import `wileyColors`
- Comments mentioning "Wiley"

### ✅ After (Easy to Copy)

- Generic theme variable name `theme`
- Uses callback parameter `theme.breakpoints.up()`
- Generic import `brandColors`
- Generic comments

## Example: Wiley 2025 Theme

We've created `wiley2025` as an example of how easy this process is:

1. **Copied directory**: `cp -r src/themes/wiley src/themes/wiley2025`
2. **Updated colors**: Changed blue palette in `brandColors.ts`
3. **Changed font**: From "Open Sans" to "Inter"
4. **Registered**: Added to themes index and switcher metadata

The entire process took just a few minutes!

## Benefits

- **Fast duplication**: Copy entire theme folder in seconds
- **Minimal changes**: Only update what you want to change
- **No find/replace**: Generic naming means no search/replace needed
- **Type safety**: TypeScript automatically picks up new themes
- **Hot reloading**: Changes appear immediately in development

## Best Practices

1. **Keep brand colors separate**: Use `brandColors.ts` for easy color swapping
2. **Generic naming**: Avoid brand-specific variable names
3. **Use theme callbacks**: Always use `({ theme }) => ({ ... })` for component overrides
4. **Document changes**: Add comments about what makes your theme unique
