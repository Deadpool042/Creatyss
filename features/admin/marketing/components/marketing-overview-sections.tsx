/**
 * marketing-overview-sections.tsx
 * Cockpit marketing — toutes les données sont des mocks assumés.
 * Domaines : discounts (prisma/optional/commerce/discounts.prisma),
 *            newsletter (prisma/optional/engagement/newsletter.prisma),
 *            automations (à venir).
 */
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Megaphone,
  Percent,
  Tag,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

const DISCOUNTS_PATH = "/admin/marketing/discounts";
const NEWSLETTER_PATH = "/admin/marketing/newsletter";
const AUTOMATIONS_PATH = "/admin/marketing/automations";

// ── Mock data (labellisé explicitement) ──────────────────────────────────

const MOCK_DISCOUNTS = {
  total: 6,
  active: 3,
  scheduled: 2,
  expired: 1,
  topCode: "SUMMER25",
  topUsage: 143,
};

const MOCK_NEWSLETTER = {
  subscribers: 847,
  activeSubscribers: 791,
  growthPercent: 12,
  campaigns: { total: 12, sent: 3, drafts: 9 },
  lastCampaignOpenRate: 38.4,
  lastCampaignDate: "2 juin 2026",
};

const MOCK_AUTOMATIONS = {
  active: 2,
  inactive: 0,
  triggered30d: 412,
};

// ── Sub-components ────────────────────────────────────────────────────────

function HeroMetric({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-5 py-4 shadow-sm backdrop-blur-sm",
        accent
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {label}
        <span className="ml-1.5 font-normal text-muted-foreground/40">(mock)</span>
      </p>
      <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
    </div>
  );
}

function SectionCard({
  eyebrow,
  title,
  href,
  children,
}: {
  eyebrow: string;
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 rounded-full border border-surface-border/60 bg-surface-panel px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-panel-soft hover:text-foreground"
        >
          Gérer <ArrowRight className="size-3" />
        </Link>
      </div>
      {children}
    </section>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────

export function MarketingOverviewSections() {
  return (
    <div>
      {/* Hero */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <HeroMetric
          label="Codes promo actifs"
          value={String(MOCK_DISCOUNTS.active)}
          hint={`${MOCK_DISCOUNTS.scheduled} planifié${MOCK_DISCOUNTS.scheduled > 1 ? "s" : ""} · ${MOCK_DISCOUNTS.expired} expiré`}
        />
        <HeroMetric
          label="Abonnés newsletter"
          value={MOCK_NEWSLETTER.subscribers.toLocaleString("fr-FR")}
          hint={`+${MOCK_NEWSLETTER.growthPercent}% ce mois · ${MOCK_NEWSLETTER.activeSubscribers} actifs`}
          accent="bg-emerald-50/60"
        />
        <HeroMetric
          label="Taux d'ouverture"
          value={`${MOCK_NEWSLETTER.lastCampaignOpenRate}%`}
          hint={`Dernière campagne — ${MOCK_NEWSLETTER.lastCampaignDate}`}
        />
        <HeroMetric
          label="Automations actives"
          value={String(MOCK_AUTOMATIONS.active)}
          hint={`${MOCK_AUTOMATIONS.triggered30d.toLocaleString("fr-FR")} déclenchements / 30 j`}
        />
      </div>

      {/* Body */}
      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Codes promo */}
        <SectionCard eyebrow="Réductions" title="Codes promo" href={DISCOUNTS_PATH}>
          <div className="space-y-3">
            {[
              {
                code: MOCK_DISCOUNTS.topCode,
                label: "Code le plus utilisé",
                detail: `${MOCK_DISCOUNTS.topUsage} utilisations`,
                icon: Tag,
              },
              {
                code: `${MOCK_DISCOUNTS.active} actif${MOCK_DISCOUNTS.active > 1 ? "s" : ""}`,
                label: "Promos en cours",
                detail: "Vérifier les dates de fin",
                icon: Percent,
              },
              {
                code: `${MOCK_DISCOUNTS.scheduled} planifié${MOCK_DISCOUNTS.scheduled > 1 ? "s" : ""}`,
                label: "À venir",
                detail: "Démarrage automatique configuré",
                icon: TrendingUp,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-subtle">
                  <item.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-surface-subtle px-2 py-1 font-mono text-[12px] font-medium text-foreground">
                  {item.code}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Newsletter */}
        <SectionCard eyebrow="Newsletter" title="Campagnes email" href={NEWSLETTER_PATH}>
          <div className="space-y-3">
            {[
              {
                label: "Abonnés actifs",
                value: MOCK_NEWSLETTER.activeSubscribers.toLocaleString("fr-FR"),
                detail: "Adresses confirmées, non désabonnées",
                icon: Users,
              },
              {
                label: "Campagnes envoyées",
                value: String(MOCK_NEWSLETTER.campaigns.sent),
                detail: `${MOCK_NEWSLETTER.campaigns.drafts} brouillon${MOCK_NEWSLETTER.campaigns.drafts > 1 ? "s" : ""} en attente`,
                icon: Mail,
              },
              {
                label: "Taux moyen d'ouverture",
                value: `${MOCK_NEWSLETTER.lastCampaignOpenRate}%`,
                detail: "Dernière campagne envoyée",
                icon: Megaphone,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-subtle">
                  <item.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Automations */}
        <SectionCard eyebrow="Engagement" title="Automations" href={AUTOMATIONS_PATH}>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-subtle">
                <Zap className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-foreground">
                  {MOCK_AUTOMATIONS.active} flux actif
                  {MOCK_AUTOMATIONS.active > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  Panier abandonné · Email post-achat
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-feedback-success-surface/60 px-2 py-1 text-[11px] font-medium text-feedback-success-foreground">
                Actif
              </span>
            </div>
            <div className="rounded-xl border border-surface-border/40 bg-surface-panel/40 px-3 py-2.5">
              <p className="text-xs text-muted-foreground">
                <strong className="font-medium text-foreground">
                  {MOCK_AUTOMATIONS.triggered30d.toLocaleString("fr-FR")}
                </strong>{" "}
                déclenchements ces 30 derniers jours.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Note mock */}
        <section className="flex flex-col justify-between rounded-2xl border border-surface-border/40 bg-surface-panel/30 p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Module marketing
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Codes promo, newsletter et automations. Schéma Prisma activé —
              interface d'administration en cours d'implémentation.
            </p>
          </div>
          <p className="mt-4 text-[11px] leading-5 text-muted-foreground/50">
            Données de cette page : <em>mocks de démonstration</em>.
            Les vraies queries seront connectées à{" "}
            <code className="rounded bg-surface-subtle px-1 font-mono">
              Discount
            </code>
            ,{" "}
            <code className="rounded bg-surface-subtle px-1 font-mono">
              NewsletterCampaign
            </code>{" "}
            et aux futurs modèles Automation.
          </p>
        </section>
      </div>
    </div>
  );
}
