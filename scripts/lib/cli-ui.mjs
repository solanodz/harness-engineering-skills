import { stdin, stdout } from 'node:process';

const supportsColor = Boolean(process.env.FORCE_COLOR)
  || (stdout.isTTY && !process.env.NO_COLOR);

export const c = {
  bold: (text) => (supportsColor ? `\x1b[1m${text}\x1b[0m` : text),
  dim: (text) => (supportsColor ? `\x1b[2m${text}\x1b[0m` : text),
  cyan: (text) => (supportsColor ? `\x1b[36m${text}\x1b[0m` : text),
  green: (text) => (supportsColor ? `\x1b[32m${text}\x1b[0m` : text),
  yellow: (text) => (supportsColor ? `\x1b[33m${text}\x1b[0m` : text),
  magenta: (text) => (supportsColor ? `\x1b[35m${text}\x1b[0m` : text),
  blue: (text) => (supportsColor ? `\x1b[34m${text}\x1b[0m` : text),
  red: (text) => (supportsColor ? `\x1b[31m${text}\x1b[0m` : text)
};

export const BANNER = `
${c.cyan('    ╔══════════════════════════════════════════════════════════╗')}
${c.cyan('    ║')}  ${c.bold('⚡ Harness Engineering Skills')}                         ${c.cyan('║')}
${c.cyan('    ║')}  ${c.dim('Reliable agent loops · scope · verify · resume')}         ${c.cyan('║')}
${c.cyan('    ╚══════════════════════════════════════════════════════════╝')}

${c.dim('         ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐')}
${c.cyan('         │')} ${c.green('inst')} ${c.cyan('│ → │')} ${c.yellow('state')} ${c.cyan('│ → │')} ${c.magenta('scope')} ${c.cyan('│ → │')} ${c.blue('verify')} ${c.cyan('│ → │')} ${c.green('ship')} ${c.cyan('│')}
${c.dim('         └──────┘   └──────┘   └──────┘   └──────┘   └──────┘')}
`;

export function printBanner(version) {
  console.log(BANNER);
  if (version) {
    console.log(c.dim(`  v${version}\n`));
  }
}

export function printBox(title, lines = []) {
  const width = 58;
  console.log(c.cyan(`  ┌${'─'.repeat(width)}┐`));
  console.log(`${c.cyan('  │')} ${c.bold(title.padEnd(width - 1))}${c.cyan('│')}`);
  console.log(c.cyan(`  ├${'─'.repeat(width)}┤`));
  for (const line of lines) {
    const plain = stripAnsi(line);
    const padding = Math.max(0, width - plain.length - 1);
    console.log(`${c.cyan('  │')} ${line}${' '.repeat(padding)}${c.cyan('│')}`);
  }
  console.log(c.cyan(`  └${'─'.repeat(width)}┘`));
}

function stripAnsi(text) {
  return String(text).replace(/\x1b\[[0-9;]*m/g, '');
}

function checkbox(checked) {
  return checked ? c.green('◉') : c.dim('○');
}

function renderMultiselect(message, options, selected, cursor) {
  stdout.write('\x1b[?25l');
  const lines = [
    '',
    c.bold(`  ${message}`),
    c.dim('  ↑/↓ move · space toggle · a all · n none · enter confirm'),
    ''
  ];

  options.forEach((option, index) => {
    const active = index === cursor;
    const prefix = active ? c.cyan('❯') : ' ';
    const name = active ? c.bold(option.label) : option.label;
    const hint = option.hint ? c.dim(` — ${option.hint}`) : '';
    lines.push(`  ${prefix} ${checkbox(selected.has(option.value))} ${name}${hint}`);
  });

  lines.push('');
  stdout.write(lines.join('\n') + '\x1b[0J');
}

function renderSelect(message, options, cursor) {
  stdout.write('\x1b[?25l');
  const lines = [
    '',
    c.bold(`  ${message}`),
    c.dim('  ↑/↓ move · enter confirm'),
    ''
  ];

  options.forEach((option, index) => {
    const active = index === cursor;
    const prefix = active ? c.cyan('❯') : ' ';
    const name = active ? c.bold(option.label) : option.label;
    const hint = option.hint ? c.dim(` (${option.hint})`) : '';
    lines.push(`  ${prefix} ${name}${hint}`);
  });

  lines.push('');
  stdout.write(lines.join('\n') + '\x1b[0J');
}

function cleanupRawMode(onData) {
  stdin.off('data', onData);
  if (stdin.isTTY) {
    stdin.setRawMode(false);
  }
  stdin.pause();
  stdout.write('\x1b[?25h');
}

export function isInteractive() {
  return Boolean(stdin.isTTY && stdout.isTTY && !process.env.CI);
}

export async function promptMultiselect({
  message,
  options,
  initialValues = options.map((option) => option.value)
}) {
  if (!isInteractive()) {
    return initialValues;
  }

  const selected = new Set(initialValues);
  let cursor = 0;

  return new Promise((resolve, reject) => {
    const onData = (key) => {
      if (key === '\u0003') {
        cleanupRawMode(onData);
        reject(new Error('Installation cancelled.'));
        return;
      }

      if (key === '\r' || key === '\n') {
        cleanupRawMode(onData);
        resolve([...selected]);
        return;
      }

      if (key === ' ') {
        const value = options[cursor].value;
        if (selected.has(value)) selected.delete(value);
        else selected.add(value);
      }

      if (key === 'a') {
        for (const option of options) selected.add(option.value);
      }

      if (key === 'n') {
        selected.clear();
      }

      if (key === '\u001b[A') {
        cursor = Math.max(0, cursor - 1);
      }

      if (key === '\u001b[B') {
        cursor = Math.min(options.length - 1, cursor + 1);
      }

      renderMultiselect(message, options, selected, cursor);
    };

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', onData);
    renderMultiselect(message, options, selected, cursor);
  });
}

export async function promptSelect({ message, options, initialIndex = 0 }) {
  if (!isInteractive()) {
    return options[initialIndex]?.value;
  }

  let cursor = initialIndex;

  return new Promise((resolve, reject) => {
    const onData = (key) => {
      if (key === '\u0003') {
        cleanupRawMode(onData);
        reject(new Error('Installation cancelled.'));
        return;
      }

      if (key === '\r' || key === '\n') {
        cleanupRawMode(onData);
        resolve(options[cursor].value);
        return;
      }

      if (key === '\u001b[A') {
        cursor = Math.max(0, cursor - 1);
      }

      if (key === '\u001b[B') {
        cursor = Math.min(options.length - 1, cursor + 1);
      }

      renderSelect(message, options, cursor);
    };

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', onData);
    renderSelect(message, options, cursor);
  });
}

export async function promptConfirm({ message, initial = true }) {
  if (!isInteractive()) {
    return initial;
  }

  const hint = initial ? '[Y/n]' : '[y/N]';
  stdout.write(`\n  ${c.bold(message)} ${c.dim(hint)} `);

  return new Promise((resolve, reject) => {
    const onData = (key) => {
      if (key === '\u0003') {
        cleanupRawMode(onData);
        reject(new Error('Installation cancelled.'));
        return;
      }

      if (key === '\r' || key === '\n') {
        cleanupRawMode(onData);
        stdout.write('\n');
        resolve(initial);
        return;
      }

      const lower = key.toLowerCase();
      if (lower === 'y') {
        cleanupRawMode(onData);
        stdout.write(`${c.green('yes')}\n`);
        resolve(true);
      }

      if (lower === 'n') {
        cleanupRawMode(onData);
        stdout.write(`${c.yellow('no')}\n`);
        resolve(false);
      }
    };

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', onData);
  });
}
