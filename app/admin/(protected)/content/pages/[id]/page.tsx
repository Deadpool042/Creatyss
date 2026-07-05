import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import {
  AdminStatusBadge,
  type AdminStatusVariant,
} from "@/components/admin/shared/admin-status-badge";
import {
  EditorialPageForm,
  PageBodyForm,
  PageStatusToggle,
  getAdminPageDetail,
  type AdminPageStatus,
} from "@/features/admin/pages";

const STATUS_VARIANTS: Record<AdminPageStatus, AdminStatusVariant> = {
  DRAFT: "draft",
  ACTIVE: "active",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
};

export const dynamic = "force-dynamic";

type AdminContentPageDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminContentPageDetailPage({
  params,
}: AdminContentPageDetailPageProps) {
  const { id } = await params;
  const page = await getAdminPageDetail(id);

  if (page === null) notFound();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title={page.title}
      navigation={{ label: "Retour", href: "/admin/content/pages" }}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Contenu", href: "/admin/content/overview" },
        { label: "Pages", href: "/admin/content/pages" },
        { label: page.title },
      ]}
      contentPreset="detail"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {page.isSystemPage ? (
              <span className="inline-flex h-5 shrink-0 items-center rounded-md bg-surface-subtle px-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Page système
              </span>
            ) : null}
            <AdminStatusBadge status={STATUS_VARIANTS[page.status]} />
          </div>
          <p className="text-xs text-muted-foreground">
            Slug : /{page.slug} · Code : {page.code}
            {page.isSystemPage ? " · Titre, slug et code non modifiables" : ""}
          </p>
        </div>
        {page.isSystemPage ? <PageStatusToggle pageId={page.id} status={page.status} /> : null}
      </div>

      {page.isSystemPage ? (
        <PageBodyForm pageId={page.id} body={page.body ?? ""} />
      ) : (
        <EditorialPageForm
          pageId={page.id}
          title={page.title}
          slug={page.slug}
          excerpt={page.excerpt}
          body={page.body}
          status={page.status}
        />
      )}
    </AdminPageShell>
  );
}
