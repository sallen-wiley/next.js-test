# Git remotes, branches, and Vercel hosting

Canonical rules for how this repository is mirrored and deployed. Follow these whenever committing, pushing, or cleaning up branches.

## Remotes

| Remote name | Repository | Role |
| --- | --- | --- |
| `origin` | [`sallen-wiley/next.js-test`](https://github.com/sallen-wiley/next.js-test) | **Working remote.** Day-to-day development, feature/working branches, `preview`, and Vercel Git integration. |
| `wiley` | [`wiley/pp-ux-tooling`](https://github.com/wiley/pp-ux-tooling) | **Official publication.** Org-facing `main` only — not a place for working branches. |
| `rarebush` | [`rarebush/ux-tooling`](https://github.com/rarebush/ux-tooling) | **Backup only.** Mirror of `main` — no other branches. |

Confirm remotes:

```bash
git remote -v
```

Expected mapping:

```text
origin    → git@github-wiley:sallen-wiley/next.js-test.git
wiley     → git@github-wiley:wiley/pp-ux-tooling.git
rarebush  → git@github.com:rarebush/ux-tooling.git
```

## Branches

| Branch | Where it exists | Purpose |
| --- | --- | --- |
| `main` | **All three remotes** (`origin`, `wiley`, `rarebush`) | Shared line of development / published line. |
| `preview` | **`origin` only** | Hosted test environment on Vercel. |
| Feature / working branches | **`origin` only** | All PR and WIP work. Never push these to `wiley` or `rarebush`. |

Do not leave long-lived feature branches on remotes after merge. Close and delete them **on `origin`**.

## Hard sync rules (required)

1. **Working branches live only on `origin` (sallen-wiley).**  
   Create, push, and open PRs against `origin`. Do not push feature branches to `wiley` or `rarebush`.
2. **`main` stays in sync across all three remotes.**  
   After any commit that lands on `main`, push `main` to `origin`, `wiley`, and `rarebush` so all three point at the same commit. `wiley` is the official published `main`; `rarebush` is backup `main` only.
3. **`origin/preview` must never be behind `main`.**  
   Whenever `main` moves forward, fast-forward `preview` to that commit and push it to `origin` only.
4. **Do not push `preview` (or any non-`main` branch) to `wiley` or `rarebush`.**  
   Those remotes carry `main` only.
5. **Prefer updating `main` first, then `preview`.**  
   Production and the org/backup mirrors follow `main`; the Vercel preview deployment follows `origin/preview`.

## Required push sequence after landing work on `main`

```bash
# 1) Push main to every remote
git push origin main
git push wiley main
git push rarebush main

# 2) Keep origin/preview current with main (never leave it behind)
git branch -f preview main
git push origin preview
```

Quick check that nothing is behind:

```bash
git fetch --all --prune
git rev-list --left-right --count main...origin/main
git rev-list --left-right --count main...wiley/main
git rev-list --left-right --count main...rarebush/main
git rev-list --left-right --count main...origin/preview
```

Healthy result for each command: `0	0` (or for `main...origin/preview`, `0	0` after preview has been fast-forwarded). If `main...origin/preview` shows commits only on the left (`N	0`), `preview` is behind — fast-forward and push immediately.

## Vercel hosting (working remote = `origin`)

Vercel builds from **`sallen-wiley/next.js-test` (`origin`)**:

| Git branch | Vercel role | Public hostname |
| --- | --- | --- |
| `main` | Production | [https://ux.wileytests.com](https://ux.wileytests.com) |
| `preview` | Preview | [https://ppux2025.vercel.app](https://ppux2025.vercel.app) |

Also associated: `ppux2025.vercel.app` is the project’s Vercel preview hostname; production custom domain is `ux.wileytests.com`.

Pushing to `wiley` or `rarebush` does **not** drive these Vercel deployments.

## Agent / contributor checklist

Before ending a sync or publish task:

- [ ] Local working tree is clean (or intentional WIP is documented)
- [ ] Feature/working branches exist only on `origin` (not on `wiley` or `rarebush`)
- [ ] `main` is pushed to `origin`, `wiley`, and `rarebush` at the same commit
- [ ] `origin/preview` matches `main` (not behind)
- [ ] `preview` is absent from `wiley` and `rarebush`
- [ ] Stale remote feature branches are closed/deleted on `origin`
