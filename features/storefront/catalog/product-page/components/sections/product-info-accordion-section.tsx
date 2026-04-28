"use client";

/**
 * Accordions informations produit — fiche produit.
 *
 * Affiche les blocs Détails / Livraison & retours / Entretien
 * dans un Accordion Radix de type "multiple".
 * Contenu injecté via props ; fallback sobre si absent.
 */

import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type ProductInfoAccordionSectionProps = {
  detailsContent?: React.ReactNode;
  shippingContent?: React.ReactNode;
  careContent?: React.ReactNode;
};

export function ProductInfoAccordionSection({
  detailsContent,
  shippingContent,
  careContent,
}: ProductInfoAccordionSectionProps) {
  return (
    <Accordion type="multiple" className=" ">
      <AccordionItem value="details" className="overflow-hidden border-b border-shell-border/70">
        <AccordionTrigger className="rounded-xl px-3 py-4 text-base font-medium text-foreground transition-[background-color,color,box-shadow,transform] hover:bg-surface-panel/38 active:translate-y-px active:bg-surface-panel/52 focus-visible:ring-2 focus-visible:ring-focus-ring/35 data-[state=open]:bg-surface-panel/32 data-[state=open]:shadow-inset-soft">
          Détails
        </AccordionTrigger>
        <AccordionContent className="px-3 text-secondary-copy reading-compact text-foreground-muted h-fit">
          {detailsContent ?? (
            <p>Les caractéristiques détaillées de ce produit seront disponibles prochainement.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="shipping" className="overflow-hidden border-b border-shell-border/70">
        <AccordionTrigger className="rounded-xl px-3 py-4 text-base font-medium text-foreground transition-[background-color,color,box-shadow,transform] hover:bg-surface-panel/38 active:translate-y-px active:bg-surface-panel/52 focus-visible:ring-2 focus-visible:ring-focus-ring/35 data-[state=open]:bg-surface-panel/32 data-[state=open]:shadow-inset-soft">
          Livraison &amp; retours
        </AccordionTrigger>
        <AccordionContent className="px-3 text-secondary-copy reading-compact text-foreground-muted">
          {shippingContent ?? (
            <p>
              Les modalités de livraison et de retour sont confirmées au moment de la commande,
              selon les articles et l&apos;adresse de livraison.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="care" className="overflow-hidden ">
        <AccordionTrigger className="rounded-xl px-3 py-4 text-base font-medium text-foreground transition-[background-color,color,box-shadow,transform] hover:bg-surface-panel/38 active:translate-y-px active:bg-surface-panel/52 focus-visible:ring-2 focus-visible:ring-focus-ring/35 data-[state=open]:bg-surface-panel/32 data-[state=open]:shadow-inset-soft">
          Entretien
        </AccordionTrigger>
        <AccordionContent className="px-3 text-secondary-copy reading-compact text-foreground-muted">
          {careContent ?? (
            <p>
              Pour préserver la qualité de ce produit, suivez les instructions d&apos;entretien
              spécifiques.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
