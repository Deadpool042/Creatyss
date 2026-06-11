import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPageTemplate } from "@/components/storefront/legal/legal-page-template";
import { getPublicSystemPage } from "@/features/storefront/content/pages";

export const metadata: Metadata = {
  title: "Politique de retour",
  description: "Politique de retour et de remboursement de la boutique Creatyss.",
};

export default async function PolitiqueRetourPage() {
  const page = await getPublicSystemPage("returns-policy");

  if (page === null) notFound();

  return <LegalPageTemplate title={page.title} body={page.body} />;
}
