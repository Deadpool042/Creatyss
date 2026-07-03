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
import { createShippingMethodAction } from "@/features/admin/settings/actions/create-shipping-method.action";

type ShippingMethodCreateDialogProps = Readonly<{
  shippingZoneId: string;
  zoneName: string;
  storeCurrencyCode: string;
}>;

export function ShippingMethodCreateDialog({
  shippingZoneId,
  zoneName,
  storeCurrencyCode,
}: ShippingMethodCreateDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleAction(formData: FormData) {
    setOpen(false);
    await createShippingMethodAction(formData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs">
          <Plus className="size-3.5" />
          Méthode
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle méthode — {zoneName}</DialogTitle>
        </DialogHeader>

        <form action={handleAction} className="grid gap-4 pt-2">
          <input type="hidden" name="shippingZoneId" value={shippingZoneId} />
          <input type="hidden" name="currencyCode" value={storeCurrencyCode} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sm-code">Code</Label>
              <Input
                id="sm-code"
                name="code"
                placeholder="EXPRESS"
                required
                maxLength={40}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sm-amount">Tarif ({storeCurrencyCode})</Label>
              <Input
                id="sm-amount"
                name="amount"
                type="text"
                inputMode="decimal"
                placeholder="9.90"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sm-name">Nom</Label>
            <Input
              id="sm-name"
              name="name"
              placeholder="Livraison express"
              required
              maxLength={120}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sm-min">
                Seuil minimum <span className="text-muted-foreground/60">(facultatif)</span>
              </Label>
              <Input
                id="sm-min"
                name="minSubtotalAmount"
                type="text"
                inputMode="decimal"
                placeholder="Aucun"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sm-max">
                Seuil maximum <span className="text-muted-foreground/60">(facultatif)</span>
              </Label>
              <Input
                id="sm-max"
                name="maxSubtotalAmount"
                type="text"
                inputMode="decimal"
                placeholder="Aucun"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" size="sm">
              Créer la méthode
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
