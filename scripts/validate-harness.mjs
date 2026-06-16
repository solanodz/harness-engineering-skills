#!/usr/bin/env node
import { printValidateHarnessResult, runValidateHarness } from './lib/run-validate-harness.mjs';
import { parseArgs } from './lib/harness-utils.mjs';

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`Usage: node scripts/validate-harness.mjs [--target DIR] [--json] [--html FILE]

Scores a project harness across five subsystems:
  instructions, state, verification, scope, lifecycle

Exit code is 0 when the harness scores at least --min-score (default 70).`);
  process.exit(0);
}

const result = await runValidateHarness({
  target: args.target || args._[0],
  minScore: args.minScore,
  html: args.html
});

printValidateHarnessResult(result, { json: Boolean(args.json) });
