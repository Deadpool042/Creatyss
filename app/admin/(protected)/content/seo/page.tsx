import Link from "next/link";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { Notice } from "@/components/shared/notice";
import { Button } from "@/components/ui/button";

export default function AdminContentSeoPage() {
  return (
    <AdminPageShell
      eyebrow="Contenu"
      title="SEO"
      description="Référencement et visibilité de la boutique sur les moteurs de recherche."
    >
      <Notice tone="note">
        Le SEO de base est déjà actif. Les titres, descriptions et URLs canoniques sont générés
        automatiquement pour chaque fiche produit et chaque article de blog publié.
      </Notice>

      <div className="grid gap-4 text-sm leading-relaxed text-muted-foreground max-w-xl">
        <p>
          Pour améliorer le référencement dès maintenant, assurez-vous que chaque fiche produit
          dispose d&apos;un titre SEO et d&apos;une description SEO dans l&apos;onglet SEO de
          l&apos;éditeur produit. Idem pour les articles de blog.
        </p>
        <p>
          Les réglages SEO avancés — sitemap personnalisé, redirections, données structurées
          enrichies — seront disponibles prochainement dans cette section.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/products">Gérer les produits</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/content/blog">Gérer le blog</Link>
        </Button>
      </div>
    </AdminPageShell>
  );
}
