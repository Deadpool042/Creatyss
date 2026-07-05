import type { ComponentType } from "react";
import Link from "next/link";

import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { Button } from "@/components/ui/button";

type AdminFeatureDisabledStateProps = {
  capabilityName: string;
  description: string;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
};

/**
 * Ecran de statut affiche quand un flag racine de capacite est inactif cote admin.
 *
 * Doctrine (lot H, docs/roadmap/doctrine-domaines-admin) : un flag inactif ne
 * produit jamais un notFound() cote admin. L'admin voit un ecran explicite
 * avec un CTA vers les reglages avances plutot qu'une page 404.
 */
export function AdminFeatureDisabledState({
  capabilityName,
  description,
  icon,
  className,
}: AdminFeatureDisabledStateProps) {
  return (
    <AdminEmptyState
      eyebrow="Capacité désactivée"
      title={`${capabilityName} non activée pour cette boutique`}
      description={description}
      {...(icon ? { icon } : {})}
      {...(className ? { className } : {})}
      actionNode={
        <Button asChild size="sm">
          <Link href="/admin/settings/advanced">Voir les réglages avancés</Link>
        </Button>
      }
    />
  );
}
