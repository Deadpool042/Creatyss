import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPageTemplate } from "@/components/storefront/legal/legal-page-template";
import { clientEnv } from "@/core/config/env";
import { getPublicSystemPage } from "@/features/storefront/content/pages";

const cgvTitle = "Conditions générales de vente";
const cgvDescription = "Conditions générales de vente de la boutique Creatyss.";
const cgvCanonical = `${clientEnv.appUrl}/conditions-generales-de-vente`;

export const metadata: Metadata = {
  title: cgvTitle,
  description: cgvDescription,
  alternates: {
    canonical: cgvCanonical,
  },
  openGraph: {
    title: cgvTitle,
    description: cgvDescription,
    url: cgvCanonical,
    type: "website",
  },
};

export default async function ConditionsGeneralesDeVentePage() {
  const page = await getPublicSystemPage("terms-of-sale");

  if (page === null) notFound();

  return <LegalPageTemplate title={page.title} body={page.body} />;
}
