# Harness Engineering Skills

Skills for [Cursor](https://cursor.com) and other coding agents, based on the [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering/) course by Walking Labs.

A **harness** does not make the model smarter: it establishes a closed-loop workflow with instructions, state, verification, scope, and session lifecycle. These skills implement those five subsystems as invocable workflows.

## Installation

### Option 1 — npx (recommended)

Install skills into Cursor globally:

```bash
npx harness-engineering-skills install
```

Install skills for the current project only:

```bash
npx harness-engineering-skills install --project
```

Install from GitHub before the package is on npm:

```bash
npx github:solanodz/harness-engineering-skills install
```

### Option 2 — Manual copy

```bash
git clone https://github.com/solanodz/harness-engineering-skills.git
cp -r harness-engineering-skills/skills/* ~/.cursor/skills/
```

Or install only what you need:

```bash
cp -r harness-engineering-skills/skills/harness-scaffold ~/.cursor/skills/
```

## CLI

After publishing to npm (or via `npx github:...`), use the bundled CLI:

| Command | Purpose |
|---------|---------|
| `install` | Copy skills to `~/.cursor/skills` or `.cursor/skills` |
| `create` | Scaffold harness files in a target project |
| `validate` | Score a project harness (exit 1 if below threshold) |
| `report` | Write an HTML assessment report |
| `list` | List available skills in the package |

```bash
# Install all skills globally
npx harness-engineering-skills install

# Install selected skills into the current project
npx harness-engineering-skills install --project --skills harness-scaffold,harness-audit

# Create harness in the current directory
npx harness-engineering-skills create --target .

# Audit harness
npx harness-engineering-skills validate --target .

# HTML report
npx harness-engineering-skills report --target .
```

### Install flags

- `--global` — install to `~/.cursor/skills` (default)
- `--project` — install to `./.cursor/skills`
- `--dest DIR` — custom destination
- `--skills name,name` — install a subset (default: all)
- `--force` — overwrite existing skill directories

### Create flags

- `--target DIR` — project directory (default: current directory)
- `--agent-file AGENTS.md|CLAUDE.md`
- `--package-manager npm|pnpm|yarn|bun`
- `--commands "cmd one,cmd two"`
- `--force` — overwrite existing harness files

## Using skills in a project

```
1. npx harness-engineering-skills install
2. npx harness-engineering-skills create --target /path/to/project
3. In Cursor: "Use harness-scaffold — replace example features with real ones"
4. npx harness-engineering-skills validate --target /path/to/project
5. Improve weak subsystems with the matching skill (see learning path below)
```

## Included skills

| Skill | Subsystem | When to use |
|-------|-----------|-------------|
| [harness-scaffold](skills/harness-scaffold/) | All | Create a minimal harness in a new project |
| [harness-audit](skills/harness-audit/) | All | Audit and score an existing harness |
| [harness-instructions](skills/harness-instructions/) | Instructions | Write AGENTS.md with progressive disclosure |
| [harness-state](skills/harness-state/) | State | Persist progress across sessions |
| [harness-verification](skills/harness-verification/) | Verification | Prevent premature victory with real tests |
| [harness-scope](skills/harness-scope/) | Scope | Control scope with feature_list.json |
| [harness-lifecycle](skills/harness-lifecycle/) | Lifecycle | init.sh, handoff, and clean state on close |
| [harness-observability](skills/harness-observability/) | Observability | Make agent runtime visible for debugging |

## Learning path (course)

```
Phase 1: harness-scaffold + harness-audit     → See the problem (P01)
Phase 2: harness-instructions                 → Agent-legible repo (P02)
Phase 3: harness-state + harness-lifecycle    → Continuity across sessions (P03)
Phase 4: harness-scope + harness-verification → Feedback and scope (P04–P05)
Phase 5: harness-observability                → Full harness (P06)
```

## Templates

Copy-ready templates in `templates/`:

- `agents.md` — agent operating manual (copied as AGENTS.md or CLAUDE.md)
- `feature-list.json` — feature list with verification
- `init.sh` — install + verification at startup
- `progress.md` — session log
- `session-handoff.md` — handoff between sessions
- `clean-state-checklist.md` — end-of-session checklist
- `evaluator-rubric.md` — post-implementation review rubric

## Scripts

The CLI wraps these commands. You can also run them directly from a clone:

```bash
# Create minimal harness in a project
node scripts/create-harness.mjs --target /path/to/project

# Audit existing harness
node scripts/validate-harness.mjs --target /path/to/project

# HTML report
node scripts/render-assessment-html.mjs --target /path/to/project
```

## References

- [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering/)
- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

## License

MIT — adapted from [walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering).
