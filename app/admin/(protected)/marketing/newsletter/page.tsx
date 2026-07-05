import { Mail } from "lucide-react";
import Link from "next/link";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { AdminFeatureDisabledState } from "@/components/admin/shared/admin-feature-disabled-state";
import { Button } from "@/components/ui/button";
import { isNewsletterFeatureActive } from "@/features/admin/marketing/queries/is-newsletter-feature-active.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { listAdminNewsletterSubscribers } from "@/features/admin/marketing/newsletter/queries/list-admin-newsletter-subscribers.query";
import { getAdminNewsletterAutomationSnapshot } from "@/features/admin/marketing/newsletter/queries/get-admin-newsletter-automation-snapshot.query";
import { MarketingRouteNav } from "@/features/admin/marketing/components/marketing-route-nav";
import { AdminNewsletterAutomationPanel } from "@/features/admin/marketing/newsletter/components/admin-newsletter-automation-panel";
import { AdminNewsletterSegmentationPanel } from "@/features/admin/marketing/newsletter/components/admin-newsletter-segmentation-panel";
import { AdminNewsletterSubscribersList } from "@/features/admin/marketing/newsletter/components/admin-newsletter-subscribers-list";
import { AdminNewsletterSubscriberCreateForm } from "@/features/admin/marketing/newsletter/components/admin-newsletter-subscriber-create-form";
import type {
  AdminNewsletterSubscriberCustomerLinkFilter,
  AdminNewsletterSubscriberRecencyFilter,
  AdminNewsletterSubscriberSourceFilter,
  AdminNewsletterSubscriberStatusFilter,
} from "@/features/admin/marketing/newsletter/types/admin-newsletter-subscriber.types";
import {
  ADMIN_NEWSLETTER_CAMPAIGNS_PATH,
  type AdminNewsletterSearchParams,
} from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";

export const dynamic = "force-dynamic";

type AdminMarketingNewsletterPageProps = Readonly<{
  searchParams: Promise<{
    newsletter_created?: string;
    newsletter_error?: string;
    status?: string;
    source?: string;
    customerLink?: string;
    recency?: string;
  }>;
}>;

function parseStatusFilter(
  value: string | undefined
): AdminNewsletterSubscriberStatusFilter | undefined {
  switch (value) {
    case "SUBSCRIBED":
    case "UNSUBSCRIBED":
    case "BOUNCED":
    case "PENDING":
      return value;
    default:
      return undefined;
  }
}

function parseSourceFilter(
  value: string | undefined
): AdminNewsletterSubscriberSourceFilter | undefined {
  switch (value) {
    case "admin":
    case "storefront":
      return value;
    default:
      return undefined;
  }
}

function parseCustomerLinkFilter(
  value: string | undefined
): AdminNewsletterSubscriberCustomerLinkFilter | undefined {
  switch (value) {
    case "linked":
    case "unlinked":
      return value;
    default:
      return undefined;
  }
}

function parseRecencyFilter(
  value: string | undefined
): AdminNewsletterSubscriberRecencyFilter | undefined {
  switch (value) {
    case "recent":
      return value;
    default:
      return undefined;
  }
}

function getErrorMessage(code: string): string {
  switch (code) {
    case "duplicate_email":
      return "Cet email est déjà inscrit.";
    case "invalid_input":
      return "Formulaire invalide — vérifiez les champs.";
    case "missing_store":
      return "Aucune boutique trouvée.";
    default:
      return "L'ajout de l'abonné a échoué.";
  }
}

export default async function AdminMarketingNewsletterPage({
  searchParams,
}: AdminMarketingNewsletterPageProps) {
  const featureActive = await isNewsletterFeatureActive();

  if (!featureActive) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Newsletter"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Marketing", href: "/admin/marketing/overview" },
          { label: "Newsletter" },
        ]}
        showTitleInContent={false}
      >
        <MarketingRouteNav />
        <AdminFeatureDisabledState
          capabilityName="Newsletter"
          description="Cette capacité est pilotée dans les Réglages avancés. Activez le niveau requis sur engagement.newsletter pour ouvrir les abonnés."
          icon={Mail}
        />
      </AdminPageShell>
    );
  }

  const [basicLevelMet, segmentationLevelMet, automationSnapshot] = await Promise.all([
    meetsFeatureLevel("engagement.newsletter", "basic"),
    meetsFeatureLevel("engagement.newsletter", "segmentation"),
    getAdminNewsletterAutomationSnapshot(),
  ]);

  if (!basicLevelMet) {
    return (
      <AdminPageShell
        scrollBehavior="page"
        title="Newsletter"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Marketing", href: "/admin/marketing/overview" },
          { label: "Newsletter" },
        ]}
        showTitleInContent={false}
      >
        <MarketingRouteNav />
        <AdminComingSoon
          title="Newsletter"
          description="Gérez les abonnés, composez des campagnes email, suivez les taux d'ouverture et de clic. Segmentation par comportement d'achat."
          docRef="docs/domains/cross-cutting/newsletter.md"
          requirements={["Niveau requis : basic", "Capability : marketing.newsletterRead"]}
          icon={Mail}
        />
      </AdminPageShell>
    );
  }

  const resolvedSearchParams = await searchParams;
  const filters = {
    status: segmentationLevelMet ? parseStatusFilter(resolvedSearchParams.status) : undefined,
    source: segmentationLevelMet ? parseSourceFilter(resolvedSearchParams.source) : undefined,
    customerLink: segmentationLevelMet
      ? parseCustomerLinkFilter(resolvedSearchParams.customerLink)
      : undefined,
    recency: segmentationLevelMet ? parseRecencyFilter(resolvedSearchParams.recency) : undefined,
  } satisfies AdminNewsletterSearchParams;
  const subscriberResult = await listAdminNewsletterSubscribers(filters);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Newsletter"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Newsletter" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
      topbarAction={
        <Button asChild variant="outline" size="sm">
          <Link href={ADMIN_NEWSLETTER_CAMPAIGNS_PATH}>Campagnes</Link>
        </Button>
      }
    >
      <MarketingRouteNav />
      <div className="grid gap-6">
        {resolvedSearchParams.newsletter_created ? (
          <p className="rounded-lg border border-feedback-success-border bg-feedback-success-surface px-3 py-2 text-sm text-feedback-success-foreground">
            Abonné ajouté.
          </p>
        ) : null}
        {resolvedSearchParams.newsletter_error ? (
          <p className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-2 text-sm text-feedback-error-foreground">
            {getErrorMessage(resolvedSearchParams.newsletter_error)}
          </p>
        ) : null}

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-foreground">
            Nouvel abonné
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Ajout manuel à la liste de diffusion. Aucune campagne n&apos;est créée ni envoyée pour
            l&apos;instant (niveau « basic » — référentiel des abonnés uniquement).
          </p>
          <AdminNewsletterSubscriberCreateForm />
        </section>

        {segmentationLevelMet ? (
          <AdminNewsletterSegmentationPanel counts={subscriberResult.counts} filters={filters} />
        ) : (
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Segmentation</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Niveau `segmentation` non actif : le référentiel reste consultable au niveau `basic`,
              sans filtres opératoires avancés.
            </p>
          </section>
        )}

        <AdminNewsletterAutomationPanel snapshot={automationSnapshot} />

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">Abonnés</h2>
          <AdminNewsletterSubscribersList subscribers={subscriberResult.items} />
        </section>
      </div>
    </AdminPageShell>
  );
}
