import { CategoriesListPage } from "@/features/admin/categories/routes/categories-list-page";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoriesListOverviewPage({ searchParams }: PageProps) {
  return <CategoriesListPage searchParams={await searchParams} />;
}
