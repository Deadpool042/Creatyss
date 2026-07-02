import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { isNewsletterFeatureActive } from "@/features/admin/marketing/queries/is-newsletter-feature-active.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { getAdminNewsletterCampaignDetail } from "@/features/admin/marketing/newsletter/queries/get-admin-newsletter-campaign-detail.query";
import { countSubscribedNewsletterSubscribers } from "@/features/admin/marketing/newsletter/queries/count-subscribed-newsletter-subscribers.query";
import { AdminNewsletterCampaignSendPanel } from "@/features/admin/marketing/newsletter/components/admin-newsletter-campaign-send-panel";
import {
  buildNewsletterEmailHtml,
  buildNewsletterEmailText,
} from "@/features/admin/marketing/newsletter/lib/build-newsletter-email-content";
import {
  ADMIN_NEWSLETTER_PATH,
  ADMIN_NEWSLETTER_CAMPAIGNS_PATH,
} from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";

export const dynamic = "force-dynamic";

type AdminNewsletterCampaignDetailPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

// URL factice affichée dans l'aperçu : le lien réel est généré par abonné à l'envoi.
const PREVIEW_UNSUBSCRIBE_URL = "#lien-de-desinscription-genere-a-l-envoi";

function getStatusLabel(status: string): string {
  switch (status) {
    case "DRAFT":
      return "Brouillon";
    case "SCHEDULED":
      return "Planifiée";
    case "SENDING":
      return "En cours d'envoi";
    case "SENT":
      return "Envoyée";
    case "FAILED":
      return "Échec";
    case "CANCELLED":
      return "Annulée";
    default:
      return status;
  }
}

function getStatusBadgeVariant(status: string): "secondary" | "outline" | "destructive" {
  switch (status) {
    case "SENT":
      return "secondary";
    case "FAILED":
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-surface-border-subtle px-5 py-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default async function AdminNewsletterCampaignDetailPage({
  params,
}: AdminNewsletterCampaignDetailPageProps) {
  const { id: campaignId } = await params;

  const featureActive = await isNewsletterFeatureActive();
  if (!featureActive) notFound();

  const basicLevelMet = await meetsFeatureLevel("engagement.newsletter", "basic");
  if (!basicLevelMet) notFound();

  const [campaign, subscriberCount] = await Promise.all([
    getAdminNewsletterCampaignDetail(campaignId),
    countSubscribedNewsletterSubscribers(),
  ]);

  if (campaign === null) notFound();

  const isDraft = campaign.status === "DRAFT";
  const previewHtml = campaign.bodyHtml
    ? buildNewsletterEmailHtml(campaign.bodyHtml, PREVIEW_UNSUBSCRIBE_URL)
    : null;
  const previewText = campaign.bodyText
    ? buildNewsletterEmailText(campaign.bodyText, PREVIEW_UNSUBSCRIBE_URL)
    : null;

  return (
    <AdminPageShell
      title={campaign.name}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Marketing", href: "/admin/marketing/overview" },
        { label: "Newsletter", href: ADMIN_NEWSLETTER_PATH },
        { label: "Campagnes", href: ADMIN_NEWSLETTER_CAMPAIGNS_PATH },
        { label: campaign.name },
      ]}
      showBreadcrumbsInContent={false}
      contentPreset="detail"
    >
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Campagnes newsletter"
          title={campaign.name}
          description="Prévisualisez le contenu exact de l'email — pied de désinscription inclus — avant de déclencher l'envoi."
          mobileHidden={false}
        />

        <section className="overflow-hidden rounded-[28px] border border-surface-border bg-surface-panel shadow-card">
          <div className="grid gap-0 md:grid-cols-4">
            <DetailMetric label="Statut" value={getStatusLabel(campaign.status)} />
            <DetailMetric label="Destinataires" value={String(campaign.recipientCount)} />
            <DetailMetric label="Envoyés" value={String(campaign.sentCount)} />
            <DetailMetric label="Échecs" value={String(campaign.failedCount)} />
          </div>
        </section>

        <section className="rounded-[28px] border border-surface-border bg-surface-panel p-6 shadow-card">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge variant={getStatusBadgeVariant(campaign.status)}>
              {getStatusLabel(campaign.status)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Créée le {dateFormatter.format(campaign.createdAt)}
            </span>
            {campaign.sentAt ? (
              <span className="text-xs text-muted-foreground">
                Envoyée le {dateFormatter.format(campaign.sentAt)}
              </span>
            ) : null}
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1 rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-4">
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Sujet</dt>
              <dd className="text-sm text-foreground">{campaign.subjectLine}</dd>
            </div>
            <div className="grid gap-1 rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-4">
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Texte de prévisualisation
              </dt>
              <dd className="text-sm text-foreground">{campaign.previewText ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-[28px] border border-surface-border bg-surface-panel p-6 shadow-card">
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Aperçu de l&apos;email
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Rendu exact du contenu envoyé aux abonnés. Le lien de désinscription est personnalisé
              par destinataire au moment de l&apos;envoi.
            </p>
          </div>

          {previewHtml ? (
            <iframe
              title="Aperçu HTML de la campagne"
              sandbox=""
              srcDoc={previewHtml}
              className="h-[480px] w-full rounded-xl border border-surface-border/60 bg-white"
            />
          ) : (
            <p className="text-sm text-muted-foreground">Aucun contenu HTML.</p>
          )}

          {previewText ? (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-foreground">
                Version texte
              </summary>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-surface-border/60 bg-surface-panel/40 p-4 text-xs text-foreground">
                {previewText}
              </pre>
            </details>
          ) : null}
        </section>

        <section className="rounded-[28px] border border-surface-border bg-surface-panel p-6 shadow-card">
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Envoi</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Seuls les abonnés avec le statut « Inscrit » recevront la campagne.
            </p>
          </div>

          {isDraft ? (
            <AdminNewsletterCampaignSendPanel
              campaignId={campaign.id}
              subscriberCount={subscriberCount}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Cette campagne n&apos;est plus un brouillon — l&apos;envoi n&apos;est plus disponible.
            </p>
          )}
        </section>
      </div>
    </AdminPageShell>
  );
}
