export function isColorAxisOption(option: { code: string; name: string }): boolean {
  const code = option.code.trim().toLowerCase();
  const name = option.name.trim().toLowerCase();
  return (
    code.includes("color") ||
    code.includes("couleur") ||
    name.includes("color") ||
    name.includes("couleur")
  );
}

export function normalizeHexInput(input: string): string {
  const raw = input.trim().toUpperCase();
  if (!raw.startsWith("#")) {
    return raw.length > 0 ? `#${raw}` : "";
  }
  return raw;
}

export function isValidColorHex(value: string): boolean {
  return /^#(?:[0-9A-F]{3}|[0-9A-F]{6})$/.test(value.trim().toUpperCase());
}

export function toPickerValue(value: string): string {
  const normalized = value.trim().toUpperCase();
  if (/^#[0-9A-F]{6}$/.test(normalized)) {
    return normalized.toLowerCase();
  }
  if (/^#[0-9A-F]{3}$/.test(normalized)) {
    const [, r, g, b] = normalized;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return "#000000";
}
