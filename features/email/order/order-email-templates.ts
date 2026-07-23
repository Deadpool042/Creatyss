import { brandConfig } from "@/core/config/brand";

import type { OrderEmailEventType } from "./order-email.types";

type PaymentMethodInput = "card" | "bank_transfer" | "cash_on_delivery" | "other" | null;

/**
 * Overrides résolus par `resolveLocalizedOrderEmailCopy` (Horizon 4 — lot
 * multilingue généralisé), keyés par `fieldName` en chemin pointé (cf.
 * `entities/localization/order-email-copy-fields.ts`). Un `fieldName`
 * absent conserve le littéral en dur — aucune régression si aucune
 * traduction n'existe encore en base.
 */
export type OrderEmailCopyOverrides = Readonly<Record<string, string>>;

type OrderEmailTemplateInput = {
  eventType: OrderEmailEventType;
  customerFirstName: string;
  reference: string;
  totalAmount: string;
  orderUrl: string;
  trackingReference?: string | null;
  paymentMethod?: PaymentMethodInput;
  copyOverrides?: OrderEmailCopyOverrides;
};

function resolveCopy(
  overrides: OrderEmailCopyOverrides | undefined,
  fieldName: string,
  fallback: string
): string {
  return overrides?.[fieldName] ?? fallback;
}

function getPaymentMethodLine(
  method: PaymentMethodInput,
  overrides: OrderEmailCopyOverrides | undefined
): string {
  switch (method) {
    case "bank_transfer":
      return resolveCopy(
        overrides,
        "paymentMethodLine.bankTransfer",
        "Mode de paiement : Virement bancaire. Votre commande sera preparee apres verification manuelle du virement."
      );
    case "cash_on_delivery":
      return resolveCopy(
        overrides,
        "paymentMethodLine.cashOnDelivery",
        "Mode de paiement : Paiement a l'atelier. Le reglement sera effectue lors du retrait."
      );
    case "card":
      return resolveCopy(overrides, "paymentMethodLine.card", "Mode de paiement : Carte bancaire.");
    default:
      return resolveCopy(
        overrides,
        "paymentMethodLine.other",
        "Mode de paiement : A confirmer avec notre equipe."
      );
  }
}

export type OrderEmailTemplate = {
  subject: string;
  text: string;
  html: string;
};

function wrapHtml(input: {
  title: string;
  greeting: string;
  body: string[];
  ctaLabel: string;
  ctaUrl: string;
}): string {
  const paragraphs = input.body.map((line) => `<p>${line}</p>`).join("");

  return [
    "<!doctype html>",
    '<html lang="fr">',
    '<body style="font-family:Arial,sans-serif;color:#222;line-height:1.5;">',
    `<h1 style="font-size:24px;">${input.title}</h1>`,
    `<p>Bonjour ${input.greeting},</p>`,
    paragraphs,
    `<p><a href="${input.ctaUrl}">${input.ctaLabel}</a></p>`,
    `<p>${brandConfig.emailSignature}</p>`,
    "</body>",
    "</html>",
  ].join("");
}

export function buildOrderEmailTemplate(input: OrderEmailTemplateInput): OrderEmailTemplate {
  const customerName = input.customerFirstName.trim() || "cliente";

  switch (input.eventType) {
    case "payment_succeeded": {
      const overrides = input.copyOverrides;
      const subject = `Paiement confirme pour la commande ${input.reference}`;
      const title = resolveCopy(overrides, "title", "Paiement confirme");
      const ctaLabel = resolveCopy(overrides, "ctaLabel", "Voir la commande");
      const body = [
        resolveCopy(
          overrides,
          "body.line1",
          `Nous confirmons la reception du paiement pour votre commande ${input.reference}.`
        ),
        resolveCopy(overrides, "body.line2", `Montant confirme : ${input.totalAmount} EUR.`),
        resolveCopy(
          overrides,
          "body.line3",
          "Vous pouvez suivre la suite du traitement depuis la page de confirmation de commande."
        ),
      ];

      return {
        subject,
        text: [
          `Bonjour ${customerName},`,
          "",
          ...body,
          "",
          `Suivre la commande : ${input.orderUrl}`,
          "",
          brandConfig.emailSignature,
        ].join("\n"),
        html: wrapHtml({
          title,
          greeting: customerName,
          body,
          ctaLabel,
          ctaUrl: input.orderUrl,
        }),
      };
    }

    case "order_shipped": {
      const overrides = input.copyOverrides;
      const trackingLine = input.trackingReference
        ? resolveCopy(
            overrides,
            "trackingLine.withReference",
            `Reference de suivi : ${input.trackingReference}.`
          )
        : resolveCopy(
            overrides,
            "trackingLine.withoutReference",
            "Votre commande a ete expediee sans reference de suivi renseignee pour le moment."
          );
      const subject = `Commande expediee ${input.reference}`;
      const title = resolveCopy(overrides, "title", "Commande expediee");
      const ctaLabel = resolveCopy(overrides, "ctaLabel", "Voir la commande");
      const body = [
        resolveCopy(overrides, "body.line1", `Votre commande ${input.reference} a ete expediee.`),
        trackingLine,
        resolveCopy(
          overrides,
          "body.line3",
          "Vous pouvez consulter le recapitulatif de commande a tout moment."
        ),
      ];

      return {
        subject,
        text: [
          `Bonjour ${customerName},`,
          "",
          ...body,
          "",
          `Suivre la commande : ${input.orderUrl}`,
          "",
          brandConfig.emailSignature,
        ].join("\n"),
        html: wrapHtml({
          title,
          greeting: customerName,
          body,
          ctaLabel,
          ctaUrl: input.orderUrl,
        }),
      };
    }

    case "order_created":
    default: {
      const overrides = input.copyOverrides;
      const subject = `Commande creee ${input.reference}`;
      const title = resolveCopy(overrides, "title", "Commande creee");
      const ctaLabel = resolveCopy(overrides, "ctaLabel", "Voir la commande");
      const body = [
        resolveCopy(
          overrides,
          "body.line1",
          `Votre commande ${input.reference} a bien ete enregistree.`
        ),
        resolveCopy(overrides, "body.line2", `Montant de la commande : ${input.totalAmount} EUR.`),
        getPaymentMethodLine(input.paymentMethod ?? null, overrides),
        resolveCopy(
          overrides,
          "body.line4",
          "Vous pouvez suivre son traitement depuis la page de confirmation."
        ),
      ];

      return {
        subject,
        text: [
          `Bonjour ${customerName},`,
          "",
          ...body,
          "",
          `Suivre la commande : ${input.orderUrl}`,
          "",
          brandConfig.emailSignature,
        ].join("\n"),
        html: wrapHtml({
          title,
          greeting: customerName,
          body,
          ctaLabel,
          ctaUrl: input.orderUrl,
        }),
      };
    }
  }
}
