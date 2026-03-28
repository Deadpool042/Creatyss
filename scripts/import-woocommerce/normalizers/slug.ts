export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/-{2,}/g, "-");
}

export function buildStableCode(prefix: string, raw: string, fallbackId: number): string {
  const normalized = slugify(raw);

  if (normalized.length > 0) {
    return `${prefix}_${normalized}`.slice(0, 100);
  }

  return `${prefix}_${fallbackId}`;
}
