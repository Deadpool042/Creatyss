import type { ReactNode } from "react";

// Tableau pleine largeur — split view retiré.
// Le tableau produits a trop de colonnes pour une vue en panneau étroit.
// Navigation : liste → clic sur ligne → page éditeur pleine largeur.
export default function AdminProductsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
