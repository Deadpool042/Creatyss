export type ProductDeliverableKind =
  | "pattern_pdf"
  | "supply_list_pdf"
  | "instruction_pdf"
  | "bonus_file";

export type AdminProductDeliverableSummary = {
  id: string;
  productId: string;
  mediaAssetId: string;
  name: string;
  kind: ProductDeliverableKind;
  isPrimary: boolean;
  sortOrder: number;
  requiresPurchase: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminProductDeliverableDetail = AdminProductDeliverableSummary;

export type CreateAdminProductDeliverableInput = {
  productId: string;
  mediaAssetId: string;
  name: string;
  kind: ProductDeliverableKind;
  isPrimary?: boolean;
  sortOrder?: number;
  requiresPurchase?: boolean;
  isActive?: boolean;
};

export type UpdateAdminProductDeliverableInput = {
  id: string;
  name: string;
  kind: ProductDeliverableKind;
  isPrimary?: boolean;
  sortOrder?: number;
  requiresPurchase?: boolean;
  isActive?: boolean;
};

export type AdminProductDeliverableRepositoryErrorCode =
  | "product_deliverable_not_found"
  | "product_deliverable_product_not_found"
  | "product_deliverable_media_invalid"
  | "product_deliverable_name_invalid"
  | "product_deliverable_kind_invalid"
  | "product_deliverable_sort_order_invalid"
  | "product_deliverable_kind_mismatch";

export class AdminProductDeliverableRepositoryError extends Error {
  readonly code: AdminProductDeliverableRepositoryErrorCode;

  constructor(code: AdminProductDeliverableRepositoryErrorCode, message: string) {
    super(message);
    this.name = "AdminProductDeliverableRepositoryError";
    this.code = code;
  }
}
