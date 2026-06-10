import type { Metadata } from "next";
import { MailIcon, MapPinIcon } from "lucide-react";
import { getStorefrontStoreContact } from "@/features/storefront/store/queries/get-storefront-store-contact.query";

export const metadata: Metadata = {
  title: "Contact — Creatyss",
  description: "Contactez l'atelier Creatyss pour toute question sur les créations, le sur-mesure ou une commande.",
};

export default async function ContactPage() {
  let storeContact: Awaited<ReturnType<typeof getStorefrontStoreContact>>;
  try {
    storeContact = await getStorefrontStoreContact();
  } catch {
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
      : storeContact.addressCity ?? storeContact.addressPostalCode,
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
          Questions sur une commande, projet sur-mesure, renseignements — nous lisons chaque message.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-[1fr_auto]">
        {/* Formulaire */}
        <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-6 md:p-8">
          <h2 className="mb-6 font-serif text-xl font-light tracking-tight text-foreground">
            Envoyer un message
          </h2>

          <form className="space-y-5" action="mailto:contact@creatyss.local" method="dialog">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-[13px] font-medium text-foreground">
                  Prénom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full rounded-xl border border-surface-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-[13px] font-medium text-foreground">
                  Nom
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full rounded-xl border border-surface-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-foreground">
                Email <span className="text-feedback-error-foreground">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-surface-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                placeholder="votre@email.fr"
              />
            </div>

            <div>
              <label htmlFor="subject" className="mb-1.5 block text-[13px] font-medium text-foreground">
                Sujet
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full rounded-xl border border-surface-border/60 bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="">Choisir un sujet…</option>
                <option value="question_produit">Question sur un produit</option>
                <option value="sur_mesure">Projet sur-mesure</option>
                <option value="commande">Question commande</option>
                <option value="marche">Informations marchés</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-[13px] font-medium text-foreground">
                Message <span className="text-feedback-error-foreground">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full resize-none rounded-xl border border-surface-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                placeholder="Votre message…"
              />
            </div>

            {storeContact.supportEmail !== null ? (
              <p className="text-[11px] text-muted-foreground/60">
                Formulaire de contact en cours d&apos;activation. En attendant, écrivez-nous directement à{" "}
                <a
                  href={`mailto:${storeContact.supportEmail}`}
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  {storeContact.supportEmail}
                </a>
              </p>
            ) : null}
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
            <p className="mt-1 text-xs text-muted-foreground">
              Sous 2–3 jours ouvrés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
