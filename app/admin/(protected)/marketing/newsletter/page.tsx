import { notFound } from "next/navigation";
import { Mail } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { isNewsletterFeatureActive } from "@/features/admin/marketing/queries/is-newsletter-feature-active.query";
import { meetsFeatureLevel } from "@/features/admin/pilotage/queries/get-feature-level-state.query";
import { listAdminNewsletterSubscribers } from "@/features/admin/marketing/newsletter/queries/list-admin-newsletter-subscribers.query";
import { AdminNewsletterSubscribersList } from "@/features/admin/marketing/newsletter/components/admin-newsletter-subscribers-list";
import { AdminNewsletterSubscriberCreateForm } from "@/features/admin/marketing/newsletter/components/admin-newsletter-subscriber-create-form";

export const dynamic = "force-dynamic";

type AdminMarketingNewsletterPageProps = Readonly<{
  searchParams: Promise<{
    newsletter_created?: string;
    newsletter_error?: string;
  }>;
}>;

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
  if (!featureActive) notFound();

  const basicLevelMet = await meetsFeatureLevel("engagement.newsletter", "basic");

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
        showBreadcrumbsInContent={false}
        showTitleInContent={false}
      >
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

  const [subscribers, resolvedSearchParams] = await Promise.all([
    listAdminNewsletterSubscribers(),
    searchParams,
  ]);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Newsletter"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Newsletter" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="table"
    >
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
            Ajout manuel à la liste de diffusion. Aucune campagne n&apos;est
            créée ni envoyée pour l&apos;instant (niveau « basic » —
            référentiel des abonnés uniquement).
          </p>
          <AdminNewsletterSubscriberCreateForm />
        </section>

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
            Abonnés
          </h2>
          <AdminNewsletterSubscribersList subscribers={subscribers} />
        </section>
      </div>
    </AdminPageShell>
  );
}
