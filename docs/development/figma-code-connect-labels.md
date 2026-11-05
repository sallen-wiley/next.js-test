# Figma Code Connect: what "label" actually controls

Date: 2026-10-23
Audience: anyone deciding whether to publish a non-platform Code Connect label (for example per-product or per-team names instead of `React`)
Related: [Code Connect mapping runbook](figma-code-connect-runbook.md), [Usage / handoff guide](figma-code-connect-usage.md)

## Question investigated

Can two independent repos each publish a Code Connect mapping for the **same** Figma component under arbitrary, non-platform labels — e.g. `"cheese"` / `"bacon"`, or `"Product A"` / `"Product B"` — instead of both labelling their mapping `React`?

This note answers that narrowly, from primary sources only: the official Figma developer docs (`developers.figma.com`) and the open-source Code Connect CLI (`github.com/figma/code-connect`). A live publish and retrieval test was subsequently run; see [Live RPM label test](#live-rpm-label-test).

## Short answer

**Custom labels work: `RPM` and `React` were published and independently retrieved for the same Button node.** See the live test below. The CLI accepts free-form labels, while plan restrictions and selecting the correct label still matter.

- The CLI and config schema accept `label` as a **plain string**, not an enum. There is no allowlist check against real platform/framework names.
- Every doc page that describes the one-to-many mapping mechanism frames it as a **framework/platform discriminator** (React vs. SwiftUI vs. Compose vs. Vue), not a generic multi-repo tagging system.
- Figma's plan tiers gate **"active frameworks"**, which is the same underlying value as `label`. On a Professional plan only one label/framework stays active per team/library at a time; every other label's connections show a **Deactivated** badge and are dropped from the Figma MCP server. Only Organization/Enterprise plans can keep multiple labels active simultaneously.
- The CLI accepts custom label strings. Live publishing and retrieval were verified for `RPM` alongside `React`; other arbitrary names were not tested.

## 1. What "label" means

Three surfaces share the same underlying value:

- **Config field** (`figma.config.json`), documented at `https://developers.figma.com/docs/code-connect/api/config-file/#label`:
  > "`label` lets you specify the label that appears in Figma for your Code Connect snippets. The label defaults to your project type, such as `React`. Setting a different label for the snippets in Dev Mode can be useful, such as for showing different versions of the code."
- **CLI flag**, `https://developers.figma.com/docs/code-connect/cli-reference/`, on `figma connect publish`:
  > `-l, --label <label>` — "Label to apply to the published files" (example: `npx figma connect publish --label "React"`)
- **MCP parameter**, `https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/#multiple-frameworks` and `https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/`:
  > "Ask your agent to set the `clientFrameworks` parameter to your Code Connect label, such as `React` or `SwiftUI`."

So: `label` is set once at publish time (config or `--label`), shown in Dev Mode / Code Connect UI, and later used to pick a specific mapping back out via `clientFrameworks` on MCP calls (including the `codeConnectLabel`-style arguments this repo's own [usage guide](figma-code-connect-usage.md) warns never to set to `"MUI React"`).

## 2. Is the label a free-form string or a restricted enum?

The CLI source is decisive. `github.com/figma/code-connect:cli/src/connect/project.ts` (fetched at SHA `8dcccd61f285908716ec7fce816a65b0926f6923`):

```ts
export type BaseCodeConnectConfig = {
  // ...
  /**
   * Label to use for the uploaded code examples
   */
  label?: string
  // ...
}
```

`label?: string` — a plain string, not a union or enum.

A `CodeConnectLabel` enum does exist, in `github.com/figma/code-connect:cli/src/connect/label_language_mapping.ts`:

```ts
/**
 * Default Code Connect labels for native parsers
 */
export enum CodeConnectLabel {
  React = 'React',
  Storybook = 'Storybook',
  SwiftUI = 'SwiftUI',
  Compose = 'Compose',
  WebComponents = 'Web Components',
  HTML = 'HTML',
  Vue = 'Vue',
  Angular = 'Angular',
  Code = 'Code', // Default/fallback label
}
```

But this enum is consumed only to supply **defaults**, never to validate user input:

- It populates `DEFAULT_LABEL_PER_PARSER` in `project.ts` (e.g. `react: CodeConnectLabel.React`) when the user hasn't set a `label`.
- `determineLabelFromProject()` walks `package.json` to auto-detect Angular/Vue and pick a default.
- `cli/src/connect/raw_templates.ts` falls back to it only when nothing else is set: `const effectiveLabel = label || config?.label || CodeConnectLabel.Code`.
- `label_language_mapping.ts`'s `getInferredLanguageForRaw()` uses the enum only to guess syntax-highlighting language, falling back to `plaintext` for anything it doesn't recognize — it does not reject the label.

No call site rejects or warns on a user-supplied `label` that isn't one of the enum values. The config docs' own example use case — "showing different versions of the code" — is explicitly non-platform phrasing, so Figma's own documentation anticipates `label` being used for something other than a framework name.

## 3. Does anything block two repos publishing arbitrary custom labels for the same node?

**No technical restriction found in the CLI/config schema.** Any repo running `figma connect publish --label "cheese"` (or `"label": "cheese"` in its own `figma.config.json`) against the same Figma component URL publishes successfully — the CLI does not check whether a label already exists for that node, and does not validate the string against a platform allowlist.

**But every doc page describing the multi-mapping feature itself frames it as platform/framework selection, not generic tagging:**

- `https://developers.figma.com/docs/code-connect/`:
  > "Code Connect UI supports one-to-many connections, letting you map a single design component to multiple code implementations across different frameworks and languages (e.g., React, SwiftUI, Jetpack Compose, Vue)."
- `https://developers.figma.com/docs/code-connect/code-connect-ui-setup/` ("Connecting one component to multiple frameworks"):
  > "Code Connect UI supports one-to-many connections, allowing you to map a single design component to multiple code components across different languages or frameworks... This is useful when your design system ships components for multiple platforms."
- `https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect`:
  > "Supports multiple code connections for a single design component across different frameworks and languages."

**Synthesis:** the docs primarily describe frameworks, but also explicitly suggest labels for code versions. They do not establish that product-specific labels are forbidden or unintended. The live `RPM` test confirms one such custom label works.

## 4. How Figma's documented UI uses labels

- **Dev Mode / Code Connect UI**: when a component has multiple connections, each is independent — `https://developers.figma.com/docs/code-connect/code-connect-ui-setup/`:
  > "Each connection is independent, so you can specify different file paths, component names, and custom instructions per framework."
  The UI adds one connection per framework via an "add" button on the component row; non-active connections "show a Deactivated badge in Dev Mode and Code Connect UI" (see plan gating below).
- **MCP remote server**: the agent sets `clientFrameworks` to the desired label to choose which connection comes back (`code-connect-integration/#multiple-frameworks`).
- **Gap**: no developers.figma.com page fetched used the literal word "dropdown" or "tab" for the Dev Mode Inspect-panel selector. The closest primary-source statement is `https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/`: "The desktop server uses the Code Connect mapping you've selected in Dev Mode" — this implies a selector without naming the widget.

## 5. Plan-tier gating (the practical blocker)

This is the part that actually constrains arbitrary multi-label use, confirmed from three sources:

- `https://developers.figma.com/docs/code-connect/`:
  > "On Professional plans, you can have one active framework at a time. It's set by your team's first Code Connect publish, and a team admin can change it in Admin → Settings → Resources → Code Connect. Connections for the previous framework are kept, but they show a Deactivated badge in Dev Mode and Code Connect UI and aren't returned by the Figma MCP server. Organization and Enterprise plans can have multiple active frameworks."
- `https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect` ("Active library and framework on Professional plans"):
  > "Professional plans can have one active library and one active framework... Connections for the previous library or framework are kept, but they show a Deactivated badge... and aren't returned by the Figma MCP server."
- `https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/`:
  > "On Professional plans, the MCP server only returns connections for your active library and framework."

**Implication:** the gating keys off whatever string value was published as the label — it has no notion of "cheese" vs. "React" beyond the literal string. So on a Professional plan, two repos publishing `"cheese"` and `"bacon"` for the same node collide exactly as `"React"` vs. `"SwiftUI"` would: only one stays active team-wide; the other is marked Deactivated and dropped from the MCP server and Dev Mode/Code Connect UI. Only Organization/Enterprise plans keep multiple labels (of any name) simultaneously active. No source ties this gating specifically to whether the label *looks like* a real platform — it is inferred from the gating being described in terms of "framework," which the docs otherwise use interchangeably with "label."

## 6. Does Figma document multi-mapping as supported, and is label the intended mechanism?

Yes, explicitly, repeatedly, and `label` is the stated mechanism:

- `https://developers.figma.com/docs/code-connect/`: "Code Connect UI supports one-to-many connections, letting you map a single design component to multiple code implementations across different frameworks and languages (e.g., React, SwiftUI, Jetpack Compose, Vue)."
- `https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/`: "You can map more than one codebase to the same Figma components, such as React and SwiftUI."
- `https://developers.figma.com/docs/code-connect/api/config-file/#label`: "Setting a different label for the snippets in Dev Mode can be useful, such as for showing different versions of the code." — the single strongest statement that label use isn't strictly platform-bound; "different versions" is non-platform phrasing.

But the dedicated feature section is titled "Connecting one component to multiple **frameworks**" and justified as useful "when your design system ships components for multiple platforms" — so the documented intended use is platform/framework discrimination, with "different versions of the code" as the only hint of a broader, non-platform use case.

## Practical takeaway for this repo

- Keep the main implementation labeled `React`. RPM engineers can independently publish mappings for the same components under `RPM` without replacing the `React` mappings.
- Labels, not repository boundaries, isolate these publishes. Publishing under `React` from another repository can replace the existing React mappings for the targeted nodes.
- Do not override RPM publishes with `--label React`; scope unpublish operations to `RPM`.
- Select the desired label in Dev Mode or set `clientFrameworks: "RPM"` for RPM design-context requests. See the [usage guide](figma-code-connect-usage.md#requesting-a-specific-code-connect-label).
- Professional plans restrict active frameworks; the successful coexistence test establishes behavior for this team's setup, not every plan.

## Live RPM label test

On 2026-10-23, a separate test project under [`code-connect-test/`](../../code-connect-test/) was configured with `label: "RPM"` and published the same Button node (`6543:36744`) already mapped under `React`.

- `figma connect parse` confirmed the test mapping's label was `RPM`.
- `figma connect publish` returned success and reported `Successfully uploaded to Figma, for RPM`.
- The main repository's original Button mapping had previously been republished under `React`.
- Initial `get_code_connect_map` lookups for both labels timed out.
- A follow-up `get_design_context` request for the same selected Button returned the `AlternateButton` mapping when `clientFrameworks` was `RPM`, and the MUI `Button` mapping when it was `React`.
- The user confirmed that both options appear in Figma's Code Connect panel dropdown.

**Result:** Both labels were independently retrieved for the same node through Figma MCP, and the user confirmed the Dev Mode dropdown shows both. An RPM engineer should select `RPM` in Dev Mode or request `clientFrameworks: "RPM"` through MCP. This verifies simultaneous availability in this team's setup.

## Sources checked

- `https://developers.figma.com/docs/code-connect/` — one-to-many connections, plan gating note
- `https://developers.figma.com/docs/code-connect/api/config-file/#label` — `label` config field semantics
- `https://developers.figma.com/docs/code-connect/cli-reference/` — `-l, --label` flag on `figma connect publish`
- `https://developers.figma.com/docs/code-connect/code-connect-ui-setup/` — "Connecting one component to multiple frameworks"
- `https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/` — Dev Mode selection behaviour, multi-codebase mapping statement
- `https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/#multiple-frameworks` — `clientFrameworks` parameter, Professional-plan MCP filtering
- `https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect` — active library/framework plan behaviour
- `github.com/figma/code-connect:cli/src/connect/project.ts` (SHA `8dcccd61f285908716ec7fce816a65b0926f6923`) — `label?: string` config type, `DEFAULT_LABEL_PER_PARSER`
- `github.com/figma/code-connect:cli/src/connect/label_language_mapping.ts` — `CodeConnectLabel` enum (defaults/syntax-highlighting only, not validation)
- `github.com/figma/code-connect:cli/src/connect/raw_templates.ts` — `effectiveLabel` fallback chain

### Not found / unverifiable from primary sources

- No standalone "labels" doc page exists at the URL pattern guessed up front (`/docs/code-connect/figma-code-connect-labels/`); label documentation is split across the config, CLI reference, quickstart, and Code Connect UI setup pages instead.
- No page uses the literal word "dropdown" for the Dev Mode label selector.
- No plan/pricing page statement ties the Professional-plan "one active framework" restriction specifically to arbitrary vs. platform-named labels — this is inferred from the gating being described generically by "framework" (= label value).
- The open-source CLI only sends whatever label string is configured; whether Figma's backend publish API applies any server-side validation beyond what the CLI does is not visible from the public repo and was not tested against the live API.
