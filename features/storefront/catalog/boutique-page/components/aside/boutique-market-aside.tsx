import { ArrowRightIcon, CalendarIcon } from "lucide-react";

import { CustomButton, CustomLink } from "@/components/shared";

import { boutiqueCopyConfig, type BoutiquePageCopy } from "../../config/boutique-copy.config";

// Classes partagées localement — text-[0.65rem] = taille label eyebrow compact, pas d'alias Tailwind exact.
const labelClass = "m-0 text-[0.65rem] font-semibold uppercase tracking-widest text-brand/80";
const eventDateClass = "m-0 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand";

type BoutiqueMarketAsideProps = {
  /** Copy aside marchés localisé — défaut : config fr. `events` reste hors catalogue (fr uniquement). */
  copy?: BoutiquePageCopy["marketAside"];
};

export function BoutiqueMarketAside({ copy = boutiqueCopyConfig.marketAside }: BoutiqueMarketAsideProps) {
  const asideCopy = copy;

  return (
    <aside
      aria-label={asideCopy.ariaLabel}
      data-testid="boutique-market-aside"
      className="hidden tablet:block tablet:self-stretch "
    >
      {/* laptop+: top-[8rem] = offset header compact + marge de lecture */}
      <div className="grid gap-3 laptop:sticky laptop:top-32 laptop:z-20 laptop:content-start border-l border-brand h-fit">
        <div data-motion-surface="market-aside" className="grid gap-3.5  p-3.5">
          <div className="grid gap-1">
            <p className={labelClass}>{asideCopy.label}</p>
            <p className="m-0 text-base font-semibold leading-snug text-foreground">
              {asideCopy.title}
            </p>
          </div>

          <ul className="m-0 grid list-none gap-3.5 border-y border-surface-border-subtle py-3.5 pl-0">
            {asideCopy.events.map((event) => (
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
              {asideCopy.ctaLabel}
              <span>
                <ArrowRightIcon />
              </span>
            </CustomLink>
          </CustomButton>

          <div className="grid gap-1.5 rounded-xl border border-surface-border-subtle/70 bg-background-secondary p-3">
            <p className="m-0 text-sm font-semibold leading-snug text-foreground">
              {asideCopy.uniqueBlock.title}
            </p>
            <p className="m-0 text-xs leading-relaxed text-text-muted-strong">
              {asideCopy.uniqueBlock.body}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
