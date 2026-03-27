// core/shared/money.ts
export function normalizeMoneyString(value: string): string {
  const match = value.match(/^(\d+)(?:\.(\d{1,2}))?$/);

  if (!match) {
    return "0.00";
  }

  const [, major, minor = ""] = match;

  return `${major}.${minor.padEnd(2, "0")}`;
}

export function moneyStringToCents(value: string): number {
  const normalizedValue = normalizeMoneyString(value);
  const [major, minor] = normalizedValue.split(".");

  return Number.parseInt(major ?? "0", 10) * 100 + Number.parseInt(minor ?? "0", 10);
}

export function centsToMoneyString(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const normalizedValue = Math.abs(cents);
  const major = Math.floor(normalizedValue / 100);
  const minor = normalizedValue % 100;

  return `${sign}${major}.${minor.toString().padStart(2, "0")}`;
}
