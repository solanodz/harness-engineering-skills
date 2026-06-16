import {
  c,
  printBanner,
  printBox,
  promptConfirm,
  promptMultiselect,
  promptSelect
} from './cli-ui.mjs';
import { formatSkillOption } from './skill-catalog.mjs';
import {
  IDE_IDS,
  IDE_TARGETS,
  defaultGlobalSkillsDir,
  defaultProjectSkillsDir,
  listAvailableSkills,
  parseIdeList
} from './install-skills.mjs';
import { resolveInstallDestinations } from './ide-targets.mjs';

export async function resolveInstallOptions(args, { version } = {}) {
  const available = await listAvailableSkills();
  const skillOptions = available.map((name) => {
    const option = formatSkillOption(name);
    return {
      value: name,
      label: `${option.label} ${c.dim(`(${name})`)}`,
      hint: option.hint
    };
  });

  const nonInteractive = Boolean(
    args.yes
    || args.y
    || args.noInteractive
    || args.skills
    || process.env.CI
  );

  if (nonInteractive) {
    const ides = parseIdeList(args.ide ?? 'all');
    return {
      dest: args.dest,
      project: Boolean(args.project),
      ides,
      skills: args.skills ? String(args.skills) : available.join(','),
      force: Boolean(args.force),
      interactive: false
    };
  }

  printBanner(version);

  let ides = parseIdeList(args.ide ?? 'all');
  if (!args.ide && !args.dest) {
    const ideSelection = await promptMultiselect({
      message: 'Which tools should receive the skills?',
      options: IDE_IDS.map((id) => ({
        value: id,
        label: IDE_TARGETS[id].label,
        hint: IDE_TARGETS[id].globalDir()
      })),
      initialValues: IDE_IDS
    });

    if (ideSelection.length === 0) {
      throw new Error('Select at least one IDE (Cursor, Claude Code, or Codex).');
    }
    ides = ideSelection;
  }

  let project = Boolean(args.project);
  if (!args.project && !args.global && !args.dest) {
    const scope = await promptSelect({
      message: 'Use skills in all projects, or only this repo?',
      options: [
        {
          value: 'global',
          label: 'All projects',
          hint: 'Installs to each tool\'s global skills folder'
        },
        {
          value: 'project',
          label: 'This repo only',
          hint: 'Installs to .cursor, .claude, and .agents/skills here'
        }
      ],
      initialIndex: 0
    });
    project = scope === 'project';
  }

  const destinations = resolveInstallDestinations({ ides, project, dest: args.dest });
  const selectedSkills = await promptMultiselect({
    message: 'Which skills do you want? (all selected by default)',
    options: skillOptions,
    initialValues: available
  });

  if (selectedSkills.length === 0) {
    throw new Error('Select at least one skill to install.');
  }

  const destSummary = args.dest
    ? args.dest
    : destinations.map((item) => `${item.label}: ${item.path}`).join(' · ');

  const confirmed = await promptConfirm({
    message: `Install ${selectedSkills.length} skill(s) for ${destinations.length} target(s)?`,
    initial: true
  });

  if (!confirmed) {
    throw new Error('Installation cancelled.');
  }

  console.log('');
  console.log(c.dim(`  ${destSummary}`));
  console.log('');

  return {
    dest: args.dest,
    project,
    ides,
    skills: selectedSkills.join(','),
    force: Boolean(args.force),
    interactive: true
  };
}

export function printInstallSuccess({ installs, selected, scope }) {
  const totalWritten = installs.reduce(
    (sum, install) => sum + install.results.filter((result) => result.status === 'written').length,
    0
  );

  printBox('Ready to use in your IDE', [
    `${c.green('✓')} ${selected.length} skill(s) × ${installs.length} target(s)`,
    `${c.green('✓')} Scope: ${scope === 'project' ? 'this repo' : 'all projects'}`,
    `${c.dim('Agents can now follow harness workflows in your projects')}`
  ]);

  console.log('');
  for (const install of installs) {
    const written = install.results.filter((result) => result.status === 'written');
    const skipped = install.results.filter((result) => result.status === 'skipped');
    console.log(`  ${c.bold(install.label)} ${c.dim(`(${install.dest})`)}`);
    for (const result of install.results) {
      if (result.status === 'written') {
        console.log(`    ${c.green('✓')} ${result.skill}`);
        continue;
      }
      console.log(`    ${c.yellow('○')} ${result.skill} ${c.dim(`(${result.reason})`)}`);
    }
    if (written.length === 0 && skipped.length > 0) {
      console.log(`    ${c.dim('All skills already present')}`);
    }
    console.log('');
  }

  console.log(c.bold('  Next — open a project and invoke a skill:'));
  console.log('');
  for (const install of installs) {
    console.log(`  ${c.bold(install.label)}: ${c.dim(install.invokeHint)}`);
  }
  console.log('');
  console.log(`  ${c.cyan('"Use harness-scaffold to set up this project"')}`);
  console.log(`  ${c.dim('"Use harness-audit and show me the score"')}`);
  console.log('');
}
