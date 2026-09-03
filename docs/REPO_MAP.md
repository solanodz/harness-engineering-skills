# Repo map

## What this repo is

npm package `harness-skills`: agent skills + CLI for Cursor, Claude Code, and Codex.

## Where to look

| If you need… | Open |
|--------------|------|
| CLI entry | `scripts/cli.mjs` |
| Install / uninstall | `scripts/lib/install-skills.mjs`, `prompt-install.mjs`, `uninstall-skills.mjs` |
| IDE paths | `scripts/lib/ide-targets.mjs` |
| Skill catalog labels | `scripts/lib/skill-catalog.mjs` |
| Create / validate harness | `scripts/lib/run-create-harness.mjs`, `harness-utils.mjs` |
| Skill body | `skills/<name>/SKILL.md` |
| Copy-ready templates | `templates/` |
| Course patterns | `references/course/` |
| CI / publish | `.github/workflows/ci.yml`, `publish-npm.yml` |
| Agent rules | `AGENTS.md` |
| Feature state | `feature_list.json`, `progress.md` |

## Do not touch (unless the feature says so)

- Installed skill copies under `.cursor/`, `.claude/`, `.agents/`
- `node_modules/` (this package has none on purpose)

## How to load more

1. Read this map and `AGENTS.md` before a repo-wide search.
2. Open only the folder named for the job.
3. Skill details live in each `SKILL.md` — load on demand.
