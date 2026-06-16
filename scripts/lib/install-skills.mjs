import { cp, readdir } from 'node:fs/promises';
import path from 'node:path';
import { SKILL_ROOT, exists } from './harness-utils.mjs';
import {
  IDE_IDS,
  IDE_TARGETS,
  parseIdeList,
  resolveInstallDestinations
} from './ide-targets.mjs';

export const SKILLS_SOURCE_DIR = path.join(SKILL_ROOT, 'skills');

export { IDE_IDS, IDE_TARGETS, parseIdeList };

export function defaultGlobalSkillsDir(ide = 'cursor') {
  return IDE_TARGETS[ide]?.globalDir() || IDE_TARGETS.cursor.globalDir();
}

export function defaultProjectSkillsDir(cwd = process.cwd(), ide = 'cursor') {
  return IDE_TARGETS[ide]?.projectDir(cwd) || IDE_TARGETS.cursor.projectDir(cwd);
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
  const force = Boolean(options.force);
  const ides = parseIdeList(options.ide ?? options.ides ?? 'all');
  const destinations = resolveInstallDestinations({
    ides,
    project,
    cwd,
    dest: options.dest
  });

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

  const installs = [];

  for (const destination of destinations) {
    const dest = destination.path;
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

    installs.push({
      ide: destination.ide,
      label: destination.label,
      dest,
      invokeHint: destination.invokeHint,
      selected,
      results,
      scope: project ? 'project' : 'global'
    });
  }

  return {
    ides,
    installs,
    scope: project ? 'project' : 'global',
    selected,
    // Backward-compatible fields for single-destination callers
    dest: installs[0]?.dest,
    results: installs[0]?.results ?? []
  };
}
