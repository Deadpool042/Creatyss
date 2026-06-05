import { CategoriesListPage } from "@/features/admin/categories/routes/categories-list-page";

export const dynamic = "force-dynamic";

type AdminCategoriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCategoriesPage({ searchParams }: AdminCategoriesPageProps) {
  const resolvedSearchParams = await searchParams;
  return <CategoriesListPage searchParams={resolvedSearchParams} />;
}
