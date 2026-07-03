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
import { createShippingZoneAction } from "@/features/admin/settings/actions/create-shipping-zone.action";

export function ShippingZoneCreateDialog() {
  const [open, setOpen] = useState(false);

  async function handleAction(formData: FormData) {
    setOpen(false);
    await createShippingZoneAction(formData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1.5">
          <Plus className="size-3.5" />
          Nouvelle zone
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle zone de livraison</DialogTitle>
        </DialogHeader>

        <form action={handleAction} className="grid gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sz-code">Code</Label>
            <Input
              id="sz-code"
              name="code"
              placeholder="UE"
              required
              maxLength={40}
              autoComplete="off"
            />
            <p className="text-[11px] text-muted-foreground/60">
              Lettres, chiffres, tirets, underscores.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sz-name">Nom</Label>
            <Input
              id="sz-name"
              name="name"
              placeholder="Union européenne"
              required
              maxLength={120}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sz-description">
              Description <span className="text-muted-foreground/60">(facultatif)</span>
            </Label>
            <Input
              id="sz-description"
              name="description"
              placeholder="Pays de l'Union européenne hors France"
              maxLength={400}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" size="sm">
              Créer la zone
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
