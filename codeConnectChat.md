User: I'm picking up the code connect efforts again. I'm going to select each component in turn in figma and ask for a analysis of what it would take to establish a code connect file in this repo and integrate it into the figma library. The figma library is almost an exact mirror of the MUI framework so code connect files should be authored to surface MUI props and notation. Some examples already exist in the repo. Some components are actually made up of smaller MUI componets, when we identify a component like that we should work to create code connected version of those components ebfore tackling the composite. As we work through this, we must keep an up-to-date guide on how to handle this so that if we pick this up later, we don't have to figure out a method. You should check for existing code connect guidance in the repo before starting. What do you think, should we establish some draft documentation guidance first and then work through it?

GitHub Copilot: Updated todo list

Searched for files matching `**/*.figma.tsx`, 9 matches

Read memory

Searched for text `[Cc]ode [Cc]onnect` (`**/*.md`), 11 results

Read

Read

Read

Read

Guidance already exists — `figma-code-connect-runbook.md` covers the MCP flow, parser-safe patterns, publish steps, and MUI guardrails. So rather than drafting new docs, I extended it with the pieces your plan needs: a per-component analysis template, a composite decomposition policy, and a status tracker.

Replacing 20 lines with 84 lines in

```

```

Replacing 9 lines with 10 lines in

```

```

Updated memory file

My take: no need for a new draft doc — the runbook was already the right home, it was just missing the three things your plan depends on. Added:

- **Core principle** — mappings surface MUI props/notation; Figma property names are translated, not copied (state enums → `disabled`/`error` booleans, MUI defaults → `undefined`).
- **Component Analysis Template** — the short decision record I'll produce for each component you select: node URL, MUI target, atom/composite classification, property→prop table, unmapped properties, risks.
- **Composite decomposition policy** — atoms must be connected and published before the composite, since `figma.children()` only renders nested snippets for already-connected instances. Plus rules for layer-name matching, lifting shared props to the wrapper via `nestedProps`, and extracting nested text.
- **Status tracker** — table of the 9 existing mappings with type and child dependencies, so a paused session resumes at the right layer.

Ready when you are — select the first component in Figma and I'll run metadata → design context, write the analysis, and flag any child components we need to connect first.

Created 5 todos

Made changes.

User: I have selected the autocomplete. already a fairly complex one because it leverages the select component and chips. I'll let you analyse

GitHub Copilot: Updated todo list

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,next.js,mui",
"clientLanguages": "typescript,javascript"
}

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,next.js,mui",
"clientLanguages": "typescript,javascript",
"nodeId": "6570:49860"
}

Ran `get_code_connect_map`
Completed with input: {
"nodeId": "6570:49856"
}

Ran `get_design_context`
Completed with input: {
"artifactType": "DESIGN_SYSTEM",
"clientFrameworks": "react,next.js,mui",
"clientLanguages": "typescript,javascript",
"nodeId": "6570:49860"
}

Created 3 todos

Before the full analysis I need to relay a prompt from the Figma MCP server:

> Some Figma design components are not connected to your codebase with Code Connect. Making connections can reduce context usage and give you better codegen output.
>
> Would you like to connect code components to the Figma design?

Analyzing your answers...

Ran `get_code_connect_suggestions`
Completed with input: {
"clientFrameworks": "react,next.js,mui",
"clientLanguages": "typescript,javascript",
"nodeId": "6570:49860"
}

Added 2 todos

User: looks like the request pulle in too many images

GitHub Copilot: Updated todo list

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx"
}

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"nodeId": "613:101693"
}

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"nodeId": "6570:49860"
}

Ran `get_code_connect_map`
Completed with input: {
"codeConnectLabel": "MUI React",
"nodeId": "6570:49856"
}

Ran `get_code_connect_map`
Completed with input: {
"codeConnectLabel": "MUI React",
"nodeId": "6570:49860"
}

Read []()

Ran `get_design_context`
Completed with input: {
"artifactType": "DESIGN_SYSTEM",
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"excludeScreenshot": true,
"nodeId": "613:101693",
"taskType": "CREATE_ARTIFACT"
}

Ran `get_design_context`
Completed with input: {
"artifactType": "DESIGN_SYSTEM",
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"excludeScreenshot": true,
"nodeId": "6570:40782",
"taskType": "CREATE_ARTIFACT"
}

No matches found. Your search pattern might be excluded completely by either the search.exclude settings or .*ignore files.
If you believe that it should have results, you can check into the .*ignore files and the exclude setting (here are some excluded patterns for reference:[**/node_modules,**/bower_components,**/*.code-search]).
Then if you want to include those files you can call the tool again by setting "includeIgnoredFiles" to true.

Read [](), lines 1 to 30

Replacing 19 lines with 36 lines in []()

```

```

Got the structure with cheap metadata calls plus one single-variant design context (screenshots excluded). Here's the analysis.

### Autocomplete

- **Figma node:** `6570:49856` — component set `<Autocomplete>`
- **MUI component:** `Autocomplete` from `@mui/material`
- **Classification:** **divergent composite** — this is the important finding
- **Target file:** `src/components/mui/inputs/Autocomplete.figma.tsx`

**The divergence.** Figma builds `<Autocomplete>` by nesting the `<Select>` symbol (set `6570:41424`), and inside it Chips, a Menu → Paper → MenuList, and two icons. MUI's `Autocomplete` has no relationship to `Select` at all — it renders a `TextField` through `renderInput`, renders tags as Chips through `renderTags`, and renders the popper/listbox and the clear/dropdown indicators internally. Figma's own component description confirms this; it documents the node with a `renderInput={(params) => <TextField {...params} />}` example.

So the layer tree is a visual assembly, not a composition contract. Mapping it literally would emit a `<Select>`-based snippet that is simply wrong MUI.

**Consequence for dependencies:** Autocomplete has **no blocking child mappings**. Chip and FormHelperText are already connected but aren't used here — they're internal renders, not children. Nothing needs to be built first.

**Property mapping**

The set itself only exposes two properties. Everything else lives on the nested `<Select>` instance and must be harvested with `figma.nestedProps("<Select>", …)`.

| Figma property | Source        | MUI prop                          | Mapping                                                     |
| -------------- | ------------- | --------------------------------- | ----------------------------------------------------------- |
| Multiple Value | Autocomplete  | `multiple`                        | `figma.boolean`, false → `undefined`                        |
| Open           | Autocomplete  | `defaultOpen`                     | `figma.boolean`, false → `undefined`                        |
| Label          | nested Select | `renderInput` → TextField `label` | `figma.string`                                              |
| Value          | nested Select | `defaultValue`                    | `figma.string`                                              |
| Placeholder    | nested Select | TextField `placeholder`           | `figma.string`                                              |
| Variant        | nested Select | TextField `variant`               | `figma.enum` (Standard → `standard`, Outlined → `outlined`) |
| Size           | nested Select | `size`                            | `figma.enum`, Medium → `undefined`                          |
| State          | nested Select | `disabled` / TextField `error`    | `figma.enum` → two booleans                                 |
| Helper         | nested Select | TextField `helperText`            | `figma.boolean`                                             |

Use `defaultOpen` rather than `open`: `open` is controlled and would generate a snippet needing `onClose`, which is the same trap we hit with Checkbox's `checked`.

**Deliberately unmapped**

- `<Chip>` instances in the `AutocompleteTag` frame — rendered by `renderTags` when `multiple` is set
- `<Menu>` / `<Paper>` / `<MenuList>` — MUI renders a Popper + listbox internally
- `ArrowDropDownFilled` / `ArrowDropUpFilled` — the popup indicator, driven by open state
- `AutocompleteClose` — the clear indicator, governed by `disableClearable`
- Select's `Active` and `Has Value` — focus state and a value-presence flag, neither is a prop
- Select's `Adorn. Start` / `Start Instance` — Autocomplete owns the input adornments; forcing one in fights `renderInput`

**Risks, in priority order**

1. `renderInput` is required and is a render prop returning JSX with a spread: `renderInput={(params) => <TextField {...params} label={…} />}`. A nested arrow function plus spread inside a Code Connect `example` is the single biggest unknown here, and our notes already record that the parser rejects computed expressions in example props. This needs a parse test before anything else is built.
2. `options` is required and has no Figma source. Would have to be an inline literal array in the JSX prop — also unverified against the parser.
3. `defaultValue` for the multiple case must be an array. Wrapping a mapped string as `[value]` is exactly the kind of computed expression the parser has rejected before. Likely drop `defaultValue` rather than fight it.

**Suggested sequence**

Spike first: a minimal mapping with only `multiple` and `defaultOpen`, hardcoded `options` and `renderInput`, then run `npx figma connect parse`. That answers risks 1 and 2 in one shot. If it parses, layer in the `nestedProps` values; if it doesn't, we know early that Autocomplete needs a `.figma.template.js` template instead of a `.figma.tsx` example, which is a different authoring path.

Separately, `TextField`, `Select`, and `MenuItem` are all real unconnected components in the library and worth their own mappings — but as peers, not prerequisites. I've added them to the tracker as Not started.

I've updated `figma-code-connect-runbook.md` with the divergent-composite guardrail, the tracker rows, and a troubleshooting entry for the image-heavy MCP response you just hit (metadata first, single variant, `excludeScreenshot`).

Want me to run the parse spike?

Starting: _Analyze components for code connection_ (1/3)

Made changes.

User: I follo, but to be clear, I would rather the code connect output was light on specifics than gave incorrect information. For example, at a minium the code connect mapping would simply create an <Autocomplete/> output with no parameters and guidance for Agents and humans to infer from the design. What do you think?

GitHub Copilot: Updated todo list

You're right, and I think that should be the governing rule rather than a one-off call.

A mapping that emits a confident-looking snippet built on `<Select>` is actively harmful: a human skims it, an agent copies it, and both ship the wrong component. A mapping that emits a bare `<Autocomplete>` costs a developer thirty seconds of reading the MUI docs. Those aren't comparable failure modes.

One correction to your framing though: `<Autocomplete />` with literally no props doesn't compile — `options` and `renderInput` are required. So the floor isn't "no props", it's **the smallest snippet that actually compiles, using only props we can verify from a real Figma property**. Everything inferred from layer structure gets dropped, and we lean on Code Connect's `links` field to point at the MUI API docs so the reader knows where to go.

Let me build that and see if it parses.

Created []()

Checked [](), no problems found

Execution complete: Parsing Code Connect mappings

Ran terminal command: cd '/c/repositories/next.js-test' && npx figma connect parse -c figma.config.json

Ran terminal command: sed -n '1,260p' '/c/Users/sallen/AppData/Roaming/Code/User/workspaceStorage/86e2b569403d5b70ab4bb2b1830c7dc0/GitHub.copilot-chat/chat-session-resources/a3ee0579-a35d-4a22-87cb-3551283c19de/call_FdXOL79NTI3pOGps40AFwf8h\_\_vscode-1789643442839/content.txt'

Ran terminal command: for f in '/c/Users/sallen/AppData/Roaming/Code/User/workspaceStorage/86e2b569403d5b70ab4bb2b1830c7dc0/GitHub.copilot-chat/chat-session-resources/a3ee0579-a35d-4a22-87cb-3551283c19de'/\*/content.txt; do echo "=== $f ==="; sed -n '1,220p' "$f"; echo; done

Ran terminal command: cd '/c/repositories/next.js-test' && (grep -RIn "ParserError\|Autocomplete\|renderInput\|options\|arrow function\|arrow functions\|warning" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | head -n 200)

Ran terminal command: cd '/c/repositories/next.js-test' && npx figma connect parse -c figma.config.json >/tmp/figma_parse.log 2>&1; echo "EXIT:$?"; grep -nE "ParserError|Autocomplete|renderInput|options|arrow function|arrow functions|warning|error" /tmp/figma_parse.log | head -n 200; echo '---TAIL---'; tail -n 120 /tmp/figma_parse.log

Ran terminal command: grep -nEi 'ParserError|Autocomplete|renderInput|options|arrow function|arrow functions|warning|error' /tmp/figma_parse.log | head -n 80; echo '---'; tail -n 40 /tmp/figma_parse.log

Created 4 todos

Ran terminal command: cd /c/repositories/next.js-test && npx figma connect parse -c figma.config.json 2>&1 | tail -n 60

Ran terminal command: cd /c/repositories/next.js-test && npx figma connect parse -c figma.config.json > /tmp/cc.json 2> /tmp/cc.err; echo "EXIT=$?"; echo "--- STDERR ---"; cat /tmp/cc.err; echo "--- AUTOCOMPLETE ENTRY ---"; grep -n -i "autocomplete" /tmp/cc.json | head -n 20

No matches found. Your search pattern might be excluded completely by either the search.exclude settings or .*ignore files.
If you believe that it should have results, you can check into the .*ignore files and the exclude setting (here are some excluded patterns for reference:[**/node_modules,**/bower_components,**/*.code-search]).
Then if you want to include those files you can call the tool again by setting "includeIgnoredFiles" to true.

Read []()

Ran terminal command: cd /c/repositories/next.js-test && node -e "const d=require('/tmp/cc.json');const a=d.find(x=>x.component==='Autocomplete');const t=a.template;console.log(t.slice(t.indexOf('const figma')>-1?t.indexOf('const figma'):t.length-800));" 2>&1 | tail -n 30

Ran terminal command: const d=require('/tmp/cc.json');const a=d.find(x=>x.component==='Autocomplete');const t=a.template;console.log(JSON.stringify(t.slice(-700)));
Completed with input: const d=require('/tmp/cc.json');const a=d.find(x=>x.component==='Autocomplete');const t=a.template;console.log(JSON.stringify(t.slice(-700)));

Ran terminal command: cd /c/repositories/next.js-test && npx figma connect parse -c figma.config.json > cc-parse.tmp.json 2>/dev/null; node -e "const d=require('./cc-parse.tmp.json');const a=d.find(x=>x.component==='Autocomplete');console.log(JSON.stringify(a.template.slice(-600)));"; rm -f cc-parse.tmp.json

Parsed clean — exit 0, all 10 files, no `ParserError`. The generated template is:

```tsx
<Autocomplete
  multiple
  options={[]}
  renderInput={(params) => <TextField {...params} />}
/>
```

Worth flagging: the first parse run I delegated came back reporting a `ParserError` on `renderInput`/`options` with quoted error text. That was fabricated — the real run exits 0. I re-ran it directly to confirm, and I'll stop trusting delegated pass/fail reports for this workflow.

The spike also corrects an assumption in my own notes. Arrow functions, JSX spreads, and array literals are **not** a parser problem in general. Code Connect bakes anything that isn't a mapped prop into the template as literal text — only expressions that _compute over mapped props_ get rejected. That's a meaningfully different rule than what was written down, and it's what makes the minimal approach cheap.

Recording both the principle and the corrected rule:

Replacing 9 lines with 29 lines in []()

```

```

Updated memory file []()

Updated memory file []()

I agree with your instinct, and the spike confirms it's also the cheap option — the sparse mapping took one file and parsed first time, where chasing `nestedProps` off a `<Select>` that MUI never renders would have been both more work and wrong.

**Created** `Autocomplete.figma.tsx` — maps `multiple` only, includes `options={[]}` and `renderInput` to satisfy MUI's required props, and links to the MUI Autocomplete API. No type errors, parses clean, not yet published.

**Runbook** now carries a _Correctness Floor_ section stating the sparse-over-wrong rule explicitly, plus the corrected parser-safety rule, so neither has to be rediscovered.

Two things worth your call before I publish:

1. **`Open` is a legitimate mapping I left out.** It maps honestly to `defaultOpen`. I dropped it because an open dropdown is a design presentation state rather than something you'd want in production code, but it's defensible either way — say the word and it's two lines.

2. **`options={[]}` renders an Autocomplete with nothing in it.** Correct and compiling, but a reader might wonder if the mapping is broken. The alternative is a placeholder like `options={["Option 1", "Option 2"]}` matching the Figma content, which is friendlier but is invented sample data. I leaned to the empty array on your "light rather than wrong" principle; happy to flip it.

Once you've decided, publishing is one command. After that, `TextField` looks like the highest-value next target — it's the component Autocomplete actually renders, and it unblocks `Select` too.

Completed: _Update runbook with correctness principle_ (1/5)

Made changes.

User: I'd use placeholder data to help with rendering and comprehension

GitHub Copilot: Updated todo list

Replacing 6 lines with 7 lines in []()

```

```

Replacing 7 lines with 7 lines in []()

```

```

Checked [](), no problems found

Created 2 todos

Ran terminal command: cd /c/repositories/next.js-test && npx figma connect parse -c figma.config.json > cc-parse.tmp.json 2>/dev/null; echo "EXIT=$?"; node -e "const d=require('./cc-parse.tmp.json');const a=d.find(x=>x.component==='Autocomplete');const t=a.template;console.log(JSON.stringify(t.slice(t.lastIndexOf('export default'))));"; rm -f cc-parse.tmp.json

Parses clean. Generated snippet:

```tsx
<Autocomplete
  multiple
  options={["Option 1", "Option 2", "Option 3"]}
  renderInput={(params) => <TextField {...params} label="Option" />}
/>
```

I also added `label="Option"` to the `TextField` — without it the rendered preview is an unlabelled box, which reads as broken rather than as a placeholder. Both values are lifted from the component's own Figma usage description rather than invented, which keeps them defensible under the sparse-over-wrong rule.

Recording that nuance so the floor isn't misread as "always use empty values":

Replacing 5 lines with 7 lines in []()

```

```

Updated memory file []()

Done — `Autocomplete.figma.tsx` now uses rendering placeholders, no type errors, parses clean.

Still open from my last message: whether to map `Open` → `defaultOpen`. It's a genuine Figma property so it passes the correctness floor, but it only ever produces demo-state code. My inclination is to leave it out.

Ready to publish whenever you confirm — that needs the token from `.env`, and it's a write to the shared Figma library, so I won't run it unprompted.

Completed: _Update placeholder data in Autocomplete_ (1/2)

Made changes.

User: you are right about open being a presentation in figma, not a dev requirement. publish it

GitHub Copilot: Updated todo list

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && npx figma connect publish -c figma.config.json -t "$FIGMA_ACCESS_TOKEN" 2>&1 | grep -v -i "token" | tail -n 30

Ran `get_code_connect_map`
Completed with input: {
"codeConnectLabel": "MUI React",
"nodeId": "6570:49856"
}

Ran `get_code_connect_map`
Completed with input: {
"codeConnectLabel": "MUI React",
"nodeId": "6543:36744"
}

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && npx figma connect publish -c figma.config.json -t "$FIGMA_ACCESS_TOKEN" > cc-pub.tmp.log 2>&1; echo "EXIT=$?"; tail -n 8 cc-pub.tmp.log; rm -f cc-pub.tmp.log

Publish failed — **`403 Token expired`**. The `FIGMA_ACCESS_TOKEN` in `.env` is no longer valid, which is the exact failure the runbook already documents.

My first attempt masked this: I piped the output through `grep -v -i "token"` to be sure the secret couldn't leak, and that filter also swallowed the line `Failed to fetch node info (403): 403 Token expired`. The re-run with the exit code exposed it. Filtering on "token" was the wrong way to protect the secret — the token only ever appears in the command, never in the output.

To proceed, you'll need to replace the token yourself — don't paste it into chat, and I won't ask for it:

1. Generate a new Figma personal access token with **Code Connect: write** scope (Figma → Settings → Security → Personal access tokens).
2. Update `FIGMA_ACCESS_TOKEN` in `.env` directly in your editor or terminal.
3. Tell me when it's saved and I'll re-run the publish.

The mapping itself is fine — it validated through to the network call, so nothing needs changing in the file. Tracker still reads "Parsed, not published" and stays accurate.

Logging the output-filtering trap so it doesn't cost time again:

Replacing 11 lines with 18 lines in []()

```

```

Created 2 todos

Updated memory file []()

Publish is blocked on the expired token — everything up to the network call is green. Once you've refreshed `FIGMA_ACCESS_TOKEN` in `.env`, say the word and I'll re-run it, then you can confirm in Dev Mode that the node shows the `MUI React` snippet.

One thing that surfaced along the way: `get_code_connect_map` returns `{}` even for `Button`, which has been published for a while. So that tool isn't a usable verification signal — Dev Mode is the only reliable check. Noted in the runbook.

Made changes.

User: new one generated. 90 day expirey is maximum. worth nting

GitHub Copilot: Updated todo list

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && npx figma connect publish -c figma.config.json -t "$FIGMA_ACCESS_TOKEN" > cc-pub.tmp.log 2>&1; echo "EXIT=$?"; tail -n 10 cc-pub.tmp.log; rm -f cc-pub.tmp.log

Token works. New blocker, and it's a pre-existing one unrelated to Autocomplete:

```
Validation failed for FormGroup (...node-id=6543%3A43147): node not found in file
```

Publish is all-or-nothing, so this one stale mapping blocks Autocomplete too. Let me confirm the node is really gone.

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"nodeId": "6543:43147"
}

Figma's MCP needs the design file as the active tab, and it isn't right now. I'll check via the REST API instead, using the token already in `.env`.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" "https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/nodes?ids=6543:43147" -o cc-node.tmp.json; node -e "const d=require('./cc-node.tmp.json');console.log('status', d.status||200, d.err||'');console.log('node present:', JSON.stringify(Object.keys(d.nodes||{}).map(k=>[k, d.nodes[k]?d.nodes[k].document.name:null])));"; rm -f cc-node.tmp.json

Confirmed gone — the API returns `null` for that id. Let me find where `FormGroup` lives now.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" "https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/component_sets" -o cc-sets.tmp.json; node -e "const d=require('./cc-sets.tmp.json');const s=(d.meta&&d.meta.component_sets)||[];console.log('total sets:',s.length);s.filter(x=>/form|group/i.test(x.name)).forEach(x=>console.log(x.node_id,'|',x.name));"; rm -f cc-sets.tmp.json

Two `FormGroup` sets exist but neither is the Checkbox one. Before I chase that, let me validate **every** mapping's node id at once so we don't hit this one file at a time.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const fs=require('fs'),path=require('path');
const files=[];(function w(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,f.name);if(f.isDirectory())w(p);else if(f.name.endsWith('.figma.tsx'))files.push(p);}})('src');
const map={};for(const f of files){const t=fs.readFileSync(f,'utf8');const m=t.match(/node-id=([0-9]+)%3A([0-9]+)/);if(m)map[m[1]+':'+m[2]]=path.basename(f);}
fs.writeFileSync('cc-ids.tmp.json',JSON.stringify(map));
console.log(Object.entries(map).map(([k,v])=>k+' '+v).join('\n'));
" && curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" "https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/nodes?ids=$(node -e "console.log(Object.keys(require('./cc-ids.tmp.json')).join(','))")" -o cc-nodes.tmp.json; node -e "
const ids=require('./cc-ids.tmp.json'),d=require('./cc-nodes.tmp.json');
console.log('\n--- validation ---');
for(const [id,file] of Object.entries(ids)){const n=d.nodes&&d.nodes[id];console.log((n?'OK ':'GONE '),id,file,n?'| '+n.document.name:'');}
"; rm -f cc-ids.tmp.json cc-nodes.tmp.json

That result is obviously wrong — `6570:49856` is the Autocomplete we just read from Figma. The command substitution picked up a `stdout is not a tty` warning and corrupted the id list. Let me redo it as a single script with no shell substitution.

Created []()

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/check-figma-node-ids.js

Only `FormGroup` is stale; everything else resolves. Finding its replacement:

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
(async()=>{
const r=await fetch('https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/component_sets',{headers:{'X-Figma-Token':token}});
const d=await r.json();
const sets=(d.meta&&d.meta.component_sets)||[];
console.log('--- sets matching Checkbox or FormGroup ---');
sets.filter(s=>/checkbox|formgroup/i.test(s.name)).forEach(s=>console.log(s.node_id,'|',s.name));
})();"

No `<FormGroup> | Checkbox` set exists any more. The surviving FormGroup sets are `| <RadioGroup>` (`1479:32615`) and `| <Switch>` (`642:108242`) — neither matches our mapping, which maps checkbox children. So the Figma library reorganised FormGroup by control type and the checkbox variant was removed or merged. That needs a design-side decision, not a guess from me.

To get Autocomplete out without touching that, I'll publish with a temporary config that excludes only the stale file, leaving `figma.config.json` untouched.

Ran terminal command: cd /c/repositories/next.js-test && node -e "
const c=require('./figma.config.json');
c.codeConnect.exclude=[...c.codeConnect.exclude,'src/components/mui/inputs/FormGroup.figma.tsx'];
require('fs').writeFileSync('figma.config.publish.tmp.json',JSON.stringify(c,null,2));
console.log(JSON.stringify(c.codeConnect.exclude));
"

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && npx figma connect publish -c figma.config.publish.tmp.json > cc-pub.tmp.log 2>&1; echo "EXIT=$?"; tail -n 12 cc-pub.tmp.log; rm -f cc-pub.tmp.log figma.config.publish.tmp.json

Published. `Autocomplete` is live, along with the eight other valid mappings.

Let me confirm the temp files are gone and the real config is untouched.

Ran terminal command: cd /c/repositories/next.js-test && ls _.tmp.json cc-_.tmp\* 2>/dev/null; echo "--- git status ---"; git --no-pager status --short

Clean — temp config gone, `figma.config.json` untouched. (The theme file changes are your pre-existing work, not mine.)

Capturing the two durable lessons from this session:

Replacing 20 lines with 59 lines in []()

```

```

Added 1 todo

Updated memory file []()

`Autocomplete` is published. Nine mappings uploaded successfully.

**Two things came out of this that outlast the task:**

**Node ids rot, and publish is all-or-nothing.** `FormGroup`'s node `6543:43147` had been deleted in Figma at some point, and it was silently blocking every other mapping from publishing. I added `check-figma-node-ids.js`, which validates every mapping's node id against the Figma API in a single request and reports `OK`/`STALE`. Worth running before each publish — it turns a confusing batch failure into a one-line answer.

**Your 90-day expiry point is now in the runbook** under Required Setup, framed as "expect quarterly regeneration" so a future `403` is recognised immediately rather than debugged.

**`FormGroup` needs a decision from you.** Our mapping targets a FormGroup containing _checkboxes_, but the library now publishes only:

- `1479:32615` — `<FormGroup> | <RadioGroup>`
- `642:108242` — `<FormGroup> | <Switch>`

There's no checkbox variant left. I deliberately didn't repoint it at a lookalike — a rename like this usually signals the library was reorganised, so the mapping likely needs rewriting rather than a new id. Options: rewrite against RadioGroup, against Switch, split into both, or retire it. It's marked **Broken** in the tracker and excluded from publish until you decide.

Also flagging a process failure on my part: my earlier delegated parse run reported a fabricated `ParserError` with invented error text, when the real run exited 0. I've noted not to trust delegated pass/fail for this workflow. Had I acted on it, I'd have rewritten a perfectly good file.

`TextField` is still the highest-value next target when you're ready.

Made changes.

User: I think the figma setup might be confused. I have selected a radiogroup and the component is labelled as a formgroup. selected now for you to investigate

GitHub Copilot: Updated todo list

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx"
}

Selection is `1479:32615` — named `<FormGroup> | <RadioGroup>`, but note its variant property is literally **`Checkboxes=3`**. Let me see what it actually contains.

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"nodeId": "1479:32616"
}

Structure confirms it: `FormLabel` + `<RadioGroup>` + `FormHelperText`. It genuinely is a radio group — but the variant property is still named **`Checkboxes`**, left over from whatever it was duplicated from.

Let me check the Switch set and hunt for any surviving checkbox group.

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"nodeId": "642:108242"
}

Created 3 todos

Switch set is consistent (`Switches=3/5`), which makes the RadioGroup set's `Checkboxes` property clearly the anomaly. Let me get a definitive list of everything FormGroup-related in the library.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
(async()=>{
const r=await fetch('https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/components',{headers:{'X-Figma-Token':token}});
const d=await r.json();
const c=(d.meta&&d.meta.components)||[];
console.log('total published components:',c.length);
console.log('--- anything FormGroup / Checkbox related ---');
c.filter(x=>/formgroup/i.test(x.name+' '+((x.containing_frame&&x.containing_frame.name)||'')))
.forEach(x=>console.log(x.node_id,'|',(x.containing_frame&&x.containing_frame.name)||'?','::',x.name));
})();"

Correction to what I told you earlier — I was wrong. A checkbox FormGroup **does** still exist:

`6543:43148` — `<FormGroup> | <Checkbox>`

I'd only queried `/component_sets`, and this one is a plain **component**, not a component set, so it never appeared. Our mapping points at `6543:43147` — off by one. Let me verify.

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"nodeId": "6543:43148"
}

That's exactly what our mapping expects: `FormLabel` + a `Checkboxes` slot of `<FormControlLabel> | Checkbox` + `FormHelperText`. So it's a one-character fix — except our mapping uses `figma.enum("State", …)`, and this node has no variant suffix in its name. Let me check whether it has a State property at all.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
(async()=>{
const r=await fetch('https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/components',{headers:{'X-Figma-Token':token}});
const d=await r.json();
const c=((d.meta&&d.meta.components)||[]).find(x=>x.node_id==='6543:43148');
console.log(JSON.stringify({node_id:c.node_id,name:c.name,component_set_id:c.component_set_id,frame:c.containing_frame&&c.containing_frame.name},null,2));
const r2=await fetch('https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/nodes?ids=6543:43148',{headers:{'X-Figma-Token':token}});
const d2=await r2.json();
const doc=d2.nodes['6543:43148'].document;
console.log('type:',doc.type);
console.log('componentPropertyDefinitions:',JSON.stringify(doc.componentPropertyDefinitions,null,2));
})();"

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"nodeId": "6558:39344"
}

Your instinct was right — it's a Figma-side problem, not a Code Connect one. Here's what's actually there:

| Node         | Name                          | Contains                     | Variant property               |
| ------------ | ----------------------------- | ---------------------------- | ------------------------------ |
| `6543:43148` | `<FormGroup> \| <Checkbox>`   | FormControlLabel/Checkbox ×3 | _(none)_                       |
| `642:108242` | `<FormGroup> \| <Switch>`     | switches                     | `Switches=3/5` ✅              |
| `1479:32615` | `<FormGroup> \| <RadioGroup>` | a real `<RadioGroup>`        | **`Checkboxes=3`** ❌          |
| `6558:39344` | `<RadioGroup>`                | radios                       | `Radios=3/5, Disabled, Row` ✅ |

**The component you selected is a duplicate.** `1479:32615` contains a genuine `<RadioGroup>`, so the rename was accurate — but its variant property is still called `Checkboxes`, which is the leftover that made it look mislabelled. It's almost certainly the old checkbox group, duplicated and repointed at radios without updating the property name.

More importantly, it's redundant. `6558:39344` is already a proper `<RadioGroup>` with `Radios=3/5`, `Disabled`, and `Row` — all of which map cleanly onto MUI's `RadioGroup` (`row`) and `Radio` (`disabled`). `1479:32615` has only three variants and a misleading property.

There's also a semantic problem with the name itself: MUI has no "FormGroup of RadioGroup" concept. `FormGroup` is the wrapper for checkboxes and switches; `RadioGroup` is its own component and is _not_ built on `FormGroup`. So `<FormGroup> | <RadioGroup>` doesn't correspond to anything in MUI. For the library to stay a true mirror, that node probably wants deleting in favour of `6558:39344` — a design-side call, but worth raising.

**And I have to correct myself.** I told you earlier that no checkbox FormGroup existed. That was wrong. `<FormGroup> | <Checkbox>` is alive at `6543:43148`; I'd only queried `/component_sets`, and it's a plain **component**, not a set, so it never showed up. I should have checked both endpoints before concluding something had been deleted.

**That changes the FormGroup fix.** Our mapping points at `6543:43147`, one off from the real `6543:43148` — but it isn't just an id bump. The live component's only properties are:

- `<FormLabel>` — boolean
- `<FormHelperText>` — boolean
- `Checkboxes` — slot

There is **no `State` property**, yet our mapping does `figma.enum("State", { Enabled, Disabled, Error })`. Under the correctness floor, `disabled` and `error` have to be dropped — nothing in Figma backs them any more.

Updating the record now; I'll leave the rewrite itself for your go-ahead since it changes an already-published component's output.

Replacing 12 lines with 27 lines in []()

```

```

Updated memory file []()

The component you flagged is a legacy duplicate, and chasing it turned up a mistake of mine worth correcting plainly: `<FormGroup> | <Checkbox>` was never deleted. I'd searched only `/component_sets`, and it's a standalone component, so it only appears in `/components`. That endpoint distinction is now documented and in memory.

**Two things for the design team:**

1. `1479:32615` `<FormGroup> | <RadioGroup>` — property still named `Checkboxes`, duplicates the better `<RadioGroup>` at `6558:39344`, and has no MUI counterpart since `RadioGroup` isn't built on `FormGroup`. Deletion candidate.
2. `6543:43148` `<FormGroup> | <Checkbox>` — lost its `State` property, so disabled/error states are no longer expressible in the design.

**One thing for you to decide:** the FormGroup mapping rewrite. Repoint to `6543:43148`, drop `disabled`/`error` (unbacked now), and map the two booleans plus the `Checkboxes` slot. That narrows an already-published component's output, so I'd rather you confirm than assume. Once it's fixed, the exclusion goes away and `figma.config.json` publishes the full set again.

Both issues are recorded under **Known Figma Library Issues** in the runbook, so they survive if we pause here.

Starting: _Investigate Figma component naming issue_ (1/3)

Made changes.

User: let's fix figma before we proceed. For example, renaming the property name to radios for the radio group component. I'll make figma changes

GitHub Copilot: Updated todo list

Good call — fixing the source is better than encoding workarounds in mappings. Let me pull the exact property definitions so the list is precise.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const ids=['1479:32615','642:108242','6543:43148','6558:39344'];
(async()=>{
const r=await fetch('https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/nodes?ids='+ids.join(','),{headers:{'X-Figma-Token':token}});
const d=await r.json();
for(const id of ids){
const doc=d.nodes[id]&&d.nodes[id].document;
if(!doc){console.log(id,'MISSING');continue;}
console.log('\n=== '+id+' '+doc.name+' ['+doc.type+'] ===');
const defs=doc.componentPropertyDefinitions||{};
for(const [k,v] of Object.entries(defs)){
console.log(' '+k+' -> '+v.type+(v.variantOptions?' ['+v.variantOptions.join(', ')+']':'')+(v.type==='BOOLEAN'?' (default '+v.defaultValue+')':''));
}
if(!Object.keys(defs).length)console.log(' (no component properties)');
}
})();"

Now I can see the whole family. Here's the current state:

| Node                                       | Type      | Properties                                                                                |
| ------------------------------------------ | --------- | ----------------------------------------------------------------------------------------- |
| `1479:32615` `<FormGroup> \| <RadioGroup>` | SET       | `<FormLabel>`, `<FormHelperText>`, `State` [Enabled/Disabled/Error], **`Checkboxes` [3]** |
| `642:108242` `<FormGroup> \| <Switch>`     | SET       | `<FormLabel>`, `<FormHelperText>`, `State` [Enabled/Disabled/Error], `Switches` [3, 5]    |
| `6543:43148` `<FormGroup> \| <Checkbox>`   | COMPONENT | `<FormLabel>`, `<FormHelperText>`, `Checkboxes` (SLOT) — **no `State`**                   |
| `6558:39344` `<RadioGroup>`                | SET       | `Radios` [3, 5], `Disabled`, `Row`                                                        |

### 1. The radio group — the name is the real bug, not the property

Renaming `Checkboxes` → `Radios` fixes the symptom, but `<FormGroup>` is itself wrong here. **MUI's `FormGroup` is not used for radios** — it wraps checkboxes and switches only. What that component actually depicts is MUI's documented radio pattern:

```tsx
<FormControl disabled error>
  <FormLabel>Label</FormLabel>
  <RadioGroup>…</RadioGroup>
  <FormHelperText>…</FormHelperText>
</FormControl>
```

So it's a legitimate composition wearing the wrong name. Either:

- **Rename to `<FormControl> | <RadioGroup>`** and the property to `Radios` — keeps a labelled/validated radio group, which `6558:39344` can't express (it has no label, helper text, or error state); or
- **Delete it** and treat `6558:39344` as the only radio group.

I'd favour the rename — it fills a real gap. Note its `Checkboxes` variant has only the value `[3]`, so either add `5` to match `Switches`, or drop the property.

The same reasoning is worth applying to the other two: `<FormGroup> | <Checkbox>` and `<FormGroup> | <Switch>` also contain `FormLabel` and `FormHelperText`, so they're `FormControl` compositions too. Those names are defensible shorthand since `FormGroup` genuinely is in the tree — unlike the radio one.

### 2. `<FormGroup> | <Checkbox>` lost its `State`

It's the odd one out: a plain component where its siblings are sets, with different property ids (`#2270:*` vs `#642:*`), suggesting it was rebuilt separately. Its sibling has `State` [Enabled/Disabled/Error]; it has none. That's why `disabled` and `error` are currently unmappable. Restoring `State` to match `<FormGroup> | <Switch>` would bring it back.

### 3. Count variants don't exist in MUI — prefer slots

`Radios=3/5` and `Switches=3/5` have no MUI counterpart; there's no "number of children" prop. They're pure design scaffolding and map to nothing. The slot on `<FormGroup> | <Checkbox>` is the better pattern — a slot maps directly to `figma.children()` and produces real nested code.

If you're touching these anyway, converting `Switches` and `Radios` from count variants to slots would make all three mappable the same way. That's the highest-leverage change on this list, though also the most work.

### 4. Minor: bracket convention is inconsistent

The FormGroup family uses `<Checkbox>` / `<Switch>` / `<RadioGroup>`, while the FormControlLabel family uses bare `Checkbox` / `Radio` / `Switch`. Harmless, but worth settling.

Recording the list so it survives the pause:

Replacing 8 lines with 21 lines in []()

```

```

The full list is in the runbook under **Known Figma Library Issues**, with the property table, so you can work through it at your own pace.

The headline: renaming `Checkboxes` → `Radios` is right, but I'd pair it with renaming the component to `<FormControl> | <RadioGroup>` — `FormGroup` genuinely isn't part of MUI's radio composition, so the component name is the deeper mismatch.

Ping me when the Figma changes are in and I'll re-run the node-id check and re-read the property definitions before touching any mapping — node ids will shift if you recreate rather than edit in place.

Created 5 todos

Made changes.

User: right those figma changes should have been made, lets review them one at a time. tell me what to select

GitHub Copilot: Updated todo list

Before directing you around Figma, let me see what actually changed — the API can tell me in one pass, and node ids may have shifted if you recreated anything.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const K='3ZH2uUGxYtIItgBpwjz4NC';
const H={headers:{'X-Figma-Token':token}};
const rx=/formgroup|formcontrol|radiogroup|<checkbox>|<switch>/i;
(async()=>{
const [cs,cc]=await Promise.all([
fetch('https://api.figma.com/v1/files/'+K+'/component_sets',H).then(r=>r.json()),
fetch('https://api.figma.com/v1/files/'+K+'/components',H).then(r=>r.json())
]);
console.log('--- COMPONENT SETS ---');
((cs.meta&&cs.meta.component_sets)||[]).filter(s=>rx.test(s.name)).forEach(s=>console.log(' ',s.node_id,'|',s.name));
console.log('--- STANDALONE COMPONENTS (not in a set) ---');
((cc.meta&&cc.meta.components)||[]).filter(c=>rx.test(c.name)&&!c.component_set_id).forEach(c=>console.log(' ',c.node_id,'|',c.name));
})();"

The library-level endpoints may be stale — `/components` and `/component_sets` reflect the last **published** library state, not live file edits. Let me read the file nodes directly instead.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const ids=['1479:32615','642:108242','6543:43148','6543:43147','6558:39344'];
(async()=>{
const r=await fetch('https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/nodes?ids='+ids.join(','),{headers:{'X-Figma-Token':token}});
const d=await r.json();
for(const id of ids){
const doc=d.nodes[id]&&d.nodes[id].document;
if(!doc){console.log('\n=== '+id+' :: NOT FOUND ===');continue;}
console.log('\n=== '+id+' "'+doc.name+'" ['+doc.type+'] ===');
const defs=doc.componentPropertyDefinitions||{};
const keys=Object.keys(defs);
if(!keys.length){console.log(' (no component properties)');continue;}
for(const k of keys){const v=defs[k];console.log(' '+k+' -> '+v.type+(v.variantOptions?' ['+v.variantOptions.join(', ')+']':''));}
}
})();"
Completed with input: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const ids=['1479:32615','642:108242','6543:43148','6543:43147','6558:39344'];
(async()=>{
const r=await fetch('https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/nodes?ids='+ids.join(','),{headers:{'X-Figma-Token':token}});
const d=await r.json();
for(const id of ids){
const doc=d.nodes[id]&&d.nodes[id].document;
if(!doc){console.log('\n=== '+id+' :: NOT FOUND ===');continue;}
console.log('\n=== '+id+' "'+doc.name+'" ['+doc.type+'] ===');
const defs=doc.componentPropertyDefinitions||{};
const keys=Object.keys(defs);
if(!keys.length){console.log(' (no component properties)');continue;}
for(const k of keys){const v=defs[k];console.log(' '+k+' -> '+v.type+(v.variantOptions?' ['+v.variantOptions.join(', ')+']':''));}
}
})();"

Changes are landing. Script hit a null on the deleted id — re-running with a guard, and checking `<RadioGroup>` too.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const ids=['1479:32615','642:108242','6543:43148','6543:43147','6558:39344'];
(async()=>{
const r=await fetch('https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/nodes?ids='+ids.join(','),{headers:{'X-Figma-Token':token}});
const d=await r.json();
for(const id of ids){
const doc=d.nodes&&d.nodes[id]?d.nodes[id].document:null;
if(!doc){console.log('\n=== '+id+' :: NOT FOUND ==='); continue;}
console.log('\n=== '+id+' "'+doc.name+'" ['+doc.type+'] ===');
const defs=doc.componentPropertyDefinitions||{};
const keys=Object.keys(defs);
if(!keys.length){console.log(' (no component properties)');continue;}
for(const k of keys){const v=defs[k];console.log(' '+k+' -> '+v.type+(v.variantOptions?' ['+v.variantOptions.join(', ')+']':''));}
}
})();"
Completed with input: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const ids=['1479:32615','642:108242','6543:43148','6543:43147','6558:39344'];
(async()=>{
const r=await fetch('https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC/nodes?ids='+ids.join(','),{headers:{'X-Figma-Token':token}});
const d=await r.json();
for(const id of ids){
const doc=d.nodes&&d.nodes[id]?d.nodes[id].document:null;
if(!doc){console.log('\n=== '+id+' :: NOT FOUND ==='); continue;}
console.log('\n=== '+id+' "'+doc.name+'" ['+doc.type+'] ===');
const defs=doc.componentPropertyDefinitions||{};
const keys=Object.keys(defs);
if(!keys.length){console.log(' (no component properties)');continue;}
for(const k of keys){const v=defs[k];console.log(' '+k+' -> '+v.type+(v.variantOptions?' ['+v.variantOptions.join(', ')+']':''));}
}
})();"

Let me stop wrestling with shell-escaped JS and make this a reusable script — we'll be re-reading properties every time design changes land.

Created []()

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/figma-node-props.js 6543:43148 6543:43147 6558:39344

Good progress — three of four landed. Here's the review, item by item:

**1. `<FormControl> | <RadioGroup>` (`1479:32615`) — done** ✅
Renamed, the `Checkboxes` count variant is gone and replaced by a `<RadioGroup>` SLOT, `State` [Enabled/Disabled/Error] retained. This now maps cleanly.

**2. `<FormGroup> | <Checkbox>` — done, but I need the new id** ✅
`6543:43148` is now a variant named `State=Enabled` with children `<FormLabel>`, `Checkboxes` (SLOT), `<FormHelperText>`. So it became a component **set** with State variants, as intended. The old set id `6543:43147` is confirmed gone.

**3. Count variants → slots — one leftover** ⚠️
`<FormGroup> | <Switch>` is clean: `Switches` is now a SLOT, count variant removed.

But `<RadioGroup>` (`6558:39344`) has **both**:

```
radios#2483:0  ->  SLOT          ← new
Radios         ->  VARIANT [3]   ← leftover, now single-valued
```

The old count variant wasn't deleted, just reduced to `[3]`. A single-value variant property is dead weight and will show up as a meaningless control in Dev Mode.

**4. Naming convention — now four styles** ⚠️
The slots across the family are named: `<RadioGroup>`, `Switches`, `Checkboxes`, and lowercase `radios`. Worth settling on one rule — I'd suggest plural control name (`Radios`, `Switches`, `Checkboxes`), matching the two that already agree, and capitalised like every other Figma property.

---

**Please select: the `<FormGroup> | <Checkbox>` component set** — the outer set frame containing the `State=Enabled` / `Disabled` / `Error` variants, not one of the variants inside it.

I need its new set node id, since that's what the mapping must point at, and `6543:43147` no longer resolves. Once I have it I'll confirm its property definitions match the Switch sibling, then we can do the FormGroup rewrite.

I also added `figma-node-props.js` — `node `figma-node-props.js` <nodeId…>` prints live name, type, properties and children for any node, so these re-checks stop being ad-hoc shell one-liners.

Added 1 todo

Made changes.

User: seleceted

GitHub Copilot: Updated todo list

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx"
}

New set id is `2483:185674`. Verifying its properties against the Switch sibling.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/figma-node-props.js 2483:185674 642:108242 1479:32615

All three are now structurally identical — `<FormLabel>` / `<FormHelperText>` booleans, a plural capitalised slot, and `State` [Enabled/Disabled/Error]. The slot naming is consistent too (`Checkboxes` / `Switches` / `Radios`). Let me re-check the standalone `<RadioGroup>` leftover.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/figma-node-props.js 6558:39344

Still outstanding on `6558:39344`:

```
radios#2483:0  ->  SLOT          ← new
Radios         ->  VARIANT [3]   ← leftover
```

Worth noting the ordering: delete the `Radios` variant **first**, then rename the `radios` slot to `Radios`. Doing it the other way round leaves two properties differing only by case.

Meanwhile the checkbox set is ready, so let me update the mapping to the new id.

Read []()

`State` survived the rebuild, so `disabled`/`error` stay valid — my earlier "must drop them" no longer applies. Only the node id needs changing.

Replacing 6 lines with 6 lines in []()

```

```

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/check-figma-node-ids.js && npx figma connect parse -c figma.config.json > /dev/null 2>&1; echo "PARSE_EXIT=$?"

All 10 mappings resolve, 0 stale, parse clean.

**One unknown remains:** the mapping matches children with `figma.children("<FormControlLabel> | Checkbox")`, but those instances now sit inside a `Checkboxes` SLOT rather than directly in the component. Whether `figma.children` traverses into a slot can only be confirmed in Dev Mode after publishing — parse won't catch it.

Let me update the record, then get your go-ahead to publish.

Read [](), lines 150 to 200

Replacing 23 lines with 31 lines in []()

```

```

Created 5 todos

Searched for regex `Known Figma Library Issues|## Change Log|FormGroup family|6558:39344|Corrected the FormGroup diagnosis` (`**/docs/development/figma-code-connect-runbook.md`), 8 results

The file has literal `\u2014` escapes from one of my earlier edits — let me read and rewrite that section properly.

Read [](), lines 318 to 345

Replacing 21 lines with 28 lines in []()

The mismatch is my own `\u2014` escapes. Replacing with the literal text from the file.

Replacing 21 lines with 28 lines in []()

```

```

Searched for text `\u2014` (`**/docs/development/figma-code-connect-runbook.md`), 13 results

The table was reformatted by a formatter, so the tracker row didn't update. Let me fix it.

Read [](), lines 108 to 124

Replacing 1 lines with 1 lines in []()

```

```

Review complete — three of four design fixes verified, one leftover.

**Verified done:**

- `<FormControl> | <RadioGroup>` (`1479:32615`) — renamed, `Radios` SLOT, `State` retained
- `<FormGroup> | <Checkbox>` (`2483:185674`) — now a set with `State` [Enabled/Disabled/Error] restored
- `<FormGroup> | <Switch>` (`642:108242`) — `Switches` converted to SLOT

All three now have identical shapes, so they can share one mapping pattern. Slot names are consistent too.

**Still outstanding — `6558:39344` `<RadioGroup>`:** the old `Radios` VARIANT `[3]` survives alongside the new `radios` SLOT. Delete the variant first, then rename the slot to `Radios`.

**Mapping updated:** `FormGroup.figma.tsx` repointed to `2483:185674`. Because `State` was restored, `disabled`/`error` stay mapped — the rewrite I'd warned about isn't needed, it was a one-line id change. All 10 mappings now validate, 0 stale, parse exit 0.

**Ready to publish, pending your go-ahead.** Worth knowing before you decide: the mapping matches children via `figma.children("<FormControlLabel> | Checkbox")`, and those instances now live inside a `Checkboxes` SLOT. Whether `figma.children` reaches into a slot is untested — parse can't tell us. If it doesn't resolve, the snippet will show an empty `<FormGroup>` and we'll need to match the slot layer instead. Publishing is how we find out; worst case is one more iteration.

Also fixed some `\u2014` escapes I'd written into the runbook earlier, and documented both helper scripts under a Helper Scripts section.

Starting: _Update FormGroup mapping to new id_ (2/4)

Made changes.

User: From figma (you may want to update our docs just in case this happens again):
I deltede the elemtn you moved. is there a chance that it exists because it is a published component?

That's a great theory! Published components can behave differently — they may still be referenced by the library even after being removed from the canvas. Let me investigate.

Yes, you're right! The node still exists (getNodeByIdAsync finds it) but it's orphaned — it has no parent and isn't found on any page. This is characteristic of a published component: even after you delete it from the canvas, Figma keeps it in memory because it's still part of the published library. Instances elsewhere may still reference it.

Notice there's also a dedicated
page in this file — the original component likely lived there or was published from there.

So to answer your question: yes, the <RadioGroup> component set persists because it's a published component in this file's library. Deleting it from the canvas doesn't fully remove it until the library is republished without it. Would you like me to help with anything else?

GitHub Copilot: Updated todo list

That's an important finding — it means our node-id validator can report a false `OK`. Let me verify the behaviour concretely before documenting it.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/figma-node-props.js 6558:39344

REST returns it in full — property definitions and all. So `/nodes` **cannot** distinguish a live component from an orphaned published one. Let me see whether a tree walk can.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
(async()=>{
const t0=Date.now();
const r=await fetch('https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC?depth=3',{headers:{'X-Figma-Token':token}});
const txt=await r.text();
console.log('status',r.status,'bytes',txt.length,'ms',Date.now()-t0);
const d=JSON.parse(txt);
const ids=new Set();
(function walk(n){ids.add(n.id);(n.children||[]).forEach(walk);})(d.document);
console.log('reachable ids at depth=3:',ids.size);
for(const id of ['6558:39344','2483:185674','642:108242','1479:32615','6570:49856'])
console.log(' ',id,ids.has(id)?'REACHABLE':'not reachable');
})();"

Depth 3 is too shallow — even live nodes aren't reachable. Trying deeper.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
(async()=>{
for(const depth of [4,5]){
const t0=Date.now();
const r=await fetch('https://api.figma.com/v1/files/3ZH2uUGxYtIItgBpwjz4NC?depth='+depth,{headers:{'X-Figma-Token':token}});
const txt=await r.text();
const d=JSON.parse(txt);
const ids=new Set();
(function walk(n){ids.add(n.id);(n.children||[]).forEach(walk);})(d.document);
console.log('depth='+depth,'bytes',txt.length,'ms',Date.now()-t0,'ids',ids.size);
for(const id of ['6558:39344','2483:185674','642:108242','1479:32615','6570:49856'])
console.log(' ',id,ids.has(id)?'REACHABLE':'not reachable');
}
})();"

Depth 5 costs 3.4 MB and 11 s and still doesn't reach them — components sit deeper than a tree walk can practically go. Let me test whether the MCP side can tell, since that's the plugin API the Figma assistant used.

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"nodeId": "6558:39344"
}

Neither REST nor MCP flags it — MCP returns it too, though note it's now at `x=-3463` (previously `x=153`) and down to 4 variants. Let me test one more signal that might actually detect this.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const K='3ZH2uUGxYtIItgBpwjz4NC';
(async()=>{
const cs=await fetch('https://api.figma.com/v1/files/'+K+'/component_sets',{headers:{'X-Figma-Token':token}}).then(r=>r.json());
const list=(cs.meta&&cs.meta.component_sets)||[];
for(const id of ['6558:39344','1479:32615','642:108242','6543:39843']){
const e=list.find(x=>x.node_id===id);
if(!e){console.log(id,':: not in published component_sets');continue;}
console.log(id,'|',e.name);
console.log(' containing_frame:',JSON.stringify(e.containing_frame));
console.log(' updated_at:',e.updated_at);
}
})();"
Completed with input: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const K='3ZH2uUGxYtIItgBpwjz4NC';
(async()=>{
const cs=await fetch('https://api.figma.com/v1/files/'+K+'/component_sets',{headers:{'X-Figma-Token':token}}).then(r=>r.json());
const list=(cs.meta&&cs.meta.component_sets)||[];
for(const id of ['6558:39344','1479:32615','642:108242','6543:39843']){
const e=list.find(x=>x.node_id===id);
if(!e){console.log(id,':: not in published component_sets');continue;}
console.log(id,'|',e.name);
console.log(' containing_frame:',JSON.stringify(e.containing_frame));
console.log(' updated_at:',e.updated_at);
}
})();"

Bash history expansion mangled `!e` into `exit $status_switch` — a recurring hazard with `!` inside double-quoted inline scripts. Avoiding it.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const K='3ZH2uUGxYtIItgBpwjz4NC';
(async()=>{
const cs=await fetch('https://api.figma.com/v1/files/'+K+'/component_sets',{headers:{'X-Figma-Token':token}}).then(r=>r.json());
const list=(cs.meta&&cs.meta.component_sets)||[];
for(const id of ['6558:39344','1479:32615','642:108242','6543:39843']){
const e=list.find(x=>x.node_id===id);
if(e === undefined){console.log(id,':: not in published component_sets');continue;}
console.log(id,'|',e.name);
console.log(' containing_frame:',JSON.stringify(e.containing_frame));
console.log(' updated_at:',e.updated_at);
}
})();"

Now it's clear, and the two endpoints actively disagree:

```
1479:32615  published name: "<FormGroup> | <RadioGroup>"   ← stale
            live name:      "<FormControl> | <RadioGroup>"
            updated_at:     2026-09-10   ← 8 days old
```

So there are two different truths, and neither is complete:

- **`/nodes`** = live file content, but _includes orphaned deleted-but-published components_ → can't prove a component is live
- **`/components`, `/component_sets`** = last _published_ library snapshot → names, properties and existence all go stale until republish

That also explains my earlier confusion when the survey showed old names after you'd renamed things. Let me make the validator surface this divergence instead of hiding it.

Created []()

Read [](), lines 28 to 59

Replacing 29 lines with 59 lines in []()

```

```

Created 3 todos

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/check-figma-node-ids.js

Significant finding: the new FormGroup set is **UNPUBLISHED** — live in the file but absent from the published library. Let me document all of this.

Read [](), lines 196 to 232

Replacing 10 lines with 29 lines in []()

```

```

Replacing 5 lines with 8 lines in []()

```

```

Updated memory file []()

The Figma explanation checks out, and it had a real consequence for us: our validator was reporting false confidence.

**Confirmed by testing:**

- `6558:39344` still returns full data via REST _and_ MCP after deletion — neither flags it. Its coordinates moved to `x=-3463` (was `x=153`), the orphan signature.
- The published endpoints are **8 days stale** — still reporting `<FormGroup> | <RadioGroup>` for a component you renamed to `<FormControl> | <RadioGroup>`.

That second point also explains my earlier confusion when a survey suggested your changes hadn't landed. They had; I was reading the wrong endpoint.

**Validator upgraded** — `check-figma-node-ids.js` now cross-checks both sources and reports `OK` / `STALE` / `UNPUBLISHED` / `NAME-DRIFT`, with a footer stating plainly that `OK` means "the id resolves", not "the component exists".

**It immediately caught something:**

```
UNPUBLISHED 2483:185674  FormGroup.figma.tsx  "<FormGroup> | <Checkbox>"
```

**The Figma library hasn't been republished** since your changes. That matters twice over: the new FormGroup set isn't in the library yet, and republishing is also what finally purges the orphaned `<RadioGroup>`. So republishing the library resolves both at once — worth doing before I publish the Code Connect mapping, so we're validating against the real state.

I also hit a bash trap worth knowing: history expansion silently rewrote `!e` into `exit $status_switch` inside a double-quoted inline script. Noted — that class of bug produces baffling errors.

Runbook now has a **Two sources of truth** section with the comparison table, the orphan behaviour, and a note that tree-walk orphan detection isn't viable (deeper than `depth=5`, already 3.4 MB there).

Completed: _Update documentation on orphaned components_ (1/3)

Made changes.

User: I went on a bit of a tangent and fixed a load of bugs with the library. there should no longer be any oprhaned components including the radio group. I published all lirbary changes

GitHub Copilot: Updated todo list

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/check-figma-node-ids.js

All 10 clean, `UNPUBLISHED` cleared — the library republish worked. Let me confirm the orphan is actually gone, since that was the open question.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/figma-node-props.js 6558:39344 1479:32615 642:108242 2483:185674

`6558:39344` still resolves — and note it now returns **no children**, where the other three sets all list their `State=…` variants. An empty component set is itself an orphan signature. Let me check whether it's still in the published library.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const K='3ZH2uUGxYtIItgBpwjz4NC';
(async()=>{
const cs=await fetch('https://api.figma.com/v1/files/'+K+'/component_sets',{headers:{'X-Figma-Token':token}}).then(r=>r.json());
const list=(cs.meta&&cs.meta.component_sets)||[];
console.log('published sets total:',list.length);
console.log('--- radio related ---');
list.filter(s=>/radio/i.test(s.name)).forEach(s=>{
console.log(' ',s.node_id,'|',s.name,'| page:',s.containing_frame&&s.containing_frame.pageName,'| updated:',s.updated_at);
});
const orphan=list.find(x=>x.node_id==='6558:39344');
console.log('6558:39344 still in published library?', orphan === undefined ? 'NO' : 'YES');
})();"

Orphan confirmed gone from the library, and the published snapshot is now current:

- `6558:39344` — **no longer in the published library** ✅
- `1479:32615` now publishes as `<FormControl> | <RadioGroup>`, `updated_at` today ✅

One refinement worth capturing: `/nodes` _still_ returns `6558:39344` as a shell — name and property definitions but zero children. So a purged component can leave a husk in the file API indefinitely. Our validator handles this correctly already: it's absent from the published library, so it would be flagged `UNPUBLISHED` rather than `OK`.

Replacing 7 lines with 8 lines in []()

```

```

Updated memory file []()

Verified clean:

```
10 mappings, 0 needing attention
```

All three group components are consistent (`<FormLabel>` / `<FormHelperText>` booleans, plural slot, `State` [Enabled/Disabled/Error]), and the published library now matches the file — `1479:32615` publishes as `<FormControl> | <RadioGroup>` with today's timestamp.

**One thing to confirm was intentional:** the standalone `<RadioGroup>` set was removed outright rather than having its leftover `Radios [3]` variant cleaned up. The library now offers `<Radio>`, `<FormControlLabel> | Radio`, and `<FormControl> | <RadioGroup>`. That's coherent, but it means there's no component for a bare `RadioGroup` with no label or helper text — a real MUI usage. Fine if deliberate; flagging in case it was collateral from the bug-fixing pass.

**Ready to publish Code Connect.** `FormGroup.figma.tsx` is repointed to `2483:185674` and parses; nothing needs excluding now, so it's a plain `npx figma connect publish -c figma.config.json`.

The open question from before still stands and can only be answered after publishing: the mapping matches children via `figma.children("<FormControlLabel> | Checkbox")`, and those now sit inside a `Checkboxes` SLOT. If slot traversal doesn't work, you'll see an empty `<FormGroup>` in Dev Mode and we'll match the slot layer instead.

Say the word and I'll publish.

Created 5 todos

Made changes.

User: I have relabelled the slot that contains the radios to a radiogroup given functionally that is what is happening. a designer wanting a group of radios would take the entire formcontrol and hide the form label and helper text.

GitHub Copilot: Updated todo list

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/figma-node-props.js 1479:32615

Confirmed — slot is now `<RadioGroup>`.

And your reasoning makes it _more_ MUI-correct than the convention I suggested. In MUI, `RadioGroup` is a genuine wrapper element sitting between the label and the options:

```tsx
<FormControl disabled error>
  <FormLabel>…</FormLabel>
  <RadioGroup>
    {" "}
    {/* ← the slot */}
    <FormControlLabel control={<Radio />} label="…" />
  </RadioGroup>
  <FormHelperText>…</FormHelperText>
</FormControl>
```

So the slot maps to a real element, whereas `Radios` mapped to nothing. Better rule than mine: **name the slot after the MUI element it becomes**, not the plural of what it contains.

**That has a consequence for our FormGroup mapping, and I'd rather raise it before publishing.**

Your model — hide the label and helper text to get a bare group — means those two booleans are _meaningful design states_, not decoration. Our mapping currently ignores them and always emits both:

```tsx
<FormControl component="fieldset" disabled={disabled} error={error}>
  <FormLabel component="legend" …>{formLabel.value}</FormLabel>   {/* always */}
  <FormGroup>{checkboxes}</FormGroup>
  <FormHelperText …>{formHelperText.value}</FormHelperText>       {/* always */}
</FormControl>
```

Under your model that's wrong for a legitimate state: a designer hides the label, and the generated code still includes it.

The fix has a trade-off. To drive presence I'd map the booleans to the connected children:

```tsx
formLabel: figma.boolean("<FormLabel>", {
  true: figma.children("<FormLabel>"),
  false: undefined,
}),
```

That gets presence _and_ text right, but the snippet loses `component="legend"`, because the emitted element comes from FormLabel's own mapping. So it's **correct presence, slightly weaker fieldset/legend semantics** versus **always-present, correct legend**. I'd take correct presence — a snippet containing an element the design doesn't have is the worse error, and `component="legend"` is an optional a11y refinement a developer can add.

Your call. Once you pick, I'll publish and we can check both unknowns in Dev Mode in one pass — the boolean behaviour and whether `figma.children` reaches into the slot.

**Also worth considering while you're in there:** the same logic suggests the checkbox and switch components have the wrong shape. `<FormGroup> | <Checkbox>` makes the component itself the `FormGroup`, with a `Checkboxes` slot of children. The radio one is now `FormControl` wrapping a `<RadioGroup>` slot. Making them parallel would give:

- `<FormControl> | <Checkbox>` with a `<FormGroup>` slot
- `<FormControl> | <Switch>` with a `<FormGroup>` slot

which matches MUI exactly, since `FormGroup` is the real wrapper element for checkboxes and switches — the precise counterpart of `RadioGroup`. All three would then share one structure and one mapping pattern. More churn though, and it'd move node ids again, so entirely reasonable to leave.

Replacing 8 lines with 32 lines in []()

```

```

Updated memory file []()

Updated memory file []()

Slot rename verified as `<RadioGroup>`, and the runbook now records your rule — name a slot after the MUI element it becomes — since it's a better principle than the plural-name convention I'd proposed.

The one thing I'd like your decision on before publishing: whether to make the FormGroup mapping honour the `<FormLabel>` / `<FormHelperText>` booleans. Your "hide them to get a bare group" model turns those into real states, and our mapping currently ignores them. My recommendation is to map presence via `figma.boolean` → `figma.children`, accepting the loss of `component="legend"`.

Also noted, non-urgently: the checkbox and switch components could be restructured to mirror the radio one (`<FormControl> | <Checkbox>` with a `<FormGroup>` slot), which would match MUI exactly and let all three share a single mapping pattern.

Created 3 todos

Made changes.

User: hiding the form label or helper text triggers the existing boolean properties on the <FormControl> | <RadioGroup> component. is that what you mean?

GitHub Copilot: Updated todo list

Yes, exactly that. Those two boolean properties are the mechanism — I'm talking about the code side of them.

Right now our mapping never reads them. So if a designer switches `<FormLabel>` off, Dev Mode still generates:

```tsx
<FormLabel component="legend">…</FormLabel>
```

for a design that doesn't have a label. The same two booleans exist on the checkbox set we're about to publish, so it has the same gap. Let me wire them up.

Replacing 9 lines with 4 lines in []()

```

```

Replacing 22 lines with 22 lines in []()

```

```

Checked [](), no problems found

Created 3 todos

Ran terminal command: cd /c/repositories/next.js-test && npx figma connect parse -c figma.config.json > cc-parse.tmp.json 2>/dev/null; echo "PARSE_EXIT=$?"; node -e "const d=require('./cc-parse.tmp.json');const a=d.find(x=>x.component==='FormGroup');const t=a.template;console.log(JSON.stringify(t.slice(t.indexOf('const figma'))));"; rm -f cc-parse.tmp.json

Parses clean. Generated template:

```tsx
<FormControl component="fieldset" disabled error>
  {formLabel}
  <FormGroup>{checkboxes}</FormGroup>
  {formHelperText}
</FormControl>
```

Both label and helper text now appear only when their Figma boolean is on.

Replacing 1 lines with 1 lines in []()

```

```

Yes — those exact boolean properties. The gap was purely on our side: the mapping wasn't reading them, so the snippet ignored the toggle.

`FormGroup.figma.tsx` now wires them up:

```tsx
formLabel: figma.boolean("<FormLabel>", {
  true: figma.children("<FormLabel>"),
  false: undefined,
}),
```

Type-clean and parses. As flagged, `component="legend"` is gone from the label, since the element now comes from `FormLabel`'s own mapping — correct presence traded for an optional a11y refinement.

Three things resolve in one Dev Mode check once published:

1. whether `figma.children` reaches into the `Checkboxes` SLOT
2. whether the label boolean correctly shows/hides
3. whether the nested `<FormLabel>` child renders via its own mapping

Ready to publish on your word — plain `figma.config.json`, nothing excluded.

Completed: _Update FormGroup mapping for label visibility_ (1/3)

Made changes.

User: do it

GitHub Copilot: Updated todo list

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && npx figma connect publish -c figma.config.json > cc-pub.tmp.log 2>&1; echo "EXIT=$?"; tail -n 14 cc-pub.tmp.log; rm -f cc-pub.tmp.log

Published — exit 0, all 10 mappings including `FormGroup` at `2483:185674`.

Replacing 2 lines with 3 lines in []()

```

```

All 10 mappings published successfully.

**Please check `<FormGroup> | <Checkbox>` (`2483:185674`) in Dev Mode** — three untested behaviours resolve there, and only there:

1. **Slot traversal** — do the `<FormControlLabel> | Checkbox` instances appear inside `<FormGroup>`? They sit in a `Checkboxes` SLOT, and whether `figma.children` reaches into a slot is the main unknown. An empty `<FormGroup></FormGroup>` means no.
2. **Label/helper booleans** — toggle `<FormLabel>` off; the `<FormLabel>` element should vanish from the snippet.
3. **Nested child rendering** — the label should render via FormLabel's own mapping rather than as raw text.

If the slot doesn't traverse, the fix is to match the slot layer (`figma.children("Checkboxes")`) instead of the instance names — one edit and a republish.

Worth spot-checking `Autocomplete` too, since its `multiple` toggle has never been seen in Dev Mode.

Runbook and tracker are current, so this is a clean place to pause. When you pick it up again, `TextField` is the next target — it's what `Autocomplete` actually renders, and it unblocks `Select`.

Created 5 todos

Made changes.

User: it says code connect si not published?

GitHub Copilot: Updated todo list

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx"
}

That message is correct — you've got `<FormControl> | <RadioGroup>` selected (instance `2501:187838`), and we've never mapped that component. Our ten mappings are Button, ButtonGroup, Checkbox, Chip, FormControlLabel, FormGroup, FormHelperText, FormLabel, UnfoldMoreOutlined, Autocomplete. The radio one isn't among them.

**Select `<FormGroup> | <Checkbox>` instead** — either the set `2483:185674` or any instance of it. That's the one we just published and where the slot-traversal question gets answered.

Useful signal in what you've selected though: its slot contains `<FormControlLabel> | Radio` instances, exactly mirroring the checkbox structure. So if slot traversal works for FormGroup, the radio component is close to a copy — same `State` enum, same two booleans, same slot pattern, just `RadioGroup` inside `FormControl` instead of `FormGroup`. Worth adding once we've confirmed the pattern holds.

User: I have selected the component. check

GitHub Copilot: Updated todo list

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx"
}

Right component. Let me check whether Figma sees the mapping.

Ran `get_code_connect_map`
Completed with input: {
"nodeId": "2483:185674"
}

It returns data now — so the tool does work; my earlier `{}` results were caused by passing `codeConnectLabel`, not by the tool being broken.

Ran terminal command: cd /c/repositories/next.js-test && node -e "
const p='C:/Users/sallen/AppData/Roaming/Code/User/workspaceStorage/86e2b569403d5b70ab4bb2b1830c7dc0/GitHub.copilot-chat/chat-session-resources/a3ee0579-a35d-4a22-87cb-3551283c19de/toolu_01UFabQu9cXpYRw1EkkmUCkQ\_\_vscode-1789723130770/content.json';
const d=JSON.parse(require('fs').readFileSync(p,'utf8'));
const keys=Object.keys(d);
console.log('entries:',keys.length);
for(const k of keys){
const v=d[k];
console.log(k,'->',v.codeConnectName,'|',(v.codeConnectSrc||'').split('/').pop());
}
"

Ran terminal command: cd /c/repositories/next.js-test && node -e "
const p='C:/Users/sallen/AppData/Roaming/Code/User/workspaceStorage/86e2b569403d5b70ab4bb2b1830c7dc0/GitHub.copilot-chat/chat-session-resources/a3ee0579-a35d-4a22-87cb-3551283c19de/toolu_01UFabQu9cXpYRw1EkkmUCkQ\_\_vscode-1789723130770/content.json';
const d=JSON.parse(require('fs').readFileSync(p,'utf8'));
console.log('--- sample entry 6543:43148 ---');
console.log(JSON.stringify(d['6543:43148'],null,2).slice(0,1200));
console.log('--- set itself present? ---', Object.prototype.hasOwnProperty.call(d,'2483:185674'));
"

Mapping is working. Here's the generated snippet for `State=Enabled`:

```tsx
<FormControl component="fieldset">
  <FormLabel>Form Label</FormLabel>
  <FormGroup>
    <FormControlLabel
      control={<Checkbox size="medium" color="primary" />}
      labelPlacement="end"
      label="Form Label"
    />
    …×3
  </FormGroup>
  <FormHelperText>Helper text</FormHelperText>
</FormControl>
```

**`figma.children` does traverse into a SLOT** — that was the main unknown, and it resolves cleanly. Nested components render through their own mappings too (FormControlLabel wrapping Checkbox, FormLabel, FormHelperText). Let me confirm the State variants.

Ran terminal command: cd /c/repositories/next.js-test && node -e "
const p='C:/Users/sallen/AppData/Roaming/Code/User/workspaceStorage/86e2b569403d5b70ab4bb2b1830c7dc0/GitHub.copilot-chat/chat-session-resources/a3ee0579-a35d-4a22-87cb-3551283c19de/toolu_01UFabQu9cXpYRw1EkkmUCkQ\_\_vscode-1789723130770/content.json';
const d=JSON.parse(require('fs').readFileSync(p,'utf8'));
for(const [id,label] of [['2483:185675','State=Disabled'],['2483:185722','State=Error']]){
const e=d[id];
console.log('=== '+label+' ('+id+') ===');
console.log(e && e.snippet ? e.snippet.split('\n')[0] : '(no snippet)');
console.log('');
}
"

All three states correct: Enabled → no props, Disabled → `disabled`, Error → `error`.

Let me correct the record — I'd wrongly written off `get_code_connect_map` as unreliable.

Read [](), lines 310 to 330

Read [](), lines 330 to 348

Replacing 10 lines with 21 lines in []()

```

```

Created 3 todos

Replacing 3 lines with 4 lines in []()

```

```

Updated memory file []()

FormGroup is published and working. Verified snippets:

| Variant          | Generated                                     |
| ---------------- | --------------------------------------------- |
| `State=Enabled`  | `<FormControl component="fieldset">`          |
| `State=Disabled` | `<FormControl component="fieldset" disabled>` |
| `State=Error`    | `<FormControl component="fieldset" error>`    |

with three `<FormControlLabel control={<Checkbox …/>} label="Form Label"/>` inside `<FormGroup>`, plus `FormLabel` and `FormHelperText`.

**Both open questions closed:**

- `figma.children()` **does** traverse into a SLOT — no need to match the slot layer
- Nested connected components render through their own mappings, several levels deep

**And a correction to something I told you earlier.** I'd claimed `get_code_connect_map` was unreliable because it returned `{}` for published components. It wasn't the tool — I was passing `codeConnectLabel: "MUI React"`. Omit that argument and it returns the full generated snippet for every node. That's a much better verification method than reading Dev Mode manually, and it's now the documented approach. The failure mode is nasty: it returns `{}` rather than an error, which is indistinguishable from "nothing published".

Still unverified: the `<FormLabel>`/`<FormHelperText>` booleans, since all three variants have both switched on. If you toggle one off on an instance, I can confirm the element disappears from the snippet.

Otherwise `<FormControl> | <RadioGroup>` is now nearly a copy-paste — same `State` enum, same booleans, same slot pattern, just `RadioGroup` in place of `FormGroup`. Happy to do that next.

Starting: _Update Verification Checklist and runbook_ (3/3)

Made changes.

User: I have selected an instance of the checkbox. this version is interesting because it has some padding overrides to give the appearence of checkboxes nesting underneath a parent. I wonder how that would be communicated to an engineer or AI.

GitHub Copilot: Updated todo list

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx"
}

Good test case — note `<FormHelperText>` is `hidden="true"` on this instance, which is exactly the boolean state we hadn't verified. Let me pull the generated snippet.

Ran `get_code_connect_map`
Completed with input: {
"nodeId": "1495:11133"
}

Perfect test case — it answers the open question _and_ illustrates the limit you're asking about. Generated snippet:

```tsx
<FormControl component="fieldset">
  <FormLabel>Form Label</FormLabel>
  <FormGroup>
    <FormControlLabel control={<Checkbox indeterminate />} label="Parent" />
    <FormControlLabel control={<Checkbox defaultChecked />} label="Child 1" />
    <FormControlLabel control={<Checkbox />} label="Child 2" />
  </FormGroup>
</FormControl>
```

**The helper text boolean works** — it's hidden on this instance and correctly absent from the snippet. Last open question closed.

**The nesting is entirely lost.** Three flat siblings. Nothing conveys that Child 1 and Child 2 sit under Parent.

This instance is a neat illustration of the rule, because it carries _two_ overrides with opposite outcomes:

| Override           | Communicated? | Why                                                  |
| ------------------ | ------------- | ---------------------------------------------------- |
| Helper text hidden | ✅ Yes        | Bound to the `<FormHelperText>` **boolean property** |
| Indent padding     | ❌ No         | A raw **instance override**, not a property          |

**Code Connect reads component properties, never instance overrides.** Padding, spacing, position, size, and free-form layout tweaks are invisible to it. If a design intent matters to engineers, it has to be promoted into a property or into structure.

### What survives, and why it's not enough

`indeterminate` did come through, which is genuinely meaningful — in MUI it's _the_ idiom for a parent whose children are partially selected. A sharp engineer or AI might infer the pattern from that alone. But inference isn't specification: the snippet doesn't say which children belong to the parent, and MUI's documented version of this pattern needs an explicit indent (`sx={{ ml: 3 }}` on a nested group), which nobody would guess from a flat list.

### Three ways to communicate it, best first

**1. Make the nesting structural in Figma.** Put the children inside a nested `<FormGroup>` instance within the slot, rather than indenting them with padding. Then `figma.children()` produces a genuinely nested group, and the indent gets mapped once on the nested FormGroup mapping — matching MUI's DOM exactly:

```tsx
<FormGroup>
  <FormControlLabel control={<Checkbox indeterminate />} label="Parent" />
  <FormGroup sx={{ ml: 3 }}>
    <FormControlLabel control={<Checkbox defaultChecked />} label="Child 1" />
    <FormControlLabel control={<Checkbox />} label="Child 2" />
  </FormGroup>
</FormGroup>
```

This is the only option where the design file and the React tree have the same shape, so it stays correct as the design evolves.

**2. Add a `Nested` boolean property** to the component and map it to the indent. Cheaper, but it only works for one fixed nesting depth and encodes a layout constant in the mapping.

**3. Make it a separate component** — a distinct "nested checkbox group" with its own mapping. Appropriate if it's a recurring pattern worth standardising; overkill if it's a one-off.

I'd go with option 1. Option 2 is a reasonable stopgap. What I'd avoid is leaving it as a padding override, because it silently produces wrong code — and silently is the problem, since the snippet looks perfectly plausible.

Recording the principle, since it'll recur:

Replacing 2 lines with 1 lines in []()

```

```

Created 2 todos

Read [](), lines 86 to 106

Replacing 12 lines with 33 lines in []()

```

```

Replacing 1 lines with 2 lines in []()

```

```

Updated memory file []()

That instance answered both things at once.

**Verified working:** the `<FormHelperText>` boolean correctly removes the element — the last untested behaviour in the FormGroup mapping. Labels came through as real content ("Parent", "Child 1", "Child 2"), and `indeterminate` / `defaultChecked` were captured per checkbox.

**The nesting is silently lost**, and the contrast within this one instance is the clearest possible statement of the rule: the hidden helper text reached the snippet because it's bound to a _property_; the indent didn't because it's an _override_. Code Connect reads properties, never overrides.

My recommendation is to make the nesting structural — a real nested `<FormGroup>` instance inside the slot rather than padding. That's the only option where the Figma tree and the React tree have the same shape, so it can't drift, and it matches MUI's own documented indeterminate-checkbox pattern. A `Nested` boolean would work as a stopgap but bakes a layout constant into the mapping and only handles one depth.

Both the principle and this worked example are now in the runbook under **Properties Are Communicated, Overrides Are Not**.

Worth saying plainly: this is a general limit, not a checkbox quirk. Any design intent expressed through spacing, position or size — anywhere in the library — will vanish the same way, and the snippet will still look convincing. Might be worth a broader sweep for other patterns that rely on overrides to carry meaning.

Updated todo list

Made changes.

User: the only way to fool proof this in figma would be to create a checkbox family sub-component. I wonder if a better trick is to apply a caveat to the code connect file to look out for nested checkbox families or whatever wording makes sense. one day we might formalise the solution but for now just a gentle reminder for any AI lookingat the code without interrogating the visual

GitHub Copilot: Updated todo list

Good instinct — and the mechanism already exists. We verified that anything which isn't a mapped prop gets baked into the template verbatim, so a JSX comment should ride along into the snippet itself. That puts the warning in the exact place an AI is reading, rather than in a link it may never open.

Let me test whether comments survive the parser.

Replacing 7 lines with 15 lines in []()

```

```

Ran terminal command: cd /c/repositories/next.js-test && npx figma connect parse -c figma.config.json > cc-parse.tmp.json 2>/dev/null; echo "PARSE_EXIT=$?"; node -e "const d=require('./cc-parse.tmp.json');const a=d.find(x=>x.component==='FormGroup');const t=a.template;console.log(JSON.stringify(t.slice(t.indexOf('export default'))));"; rm -f cc-parse.tmp.json

Comment survives into the template verbatim. Publishing so it lands where it matters.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && npx figma connect publish -c figma.config.json > cc-pub.tmp.log 2>&1; echo "EXIT=$?"; grep -i "formgroup\|error\|fail" cc-pub.tmp.log | head -n 5; rm -f cc-pub.tmp.log

Ran `get_code_connect_map`
Completed with input: {
"nodeId": "1495:11133"
}

Live and confirmed in the published snippet:

```tsx
<FormControl component="fieldset">
  {/* Check the design: nested checkbox families are shown by indentation, which this snippet cannot express. */}
  <FormLabel>Form Label</FormLabel>
  <FormGroup>…</FormGroup>
</FormControl>
```

Documenting it as a reusable technique, with its cost stated honestly:

Replacing 7 lines with 29 lines in []()

```

```

Created 2 todos

Replacing 1 lines with 2 lines in []()

```

```

Updated memory file []()

Done and published. The caveat is live in the snippet.

I prefixed it **`Check the design:`** deliberately — when you do formalise the solution, `grep "Check the design:"` finds every interim caveat across all mappings, so none get forgotten. Worth keeping that convention. Also added a `links` entry to MUI's indeterminate checkbox docs, which is where the nested pattern is actually specified.

**One cost to be aware of:** the comment lives in the template, so it appears on _every_ instance of `<FormGroup> | <Checkbox>` — including the plain three-checkbox variants where there's no nesting at all. That's the trade-off for a static template. It argues for keeping caveats few and broadly-worded rather than adding one per edge case; too many and readers stop seeing them.

It's also worth being clear-eyed that this is a mitigation, not a fix. The snippet remains wrong for nested designs — it just now admits it. The structural fix (a nested `<FormGroup>` instance instead of padding) is still the thing that makes the output actually correct, and this buys time until then.

The technique and its guidelines are in the runbook under **Interim measure: caveat comments in the snippet**.

Completed: _Update Verification Checklist and runbook_ (1/3)

Made changes.

User: right, should we take this from the top and go back to the autocomplete and validate before moving onto the next component? I'm going in order of how MUI lists them

GitHub Copilot: Updated todo list

Good plan — validate before moving on, and MUI's own order is a sensible spine. Let me check Autocomplete.

Ran `get_code_connect_map`
Completed with input: {
"nodeId": "6570:49856"
}

Autocomplete validates cleanly across all four variants:

| Variant                    | Snippet                                       |
| -------------------------- | --------------------------------------------- |
| Multiple=False, Open=False | `<Autocomplete options={…} renderInput={…}/>` |
| Multiple=False, Open=True  | same                                          |
| Multiple=True, Open=False  | `<Autocomplete multiple …/>`                  |
| Multiple=True, Open=True   | `<Autocomplete multiple …/>`                  |

`multiple` toggles correctly, and `Open` deliberately produces no difference. Working as designed.

**But the FormGroup lesson applies here too.** We hardcoded `label="Option"`, while the design carries a real `Label` text property on its nested `<Select>`. That's the same class of gap we just fixed — a real Figma property the mapping ignores, so the snippet stops matching the design the moment a designer changes the label. Let me check what's actually available.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/figma-node-props.js 6570:41424 6570:49856

Now I can see what's available. The nested `<Select>` exposes real properties we're ignoring:

```
Label   -> TEXT
Variant -> VARIANT [Standard, Filled, Outlined]
Size    -> VARIANT [Medium, Small]
State   -> VARIANT [Enabled, Focused, Disabled, Error, Hovered]
```

`figma.nestedProps` is proven to work — it's how `FormControlLabel` produced `label="Parent"`. The untested part is whether a mapped prop can be referenced _inside_ the `renderInput` arrow function. Let me find out.

Replacing 14 lines with 55 lines in []()

```

```

Ran terminal command: cd /c/repositories/next.js-test && npx figma connect parse -c figma.config.json > cc-parse.tmp.json 2>cc-parse.tmp.err; echo "PARSE_EXIT=$?"; grep -i "error\|autocomplete" cc-parse.tmp.err | head -n 10; node -e "const d=require('./cc-parse.tmp.json');const a=d.find(x=>x.component==='Autocomplete');const t=a.template;console.log(JSON.stringify(t.slice(t.indexOf('export default'))));" 2>/dev/null; rm -f cc-parse.tmp.json cc-parse.tmp.err

Mapped props **do** work inside a render-prop arrow function — the parser resolved `select.label` through the nested arrow. That's a capability we'd assumed was off-limits.

Checked [](), no problems found

Created 3 todos

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && npx figma connect publish -c figma.config.json > cc-pub.tmp.log 2>&1; echo "EXIT=$?"; grep -i "autocomplete\|fail\|error" cc-pub.tmp.log | head -n 5; rm -f cc-pub.tmp.log

Ran `get_code_connect_map`
Completed with input: {
"nodeId": "6570:49860"
}

Live and correct:

```tsx
<Autocomplete
  multiple
  options={["Option 1", "Option 2", "Option 3"]}
  renderInput={(params) => <TextField {...params} label="Option" />}
/>
```

`label` now comes from the design's `Label` property rather than being hardcoded. `variant`, `size`, `disabled` and `error` are all correctly omitted because the design sits on MUI's defaults — they'll appear when a designer moves off them.

Read [](), lines 148 to 160

Read [](), lines 160 to 168

Replacing 11 lines with 32 lines in []()

```

```

Updated memory file []()

Updated memory file []()

Autocomplete validated, and validating it found a real gap worth fixing.

**Validation:** all four variants correct — `multiple` toggles, `Open` correctly produces no difference.

**Gap found:** we'd hardcoded `label="Option"` while the design carries a real `Label` text property on its nested `<Select>`. Same bug class as FormGroup — a genuine Figma property the mapping ignored, so the snippet would silently stop matching the moment a designer changed the label.

**Fixed and published.** `label`, `variant`, `size`, `disabled` and `error` now come from the nested `<Select>` via `figma.nestedProps`. MUI defaults (Outlined, Medium, Enabled) map to `undefined`, so today's snippet is unchanged — they surface only when a design moves off the default.

**A constraint I'd assumed turned out to be false.** I'd flagged `renderInput` as the biggest risk, on the theory that mapped props couldn't live inside a render-prop arrow function. They can — `renderInput={(params) => <TextField {...params} label={select.label} />}` resolves fine, including property access on a `nestedProps` object. That directly unblocks TextField and Select, which have the same shape, so the earlier worry about needing a `.figma.template.js` fallback was unfounded.

**Worklist added** to the tracker in MUI's order. Inputs 1–4 are done; next unmapped is **Floating Action Button**, then **Radio Group** — and Radio Group is near copy-paste from FormGroup now that `<FormControl> | <RadioGroup>` is structurally identical.

Select is the one to approach carefully: `Variant × Size × State × Active × Has Value` across 70-plus variants, and `Active`/`Has Value` have no MUI equivalent.

Updated todo list

Made changes.

User: so what will happen when we code connect the select component? is that not going to be automatically ingested into the autocomplete code sugggestion?

GitHub Copilot: Updated todo list

Good question, and the answer is no — by design. It hinges on which API we used.

- **`figma.children()`** renders the connected child's snippet nested inside the parent.
- **`figma.nestedProps()`** reads values off the child instance and renders _nothing_.

Our Autocomplete mapping uses `nestedProps("<Select>", …)`, so connecting Select won't leak a `<Select>` element into Autocomplete's snippet. It'll keep emitting `renderInput={(params) => <TextField {...params} …/>}`.

We already have proof of both behaviours in a single existing snippet. `FormControlLabel` is connected and uses `nestedProps` for its FormLabel but `children` for its control:

```tsx
<FormControlLabel control={<Checkbox indeterminate />} label="Parent" />
```

`FormLabel` is connected, and has its own map entry — yet it appears here as the **string** `label="Parent"`, not as a nested `<FormLabel>` element. The Checkbox, mapped via children, _is_ nested. Same mapping, two APIs, two outcomes.

**One side effect worth knowing.** Connecting Select will give the nested `<Select>` _layer_ its own Dev Mode snippet. So a developer who drills into the input inside an Autocomplete and selects that layer would be shown `<Select>` code — which is wrong for that context, since MUI's Autocomplete has nothing to do with Select. Selecting the Autocomplete itself gives the right answer; it's only the drill-down that misleads.

That's inherent to the divergent composite, not something the mapping can prevent. You already see this today with the Chip and FormHelperText entries that appear inside Autocomplete's subtree.

Worth recording, since it's a natural thing to worry about again later:

Replacing 4 lines with 23 lines in []()

```

```

Updated memory file []()

Updated memory file []()

Short answer: **no, it won't be ingested** — because we used `nestedProps`, not `children`.

That distinction is the whole mechanism, and it's now documented as a table in the runbook:

| API                   | Effect on parent snippet                            |
| --------------------- | --------------------------------------------------- |
| `figma.children()`    | Renders the child's connected snippet nested inside |
| `figma.nestedProps()` | Reads values only — renders nothing                 |

Autocomplete harvests the `<Select>` layer for `label`, `variant`, `size` and `state`, and emits `<TextField>` itself. Connecting Select adds a mapping for the Select component; it changes nothing about Autocomplete's output.

The `FormControlLabel` snippet already proves this empirically — `FormLabel` is connected, yet appears as `label="Parent"` because it was harvested with `nestedProps`, while the Checkbox is nested because it used `children`.

**The one thing to watch** is the drill-down case: once Select is connected, selecting the `<Select>` layer _inside_ an Autocomplete will show Select code, which is wrong for that context. The mapping can't prevent it — it follows from the design file reusing a component MUI doesn't use. Selecting the Autocomplete itself is always correct. Worth mentioning to engineers as a "select the outer component" habit.

Created 3 todos

Made changes.

User: right, so the Code Connect output is pinned to the component currently selected. but how is that going to shake out if an engineer selects an entire frame or design comprising a layout with many components and sub components? How does the AI and engineer know when to ignore the child layer?

GitHub Copilot: Updated todo list

Let me test rather than assert — I've been wrong once already this session by reasoning ahead of evidence.

Ran `get_design_context`
Completed with input: {
"artifactType": "COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN",
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"excludeScreenshot": true,
"nodeId": "1495:11133",
"taskType": "CREATE_ARTIFACT"
}

That's a significant result, and not what I expected. `get_design_context` on `1495:11133` — a node we've **confirmed is mapped** — returned raw div/Tailwind soup, expanded all the way down through FormControlLabel, Checkbox and FormLabel. No substitution at all.

Let me check Figma's own documentation before drawing conclusions.

Fetched 2 resources

Important finding, and it changes the practical answer.

**`get_design_context` ignored our mapping entirely.** I called it on `1495:11133` — a node we've confirmed is mapped and verified — and got full Tailwind expansion down through FormControlLabel, Checkbox and FormLabel. That's the strongest possible case for substitution, and it didn't happen.

Figma's docs say the MCP server "boosts output quality by reusing your actual components" via Code Connect, so there's a gap between documented and observed behaviour here. Two testable explanations:

1. **Our label is non-default.** `figma.config.json` uses `"label": "MUI React"` instead of `React`. We already know label handling is finicky — passing `codeConnectLabel` to `get_code_connect_map` returns `{}`. Substitution may only look for the default label.
2. **Desktop vs remote server.** We're on the desktop Dev Mode server; Figma's docs say the remote server has "the broadest set of features".

### So how does the AI know when to stop descending?

Right now, it doesn't — not automatically. It has to do the join itself, and the pieces are there:

- `get_design_context` emits `data-node-id="…"` on **every** element
- `get_code_connect_map` returns **every mapped node in the subtree**, keyed by node id

So the algorithm for a whole-frame selection is:

1. Call `get_code_connect_map` on the frame → set of mapped node ids
2. Walk the `get_design_context` tree top-down
3. At the **first** node whose id is in the map, emit that snippet and **stop descending**
4. Only fall back to layout/Tailwind interpretation for nodes with no mapped ancestor

The rule is **highest mapped ancestor wins**. In your nested-checkbox example that means emitting the `FormGroup` snippet and discarding all 40-odd lines of divs beneath it — which is exactly the "ignore the child layer" judgement you're asking about.

One wrinkle: the id formats differ between the two tools. `get_design_context` uses instance paths like `I1495:11133;6543:43150`, while the map returns plain ids. The join needs the last path segment, and I haven't verified that holds in all cases.

### Practical implication

For a large frame this is where things go wrong quietly. Without the map, an AI sees plausible-looking Tailwind and reconstructs a bespoke checkbox group from divs — visually close, structurally wrong, no MUI components. That's precisely why your `copilot-instructions.md` says to treat Figma output as wireframe: today that instruction is doing real work, because the tooling isn't substituting for us.

Testing hypothesis 1 is cheap and worth doing — republishing under the default `React` label would tell us in one pass whether we get automatic substitution. That would be a significant upgrade: it turns "AI must be disciplined" into "the tool just returns the right components".

Recording this, since it's the most consequential finding of the session:

Replacing 2 lines with 1 lines in []()

```

```

Replacing 1 lines with 32 lines in []()

```

```

Created 3 todos

Replacing 1 lines with 2 lines in []()

```

```

Updated memory file []()

Updated memory file []()

Your question exposed the biggest issue we've hit. Summary:

**`get_design_context` does not apply Code Connect.** Tested on a node with a verified published mapping — it returned 40+ lines of Tailwind divs, fully expanded through every child. No substitution.

**So nothing tells the AI when to stop descending.** It has to do the join manually: `get_code_connect_map` for the mapped node ids, `data-node-id` attributes in the design context to match against, then **highest mapped ancestor wins** — emit that snippet, discard everything beneath it.

**The failure mode is silent and gets worse with scale.** On a single component you'd notice. On a full page frame, an agent sees plausible Tailwind and builds a bespoke checkbox group from divs — visually close, structurally wrong, zero MUI. It never reports an error.

**Worth testing before building more mappings:** our `"label": "MUI React"` is non-default. We already know that exact string breaks `get_code_connect_map` when passed explicitly, so it's a credible cause here too. Republishing under the default `React` label is a cheap experiment, and if substitution starts working it changes the economics of this whole effort — the mappings would flow into frame-level codegen automatically instead of depending on agent discipline.

That's a bigger lever than connecting the next component, so I'd suggest testing it before continuing down the MUI list. Want me to try it?

Starting: _Update runbook with whole frame selection rules_ (3/4)

Made changes.

User: please

GitHub Copilot: Updated todo list

Proceeding. Note this publishes a **second** set of mappings under a different label — both will coexist until we clean up, so I'll unpublish whichever we don't keep.

Ran terminal command: cd /c/repositories/next.js-test && node -e "
const c=require('./figma.config.json');
c.codeConnect.label='React';
require('fs').writeFileSync('figma.config.react.tmp.json',JSON.stringify(c,null,2));
console.log('temp config label:',c.codeConnect.label);
" && set -a && . ./.env && set +a && npx figma connect publish -c figma.config.react.tmp.json > cc-pub.tmp.log 2>&1; echo "EXIT=$?"; grep -i "using label\|successfully\|fail\|error" cc-pub.tmp.log | head -n 4; rm -f cc-pub.tmp.log

Ran `get_design_context`
Completed with input: {
"artifactType": "COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN",
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"excludeScreenshot": true,
"nodeId": "1495:11133",
"taskType": "CREATE_ARTIFACT"
}

**Hypothesis 1 confirmed.** The label was the entire problem. With `"label": "React"`, `get_design_context` now returns:

```tsx
import { FormControl, FormGroup } from "@mui/material";

<CodeConnectSnippet data-node-id="1495:11133" data-snippet-language="React">
  <FormControl component="fieldset">
    {/* Check the design: nested checkbox families are shown by indentation… */}
    <FormLabel>Form Label</FormLabel>
    <FormGroup>
      <FormControlLabel control={<Checkbox indeterminate … />} label="Parent" />
      …
    </FormGroup>
  </FormControl>
</CodeConnectSnippet>
```

Zero Tailwind. Full substitution, caveat comment included. The tool even appends instructions telling the agent to strip the `CodeConnectSnippet` wrapper and to **find and use the real component in the codebase**.

Let me make it permanent and check the cleanup path.

Ran terminal command: cd /c/repositories/next.js-test && rm -f figma.config.react.tmp.json && node -e "
const fs=require('fs');
const c=JSON.parse(fs.readFileSync('figma.config.json','utf8'));
c.codeConnect.label='React';
fs.writeFileSync('figma.config.json',JSON.stringify(c,null,2)+'\n');
console.log(fs.readFileSync('figma.config.json','utf8'));
" && npx figma connect unpublish --help 2>&1 | head -n 20

Now let me correct the runbook — that section is now out of date, and the finding reverses.

Replacing 32 lines with 36 lines in []()

```

```

Replacing 6 lines with 11 lines in []()

```

```

Completed: _Update runbook with whole frame selection rules_ (3/5)

Updated memory file []()

That was the single highest-leverage fix of the session. The `"label": "MUI React"` value — which looked like harmless descriptive metadata — was silently disabling Code Connect substitution entirely.

**Before** (`MUI React`): 40+ lines of Tailwind divs, no MUI components.
**After** (`React`): real `FormControl` / `FormGroup` / `FormControlLabel` / `Checkbox`, no Tailwind, caveat comment intact, plus tool instructions telling the agent to use the actual codebase component.

`figma.config.json` now uses `React` permanently, and the runbook flags it under Required Setup as a must-not-change, because the failure is invisible in both directions — no error, just silently worse output.

This also answers your original question properly: **substitution stops at the outermost connected component**. An engineer selecting a whole frame now gets mapped components where they exist and layout markup only where they don't. The "when do I ignore the child layers" judgement is made by the tool, not left to agent discipline.

**One cleanup needs your say-so.** Both labels are currently published, so Dev Mode will show duplicate entries. Removing the old set means running `figma connect unpublish` with a temp config pinned to `MUI React`. It's destructive against the shared library, so I'd rather you confirm — though the risk is low, since the repo is the source of truth and a republish restores everything.

Worth telling the wider team too: anyone who compared Figma MCP output against the design system before today was seeing the degraded Tailwind version.

Completed: _Document findings on Code Connect behavior_ (1/5)

Made changes.

User: nobody is using code connect, but many are using the figma lirbary for figma designs.

GitHub Copilot: Updated todo list

That makes the cleanup risk-free — no Code Connect consumers to disrupt, and unpublishing a label doesn't touch the design library itself. Removing the stale duplicates.

Ran terminal command: cd /c/repositories/next.js-test && node -e "
const c=JSON.parse(require('fs').readFileSync('figma.config.json','utf8'));
c.codeConnect.label='MUI React';
require('fs').writeFileSync('figma.config.muireact.tmp.json',JSON.stringify(c,null,2));
console.log('temp unpublish label:',c.codeConnect.label);
" && set -a && . ./.env && set +a && npx figma connect unpublish -c figma.config.muireact.tmp.json > cc-unpub.tmp.log 2>&1; echo "EXIT=$?"; grep -i "using label\|unpublish\|success\|fail\|error" cc-unpub.tmp.log | head -n 6; rm -f cc-unpub.tmp.log figma.config.muireact.tmp.json

Ran `get_code_connect_map`
Completed with input: {
"nodeId": "1495:11133"
}

Clean — every entry now reads `"label":"React"`, no duplicates, all mappings intact. Final sweep:

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/check-figma-node-ids.js 2>&1 | tail -n 6; echo "--- parse ---"; npx figma connect parse -c figma.config.json > /dev/null 2>&1; echo "PARSE_EXIT=$?"; echo "--- temp files ---"; ls \*.tmp.json 2>/dev/null || echo "none"; echo "--- git ---"; git --no-pager status --short

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/check-figma-node-ids.js

Replacing 1 lines with 1 lines in []()

```

```

Cleanup done and verified:

- `MUI React` mappings unpublished — every entry now reads `"label":"React"`
- 10 mappings, 0 needing attention; parse exit 0
- No temp files left; `figma.config.json` is the only config change

Your point actually reframes the value of today's work. Since nobody's consuming Code Connect yet, the label bug cost nothing — but it would have been genuinely damaging to discover _after_ rollout, because the failure is invisible. Teams would have used the Figma MCP, received Tailwind reconstructions, and reasonably concluded Code Connect wasn't worth the effort. Finding it while the audience is zero is the best possible timing.

It also means the design-library work you did earlier is what's currently delivering value, and it's now positioned to pay off twice: those structural fixes (slots over count variants, `State` restored, `FormControl` naming) are exactly what makes the components mappable.

**State of things:** 10 mappings published and verified under the correct label, MUI-order worklist in the tracker, two helper scripts, and a runbook covering the traps we hit.

Next unmapped component in MUI order is **Floating Action Button**, then **Radio Group** — which is near copy-paste from FormGroup now that `<FormControl> | <RadioGroup>` shares the same shape.

Completed: _Add back divergent-composite side effect line_ (1/2)

Made changes.

User: so what happens if we use a container component that contains a slot and nest entire page designs within it. The container component should carry a code connect snippet (container fluid, maxwidth, etc.) and it will have lots of compoents inside it. unless you have a validated answer, we should test it by code connecting the container component and creating a basic design

GitHub Copilot: Updated todo list

I don't have a validated answer, and I'd rather not guess — this is the case where guessing is most expensive, because the failure would be silent content loss.

Let me check what's already in the library before you build anything.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const K='3ZH2uUGxYtIItgBpwjz4NC';
const rx=/container|grid|stack|box|layout|paper|card/i;
(async()=>{
const [cs,cc]=await Promise.all([
fetch('https://api.figma.com/v1/files/'+K+'/component_sets',{headers:{'X-Figma-Token':token}}).then(r=>r.json()),
fetch('https://api.figma.com/v1/files/'+K+'/components',{headers:{'X-Figma-Token':token}}).then(r=>r.json())
]);
console.log('--- SETS ---');
((cs.meta&&cs.meta.component_sets)||[]).filter(s=>rx.test(s.name)).forEach(s=>console.log(' ',s.node_id,'|',s.name));
console.log('--- STANDALONE COMPONENTS ---');
((cc.meta&&cc.meta.components)||[]).filter(c=>rx.test(c.name)&&c.component_set_id===undefined).forEach(c=>console.log(' ',c.node_id,'|',c.name));
})();"

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node -e "
const token=process.env.FIGMA_ACCESS_TOKEN;
const K='3ZH2uUGxYtIItgBpwjz4NC';
const rx=/^<(container|grid|stack|box|paper|card)/i;
(async()=>{
const [cs,cc]=await Promise.all([
fetch('https://api.figma.com/v1/files/'+K+'/component_sets',{headers:{'X-Figma-Token':token}}).then(r=>r.json()),
fetch('https://api.figma.com/v1/files/'+K+'/components',{headers:{'X-Figma-Token':token}}).then(r=>r.json())
]);
const sets=((cs.meta&&cs.meta.component_sets)||[]).filter(s=>rx.test(s.name));
const comps=((cc.meta&&cc.meta.components)||[]).filter(c=>rx.test(c.name)&&c.component_set_id===undefined);
console.log('SETS:', sets.length);
sets.forEach(s=>console.log(' ',s.node_id,'|',s.name));
console.log('STANDALONE:', comps.length);
comps.slice(0,15).forEach(c=>console.log(' ',c.node_id,'|',c.name));
})();"

There's already a `<Container>` at `2213:290`. Let me look at it.

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && node scripts/figma-node-props.js 2213:290

`<Container>` already exists (`2213:290`) with exactly the properties you described, mapping 1:1 to MUI:

```
Slot            -> SLOT
Max width       -> [xs, sm, md, lg, xl, false]
Fixed           -> [true, false]
Disable Gutters -> [true, false]
```

Let me do my half — map it with `figma.children("*")` so it forwards whatever is nested — then you build the test design.

Created []()

Ran terminal command: cd /c/repositories/next.js-test && npx figma connect parse -c figma.config.json > cc-parse.tmp.json 2>/dev/null; echo "PARSE_EXIT=$?"; node -e "const d=require('./cc-parse.tmp.json');const a=d.find(x=>x.component==='Container');const t=a.template;console.log(JSON.stringify(t.slice(t.indexOf('export default'))));"; rm -f cc-parse.tmp.json

Checked [](), no problems found

Ran terminal command: cd /c/repositories/next.js-test && set -a && . ./.env && set +a && npx figma connect publish -c figma.config.json > cc-pub.tmp.log 2>&1; echo "EXIT=$?"; grep -i "container\|fail\|error" cc-pub.tmp.log | head -n 4; rm -f cc-pub.tmp.log

Container is mapped and published with `children: figma.children("*")`.

**What I can already state as validated:** a connected parent that uses `figma.children()` _does_ render connected children nested — FormGroup proves it, with FormControlLabel and Checkbox appearing inside `<FormGroup>`.

**What is genuinely unknown, and why it matters:**

1. **Do unconnected children survive?** A real page contains components we haven't mapped, plus raw frames and text. If `figma.children("*")` only forwards _connected_ instances, a mapped container would silently swallow everything else — you'd get `<Container maxWidth="lg">` with a fraction of the page inside. That's the failure mode worth fearing, and it's the opposite of helpful.
2. **How deep does `"*"` reach?** If it matches only _direct_ children, then a realistic layout — Container → auto-layout frame → components — would forward the frame and lose the components inside it.
3. **Does my "substitution stops at the outermost connected component" claim actually hold?** That was inferred from a single-component test, and your question is precisely the case that could break it.

### Test design to build

An instance of `<Container>` (say `Max width=lg`, `Fixed=false`, `Disable Gutters=false`), and inside its `Slot`:

| #   | Put in                                                       | Tests                                                   |
| --- | ------------------------------------------------------------ | ------------------------------------------------------- |
| 1   | A `<Button>` instance, directly in the slot                  | Connected child at depth 1                              |
| 2   | A `<FormGroup> \| <Checkbox>` instance, directly in the slot | Connected composite — does it nest its own children too |
| 3   | A `<Switch>` or `<Paper>` instance (both unmapped)           | **Unconnected component — dropped or kept?**            |
| 4   | A plain text layer or rectangle                              | Raw non-component content                               |
| 5   | An auto-layout frame containing another `<Button>`           | **Depth — does `"*"` reach past one level?**            |

Items 3, 4 and 5 are the ones that matter; 1 and 2 are controls so we can tell a total failure from a partial one.

Once it's built, select the Container instance and I'll run `get_design_context` on it. That single call answers all three questions, and I'll record the result either way.

If children turn out not to be forwarded properly, there's a fallback: don't map containers at all, and let them render as layout while their contents get substituted individually. Worth knowing before anyone maps a page-level component.

Created 2 todos

Made changes.

User: built and selected. I actually put a switch inside a paper

GitHub Copilot: Updated todo list

Ran `get_metadata`
Completed with input: {
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx"
}

Even better than the spec — you've got an unconnected `<Paper>` wrapping an unconnected `<FormControlLabel> | Switch`, a raw text frame, and a `<Button>` nested one level deep in a frame. Let me run it.

Ran `get_design_context`
Completed with input: {
"artifactType": "WEB_PAGE_OR_APP_SCREEN",
"clientFrameworks": "react,nextjs,mui",
"clientLanguages": "typescript,tsx",
"excludeScreenshot": true,
"nodeId": "2503:181063",
"taskType": "CREATE_ARTIFACT"
}
