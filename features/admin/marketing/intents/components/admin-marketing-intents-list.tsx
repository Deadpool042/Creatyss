"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/tables/admin-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { materializeNewsletterCampaignAction } from "@/features/admin/marketing/intents/actions/materialize-newsletter-campaign.action";
import { materializeSocialPublicationAction } from "@/features/admin/marketing/intents/actions/materialize-social-publication.action";
import { reviewMarketingIntentAction } from "@/features/admin/marketing/intents/actions/review-marketing-intent.action";
import type { AdminMarketingIntentSummary } from "@/features/admin/marketing/intents/queries/list-admin-marketing-intents.query";
import type { MarketingIntentReviewDecision } from "@/features/marketing/editorial-intents/review-marketing-intent.service";

type AdminMarketingIntentsListProps = Readonly<{
  intents: readonly AdminMarketingIntentSummary[];
}>;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

const SUBJECT_TYPE_LABELS: Record<AdminMarketingIntentSummary["subjectType"], string> = {
  BLOG_POST: "Article de blog",
  HOMEPAGE: "Page d'accueil",
  EDITORIAL_PAGE: "Page éditoriale",
  LEGAL_PAGE: "Page légale",
  PUBLIC_EVENT: "Marché",
};

const CHANNEL_LABELS: Record<AdminMarketingIntentSummary["suggestedChannels"][number], string> = {
  NEWSLETTER: "Newsletter",
  SOCIAL: "Social",
};

const STATUS_LABELS: Partial<Record<AdminMarketingIntentSummary["status"], string>> = {
  PROPOSED: "Proposée",
  APPROVED: "Approuvée",
};

function getContextTitle(intent: AdminMarketingIntentSummary): string | null {
  const context = intent.contextJson;

  if (context === null || typeof context !== "object" || Array.isArray(context)) {
    return null;
  }

  const title = (context as Record<string, unknown>).title;
  return typeof title === "string" ? title : null;
}

function IntentDecisionButtons({
  intentId,
  status,
}: {
  intentId: string;
  status: AdminMarketingIntentSummary["status"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDecision(decision: MarketingIntentReviewDecision) {
    startTransition(async () => {
      setError(null);
      const result = await reviewMarketingIntentAction(intentId, decision);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex justify-end gap-2">
        {status === "PROPOSED" ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isPending}
              onClick={() => handleDecision("APPROVED")}
            >
              Approuver
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => handleDecision("REJECTED")}
            >
              Rejeter
            </Button>
          </>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => handleDecision("ARCHIVED")}
        >
          Archiver
        </Button>
      </div>
      {error !== null ? <p className="text-xs text-feedback-error-foreground">{error}</p> : null}
    </div>
  );
}

function MaterializeNewsletterCampaignButton({ intentId }: { intentId: string }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    | Readonly<{ kind: "error"; message: string }>
    | Readonly<{ kind: "success"; alreadyMaterialized: boolean; campaignDetailPath: string }>
    | null
  >(null);

  function handleMaterialize() {
    startTransition(async () => {
      const result = await materializeNewsletterCampaignAction(intentId);

      if (!result.ok) {
        setFeedback({ kind: "error", message: result.error });
        return;
      }

      setFeedback({
        kind: "success",
        alreadyMaterialized: result.alreadyMaterialized,
        campaignDetailPath: result.campaignDetailPath,
      });
    });
  }

  if (feedback?.kind === "success") {
    return (
      <Link
        href={feedback.campaignDetailPath}
        className="text-xs font-medium text-brand underline underline-offset-2"
      >
        {feedback.alreadyMaterialized
          ? "Voir le brouillon newsletter"
          : "Brouillon newsletter créé"}
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={handleMaterialize}
      >
        Créer le brouillon newsletter
      </Button>
      {feedback?.kind === "error" ? (
        <p className="text-xs text-feedback-error-foreground">{feedback.message}</p>
      ) : null}
    </div>
  );
}

function MaterializeSocialPublicationButton({ intentId }: { intentId: string }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    | Readonly<{ kind: "error"; message: string }>
    | Readonly<{ kind: "success"; alreadyMaterialized: boolean }>
    | null
  >(null);

  function handleMaterialize() {
    startTransition(async () => {
      const result = await materializeSocialPublicationAction(intentId);

      if (!result.ok) {
        setFeedback({ kind: "error", message: result.error });
        return;
      }

      setFeedback({ kind: "success", alreadyMaterialized: result.alreadyMaterialized });
    });
  }

  if (feedback?.kind === "success") {
    return (
      <p className="text-xs font-medium text-muted-foreground">
        {feedback.alreadyMaterialized ? "Brouillon social déjà créé" : "Brouillon social créé"}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={handleMaterialize}
      >
        Créer le brouillon social
      </Button>
      {feedback?.kind === "error" ? (
        <p className="text-xs text-feedback-error-foreground">{feedback.message}</p>
      ) : null}
    </div>
  );
}

export function AdminMarketingIntentsList({ intents }: AdminMarketingIntentsListProps) {
  if (intents.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aucune intention marketing en attente de revue.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <AdminTable
        className="min-w-full"
        wrapperClassName="rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm"
      >
        <AdminTableHeader>
          <AdminTableRow className="hover:bg-transparent">
            <AdminTableHead>Contenu</AdminTableHead>
            <AdminTableHead>Type de sujet</AdminTableHead>
            <AdminTableHead>Canaux suggérés</AdminTableHead>
            <AdminTableHead>Statut</AdminTableHead>
            <AdminTableHead>Proposée le</AdminTableHead>
            <AdminTableHead className="text-right">Décision</AdminTableHead>
          </AdminTableRow>
        </AdminTableHeader>
        <AdminTableBody>
          {intents.map((intent) => (
            <AdminTableRow key={intent.id}>
              <AdminTableCell>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {getContextTitle(intent) ?? intent.subjectId}
                  </p>
                  <p className="text-xs text-muted-foreground">{intent.subjectId}</p>
                </div>
              </AdminTableCell>
              <AdminTableCell className="text-foreground">
                {SUBJECT_TYPE_LABELS[intent.subjectType]}
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex flex-wrap gap-1">
                  {intent.suggestedChannels.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Aucun</span>
                  ) : (
                    intent.suggestedChannels.map((channel) => (
                      <Badge key={channel} variant="outline">
                        {CHANNEL_LABELS[channel]}
                      </Badge>
                    ))
                  )}
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <Badge variant="outline">{STATUS_LABELS[intent.status] ?? intent.status}</Badge>
              </AdminTableCell>
              <AdminTableCell className="text-muted-foreground">
                {dateFormatter.format(intent.createdAt)}
              </AdminTableCell>
              <AdminTableCell className="text-right">
                <div className="flex flex-col items-end gap-2">
                  {intent.status === "APPROVED" &&
                  intent.suggestedChannels.includes("NEWSLETTER") ? (
                    <MaterializeNewsletterCampaignButton intentId={intent.id} />
                  ) : null}
                  {intent.status === "APPROVED" && intent.suggestedChannels.includes("SOCIAL") ? (
                    <MaterializeSocialPublicationButton intentId={intent.id} />
                  ) : null}
                  <IntentDecisionButtons intentId={intent.id} status={intent.status} />
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
