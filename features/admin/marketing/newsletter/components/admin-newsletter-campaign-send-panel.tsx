"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  sendNewsletterCampaignAction,
  type SendNewsletterCampaignResult,
} from "@/features/admin/marketing/newsletter/actions/send-newsletter-campaign.action";

type AdminNewsletterCampaignSendPanelProps = {
  campaignId: string;
  campaignStatus: string;
  subscriberCount: number;
};

/**
 * Panneau d'envoi de la page détail campagne.
 *
 * Rendu inconditionnellement par la page (jamais démonté par un changement de
 * statut) pour que le résultat d'envoi reste visible après le refresh serveur.
 * Gère trois cas : DRAFT (envoi initial), SENDING (reprise après crash —
 * supportée par l'action) et les autres statuts (envoi indisponible).
 * Confirmation en deux temps, sans dialog navigateur.
 */
export function AdminNewsletterCampaignSendPanel({
  campaignId,
  campaignStatus,
  subscriberCount,
}: AdminNewsletterCampaignSendPanelProps) {
  const router = useRouter();
  const [isArmed, setIsArmed] = useState(false);
  const [result, setResult] = useState<SendNewsletterCampaignResult | null>(null);
  const [isSending, startSendTransition] = useTransition();

  const isDraft = campaignStatus === "DRAFT";
  const isResumable = campaignStatus === "SENDING";
  const willReceiveVerb = subscriberCount === 1 ? "recevra" : "recevront";
  const subscriberLabel = `${subscriberCount} abonné${subscriberCount !== 1 ? "s" : ""}`;

  function handleSend() {
    startSendTransition(async () => {
      const sendResult = await sendNewsletterCampaignAction(campaignId);
      setResult(sendResult);
      setIsArmed(false);
      router.refresh();
    });
  }

  if (result?.ok) {
    return (
      <p className="rounded-lg border border-feedback-success-border bg-feedback-success-surface px-3 py-2 text-sm text-feedback-success-foreground">
        Envoi terminé : {result.sentCount} envoyé{result.sentCount !== 1 ? "s" : ""}
        {result.failedCount > 0 ? `, ${result.failedCount} en échec` : ""}.
      </p>
    );
  }

  if (!isDraft && !isResumable) {
    return (
      <p className="text-sm text-muted-foreground">
        Cette campagne n&apos;est plus un brouillon — l&apos;envoi n&apos;est plus disponible.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {result !== null && !result.ok ? (
        <p className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-2 text-sm text-feedback-error-foreground">
          {result.error}
        </p>
      ) : null}

      {isResumable ? (
        <p className="text-sm text-muted-foreground">
          Un envoi précédent a été interrompu. La reprise n&apos;enverra l&apos;email qu&apos;aux
          destinataires qui ne l&apos;ont pas encore reçu.
        </p>
      ) : null}

      {isArmed ? (
        <div className="grid gap-3 rounded-xl border border-feedback-error-border bg-feedback-error-surface/40 p-4">
          <p className="text-sm text-foreground">
            {isResumable ? "Reprendre l'envoi de cette campagne" : "Envoyer cette campagne"} à{" "}
            <strong>{subscriberLabel}</strong> ? Cette action est irréversible.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" size="sm" disabled={isSending} onClick={handleSend}>
              {isSending ? "Envoi en cours…" : "Confirmer l'envoi"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSending}
              onClick={() => setIsArmed(false)}
            >
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" size="sm" onClick={() => setIsArmed(true)}>
            {isResumable ? "Reprendre l'envoi" : "Envoyer la campagne"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {subscriberLabel} {willReceiveVerb} cet email.
          </span>
        </div>
      )}
    </div>
  );
}
