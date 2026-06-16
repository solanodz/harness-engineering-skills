export const SKILL_CATALOG = {
  'harness-scaffold': {
    label: 'Scaffold',
    subsystem: 'Start here',
    hint: 'Set up a new project the agent can resume anytime'
  },
  'harness-audit': {
    label: 'Audit',
    subsystem: 'Start here',
    hint: 'See what is weak in your setup (score 0–100)'
  },
  'harness-instructions': {
    label: 'Instructions',
    subsystem: 'Clarity',
    hint: 'Short AGENTS.md so the agent knows the rules'
  },
  'harness-state': {
    label: 'State',
    subsystem: 'Memory',
    hint: 'Pick up where the last session left off'
  },
  'harness-verification': {
    label: 'Verification',
    subsystem: 'Trust',
    hint: 'No more “done” without running tests'
  },
  'harness-scope': {
    label: 'Scope',
    subsystem: 'Focus',
    hint: 'One feature at a time, less half-finished work'
  },
  'harness-lifecycle': {
    label: 'Lifecycle',
    subsystem: 'Sessions',
    hint: 'Clean start and handoff every session'
  },
  'harness-observability': {
    label: 'Observability',
    subsystem: 'Debug',
    hint: 'See what the agent actually did'
  },
  'harness-evaluator': {
    label: 'Evaluator',
    subsystem: 'Quality',
    hint: 'Independent review before accepting work'
  },
  'harness-diagnose': {
    label: 'Diagnose',
    subsystem: 'Debug',
    hint: 'Find which harness layer is breaking'
  },
  'harness-e2e': {
    label: 'E2E',
    subsystem: 'Trust',
    hint: 'Smoke and end-to-end checks unit tests miss'
  }
};

export function getSkillMeta(name) {
  return SKILL_CATALOG[name] || {
    label: name,
    subsystem: 'Skill',
    hint: 'Harness engineering skill'
  };
}

export function formatSkillOption(name) {
  const meta = getSkillMeta(name);
  return {
    value: name,
    label: meta.label,
    hint: meta.hint,
    subsystem: meta.subsystem
  };
}
