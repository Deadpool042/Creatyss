// Prévisualisation éditoriale non filtrante — affichée dans le drawer hors sidebar.
// Ces éléments sont indicatifs uniquement et n'activent aucun filtre.

export const COLOR_DOT_BG: Record<string, string> = {
  default: "color-mix(in srgb, var(--brand) 22%, var(--surface-panel))",
  ivory: "color-mix(in srgb, var(--surface-panel) 86%, var(--brand))",
  saffron: "color-mix(in srgb, var(--feedback-warning) 68%, var(--brand))",
  mandarin: "color-mix(in srgb, var(--brand) 74%, var(--feedback-warning))",
  olive: "color-mix(in srgb, var(--feedback-success) 62%, var(--brand))",
  sapphire: "color-mix(in srgb, var(--accent) 78%, var(--brand))",
  aubergine: "color-mix(in srgb, var(--destructive) 42%, var(--accent))",
};

export const FILTER_PREVIEW_COLORS = [
  { name: "Ivoire", token: "ivory" },
  { name: "Safran", token: "saffron" },
  { name: "Mandarin", token: "mandarin" },
  { name: "Olive", token: "olive" },
  { name: "Saphyre", token: "sapphire" },
  { name: "Aubergine", token: "aubergine" },
] as const;

export const FILTER_PREVIEW_MATERIALS = ["Textile", "Tissu épais", "Finitions", "Doublure"] as const;
