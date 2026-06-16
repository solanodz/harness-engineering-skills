import { stdin, stdout } from 'node:process';

const INNER_WIDTH = 50;

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

function stripAnsi(text) {
  return String(text).replace(/\x1b\[[0-9;]*m/g, '');
}

function visibleLength(text) {
  const plain = stripAnsi(text);
  let length = 0;

  for (const char of plain) {
    const code = char.codePointAt(0) ?? 0;
    length += code > 0xFFFF || (code >= 0x1100 && code <= 0x115F) ? 2 : 1;
  }

  return length;
}

function padVisible(text, width) {
  const padding = Math.max(0, width - visibleLength(text));
  return text + ' '.repeat(padding);
}

function borderTop(width = INNER_WIDTH) {
  return c.cyan(`  ╔${'═'.repeat(width + 2)}╗`);
}

function borderBottom(width = INNER_WIDTH) {
  return c.cyan(`  ╚${'═'.repeat(width + 2)}╝`);
}

function borderDivider(width = INNER_WIDTH) {
  return c.cyan(`  ╟${'─'.repeat(width + 2)}╢`);
}

function boxRow(content = '', width = INNER_WIDTH) {
  return `${c.cyan('  ║ ')}${padVisible(content, width)}${c.cyan(' ║')}`;
}

const PIPELINE_STEPS = [
  { label: 'inst', color: c.green },
  { label: 'state', color: c.yellow },
  { label: 'scope', color: c.magenta },
  { label: 'verify', color: c.blue },
  { label: 'ship', color: c.green }
];

const PIPELINE_BOX_WIDTH = 7;
const PIPELINE_GAP_WIDTH = 5;

function centeredLabel(label, width) {
  const padding = Math.max(0, width - label.length);
  const left = Math.floor(padding / 2);
  return `${' '.repeat(left)}${label}${' '.repeat(padding - left)}`;
}

function pipelineBox(label, color) {
  const inner = centeredLabel(label, PIPELINE_BOX_WIDTH);
  const horizontal = '─'.repeat(PIPELINE_BOX_WIDTH + 2);
  return {
    top: c.dim(`┌${horizontal}┐`),
    mid: `${c.dim('│ ')}${color(inner)}${c.dim(' │')}`,
    bot: c.dim(`└${horizontal}┘`)
  };
}

function pipelineGap(arrow = false) {
  if (!arrow) {
    return ' '.repeat(PIPELINE_GAP_WIDTH);
  }

  const arrowText = '->';
  const padding = Math.max(0, PIPELINE_GAP_WIDTH - arrowText.length);
  const left = Math.floor(padding / 2);
  return c.dim(`${' '.repeat(left)}${arrowText}${' '.repeat(padding - left)}`);
}

function printPipeline() {
  const boxes = PIPELINE_STEPS.map(({ label, color }) => pipelineBox(label, color));

  let top = '  ';
  let mid = '  ';
  let bot = '  ';

  for (let i = 0; i < boxes.length; i += 1) {
    top += boxes[i].top;
    mid += boxes[i].mid;
    bot += boxes[i].bot;

    if (i < boxes.length - 1) {
      top += pipelineGap(false);
      mid += pipelineGap(true);
      bot += pipelineGap(false);
    }
  }

  console.log(top);
  console.log(mid);
  console.log(bot);
}

export function printBanner(version) {
  console.log('');
  console.log(borderTop());
  console.log(boxRow(c.bold('Harness Engineering Skills')));
  console.log(boxRow(c.dim('Reliable agent loops · scope · verify · resume')));
  console.log(borderBottom());
  console.log('');
  printPipeline();
  console.log('');

  if (version) {
    console.log(c.dim(`  v${version}\n`));
  }
}

export function printBox(title, lines = [], width = INNER_WIDTH) {
  console.log(borderTop(width));
  console.log(boxRow(c.bold(title), width));
  console.log(borderDivider(width));

  for (const line of lines) {
    console.log(boxRow(line, width));
  }

  console.log(borderBottom(width));
}

function checkbox(checked) {
  return checked ? c.green('◉') : c.dim('○');
}

function createRenderer() {
  let lineCount = 0;
  let cursorHidden = false;

  function render(lines) {
    if (!cursorHidden) {
      stdout.write('\x1b[?25l');
      cursorHidden = true;
    }

    if (lineCount > 0) {
      stdout.write(`\x1b[${lineCount}A`);
    }

    for (const line of lines) {
      stdout.write('\x1b[2K');
      stdout.write(`${line}\n`);
    }

    if (lineCount > lines.length) {
      const extra = lineCount - lines.length;
      for (let i = 0; i < extra; i += 1) {
        stdout.write('\x1b[2K\n');
      }
      stdout.write(`\x1b[${extra}A`);
    }

    lineCount = lines.length;
  }

  function done() {
    stdout.write('\x1b[?25h');
  }

  return { render, done };
}

function buildSelectLines(message, options, cursor) {
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
  return lines;
}

function buildMultiselectLines(message, options, selected, cursor) {
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
  return lines;
}

function cleanupRawMode(onData) {
  stdin.off('data', onData);
  if (stdin.isTTY) {
    stdin.setRawMode(false);
  }
  stdin.pause();
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
  const renderer = createRenderer();

  return new Promise((resolve, reject) => {
    const onData = (key) => {
      if (key === '\u0003') {
        renderer.done();
        cleanupRawMode(onData);
        reject(new Error('Installation cancelled.'));
        return;
      }

      if (key === '\r' || key === '\n') {
        renderer.done();
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

      renderer.render(buildMultiselectLines(message, options, selected, cursor));
    };

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', onData);
    renderer.render(buildMultiselectLines(message, options, selected, cursor));
  });
}

export async function promptSelect({ message, options, initialIndex = 0 }) {
  if (!isInteractive()) {
    return options[initialIndex]?.value;
  }

  let cursor = initialIndex;
  const renderer = createRenderer();

  return new Promise((resolve, reject) => {
    const onData = (key) => {
      if (key === '\u0003') {
        renderer.done();
        cleanupRawMode(onData);
        reject(new Error('Installation cancelled.'));
        return;
      }

      if (key === '\r' || key === '\n') {
        renderer.done();
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

      renderer.render(buildSelectLines(message, options, cursor));
    };

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', onData);
    renderer.render(buildSelectLines(message, options, cursor));
  });
}

export async function promptConfirm({ message, initial = true }) {
  if (!isInteractive()) {
    return initial;
  }

  const hint = initial ? '[Y/n]' : '[y/N]';
  stdout.write(`\n  ${c.bold(message)} ${c.dim(hint)} `);
  stdout.write('\x1b[?25l');

  return new Promise((resolve, reject) => {
    const onData = (key) => {
      if (key === '\u0003') {
        cleanupRawMode(onData);
        stdout.write('\x1b[?25h');
        reject(new Error('Installation cancelled.'));
        return;
      }

      if (key === '\r' || key === '\n') {
        cleanupRawMode(onData);
        stdout.write('\x1b[?25h\n');
        resolve(initial);
        return;
      }

      const lower = key.toLowerCase();
      if (lower === 'y') {
        cleanupRawMode(onData);
        stdout.write(`\x1b[?25h${c.green('yes')}\n`);
        resolve(true);
      }

      if (lower === 'n') {
        cleanupRawMode(onData);
        stdout.write(`\x1b[?25h${c.yellow('no')}\n`);
        resolve(false);
      }
    };

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', onData);
  });
}
