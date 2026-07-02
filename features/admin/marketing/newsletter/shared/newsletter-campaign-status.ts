export type NewsletterCampaignBadgeVariant = "secondary" | "outline" | "destructive";

export function getNewsletterCampaignStatusLabel(status: string): string {
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

export function getNewsletterCampaignStatusBadgeVariant(
  status: string
): NewsletterCampaignBadgeVariant {
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
