import React from "react";

type GuaranteeItem = {
  label: string;
  description: string;
  icon: React.ReactNode;
};

const GUARANTEES: GuaranteeItem[] = [
  {
    label: "Atelier en France",
    description:
      "Toutes nos créations sont fabriquées dans notre atelier français",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
        viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    label: "Pièces uniques",
    description: "Chaque sac est numéroté — jamais deux fois le même modèle",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
        viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
        />
        <path d="M12 8v4l3 3" />
      </svg>
    )
  },
  {
    label: "Fait avec soin",
    description:
      "Du choix des matières à la dernière piqûre, chaque geste est humain",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
        viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  },
  {
    label: "Livraison soignée",
    description: "Emballage artisanal, expédition en 3–5 jours ouvrés",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
        viewBox="0 0 24 24">
        <rect
          height="13"
          rx="1"
          width="15"
          x="1"
          y="3"
        />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle
          cx="5.5"
          cy="18.5"
          r="2.5"
        />
        <circle
          cx="18.5"
          cy="18.5"
          r="2.5"
        />
      </svg>
    )
  }
];

export function HomepageGuaranteesSection() {
  return (
    <div className="-mx-4 border-t border-band-border bg-band-bg md:-mx-6 xl:-mx-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {GUARANTEES.map((item, index) => (
          <div
            className="flex items-center gap-4 border-b border-band-border px-6 py-6 sm:px-8 last:border-b-0 lg:border-b-0 lg:border-r lg:border-band-border lg:px-10 lg:py-8 lg:last:border-r-0"
            key={index}>
            <div className="shrink-0 text-band-icon">{item.icon}</div>
            <div>
              <p className="text-[0.75rem] font-medium tracking-[0.04em] text-band-foreground">
                {item.label}
              </p>
              <p className="mt-1 text-[0.68rem] leading-5 tracking-[0.06em] text-band-foreground-muted">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
