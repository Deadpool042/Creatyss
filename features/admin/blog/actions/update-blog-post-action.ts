"use server";

type ImageSelection =
  | { kind: "keep" }
  | { kind: "clear" }
  | { kind: "select"; mediaAssetId: string };

function getMediaAssetId(selection: ImageSelection): string | null | undefined {
  if (selection.kind === "select") {
    return selection.mediaAssetId;
  }

  if (selection.kind === "clear") {
    return null;
  }

  return undefined;
}

export async function updateBlogPostAction(_formData: FormData) {
  const primaryImageSelection: ImageSelection = { kind: "keep" };
  const coverImageSelection: ImageSelection = { kind: "keep" };

  void getMediaAssetId(primaryImageSelection);
  void getMediaAssetId(coverImageSelection);

  return {
    status: "success" as const,
    message: "Mise à jour effectuée.",
  };
}
