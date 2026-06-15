import { brandConfig } from "@/core/config/brand";

type BuildAutomationEmailTemplateInput = {
  storeName: string;
  recipientFirstName: string | null;
  templateCode: string | null;
};

export type AutomationEmailTemplate = {
  subject: string;
  text: string;
  html: string;
};

const DEFAULT_NEWSLETTER_WELCOME_TEMPLATE_CODE = "newsletter-welcome";

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
  templateCode: string | null
): boolean {
  return (
    templateCode === null ||
    templateCode === DEFAULT_NEWSLETTER_WELCOME_TEMPLATE_CODE
  );
}

export function buildAutomationEmailTemplate(
  input: BuildAutomationEmailTemplateInput & { boutiqueUrl: string }
): AutomationEmailTemplate {
  const customerName = input.recipientFirstName?.trim() || "cliente";
  const resolvedTemplateCode =
    input.templateCode === null ? DEFAULT_NEWSLETTER_WELCOME_TEMPLATE_CODE : input.templateCode;

  switch (resolvedTemplateCode) {
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
