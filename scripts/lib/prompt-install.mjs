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
      message: 'Where should skills be installed?',
      options: [
        {
          value: 'global',
          label: 'Global',
          hint: defaultGlobalSkillsDir()
        },
        {
          value: 'project',
          label: 'Project',
          hint: defaultProjectSkillsDir()
        }
      ],
      initialIndex: 0
    });
    project = scope === 'project';
  }

  const dest = resolveDest({ ...args, project });
  const selectedSkills = await promptMultiselect({
    message: 'Select skills to install',
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

  printBox('Installation complete', [
    `${c.green('✓')} Destination: ${c.cyan(dest)}`,
    `${c.green('✓')} Scope: ${scope}`,
    `${c.green('✓')} Installed: ${written.length} · Skipped: ${skipped.length}`
  ]);

  console.log('');
  for (const result of results) {
    if (result.status === 'written') {
      console.log(`  ${c.green('✓')} ${c.bold(result.skill)} ${c.dim('→ installed')}`);
      continue;
    }
    console.log(`  ${c.yellow('○')} ${result.skill} ${c.dim(`(${result.reason})`)}`);
  }

  console.log('');
  console.log(c.bold('  Next step in Cursor:'));
  console.log(c.dim('  "Use harness-scaffold to set up this project"'));
  console.log('');
}
