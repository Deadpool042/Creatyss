export class AdminProductEditorServiceError extends Error {
  readonly code:
    | "product_missing"
    | "variant_missing"
    | "image_missing"
    | "media_asset_missing"
    | "product_type_missing"
    | "category_missing"
    | "related_product_missing"
    | "variant_slug_taken"
    | "variant_sku_taken"
    | "default_variant_required"
    | "cannot_delete_default_variant"
    | "option_values_invalid"
    | "inventory_invalid"
    | "product_not_variable";

  constructor(code: AdminProductEditorServiceError["code"], message?: string) {
    super(message ?? code);
    this.name = "AdminProductEditorServiceError";
    this.code = code;
  }
}
