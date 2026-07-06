import { brandConfig } from "@/core/config/brand";

type BuildAutomationEmailTemplateInput = {
  storeName: string;
  recipientFirstName: string | null;
  templateCode: string | null;
  triggerType: string;
  order?: {
    orderNumber: string;
    totalFormatted: string;
  };
};

export type AutomationEmailTemplate = {
  subject: string;
  text: string;
  html: string;
};

const DEFAULT_NEWSLETTER_WELCOME_TEMPLATE_CODE = "newsletter-welcome";
const DEFAULT_ORDER_PLACED_TEMPLATE_CODE = "order-placed-confirmation";
const DEFAULT_CART_ABANDONED_TEMPLATE_CODE = "cart-abandoned-reminder";

const DEFAULT_TEMPLATE_CODE_BY_TRIGGER: Record<string, string> = {
  NEWSLETTER_SUBSCRIBED: DEFAULT_NEWSLETTER_WELCOME_TEMPLATE_CODE,
  ORDER_PLACED: DEFAULT_ORDER_PLACED_TEMPLATE_CODE,
  CART_ABANDONED: DEFAULT_CART_ABANDONED_TEMPLATE_CODE,
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

export function isSupportedAutomationEmailTemplateCode(
  templateCode: string | null,
  triggerType: string
): boolean {
  const defaultCode = DEFAULT_TEMPLATE_CODE_BY_TRIGGER[triggerType];

  return templateCode === null || templateCode === defaultCode;
}

export function buildAutomationEmailTemplate(
  input: BuildAutomationEmailTemplateInput & { boutiqueUrl: string }
): AutomationEmailTemplate {
  const customerName = input.recipientFirstName?.trim() || "cliente";
  const resolvedTemplateCode =
    input.templateCode ??
    DEFAULT_TEMPLATE_CODE_BY_TRIGGER[input.triggerType] ??
    DEFAULT_NEWSLETTER_WELCOME_TEMPLATE_CODE;

  switch (resolvedTemplateCode) {
    case DEFAULT_ORDER_PLACED_TEMPLATE_CODE: {
      const orderNumber = input.order?.orderNumber ?? "";
      const subject = `Merci pour votre commande ${orderNumber}`;
      const body = [
        `Merci pour votre commande ${orderNumber}${input.order ? ` (${input.order.totalFormatted})` : ""} chez ${input.storeName}.`,
        "Chaque pièce est préparée avec soin dans notre atelier avant expédition.",
        "N'hésitez pas à revenir découvrir nos autres créations.",
      ];

      return {
        subject,
        text: [`Bonjour ${customerName},`, "", ...body, "", brandConfig.emailSignature].join("\n"),
        html: wrapHtml({
          title: "Merci pour votre commande",
          greeting: customerName,
          body,
          ctaLabel: "Découvrir la boutique",
          ctaUrl: input.boutiqueUrl,
        }),
      };
    }

    case DEFAULT_CART_ABANDONED_TEMPLATE_CODE: {
      const subject = `Votre sélection vous attend chez ${input.storeName}`;
      const body = [
        `Vous avez laissé quelques pièces dans votre panier chez ${input.storeName}.`,
        "Elles sont toujours disponibles — n'hésitez pas à finaliser votre commande.",
        "Chaque création est préparée avec soin dans notre atelier.",
      ];

      return {
        subject,
        text: [`Bonjour ${customerName},`, "", ...body, "", brandConfig.emailSignature].join("\n"),
        html: wrapHtml({
          title: "Votre panier vous attend",
          greeting: customerName,
          body,
          ctaLabel: "Retourner à la boutique",
          ctaUrl: input.boutiqueUrl,
        }),
      };
    }

    case DEFAULT_NEWSLETTER_WELCOME_TEMPLATE_CODE:
    default: {
      const subject = `Bienvenue dans l'univers ${input.storeName}`;
      const body = [
        "Merci pour votre inscription a notre newsletter.",
        "Vous ferez partie des premieres informees des nouvelles creations, coulisses d'atelier et prochains rendez-vous.",
        "Vous pouvez revenir decouvrir la boutique a tout moment.",
      ];

      return {
        subject,
        text: [
          `Bonjour ${customerName},`,
          "",
          ...body,
          "",
          `Découvrir la boutique : ${input.boutiqueUrl}`,
          "",
          brandConfig.emailSignature,
        ].join("\n"),
        html: wrapHtml({
          title: "Bienvenue",
          greeting: customerName,
          body,
          ctaLabel: "Découvrir la boutique",
          ctaUrl: input.boutiqueUrl,
        }),
      };
    }
  }
}
