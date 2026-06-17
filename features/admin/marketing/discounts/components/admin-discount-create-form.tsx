"use client";

import { useState } from "react";

import { AdminCheckboxField } from "@/components/admin/forms/admin-checkbox-field";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminSelectField } from "@/components/admin/forms/admin-select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { createDiscountAction } from "@/features/admin/marketing/discounts/actions/create-discount.action";

type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
type DiscountScopeType = "ORDER" | "PRODUCT" | "PRODUCT_VARIANT" | "CATEGORY";

type AdminDiscountCreateFormProps = {
  automationEnabled: boolean;
  rulesEnabled: boolean;
  products: ReadonlyArray<{ id: string; name: string; slug: string }>;
  variants: ReadonlyArray<{ id: string; productName: string; variantName: string | null; sku: string }>;
  categories: ReadonlyArray<{ id: string; name: string; slug: string }>;
};

export function AdminDiscountCreateForm({
  automationEnabled,
  rulesEnabled,
  products,
  variants,
  categories,
}: AdminDiscountCreateFormProps) {
  const [type, setType] = useState<DiscountType>("PERCENTAGE");
  const [scopeType, setScopeType] = useState<DiscountScopeType>("ORDER");
  const allowsFreeShipping = scopeType === "ORDER";

  return (
    <form action={createDiscountAction} className="grid gap-4 sm:grid-cols-2">
      <AdminFormField
        htmlFor="discount-code"
        label="Code"
        required
        hint={
          automationEnabled ? (
            <span>
              Référence interne unique. Une remise automatique n&apos;est pas saisie par le client.
            </span>
          ) : undefined
        }
      >
        {(controlProps) => (
          <Input
            {...controlProps}
            id="discount-code"
            name="code"
            placeholder={automationEnabled ? "PROMO-ETE-AUTO" : "ETE2026"}
            maxLength={40}
          />
        )}
      </AdminFormField>

      <AdminFormField htmlFor="discount-name" label="Nom" required>
        {(controlProps) => (
          <Input
            {...controlProps}
            id="discount-name"
            name="name"
            placeholder="Promo été"
            maxLength={120}
          />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="discount-description"
        label="Description"
        className="sm:col-span-2"
      >
        {(controlProps) => (
          <Textarea
            {...controlProps}
            id="discount-description"
            name="description"
            rows={2}
            maxLength={500}
          />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="discount-codes"
        label="Codes secondaires"
        className="sm:col-span-2"
        hint="Optionnel. Un code par ligne ou separes par virgule. Ils appliqueront la meme remise que le code principal."
      >
        {(controlProps) => (
          <Textarea
            {...controlProps}
            id="discount-codes"
            name="discountCodes"
            rows={3}
            placeholder={"VIP-PRINTEMPS\nVIP-ATELIER"}
            maxLength={500}
          />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="discount-scope-type"
        label="Portée"
        hint={
          !rulesEnabled ? (
            <span>
              Le ciblage catalogue nécessite le niveau « rules ».
            </span>
          ) : undefined
        }
      >
        {(controlProps) => (
          <AdminSelectField
            {...controlProps}
            id="discount-scope-type"
            name="scopeType"
            value={scopeType}
            onChange={(event) => {
              const nextScopeType = event.target.value as DiscountScopeType;

              setScopeType(nextScopeType);

              if (nextScopeType !== "ORDER" && type === "FREE_SHIPPING") {
                setType("PERCENTAGE");
              }
            }}
          >
            <option value="ORDER">Commande entière</option>
            {rulesEnabled ? <option value="PRODUCT">Produits ciblés</option> : null}
            {rulesEnabled ? <option value="PRODUCT_VARIANT">Variantes ciblées</option> : null}
            {rulesEnabled ? <option value="CATEGORY">Catégories ciblées</option> : null}
          </AdminSelectField>
        )}
      </AdminFormField>

      <AdminFormField htmlFor="discount-type" label="Type de remise">
        {(controlProps) => (
          <AdminSelectField
            {...controlProps}
            id="discount-type"
            name="type"
            value={type}
            onChange={(event) => setType(event.target.value as DiscountType)}
          >
            <option value="PERCENTAGE">Pourcentage</option>
            <option value="FIXED_AMOUNT">Montant fixe</option>
            {rulesEnabled && allowsFreeShipping ? (
              <option value="FREE_SHIPPING">Livraison offerte</option>
            ) : null}
          </AdminSelectField>
        )}
      </AdminFormField>

      {rulesEnabled && scopeType === "PRODUCT" ? (
        <AdminFormSection
          title="Produits ciblés"
          className="sm:col-span-2"
          description="Sélectionnez les produits auxquels la remise s'applique."
          contentClassName="rounded-2xl border border-surface-border bg-surface-panel-soft p-3"
        >
          <ScrollArea className="h-56">
            <div className="grid gap-2 pr-3">
              {products.map((product) => (
                <AdminCheckboxField
                  key={product.id}
                  label={`${product.name} (${product.slug})`}
                  inputProps={{ name: "productIds", value: product.id }}
                />
              ))}
            </div>
          </ScrollArea>
        </AdminFormSection>
      ) : null}

      {rulesEnabled && scopeType === "PRODUCT_VARIANT" ? (
        <AdminFormSection
          title="Variantes ciblées"
          className="sm:col-span-2"
          description="Sélectionnez les variantes exactes auxquelles la remise s'applique."
          contentClassName="rounded-2xl border border-surface-border bg-surface-panel-soft p-3"
        >
          <ScrollArea className="h-56">
            <div className="grid gap-2 pr-3">
              {variants.map((variant) => (
                <AdminCheckboxField
                  key={variant.id}
                  label={`${variant.productName} — ${variant.variantName ?? "Variante"} (${variant.sku})`}
                  inputProps={{ name: "variantIds", value: variant.id }}
                />
              ))}
            </div>
          </ScrollArea>
        </AdminFormSection>
      ) : null}

      {rulesEnabled && scopeType === "CATEGORY" ? (
        <AdminFormSection
          title="Catégories ciblées"
          className="sm:col-span-2"
          description="Sélectionnez les catégories auxquelles la remise s'applique."
          contentClassName="rounded-2xl border border-surface-border bg-surface-panel-soft p-3"
        >
          <ScrollArea className="h-56">
            <div className="grid gap-2 pr-3">
              {categories.map((category) => (
                <AdminCheckboxField
                  key={category.id}
                  label={`${category.name} (${category.slug})`}
                  inputProps={{ name: "categoryIds", value: category.id }}
                />
              ))}
            </div>
          </ScrollArea>
        </AdminFormSection>
      ) : null}

      {type === "PERCENTAGE" ? (
        <AdminFormField htmlFor="discount-percentage" label="Pourcentage" required>
          {(controlProps) => (
            <Input
              {...controlProps}
              id="discount-percentage"
              name="percentageValue"
              type="number"
              min={0}
              max={100}
              step="0.01"
              placeholder="10"
            />
          )}
        </AdminFormField>
      ) : type === "FIXED_AMOUNT" ? (
        <AdminFormField htmlFor="discount-fixed-amount" label="Montant" required>
          {(controlProps) => (
            <Input
              {...controlProps}
              id="discount-fixed-amount"
              name="fixedAmountValue"
              type="number"
              min={0}
              step="0.01"
              placeholder="10"
            />
          )}
        </AdminFormField>
      ) : (
        <AdminFormField
          label="Livraison offerte"
          description="Annule le coût de livraison sélectionné au checkout."
        >
          <div className="h-9 rounded-lg border border-surface-border bg-surface-panel-soft px-3 py-2 text-sm text-muted-foreground">
            Aucun montant à saisir pour ce type de remise.
          </div>
        </AdminFormField>
      )}

      {automationEnabled ? (
        <AdminFormField
          label="Mode d'application"
          className="sm:col-span-2"
          hint="Applique cette remise automatiquement au checkout si aucun code manuel valide n'est utilisé."
        >
          <AdminCheckboxField
            label="Application automatique"
            inputProps={{ name: "isAutomatic", value: "true" }}
          />
        </AdminFormField>
      ) : null}

      {automationEnabled ? (
        <AdminFormField
          htmlFor="discount-priority"
          label="Priorité automatique"
          hint="Plus la valeur est elevee, plus la remise automatique est prioritaire si plusieurs regles sont eligibles."
        >
          {(controlProps) => (
            <Input
              {...controlProps}
              id="discount-priority"
              name="priority"
              type="number"
              min={0}
              step="1"
              defaultValue="0"
              placeholder="0"
            />
          )}
        </AdminFormField>
      ) : null}

      <AdminFormField htmlFor="discount-starts-at" label="Début de validité">
        {(controlProps) => (
          <Input {...controlProps} id="discount-starts-at" name="startsAt" type="datetime-local" />
        )}
      </AdminFormField>

      <AdminFormField htmlFor="discount-ends-at" label="Fin de validité">
        {(controlProps) => (
          <Input {...controlProps} id="discount-ends-at" name="endsAt" type="datetime-local" />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="discount-max-redemptions"
        label="Nombre max d'utilisations"
        className="sm:col-span-1"
        hint="Laissez vide pour autoriser un nombre illimité d'utilisations."
      >
        {(controlProps) => (
          <Input
            {...controlProps}
            id="discount-max-redemptions"
            name="maxRedemptions"
            type="number"
            min={1}
            step="1"
            placeholder="100"
          />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="discount-max-redemptions-per-code"
        label="Nombre max par code"
        className="sm:col-span-1"
        hint="Laissez vide pour ne pas plafonner chaque code individuellement."
      >
        {(controlProps) => (
          <Input
            {...controlProps}
            id="discount-max-redemptions-per-code"
            name="maxRedemptionsPerCode"
            type="number"
            min={1}
            step="1"
            placeholder="10"
          />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="discount-max-redemptions-per-user"
        label="Nombre max par client"
        className="sm:col-span-2"
        hint="Necessite un client identifie. Sans customerId, la remise est consideree non applicable."
      >
        {(controlProps) => (
          <Input
            {...controlProps}
            id="discount-max-redemptions-per-user"
            name="maxRedemptionsPerUser"
            type="number"
            min={1}
            step="1"
            placeholder="1"
          />
        )}
      </AdminFormField>

      <div className="sm:col-span-2">
        <Button type="submit">{automationEnabled ? "Créer la remise" : "Créer le code promo"}</Button>
      </div>
    </form>
  );
}
