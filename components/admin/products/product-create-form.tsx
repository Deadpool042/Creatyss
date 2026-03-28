"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";

// Type local — miroir structurel de CreateProductActionState (features layer)
// Pas d'import depuis features : couplage par structure, pas par référence
export type ProductCreateFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<"name" | "slug" | "shortDescription" | "status", string>>;
};

export const productCreateFormInitialState: ProductCreateFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductCreateFormAction = (
  prevState: ProductCreateFormState,
  formData: FormData,
) => Promise<ProductCreateFormState>;

type ProductCreateFormProps = {
  action: ProductCreateFormAction;
};

export function ProductCreateForm({ action }: ProductCreateFormProps) {
  const [state, formAction, pending] = useActionState(action, productCreateFormInitialState);

  return (
    <div className="flex h-full flex-col">
      {/* En-tête — mode création */}
      <div className="shrink-0 border-b px-6 py-5">
        <h2 className="text-sm font-semibold">Nouveau produit</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Ajouter un produit au catalogue
        </p>
      </div>

      <form action={formAction} className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-xl space-y-5 px-6 py-6">
            {/* Erreur globale */}
            {state.status === "error" && state.message && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                <p className="text-xs text-destructive">{state.message}</p>
              </div>
            )}

            {/* Nom */}
            <div className="space-y-1.5">
              <Label htmlFor="new-name" className="text-xs font-medium">
                Nom du produit <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-name"
                name="name"
                placeholder="Ex. Chemise en lin blanc"
                className="text-sm"
                autoFocus
              />
              {state.fieldErrors.name && (
                <p className="text-xs text-destructive">{state.fieldErrors.name}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="new-slug" className="text-xs font-medium">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-slug"
                name="slug"
                placeholder="chemise-lin-blanc"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Identifiant unique dans l'URL du produit — uniquement des lettres minuscules,
                chiffres et tirets
              </p>
              {state.fieldErrors.slug && (
                <p className="text-xs text-destructive">{state.fieldErrors.slug}</p>
              )}
            </div>

            <Separator />

            {/* Courte description */}
            <div className="space-y-1.5">
              <Label htmlFor="new-short-description" className="text-xs font-medium">
                Courte description
              </Label>
              <Textarea
                id="new-short-description"
                name="shortDescription"
                placeholder="Une phrase qui résume ce produit..."
                rows={3}
                className="resize-none text-sm"
              />
              {state.fieldErrors.shortDescription && (
                <p className="text-xs text-destructive">
                  {state.fieldErrors.shortDescription}
                </p>
              )}
            </div>

            <Separator />

            {/* Statut */}
            <div className="space-y-1.5">
              <Label htmlFor="new-status" className="text-xs font-medium">
                Statut initial
              </Label>
              <Select name="status" defaultValue="draft">
                <SelectTrigger id="new-status" className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    Brouillon — visible uniquement par les admins
                  </SelectItem>
                  <SelectItem value="published">
                    Publié — visible sur la boutique
                  </SelectItem>
                </SelectContent>
              </Select>
              {state.fieldErrors.status && (
                <p className="text-xs text-destructive">{state.fieldErrors.status}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pied de formulaire */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4">
          <Button variant="ghost" type="button" size="sm" asChild>
            <Link href="/admin/products">Annuler</Link>
          </Button>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Création…" : "Créer le produit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
