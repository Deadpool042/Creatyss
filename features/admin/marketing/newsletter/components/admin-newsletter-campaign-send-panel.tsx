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
  subscriberCount: number;
};

/**
 * Panneau d'envoi d'une campagne DRAFT depuis la page détail.
 *
 * Confirmation en deux temps (pas de dialog navigateur) : le premier clic
 * arme la confirmation avec le nombre de destinataires, le second déclenche
 * l'envoi réel — irréversible.
 */
export function AdminNewsletterCampaignSendPanel({
  campaignId,
  subscriberCount,
}: AdminNewsletterCampaignSendPanelProps) {
  const router = useRouter();
  const [isArmed, setIsArmed] = useState(false);
  const [result, setResult] = useState<SendNewsletterCampaignResult | null>(null);
  const [isSending, startSendTransition] = useTransition();

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

  return (
    <div className="grid gap-3">
      {result !== null && !result.ok ? (
        <p className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-2 text-sm text-feedback-error-foreground">
          {result.error}
        </p>
      ) : null}

      {isArmed ? (
        <div className="grid gap-3 rounded-xl border border-feedback-error-border bg-feedback-error-surface/40 p-4">
          <p className="text-sm text-foreground">
            Envoyer cette campagne à{" "}
            <strong>
              {subscriberCount} abonné{subscriberCount !== 1 ? "s" : ""}
            </strong>{" "}
            ? Cette action est irréversible.
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
            Envoyer la campagne
          </Button>
          <span className="text-xs text-muted-foreground">
            {subscriberCount} abonné{subscriberCount !== 1 ? "s" : ""} recevr
            {subscriberCount !== 1 ? "ont" : "a"} cet email.
          </span>
        </div>
      )}
    </div>
  );
}
