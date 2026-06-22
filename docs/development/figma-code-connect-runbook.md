# Figma Code Connect Runbook

Date: 2026-06-17
Owner: UX + Frontend

## Goal

Use this process to add or update Figma Code Connect mappings with high reliability, low token usage, and MUI-correct output.

## Quick Resume Checklist (Next Session)

1. Open this runbook and pick one selected component in Figma.
2. Run property-first MCP calls only (metadata -> design context).
3. Edit one matching `.figma.tsx` file.
4. Parse all mappings.
5. Publish with token from `.env`.
6. Verify in Figma Dev Mode that generated snippet semantics are correct.

## Current Mapping Set (Checkbox/Form + ButtonGroup)

- `src/components/mui/inputs/Checkbox.figma.tsx`
- `src/components/mui/inputs/FormLabel.figma.tsx`
- `src/components/mui/inputs/FormHelperText.figma.tsx`
- `src/components/mui/inputs/FormControlLabel.figma.tsx`
- `src/components/mui/inputs/FormGroup.figma.tsx`
- `src/components/mui/inputs/Button.figma.tsx`
- `src/components/mui/inputs/ButtonGroup.figma.tsx`
- `src/components/mui/data-display/Chip.figma.tsx`

## Required Setup

1. Figma access token is present in `.env`.
2. Project dependencies are installed.
3. `figma.config.json` exists at repo root.

Current config behavior:

- Includes files matching `*.figma.tsx`
- Upload label is `MUI React`
- Figma file URL is configured in `figma.config.json`

## Reliable One-Component Workflow

### Step 1: Use property-first MCP calls

For the selected node, call in this order:

1. `get_metadata` for selected node
2. `get_design_context` for selected node (or exact variant)

Keep requests narrow:

- Do not traverse the whole library
- Do not request broad suggestion dumps unless necessary
- Focus on component properties (Color, Size, State, Variant, booleans, text props)

### Step 2: Build/update one mapping file

Create or update one file under `src/components/mui/**/ComponentName.figma.tsx`.

Recommended mapping style:

- `figma.enum` for Variant/Color/Size/State
- `figma.string` for component text properties
- `figma.boolean` for optional props
- `figma.children` for nested connected snippets
- `figma.nestedProps` when you need text/props from nested child layers

### Step 3: Keep examples parser-safe

- Avoid computed ternaries in JSX props inside `example`.
- Prefer direct pass-through of mapped props.
- Avoid fallback expressions that parser cannot resolve against mapped props.

### Step 4: Parse before publish

Run:

- `npx figma connect parse -c figma.config.json`

Expected:

- All `.figma.tsx` files parse
- No `ParserError`

### Step 5: Publish

Load token and publish:

- `set -a; . ./.env; set +a`
- `npx figma connect publish -c figma.config.json -t "$FIGMA_ACCESS_TOKEN"`

Optional:

- `npx figma connect publish -c figma.config.json -t "$FIGMA_ACCESS_TOKEN" --dry-run`

## MUI Output Guardrails (Important)

### Checkbox group semantics

- `FormControlLabel.label` should be text, not nested `<FormLabel />`.
- Parent label should be a single `<FormLabel component="legend" />` at group level.
- Group wrapper should be `<FormControl component="fieldset" />`.
- Helper or error line should use `<FormHelperText />`.

### Checked examples

- Use `defaultChecked` in snippets for static examples.
- Avoid controlled `checked` without an `onChange` handler in generated examples.

### FormHelperText state mapping

If Figma exposes one property with values `Enabled | Error | Disabled`, map to two MUI booleans:

- `disabled`
- `error`

### ButtonGroup sizing rule

- Prefer group-level `size` on `<ButtonGroup />`.
- Derive size from the first nested `<Button>` using `figma.nestedProps("<Button>", { size: ... })`.
- Keep child `<Button>` size props minimal (e.g., map Medium to `undefined`) to avoid redundant per-button size in snippets.

## Troubleshooting

### Error: `model_max_prompt_tokens_exceeded`

Cause:

- MCP request returned too much component tree/layout detail.

Fix:

- Use one selected node
- Use metadata + design context only
- Avoid broad suggestion expansion

### Error: `403 Token expired`

Cause:

- `FIGMA_ACCESS_TOKEN` in `.env` is expired.

Fix:

1. Replace token in `.env`
2. Re-run publish

### Error: `ParserError`

Cause:

- Example uses parser-unfriendly computed expressions.

Fix:

- Push conditions into prop mappings when possible
- Pass mapped props directly in `example`
- Remove fallback logic that parser cannot statically map

## Verification Checklist

After publish:

1. Open node in Figma Dev Mode.
2. Confirm mapping appears under `MUI React`.
3. Confirm generated snippet uses MUI-correct semantics (not just visual match).
4. Confirm nested component behavior (children and text extraction) is as expected.

## Change Log

- 2026-06-17: Initial runbook created.
- 2026-06-17: Added resume checklist, component decisions, MUI semantics guardrails, and ButtonGroup size strategy.
