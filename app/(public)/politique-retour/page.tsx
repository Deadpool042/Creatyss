import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPageTemplate } from "@/components/storefront/legal/legal-page-template";
import { clientEnv } from "@/core/config/env";
import { getPublicSystemPage } from "@/features/storefront/content/pages";

const politiqueRetourTitle = "Politique de retour";
const politiqueRetourDescription =
  "Politique de retour et de remboursement de la boutique Creatyss.";
const politiqueRetourCanonical = `${clientEnv.appUrl}/politique-retour`;

export const metadata: Metadata = {
  title: politiqueRetourTitle,
  description: politiqueRetourDescription,
  alternates: {
    canonical: politiqueRetourCanonical,
  },
  openGraph: {
    title: politiqueRetourTitle,
    description: politiqueRetourDescription,
    url: politiqueRetourCanonical,
    type: "website",
  },
};

export default async function PolitiqueRetourPage() {
  const page = await getPublicSystemPage("returns-policy");

  if (page === null) notFound();

  return <LegalPageTemplate title={page.title} body={page.body} />;
}
