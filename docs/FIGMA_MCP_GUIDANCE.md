# Figma MCP Integration: Critical Guidance for UX Teams

**Date:** January 9, 2026  
**Audience:** UX Designers, Product Designers, Design Systems Team

## The Problem

Figma's Model Context Protocol (MCP) tool generates code from designs, but its default behavior creates serious risks for design system consistency and maintainability.

## What Figma Does

When you select a layer in Figma and use the MCP tool, it generates code with:

1. **React/Tailwind code** with detailed styling specifications
2. **An instruction that says:** "SUPER CRITICAL: Transform all Tailwind classes to the target styling system **while preserving exact visual design**"
3. **Detailed visual properties:**
   - Exact pixel values: `h-[32px]`, `min-w-[96px]`, `text-[14px]`
   - Shadows: `shadow-[0px_1px_10px_0px_rgba(36,36,36,0.8)]`
   - Border radius: `rounded-[var(--radius/md,6px)]`
   - Spacing: `px-[var(--spacer/10,40px)]`
   - Typography: `font-bold text-[20px] leading-[28px]`
   - Transforms: `uppercase`, `lowercase`

## The Contradiction

Figma's instructions contradict themselves:

- **Says:** "Convert to match the target project's patterns"
- **Also says:** "Preserve exact visual design"

This creates a trap where developers feel they must recreate every visual detail from Figma.

## Why This Is Dangerous

### 1. **Creates Inconsistency (No Parity Scenario)**

When Figma design library ≠ production theme system:

- Copying Figma styles creates divergent button sizes, shadows, spacing
- Hardcoded values bypass the theme system
- Components look different across the application
- Design system becomes impossible to maintain

### 2. **Creates Brittleness (Even with Parity)**

**Even if Figma perfectly matches production**, developers cannot verify this, so:

- They add `sx` props "to be safe"
- These might duplicate theme defaults
- Hardcoded overrides prevent theme changes from applying
- Components break when switching themes
- Can't distinguish intentional overrides from redundant code

### Example of the Problem:

```tsx
// BAD: Following Figma's "preserve exact visual design"
<Button
  sx={{
    minWidth: 96,
    textTransform: 'uppercase',
    fontWeight: 700,
    borderRadius: 1,
    boxShadow: '0px 1px 10px 0px rgba(36,36,36,0.8)'
  }}
>
  Submit
</Button>

// GOOD: Using MUI defaults from theme
<Button variant="contained">
  Submit
</Button>
```

The "bad" example might look identical today, but:

- If the theme changes button styling, this component won't update
- If another theme is applied, this button will look wrong
- Maintenance becomes impossible (which styles are intentional?)

### Example: Cross-Stack Translation

```tsx
// Figma shows Ant Design with red button (danger action)
// BAD: Copying the visual color
<Button sx={{ backgroundColor: '#ff4d4f', color: 'white' }}>
  Delete
</Button>

// GOOD: Translating semantic intent to MUI
<Button color="error" variant="contained">
  Delete
</Button>

// Figma shows green button (primary action in Ant Design)
// BAD: Copying the Ant Design color
<Button sx={{ backgroundColor: '#52c41a' }}>
  Submit
</Button>

// GOOD: Translating to MUI primary (theme determines actual color)
<Button color="primary" variant="contained">
  Submit
</Button>
```

## The Solution: Figma as Wireframe

### Important: Cross-Stack Design Translation

**Some designs in this application represent products built with different tech stacks.**

For example:

- Phenom Design System designs use **Ant Design** components
- Production implementation uses **Material-UI (MUI)**

This means:

- Figma shows Ant Design styling that cannot be copied directly
- Visual styling represents **semantic intent**, not literal implementation
- **Red button = error/danger variant** (not `color: red`)
- **Bold text = emphasis** (not `font-weight: 700`)
- **Green button = success/primary action** (not `background: #81ba40`)

**Translation approach:**

1. Identify the semantic meaning ("this is a destructive action")
2. Map to MUI equivalent (`<Button color="error">` or `<Button color="secondary" variant="outlined">`)
3. Let the theme determine the actual colors, sizes, and styling

### Treat Figma Output as Structural Reference Only

**Extract from Figma:**

- ✅ Component hierarchy (Dialog → DialogTitle → DialogContent → DialogActions)
- ✅ Semantic meaning (primary button vs secondary button)
- ✅ Content and labels ("Submit", "Cancel")
- ✅ Field types (text input, email input, required fields)
- ✅ Layout relationships (button group at bottom, fields stacked)

**Ignore from Figma:**

- ❌ All Tailwind classes
- ❌ Pixel values and measurements
- ❌ Colors, shadows, borders, radius
- ❌ Typography specifications
- ❌ Text transforms
- ❌ Spacing values

### Implementation Approach

1. **Identify component types:** "This is a dialog with a title, two input fields, and three buttons"
2. **Map to MUI components:** Dialog, DialogTitle, TextField, Button
3. **Identify semantic variants:** Primary button, secondary button, text input vs email input
4. **Use MUI defaults:** Let the theme system handle all visual styling
5. **Add styling ONLY when:**
   - Explicitly required for functionality (e.g., flexbox layout)
   - Verified against the actual theme system
   - Documented as intentional override

## Communication with Development

When handing off designs to developers, specify:

### ✅ DO Specify:

- "This is a primary action button"
- "This is a destructive/error action"
- "Email field is required"
- "Buttons should be right-aligned"
- "Dialog should be medium width"
- "This represents semantic emphasis"

### ❌ DON'T Specify:

- "Button should be exactly 96px wide"
- "Use 40px horizontal padding"
- "Text should be uppercase"
- "Shadow should be rgba(36,36,36,0.8)"
- "Button should be red" (say "error variant" instead)
- "Use Ant Design green" (say "primary action" instead)
- "Match this exact Ant Design component" (describe the intent instead)

The theme system will handle these details consistently. When designs show Ant Design styling, translate the semantic meaning to MUI equivalents.

## Questions to Ask Before Using Figma MCP

1. **Do we have 1:1 parity** between our Figma component library and production theme?

   - If NO: Figma output is definitely wrong for production
   - If YES: Still can't trust the styling output (see brittleness problem above)

2. **Is this a new component** or modification to existing?

   - New: Use MUI defaults unless explicit design requirements
   - Modification: Verify changes against theme system, don't rely on Figma output

3. **Are we trying to match a design** or extract functionality?
   - Match design: This is dangerous with MCP, requires manual verification
   - Extract functionality: Perfect use case - ignore all styling from MCP

## Recommended Workflow

1. **Designer creates Figma mockup** (visual target)
2. **Designer uses MCP to generate code** (structure reference)
3. **Designer extracts semantic structure only:**
   - Component types
   - Field requirements
   - Button purposes
   - Layout relationships
4. **Developer implements using MUI components:**
   - Relies on theme system for styling
   - Adds overrides ONLY when required and verified
5. **Designer reviews implementation** against mockup
6. **If visual discrepancies exist:**
   - Decide if theme should change (affects all components)
   - OR if this component needs documented override (rare)

## Summary

**Figma MCP is useful for structure, dangerous for styling.**

- Figma's "preserve exact visual design" instruction must be ignored
- Use Figma output as wireframe reference only
- Let the theme system handle all visual design
- Only add styling when explicitly required and verified

This approach maintains design system consistency and prevents brittle, unmaintainable code.

---

**Questions or concerns?** Contact the development team before implementing components that require styling beyond MUI defaults.
