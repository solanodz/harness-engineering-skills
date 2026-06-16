import { readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { exists } from './harness-utils.mjs';
import {
  parseIdeList,
  resolveInstallDestinations
} from './ide-targets.mjs';
import { listAvailableSkills } from './install-skills.mjs';

export async function listInstalledCatalogSkills(dest, catalog) {
  if (!await exists(dest)) {
    return [];
  }

  const entries = await readdir(dest, { withFileTypes: true });
  const catalogSet = new Set(catalog);
  const installed = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || !catalogSet.has(entry.name)) {
      continue;
    }
    const skillFile = path.join(dest, entry.name, 'SKILL.md');
    if (await exists(skillFile)) {
      installed.push(entry.name);
    }
  }

  return installed.sort();
}

export async function uninstallSkills(options = {}) {
  const cwd = options.cwd || process.cwd();
  const project = Boolean(options.project);
  const ides = parseIdeList(options.ide ?? options.ides ?? 'all');
  const catalog = await listAvailableSkills();
  const destinations = resolveInstallDestinations({
    ides,
    project,
    cwd,
    dest: options.dest
  });

  const requested = options.skills
    ? String(options.skills).split(',').map((name) => name.trim()).filter(Boolean)
    : null;

  const selected = requested
    ? requested.map((name) => {
      if (!catalog.includes(name)) {
        throw new Error(`Unknown skill "${name}". Available: ${catalog.join(', ')}`);
      }
      return name;
    })
    : catalog;

  const uninstalls = [];

  for (const destination of destinations) {
    const dest = destination.path;
    const installed = await listInstalledCatalogSkills(dest, catalog);
    const results = [];

    for (const skillName of selected) {
      const target = path.join(dest, skillName);
      if (!installed.includes(skillName)) {
        results.push({ skill: skillName, path: target, status: 'skipped', reason: 'not installed' });
        continue;
      }
      await rm(target, { recursive: true, force: true });
      results.push({ skill: skillName, path: target, status: 'removed' });
    }

    uninstalls.push({
      ide: destination.ide,
      label: destination.label,
      dest,
      installed,
      results,
      scope: project ? 'project' : 'global'
    });
  }

  return {
    ides,
    uninstalls,
    scope: project ? 'project' : 'global',
    selected,
    dest: uninstalls[0]?.dest,
    results: uninstalls[0]?.results ?? []
  };
}
