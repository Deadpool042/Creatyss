// Mock éditorial temporaire — listing non filtrant des couleurs Sylvertex.
// Noms et références alignés sur le nuancier fabricant Spradling Silvertex®.
// Les couleurs hex servent uniquement à ajuster l'UI/UX : elles ne remplacent pas un échantillon matière réel.

export type FilterPreviewColor = Readonly<{
  name: string;
  token: string;
  manufacturerReference: string;
  pantoneReference: string;
}>;

export const COLOR_DOT_BG: Record<string, string> = {
  default: "color-mix(in srgb, var(--brand) 22%, var(--surface-panel))",
  white: "#f3f1e7",
  "ice-cream": "#ece8dc",
  ice: "#f0efe9",
  cream: "#ede5cf",
  sisal: "#d7c6a5",
  champagne: "#c7b586",
  macadamia: "#b7b2a6",
  sandstone: "#afa18f",
  taupe: "#968c7c",
  shiitake: "#75685e",
  beige: "#9f8a69",
  meteor: "#5f5650",
  mocca: "#4b3629",
  luggage: "#6e563b",
  umber: "#8a5b39",
  mandarin: "#c3622f",
  sunkist: "#b6502f",
  wine: "#7b3f42",
  squash: "#d7a521",
  safran: "#d99600",
  melon: "#d39a4a",
  orange: "#b96d33",
  tomato: "#d84b32",
  grenadine: "#c32433",
  red: "#a92332",
  camel: "#b7863d",
  cobre: "#a55d31",
  rubin: "#6a3439",
  raspberry: "#7d424d",
  orchid: "#a84a74",
  magenta: "#bd2b72",
  "ultra-violet": "#574887",
  forest: "#214a45",
  teal: "#1e5f5f",
  avocado: "#bfc63a",
  citrus: "#d7c84b",
  lotus: "#e3c7bd",
  rose: "#d0ada8",
  aubergine: "#4b344f",
  basil: "#5f7040",
  pistacho: "#9ea730",
  celery: "#a6b63a",
  bottle: "#4b5034",
  sage: "#898f76",
  petrol: "#4d747b",
  jet: "#2f5862",
  aluminium: "#cfcec6",
  skylight: "#b9ced8",
  coral: "#97c7c8",
  turquoise: "#007f8d",
  baltic: "#0d66a8",
  delft: "#224b93",
  sapphire: "#1f2e49",
  plata: "#a8aaa3",
  sterling: "#878b84",
  titanium: "#7d8079",
  storm: "#555d5f",
  graphite: "#363f3f",
  carbon: "#252728",
  black: "#141414",
};

export const FILTER_PREVIEW_COLORS: readonly FilterPreviewColor[] = [
  {
    name: "White",
    token: "white",
    manufacturerReference: "122-2089",
    pantoneReference: "11-4800 TPX",
  },
  {
    name: "Ice Cream",
    token: "ice-cream",
    manufacturerReference: "122-2090",
    pantoneReference: "12-0104 TPX",
  },
  { name: "Ice", token: "ice", manufacturerReference: "122-4004", pantoneReference: "11-4301 TPX" },
  {
    name: "Cream",
    token: "cream",
    manufacturerReference: "122-1077",
    pantoneReference: "12-0105 TPX",
  },
  {
    name: "Sisal",
    token: "sisal",
    manufacturerReference: "122-1051",
    pantoneReference: "14-1112 TPX",
  },
  {
    name: "Champagne",
    token: "champagne",
    manufacturerReference: "122-1078",
    pantoneReference: "16-1324 TPX",
  },
  {
    name: "Macadamia",
    token: "macadamia",
    manufacturerReference: "122-0001",
    pantoneReference: "15-4503 TPX",
  },
  {
    name: "Sandstone",
    token: "sandstone",
    manufacturerReference: "122-0002",
    pantoneReference: "16-1406 TPX",
  },
  {
    name: "Taupe",
    token: "taupe",
    manufacturerReference: "122-0009",
    pantoneReference: "17-0808 TPX",
  },
  {
    name: "Shiitake",
    token: "shiitake",
    manufacturerReference: "122-4012",
    pantoneReference: "17-1410 TPX",
  },
  {
    name: "Beige",
    token: "beige",
    manufacturerReference: "122-1010",
    pantoneReference: "16-1010 TPX",
  },
  {
    name: "Meteor",
    token: "meteor",
    manufacturerReference: "122-4024",
    pantoneReference: "18-1304 TPX",
  },
  {
    name: "Mocca",
    token: "mocca",
    manufacturerReference: "122-0005",
    pantoneReference: "19-1015 TPX",
  },
  {
    name: "Luggage",
    token: "luggage",
    manufacturerReference: "122-0073",
    pantoneReference: "18-1124 TPX",
  },
  {
    name: "Umber",
    token: "umber",
    manufacturerReference: "122-1014",
    pantoneReference: "19-1334 TPX",
  },
  {
    name: "Mandarin",
    token: "mandarin",
    manufacturerReference: "122-6061",
    pantoneReference: "18-1250 TPX",
  },
  {
    name: "Sunkist",
    token: "sunkist",
    manufacturerReference: "122-2012",
    pantoneReference: "18-1449 TPX",
  },
  {
    name: "Wine",
    token: "wine",
    manufacturerReference: "122-2064",
    pantoneReference: "19-1532 TPX",
  },
  {
    name: "Squash",
    token: "squash",
    manufacturerReference: "122-2093",
    pantoneReference: "14-0846 TPX",
  },
  {
    name: "Safran",
    token: "safran",
    manufacturerReference: "122-6065",
    pantoneReference: "15-1054 TPX",
  },
  {
    name: "Melon",
    token: "melon",
    manufacturerReference: "122-6062",
    pantoneReference: "MET 15-1237 TPX",
  },
  {
    name: "Orange",
    token: "orange",
    manufacturerReference: "122-0013",
    pantoneReference: "16-1439 TPX",
  },
  {
    name: "Tomato",
    token: "tomato",
    manufacturerReference: "122-2096",
    pantoneReference: "17-1564 TPX",
  },
  {
    name: "Grenadine",
    token: "grenadine",
    manufacturerReference: "122-2095",
    pantoneReference: "19-1664 TPX",
  },
  { name: "Red", token: "red", manufacturerReference: "122-2011", pantoneReference: "18-1658 TPX" },
  {
    name: "Camel",
    token: "camel",
    manufacturerReference: "122-2105",
    pantoneReference: "16-1144 TPX",
  },
  {
    name: "Cobre",
    token: "cobre",
    manufacturerReference: "122-2003",
    pantoneReference: "17-1340 TPX",
  },
  {
    name: "Rubin",
    token: "rubin",
    manufacturerReference: "122-6004",
    pantoneReference: "19-1525 TPX",
  },
  {
    name: "Raspberry",
    token: "raspberry",
    manufacturerReference: "122-2016",
    pantoneReference: "18-1614 TPX",
  },
  {
    name: "Orchid",
    token: "orchid",
    manufacturerReference: "122-2097",
    pantoneReference: "18-2525 TPX",
  },
  {
    name: "Magenta",
    token: "magenta",
    manufacturerReference: "122-7002",
    pantoneReference: "18-2336 TPX",
  },
  {
    name: "Ultra Violet",
    token: "ultra-violet",
    manufacturerReference: "122-2104",
    pantoneReference: "18-3838 TPX",
  },
  {
    name: "Forest",
    token: "forest",
    manufacturerReference: "122-5063",
    pantoneReference: "19-5917 TPX",
  },
  {
    name: "Teal",
    token: "teal",
    manufacturerReference: "122-2100",
    pantoneReference: "19-4517 TPX",
  },
  {
    name: "Avocado",
    token: "avocado",
    manufacturerReference: "122-2092",
    pantoneReference: "15-0533 TPX",
  },
  {
    name: "Citrus",
    token: "citrus",
    manufacturerReference: "122-2091",
    pantoneReference: "15-0545 TPX",
  },
  {
    name: "Lotus",
    token: "lotus",
    manufacturerReference: "122-2099",
    pantoneReference: "13-1504 TPX",
  },
  {
    name: "Rosé",
    token: "rose",
    manufacturerReference: "122-2098",
    pantoneReference: "14-1508 TPX",
  },
  {
    name: "Aubergine",
    token: "aubergine",
    manufacturerReference: "122-7001",
    pantoneReference: "19-3514 TPX",
  },
  {
    name: "Basil",
    token: "basil",
    manufacturerReference: "122-5020",
    pantoneReference: "18-0435 TPX",
  },
  {
    name: "Pistacho",
    token: "pistacho",
    manufacturerReference: "122-5008",
    pantoneReference: "16-0532 TPX",
  },
  {
    name: "Celery",
    token: "celery",
    manufacturerReference: "122-5019",
    pantoneReference: "16-0632 TPX",
  },
  {
    name: "Bottle",
    token: "bottle",
    manufacturerReference: "122-5010",
    pantoneReference: "19-0822 TPX",
  },
  {
    name: "Sage",
    token: "sage",
    manufacturerReference: "122-5009",
    pantoneReference: "17-0510 TPX",
  },
  {
    name: "Petrol",
    token: "petrol",
    manufacturerReference: "122-2094",
    pantoneReference: "18-4214 TPX",
  },
  { name: "Jet", token: "jet", manufacturerReference: "122-3068", pantoneReference: "19-4110 TPX" },
  {
    name: "Aluminium",
    token: "aluminium",
    manufacturerReference: "122-2101",
    pantoneReference: "14-4103 TPX",
  },
  {
    name: "Skylight",
    token: "skylight",
    manufacturerReference: "122-2103",
    pantoneReference: "14-4210 TPX",
  },
  {
    name: "Coral",
    token: "coral",
    manufacturerReference: "122-2102",
    pantoneReference: "15-4309 TPX",
  },
  {
    name: "Turquoise",
    token: "turquoise",
    manufacturerReference: "122-3001",
    pantoneReference: "18-4225 TPX",
  },
  {
    name: "Baltic",
    token: "baltic",
    manufacturerReference: "122-3066",
    pantoneReference: "18-4032 TPX",
  },
  {
    name: "Delft",
    token: "delft",
    manufacturerReference: "122-3067",
    pantoneReference: "19-4052 TPX",
  },
  {
    name: "Sapphire",
    token: "sapphire",
    manufacturerReference: "122-3007",
    pantoneReference: "19-4028 TPX",
  },
  {
    name: "Plata",
    token: "plata",
    manufacturerReference: "122-4001",
    pantoneReference: "14-4203 TPX",
  },
  {
    name: "Sterling",
    token: "sterling",
    manufacturerReference: "122-4011",
    pantoneReference: "17-1500 TPX",
  },
  {
    name: "Titanium",
    token: "titanium",
    manufacturerReference: "122-4010",
    pantoneReference: "18-4005 TPX",
  },
  {
    name: "Storm",
    token: "storm",
    manufacturerReference: "122-4002",
    pantoneReference: "19-4215 TPX",
  },
  {
    name: "Graphite",
    token: "graphite",
    manufacturerReference: "122-4003",
    pantoneReference: "19-0201 TPX",
  },
  {
    name: "Carbon",
    token: "carbon",
    manufacturerReference: "122-9002",
    pantoneReference: "19-3902 TPX",
  },
  {
    name: "Black",
    token: "black",
    manufacturerReference: "122-9001",
    pantoneReference: "19-0000 TPX",
  },
] as const;

export const FILTER_PREVIEW_MATERIALS = ["Sylvertex"] as const;

// Nombre de couleurs affichées par défaut avant "voir plus"
export const FILTER_PREVIEW_FEATURED_COUNT = 12;

// TODO(human): selectFeaturedColors
// Retourne les couleurs à afficher en priorité dans la grille principale.
// Les autres sont accessibles via le panel "voir plus".
// Paramètre : la liste complète des couleurs disponibles.
// Retour attendu : un sous-ensemble de couleurs à mettre en avant.
export function selectFeaturedColors(
  colors: readonly FilterPreviewColor[]
): readonly FilterPreviewColor[] {
  // TODO(human): implémenter la sélection éditoriale
  // Exemple : retourner les tons les plus représentés en stock,
  // ou une sélection manuelle, ou les premières couleurs de chaque famille.
  return colors.slice(0, FILTER_PREVIEW_FEATURED_COUNT);
}
