# Using Figma designs with Code Connect

**Status: work in progress — do not treat this as a locked procedure.**

Date: 2026-09-24  
Audience: engineers implementing a screen, and agents using the Figma MCP  
Related: [Code Connect mapping runbook](figma-code-connect-runbook.md) (authors of `.figma.tsx` files), [Figma MCP guidance](../FIGMA_MCP_GUIDANCE.md) (do not copy Tailwind into `sx`)

This note is a draft of how to *consume* published mappings when reproducing a design. Coverage is incomplete, several behaviours were validated on a single fixture, and the mapping set will keep changing. Use it as a hypothesis: if a step disagrees with the file in front of you, trust the file, then tell UX/frontend so this guide can change.

## What we think is true

The Figma core library is a near 1:1 mirror of MUI. Code Connect mappings emit **MUI components and MUI props**, not Figma layer names and not pixel-perfect styling.

A published snippet is the source of truth for **that instance’s mapped props**. It is not the source of truth for the whole screen, for layout, or for components that have no mapping yet.

The floor is the same as for mappings: **sparse and true beats complete and wrong.** Do not invent `sx`, hardcoded colours, or extra props to make Figma’s Tailwind dump look like the screenshot.

## Coverage (check before you start)

Mappings exist for a **small** set of inputs plus Chip, Typography, Icon and
IconButton. Checkbox, Radio and Switch are connected from atom through labelled
control and group. TextField is connected for Standard, Filled, Outlined and
multiline use, including Icon/Text InputAdornments. The standalone SVG icon catalog maps to
`@mui/icons-material`; the generic SVG `<Icon>` wrapper is mapped only at
Medium, while its font-icon route supports every size. FormLabel and
FormHelperText are mapped; **standalone InputLabel is not**. TextField emits its
label prop directly. Container was unpublished 2026-09-22. Most of MUI is still
unmapped, including Select, Paper, Card, and layout.

The live list is the [Status Tracker](figma-code-connect-runbook.md#status-tracker) in the runbook. If this paragraph and that table disagree, the table wins.

Closed components (Button, Checkbox, FormGroup, Chip, …) are the ones Code Connect is good at. **Open hosts** (Paper, Card, Container, Box, Stack, Grid, dialog bodies) wrap arbitrary product UI. Mapping those hosts with `figma.children("*")` drops anything inside that is not itself connected. **Container is unpublished** (2026-09-22). Do not trust a leftover Container snippet if you still see one in Dev Mode — republish/cache lag; the live `get_design_context` on `mock design lg` no longer wraps the page in one.

## Pick the right node

| You want to reproduce | Select / share |
| --------------------- | -------------- |
| A whole screen or region | The **page frame** (ordinary auto-layout), not a library layout component |
| One control (a button, a checkbox group) | That **component instance** |
| A card / paper / generic surface | The **frame around it**, or the surface only if Paper/Card are still unmapped |

Share a node-specific Figma URL (`?node-id=…`). A file URL with no node is not enough for MCP.

If the designer wrapped the mock in `<Container>`, prefer the parent frame (`mock design lg` in the nesting experiment) so unmapped regions can still appear as layout instead of disappearing into the Container snippet.

## For engineers (Dev Mode)

1. Open the **screen frame** in Dev Mode, not only the outermost library instance.
2. Where a layer shows a Code Connect snippet under the **React** label, use that component from `@mui/material` (or this repo) with those props. Ignore the GitHub URL in the import; search the codebase.
3. Walk nested instances. Do not copy only the outermost snippet and stop — especially if it is Container, Paper, or Card.
4. Treat `{/* Code Connect Logic Instance */}` as **missing content**, not as “nothing goes here.”
5. Treat `{/* Check the design: … */}` as a real caveat. The snippet cannot express something the file shows (for example nested checkbox indent).
6. Unmapped layers: implement with MUI + theme, using structure and labels from the design. Do not paste Tailwind or screenshot metrics into `sx`. See [Figma MCP guidance](../FIGMA_MCP_GUIDANCE.md).
7. Instance overrides (extra padding, indent, one-off size) **do not** appear in snippets. If the intent matters, it needs a Figma property or a nested instance — otherwise it is a design-file issue, not something to reverse-engineer from the screenshot.
8. Unmapped **Paper**: do not copy `box-shadow` into `sx`. In Dev Mode, Layer Properties → Style, the effect style comment is the elevation: `/* elevation/1 */` is a shadowed Paper (MUI default — omit the prop). `/* elevation/0 */` is shadowless (`elevation={0}`). Outlined is `variant="outlined"`. Elevation **1 is not 0**.

## For agents (Figma MCP)

Do not skip `get_design_context` in favour of screenshots. Do not implement from the Tailwind prototype as if it were the project’s stack.

Figma’s tool text says “always prefer `get_design_context`.” That is the **primary** payload, not the only call. A page-sized selection needs the loop below. Do not start from `get_screenshot` alone. Do not set `disableCodeConnect`.

Remote MCP does **not** know the desktop selection. Resolve the node id from the URL, or from the local desktop server, then call remote tools with `fileKey` + `nodeId`.

Suggested loop (evaluate; revise if a step is noisy or redundant):

1. **Inventory** — `get_metadata` on the shared node. List every named instance (`<Button>`, `<Paper>`, `<FormGroup> | <Checkbox>`, raw frames, text). This is the completeness checklist. Metadata XML does **not** include variant props such as `Elevation=1`.
2. **Code** — `get_design_context` on the **same** node (`clientLanguages: typescript,tsx`, `clientFrameworks: react,nextjs,mui`, `skillNames: figma-design-to-code`). Keep Code Connect enabled. Drop `CodeConnectSnippet` wrappers; import the real components from this repo / `@mui/material`.
3. **Map** — `get_code_connect_map` on the same node **without** `codeConnectLabel`. That returns snippets for mapped descendants even when a parent snippet omitted them. Keys may be `0:10263`-style ids, **not** the `I2503:…` instance ids in metadata — join on snippet content / `componentName`, not node id.
4. **Tokens** — `get_variable_defs` on the same node. This is a **bag for the whole subtree**, not per layer. A page can list both `elevation/1` and `elevation/2` (Paper vs Button). Use it to confirm names, not to guess which node used which.
5. **Reconcile** — every instance in metadata should appear either as a Code Connect snippet **or** as layout/markup in `get_design_context`. If metadata has a node that is in neither, or a parent snippet replaced it with `{/* Code Connect Logic Instance */}`, **do not trust that parent’s children**. Compose from the individual map entries plus layout for the rest.
6. **If the parent is a mapped open host, drill only into instances.** Re-requesting a raw **frame** that lives inside a mapped Container can return that frame’s layout classes with **zero children** (validated 2026-09-22). Re-request the `<Paper>` / `<Button>` **instances** instead. Use `get_metadata` as the child inventory when a frame comes back empty.
7. **Theme** — translate leftover Tailwind to MUI layout (`Stack`, `Box`, `Grid`) and theme defaults. No `sx` copies of shadows, type ramps, or hex colours unless the product already does that for a documented exception. Named `<Paper>` with a default-looking shadow is `<Paper>` (elevation 1 omitted). See [Paper elevation](#paper-elevation-without-code-connect).

`get_code_connect_map` returning `{}` usually means the wrong `codeConnectLabel` (never pass `MUI React`) or the selection is the component-set node rather than a variant/instance — not “nothing is published.” `get_code_connect_map` also cannot catch an empty slot — it still reports the mapping as published. Only the rendered snippet body (Dev Mode or `get_design_context`) shows `<FormGroup></FormGroup>`.

### What `get_design_context` emits

One tool result, several parts concatenated:

1. `assetPathPrefix` — short-lived asset host.
2. A React function of Tailwind `div`s with `data-node-id` / `data-name`. Mapped nodes are wrapped in `<CodeConnectSnippet>` with real MUI JSX. Unmapped nodes stay as layout.
3. A screenshot (visual target, not an implementation asset). Call `get_screenshot` only if this image is missing.
4. Instruction blob — convert Tailwind, drop `CodeConnectSnippet`, find the real import. **Do not** follow “preserve exact visual design” into `sx`.
5. “Styles contained in the design” — type ramps and effect style **names** (`elevation/1`, `elevation/7`) for the **whole selection**, not attached to a layer.
6. Figma **component descriptions** and one docs link per connected component. Checkbox / Radio / Switch / Forms set-level copy is live. Variant JS demos were cleared (1,233 variants) and confirmed gone from MCP after the follow-up library republish.

It does **not** emit this repo’s `ArticleSummaryCard`, theme `sx`, or `elevation={1}` on a page-level Paper `div`.

On a **library Paper variant** (the set child, e.g. `Elevation=7, Variant=Elevation, Square=True`), the same tool **does** emit TypeScript defaults: `elevation = "7"`, `square`, `variant`. That comes from the **variant name**, not from the shadow CSS. Page instances flatten to `data-name="<Paper>"` and lose those props.

### Nested substitution (validated 2026-09-21)

On fixture `mock design lg` (`2503:181063`):

- Selecting the frame wrapped one mapped **Container** in `CodeConnectSnippet`. Inner Button/FormGroup were **inlined** in that snippet, not separate wrappers.
- Unmapped Paper + Switch and plain text **did not survive**. One `{/* Code Connect Logic Instance */}` comment stood in for missing host content.
- A mapped Button inside an unconnected auto-layout frame was **hoisted**; padding/gap/alignment on the frame were lost.

So: “highest mapped ancestor wins” is right for a Button in a free frame. It is **wrong** when that ancestor is an open host with `children("*")`. Completeness against metadata is mandatory.

### Follow-up fixture (validated 2026-09-22)

Same frame, now a two-column page: left rail (button, FormGroup, switch-in-Paper, plain text) plus three article Papers and a wide footer button. Selecting the frame still produced one Container snippet. Four `{/* Code Connect Logic Instance */}` comments stood in for the switch Paper, the three article Papers, and the text box. Layout was flattened.

Recovery by re-requesting children:

| Node requested | Type | Result |
| -------------- | ---- | ------ |
| Article `<Paper>` | instance | Full card, mapped Submit button substituted |
| Switch `<Paper>` | instance | Full surface; mapped `FormLabel` substituted; Switch itself Tailwind (unmapped) |
| Left rail “Frame 2” | frame | **Empty div** (`flex-col gap-24px items-center`, no children) |
| Footer “Frame 2” | frame | **Empty div** (`items-center justify-center px-16 py-40`) |

Inside a mapped Container, **instances recover; frames do not.** The documented “request the visible child nodes” step only works if those children are instances. Stopping at an intermediate frame looks like an empty region.

Unmapped Paper selected **on its own** (no Container as the implementation root) keeps all slot content and still substitutes a mapped Button — the inference from 2026-09-21 is now confirmed.

## Recommended setup (proposed)

WIP — this is the working recommendation after two fixtures, not a locked policy.

### Map closed things. Do not map open hosts.

| Map | Do not map |
| --- | ---------- |
| Atoms with a bounded property set (Button, Checkbox, Chip, IconButton, Switch, Typography once ready) | Page chrome: Container, Box, Stack, Grid |
| Closed composites whose children are a known, already-mapped set (FormGroup, ButtonGroup, FormControlLabel) | Surfaces that host arbitrary product UI: Paper, generic Card |
| Product recipes that *are* a closed pattern (see Card below) | Anything whose slot is “whatever the page needs” |

**Yes: unpublish layout Code Connect.** Container is unpublished (2026-09-22). The `.figma.tsx` stays in git as a record and is listed in `figma.config.json` `exclude` so a full publish does not restore it.

The cost of unpublishing: selecting the Container *component* in the library no longer emits `maxWidth` / `fixed` / `disableGutters`. That is acceptable. Those props are few, documented, and cheaper to type than a silent half-page.

Do not map Paper or generic Card “to get elevation.” Empty `children` deletes the body; `"*"` deletes the unmapped half.

### What designers should put on a page

1. **Page structure is auto-layout**, not a mapped Container/Paper wrapping the file.
2. **Controls are library instances** (`<Button>`, `<FormGroup> | <Checkbox>`, …).
3. **Surfaces are unmapped Paper/Card** (or auto-layout that *looks* like a card) with mapped instances inside.
4. **Recurring product cards become their own Figma component**, not a one-off nest of Paper + Typography + Button. See below.

### Card: layout plus standardised composites

This library’s `<Card>` (`1953:102511`) has **no properties**; it is a `<Paper>` instance. It is not MUI’s `CardHeader` + `CardContent` + `CardActions` tree. Mapping it is mapping Paper under another name.

Treat Card as three layers, not one mapping:

1. **Chrome (open host)** — `<Card>` / `<Paper>`. Leave unmapped. In code, emit `<Paper>` or `<Card>` from [Paper elevation](#paper-elevation-without-code-connect), not from copied shadows. Agents will get layout markup for the surface and Code Connect for the bits inside it.
2. **Library parts (closed)** — `<CardHeader>`, `<CardMedia>` already exist as named property sets. Map those. They are not “host a page.”
3. **Product recipe (closed composite you invent)** — when the same nest repeats (title + overflow + metadata grid + Submit, as in the article summary), **do not** try to express that as generic Card children. Promote it:

   - Figma: a component such as `Article summary` with properties for title, article type, corresponding author, action label — not a free Slot of anything.
   - Code: `ArticleSummaryCard` (already in `src/components/product/ArticleSummaryCard.tsx`).
   - Code Connect: map that Figma component to that product file. The Paper/Card inside is an implementation detail of the recipe, not a separately mapped host.

A recipe mapping is safe for the same reason FormGroup is safe: the slot is a known set of fields, not a page. A generic Card mapping is never safe while product files keep putting mixed, partly-unmapped patterns in the slot.

If a screen uses a one-off card that will not recur, leave it as unmapped Paper + mapped atoms. Do not create a recipe for a singleton.

## Open hosts (Paper, Card, Container)

In this library:

- `<Paper>` is a slot plus elevation/variant/square — arbitrary content.
- `<Card>` has no extra properties; it is a Paper instance.
- `<CardHeader>` and `<CardMedia>` are **not** open hosts; they have a small named property set.

Leave the host unmapped. Implement the surface as MUI `Paper`/`Card` from visual hierarchy and Figma usage text; drop Code Connect snippets for the **instances inside**. If the nest is a repeating product pattern, promote it to a recipe component instead of mapping the host.

### Paper elevation without Code Connect

Paper’s **closed** props are `Elevation` 0–24, `Variant` Elevation | Outlined, and `Square`. The **slot** is what makes it an open host. Mapping Paper still replaces the whole instance: no children → empty body; `children("*")` → unmapped slot content dropped. There is no “emit elevation, keep children as layout” mode.

How to get the number anyway:

| Who | Signal | Code |
| --- | --- | --- |
| Engineer in Dev Mode | Layer Properties → Style: `/* elevation/N */` | `N === 1` → `<Paper>` (default, **has shadow**). `N === 0` → `<Paper elevation={0}>` (shadowless). Outlined → `<Paper variant="outlined">`. |
| Agent, library variant selected | Generated props `elevation = "7"` plus styles list `elevation/7` | `<Paper elevation={7} square>` as needed. Omit `elevation` when it is `1`. |
| Agent, page instance | Tailwind `box-shadow` (computed) + page-level styles bag that may mix `elevation/1` and `elevation/2` | Infer: named `<Paper>`, default shadow, no border → `<Paper>`. Border and no shadow → outlined / 0. Do **not** paste the shadow into `sx`. If unsure, omit (defaults to 1, shadowed) rather than emit `0`. |

MCP **flattens named effect styles to computed CSS** on the node. After binding shadow **colour** to variables, the class became `var(--shadowkeyumbra)` / penumbra / ambient — the same three names on elevation 1 and 7. Those variables are MUI’s umbra layers (theming). They do **not** encode `N`. Geometry (offset, blur, spread) and the variant / style **name** still do.

Do not variable-bind shadow geometry expecting MCP to start emitting `elevation={7}`. Keep effect styles named `elevation/0` … `elevation/24` in lockstep with variants.

### Form label atoms (Forms page)

All three have MUI counterparts. They are not interchangeable:

| Figma | MUI | Use for |
| --- | --- | --- |
| `<InputLabel>` | `InputLabel` | TextField / Select caption, including the shrinking outline label. **Not mapped as a standalone atom; TextField maps its label directly.** |
| `<FormLabel>` | `FormLabel` | Group/fieldset legend, and the text inside labelled checkbox/radio/switch rows. Mapped. |
| `<FormHelperText>` | `FormHelperText` | Helper or error below a field or group. Mapped. |

A labelled group still needs `FormControl` in code for `disabled` / `error` context. The published group snippets already wrap that way.

### Icon color

`<Icon>` has a Color variant so IconButton can recolor the glyph without a fill override. Changing the nested icon's Size keeps that color. Snippets omit `color` because MUI inherits it from the parent. A standalone icon left on Color=Default uses `action/active`.

### TextField and InputAdornment

Use the connected TextField snippet for its variant, state, type, label, value,
helper text, adornments and multiline row constraints. An adornment is emitted
as MUI `InputAdornment`: text stays text, while an icon can contribute its
mapped `@mui/icons-material` import.

The Research Exchange theme owns `MuiInputLabel.defaultProps.shrink = true`.
Do not add `InputLabelProps={{ shrink: true }}` or duplicate label positioning
in a generated implementation. The current external-label positioning and
outlined-notch removal apply only to Outlined; Standard and Filled intentionally
retain MUI's compact shrunk-label layout.

When neither adornment is present, Code Connect may still emit:

```tsx
slotProps={{
  input: { startAdornment: undefined, endAdornment: undefined },
}}
```

This is valid and may be removed as a code cleanup. Do not interpret it as a
request to render an empty adornment.

### Empty slots and literal layer names

`figma.children("…")` is an **exact layer-name match**. A `|` in the string is a pipe character, not “or”. Checkbox rows were named `<FormControlLabel> | <Checkbox>` (brackets) while radio/switch rows omit brackets on the control. The wrong spelling yields a valid-looking snippet with `<FormGroup></FormGroup>` and populated label/helper.

If you see that, it is a mapping/name-drift bug, not a design with no options. Compare to the screenshot and report it.

Radio option `value` is taken from the visible label. Repeated `"Form Label"` makes every radio the same value; selecting one checks all three. Designers must give unique labels. A `Check the design:` comment in the RadioGroup snippet flags this; it does not fix the file.

## What not to do

- Do not follow Figma’s “preserve exact visual design” instruction. Match this project’s MUI theme.
- Do not assume a snippet that compiles is a complete region. Check the layer tree.
- Do not trust an empty slot. A group that renders as `<FormGroup></FormGroup>` is a broken mapping, not a design with no options — compare against the screenshot and report it.
- Do not wrap new page designs in mapped Container/Paper to “help” Code Connect.
- Do not map Paper “to get elevation,” or generic Card to capture a product pattern — promote the pattern.
- Do not copy `box-shadow` / `var(--shadowkeyumbra)` into `sx`. Use `elevation` / `variant`.
- Do not use `InputLabel` as a group legend or as a checkbox/radio/switch label.
- Do not treat elevation 1 as shadowless. 1 is the default shadowed Paper; 0 is flat.
- Do not author or republish mappings from this guide — that is the [runbook](figma-code-connect-runbook.md).

## Open questions (iterate here)

Record answers in this list rather than silently updating the steps above.

- Is the metadata → design context → map → variable_defs loop too heavy for small selections (a single Button)?
- When Paper/Card stay unmapped, do engineers reliably choose `<Paper>` / `<Card>` from the screenshot, or do they ship a `div`? Dev Mode `/* elevation/N */` is now the documented engineer path; untested with a second person.
- **Should Container be unpublished?** Done 2026-09-22. `get_design_context` on `mock design lg` now returns Container as layout (`max-w-[1290px]`, gutters), two-column structure, three article Papers with titles/metadata, switch Paper, plain text, and inner Button/FormGroup snippets. No wrapping Container `CodeConnectSnippet`.
- Unmapped Paper selected alone **does** keep slot content and substitute a mapped Button (confirmed 2026-09-22).
- **Can we get Paper elevation without mapping Paper?** Partially. Library variant → `elevation = "N"` in design-context props. Page instance → style name in the selection-wide list and Dev Mode CSS comment; MCP inlines the shadow on the node. Variable-backing shadow **colour** does not encode N (confirmed 2026-09-24).
- Duplicate node id in metadata: the left-rail text layer reported `2503:181058`, the same id as the Container instance. May relate to empty-frame recovery; not investigated.
- Component descriptions for Checkbox / Radio / Switch / Forms confirmed in MCP after library republish. Variant-level JS demos cleared (1,233) and confirmed gone after the second publish.

## Change log

- 2026-09-21: First draft after the Container nesting experiment. Explicitly WIP.
- 2026-09-22: Recorded page-fixture recovery: frames inside a mapped Container return empty; instances recover. Confirmed unmapped Paper keeps children. Proposed unpublishing layout hosts and treating Card as chrome + closed parts + optional product recipe.
- 2026-09-22: Unpublished Container. Re-verified `mock design lg`: page layout and unmapped Papers survive; mapped Button/FormGroup still substitute.
- 2026-09-23: Added the empty-slot warning after a checkbox group published cleanly but rendered an empty `<FormGroup>` because the slot matcher used the wrong layer-name spelling.
- 2026-09-24: Documented the full agent MCP loop (`get_metadata` → `get_design_context` → `get_code_connect_map` → `get_variable_defs`), what design-context actually emits, Paper elevation without Code Connect (variant / `elevation/N` style name; 1 shadowed default vs 0 shadowless), shadow colour variables as theming-only, FormLabel vs InputLabel vs FormHelperText, and literal `figma.children()` names. Descriptions written on those Figma pages; library republish in progress.
- 2026-09-29: Documented Icon Color. IconButton sets it in Figma so a nested size change keeps the parent color. Snippets still omit `color` because MUI inherits it.
- 2026-09-24: Added TextField and multiline coverage, including dedicated
  Icon/Text InputAdornments, helper text, values, number type and row
  constraints. Documented that label shrink is theme-owned and that empty
  adornment props may remain as harmless `undefined` values.
