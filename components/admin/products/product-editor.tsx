"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Save } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  price: z.number().min(0, "Le prix doit être positif").optional(),
  compareAtPrice: z.number().min(0).optional(),
  sku: z.string().optional(),
});

export type ProductEditorValues = z.infer<typeof productSchema>;

export type ProductEditorData = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  status: "draft" | "published" | "archived";
  price?: number;
  compareAtPrice?: number;
  sku?: string;
};

type ProductEditorProps = {
  product: ProductEditorData;
  onSubmit?: (values: ProductEditorValues) => void | Promise<void>;
};

export function ProductEditor({ product, onSubmit }: ProductEditorProps) {
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [description, setDescription] = useState(product.description ?? "");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(product.status);
  const [price, setPrice] = useState(product.price?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(product.compareAtPrice?.toString() ?? "");
  const [sku, setSku] = useState(product.sku ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const raw = {
      name,
      slug,
      description: description || undefined,
      status,
      price: price ? parseFloat(price) : undefined,
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      sku: sku || undefined,
    };
    const result = productSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await onSubmit?.(result.data);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      {/* En-tête — mode édition */}
      <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link href="/admin/products">
              <ChevronLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <div>
            <p className="text-xs text-muted-foreground">Modification</p>
            <p className="text-sm font-semibold leading-tight">{product.name}</p>
          </div>
        </div>
        <Button type="submit" size="sm" disabled={submitting}>
          <Save className="mr-1.5 h-3.5 w-3.5" />
          Enregistrer
        </Button>
      </div>

      {/* Corps — formulaire structuré */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_256px]">
          {/* Colonne principale */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-name" className="text-xs">
                    Nom du produit <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex. Chemise en lin blanc"
                    className="text-sm"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-slug" className="text-xs">
                    Slug <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="chemise-lin-blanc"
                    className="font-mono text-sm"
                  />
                  {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-description" className="text-xs">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez ce produit..."
                    rows={5}
                    className="resize-none text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Prix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-price" className="text-xs">
                      Prix de vente (€)
                    </Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0,00"
                      className="text-sm"
                    />
                    {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-compare" className="text-xs">
                      Prix barré (€)
                    </Label>
                    <Input
                      id="edit-compare"
                      type="number"
                      step="0.01"
                      min="0"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="0,00"
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Référence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-sku" className="text-xs">
                    SKU
                  </Label>
                  <Input
                    id="edit-sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="ABC-123"
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale — publication */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Publication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-status" className="text-xs">
                    Statut
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as "draft" | "published" | "archived")}
                  >
                    <SelectTrigger id="edit-status" className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="archived">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  );
}
