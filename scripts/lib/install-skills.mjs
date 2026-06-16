import { cp, readdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { SKILL_ROOT, exists } from './harness-utils.mjs';

export const SKILLS_SOURCE_DIR = path.join(SKILL_ROOT, 'skills');

export function defaultGlobalSkillsDir() {
  return path.join(os.homedir(), '.cursor', 'skills');
}

export function defaultProjectSkillsDir(cwd = process.cwd()) {
  return path.join(cwd, '.cursor', 'skills');
}

export async function listAvailableSkills() {
  const entries = await readdir(SKILLS_SOURCE_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export async function installSkills(options = {}) {
  const cwd = options.cwd || process.cwd();
  const project = Boolean(options.project);
  const dest = path.resolve(
    options.dest || (project ? defaultProjectSkillsDir(cwd) : defaultGlobalSkillsDir())
  );
  const force = Boolean(options.force);
  const requested = options.skills
    ? String(options.skills).split(',').map((name) => name.trim()).filter(Boolean)
    : null;

  const available = await listAvailableSkills();
  const selected = requested
    ? requested.map((name) => {
      if (!available.includes(name)) {
        throw new Error(`Unknown skill "${name}". Available: ${available.join(', ')}`);
      }
      return name;
    })
    : available;

  const results = [];
  for (const skillName of selected) {
    const source = path.join(SKILLS_SOURCE_DIR, skillName);
    const target = path.join(dest, skillName);
    if (!force && await exists(path.join(target, 'SKILL.md'))) {
      results.push({ skill: skillName, path: target, status: 'skipped', reason: 'exists' });
      continue;
    }
    await cp(source, target, { recursive: true, force });
    results.push({ skill: skillName, path: target, status: 'written' });
  }

  return { dest, selected, results, scope: project ? 'project' : 'global' };
}
