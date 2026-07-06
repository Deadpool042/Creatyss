import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ImageIcon,
  Layers3,
  Settings2,
  Sparkles,
  Tag,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminFeatureFlagView } from "@/features/admin/feature-governance/queries/list-admin-feature-flags.query";
import {
  ADMIN_CATALOG_MEDIA_PATH,
  ADMIN_CATALOG_MEDIA_SETTINGS_PATH,
  ADMIN_CATALOG_OVERVIEW_PATH,
  ADMIN_CATALOG_PRICING_PATH,
} from "@/features/admin/catalog/shared/admin-catalog-routes";
import { CatalogRelatedProductsSection } from "@/features/admin/settings/components/catalog-related-products-section";
import { cn } from "@/lib/utils";

type CatalogSettingsHubProps = Readonly<{
  relatedFlag: AdminFeatureFlagView | null;
  pricing: {
    priceLists: boolean;
    scheduledPricing: boolean;
  };
  media: {
    optimization: boolean;
    generation: boolean;
    automation: boolean;
  };
  relatedProducts: {
    storefront: boolean;
    manage: boolean;
  };
}>;

type CapabilityTone = "active" | "upgrade" | "managed";

const TONE_STYLES: Record<CapabilityTone, string> = {
  active:
    "border-feedback-success-border/50 bg-feedback-success-surface/30 text-feedback-success-foreground",
  upgrade: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  managed: "border-sky-500/25 bg-sky-500/10 text-sky-800 dark:text-sky-200",
};

export function CatalogSettingsHub({
  relatedFlag,
  pricing,
  media,
  relatedProducts,
}: CatalogSettingsHubProps) {
  const activeLevers = [
    pricing.priceLists,
    pricing.scheduledPricing,
    media.optimization,
    media.generation,
    media.automation,
    relatedProducts.storefront,
    relatedProducts.manage,
  ].filter(Boolean).length;

  const pricingLevelLabel = pricing.scheduledPricing
    ? "Tarification planifiée"
    : pricing.priceLists
      ? "Listes de prix"
      : "Prix de base";
  const mediaLevelLabel = media.automation
    ? "Automatisation"
    : media.generation
      ? "Génération"
      : media.optimization
        ? "Optimisation"
        : "Basique";
  const relatedLevelLabel = relatedProducts.manage
    ? "Gestion"
    : relatedProducts.storefront
      ? "Storefront"
      : "Inactif";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Centralisez ici les réglages du catalogue, distinguez ce qui se pilote dans l&apos;admin
          de ce qui dépend de l&apos;environnement, et repérez immédiatement les capacités déjà
          ouvertes par votre niveau.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <CatalogStatCard
            label="Pilotage admin"
            value={`${activeLevers} leviers actifs`}
            hint="Fonctions déjà ouvertes dans les modules catalogue."
          />
          <CatalogStatCard
            label="Tarification"
            value={pricingLevelLabel}
            hint="Niveau courant des règles tarifaires."
          />
          <CatalogStatCard
            label="Médias"
            value={mediaLevelLabel}
            hint="Profondeur des outils médias côté produit."
          />
          <CatalogStatCard
            label="Produits associés"
            value={relatedLevelLabel}
            hint="Exposition storefront et édition admin des relations."
          />
        </div>
      </div>

      <section className="rounded-3xl border border-surface-border/60 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-panel)_94%,white)_0%,color-mix(in_srgb,var(--surface-panel)_78%,var(--shell-surface))_100%)] p-5 shadow-card">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background/80 shadow-sm">
            <Settings2 className="size-5 text-foreground/80" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Gouvernance catalogue
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              Une lecture unique des leviers, des niveaux et de l&apos;infra
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              L&apos;admin gère ici les options métier du catalogue. Les niveaux ouvrent les
              fonctions avancées, tandis que la chaîne média et le stockage restent documentés dans
              leur propre surface de configuration.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <CatalogSectionCard
          icon={<Sparkles className="size-4 text-muted-foreground" />}
          eyebrow="Merchandising"
          title="Produits associés"
          description="Suggestions storefront et édition des relations de cross-sell, up-sell et similaires."
        >
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <CapabilityCard
                label="Affichage storefront"
                value={relatedProducts.storefront ? "Disponible" : "Niveau requis"}
                tone={relatedProducts.storefront ? "active" : "upgrade"}
                description="Affiche les suggestions publiques sur les fiches produit."
              />
              <CapabilityCard
                label="Gestion admin"
                value={relatedProducts.manage ? "Disponible" : "Upgrade utile"}
                tone={relatedProducts.manage ? "active" : "upgrade"}
                description="Débloque l’édition fine des relations depuis l’admin."
              />
            </div>

            <CatalogRelatedProductsSection flag={relatedFlag} />
          </div>
        </CatalogSectionCard>

        <CatalogSectionCard
          icon={<Tag className="size-4 text-muted-foreground" />}
          eyebrow="Niveaux produit"
          title="Tarification"
          description="Gestion des prix simples, des listes de prix et des fenêtres tarifaires."
        >
          <div className="space-y-3">
            <CapabilityRow
              label="Prix de base"
              detail="Toujours disponible dans la fiche produit."
              tone="active"
              value="Actif"
            />
            <CapabilityRow
              label="Listes de prix"
              detail="Ajoute les grilles multi-prix et le module dédié."
              tone={pricing.priceLists ? "active" : "upgrade"}
              value={pricing.priceLists ? "Actif" : "Niveau requis"}
            />
            <CapabilityRow
              label="Tarification planifiée"
              detail="Ajoute les fenêtres datées sur les prix déjà gérés."
              tone={pricing.scheduledPricing ? "active" : "upgrade"}
              value={pricing.scheduledPricing ? "Actif" : "Upgrade utile"}
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm">
                <Link href={ADMIN_CATALOG_PRICING_PATH}>
                  Ouvrir la tarification
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={ADMIN_CATALOG_OVERVIEW_PATH}>Retour au pilotage</Link>
              </Button>
            </div>
          </div>
        </CatalogSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <CatalogSectionCard
          icon={<ImageIcon className="size-4 text-muted-foreground" />}
          eyebrow="Chaîne média"
          title="Médias et enrichissement"
          description="Lecture combinée de la médiathèque, du niveau média produit et de la configuration infra."
        >
          <div className="space-y-3">
            <CapabilityRow
              label="Diagnostic alt manquant"
              detail="Repérage des médias incomplets dans les surfaces produit."
              tone={media.optimization ? "active" : "upgrade"}
              value={media.optimization ? "Actif" : "Niveau requis"}
            />
            <CapabilityRow
              label="Génération assistée"
              detail="Propose la génération déterministe des textes alternatifs."
              tone={media.generation ? "active" : "upgrade"}
              value={media.generation ? "Actif" : "Upgrade utile"}
            />
            <CapabilityRow
              label="Automatisation"
              detail="Complétion automatique au moment de l’ajout de l’image."
              tone={media.automation ? "active" : "upgrade"}
              value={media.automation ? "Actif" : "Upgrade utile"}
            />
            <CapabilityRow
              label="Stockage et pipeline"
              detail="Pilotés par l’environnement, documentés dans la configuration médias."
              tone="managed"
              value="Infra"
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm">
                <Link href={ADMIN_CATALOG_MEDIA_PATH}>
                  Ouvrir la médiathèque
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={ADMIN_CATALOG_MEDIA_SETTINGS_PATH}>Voir la configuration média</Link>
              </Button>
            </div>
          </div>
        </CatalogSectionCard>

        <CatalogSectionCard
          icon={<Layers3 className="size-4 text-muted-foreground" />}
          eyebrow="Lecture d’exploitation"
          title="Repères intuitifs"
          description="Le cadrage minimal pour savoir où agir sans chercher module par module."
        >
          <div className="space-y-3">
            <CapabilityCard
              label="Admin pilotable"
              value="Réglable ici"
              tone="active"
              description="Merchandising, activations métier et orientation catalogue."
            />
            <CapabilityCard
              label="Module dédié"
              value="Actionner ailleurs"
              tone="managed"
              description="La tarification avancée se gère dans son module, pas dans un simple toggle."
            />
            <CapabilityCard
              label="Infra"
              value="Documenté"
              tone="managed"
              description="Le stockage et le pipeline image restent pilotés par l’environnement."
            />

            <div className="rounded-2xl border border-surface-border/60 bg-surface-subtle/30 p-4">
              <p className="text-sm font-medium text-foreground">
                Doctrine recommandée
              </p>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                <li>Utiliser le pilotage pour lire le domaine, pas pour le configurer.</li>
                <li>Entrer dans tarification ou médias quand un module complet est nécessaire.</li>
                <li>Garder cette page comme hub de compréhension et d’orientation.</li>
              </ul>
            </div>
          </div>
        </CatalogSectionCard>
      </div>
    </div>
  );
}

function CatalogSectionCard({
  icon,
  eyebrow,
  title,
  description,
  children,
}: Readonly<{
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="rounded-2xl border border-surface-border/60 bg-card p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl border border-surface-border/60 bg-surface-subtle/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}

function CatalogStatCard({
  label,
  value,
  hint,
}: Readonly<{
  label: string;
  value: string;
  hint: string;
}>) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-card p-4 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{hint}</p>
    </div>
  );
}

function CapabilityRow({
  label,
  detail,
  value,
  tone,
}: Readonly<{
  label: string;
  detail: string;
  value: string;
  tone: CapabilityTone;
}>) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-surface-border/60 bg-surface-subtle/20 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
      </div>
      <StatusBadge tone={tone}>{value}</StatusBadge>
    </div>
  );
}

function CapabilityCard({
  label,
  value,
  description,
  tone,
}: Readonly<{
  label: string;
  value: string;
  description: string;
  tone: CapabilityTone;
}>) {
  return (
    <Card className="rounded-2xl border-surface-border/60 bg-surface-subtle/15 py-0 shadow-none">
      <CardHeader className="gap-3 px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold">{label}</CardTitle>
            <CardDescription className="text-sm leading-6">{description}</CardDescription>
          </div>
          <StatusBadge tone={tone}>{value}</StatusBadge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0" />
    </Card>
  );
}

function StatusBadge({
  tone,
  children,
}: Readonly<{
  tone: CapabilityTone;
  children: React.ReactNode;
}>) {
  return (
    <Badge variant="outline" className={cn("h-6 rounded-full px-2.5", TONE_STYLES[tone])}>
      {tone === "active" ? <CheckCircle2 className="size-3.5" /> : null}
      {children}
    </Badge>
  );
}
