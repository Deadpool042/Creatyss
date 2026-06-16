"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createPriceListAction } from "@/features/admin/catalog/actions/create-price-list.action";
import { CURRENCY_OPTIONS } from "@/features/admin/catalog/shared/admin-pricing-routes";

const selectClassName = cn(
  "h-8 w-full min-w-0 rounded-lg border border-control-border bg-control-surface px-2.5 py-1 text-base shadow-control transition-all outline-none",
  "hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover",
  "focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 md:text-sm"
);

export function PriceListCreateDialog() {
  const [open, setOpen] = useState(false);

  async function handleAction(formData: FormData) {
    setOpen(false);
    await createPriceListAction(formData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1.5">
          <Plus className="size-3.5" />
          Nouvelle liste
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle liste de prix</DialogTitle>
        </DialogHeader>

        <form action={handleAction} className="grid gap-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pl-code">Code</Label>
              <Input
                id="pl-code"
                name="code"
                placeholder="STANDARD-EUR"
                required
                maxLength={40}
                autoComplete="off"
              />
              <p className="text-[11px] text-muted-foreground/60">
                Lettres, chiffres, tirets, underscores.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pl-currency">Devise</Label>
              <select
                id="pl-currency"
                name="currencyCode"
                className={selectClassName}
                defaultValue="EUR"
              >
                {CURRENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pl-name">Nom</Label>
            <Input
              id="pl-name"
              name="name"
              placeholder="Liste standard EUR"
              required
              maxLength={120}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pl-description">
              Description{" "}
              <span className="text-muted-foreground/60">(facultatif)</span>
            </Label>
            <Input
              id="pl-description"
              name="description"
              placeholder="Tarif public, devise euro"
              maxLength={400}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" size="sm">
              Créer la liste
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
