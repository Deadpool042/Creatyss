import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Percent,
  Settings2,
  Truck,
  Users,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ADMIN_PAYMENTS_SETTINGS_PATH } from "@/features/admin/commerce/payments/shared/admin-payments-routes";
import { ADMIN_SHIPPING_SETTINGS_PATH } from "@/features/admin/commerce/shipping/shared/admin-shipping-routes";
import { ADMIN_TAXATION_PATH } from "@/features/admin/commerce/taxation/shared/admin-taxation-routes";
import { ADMIN_COMMERCE_OVERVIEW_PATH } from "@/features/admin/commerce/shared/admin-commerce-routes";
import { CardPaymentStatusNotice } from "@/features/admin/settings/components/card-payment-status-notice";
import type { CardPaymentStatus } from "@/features/admin/settings/queries/get-card-payment-status.query";
import { cn } from "@/lib/utils";

type CommerceSettingsHubProps = Readonly<{
  cardPaymentStatus: CardPaymentStatus;
  taxationActive: boolean;
}>;

type CapabilityTone = "active" | "upgrade" | "managed";

const TONE_STYLES: Record<CapabilityTone, string> = {
  active:
    "border-feedback-success-border/50 bg-feedback-success-surface/30 text-feedback-success-foreground",
  upgrade: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  managed: "border-sky-500/25 bg-sky-500/10 text-sky-800 dark:text-sky-200",
};

export function CommerceSettingsHub({
  cardPaymentStatus,
  taxationActive,
}: CommerceSettingsHubProps) {
  const activeLevers = [cardPaymentStatus.isActive, taxationActive].filter(Boolean).length;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Centralisez ici les réglages commerce, distinguez ce qui se pilote dans l&apos;admin de ce
          qui dépend de l&apos;environnement ou d&apos;un module dédié, et repérez immédiatement les
          capacités déjà ouvertes par votre niveau.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <CommerceStatCard
            label="Pilotage admin"
            value={`${activeLevers} leviers actifs`}
            hint="Fonctions déjà ouvertes dans les modules commerce."
          />
          <CommerceStatCard
            label="Paiement carte"
            value={cardPaymentStatus.isActive ? "Actif" : "Inactif"}
            hint="Gouvernance et clés Stripe combinées."
          />
          <CommerceStatCard
            label="TVA"
            value={taxationActive ? "Actif" : "Niveau requis"}
            hint="Règles de taxation par territoire de livraison."
          />
          <CommerceStatCard
            label="Clients"
            value="Module à venir"
            hint="Politiques de compte et rétention des données."
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
              Gouvernance commerce
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              Une lecture unique des leviers, des niveaux et de l&apos;infra
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              L&apos;admin gère ici les options de paiement, de livraison et de taxation. Les
              modules dédiés restent la surface d&apos;action pour les réglages détaillés.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <CommerceSectionCard
          icon={<CreditCard className="size-4 text-muted-foreground" />}
          eyebrow="Encaissement"
          title="Paiements"
          description="Virement bancaire, paiement à l'atelier et paiement carte piloté par l'environnement."
        >
          <div className="space-y-3">
            <CardPaymentStatusNotice status={cardPaymentStatus} />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm">
                <Link href={ADMIN_PAYMENTS_SETTINGS_PATH}>
                  Ouvrir les réglages de paiement
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CommerceSectionCard>

        <CommerceSectionCard
          icon={<Truck className="size-4 text-muted-foreground" />}
          eyebrow="Expédition"
          title="Livraison"
          description="Zones, méthodes et seuils de livraison offerte."
        >
          <div className="space-y-3">
            <CapabilityRow
              label="Zones et méthodes"
              detail="Se gèrent dans le module dédié, pas dans un simple toggle."
              tone="managed"
              value="Module dédié"
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm">
                <Link href={ADMIN_SHIPPING_SETTINGS_PATH}>
                  Ouvrir les réglages de livraison
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CommerceSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <CommerceSectionCard
          icon={<Percent className="size-4 text-muted-foreground" />}
          eyebrow="Fiscalité"
          title="TVA"
          description="Règles de taxation par territoire de livraison (scope boutique, prix TTC)."
        >
          <div className="space-y-3">
            <CapabilityRow
              label="Règles de TVA"
              detail="Territoires, taux et import CSV."
              tone={taxationActive ? "active" : "upgrade"}
              value={taxationActive ? "Actif" : "Niveau requis"}
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm">
                <Link href={ADMIN_TAXATION_PATH}>
                  Ouvrir la TVA
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CommerceSectionCard>

        <CommerceSectionCard
          icon={<Users className="size-4 text-muted-foreground" />}
          eyebrow="Relation client"
          title="Clients"
          description="Politiques de compte, rétention des données et paramètres RGPD."
        >
          <div className="space-y-3">
            <CapabilityCard
              label="Réglages clients"
              value="Module à venir"
              tone="managed"
              description="Ces réglages seront disponibles avec la gestion avancée des clients (docs/roadmap/h3-administration-avancee/lot-clients-historique-crm.md)."
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild variant="outline" size="sm">
                <Link href={ADMIN_COMMERCE_OVERVIEW_PATH}>Retour au pilotage</Link>
              </Button>
            </div>
          </div>
        </CommerceSectionCard>
      </div>
    </div>
  );
}

function CommerceSectionCard({
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

function CommerceStatCard({
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
