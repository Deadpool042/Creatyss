import { CategoriesListPanel } from "../../categories-list-panel";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoriesListSlotDetailPage({ searchParams }: PageProps) {
  return <CategoriesListPanel searchParams={await searchParams} />;
}
