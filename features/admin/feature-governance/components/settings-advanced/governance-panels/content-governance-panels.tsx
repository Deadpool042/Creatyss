import {
  getBlogGovernanceData,
  getContentSeoGovernanceData,
  getHomepageGovernanceData,
} from "@/features/admin/feature-governance/queries/get-content-governance-data.query";

import {
  GovernanceDomainContext,
  GovernanceEmptyState,
  GovernancePanelShell,
  GovernanceStatGrid,
  makeStat,
  type GovernanceStatItem,
} from "../governance-panel-primitives";

export async function BlogGovernancePanel() {
  const data = await getBlogGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Articles", value: data.total },
    makeStat(
      "Publiés",
      data.active,
      data.active > 0 ? "text-feedback-success-foreground" : undefined
    ),
    { label: "Brouillons", value: data.draft },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Blog">
      <GovernanceDomainContext>
        Ce flag gouverne le <span className="font-medium text-foreground">module blog</span> —
        articles, catégories, SEO par article. Le niveau <code className="font-mono text-[10px]">draft</code>
        conserve l'édition admin ; <code className="font-mono text-[10px]">publish</code> ajoute
        la diffusion storefront des articles.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucun article de blog enregistré." />
      )}
    </GovernancePanelShell>
  );
}

export async function HomepageGovernancePanel() {
  const data = await getHomepageGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Sections", value: data.totalSections },
    { label: "Blocs", value: data.totalBlocks },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Homepage">
      <GovernanceDomainContext>
        Ce flag pilote la{" "}
        <span className="font-medium text-foreground">convention de copy unifiée</span> pour la
        homepage — sections, blocs, traductions multilingues. Il conditionne l'assemblage de la
        page d'accueil storefront.
      </GovernanceDomainContext>
      {data.totalSections > 0 ? (
        <GovernanceStatGrid stats={stats} columns={2} />
      ) : (
        <GovernanceEmptyState message="Aucune section homepage enregistrée." />
      )}
    </GovernancePanelShell>
  );
}

export async function ContentSeoGovernancePanel() {
  const data = await getContentSeoGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Fiches SEO", value: data.totalMeta },
    makeStat(
      "Actives",
      data.activeMeta,
      data.activeMeta > 0 ? "text-feedback-success-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · SEO global">
      <GovernanceDomainContext>
        Ce flag gouverne les{" "}
        <span className="font-medium text-foreground">métadonnées SEO globales</span> — pages,
        blog, homepage. Il conditionne la génération des balises{" "}
        <code className="font-mono text-[10px]">{"<head>"}</code> et des sitemaps storefront.
      </GovernanceDomainContext>
      {data.totalMeta > 0 ? (
        <GovernanceStatGrid stats={stats} columns={2} />
      ) : (
        <GovernanceEmptyState message="Aucune métadonnée SEO enregistrée." />
      )}
    </GovernancePanelShell>
  );
}
