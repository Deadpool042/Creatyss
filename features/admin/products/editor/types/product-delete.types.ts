//features/admin/products/editor/types/product-delete.types.ts

export type DeleteProductInput = {
  productId: string;
};

export type DeleteProductResult =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
    };
