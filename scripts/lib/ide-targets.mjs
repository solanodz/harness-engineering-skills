import os from 'node:os';
import path from 'node:path';

export const IDE_IDS = ['cursor', 'claude', 'codex'];

export const IDE_TARGETS = {
  cursor: {
    id: 'cursor',
    label: 'Cursor',
    globalDir: () => path.join(os.homedir(), '.cursor', 'skills'),
    projectDir: (cwd = process.cwd()) => path.join(cwd, '.cursor', 'skills'),
    invokeHint: 'Say "Use harness-scaffold …" in Agent chat'
  },
  claude: {
    id: 'claude',
    label: 'Claude Code',
    globalDir: () => path.join(os.homedir(), '.claude', 'skills'),
    projectDir: (cwd = process.cwd()) => path.join(cwd, '.claude', 'skills'),
    invokeHint: 'Type /harness-scaffold or ask Claude to use harness-scaffold'
  },
  codex: {
    id: 'codex',
    label: 'Codex',
    globalDir: () => path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'skills'),
    projectDir: (cwd = process.cwd()) => path.join(cwd, '.agents', 'skills'),
    invokeHint: 'Ask Codex to use harness-scaffold or /use harness-scaffold'
  }
};

export function parseIdeList(value) {
  if (!value || value === 'all') {
    return [...IDE_IDS];
  }

  const requested = String(value)
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const invalid = requested.filter((id) => !IDE_IDS.includes(id));
  if (invalid.length > 0) {
    throw new Error(`Unknown IDE "${invalid.join(', ')}". Use: ${IDE_IDS.join(', ')}, or all.`);
  }

  return [...new Set(requested)];
}

export function resolveInstallDestinations({ ides, project, cwd = process.cwd(), dest }) {
  if (dest) {
    return [{
      ide: 'custom',
      label: 'Custom',
      path: path.resolve(dest),
      invokeHint: 'Ask your agent to use harness-… skills'
    }];
  }

  return ides.map((ide) => {
    const target = IDE_TARGETS[ide];
    return {
      ide,
      label: target.label,
      path: project ? target.projectDir(cwd) : target.globalDir(),
      invokeHint: target.invokeHint
    };
  });
}
