import path from 'node:path';
import {
  formatScoreReport,
  htmlReport,
  loadHarnessFiles,
  scoreHarness,
  writeText
} from './harness-utils.mjs';

export async function runValidateHarness(options = {}) {
  const target = path.resolve(options.target || process.cwd());
  const minScore = Number(options.minScore ?? 70);
  const files = await loadHarnessFiles(target);
  const result = scoreHarness(files);
  let htmlPath;

  if (options.html) {
    htmlPath = path.resolve(options.html);
    await writeText(htmlPath, htmlReport(result, `Harness Assessment: ${path.basename(target)}`));
  }

  return { target, result, minScore, htmlPath };
}

export function printValidateHarnessResult({ target, result, minScore, htmlPath }, { json = false } = {}) {
  if (htmlPath) {
    console.log(`HTML report written to ${htmlPath}`);
  }

  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatScoreReport(result, target));
  }

  if (result.overall < minScore) {
    process.exitCode = 1;
  }
}
