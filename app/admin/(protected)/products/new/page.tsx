import { createProductAction } from "@/features/admin/products/create";
import { ProductCreatePanel } from "@/features/admin/products/components";

export default function ProductCreatePage() {
  return <ProductCreatePanel action={createProductAction} />;
}
