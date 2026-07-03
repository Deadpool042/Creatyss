import Link from "next/link";

import { Notice } from "@/components/shared";
import type { CardPaymentStatus } from "@/features/admin/settings/queries/get-card-payment-status.query";

type CardPaymentStatusNoticeProps = Readonly<{
  status: CardPaymentStatus;
}>;

export function CardPaymentStatusNotice({ status }: CardPaymentStatusNoticeProps) {
  const { isActive, governanceLevelReached, stripeConfigured } = status;

  if (isActive) {
    return (
      <Notice tone="success">
        Paiement carte actif : gouvernance au niveau &laquo;&nbsp;En ligne&nbsp;&raquo; et Stripe
        configuré.
      </Notice>
    );
  }

  const missing: string[] = [];
  if (!governanceLevelReached) {
    missing.push(
      "le niveau « En ligne » n'est pas activé sur Paiements dans Modules & fonctionnalités"
    );
  }
  if (!stripeConfigured) {
    missing.push("Stripe n'est pas configuré (clés d'environnement absentes)");
  }

  return (
    <Notice tone="note">
      Paiement carte inactif : {missing.join(" et ")}. Les clés Stripe se configurent au niveau
      serveur, pas depuis cet écran.{" "}
      <Link href="/admin/settings/advanced/satellite/payments" className="underline">
        Voir la gouvernance
      </Link>
    </Notice>
  );
}
