import { CategoriesListPanel } from "./categories-list-panel";

export const dynamic = "force-dynamic";

type AdminCategoriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCategoriesPage({ searchParams }: AdminCategoriesPageProps) {
  const resolvedSearchParams = await searchParams;
  return <CategoriesListPanel searchParams={resolvedSearchParams} />;
}
