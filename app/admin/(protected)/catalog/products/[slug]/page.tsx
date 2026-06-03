import { redirect } from "next/navigation";
import { buildAdminProductEditPath } from "@/features/admin/products/navigation";

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(buildAdminProductEditPath(slug));
}
