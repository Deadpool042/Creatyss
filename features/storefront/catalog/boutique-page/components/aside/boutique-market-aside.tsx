import { ArrowRightIcon, CalendarIcon } from "lucide-react";

import { CustomButton, CustomLink } from "@/components/shared";

type MarketEvent = {
  dateLabel: string;
  name: string;
  location: string;
};

// Données éditoriales marchés — à remplacer par une source CMS quand disponible.
const MARKET_EVENTS: readonly MarketEvent[] = [
  { dateLabel: "Date à confirmer", name: "Marché de créateurs", location: "Saint-Étienne" },
  { dateLabel: "Calendrier à venir", name: "Marché artisanal", location: "Loire" },
];

// Classes partagées localement — text-[0.65rem] = taille label eyebrow compact, pas d'alias Tailwind exact.
const labelClass = "m-0 text-[0.65rem] font-semibold uppercase tracking-widest text-brand/80";
const eventDateClass = "m-0 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand";

export function BoutiqueMarketAside() {
  return (
    <aside
      aria-label="Informations atelier Creatyss"
      data-testid="boutique-market-aside"
      className="hidden tablet:block tablet:self-stretch "
    >
      {/* desktop:top-[9rem] = offset hauteur header (~5.5rem) + gap de sécurité */}
      <div className="grid gap-3 desktop:sticky desktop:top-36 desktop:z-20 desktop:content-start border-l border-brand h-fit">
        <div data-motion-surface="market-aside" className="grid gap-3.5  p-3.5">
          <div className="grid gap-1">
            <p className={labelClass}>L&apos;atelier Creatyss</p>
            <p className="m-0 text-base font-semibold leading-snug text-foreground">
              Prochains marchés
            </p>
          </div>

          <ul className="m-0 grid list-none gap-3.5 border-y border-surface-border-subtle py-3.5 pl-0">
            {MARKET_EVENTS.map((event) => (
              <li key={event.name} className="flex items-start gap-2.5">
                <CalendarIcon
                  className="mt-0.5 size-3.5 shrink-0 text-brand/80"
                  aria-hidden="true"
                />
                <div className="grid gap-0.5">
                  <p className={eventDateClass}>{event.dateLabel}</p>
                  <p className="m-0 text-sm font-semibold text-foreground">{event.name}</p>
                  <p className="m-0 text-xs leading-relaxed text-text-muted-strong">
                    {event.location}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <CustomButton
            asChild
            size="sm"
            variant="ghost"
            className="w-fit justify-start text-xs px-0 text-brand hover:bg-transparent hover:text-brand/75"
          >
            <CustomLink
              href="/les-marches"
              variant="navUnderline"
              className="capitalize flex items-center gap-1"
            >
              Voir les marchés
              <span>
                <ArrowRightIcon />
              </span>
            </CustomLink>
          </CustomButton>

          <div className="grid gap-1.5 rounded-xl border border-surface-border-subtle/70 bg-background-secondary p-3">
            <p className="m-0 text-sm font-semibold leading-snug text-foreground">
              Créations faites main en pièce unique
            </p>
            <p className="m-0 text-xs leading-relaxed text-text-muted-strong">
              Chaque sac est imaginé et cousu à la main dans mon atelier stéphanois, en pièce
              unique.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
