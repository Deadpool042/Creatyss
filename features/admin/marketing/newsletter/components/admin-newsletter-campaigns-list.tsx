"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { archiveNewsletterCampaignAction } from "@/features/admin/marketing/newsletter/actions/archive-newsletter-campaign.action";
import { getAdminNewsletterCampaignDetailPath } from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";
import type { AdminNewsletterCampaignSummary } from "@/features/admin/marketing/newsletter/queries/list-admin-newsletter-campaigns.query";

type AdminNewsletterCampaignsListProps = {
  campaigns: ReadonlyArray<AdminNewsletterCampaignSummary>;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

type CampaignBadgeVariant = "secondary" | "outline" | "destructive" | "default";

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
    case "ARCHIVED":
      return "Archivée";
    default:
      return status;
  }
}

function getStatusBadgeVariant(status: string): CampaignBadgeVariant {
  switch (status) {
    case "SENT":
      return "secondary";
    case "DRAFT":
    case "SCHEDULED":
      return "outline";
    case "FAILED":
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}

function CampaignRow({ campaign }: { campaign: AdminNewsletterCampaignSummary }) {
  const router = useRouter();
  const [isArchiving, startArchiveTransition] = useTransition();

  const isDraft = campaign.status === "DRAFT";

  function handleArchive() {
    startArchiveTransition(async () => {
      await archiveNewsletterCampaignAction(campaign.id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={getAdminNewsletterCampaignDetailPath(campaign.id)}
            className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {campaign.name}
          </Link>
          <Badge variant={getStatusBadgeVariant(campaign.status)}>
            {getStatusLabel(campaign.status)}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">{campaign.subjectLine}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Créée le {dateFormatter.format(new Date(campaign.createdAt))}</span>
          {campaign.sentAt ? (
            <span>Envoyée le {dateFormatter.format(new Date(campaign.sentAt))}</span>
          ) : null}
          <span>
            {campaign.recipientCount} destinataire{campaign.recipientCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button asChild variant={isDraft ? "default" : "outline"} size="sm">
          <Link href={getAdminNewsletterCampaignDetailPath(campaign.id)}>
            {isDraft ? "Prévisualiser et envoyer" : "Voir le détail"}
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isArchiving}
          onClick={handleArchive}
        >
          Archiver
        </Button>
      </div>
    </div>
  );
}

export function AdminNewsletterCampaignsList({ campaigns }: AdminNewsletterCampaignsListProps) {
  if (campaigns.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aucune campagne pour le moment.
      </p>
    );
  }

  return (
    <div className="divide-y divide-surface-border/40">
      {campaigns.map((campaign) => (
        <CampaignRow key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
