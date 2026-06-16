#!/usr/bin/env node
import { printCreateHarnessResult, runCreateHarness } from './lib/run-create-harness.mjs';
import { parseArgs } from './lib/harness-utils.mjs';

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`Usage: node scripts/create-harness.mjs [--target DIR] [--agent-file AGENTS.md|CLAUDE.md] [--package-manager npm|pnpm|yarn|bun] [--force]

Creates a minimal production harness:
  AGENTS.md or CLAUDE.md
  feature_list.json
  progress.md
  session-handoff.md
  init.sh

Existing files are skipped unless --force is set.`);
  process.exit(0);
}

const result = await runCreateHarness({
  target: args.target || args._[0],
  agentFile: args.agentFile,
  packageManager: args.packageManager,
  commands: args.commands,
  force: Boolean(args.force)
});

printCreateHarnessResult(result);
