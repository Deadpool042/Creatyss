import { setAdminCategoryImage } from "./set-admin-category-image.service";

type DeleteAdminCategoryImageServiceInput = {
  categoryId: string;
};

export async function deleteAdminCategoryImage(
  input: DeleteAdminCategoryImageServiceInput
): Promise<{ id: string }> {
  return setAdminCategoryImage({
    categoryId: input.categoryId,
    mediaAssetId: null,
  });
}
