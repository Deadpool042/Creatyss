import { getPricingGovernanceData } from "@/features/admin/pilotage/queries/get-pricing-governance-data.query";
import { getAvailabilityGovernanceData } from "@/features/admin/pilotage/queries/get-availability-governance-data.query";
import { getCatalogSeoGovernanceData } from "@/features/admin/pilotage/queries/get-catalog-seo-governance-data.query";
import { getCategoriesGovernanceData } from "@/features/admin/pilotage/queries/get-categories-governance-data.query";
import { getInventoryGovernanceData } from "@/features/admin/pilotage/queries/get-inventory-governance-data.query";
import { getMediaGovernanceData } from "@/features/admin/pilotage/queries/get-media-governance-data.query";
import { getRelatedProductsGovernanceData } from "@/features/admin/pilotage/queries/get-related-products-governance-data.query";
import { getVariantsGovernanceData } from "@/features/admin/pilotage/queries/get-variants-governance-data.query";

import {
  GovernanceDefaultItem,
  GovernanceDomainContext,
  GovernanceEmptyState,
  GovernancePanelShell,
  GovernanceStatGrid,
  makeStat,
  type GovernanceStatItem,
} from "../governance-panel-primitives";

export async function PricingGovernancePanel() {
  const data = await getPricingGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Listes", value: data.totalLists },
    makeStat(
      "Actives",
      data.activeLists,
      data.activeLists > 0 ? "text-feedback-success-foreground" : undefined
    ),
    { label: "Entrées prix", value: data.totalEntries },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Tarification">
      <GovernanceDomainContext>
        Ce flag gouverne les <span className="font-medium text-foreground">listes de prix</span>,{" "}
        les <span className="font-medium text-foreground">prix produit</span> et les{" "}
        <span className="font-medium text-foreground">prix variante</span>. Les montants sont
        stockés TTC — la ventilation HT/TVA relève du domaine{" "}
        <code className="font-mono text-[10px]">taxation</code>.
      </GovernanceDomainContext>

      {data.totalLists > 0 ? (
        <div className="space-y-2">
          <GovernanceStatGrid stats={stats} />
          {data.defaultList !== null ? (
            <GovernanceDefaultItem
              name={data.defaultList.name}
              secondary={data.defaultList.currencyCode}
            />
          ) : (
            <GovernanceEmptyState message="Aucune liste par défaut définie." />
          )}
        </div>
      ) : (
        <GovernanceEmptyState message="Aucune liste de prix disponible." />
      )}
    </GovernancePanelShell>
  );
}

export async function VariantsGovernancePanel() {
  const data = await getVariantsGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Variantes", value: data.totalVariants },
    { label: "Produits multi", value: data.productsWithVariants },
    {
      label: "Sans variante",
      value: data.totalProducts - data.productsWithVariants,
    },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Variantes">
      <GovernanceDomainContext>
        Ce flag gouverne les <span className="font-medium text-foreground">variantes produit</span>{" "}
        (options, valeurs, prix variante). Sans ce flag actif, les produits sont proposés en version
        unique sans déclinaison.
      </GovernanceDomainContext>
      {data.totalVariants > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucune variante enregistrée." />
      )}
    </GovernancePanelShell>
  );
}

export async function CategoriesGovernancePanel() {
  const data = await getCategoriesGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Catégories", value: data.totalCategories },
    makeStat(
      "Actives",
      data.activeCategories,
      data.activeCategories > 0 ? "text-feedback-success-foreground" : undefined
    ),
    makeStat(
      "Non classés",
      data.productsWithoutCategory,
      data.productsWithoutCategory > 0 ? "text-feedback-warning-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Catégories">
      <GovernanceDomainContext>
        Ce flag gouverne l'arborescence de{" "}
        <span className="font-medium text-foreground">catégories</span> et le rattachement des
        produits. Il conditionne la navigation par rubrique sur le storefront.
      </GovernanceDomainContext>
      {data.totalCategories > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucune catégorie enregistrée." />
      )}
    </GovernancePanelShell>
  );
}

export async function AvailabilityGovernancePanel() {
  const data = await getAvailabilityGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Enregistrements", value: data.totalRecords },
    { label: "Politiques", value: data.totalPolicies },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Disponibilité">
      <GovernanceDomainContext>
        Ce flag gouverne les{" "}
        <span className="font-medium text-foreground">règles de disponibilité</span> par canal,
        territoire ou période. Il détermine si un produit est accessible à la vente selon le
        contexte client.
      </GovernanceDomainContext>
      {data.totalRecords > 0 || data.totalPolicies > 0 ? (
        <GovernanceStatGrid stats={stats} columns={2} />
      ) : (
        <GovernanceEmptyState message="Aucun enregistrement de disponibilité." />
      )}
    </GovernancePanelShell>
  );
}

export async function CatalogSeoGovernancePanel() {
  const data = await getCatalogSeoGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Fiches SEO", value: data.totalMeta },
    makeStat(
      "Publiées",
      data.publishedMeta,
      data.publishedMeta > 0 ? "text-feedback-success-foreground" : undefined
    ),
    makeStat(
      "Sans SEO",
      data.withoutSeo,
      data.withoutSeo > 0 ? "text-feedback-warning-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · SEO produit">
      <GovernanceDomainContext>
        Ce flag gouverne les <span className="font-medium text-foreground">métadonnées SEO</span>{" "}
        par produit (title, description, og:image). Il alimente les balises{" "}
        <code className="font-mono text-[10px]">{"<head>"}</code> du storefront et les sitemaps.
      </GovernanceDomainContext>
      <GovernanceStatGrid stats={stats} />
    </GovernancePanelShell>
  );
}

export async function RelatedGovernancePanel() {
  const data = await getRelatedProductsGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Liens", value: data.totalLinks },
    { label: "Produits liés", value: data.productsWithLinks },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Produits liés">
      <GovernanceDomainContext>
        Ce flag gouverne les{" "}
        <span className="font-medium text-foreground">suggestions de produits liés</span> affichées
        sur chaque fiche produit. Il peut encourager la découverte et augmenter le panier moyen.
      </GovernanceDomainContext>
      {data.totalLinks > 0 ? (
        <GovernanceStatGrid stats={stats} columns={2} />
      ) : (
        <GovernanceEmptyState message="Aucun lien produit enregistré." />
      )}
    </GovernancePanelShell>
  );
}

export async function InventoryGovernancePanel() {
  const data = await getInventoryGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Articles", value: data.totalItems },
    makeStat(
      "Actifs",
      data.activeItems,
      data.activeItems > 0 ? "text-feedback-success-foreground" : undefined
    ),
    makeStat(
      "Stock bas",
      data.lowStock,
      data.lowStock > 0 ? "text-feedback-warning-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Inventaire">
      <GovernanceDomainContext>
        Ce flag gouverne le suivi des{" "}
        <span className="font-medium text-foreground">stocks par variante</span>. Le niveau{" "}
        <code className="font-mono text-[10px]">alerts</code> active le seuil de stock bas
        configurable par article. Le niveau{" "}
        <code className="font-mono text-[10px]">forecasting</code> expose la couverture estimée sur
        30 jours glissants.
      </GovernanceDomainContext>
      {data.totalItems > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucun article d'inventaire enregistré." />
      )}
    </GovernancePanelShell>
  );
}

export async function MediaGovernancePanel() {
  const data = await getMediaGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Médias", value: data.totalAssets },
    makeStat(
      "Actifs",
      data.activeAssets,
      data.activeAssets > 0 ? "text-feedback-success-foreground" : undefined
    ),
    makeStat(
      "Sans alt",
      data.missingAlt,
      data.missingAlt > 0 ? "text-feedback-warning-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Médias">
      <GovernanceDomainContext>
        Ce flag gouverne la <span className="font-medium text-foreground">galerie médias</span> des
        produits. Le niveau <code className="font-mono text-[10px]">optimization</code> active le
        diagnostic texte alternatif. Le niveau{" "}
        <code className="font-mono text-[10px]">automation</code> complète automatiquement les alt
        manquants à l'upload.
      </GovernanceDomainContext>
      {data.totalAssets > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucun média enregistré." />
      )}
    </GovernancePanelShell>
  );
}
