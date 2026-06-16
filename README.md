# Harness Engineering Skills

Skills for [Cursor](https://cursor.com) and other coding agents, based on the [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering/) course by Walking Labs.

A **harness** does not make the model smarter: it establishes a closed-loop workflow with instructions, state, verification, scope, and session lifecycle. These skills implement those five subsystems as invocable workflows.

## Installation

Copy the skills to your Cursor skills directory:

```bash
git clone https://github.com/solanodz/harness-engineering-skills.git
cp -r harness-engineering-skills/skills/* ~/.cursor/skills/
```

Or install only what you need:

```bash
cp -r harness-engineering-skills/skills/harness-scaffold ~/.cursor/skills/
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
