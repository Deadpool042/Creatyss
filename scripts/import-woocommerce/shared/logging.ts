const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
} as const;

const DEFAULT_PROGRESS_BAR_WIDTH = 28;
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"] as const;
const IS_INTERACTIVE = Boolean(process.stdout.isTTY) && process.env.CI !== "true";

type LogLevel = "info" | "warn" | "error" | "success";

let activeSpinnerInterval: NodeJS.Timeout | null = null;
let activeSpinnerFrameIndex = 0;
let progressActive = false;

function colorize(color: string, value: string): string {
  if (!IS_INTERACTIVE) {
    return value;
  }

  return `${color}${value}${ANSI.reset}`;
}

function clearActiveLine(): void {
  if (!IS_INTERACTIVE) {
    return;
  }

  process.stdout.write("\r\x1b[2K");
}

function stopSpinner(): void {
  if (activeSpinnerInterval !== null) {
    clearInterval(activeSpinnerInterval);
    activeSpinnerInterval = null;
    activeSpinnerFrameIndex = 0;
    clearActiveLine();
  }
}

function stopProgress(): void {
  if (progressActive) {
    clearActiveLine();
    progressActive = false;
  }
}

function stopTransientUi(): void {
  stopSpinner();
  stopProgress();
}

function writeLine(message: string, stream: NodeJS.WriteStream = process.stdout): void {
  stopTransientUi();
  stream.write(`${message}\n`);
}

function prefix(level: LogLevel): string {
  switch (level) {
    case "info":
      return `${colorize(ANSI.blue, "ℹ")} ${colorize(ANSI.gray, "[import-woocommerce]")}`;
    case "warn":
      return `${colorize(ANSI.yellow, "⚠")} ${colorize(ANSI.gray, "[import-woocommerce]")}`;
    case "error":
      return `${colorize(ANSI.red, "✖")} ${colorize(ANSI.gray, "[import-woocommerce]")}`;
    case "success":
      return `${colorize(ANSI.green, "✔")} ${colorize(ANSI.gray, "[import-woocommerce]")}`;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function buildProgressBar(current: number, total: number, width: number): string {
  const safeTotal = total > 0 ? total : 1;
  const ratio = clamp(current / safeTotal, 0, 1);
  const filled = Math.round(ratio * width);
  const empty = width - filled;

  return `${colorize(ANSI.green, "█".repeat(filled))}${colorize(ANSI.gray, "░".repeat(empty))}`;
}

export function logInfo(message: string): void {
  writeLine(`${prefix("info")} ${message}`);
}

export function logWarn(message: string): void {
  writeLine(`${prefix("warn")} ${message}`);
}

export function logError(message: string): void {
  writeLine(`${prefix("error")} ${message}`, process.stderr);
}

export function logSuccess(message: string): void {
  writeLine(`${prefix("success")} ${message}`);
}

export function logStep(step: string): void {
  writeLine(`${colorize(ANSI.cyan, "→")} ${colorize(ANSI.bold, step)}`);
}

export function startSpinner(label: string): void {
  stopTransientUi();

  if (!IS_INTERACTIVE) {
    logInfo(label);
    return;
  }

  activeSpinnerFrameIndex = 0;

  const render = () => {
    const frame = SPINNER_FRAMES[activeSpinnerFrameIndex % SPINNER_FRAMES.length] ?? "•";
    process.stdout.write(
      `\r${colorize(ANSI.magenta, frame)} ${label} ${colorize(ANSI.gray, "...")}`
    );
    activeSpinnerFrameIndex += 1;
  };

  render();
  activeSpinnerInterval = setInterval(render, 80);
}

export function succeedSpinner(message: string): void {
  if (!IS_INTERACTIVE) {
    logSuccess(message);
    return;
  }

  stopSpinner();
  writeLine(`${colorize(ANSI.green, "✔")} ${message}`);
}

export function failSpinner(message: string): void {
  if (!IS_INTERACTIVE) {
    logError(message);
    return;
  }

  stopSpinner();
  writeLine(`${colorize(ANSI.red, "✖")} ${message}`, process.stderr);
}

export function logProgress(
  current: number,
  total: number,
  label: string,
  options?: {
    width?: number;
  }
): void {
  stopSpinner();

  if (!IS_INTERACTIVE) {
    if (current === total) {
      logInfo(`${label} (${current}/${total})`);
    }
    return;
  }

  progressActive = true;

  const safeTotal = total > 0 ? total : 1;
  const percent = clamp(Math.round((current / safeTotal) * 100), 0, 100);
  const width = options?.width ?? DEFAULT_PROGRESS_BAR_WIDTH;
  const bar = buildProgressBar(current, safeTotal, width);

  process.stdout.write(
    `\r${colorize(ANSI.cyan, "↻")} ${label}  ${colorize(
      ANSI.bold,
      `[${bar}]`
    )} ${colorize(ANSI.bold, `${percent}%`)} ${colorize(ANSI.gray, `(${current}/${total})`)}`
  );
}

export function endProgress(message?: string): void {
  if (!IS_INTERACTIVE) {
    if (message) {
      logSuccess(message);
    }
    return;
  }

  if (!progressActive) {
    return;
  }

  clearActiveLine();
  progressActive = false;

  if (message) {
    writeLine(`${colorize(ANSI.green, "✔")} ${message}`);
  }
}
