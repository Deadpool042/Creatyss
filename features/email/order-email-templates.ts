import type { OrderEmailEventType } from "@/db/repositories/order-email.types";

type OrderEmailTemplateInput = {
  eventType: OrderEmailEventType;
  customerFirstName: string;
  reference: string;
  totalAmount: string;
  orderUrl: string;
  trackingReference?: string | null;
};

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
    "<p>Creatyss</p>",
    "</body>",
    "</html>",
  ].join("");
}

export function buildOrderEmailTemplate(input: OrderEmailTemplateInput): OrderEmailTemplate {
  const customerName = input.customerFirstName.trim() || "cliente";

  switch (input.eventType) {
    case "payment_succeeded": {
      const subject = `Paiement confirme pour la commande ${input.reference}`;
      const body = [
        `Nous confirmons la reception du paiement pour votre commande ${input.reference}.`,
        `Montant confirme : ${input.totalAmount} EUR.`,
        "Vous pouvez suivre la suite du traitement depuis la page de confirmation de commande.",
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
          "Creatyss",
        ].join("\n"),
        html: wrapHtml({
          title: "Paiement confirme",
          greeting: customerName,
          body,
          ctaLabel: "Voir la commande",
          ctaUrl: input.orderUrl,
        }),
      };
    }

    case "order_shipped": {
      const trackingLine = input.trackingReference
        ? `Reference de suivi : ${input.trackingReference}.`
        : "Votre commande a ete expediee sans reference de suivi renseignee pour le moment.";
      const subject = `Commande expediee ${input.reference}`;
      const body = [
        `Votre commande ${input.reference} a ete expediee.`,
        trackingLine,
        "Vous pouvez consulter le recapitulatif de commande a tout moment.",
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
          "Creatyss",
        ].join("\n"),
        html: wrapHtml({
          title: "Commande expediee",
          greeting: customerName,
          body,
          ctaLabel: "Voir la commande",
          ctaUrl: input.orderUrl,
        }),
      };
    }

    case "order_created":
    default: {
      const subject = `Commande creee ${input.reference}`;
      const body = [
        `Votre commande ${input.reference} a bien ete enregistree.`,
        `Montant de la commande : ${input.totalAmount} EUR.`,
        "Vous pouvez suivre son paiement et son traitement depuis la page de confirmation.",
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
          "Creatyss",
        ].join("\n"),
        html: wrapHtml({
          title: "Commande creee",
          greeting: customerName,
          body,
          ctaLabel: "Voir la commande",
          ctaUrl: input.orderUrl,
        }),
      };
    }
  }
}
