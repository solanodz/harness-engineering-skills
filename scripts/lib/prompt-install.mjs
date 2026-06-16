import {
  c,
  printBanner,
  printBox,
  promptConfirm,
  promptMultiselect,
  promptSelect
} from './cli-ui.mjs';
import { formatSkillOption } from './skill-catalog.mjs';
import { defaultGlobalSkillsDir, defaultProjectSkillsDir, listAvailableSkills } from './install-skills.mjs';

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
    return {
      dest: resolveDest(args),
      project: Boolean(args.project),
      skills: args.skills ? String(args.skills) : available.join(','),
      force: Boolean(args.force),
      interactive: false
    };
  }

  printBanner(version);

  let project = Boolean(args.project);
  if (!args.project && !args.global && !args.dest) {
    const scope = await promptSelect({
      message: 'Use skills in all projects, or only this repo?',
      options: [
        {
          value: 'global',
          label: 'All projects',
          hint: defaultGlobalSkillsDir()
        },
        {
          value: 'project',
          label: 'This repo only',
          hint: defaultProjectSkillsDir()
        }
      ],
      initialIndex: 0
    });
    project = scope === 'project';
  }

  const dest = resolveDest({ ...args, project });
  const selectedSkills = await promptMultiselect({
    message: 'Which skills do you want? (all selected by default)',
    options: skillOptions,
    initialValues: available
  });

  if (selectedSkills.length === 0) {
    throw new Error('Select at least one skill to install.');
  }

  const confirmed = await promptConfirm({
    message: `Install ${selectedSkills.length} skill(s) to ${dest}?`,
    initial: true
  });

  if (!confirmed) {
    throw new Error('Installation cancelled.');
  }

  console.log('');

  return {
    dest,
    project,
    skills: selectedSkills.join(','),
    force: Boolean(args.force),
    interactive: true
  };
}

function resolveDest(args) {
  if (args.dest) return args.dest;
  if (args.project) return defaultProjectSkillsDir();
  return defaultGlobalSkillsDir();
}

export function printInstallSuccess({ dest, selected, results, scope }) {
  const written = results.filter((result) => result.status === 'written');
  const skipped = results.filter((result) => result.status === 'skipped');

  printBox('Ready to use in Cursor', [
    `${c.green('✓')} ${written.length} skill(s) installed`,
    `${c.green('✓')} Location: ${c.cyan(dest)}`,
    `${c.dim('Agents can now follow harness workflows in your projects')}`
  ]);

  console.log('');
  for (const result of results) {
    if (result.status === 'written') {
      console.log(`  ${c.green('✓')} ${c.bold(result.skill)}`);
      continue;
    }
    console.log(`  ${c.yellow('○')} ${result.skill} ${c.dim(`(${result.reason})`)}`);
  }

  console.log('');
  console.log(c.bold('  Next — open a project in Cursor and say:'));
  console.log('');
  console.log(`  ${c.cyan('"Use harness-scaffold to set up this project"')}`);
  console.log(`  ${c.dim('"Use harness-audit and show me the score"')}`);
  console.log('');
}
