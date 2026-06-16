# AGENTS.md

This repository contains Harness Engineering skills for Cursor, Claude Code, Codex, and compatible agents.

## Purpose

Modular skills based on [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering/).

## Structure

- `skills/` — one skill per harness subsystem
- `templates/` — copy-ready harness templates
- `scripts/` — create-harness, validate-harness, CLI (`install`, `uninstall`, `create`, `validate`)
- `references/course/` — reference patterns from the original course

## Startup Workflow

Before writing code:

1. **Confirm working directory** with `pwd`
2. **Read this file** completely
3. **Read `progress.md`** and **`feature_list.json`** for current state
4. **Review recent commits** with `git log --oneline -5`
5. **Run `./init.sh`** to verify the environment is healthy

If baseline verification is failing, repair that first before adding new scope.

## Working Rules

- **One feature at a time**: Pick exactly one unfinished feature from `feature_list.json`
- **Verification required**: Don't claim done without running verification commands
- **Update artifacts**: Before ending session, update `progress.md` and `feature_list.json`
- **Stay in scope**: Don't modify files unrelated to the current feature
- **Leave clean state**: Next session must be able to run `./init.sh` immediately

## Required Artifacts

- `feature_list.json` — Feature state tracker (source of truth)
- `progress.md` — Session continuity log
- `init.sh` — Standard startup and verification path
- `session-handoff.md` — End-of-session handoff for larger sessions

## Definition of Done

A feature is done only when ALL of the following are true:

- [ ] Target behavior is implemented
- [ ] Required verification actually ran (CLI smoke, harness validate, npm pack)
- [ ] Evidence recorded in `feature_list.json` or `progress.md`
- [ ] Repository remains restartable from the standard startup path

## End of Session

Before ending a session:

1. Update `progress.md` with current state
2. Update `feature_list.json` with new feature status and evidence
3. Record any unresolved risks or blockers in `session-handoff.md`
4. Commit with a descriptive message once work is in a safe state
5. Leave the repo clean enough for the next session to run `./init.sh` immediately

## Verification

**Rule:** If `./init.sh` fails, do not start new features. Fix the baseline first.

Agents **cannot** mark a feature `done` until documented commands ran, passed, and evidence is recorded.

### Verification hierarchy

| Level | Command | What it checks |
|-------|---------|----------------|
| Lint | `./init.sh` (lint step) | SKILL.md files ≤ 500 lines |
| Smoke | `node scripts/cli.mjs help` | CLI loads |
| Smoke | `node scripts/cli.mjs list` | Skill catalog readable |
| Integration | `node scripts/cli.mjs install --dest /tmp/...` | Skills copy correctly |
| Integration | `node scripts/cli.mjs create --target /tmp/...` | Harness scaffold works |
| Validate | `node scripts/validate-harness.mjs --target . --min-score 70` | Five-subsystem score |
| Package | `npm pack --dry-run` | npm publish contents |
| Full | `./init.sh` | All of the above |

### Correction loop

```
Implement → Run ./init.sh → Pass?
  ├── Yes → Record evidence → Mark done
  └── No  → Read error → Fix → Re-run (do not declare done)
```

### Minimum evidence (feature_list.json)

```json
"evidence": [{
  "date": "2026-06-16",
  "commands": ["./init.sh"],
  "result": "pass",
  "output_summary": "validate 100/100, npm pack OK"
}]
```

## Skill Authoring Rules

- Keep each SKILL.md under 500 lines
- Write skill descriptions in third person with clear triggers
- **All content is written in English**
- Attribute to walkinglabs/learn-harness-engineering (MIT)

## Escalation

- **Architecture decisions**: Check README and existing skills; ask the user if unclear
- **Repeated test failures**: Update progress, flag for human review
- **Scope ambiguity**: Re-read `feature_list.json` for definition of done
