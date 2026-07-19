import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPageTemplate } from "@/components/storefront/legal/legal-page-template";
import { clientEnv } from "@/core/config/env";
import { getPublicSystemPage } from "@/features/storefront/content/pages";

const mentionsLegalesTitle = "Mentions légales";
const mentionsLegalesDescription = "Mentions légales de la boutique Creatyss.";
const mentionsLegalesCanonical = `${clientEnv.appUrl}/mentions-legales`;

export const metadata: Metadata = {
  title: mentionsLegalesTitle,
  description: mentionsLegalesDescription,
  alternates: {
    canonical: mentionsLegalesCanonical,
  },
  openGraph: {
    title: mentionsLegalesTitle,
    description: mentionsLegalesDescription,
    url: mentionsLegalesCanonical,
    type: "website",
  },
};

export default async function MentionsLegalesPage() {
  const page = await getPublicSystemPage("legal-notice");

  if (page === null) notFound();

  return <LegalPageTemplate title={page.title} body={page.body} />;
}
