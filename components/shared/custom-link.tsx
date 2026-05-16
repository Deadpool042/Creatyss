import Link from "next/link";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Types de variantes disponibles pour le composant CustomLink.
 *
 * Personnalisation visuelle par variante:
 * - default: lien de texte standard avec soulignement au survol.
 * - muted: lien discret, plus doux visuellement que default.
 * - brand: lien accentué avec la couleur de marque.
 * - nav: lien de navigation en capitales, adapté aux menus simples.
 * - navUnderline: lien de navigation avec soulignement animé via pseudo-élément.
 *
 * Lorsque `isActive` est activé, seules les variantes de navigation
 * (`nav` et `navUnderline`) reçoivent un style actif dédié.
 */
type CustomLinkVariant = "default" | "nav" | "navUnderline" | "muted" | "brand";

type CustomLinkActiveVariant = Extract<CustomLinkVariant, "nav" | "navUnderline">;

/**
 * Tailles typographiques disponibles pour le composant CustomLink.
 * - sm: texte compact (`text-xs`).
 * - md: texte standard (`text-sm`).
 * @typedef {("sm" | "md")} CustomLinkSize
 */
type CustomLinkSize = "sm" | "md";

/**
 * Propriétés du composant CustomLink.
 *
 * @property {ReactNode} children Contenu affiché à l'intérieur du lien.
 * @property {string} [className] Classes CSS additionnelles fusionnées en dernier
 * (elles peuvent donc surcharger les classes par défaut).
 * @property {boolean} [isActive=false] Active un style "courant" pour les liens
 * de navigation; sans effet spécifique pour `default`, `muted` et `brand`.
 * Les variantes actives sont typées via `CustomLinkActiveVariant`.
 * @property {CustomLinkVariant} [variant="default"] Variante visuelle appliquée
 * depuis `variantClasses`.
 * @property {CustomLinkSize} [size="md"] Taille typographique appliquée depuis
 * `sizeClasses`.
 */
type CustomLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & {
  children: ReactNode;

  className?: string;

  isActive?: boolean;

  variant?: CustomLinkVariant;

  size?: CustomLinkSize;
};

const baseClasses =
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring";

/**
 * Mapping des styles par variante.
 *
 * Pour ajouter une nouvelle variante:
 * 1. l'ajouter dans `CustomLinkVariant`;
 * 2. définir sa classe ici;
 * 3. si besoin d'un état actif, compléter `activeVariantClasses`.
 */
const variantClasses = {
  default: "text-foreground underline-offset-4 hover:text-brand hover:underline",

  muted: "text-text-muted-strong underline-offset-4 hover:text-foreground hover:underline",

  brand: "text-brand underline-offset-4 hover:underline",

  nav: "font-medium uppercase tracking-[0.22em] text-foreground/72 hover:text-brand",

  navUnderline: [
    "relative font-medium uppercase tracking-[0.22em]",

    "text-foreground/72 hover:text-brand",

    "after:absolute after:bottom-1 after:left-1/2 after:h-px after:w-[calc(100%-0.75rem)] after:-translate-x-1/2",

    "after:origin-center after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out",

    "hover:after:scale-x-100 focus-visible:text-brand focus-visible:after:scale-x-100",
  ].join(" "),
} satisfies Record<CustomLinkVariant, string>;

const activeVariantClasses = {
  nav: "text-brand",

  navUnderline: "text-brand after:scale-x-100",
} satisfies Record<CustomLinkActiveVariant, string>;

function getActiveVariantClassName(variant: CustomLinkVariant): string | null {
  switch (variant) {
    case "nav":
    case "navUnderline":
      return activeVariantClasses[variant];

    case "default":
    case "muted":
    case "brand":
      return null;
  }
}

/**
 * Mapping des tailles typographiques du lien.
 */
const sizeClasses: Record<CustomLinkSize, string> = {
  sm: "text-xs",

  md: "text-sm",
};

/**
 * Rend un lien Next.js stylisé selon les conventions visuelles du projet.
 *
 * Ce composant centralise les variantes de style de liens (navigation,
 * soulignement animé, marque, etc.) et applique l'état actif de manière
 * cohérente pour les menus.
 *
 * Ordre de composition CSS (du plus générique au plus spécifique):
 * 1. `baseClasses`
 * 2. `sizeClasses[size]`
 * 3. `variantClasses[variant]`
 * 4. `activeVariantClasses[variant]` si `isActive=true`
 * 5. `className` (surcharge finale)
 *
 * @param {CustomLinkProps} props Propriétés du lien.
 * @returns {JSX.Element} Un composant Link prêt à l'emploi.
 */
export function CustomLink({
  children,

  className,

  isActive = false,

  size = "md",

  variant = "default",

  ...props
}: CustomLinkProps) {
  const activeClassName = isActive ? getActiveVariantClassName(variant) : null;

  return (
    <Link
      className={cn(
        baseClasses,

        sizeClasses[size],

        variantClasses[variant],

        activeClassName,

        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
