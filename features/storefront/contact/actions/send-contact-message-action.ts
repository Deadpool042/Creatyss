"use server";

import { redirect } from "next/navigation";

import { brandConfig } from "@/core/config/brand";
import { db } from "@/core/db";
import { resolveStoreExecutionPolicy } from "@/core/runtime/resolve-store-execution-policy";
import { validateContactMessageInput } from "@/entities/contact/contact-message-input";
import { resolveEmailProvider } from "@/features/email/providers/resolve-email-provider";

const CONTACT_SUBJECT_LABELS: Record<string, string> = {
  question_produit: "Question sur un produit",
  sur_mesure: "Projet sur-mesure",
  commande: "Question commande",
  marche: "Informations marchés",
  autre: "Autre",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactMessageAction(formData: FormData): Promise<void> {
  const validation = validateContactMessageInput({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!validation.ok) {
    redirect(`/contact?contact_error=${validation.code}`);
  }

  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { name: true, supportEmail: true, isProduction: true },
  });

  if (!store?.supportEmail) {
    redirect("/contact?contact_error=not_configured");
  }

  const { firstName, lastName, email, subject, message } = validation.data;
  const senderName = [firstName, lastName].filter(Boolean).join(" ");
  const storeName = store.name ?? brandConfig.name;
  const subjectLabel = subject ? CONTACT_SUBJECT_LABELS[subject] : null;
  const emailSubject = subjectLabel
    ? `[Contact ${storeName}] ${subjectLabel}`
    : `[Contact ${storeName}] Nouveau message`;

  const text = [
    `Nouveau message depuis le formulaire de contact de ${storeName}.`,
    "",
    `De : ${senderName} <${email}>`,
    subjectLabel ? `Sujet : ${subjectLabel}` : null,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const html = `<!doctype html><html lang="fr"><body style="font-family:Arial,sans-serif;color:#222;line-height:1.5;">
    <p>Nouveau message depuis le formulaire de contact de ${escapeHtml(storeName)}.</p>
    <p><strong>De :</strong> ${escapeHtml(senderName)} &lt;${escapeHtml(email)}&gt;</p>
    ${subjectLabel ? `<p><strong>Sujet :</strong> ${escapeHtml(subjectLabel)}</p>` : ""}
    <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
  </body></html>`;

  try {
    const policy = resolveStoreExecutionPolicy({ isProduction: store.isProduction });
    const { provider: emailProvider } = resolveEmailProvider(policy);
    await emailProvider.sendTransactionalEmail({
      to: store.supportEmail,
      subject: emailSubject,
      text,
      html,
      replyTo: email,
    });
  } catch (error) {
    console.error("[public/contact] sendContactMessageAction failed", error);
    redirect("/contact?contact_error=send_failed");
  }

  redirect("/contact?contact_status=sent");
}
