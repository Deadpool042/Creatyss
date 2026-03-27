import { revalidatePath } from "next/cache";

import { createProductService, getProductDetails, updateProductService } from "@features/products";
import { ProductEditor } from "@components/admin/products/product-editor";

type SearchParams = {
  editor?: string;
  productId?: string;
};

type ProductEditorPageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

const STORE_ID_PLACEHOLDER = "TODO_STORE_ID";

export default async function ProductEditorPage({ searchParams }: ProductEditorPageProps) {
  const params = searchParams ? await searchParams : {};
  const editorMode = params?.editor;
  const productId = params?.productId;

  if (editorMode !== "create" && editorMode !== "edit") {
    return null;
  }

  const product = editorMode === "edit" && productId ? await getProductDetails(productId) : null;

  async function handleCreate(formData: FormData) {
    "use server";

    const name = String(formData.get("name") ?? "");
    const slug = String(formData.get("slug") ?? "");
    const description = String(formData.get("description") ?? "");

    await createProductService({
      name,
      slug: slug || undefined,
      description: description || null,
      storeId: STORE_ID_PLACEHOLDER,
    });

    revalidatePath("/products");
  }

  async function handleUpdate(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "");
    const name = String(formData.get("name") ?? "");
    const slug = String(formData.get("slug") ?? "");
    const description = String(formData.get("description") ?? "");

    await updateProductService({
      id,
      name,
      slug: slug || undefined,
      description: description || null,
    });

    revalidatePath("/products");
  }

  return (
    <ProductEditor
      action={editorMode === "create" ? handleCreate : handleUpdate}
      mode={editorMode}
      open
      product={product}
    />
  );
}
