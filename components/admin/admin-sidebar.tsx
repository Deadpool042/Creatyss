import { AdminSidebarLink } from "./admin-sidebar-link";

type AdminSidebarProps = { displayName: string; email: string };

const NAV_GROUPS = [
  {
    label: "Catalogue",
    links: [
      { href: "/admin/products", label: "Produits" },
      { href: "/admin/categories", label: "Catégories" }
    ]
  },
  {
    label: "Contenu",
    links: [
      { href: "/admin/homepage", label: "Page d'accueil" },
      { href: "/admin/blog", label: "Blog" }
    ]
  },
  {
    label: "Opérations",
    links: [
      { href: "/admin/orders", label: "Commandes" },
      { href: "/admin/media", label: "Médias" }
    ]
  }
] as const;

export function AdminSidebar({ displayName, email }: AdminSidebarProps) {
  return (
    <aside className="shrink-0 border-b border-sidebar-border bg-white/95 md:w-56 md:border-b-0 md:border-r md:sticky md:top-0 md:h-screen md:flex md:flex-col">
      <div className="flex items-start justify-between gap-3 p-4 border-b border-sidebar-border">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8f5d2d] mb-1">
            Admin
          </p>
          <p className="text-sm font-semibold truncate">{displayName}</p>
          <p className="text-xs truncate text-muted-foreground">{email}</p>
        </div>
        <form action="/admin/logout" method="post" className="shrink-0">
          <button className="button link-subtle text-xs" type="submit">
            Se déconnecter
          </button>
        </form>
      </div>

      <nav
        aria-label="Navigation admin"
        className="flex flex-wrap gap-1 p-3 md:block md:flex-1 md:overflow-y-auto md:p-4"
      >
        <AdminSidebarLink href="/admin">Accueil</AdminSidebarLink>

        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="contents md:block md:mt-3">
            <p className="hidden md:block px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#8f5d2d]">
              {group.label}
            </p>
            {group.links.map((link) => (
              <AdminSidebarLink key={link.href} href={link.href}>
                {link.label}
              </AdminSidebarLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
