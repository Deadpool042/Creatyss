export type AdminRichTextColorOption = {
  label: string;
  value: string;
};

export const ADMIN_RICH_TEXT_TEXT_COLORS: AdminRichTextColorOption[] = [
  { label: "Texte principal", value: "var(--foreground)" },
  { label: "Texte discret", value: "var(--muted-foreground)" },
  { label: "Accent", value: "var(--primary)" },
  { label: "Destructif", value: "var(--destructive)" },
];

export const ADMIN_RICH_TEXT_HIGHLIGHT_COLORS: AdminRichTextColorOption[] = [
  { label: "Accent", value: "var(--accent)" },
  { label: "Accent discret", value: "color-mix(in oklab, var(--accent) 55%, white)" },
  { label: "Primaire discret", value: "color-mix(in oklab, var(--primary) 35%, white)" },
  { label: "Destructif discret", value: "color-mix(in oklab, var(--destructive) 20%, white)" },
];
