import {
  c,
  printBanner,
  printBox,
  promptConfirm,
  promptMultiselect,
  promptSelect
} from './cli-ui.mjs';
import { formatSkillOption } from './skill-catalog.mjs';
import { IDE_IDS, IDE_TARGETS, listAvailableSkills, parseIdeList } from './install-skills.mjs';
import { resolveInstallDestinations } from './ide-targets.mjs';
import { listInstalledCatalogSkills } from './uninstall-skills.mjs';

export async function resolveUninstallOptions(args, { version } = {}) {
  const catalog = await listAvailableSkills();
  const nonInteractive = Boolean(
    args.yes
    || args.y
    || args.noInteractive
    || args.skills
    || process.env.CI
  );

  let ides = parseIdeList(args.ide ?? 'all');
  let project = Boolean(args.project);

  if (!nonInteractive) {
    printBanner(version);

    if (!args.ide && !args.dest) {
      const ideSelection = await promptMultiselect({
        message: 'Remove skills from which tools?',
        options: IDE_IDS.map((id) => ({
          value: id,
          label: IDE_TARGETS[id].label,
          hint: IDE_TARGETS[id].globalDir()
        })),
        initialValues: IDE_IDS
      });

      if (ideSelection.length === 0) {
        throw new Error('Select at least one IDE.');
      }
      ides.splice(0, ides.length, ...ideSelection);
    }

    if (!args.project && !args.global && !args.dest) {
      const scope = await promptSelect({
        message: 'Remove from all projects or this repo only?',
        options: [
          { value: 'global', label: 'All projects', hint: 'Global skills folders' },
          { value: 'project', label: 'This repo only', hint: '.cursor / .claude / .agents/skills' }
        ],
        initialIndex: 0
      });
      project = scope === 'project';
    }
  }

  const destinations = resolveInstallDestinations({
    ides,
    project,
    cwd: process.cwd(),
    dest: args.dest
  });

  const installedByDest = [];
  for (const destination of destinations) {
    const installed = await listInstalledCatalogSkills(destination.path, catalog);
    installedByDest.push({ ...destination, installed });
  }

  const unionInstalled = [...new Set(installedByDest.flatMap((item) => item.installed))].sort();
  const defaultSkills = args.skills
    ? String(args.skills).split(',').map((name) => name.trim()).filter(Boolean)
    : (unionInstalled.length > 0 ? unionInstalled : catalog);

  if (nonInteractive) {
    return {
      dest: args.dest,
      project,
      ides,
      skills: defaultSkills.join(','),
      interactive: false
    };
  }

  const skillOptions = catalog.map((name) => {
    const option = formatSkillOption(name);
    const isInstalled = unionInstalled.includes(name);
    return {
      value: name,
      label: `${option.label} ${c.dim(`(${name})`)}${isInstalled ? '' : c.dim(' · not found')}`,
      hint: option.hint
    };
  });

  const initialValues = defaultSkills.filter((name) => catalog.includes(name));
  const selectedSkills = await promptMultiselect({
    message: unionInstalled.length > 0
      ? 'Which harness skills should be removed?'
      : 'No harness skills found — remove anyway if present?',
    options: skillOptions,
    initialValues: initialValues.length > 0 ? initialValues : catalog
  });

  if (selectedSkills.length === 0) {
    throw new Error('Select at least one skill to remove.');
  }

  const confirmed = await promptConfirm({
    message: `Remove ${selectedSkills.length} skill(s) from ${destinations.length} target(s)?`,
    initial: false
  });

  if (!confirmed) {
    throw new Error('Uninstall cancelled.');
  }

  console.log('');

  return {
    dest: args.dest,
    project,
    ides,
    skills: selectedSkills.join(','),
    interactive: true
  };
}

export function printUninstallSuccess({ uninstalls, selected, scope }) {
  const totalRemoved = uninstalls.reduce(
    (sum, item) => sum + item.results.filter((result) => result.status === 'removed').length,
    0
  );

  printBox('Skills removed', [
    `${c.green('✓')} ${totalRemoved} removal(s) across ${uninstalls.length} target(s)`,
    `${c.green('✓')} Scope: ${scope === 'project' ? 'this repo' : 'all projects'}`,
    `${c.dim('Only harness-skills catalog entries were touched')}`
  ]);

  console.log('');
  for (const item of uninstalls) {
    console.log(`  ${c.bold(item.label)} ${c.dim(`(${item.dest})`)}`);
    if (item.installed.length === 0) {
      console.log(`    ${c.dim('No harness skills installed here')}`);
    }
    for (const result of item.results) {
      if (result.status === 'removed') {
        console.log(`    ${c.green('✓')} removed ${result.skill}`);
        continue;
      }
      console.log(`    ${c.yellow('○')} ${result.skill} ${c.dim(`(${result.reason})`)}`);
    }
    console.log('');
  }

  console.log(c.dim(`  Re-install anytime: npx harness-skills install`));
  console.log('');
}
