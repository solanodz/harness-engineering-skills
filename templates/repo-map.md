# Repo map

Keep this file under ~80 lines. Update it when folders or entry points change.

## What this repo is

[One sentence: product + stack.]

## Where to look

| If you need… | Open |
|--------------|------|
| App entry | `src/…` or `app/…` |
| CLI / scripts | `scripts/…` |
| Tests | `tests/…` or `*.test.ts` |
| Agent rules | `AGENTS.md` |
| Feature state | `feature_list.json`, `progress.md` |

## Do not touch (unless the feature says so)

- `node_modules/`, `dist/`, `build/`, `.next/`, vendor lockfiles

## How to load more

1. Read this map and `AGENTS.md` first.
2. Open only the folder named for the job.
3. Read module docs on demand — do not dump the whole tree into context.
