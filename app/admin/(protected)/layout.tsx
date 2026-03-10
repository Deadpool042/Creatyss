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
              Se deconnecter
            </button>
          </form>
        </div>

        <nav aria-label="Navigation admin" className="admin-nav">
          <Link href="/admin">Accueil admin</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/admin/media">Bibliotheque media</Link>
        </nav>

        {children}
      </section>
    </div>
  );
}
