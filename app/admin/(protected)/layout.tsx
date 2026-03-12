import Link from "next/link";
import { requireAuthenticatedAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type ProtectedAdminLayoutProps = LayoutProps<"/admin">;

export default async function ProtectedAdminLayout({
  children
}: ProtectedAdminLayoutProps) {
  const admin = await requireAuthenticatedAdmin();

  return (
    <div className="page">
      <section className="section admin-shell">
        <div className="admin-toolbar">
          <div className="stack">
            <p className="eyebrow">Admin</p>
            <h1>{admin.displayName}</h1>
            <p className="card-meta">{admin.email}</p>
          </div>

          <form action="/admin/logout" method="post">
            <button className="button link-subtle" type="submit">
              Se déconnecter
            </button>
          </form>
        </div>

        <nav aria-label="Navigation admin" className="admin-nav">
          <Link href="/admin">Accueil admin</Link>
          <Link href="/admin/homepage">Page d&apos;accueil</Link>
          <Link href="/admin/blog">Blog</Link>
          <Link href="/admin/categories">Catégories</Link>
          <Link href="/admin/products">Produits</Link>
          <Link href="/admin/orders">Commandes</Link>
          <Link href="/admin/media">Bibliothèque médias</Link>
        </nav>

        {children}
      </section>
    </div>
  );
}
