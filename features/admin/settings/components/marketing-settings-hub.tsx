import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, Percent, Settings2, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { ADMIN_DISCOUNTS_PATH } from "@/features/admin/marketing/discounts/shared/admin-discounts-routes";
import { ADMIN_NEWSLETTER_PATH } from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";
import { cn } from "@/lib/utils";

type MarketingSettingsHubProps = Readonly<{
  discounts: {
    simple: boolean;
    rules: boolean;
    automation: boolean;
  };
  newsletter: {
    basic: boolean;
    segmentation: boolean;
  };
  automationsActive: boolean;
}>;

type CapabilityTone = "active" | "upgrade" | "managed";

const TONE_STYLES: Record<CapabilityTone, string> = {
  active:
    "border-feedback-success-border/50 bg-feedback-success-surface/30 text-feedback-success-foreground",
  upgrade: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  managed: "border-sky-500/25 bg-sky-500/10 text-sky-800 dark:text-sky-200",
};

export function MarketingSettingsHub({
  discounts,
  newsletter,
  automationsActive,
}: MarketingSettingsHubProps) {
  const activeLevers = [
    discounts.simple,
    discounts.rules,
    discounts.automation,
    newsletter.basic,
    newsletter.segmentation,
    automationsActive,
  ].filter(Boolean).length;

  const discountsLevelLabel = discounts.automation
    ? "Automation"
    : discounts.rules
      ? "Règles"
      : discounts.simple
        ? "Simple"
        : "Inactif";
  const newsletterLevelLabel = newsletter.segmentation
    ? "Segmentation"
    : newsletter.basic
      ? "Basique"
      : "Inactif";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Centralisez ici les réglages marketing, distinguez ce qui se pilote dans l&apos;admin de
          ce qui dépend d&apos;un niveau de capacité, et repérez immédiatement les fonctions déjà
          ouvertes.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MarketingStatCard
            label="Pilotage admin"
            value={`${activeLevers} leviers actifs`}
            hint="Fonctions déjà ouvertes dans les modules marketing."
          />
          <MarketingStatCard
            label="Codes promo"
            value={discountsLevelLabel}
            hint="Niveau courant des remises (commerce.discounts)."
          />
          <MarketingStatCard
            label="Newsletter"
            value={newsletterLevelLabel}
            hint="Abonnés et campagnes (engagement.newsletter)."
          />
          <MarketingStatCard
            label="Automations"
            value={automationsActive ? "Actif" : "Niveau requis"}
            hint="Flux d'engagement automatisés (engagement.automations)."
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
              Gouvernance marketing
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              Une lecture unique des leviers et des niveaux
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              L&apos;admin gère ici les remises, la newsletter et les automations. Les niveaux
              s&apos;activent dans les Réglages avancés ; les modules dédiés restent la surface
              d&apos;action pour les réglages détaillés.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <MarketingSectionCard
          icon={<Percent className="size-4 text-muted-foreground" />}
          eyebrow="Réductions"
          title="Codes promo"
          description="Codes de réduction, remises ciblées par règles et remises automatiques."
        >
          <div className="space-y-3">
            <CapabilityRow
              label="Remises simples"
              detail="Codes promo à pourcentage ou montant fixe."
              tone={discounts.simple ? "active" : "upgrade"}
              value={discounts.simple ? "Actif" : "Niveau requis"}
            />
            <CapabilityRow
              label="Remises avancées"
              detail="Ciblage par règles sur le catalogue ou le panier."
              tone={discounts.rules ? "active" : "upgrade"}
              value={discounts.rules ? "Actif" : "Upgrade utile"}
            />
            <CapabilityRow
              label="Remises automatiques"
              detail="Application sans code au moment du panier."
              tone={discounts.automation ? "active" : "upgrade"}
              value={discounts.automation ? "Actif" : "Upgrade utile"}
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm">
                <Link href={ADMIN_DISCOUNTS_PATH}>
                  Ouvrir les codes promo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </MarketingSectionCard>

        <MarketingSectionCard
          icon={<Mail className="size-4 text-muted-foreground" />}
          eyebrow="Newsletter"
          title="Campagnes email"
          description="Abonnés, campagnes et segmentation de l'audience."
        >
          <div className="space-y-3">
            <CapabilityRow
              label="Abonnés et campagnes"
              detail="Collecte des abonnés et envoi de campagnes."
              tone={newsletter.basic ? "active" : "upgrade"}
              value={newsletter.basic ? "Actif" : "Niveau requis"}
            />
            <CapabilityRow
              label="Segmentation"
              detail="Ciblage des campagnes par segments d'audience."
              tone={newsletter.segmentation ? "active" : "upgrade"}
              value={newsletter.segmentation ? "Actif" : "Upgrade utile"}
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm">
                <Link href={ADMIN_NEWSLETTER_PATH}>
                  Ouvrir la newsletter
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </MarketingSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <MarketingSectionCard
          icon={<Zap className="size-4 text-muted-foreground" />}
          eyebrow="Engagement"
          title="Automations"
          description="Flux automatisés : panier abandonné, email post-achat et relances."
        >
          <div className="space-y-3">
            <CapabilityRow
              label="Référentiel d'automations"
              detail="Définitions, jobs et historique d'exécution."
              tone={automationsActive ? "active" : "upgrade"}
              value={automationsActive ? "Actif" : "Niveau requis"}
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm">
                <Link href={ADMIN_AUTOMATIONS_PATH}>
                  Ouvrir les automations
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </MarketingSectionCard>

        <MarketingSectionCard
          icon={<Settings2 className="size-4 text-muted-foreground" />}
          eyebrow="Lecture d'exploitation"
          title="Repères intuitifs"
          description="Où agir sans chercher module par module."
        >
          <div className="space-y-3">
            <CapabilityRow
              label="Niveaux de capacité"
              detail="S'activent dans les Réglages avancés, pas ici."
              tone="managed"
              value="Gouvernance"
            />
            <CapabilityRow
              label="Modules dédiés"
              detail="Les remises, campagnes et automations se gèrent dans leur module."
              tone="managed"
              value="Module dédié"
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/marketing/overview">Retour au pilotage</Link>
              </Button>
            </div>
          </div>
        </MarketingSectionCard>
      </div>
    </div>
  );
}

function MarketingSectionCard({
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

function MarketingStatCard({
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
