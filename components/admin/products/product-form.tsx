"use client";

import type { CreateProductInput, ProductDetailsDTO, UpdateProductInput } from "@features/products";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";

type ProductFormMode = "create" | "edit";

type ProductFormProps = {
  mode: ProductFormMode;
  product?: ProductDetailsDTO | null;
  action: (formData: FormData) => Promise<void>;
};

export function ProductForm({ mode, product, action }: ProductFormProps) {
  return (
    <form action={action} className="space-y-6">
      {mode === "edit" && product ? <input type="hidden" name="id" value={product.id} /> : null}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          defaultValue={product?.name ?? ""}
          id="name"
          name="name"
          placeholder="Everyday Tote"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          defaultValue={product?.slug ?? ""}
          id="slug"
          name="slug"
          placeholder="everyday-tote"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          defaultValue={product?.description ?? ""}
          id="description"
          name="description"
          placeholder="Short product description"
          rows={6}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">{mode === "create" ? "Create product" : "Save changes"}</Button>
      </div>
    </form>
  );
}
