export const SKILL_CATALOG = {
  'harness-scaffold': {
    label: 'Scaffold',
    subsystem: 'All',
    hint: 'Create a minimal harness in new projects'
  },
  'harness-audit': {
    label: 'Audit',
    subsystem: 'All',
    hint: 'Score an existing harness across five subsystems'
  },
  'harness-instructions': {
    label: 'Instructions',
    subsystem: 'Instructions',
    hint: 'Write AGENTS.md with progressive disclosure'
  },
  'harness-state': {
    label: 'State',
    subsystem: 'State',
    hint: 'Persist progress across agent sessions'
  },
  'harness-verification': {
    label: 'Verification',
    subsystem: 'Verification',
    hint: 'Require real tests before declaring done'
  },
  'harness-scope': {
    label: 'Scope',
    subsystem: 'Scope',
    hint: 'Control scope with feature_list.json'
  },
  'harness-lifecycle': {
    label: 'Lifecycle',
    subsystem: 'Lifecycle',
    hint: 'init.sh, handoff, and clean session close'
  },
  'harness-observability': {
    label: 'Observability',
    subsystem: 'Observability',
    hint: 'Make agent runtime visible for debugging'
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
