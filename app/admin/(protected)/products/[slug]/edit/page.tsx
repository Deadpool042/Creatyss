import { notFound } from "next/navigation";
import { readAdminProductEditorBySlug } from "@/features/admin/products/editor";
import { ProductEditor, type ProductEditorData } from "@/components/admin/products/product-editor";

export default async function ProductEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const editor = await readAdminProductEditorBySlug(slug);

  if (!editor) {
    notFound();
  }

  const firstVariant = editor.variants[0];

  const product: ProductEditorData = {
    id: editor.id,
    slug: editor.slug,
    name: editor.name,
    status: editor.status,
    ...(editor.description ? { description: editor.description } : {}),
    ...(firstVariant?.sku ? { sku: firstVariant.sku } : {}),
    ...(firstVariant?.amount ? { price: parseFloat(firstVariant.amount) } : {}),
    ...(firstVariant?.compareAtAmount
      ? { compareAtPrice: parseFloat(firstVariant.compareAtAmount) }
      : {}),
  };

  return <ProductEditor product={product} />;
}
