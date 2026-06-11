import { notFound } from "next/navigation";

import {
  PageBodyForm,
  PagesPageHeader,
  PagesPageShell,
  getAdminPageDetail,
} from "@/features/admin/pages";

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
    <PagesPageShell>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <PagesPageHeader title={page.title} />
          {page.isSystemPage ? (
            <span className="inline-flex h-5 shrink-0 items-center rounded-md bg-surface-subtle px-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Page système
            </span>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          Slug : /{page.slug} · Code : {page.code}
          {page.isSystemPage ? " · Titre, slug et code non modifiables" : ""}
        </p>
      </div>

      {page.isSystemPage ? (
        <PageBodyForm pageId={page.id} body={page.body ?? ""} />
      ) : (
        <div className="rounded-2xl border border-surface-border bg-surface-panel p-6">
          <p className="text-sm text-muted-foreground">
            L&apos;édition des pages éditoriales sera disponible dans un prochain lot.
          </p>
        </div>
      )}
    </PagesPageShell>
  );
}
