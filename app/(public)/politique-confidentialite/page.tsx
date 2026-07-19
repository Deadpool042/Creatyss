import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPageTemplate } from "@/components/storefront/legal/legal-page-template";
import { clientEnv } from "@/core/config/env";
import { getPublicSystemPage } from "@/features/storefront/content/pages";

const politiqueConfidentialiteTitle = "Politique de confidentialité";
const politiqueConfidentialiteDescription = "Politique de confidentialité de la boutique Creatyss.";
const politiqueConfidentialiteCanonical = `${clientEnv.appUrl}/politique-confidentialite`;

export const metadata: Metadata = {
  title: politiqueConfidentialiteTitle,
  description: politiqueConfidentialiteDescription,
  alternates: {
    canonical: politiqueConfidentialiteCanonical,
  },
  openGraph: {
    title: politiqueConfidentialiteTitle,
    description: politiqueConfidentialiteDescription,
    url: politiqueConfidentialiteCanonical,
    type: "website",
  },
};

export default async function PolitiqueConfidentialitePage() {
  const page = await getPublicSystemPage("privacy-policy");

  if (page === null) notFound();

  return <LegalPageTemplate title={page.title} body={page.body} />;
}
