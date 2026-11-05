# Separate Code Connect setup test

This small React project publishes a second mapping for the Button node used by
the main project. Its own `figma.config.json` and `package.json` let it run as a
separate Code Connect project root. The main repository config excludes this
directory so normal publishes do not include the test mapping.

The test mapping uses the same Figma node as the main mapping but publishes
under the custom `RPM` label. The main mapping remains under `React`.

To publish the test mapping, run from this directory with `FIGMA_ACCESS_TOKEN`
set:

```powershell
..\node_modules\.bin\figma.cmd connect publish -c figma.config.json
```

To restore the main project's mappings, return to the repository root and run:

```powershell
npx figma connect publish -c figma.config.json
```
