import { Clock3, FolderTree, ImageIcon, Sparkles, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  AdminSplitDetailFact,
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import type { AdminCategoryDetail } from "../../types";

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function getStatusLabel(status: AdminCategoryDetail["status"]) {
  switch (status) {
    case "active":
      return "Publiée";
    case "draft":
      return "Brouillon";
    case "inactive":
      return "Inactive";
    case "archived":
      return "Archivée";
    default:
      return status;
  }
}

function getStatusToneClassName(status: AdminCategoryDetail["status"]) {
  switch (status) {
    case "active":
      return "border-feedback-success-border/50 bg-feedback-success-surface/30 text-feedback-success-foreground";
    case "draft":
      return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200";
    case "archived":
      return "border-feedback-error-border/35 bg-feedback-error-surface/20 text-feedback-error-foreground";
    default:
      return "border-surface-border bg-surface-subtle text-muted-foreground";
  }
}

export function CategoryDetailSummary({
  category,
  archived = false,
}: Readonly<{
  category: AdminCategoryDetail;
  archived?: boolean;
}>) {
  const seoFields = [
    category.seo.metaTitle,
    category.seo.metaDescription,
    category.seo.openGraphTitle,
    category.seo.twitterTitle,
  ].filter((value) => typeof value === "string" && value.trim().length > 0).length;
  const seoHealthLabel =
    seoFields >= 3 ? "Éditorial prêt" : seoFields >= 1 ? "À compléter" : "Non renseigné";
  const mediaHealthLabel = category.primaryImageUrl ? "Visuel lié" : "Sans visuel";

  return (
    <AdminSplitDetailSectionCard className="overflow-hidden border-surface-border/60 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-panel)_94%,white)_0%,color-mix(in_srgb,var(--surface-panel)_78%,var(--shell-surface))_100%)]">
      <AdminSplitDetailSectionHeader
        eyebrow="Lecture rapide"
        title={category.name}
        description={
          archived
            ? "Cette catégorie reste lisible pour audit ou restauration, mais n’est plus exploitable tant qu’elle reste archivée."
            : "Relisez l’état métier de la catégorie avant de modifier sa structure, son image ou son SEO."
        }
      />

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge variant="outline" className={getStatusToneClassName(category.status)}>
          <Tag className="size-3.5" />
          {getStatusLabel(category.status)}
        </Badge>
        {category.isFeatured ? (
          <Badge variant="outline" className="border-primary/25 bg-primary/8 text-foreground">
            <Sparkles className="size-3.5" />
            Mise en avant
          </Badge>
        ) : null}
        <Badge variant="outline" className="border-surface-border/70 bg-surface-panel/60 text-foreground">
          <Clock3 className="size-3.5" />
          {dateTimeFormatter.format(new Date(category.updatedAt))}
        </Badge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <AdminSplitDetailFact
          label="Parent"
          value={category.parentName ?? "Racine catalogue"}
          description={category.parentName ? "Rattachée à une hiérarchie existante." : "Catégorie de premier niveau."}
        />
        <AdminSplitDetailFact
          label="Slug"
          value={<span className="font-mono text-xs sm:text-sm">{category.slug}</span>}
          description="Identifiant utilisé dans les routes et le référencement."
        />
        <AdminSplitDetailFact
          label="SEO"
          value={seoHealthLabel}
          description="Lecture rapide des métadonnées éditoriales déjà renseignées."
        />
        <AdminSplitDetailFact
          label="Image"
          value={mediaHealthLabel}
          description="Présence ou non d’un visuel principal pour la catégorie."
        />
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-surface-border/60 bg-surface-subtle/25 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FolderTree className="size-4 text-muted-foreground" />
            Positionnement catalogue
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {category.parentName
              ? `Cette catégorie hérite d’une lecture hiérarchique depuis « ${category.parentName} ».`
              : "Cette catégorie structure directement un niveau racine de la navigation boutique."}
          </p>
        </div>

        <div className="rounded-2xl border border-surface-border/60 bg-surface-subtle/25 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ImageIcon className="size-4 text-muted-foreground" />
            Hygiène de publication
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {category.primaryImageUrl
              ? "Le visuel principal est déjà attaché. Vérifiez surtout cohérence SEO et mise en avant."
              : "Ajoutez un visuel principal si la catégorie doit être reconnue rapidement dans les parcours catalogue."}
          </p>
        </div>
      </div>
    </AdminSplitDetailSectionCard>
  );
}
