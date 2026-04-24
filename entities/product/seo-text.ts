/**
 * Conversion simple HTML -> texte "SEO-friendly".
 *
 * Objectif:
 * - produire une chaîne lisible et stable pour les meta descriptions et previews admin,
 *   à partir de sources qui peuvent être du plain text ou du rich-text HTML (TipTap).
 *
 * Contraintes:
 * - pas de dépendance externe
 * - helper pur réutilisable côté client et serveur
 */
export function toSeoPlainText(input: string | null | undefined): string {
  if (!input) {
    return "";
  }

  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function toSeoPlainTextOrNull(input: string | null | undefined): string | null {
  const normalized = toSeoPlainText(input);
  return normalized.length > 0 ? normalized : null;
}

export function pickSeoText(...candidates: Array<string | null | undefined>): string | null {
  for (const candidate of candidates) {
    const normalized = toSeoPlainTextOrNull(candidate);
    if (normalized !== null) {
      return normalized;
    }
  }
  return null;
}

function normalizeSeoDescriptionText(input: string): string {
  // Base: already single-line, but we tighten punctuation spacing for meta usage.
  let text = input
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,.;:!?])([^\s])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  // Avoid awkward trailing separators when truncating/copy-pasting.
  text = text.replace(/[,:;\-–—]+$/g, "").trim();

  if (text.length === 0) {
    return "";
  }

  // Editorial finish: ensure it reads as a sentence, but don't add punctuation after ellipsis.
  if (!/(\.\.\.|…|[.!?])$/.test(text)) {
    text += ".";
  }

  return text;
}

function truncateSeoTextAtWordBoundary(input: string, maxLength: number): string {
  if (maxLength <= 0) {
    return "";
  }

  if (input.length <= maxLength) {
    return input;
  }

  // Keep room for ellipsis.
  const ellipsis = "...";
  const hardMax = Math.max(1, maxLength - ellipsis.length);
  const slice = input.slice(0, hardMax);
  const lastSpace = slice.lastIndexOf(" ");
  const truncatedBase = (lastSpace > 40 ? slice.slice(0, lastSpace) : slice).trim();
  const cleaned = truncatedBase.replace(/[,:;\-–—]+$/g, "").trim();

  return cleaned.length > 0 ? `${cleaned}${ellipsis}` : `${slice.trim()}${ellipsis}`;
}

export function buildSeoDescription(input: {
  candidates: Array<string | null | undefined>;
  defaultValue: string;
  maxLength?: number;
}): string {
  const raw = pickSeoText(...input.candidates) ?? toSeoPlainText(input.defaultValue);
  const normalized = normalizeSeoDescriptionText(raw);

  if (normalized.length === 0) {
    return toSeoPlainText(input.defaultValue) || "";
  }

  const maxLength = input.maxLength ?? 170;
  return truncateSeoTextAtWordBoundary(normalized, maxLength);
}
