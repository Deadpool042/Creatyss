type ProductEditorPageProps = {
  searchParams?: Promise<{
    editor?: string;
    productId?: string;
  }>;
};

export default async function ProductEditorPage({ searchParams }: ProductEditorPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const editorMode = params?.editor;
  const productId = params?.productId;

  if (editorMode !== "create" && editorMode !== "edit") {
    return null;
  }

  return <div>editor actif</div>;
}
