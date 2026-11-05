# Git remotes, branches, and Vercel hosting

Canonical rules for how this repository is mirrored and deployed. Follow these whenever committing, pushing, or cleaning up branches.

## Remotes

| Remote name | Repository | Role |
| --- | --- | --- |
| `origin` | [`sallen-wiley/next.js-test`](https://github.com/sallen-wiley/next.js-test) | **Primary** remote. Day-to-day development and Vercel Git integration. |
| `wiley` | [`wiley/pp-ux-tooling`](https://github.com/wiley/pp-ux-tooling) | Wiley organization publish mirror. Keep `main` aligned with primary. |
| `rarebush` | [`rarebush/ux-tooling`](https://github.com/rarebush/ux-tooling) | Backup mirror. Keep `main` aligned with primary. |

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
| `main` | **All three remotes** (`origin`, `wiley`, `rarebush`) | Primary shared line of development. |
| `preview` | **`origin` only** (`sallen-wiley/next.js-test`) | Hosted test environment on Vercel. Do not keep `preview` on `wiley` or `rarebush`. |

Do not leave long-lived feature branches on remotes after merge. Close and delete them.

## Hard sync rules (required)

1. **Primary `main` stays in sync across all three remotes.**  
   After any commit that lands on `main`, push `main` to `origin`, `wiley`, and `rarebush` so all three point at the same commit.
2. **`origin/preview` must never be behind `main`.**  
   `preview` is the hosted test branch. Whenever `main` moves forward, fast-forward `preview` to that commit and push it to `origin` only.
3. **Do not push `preview` to `wiley` or `rarebush`.**  
   Those remotes mirror `main` only.
4. **Prefer updating `main` first, then `preview`.**  
   Production and the org/backup mirrors follow `main`; the Vercel preview deployment follows `origin/preview`.

## Required push sequence after landing work on `main`

```bash
# 1) Push primary main to every remote
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

## Vercel hosting (primary remote)

Vercel builds from **`sallen-wiley/next.js-test` (`origin`)**:

| Git branch | Vercel role | Public hostname |
| --- | --- | --- |
| `main` | Production | [https://ux.wileytests.com](https://ux.wileytests.com) |
| `preview` | Preview | [https://ppux2025.vercel.app](https://ppux2025.vercel.app) |

Also associated: `ppux2025.vercel.app` is the project’s Vercel preview hostname; production custom domain is `ux.wileytests.com`.

Pushing to `wiley` or `rarebush` does **not** drive these Vercel deployments. Those remotes exist for org visibility and backup only.

## Agent / contributor checklist

Before ending a sync or publish task:

- [ ] Local working tree is clean (or intentional WIP is documented)
- [ ] `main` is pushed to `origin`, `wiley`, and `rarebush` at the same commit
- [ ] `origin/preview` matches `main` (not behind)
- [ ] `preview` is absent from `wiley` and `rarebush`
- [ ] Stale remote feature branches are closed/deleted
