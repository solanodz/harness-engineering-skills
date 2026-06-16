import { chmod, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {
  copyTemplate,
  detectPackageManager,
  detectProject,
  exists,
  initScriptFromCommands,
  verificationCommands,
  writeText
} from './harness-utils.mjs';

export async function runCreateHarness(options = {}) {
  const target = path.resolve(options.target || process.cwd());
  const agentFile = options.agentFile || 'AGENTS.md';
  const force = Boolean(options.force);
  const project = await detectProject(target);
  project.packageManager = detectPackageManager(target, options.packageManager);
  const commands = options.commands
    ? String(options.commands).split(',').map((command) => command.trim()).filter(Boolean)
    : verificationCommands(project, options.packageManager);

  await mkdir(target, { recursive: true });

  const replacements = {
    AGENT_FILE_NAME: agentFile,
    PROJECT_PURPOSE: project.stack === 'generic'
      ? 'Project harness for reliable agent-assisted development.'
      : `Project harness for reliable agent-assisted development in a ${project.stack} codebase.`,
    VERIFICATION_COMMANDS: commands.map((command) => `- \`${command}\``).join('\n'),
    PRIMARY_VERIFICATION_COMMAND: './init.sh'
  };

  const results = [];
  results.push(await copyTemplate('agents.md', path.join(target, agentFile), replacements, { force }));
  results.push(await copyTemplate('feature-list.json', path.join(target, 'feature_list.json'), {}, { force }));
  results.push(await copyTemplate('progress.md', path.join(target, 'progress.md'), {}, { force }));
  results.push(await copyTemplate('session-handoff.md', path.join(target, 'session-handoff.md'), {}, { force }));

  const initPath = path.join(target, 'init.sh');
  if (force || !await exists(initPath)) {
    await writeText(initPath, initScriptFromCommands(commands));
    await chmod(initPath, 0o755);
    results.push({ path: initPath, status: 'written' });
  } else {
    results.push({ path: initPath, status: 'skipped', reason: 'exists' });
  }

  return { target, project, commands, results };
}

export function printCreateHarnessResult({ target, project, commands, results }) {
  console.log(`Created harness for ${target}`);
  console.log(`Detected stack: ${project.stack}`);
  console.log('Verification commands:');
  for (const command of commands) {
    console.log(`  - ${command}`);
  }
  console.log('');
  for (const result of results) {
    console.log(`${result.status.toUpperCase()} ${path.relative(target, result.path)}${result.reason ? ` (${result.reason})` : ''}`);
  }
}
