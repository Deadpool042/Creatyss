/**
 * Rendu du contenu email d'une campagne newsletter.
 *
 * Partagé entre l'envoi réel (`send-newsletter-campaign.action.ts`) et
 * l'aperçu admin (page détail campagne) pour garantir que la prévisualisation
 * reflète exactement l'email envoyé — y compris le pied de désinscription
 * obligatoire (RGPD/LPM).
 */

export function buildNewsletterEmailHtml(bodyHtml: string, unsubscribeUrl: string): string {
  return `${bodyHtml}
<p style="font-size:12px;color:#666666;margin-top:24px;border-top:1px solid #eeeeee;padding-top:12px;">
  Pour vous désabonner de cette liste, <a href="${unsubscribeUrl}" style="color:#666666;">cliquez ici</a>.
</p>`;
}

export function buildNewsletterEmailText(bodyText: string, unsubscribeUrl: string): string {
  return `${bodyText}

---
Pour vous désabonner : ${unsubscribeUrl}`;
}
