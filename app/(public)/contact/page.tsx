import type { Metadata } from "next";
import { MailIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/shared/feedback";
import { getStorefrontStoreContact } from "@/features/storefront/store/queries/get-storefront-store-contact.query";
import { getLocalizedContactCopy } from "@/features/storefront/content/queries/get-localized-contact-copy.query";
import { sendContactMessageAction } from "@/features/storefront/contact/actions/send-contact-message-action";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getLocalizedContactCopy();

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
  };
}

function getContactStatusMessage(status: string | undefined): string | null {
  return status === "sent" ? "Message envoyé — nous vous répondons sous 2 à 3 jours ouvrés." : null;
}

function getContactErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_first_name":
      return "Renseignez votre prénom.";
    case "missing_email":
    case "invalid_email":
      return "Renseignez une adresse email valide.";
    case "missing_message":
      return "Renseignez votre message.";
    case "not_configured":
      return "Le formulaire de contact n'est pas encore configuré pour cette boutique.";
    case "send_failed":
      return "Le message n'a pas pu être envoyé. Réessayez dans quelques instants.";
    default:
      return null;
  }
}

type ContactPageProps = Readonly<{
  searchParams: Promise<{
    contact_status?: string | string[];
    contact_error?: string | string[];
  }>;
}>;

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusMessage = getContactStatusMessage(
    typeof resolvedSearchParams.contact_status === "string"
      ? resolvedSearchParams.contact_status
      : undefined
  );
  const errorMessage = getContactErrorMessage(
    typeof resolvedSearchParams.contact_error === "string"
      ? resolvedSearchParams.contact_error
      : undefined
  );
  let storeContact: Awaited<ReturnType<typeof getStorefrontStoreContact>>;
  try {
    storeContact = await getStorefrontStoreContact();
  } catch (error) {
    console.error("[public/contact] getStorefrontStoreContact failed", error);
    storeContact = {
      supportEmail: null,
      supportPhone: null,
      addressLine1: null,
      addressPostalCode: null,
      addressCity: null,
      addressCountry: null,
      instagramUrl: null,
      facebookUrl: null,
    };
  }

  const addressParts = [
    storeContact.addressLine1,
    storeContact.addressPostalCode && storeContact.addressCity
      ? `${storeContact.addressPostalCode} ${storeContact.addressCity}`
      : (storeContact.addressCity ?? storeContact.addressPostalCode),
    storeContact.addressCountry,
  ].filter(Boolean);

  const hasAddress = addressParts.length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-20 xl:px-0">
      {/* Header */}
      <header className="mb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Atelier
        </p>
        <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
          Contact
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Questions sur une commande, projet sur-mesure, renseignements — nous lisons chaque
          message.
        </p>
      </header>

      {statusMessage ? (
        <div className="mb-6">
          <Notice tone="success">{statusMessage}</Notice>
        </div>
      ) : null}
      {errorMessage ? (
        <div className="mb-6">
          <Notice tone="alert">{errorMessage}</Notice>
        </div>
      ) : null}

      <div className="grid gap-8 md:grid-cols-[1fr_auto]">
        {/* Formulaire */}
        <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-6 md:p-8">
          <h2 className="mb-6 font-serif text-xl font-light tracking-tight text-foreground">
            Envoyer un message
          </h2>

          <form className="space-y-5" action={sendContactMessageAction}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="Votre prénom"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" name="lastName" type="text" placeholder="Votre nom" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-feedback-error-foreground">*</span>
              </Label>
              <Input id="email" name="email" type="email" required placeholder="votre@email.fr" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Sujet</Label>
              <select
                id="subject"
                name="subject"
                className="h-8 w-full min-w-0 rounded-lg border border-control-border bg-control-surface px-2.5 py-1 text-base shadow-control transition-all outline-none hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 md:text-sm"
              >
                <option value="">Choisir un sujet…</option>
                <option value="question_produit">Question sur un produit</option>
                <option value="sur_mesure">Projet sur-mesure</option>
                <option value="commande">Question commande</option>
                <option value="marche">Informations marchés</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">
                Message <span className="text-feedback-error-foreground">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={5}
                className="resize-none"
                placeholder="Votre message…"
              />
            </div>

            {storeContact.supportEmail !== null ? (
              <Button type="submit">Envoyer le message</Button>
            ) : (
              <p className="text-xs text-muted-foreground/60">
                Le formulaire de contact n&apos;est pas encore configuré pour cette boutique.
              </p>
            )}
          </form>
        </div>

        {/* Infos contact */}
        <div className="flex flex-col gap-4 md:w-56">
          {storeContact.supportEmail !== null ? (
            <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-5">
              <div className="flex items-start gap-3">
                <MailIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                <div>
                  <p className="text-[13px] font-medium text-foreground">Email</p>
                  <a
                    href={`mailto:${storeContact.supportEmail}`}
                    className="mt-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {storeContact.supportEmail}
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          {hasAddress ? (
            <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-5">
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                <div>
                  <p className="text-[13px] font-medium text-foreground">Atelier</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {addressParts.map((part, index) => (
                      <span key={index}>
                        {part}
                        {index < addressParts.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-5">
            <p className="text-[13px] font-medium text-foreground">Délai de réponse</p>
            <p className="mt-1 text-xs text-muted-foreground">Sous 2–3 jours ouvrés.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
