import { createProductAction } from "@/features/admin/products/create";
import {
  ProductCreateForm,
  type ProductCreateFormAction,
} from "@/components/admin/products/product-create-form";

export default function ProductCreatePage() {
  return (
    <ProductCreateForm action={createProductAction as unknown as ProductCreateFormAction} />
  );
}
