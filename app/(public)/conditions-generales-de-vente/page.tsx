import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPageTemplate } from "@/components/storefront/legal/legal-page-template";
import { getPublicSystemPage } from "@/features/storefront/content/pages";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente de la boutique Creatyss.",
};

export default async function ConditionsGeneralesDeVentePage() {
  const page = await getPublicSystemPage("terms-of-sale");

  if (page === null) notFound();

  return <LegalPageTemplate title={page.title} body={page.body} />;
}
