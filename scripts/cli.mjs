#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installSkills, listAvailableSkills } from './lib/install-skills.mjs';
import { printCreateHarnessResult, runCreateHarness } from './lib/run-create-harness.mjs';
import { printValidateHarnessResult, runValidateHarness } from './lib/run-validate-harness.mjs';
import { parseArgs } from './lib/harness-utils.mjs';
import { c, printBanner } from './lib/cli-ui.mjs';
import { getSkillMeta } from './lib/skill-catalog.mjs';
import { printInstallSuccess, resolveInstallOptions } from './lib/prompt-install.mjs';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE_VERSION = JSON.parse(readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8')).version;
const PACKAGE_NAME = JSON.parse(readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8')).name;

const HELP = `${PACKAGE_NAME} — CLI for Harness Engineering skills and project harnesses

Usage:
  harness-skills <command> [options]
  npx harness-skills <command> [options]

Commands:
  install    Copy skills into Cursor (~/.cursor/skills or project .cursor/skills)
  create     Scaffold harness files in a target project
  validate   Score an existing project harness (exit 1 if below --min-score)
  report     Write an HTML harness assessment report
  list       List available skills in this package
  help       Show this help

Install:
  harness-skills install [--global|--project] [--dest DIR]
                         [--skills name,name] [--force]
                         [--yes] [--no-interactive]

  --global           Install to ~/.cursor/skills (default)
  --project          Install to ./.cursor/skills in the current directory
  --dest DIR         Custom destination directory
  --skills           Comma-separated skill names (skips interactive picker)
  --force            Overwrite existing skill directories
  --yes, -y          Install all skills without prompts
  --no-interactive   Same as --yes (for CI)

Create:
  harness-skills create [--target DIR] [--agent-file AGENTS.md|CLAUDE.md]
                        [--package-manager npm|pnpm|yarn|bun]
                        [--commands "cmd one,cmd two"] [--force]

Validate:
  harness-skills validate [--target DIR] [--json] [--html FILE]
                          [--min-score 70]

Report:
  harness-skills report [--target DIR] [--output FILE]

Examples:
  npx harness-skills install
  npx harness-skills install --project
  npx harness-skills create --target .
  npx harness-skills validate --target .
  npx github:solanodz/harness-engineering-skills install

Legacy npm name (still works):
  npx harness-engineering-skills install
`;

async function runList() {
  printBanner(PACKAGE_VERSION);
  const skills = await listAvailableSkills();
  console.log(c.bold('  Available skills\n'));
  for (const skill of skills) {
    const meta = getSkillMeta(skill);
    console.log(`  ${c.cyan('◆')} ${c.bold(meta.label)} ${c.dim(`(${skill})`)}`);
    console.log(`    ${c.yellow(meta.subsystem)} ${c.dim('·')} ${meta.hint}`);
    console.log('');
  }
}

async function runInstall(args) {
  if (args.global && args.project) {
    throw new Error('Use either --global or --project, not both.');
  }

  const installOptions = await resolveInstallOptions(args, { version: PACKAGE_VERSION });
  const result = await installSkills({
    dest: installOptions.dest,
    project: installOptions.project,
    skills: installOptions.skills,
    force: installOptions.force,
    cwd: process.cwd()
  });
  printInstallSuccess(result);
}

async function runCreate(args) {
  const result = await runCreateHarness({
    target: args.target || args._[0],
    agentFile: args.agentFile,
    packageManager: args.packageManager,
    commands: args.commands,
    force: Boolean(args.force)
  });
  printCreateHarnessResult(result);
}

async function runValidate(args) {
  const result = await runValidateHarness({
    target: args.target || args._[0],
    minScore: args.minScore,
    html: args.html
  });
  printValidateHarnessResult(result, { json: Boolean(args.json) });
}

async function runReport(args) {
  const target = path.resolve(args.target || args._[0] || process.cwd());
  const output = path.resolve(args.output || path.join(target, 'harness-assessment.html'));
  const result = await runValidateHarness({ target, html: output });
  console.log(`HTML report written to ${output}`);
  console.log(`Overall: ${result.result.overall}/100`);
}

async function main() {
  const argv = process.argv.slice(2);
  const [commandRaw, ...rest] = argv;
  const command = commandRaw?.toLowerCase();
  const args = parseArgs(rest);

  if (args.help || args.version) {
    if (args.version) {
      console.log(PACKAGE_VERSION);
      return;
    }
    console.log(HELP);
    return;
  }

  if (!command || command === 'help') {
    console.log(HELP);
    return;
  }

  switch (command) {
    case 'install':
      await runInstall(args);
      break;
    case 'create':
      await runCreate(args);
      break;
    case 'validate':
      await runValidate(args);
      break;
    case 'report':
      await runReport(args);
      break;
    case 'list':
      await runList();
      break;
    default:
      console.error(`Unknown command: ${commandRaw}\n`);
      console.log(HELP);
      process.exitCode = 1;
  }
}

main().catch((error) => {
  if (error?.code === 'EEXIST') {
    console.error('Install failed: destination already exists. Re-run with --force to overwrite.');
  } else {
    console.error(error.message || error);
  }
  process.exitCode = 1;
});
