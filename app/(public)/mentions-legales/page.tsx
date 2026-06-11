import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPageTemplate } from "@/components/storefront/legal/legal-page-template";
import { getPublicSystemPage } from "@/features/storefront/content/pages";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de la boutique Creatyss.",
};

export default async function MentionsLegalesPage() {
  const page = await getPublicSystemPage("legal-notice");

  if (page === null) notFound();

  return <LegalPageTemplate title={page.title} body={page.body} />;
}
