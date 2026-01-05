# Automated Session Management

**Quick reference for the session start/end workflow.**

---

## 🎬 Session Start (Automatic on Folder Open)

When you open the VS Code workspace, you'll automatically see:

- **Current Phase & Status**
- **Last 5 Git Commits**
- **Git Branch & Uncommitted Changes**
- **Completed Tasks** (checkboxes from tracker)
- **Next 5 TODO Items**
- **Recommended Next Steps**
- **Quick Commands & Documentation Links**

**Manual Trigger:**

```bash
npm run session:start
```

Or run the VS Code task: **🎬 Session Start: ReX Migration Recap**

---

## 🏁 Session End (Manual - Run When Done Working)

When you're ready to wrap up your session:

```bash
npm run session:end
```

Or run the VS Code task: **🏁 Session End: Validate & Push**

### What It Does:

1. **Validates Code**

   - Runs `npm run lint` (ESLint)
   - Runs `npm run build-storybook` (Storybook build)
   - Stops if validation fails

2. **Checks for Changes**

   - Shows uncommitted files
   - If clean, exits early

3. **Prompts Documentation Update**

   - Reminds you to update:
     - `docs/rex-migration/README.md` (status, checkboxes, date)
     - `docs/rex-migration/NEXT_STEPS.md` (if priorities changed)
     - `docs/rex-migration/DECISIONS.md` (if you made decisions)
   - Waits for confirmation

4. **Stages All Changes**

   - `git add -A`

5. **Creates Commit**

   - Prompts for commit message
   - Auto-prefixes with `rex:` if not present
   - Example: `rex: document progress board screen`

6. **Pushes to Remotes**
   - Pushes to `origin` (if exists)
   - Pushes to `wiley` (if exists)
   - Shows success/failure for each

---

## Typical Session Workflow

### Starting Your Session

1. Open VS Code workspace
2. Read the automatic recap in terminal
3. Review uncommitted changes (if any)
4. Check "Next 5 TODO Items"
5. Start working!

### During Your Session

- Make changes to code/docs
- Run `npm run validate` periodically to catch errors
- Use `npm run storybook` to preview changes

### Ending Your Session

1. Run `npm run session:end`
2. Review validation output
3. Update documentation files:
   - [ ] Update "Last Updated" date in README.md
   - [ ] Check/uncheck completed tasks
   - [ ] Update "Current Status" if phase changed
   - [ ] Add any decisions to DECISIONS.md
   - [ ] Update NEXT_STEPS.md if priorities shifted
4. Confirm documentation is updated (y)
5. Enter descriptive commit message
6. Script handles the rest (stage, commit, push)

---

## Documentation Update Checklist

Before saying "yes" to the documentation prompt:

### `docs/rex-migration/README.md`

- [ ] Update **Last Updated** date (YYYY-MM-DD)
- [ ] Update **Phase** and **Next Session Focus** if changed
- [ ] Check boxes for completed tasks (`- [x]`)
- [ ] Uncheck boxes if you uncommitted work (`- [ ]`)
- [ ] Update file counts (e.g., "1 of 15 screens documented" → "3 of 15")

### `docs/rex-migration/NEXT_STEPS.md` (if needed)

- [ ] Update "Immediate Next Actions" if priorities changed
- [ ] Update "Questions to Decide" if questions were answered
- [ ] Update "Blockers & Dependencies" if new blockers appeared

### `docs/rex-migration/DECISIONS.md` (if needed)

- [ ] Add new decision entries for significant choices
- [ ] Format: Date, Context, Decision, Rationale, Impact

---

## Quick Commands

```bash
# Session management
npm run session:start    # Show recap (also runs on folder open)
npm run session:end      # Validate, doc check, commit, push

# Development
npm run storybook        # Start Storybook on :6006
npm run dev              # Start Next.js dev server
npm run validate         # Lint + Build (CI check)

# Git
git status --short       # Quick status
git log --oneline -5     # Recent commits
git diff                 # See changes
```

---

## VS Code Tasks

Access via:

- Command Palette: `Tasks: Run Task`
- Menu: **Terminal > Run Task...**

Available tasks:

- 🎬 Session Start: ReX Migration Recap
- 🏁 Session End: Validate & Push
- 🔄 Sync settings
- 🔌 Media SSH
- 🔄 Sync comics

---

## Troubleshooting

### Session Start doesn't run automatically

Check `.vscode/tasks.json` - the task should have:

```json
"runOptions": {
  "runOn": "folderOpen"
}
```

**Workaround:** Run manually with `npm run session:start`

### Validation fails during session end

1. Review errors in terminal
2. Fix the issues
3. Run `npm run validate` again to confirm
4. Re-run `npm run session:end`

### Push fails

Check:

- Network connection
- Remote repository access
- Branch protection rules
- Merge conflicts (pull first if needed)

**Manual fix:**

```bash
git pull --rebase origin main
git push origin main
```

---

## Customization

All scripts are in `.github/scripts/`:

- `session-start.sh` - Modify recap format/content
- `session-end.sh` - Adjust validation steps or prompts

Update `package.json` scripts if you change script locations.
