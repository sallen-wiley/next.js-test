# Figma Code Connect Runbook

Date: 2026-06-17
Owner: UX + Frontend

## Goal

Use this process to add or update Figma Code Connect mappings with high reliability, low token usage, and MUI-correct output.

Engineers and agents **reproducing a design** (not authoring mappings) should use the WIP [usage / handoff guide](figma-code-connect-usage.md) instead of this runbook.

## Quick Resume Checklist (Next Session)

1. Open this runbook and pick one selected component in Figma.
2. Run property-first MCP calls only (metadata -> design context).
3. Produce the [Component Analysis](#component-analysis-template) before writing code.
4. If the component is composite, map its atoms first (see [Composite Components](#composite-components-decomposition-policy)).
5. Edit one matching `.figma.tsx` file.
6. Parse all mappings.
7. Publish with token from `.env`.
8. Verify in Figma Dev Mode that generated snippet semantics are correct.
9. Update the [Status Tracker](#status-tracker) and Change Log.

## Correctness Floor (Prefer Sparse Over Wrong)

A mapping that emits a confident but incorrect snippet is worse than one that emits almost nothing. A human skims the wrong snippet and ships it; a sparse snippet costs them a short read of the MUI docs.

The floor for any mapping is: **the smallest snippet that compiles, using only props backed by a real Figma component property.**

- Map a prop only when a Figma _property_ (not a layer name, not a visual detail) supplies its value.
- Include MUI's required props even when Figma cannot supply them, using placeholder values.
- Prefer placeholders that render meaningfully over empty ones. `options={["Option 1", "Option 2"]}` with a labelled input previews as a working component; `options={[]}` previews as something broken.
- Source placeholders from the component's Figma usage description where one exists, so the values are documented rather than invented.
- Drop anything inferred from layer structure rather than stated by a property.
- Add a `links` entry pointing at the MUI API page so the reader knows where to fill in the gaps.
- Do not invent `sx`, ids, or handlers to make the snippet look complete.

`Autocomplete` is the reference example: of everything visible in the Figma tree, only `Multiple Value` is a genuine property, so only `multiple` is mapped.

## Core Principle

The Figma library mirrors MUI almost 1:1. Every mapping must therefore surface **MUI props and MUI notation**, not Figma's visual property names. A Figma property only exists in the output if it corresponds to a real MUI prop; otherwise it is dropped or translated.

- Figma `Variant` / `Color` / `Size` -> MUI `variant` / `color` / `size`
- Figma `State` (Enabled/Hover/Focus/Disabled/Error) -> MUI booleans (`disabled`, `error`); interaction-only states map to `undefined`
- Figma text properties -> `children` or the matching MUI text prop (`label`, `helperText`)
- Figma slot booleans -> MUI slot props via `figma.children(...)` (`startIcon`, `endIcon`, `avatar`)
- MUI default values map to `undefined` so snippets stay clean (e.g. `Medium: undefined`)

## Component Analysis Template

Produce this before editing any file. Keep it short; it is a decision record, not a spec.

```md
### <ComponentName>

- Figma node: <url with node-id>
- MUI component: <import from @mui/material>
- Classification: atom | composite
- Target file: src/components/mui/<category>/<ComponentName>.figma.tsx

| Figma property | Type    | MUI prop  | Mapping      |
| -------------- | ------- | --------- | ------------ |
| Variant        | variant | `variant` | `figma.enum` |
| ...            |         |           |              |

- Unmapped Figma properties (and why): ...
- Child components required (composite only): ...
- Risks / parser concerns: ...
```

Category folders follow the MUI docs taxonomy: `inputs`, `data-display`, `feedback`, `surfaces`, `navigation`, `layout`, `utils`.

## Composite Components (Decomposition Policy)

A component is **composite** when its Figma instance contains nested instances that correspond to distinct MUI components (e.g. `Card` containing `CardHeader` + `Button`, or `FormGroup` containing `FormControlLabel` + `Checkbox`).

Rules:

1. **Atoms first.** Do not author the composite mapping until every child MUI component it contains has its own published `figma.connect` mapping. `figma.children()` only renders a nested snippet if the child instance is itself connected.
2. **One file per MUI component**, named after the component it connects, even when the example renders a wrapper (see `FormGroup.figma.tsx`, which connects `FormGroup` but its example renders `FormControl` > `FormLabel` > `FormGroup` > `FormHelperText`).
3. **Match children by layer name**, using the Figma layer name exactly. Alternation is supported: `figma.children("<FormControlLabel> | Checkbox")`. Use `figma.children("*")` only when layer names are unstable **and every nested instance is itself connected**. `"*"` is not a safe default for page-level slots — see [Mapped containers and nested page content](#mapped-containers-and-nested-page-content). **`figma.children()` does traverse into a SLOT** — verified with `<FormGroup> | <Checkbox>`, whose `Checkboxes` slot resolved correctly without needing to match the slot layer itself.
4. **Lift shared props to the wrapper.** If MUI expects the prop on the parent (e.g. `ButtonGroup.size`, `FormControl.disabled`), derive it with `figma.nestedProps("<Child>", {...})` and map the child's own prop to `undefined` to avoid redundant output.
5. **Pull text out of nested layers** with `figma.nestedProps` rather than nesting a connected child inside a prop that expects a string (e.g. `FormControlLabel.label`).
6. **Record the dependency** in the Status Tracker so a paused session can resume at the right layer.

### Divergent composites (Figma structure != MUI structure)

Some Figma components are assembled from whatever symbol was visually convenient, not from the components MUI actually composes. Example: Figma's `<Autocomplete>` is built by nesting the `<Select>` symbol, but MUI's `Autocomplete` renders a `TextField` via `renderInput` and has no relationship to `Select`.

When this happens:

- **Map to the MUI composition, not the Figma layer tree.** The generated snippet must be code a developer can paste.
- **Do not use `figma.children()` for internals MUI renders itself** (tags/chips, popper/listbox, clear and dropdown indicators). Those are controlled by props (`multiple`, `disableClearable`, `renderTags`), not by children.
- Use `figma.nestedProps()` on the misused wrapper layer purely to harvest text/enum values.
- Note the divergence in the analysis so the next session does not "fix" the mapping back toward the Figma tree.

### `nestedProps` vs `children`: what happens when the child gets connected

These two APIs behave differently once the nested component has its own mapping:

| API                   | Effect on the parent snippet                        |
| --------------------- | --------------------------------------------------- |
| `figma.children()`    | Renders the child's connected snippet nested inside |
| `figma.nestedProps()` | Reads values only \u2014 renders nothing            |

So connecting a child does **not** retroactively inject it into parents that harvested it with `nestedProps`. Connecting `Select` will not put a `<Select>` into Autocomplete's snippet, because Autocomplete uses `nestedProps("<Select>", ...)`.

`FormControlLabel` demonstrates both at once. `FormLabel` is connected and has its own snippet, yet appears here as a string because it was harvested with `nestedProps`, while the Checkbox was mapped with `children` and is nested:

```tsx
<FormControlLabel control={<Checkbox indeterminate />} label="Parent" />
```

**Side effect for divergent composites:** once a misused wrapper is connected, that nested _layer_ gains its own Dev Mode snippet. A developer who drills into the input inside an `<Autocomplete>` and selects the `<Select>` layer will be shown Select code, which is wrong for that context. Selecting the parent gives the correct answer. Nothing in the mapping can prevent this \u2014 it is a property of the design file reusing a component MUI does not use.

Worked example of the dependency order already in the repo:

```text
Checkbox  ->  FormControlLabel  ->  FormGroup
FormLabel ------^                    ^
FormHelperText ----------------------|
Button    ->  ButtonGroup
```

## Properties Are Communicated, Overrides Are Not

Code Connect reads **component properties**. It does not read instance overrides. Padding, spacing, position, size and free-form layout tweaks applied to an instance are invisible to the generated snippet.

A single instance of `<FormGroup> | <Checkbox>` (`1495:11133`) demonstrates both sides:

| Override on the instance   | Reaches the snippet? | Why                                              |
| -------------------------- | -------------------- | ------------------------------------------------ |
| Helper text hidden         | Yes                  | Bound to the `<FormHelperText>` boolean property |
| Indent padding on children | No                   | A raw instance override, not a property          |

The design showed checkboxes indented beneath a parent; the snippet emitted three flat siblings. The `indeterminate` prop survived — MUI's idiom for a partially-selected parent — but inference is not specification: nothing said which children belonged to the parent, and MUI's documented pattern needs an explicit indent on a nested group.

This failure is dangerous because it is silent. The snippet looks plausible and is simply wrong.

When a design intent matters to engineers, promote it out of override-land, best option first:

1. **Make it structural.** Nest a real `<FormGroup>` instance inside the slot instead of indenting with padding. `figma.children()` then produces a nested group and the design file matches the React tree, so it stays correct as the design changes.
2. **Add a property.** A `Nested` boolean mapped to the indent. Cheap, but fixes one nesting depth and hides a layout constant in the mapping.
3. **Make it a separate component** with its own mapping. Right for a recurring standardised pattern, overkill for a one-off.

### Interim measure: caveat comments in the snippet

Until a design fix lands, a JSX comment in the `example` is the cheapest way to warn readers. Comments are static content, so the parser bakes them into the template verbatim and they appear in the published snippet — the one place an AI or engineer is guaranteed to look:

```tsx
example: ({ ... }) => (
  <FormControl component="fieldset">
    {/* Check the design: nested checkbox families are shown by indentation, which this snippet cannot express. */}
    ...
  </FormControl>
),
```

Guidelines:

- **Start the comment with `Check the design:`** so every caveat is greppable across mappings when the time comes to formalise a real solution.
- **Say what to do, not just what is missing.** "Check the design" beats "indentation is unsupported".
- **Use sparingly.** The comment appears on _every_ instance of the component, including ones with no nesting at all, so each caveat is permanent noise for the majority case.
- **Treat it as a stopgap, not a fix.** It relies on the reader caring. It does not make the snippet correct.

Pair it with a `links` entry to the relevant MUI docs so the reader has somewhere to go.

## Status Tracker

Update on every session. `Published` means parsed, published, and verified in Dev Mode.

| Component          | Category     | Type                                                    | Mapping file                                             | Status                                             |
| ------------------ | ------------ | ------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------- |
| Button             | inputs       | atom                                                    | `src/components/mui/inputs/Button.figma.tsx`             | Published                                          |
| ButtonGroup        | inputs       | composite (Button)                                      | `src/components/mui/inputs/ButtonGroup.figma.tsx`        | Published                                          |
| Checkbox           | inputs       | atom                                                    | `src/components/mui/inputs/Checkbox.figma.tsx`           | Published                                          |
| FormLabel          | inputs       | atom                                                    | `src/components/mui/inputs/FormLabel.figma.tsx`          | Published                                          |
| FormHelperText     | inputs       | atom                                                    | `src/components/mui/inputs/FormHelperText.figma.tsx`     | Published                                          |
| FormControlLabel / Checkbox | inputs | composite (Checkbox, FormLabel)                       | `src/components/mui/inputs/FormControlLabel.figma.tsx`   | Published and verified |
| FormGroup / Checkbox | inputs     | composite (FormControlLabel, FormLabel, FormHelperText) | `src/components/mui/inputs/FormGroup.figma.tsx`          | Published (`2483:185674`) and verified |
| Radio              | inputs       | atom                                                    | `src/components/mui/inputs/Radio.figma.tsx`              | Published and verified |
| FormControlLabel / Radio | inputs | composite (Radio, FormLabel)                            | `src/components/mui/inputs/FormControlLabelRadio.figma.tsx` | Published and verified |
| RadioGroup         | inputs       | composite (FormControlLabel, FormLabel, FormHelperText) | `src/components/mui/inputs/RadioGroup.figma.tsx`         | Published (`1479:32615`) and verified |
| Switch             | inputs       | atom                                                    | `src/components/mui/inputs/Switch.figma.tsx`             | Published and verified |
| FormControlLabel / Switch | inputs | composite (Switch, FormLabel)                          | `src/components/mui/inputs/FormControlLabelSwitch.figma.tsx` | Published and verified |
| FormGroup / Switch | inputs       | composite (FormControlLabel, FormLabel, FormHelperText) | `src/components/mui/inputs/SwitchGroup.figma.tsx`        | Published (`642:108242`) and verified |
| Chip               | data-display | atom                                                    | `src/components/mui/data-display/Chip.figma.tsx`         | Published                                          |
| Typography         | data-display | atom                                                    | `src/components/mui/data-display/Typography.figma.tsx`   | Published and verified (`11609:174872`)            |
| Icon               | data-display | atom / swapped icon wrapper                             | `src/components/mui/data-display/Icon.figma.tsx`         | Published and verified. Font: all sizes. SVG: Medium only |
| Material icon catalog | data-display | 98 standalone SVG icon sources                       | `src/components/mui/data-display/IconCatalog.figma.tsx` plus existing UnfoldMore mapping | Published; generated 97 plus existing UnfoldMore; sampled StarSharp verified |
| IconButton         | inputs       | composite (Icon)                                        | `src/components/mui/inputs/IconButton.figma.tsx`         | Published and verified (`6557:38545`)              |
| InputAdornment     | inputs       | atom (Icon or text content)                              | `src/components/mui/inputs/InputAdornment.figma.tsx`     | Code Connect published and verified (`2565:5754`); Figma library publish pending |
| UnfoldMoreOutlined | inputs       | icon                                                    | `src/components/mui/inputs/UnfoldMoreOutlined.figma.tsx` | Published                                          |
| Autocomplete       | inputs       | divergent composite (renders TextField internally)      | `src/components/mui/inputs/Autocomplete.figma.tsx`       | Published and verified (all 4 variants)            |
| Container          | layout       | layout wrapper (`figma.children("*")`)                  | `src/components/mui/layout/Container.figma.tsx`          | **Unpublished** 2026-09-22. File kept, excluded from `figma.config.json` so publish does not restore it |
| TextField          | inputs       | composite (FormHelperText, InputAdornment)              | `src/components/mui/inputs/TextField.figma.tsx`          | Base and multiline Code Connect published and verified (`6570:48313`, `7551:51690`) |
| Select             | inputs       | composite (MenuItem, InputLabel, FormHelperText)        | —                                                        | Not started                                        |
| MenuItem           | navigation   | atom                                                    | —                                                        | Not started                                        |

### Worklist (MUI documentation order)

Working through MUI's own component order. Inputs:

1. ~~Autocomplete~~ — done
2. ~~Button~~ — done
3. ~~Button Group~~ — done
4. ~~Checkbox~~ — done
5. Floating Action Button
6. ~~Radio Group~~ — done (Radio → FormControlLabel → RadioGroup)
7. Rating
8. Select — `6570:41424`, large set (Variant × Size × State × Active × Has Value)
9. Slider
10. ~~Switch~~ — done (Switch → FormControlLabel → FormGroup)
11. Text Field
12. Transfer List
13. Toggle Button

## Required Setup

1. Figma access token is present in `.env`.
2. Project dependencies are installed.
3. `figma.config.json` exists at repo root.

### Token expiry

Figma personal access tokens max out at a **90 day** lifetime — there is no non-expiring option. Expect to regenerate roughly quarterly; a publish that suddenly returns `403 Token expired` is almost always this rather than a permissions change.

The token needs **Code Connect: write** scope. Regenerate it in Figma under Settings → Security → Personal access tokens, and update `FIGMA_ACCESS_TOKEN` in `.env` by hand (never paste it into a chat or a command that gets logged).

Current config behavior:

- Includes files matching `*.figma.tsx`
- Excludes `src/components/mui/layout/Container.figma.tsx` so a full publish does not restore the unpublished open-host mapping
- Upload label is `React`
- Figma file URL is configured in `figma.config.json`

### The label must be `React`

`codeConnect.label` is not cosmetic. It must stay `React` — a custom value such as `MUI React` silently disables Code Connect substitution in `get_design_context`, which then returns raw Tailwind as if no mappings existed. The same custom label also makes `get_code_connect_map` return `{}` when passed as `codeConnectLabel`. Neither failure produces an error message.

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

Create or update one file under `src/components/mui/**/ComponentName.figma.tsx`. If the analysis classified the component as composite, confirm every child mapping exists and is published first.

Recommended mapping style:

- `figma.enum` for Variant/Color/Size/State
- `figma.string` for component text properties
- `figma.boolean` for optional props
- `figma.children` for nested connected snippets
- `figma.nestedProps` when you need text/props from nested child layers

### Step 3: Keep examples parser-safe

The parser bakes everything that is **not** a mapped prop into the template as literal text. Arrow functions, JSX spreads, and array literals are therefore all fine as static content — `renderInput={(params) => <TextField {...params} />}` and `options={[]}` both parse without complaint.

The actual restriction is narrower: **expressions that compute over mapped props are rejected.**

- Avoid computed ternaries over mapped props in JSX (`onDelete={deletable ? fn : undefined}`).
- Avoid wrapping a mapped prop in an expression (`defaultValue={[value]}`).
- Push those conditions into the `props` object instead, and pass the result through directly.
- Static JSX that never references a mapped prop can be as complex as needed.

**Mapped props work inside render-prop arrow functions.** Verified on Autocomplete: `renderInput={(params) => <TextField {...params} label={select.label} />}` resolves correctly, including property access on a `figma.nestedProps` object. This matters for `TextField` and `Select`, which have the same shape.

### Step 4: Parse before publish

Run:

- `npx figma connect parse -c figma.config.json`

Expected:

- All `.figma.tsx` files parse
- No `ParserError`

### Step 4b: Check for stale node ids

Figma node ids rot. When a designer deletes, replaces, or re-creates a component, the id baked into the mapping URL stops resolving and **publish fails for the whole batch**, not just the broken file.

Run:

- `set -a; . ./.env; set +a`
- `node scripts/check-figma-node-ids.js`

This reads the node id out of every `*.figma.tsx` and cross-checks it against both Figma sources of truth, reporting `OK` / `STALE` / `UNPUBLISHED` / `NAME-DRIFT` per file. Cheaper than discovering the problem one failed publish at a time.

### Two sources of truth, and why they disagree

The Figma REST API exposes two different views of the same file, and neither is complete:

| Endpoint                         | Shows                            | Trap                                                                        |
| -------------------------------- | -------------------------------- | --------------------------------------------------------------------------- |
| `/nodes?ids=`                    | Live file content                | Also returns **orphaned** deleted-but-published components                  |
| `/components`, `/component_sets` | Last **published** library state | Goes stale until the library is republished — names and properties included |

Consequences:

- **A resolving node id does not prove the component exists.** When a published component is deleted from the canvas, Figma keeps it as an orphaned node with no parent. `/nodes` still returns it, with full property definitions, and the MCP `get_metadata` tool returns it too. Neither flags it as deleted. It disappears from the **published library** once the library is republished without it — but `/nodes` may still return a husk of the node indefinitely: correct name and property definitions, but **zero children**. A component set with no children is a reliable orphan signature.
- **The published library is the authority on whether a component is usable.** This is why `check-figma-node-ids.js` reports `UNPUBLISHED` rather than `OK` for a node that resolves in the file but is missing from the library — that combination is exactly what an orphan looks like.
- **The published lists can show old names and old properties.** A rename that has clearly landed in the file will still read as the old name here — `<FormControl> | <RadioGroup>` reported as `<FormGroup> | <RadioGroup>` for eight days. Do not conclude a design change "didn't land" from these endpoints; check `/nodes`.
- **A tree walk is not a practical workaround.** Components in this library sit deeper than `depth=5`, where the file response is already 3.4 MB and ~11 s, and still does not reach them.

Ground truth for "does this component really exist on canvas" is selecting it in Figma. Treat the API as a fast pre-filter, not proof.

An `UNPUBLISHED` result means the node is live in the file but missing from the published library — the design changes exist but **the Figma library has not been republished**. Consumers of the library will not see them yet.

If a node is stale, find its replacement from the published component sets:

```bash
curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/<FILE_KEY>/component_sets"
```

**Check `/components` as well as `/component_sets`.** These are different endpoints returning different things: a component with variants appears in `/component_sets`, but a standalone component with no variants appears only in `/components`. Searching just one endpoint will make an existing component look deleted. `<FormGroup> | <Checkbox>` was wrongly declared missing for exactly this reason.

Do not repoint a stale mapping at a similarly-named set without checking it is the same component. A renamed set often means the library was reorganised and the mapping needs rewriting, not just a new id. Always re-read the target's `componentPropertyDefinitions` before reusing the old prop mappings — properties disappear along with node ids:

```bash
curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/<FILE_KEY>/nodes?ids=<NODE_ID>"
```

### Unblocking a publish without losing a broken mapping

Since publish is all-or-nothing, one stale mapping blocks every other component. Do **not** fix this by editing `figma.config.json`, which risks committing a silent permanent exclusion. Instead generate a throwaway config, publish with it, and delete it:

```bash
node -e "const c=require('./figma.config.json');c.codeConnect.exclude=[...c.codeConnect.exclude,'<path to broken file>'];require('fs').writeFileSync('figma.config.publish.tmp.json',JSON.stringify(c,null,2))"
npx figma connect publish -c figma.config.publish.tmp.json
rm figma.config.publish.tmp.json
```

Publish upserts per node, so excluding a file does not remove other already-published mappings.

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

### Error: `model_max_prompt_tokens_exceeded` / too many images

Cause:

- MCP request returned too much component tree/layout detail, or screenshots for every variant in a component set.

Fix:

- Call `get_metadata` on the selected node first (cheap, no images) to learn the variant list
- Call `get_design_context` on **one** variant node, not the component set
- Pass `excludeScreenshot: true` when you only need the property list
- Avoid broad suggestion expansion

### Error: `403 Token expired`

Cause:

- `FIGMA_ACCESS_TOKEN` in `.env` is expired.

Fix:

1. Generate a new token with Code Connect write scope
2. Replace the token in `.env`
3. Re-run publish

Note: publish exits non-zero on this error but still prints a normal-looking file list first. Always check the exit code rather than eyeballing the tail of the output.

### Do not filter publish output on the word "token"

The token appears only in the command, never in the output. Piping publish through `grep -v -i "token"` hides the `403 Token expired` line and makes a failed publish look successful. Capture the exit code instead.

### Error: `ParserError`

Cause:

- Example uses parser-unfriendly computed expressions.

Fix:

- Push conditions into prop mappings when possible
- Pass mapped props directly in `example`
- Remove fallback logic that parser cannot statically map

### Empty slot: `figma.children()` layer names are literal strings

Symptom: the snippet renders the wrapper but the slot is empty — `<FormGroup></FormGroup>` — while sibling mapped children such as `FormLabel` and `FormHelperText` populate normally.

Cause: `figma.children("...")` compiles to an exact layer-name match (`children(["..."])`) evaluated in Figma. There is no alternation, no regex and no fuzzy matching. A `|` inside the string is a literal pipe character, which matters here because the library's own layer names contain one. `"<FormControlLabel> | Checkbox"` and `"<FormControlLabel> | <Checkbox>"` are two different names, and the wrong one matches nothing and fails silently.

This bit the checkbox group: the Figma layers are named `<FormControlLabel> | <Checkbox>`, but the radio and switch rows are named `<FormControlLabel> | Radio` and `<FormControlLabel> | Switch` without brackets. The matcher was copied across families and only the bracketless ones worked.

The rename is also mid-flight. `scripts/check-figma-node-ids.js` reports `NAME-DRIFT` on `642:114394` — live `<FormControlLabel> | <Checkbox>` versus published `<FormControlLabel> | Checkbox` — so instances sourced from the published library and instances in the live file can carry **different** names at the same time. That is the case for accepting an array of names rather than chasing whichever spelling currently works, and it makes `NAME-DRIFT` a signal to re-check slot matchers, not just node ids.

Fix: read the real names from `get_metadata` on the variant (not the component set), and pass an array so either spelling matches:

```tsx
checkboxes: figma.children([
  "<FormControlLabel> | <Checkbox>",
  "<FormControlLabel> | Checkbox",
]),
```

Note that `get_code_connect_map` is not enough to catch this — it reports the mapping as published and healthy. Only the rendered snippet from `get_design_context` shows the empty slot, so verification must read the snippet body, not just confirm a mapping exists.

## Verification Checklist

After publish:

1. Open node in Figma Dev Mode.
2. Confirm mapping appears under `React`.
3. Confirm generated snippet uses MUI-correct semantics (not just visual match).
4. Confirm nested component behavior (children and text extraction) is as expected.

### Verifying programmatically with `get_code_connect_map`

The MCP `get_code_connect_map` tool returns the **actual generated snippet** for every node in the selection's subtree, which is faster and more precise than reading Dev Mode by eye. Each entry contains `componentName`, `snippet`, `snippetImports` and `label`.

**Call it without the `codeConnectLabel` argument.** Passing `codeConnectLabel: "MUI React"` returns `{}` even for correctly published components, which looks exactly like "nothing is published" and is misleading.

Two further gotchas:

- The **component set node itself is not in the map** — only its variants and descendants. Query the set and read the variant entries.
- If a node genuinely has no mapping, Dev Mode says Code Connect is not published. Check you selected the component you actually mapped before assuming the publish failed.

## Selecting a Whole Frame: Does Code Connect Get Applied?

**Yes — but only if the Code Connect label is `React`.**

This cost real time to find, so it is worth stating plainly: with `"label": "MUI React"` in `figma.config.json`, `get_design_context` silently ignored every mapping and returned full Tailwind expansion, even for verified published components. Changing the label to `React` and republishing made substitution work immediately.

With the correct label, `get_design_context` returns:

```tsx
import { FormControl, FormGroup } from "@mui/material";

<CodeConnectSnippet data-node-id="1495:11133" data-snippet-language="React">
  <FormControl component="fieldset">
    <FormLabel>Form Label</FormLabel>
    <FormGroup>
      <FormControlLabel control={<Checkbox indeterminate />} label="Parent" />
    </FormGroup>
  </FormControl>
</CodeConnectSnippet>;
```

No Tailwind, no div soup, caveat comments preserved. The tool also appends instructions telling the agent to drop the `CodeConnectSnippet` wrapper and to locate and use the real component in the codebase.

**Do not change `label` to something descriptive.** It looks like cosmetic metadata and is not. A custom label also breaks `get_code_connect_map` when passed as `codeConnectLabel`. Both failures are silent.

### How nesting resolves

Substitution stops at the outermost connected component **as a `CodeConnectSnippet` wrapper**. An agent selecting a large frame gets mapped components where they exist and layout markup only where they do not. The "when do I ignore the child layers" question is answered by the tool rather than by agent discipline.

That stop is not the same as "children are ignored." If the outermost mapping uses `figma.children()`, its snippet **inlines** nested connected snippets. Selecting a frame around a mapped Container therefore yields one `CodeConnectSnippet` for Container, whose body already contains Button/FormGroup/etc. Inner mapped nodes still appear as separate entries in `get_code_connect_map`.

If substitution is ever not available, the manual fallback is:

1. Call `get_code_connect_map` on the frame to get the mapped node ids.
2. Walk the `get_design_context` tree top-down, matching on the `data-node-id` attribute present on every element.
3. At the first node found in the map, emit that snippet and stop descending — **highest mapped ancestor wins**.

### Mapped containers and nested page content

Verified 2026-09-21 against `mock design lg` (`2503:181063`): a `<Container maxWidth="lg">` instance whose Slot held (1) a mapped Button, (2) a mapped FormGroup, (3) an unmapped Paper wrapping an unmapped Switch, (4) a frame of plain text, (5) an auto-layout frame containing another mapped Button.

| Slot content | Reaches the Container snippet? | What actually happened |
| ------------ | ------------------------------ | ---------------------- |
| Mapped Button, direct child | Yes | Nested Button snippet |
| Mapped FormGroup | Yes | Nested FormControl/FormGroup tree, including *its* connected children |
| Unmapped Paper + Switch | **No** | Replaced by `{/* Code Connect Logic Instance */}` — Paper, Switch, and the switch label all gone |
| Plain text / raw frame | **No** | Dropped. No markup, no text |
| Auto-layout frame wrapping a mapped Button | Button yes, frame no | Button **hoisted** to a direct child of Container. Padding, gap, and alignment on the frame are lost |

Implications:

- **`figma.children("*")` is not "direct children only."** It finds connected instances through unconnected wrappers and hoists them. Layout structure between the container and those instances disappears.
- **Unconnected instances do not survive.** They become a comment, not Tailwind fallback, not a generic `<div>`. Mapping a page-level Container before Paper/Stack/Box/Switch exist is silent content loss — the feared failure mode.
- **Do not map layout wrappers as page chrome** until the things designers put inside them are themselves connected, *and* designers put instances in the slot rather than raw frames. Until then, leave Container unmapped (or unused in page files) so `get_design_context` can substitute the inner mapped components individually and keep unmapped regions as layout markup.
- Container stays published for the mapping itself (`maxWidth` / `fixed` / `disableGutters`). Treat it as a component mapping, not a licence to wrap whole pages.

Follow-up 2026-09-22 (same frame, two-column page with three article Papers): four `{/* Code Connect Logic Instance */}` comments; layout flattened. Re-requesting **instances** recovered Paper bodies; re-requesting raw **frames** inside the mapped Container returned empty divs.

**Unpublished 2026-09-22.** Re-ran `get_design_context` on `mock design lg`: Container is layout markup (`max-w-[1290px]`, gutters); two-column layout survives; three article Papers keep title/metadata/Submit; switch Paper and plain text survive; inner Button/FormGroup still substitute. No `CodeConnectSnippet` on Container. Details in the [usage guide](figma-code-connect-usage.md).

## Helper Scripts

- `node scripts/check-figma-node-ids.js` — cross-checks the node id in every `*.figma.tsx` against both the live file and the published library, reporting `OK` / `STALE` / `UNPUBLISHED` / `NAME-DRIFT`. Run before every publish.
- `node scripts/figma-node-props.js <nodeId...>` — prints a node's live name, type, component property definitions and children. Use after design changes, before updating a mapping.

Both need the token loaded first: `set -a; . ./.env; set +a`.

## Known Figma Library Issues

Raise these with the design team; they are library problems, not mapping problems.

### FormGroup family — resolved 2026-09-17

The three group components are now structurally identical, which makes them mappable the same way:

| Node          | Name                            | Properties                                                                               |
| ------------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| `2483:185674` | `<FormGroup> \| <Checkbox>`     | `<FormLabel>`, `<FormHelperText>`, `Checkboxes` (SLOT), `State` [Enabled/Disabled/Error] |
| `642:108242`  | `<FormGroup> \| <Switch>`       | `<FormLabel>`, `<FormHelperText>`, `Switches` (SLOT), `State`                            |
| `1479:32615`  | `<FormControl> \| <RadioGroup>` | `<FormLabel>`, `<FormHelperText>`, `<RadioGroup>` (SLOT), `State`                        |

Count variants were replaced by slots, `State` was restored on the checkbox set, and the misnamed radio component became `<FormControl> | <RadioGroup>` — correct, since MUI's `FormGroup` does not wrap radios.

### Slot naming: name the slot after the MUI element it becomes

The radio slot was renamed from `Radios` to `<RadioGroup>`, which is the better rule. In MUI, `RadioGroup` is a real wrapper element between the label and the options, so a slot called `<RadioGroup>` maps to something; a slot called `Radios` maps to nothing.

### Hiding label and helper text is a meaningful state

A designer wanting a bare group takes the whole `FormControl` and switches off the `<FormLabel>` and `<FormHelperText>` booleans. Those booleans are therefore real design states, not decoration, and a mapping that always emits both produces code the design does not describe.

To drive presence, map the boolean to the connected child rather than rendering unconditionally:

```tsx
formLabel: figma.boolean("<FormLabel>", {
  true: figma.children("<FormLabel>"),
  false: undefined,
}),
```

Trade-off: the emitted element comes from `FormLabel`'s own mapping, so the snippet loses `component="legend"`. Correct presence is worth more than an optional a11y refinement — an element the design does not have is the worse error.

### Possible future consistency work

`<FormGroup> | <Checkbox>` and `<FormGroup> | <Switch>` make the component itself the `FormGroup`, with a slot of children. The radio component instead wraps a `<RadioGroup>` slot in a `FormControl`. Making them parallel — `<FormControl> | <Checkbox>` with a `<FormGroup>` slot — would match MUI exactly, since `FormGroup` is the true counterpart of `RadioGroup`, and would let all three share one mapping pattern. Not urgent, and it would move node ids again.

### Control-family gaps found 2026-09-22

- Figma Checkbox and Radio expose `Size=Large`; MUI Checkbox/Radio accept only
  `small | medium`. The mappings deliberately omit `size` for Large rather
  than generate invalid `size="large"` JSX. The visual distinction cannot be
  represented without a project-specific MUI size augmentation.
- `<FormControl> | <RadioGroup>` and `<FormGroup> | <Switch>` still have stale
  Figma usage descriptions copied from Checkbox, including Checkbox docs
  links/examples. Code Connect links point to the correct MUI Radio/Switch
  docs, but the Figma descriptions should be corrected.
- Radio option `value` comes from the nested visible label text. This avoids
  three implicit `"on"` values and keeps overridden labels/values aligned.
  The failure mode is a mock where only the question is customised and every
  option stays `"Form Label"`: three identical values make MUI treat them as
  one option, so selecting any radio checks all three. The RadioGroup snippet
  now carries a `Check the design:` caveat, but the real fix is designers
  giving each option a unique label.
- `Label Placement=End` maps to `undefined`. `end` is the MUI default, and the
  correctness floor says omit defaults rather than restate them.
- Row layer names are inconsistent across the three families:
  `<FormControlLabel> | <Checkbox>` has brackets around the control,
  `<FormControlLabel> | Radio` and `<FormControlLabel> | Switch` do not. Since
  `figma.children()` matches names literally, every rename silently empties a
  group. Ask design to standardise on one spelling; until then the group
  mappings match both.

### Figma "Filled" is a style suffix

The Figma icon library names its default-style icons `<Name>Filled` (`CheckFilled`,
`DeleteFilled`). MUI expresses the same default style with **no** suffix and
reserves suffixes for the other themes (`CheckOutlined`, `CheckRounded`,
`CheckSharp`, `CheckTwoTone`). So `CheckFilled` is `@mui/icons-material/Check`,
and `scripts/generate-figma-icon-connect.mjs` strips the suffix.

The trap is that a dozen MUI modules genuinely end in `Filled` and are **distinct
glyphs**, not style variants: `HomeFilled`, `AccessTimeFilled`,
`PlayCircleFilled`, `DirectionsCarFilled` and similar. An exact-name-first
matcher silently resolves Figma's `HomeFilled` to MUI's `HomeFilled` — which
has a flush roof instead of the overhanging eaves of `Home` — and Figma's
`AccessTimeFilled` to a solid disc instead of the outlined clock. Both published
wrong before being caught by eye.

The matcher therefore tries the stripped name **first** and falls back to the
literal name. Do not reorder those candidates.

Path strings are not a usable check here: Figma serialises absolute verbose
geometry while MUI ships compact relative commands, so identical artwork
compares unequal. Verify by rendering instead — MUI path data through `sharp`
into a PNG, against `get_screenshot` on the Figma node.

The generated local aliases keep the Figma name (`import HomeFilledIcon from
"@mui/icons-material/Home"`) so a reader can trace a snippet back to the Figma
layer. That is deliberate, but it does mean the alias and module names differ
wherever a suffix was stripped.

### TextField and InputAdornment findings

- Research Exchange sets `MuiInputLabel.defaultProps.shrink = true`, so
  TextField snippets deliberately omit `shrink`. The external-label positioning
  and notch removal are currently implemented only for `outlined`; Standard and
  Filled keep their compact shrunk layouts in both Figma and code.
- The original TextField swaps pointed directly to Icon or Typography. MUI
  expects those children inside `InputAdornment`, so Figma now has a dedicated
  `<InputAdornment>` family with Position=Start/End and Type=Icon/Text. All 120
  source slots and the page examples were migrated.
- InputAdornment's Text variant uses a direct text property; its Icon variant
  contains the mapped `<Icon>` instance. Do not convert these to open slots:
  unconstrained or unmapped slot content can disappear from nested snippets.
- `Has Value` and `Value?` overlap. The mapping treats both as gates so a value
  emits only when both indicate one is present. This preserves current visuals
  but the Figma API could be simplified later by removing the legacy
  floating-label `Has Value` axis.
- Helper presence needs two boolean-restricted TextField connections.
  `figma.textContent()` cannot cross the connected FormHelperText boundary;
  `figma.nestedProps()` correctly harvests its Value only for Helper=True.
- With no adornments, the generated snippet retains
  `slotProps={{ input: { startAdornment: undefined, endAdornment: undefined } }}`
  because the parser cannot conditionally remove the surrounding object.
  It is valid but verbose. Removing it would require eight duplicate templates
  across helper and start/end presence combinations.
- Multiline is a separate Figma family. Flexible omits row props; Min Rows maps
  4/6/8 to `minRows`, and Max Rows maps them to `maxRows`.

### Outstanding

- Nothing blocking. Container Code Connect unpublished 2026-09-22 (file kept, excluded from publish). Do not map Paper/generic Card as open hosts.
- The icon catalog was matched by name and spot-checked, not rendered end to end.
  A name that resolves to a real MUI module is not proof of matching artwork —
  `HomeFilled` and `AccessTimeFilled` both resolved and both were wrong. A
  render-and-diff pass over all 97 would close this.
- Note: the standalone `<RadioGroup>` component set was removed entirely rather than having its leftover variant cleaned up. The library now offers `<Radio>`, `<FormControlLabel> | Radio` and `<FormControl> | <RadioGroup>`. If a design ever needs a bare `RadioGroup` with no label or helper text, there is no component for it.

## Change Log

- 2026-06-17: Initial runbook created.
- 2026-06-17: Added resume checklist, component decisions, MUI semantics guardrails, and ButtonGroup size strategy.
- 2026-09-17: Added core MUI-mirroring principle, component analysis template, composite decomposition policy, and status tracker.
- 2026-09-17: Added divergent-composite guardrail (Autocomplete/Select) and image-heavy MCP response troubleshooting.
- 2026-09-17: Added correctness-floor principle; corrected the parser-safety rule (static arrow functions and array literals are fine, only expressions computed over mapped props fail).
- 2026-09-17: Published Autocomplete. Added token expiry (90 day max), stale node id detection via `scripts/check-figma-node-ids.js`, and the temp-config workaround for unblocking an all-or-nothing publish. Flagged FormGroup as broken.
- 2026-09-17: Corrected the FormGroup diagnosis — `<FormGroup> | <Checkbox>` exists at `6543:43148` as a standalone component, not a set. Added the `/components` vs `/component_sets` lookup trap and a Known Figma Library Issues section.
- 2026-09-17: Design fixes landed — FormGroup family standardised on slots + `State`. Repointed FormGroup to `2483:185674`. Added `scripts/figma-node-props.js`. Open question: whether `figma.children()` traverses into a SLOT.
- 2026-09-18: Documented the two-sources-of-truth problem — deleted published components persist as orphaned nodes in `/nodes` and MCP until the library is republished, while `/components` and `/component_sets` go stale until the same republish. Extended `check-figma-node-ids.js` with `UNPUBLISHED` and `NAME-DRIFT` detection.
- 2026-09-18: Library republished. All 10 mappings report `OK`. Orphaned `<RadioGroup>` removed from the published library, though `/nodes` still returns a childless husk — recorded as an orphan signature.
- 2026-09-18: Radio slot renamed to `<RadioGroup>`. Recorded the slot naming rule (name it after the MUI element it becomes) and that hiding `<FormLabel>`/`<FormHelperText>` is a meaningful state the mappings must honour.
- 2026-09-18: Published all 10 mappings, including FormGroup repointed to `2483:185674` with label/helper presence driven by the Figma booleans.
- 2026-09-18: Verified FormGroup via `get_code_connect_map` — slot traversal works, nested FormControlLabel/Checkbox/FormLabel/FormHelperText all render through their own mappings, and `State` maps to `disabled`/`error` correctly. Documented that `get_code_connect_map` must be called without `codeConnectLabel`.
- 2026-09-18: Confirmed the `<FormHelperText>` boolean correctly removes the element from the snippet. Added "Properties Are Communicated, Overrides Are Not" after finding that indent padding on a nested checkbox instance is silently dropped.
- 2026-09-18: Verified that JSX comments survive into the published snippet, and adopted `Check the design:` caveat comments as a greppable interim measure. Applied one to FormGroup with a `links` entry to the MUI indeterminate checkbox docs.
- 2026-09-18: Validated Autocomplete across all 4 variants, then enriched it — `label`, `variant`, `size`, `disabled` and `error` now come from the nested `<Select>` via `figma.nestedProps` instead of a hardcoded label. Verified that mapped props resolve inside render-prop arrow functions. Added the MUI-order worklist.
- 2026-09-18: Found that `get_design_context` does **not** substitute connected components — it returns full Tailwind expansion even for verified mappings. Documented the manual map-and-stop-descending join, and two untested causes (non-default `MUI React` label, desktop vs remote MCP server).
- 2026-09-18: **Root cause found and fixed.** The `MUI React` label was disabling substitution. Switched `figma.config.json` to `label: "React"` and republished; `get_design_context` now returns `CodeConnectSnippet` output with real MUI components and no Tailwind. Unpublished the stale `MUI React` mappings; all 10 now publish under `React` only.
- 2026-09-21: Published Container (`2213:290`) with `figma.children("*")`. Nesting experiment on `mock design lg`: mapped children nest (including FormGroup's own tree); unmapped Paper/Switch and raw text are dropped (`{/* Code Connect Logic Instance */}`); mapped Buttons inside unconnected auto-layout frames are hoisted and lose the frame. Do not use mapped Container as page chrome.
- 2026-09-21: Drafted WIP consumer guide `docs/development/figma-code-connect-usage.md` for engineers and agents. Not a locked procedure.
- 2026-09-22: Page fixture: frames inside mapped Container return empty on drill-down; instances recover. Unmapped Paper keeps children. Proposed unpublishing layout Code Connect; Card as chrome + closed parts + product recipe.
- 2026-09-22: Unpublished Container (`2213:290`, label React). Excluded the file from `figma.config.json`. Re-verified `mock design lg`: layout and unmapped Papers survive; inner Button/FormGroup still substitute.
- 2026-09-22: Completed Checkbox/Radio/Switch family. Added Radio,
  FormControlLabel/Radio, RadioGroup, Switch, FormControlLabel/Switch and
  FormGroup/Switch; refined shared default/state mappings. Parsed, published
  and verified enabled/disabled/error/checked variants. Unsupported Figma
  Large Checkbox/Radio now omit the invalid MUI size prop.
- 2026-09-23: Fixed an empty `<FormGroup>` in the checkbox group snippet. The
  slot matcher used the radio/switch layer-name spelling; the checkbox rows are
  named `<FormControlLabel> | <Checkbox>`. All three group mappings now pass an
  array of accepted names. Documented that `figma.children()` names are literal
  (a `|` is a pipe character, not alternation) and that only `get_design_context`
  exposes the failure.
- 2026-09-23: Verified all three families render their options. Dropped the
  redundant `labelPlacement="end"` (MUI default) from the three
  FormControlLabel mappings, and added a caveat to RadioGroup about duplicate
  option values when designers leave every label as "Form Label".
- 2026-09-24: Mapped Typography (`11609:174872`). body1 and Gutter Bottom=False
  omit props; custom is not a MUI variant (library uses table/header) and omits
  `variant` rather than emitting invalid JSX. Figma has no button/inherit
  variants and no color/align/`component` properties.
- 2026-09-24: Mapped the Icon page to `@mui/icons-material`: 97 generated
  standalone SVG mappings plus the existing UnfoldMore mapping. `<Icon>` maps
  font ligatures at every size, but maps swapped SVG icons only at Medium
  because Code Connect cannot propagate wrapper size into an arbitrary swapped
  import. Added and verified IconButton with nested icon output, and corrected
  Button state/color options and start/end icon instance forwarding.
- 2026-09-24: Updated `check-figma-node-ids.js` to inspect every node URL in a
  mapping file instead of only the first; the generated icon catalog exposed
  the old undercount. All 117 distinct file/node mappings resolve.
- 2026-09-24: Fixed two wrong icon mappings. The generator tried the literal
  Figma name before the `Filled`-stripped one, so `HomeFilled` and
  `AccessTimeFilled` matched the same-named MUI modules, which are different
  glyphs (MUI `HomeFilled` has a flush roof; `AccessTimeFilled` is a solid
  disc). Verified by rendering MUI path data against Figma screenshots. The
  stripped name now wins, since the library uses `Filled` as a style suffix for
  MUI's default unsuffixed icon. See [Figma "Filled" is a style suffix](#figma-filled-is-a-style-suffix).
- 2026-09-29: Added an Icon `Color` variant (Default, Inherit, Inherit (white), Primary, Secondary, Error, Warning, Info, Success, Disabled) bound to palette variables. IconButton now sets that property instead of overriding the glyph fill, so changing the nested icon size or type keeps the button color. Disabled button states use Icon Color=Disabled. Code Connect still does not emit `color`; MUI inherits it from the parent. Button and Chip still paint raw swapped icons, so they do not use this axis.
- 2026-09-24: Added `<InputAdornment>` (`2565:5754`) and migrated the TextField
  family's 60 start and 60 end source slots from raw Icon swaps. Preserved all
  page-example Icon and text overrides. Published and verified Code Connect for
  base TextField (`6570:48313`) and multiline (`7551:51690`) across variants,
  states, values, helper text, number type, Icon/Text adornments, and row
  constraints. InputAdornment's Figma library publish is still pending.
