import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPageTemplate } from "@/components/storefront/legal/legal-page-template";
import { getPublicSystemPage } from "@/features/storefront/content/pages";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de la boutique Creatyss.",
};

export default async function PolitiqueConfidentialitePage() {
  const page = await getPublicSystemPage("privacy-policy");

  if (page === null) notFound();

  return <LegalPageTemplate title={page.title} body={page.body} />;
}
