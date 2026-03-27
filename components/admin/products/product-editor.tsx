import type { ProductDetailsDTO } from "@features/products";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet";

import { ProductForm } from "./product-form";

type ProductEditorMode = "create" | "edit";

type ProductEditorProps = {
  open: boolean;
  mode: ProductEditorMode;
  product?: ProductDetailsDTO | null;
  action: (formData: FormData) => Promise<void>;
};

export function ProductEditor({ open, mode, product, action }: ProductEditorProps) {
  if (!open) {
    return null;
  }

  const title = mode === "create" ? "Create product" : "Edit product";
  const description =
    mode === "create" ? "Add a new product to your catalog." : "Update the selected product.";

  return (
    <Sheet open>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader className="mb-6">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <ProductForm mode={mode} product={product} action={action} />
      </SheetContent>
    </Sheet>
  );
}
