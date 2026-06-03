export const ADMIN_BREADCRUMB_SEGMENT_LABELS: Record<string, string> = {
  admin: "Accueil",
  commerce: "Commerce",
  orders: "Commandes",
  catalog: "Catalogue",
  categories: "Catégories",
  products: "Produits",
  overview: "Vue d'ensemble",
  customers: "Clients",
  payments: "Paiements",
  shipping: "Livraison",
  content: "Contenu",
  blog: "Blog",
  pages: "Pages",
  seo: "SEO",
  marketing: "Marketing",
  discounts: "Réductions",
  newsletter: "Newsletter",
  automations: "Automations",
  settings: "Réglages",
  general: "Général",
  store: "Boutique",
  team: "Équipe",
  advanced: "Avancé",
  insights: "Insights",
  analytics: "Analytics",
  maintenance: "Maintenance",
  monitoring: "Monitoring",
  logs: "Journaux",
  observability: "Observabilité",
  media: "Médias",
  pricing: "Tarification",
};

export type AdminBreadcrumbDynamicPattern = {
  pattern: RegExp;
  label: string;
};

export const ADMIN_BREADCRUMB_DYNAMIC_PATTERNS: AdminBreadcrumbDynamicPattern[] = [
  { pattern: /^\/admin\/commerce\/orders\/[^/]+$/, label: "Détail" },
  { pattern: /^\/admin\/catalog\/categories\/[^/]+$/, label: "Détail" },
  { pattern: /^\/admin\/catalog\/products\/[^/]+$/, label: "Détail" },
  { pattern: /^\/admin\/content\/blog\/[^/]+$/, label: "Détail" },
  { pattern: /^\/admin\/content\/pages\/[^/]+$/, label: "Détail" },
];

/**
 * Liens pour les segments intermédiaires connus.
 * Clé = chemin cumulé jusqu'au segment. Valeur = href cible (peut différer si redirect).
 */
export const ADMIN_BREADCRUMB_SEGMENT_HREFS: Record<string, string> = {
  "/admin/commerce": "/admin/commerce/overview",
  "/admin/catalog": "/admin/catalog/overview",
  "/admin/content": "/admin/content/overview",
  "/admin/marketing": "/admin/marketing/overview",
};
