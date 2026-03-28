"use client";

import { type JSX, useActionState } from "react";

import {
  createProductAction,
  initialCreateProductActionState,
} from "@/features/admin/products/create";

type ProductCreatePanelProps = {
  initialValues?: {
    name?: string;
    slug?: string;
    shortDescription?: string;
    status?: "draft" | "published";
  };
};

export function ProductCreatePanel({ initialValues }: ProductCreatePanelProps): JSX.Element {
  const [state, formAction, isPending] = useActionState(
    createProductAction,
    initialCreateProductActionState
  );

  return (
    <div className="rounded-2xl border bg-card">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">Nouveau produit</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Crée un produit avec les informations essentielles.
        </p>
      </div>

      <form action={formAction} className="space-y-6 p-6">
        <section className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="product-create-name" className="text-sm font-medium">
              Nom
            </label>
            <input
              id="product-create-name"
              name="name"
              defaultValue={initialValues?.name ?? ""}
              placeholder="Nom du produit"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            {state.fieldErrors.name ? (
              <p className="text-xs text-destructive">{state.fieldErrors.name}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="product-create-slug" className="text-sm font-medium">
              Slug
            </label>
            <input
              id="product-create-slug"
              name="slug"
              defaultValue={initialValues?.slug ?? ""}
              placeholder="nom-du-produit"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted-foreground">Utilisé dans l’URL admin et publique.</p>
            {state.fieldErrors.slug ? (
              <p className="text-xs text-destructive">{state.fieldErrors.slug}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="product-create-short-description" className="text-sm font-medium">
              Description courte
            </label>
            <textarea
              id="product-create-short-description"
              name="shortDescription"
              defaultValue={initialValues?.shortDescription ?? ""}
              placeholder="Résumé court du produit"
              rows={4}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            {state.fieldErrors.shortDescription ? (
              <p className="text-xs text-destructive">{state.fieldErrors.shortDescription}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="product-create-status" className="text-sm font-medium">
              Statut
            </label>
            <select
              id="product-create-status"
              name="status"
              defaultValue={initialValues?.status ?? "draft"}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
            {state.fieldErrors.status ? (
              <p className="text-xs text-destructive">{state.fieldErrors.status}</p>
            ) : null}
          </div>
        </section>

        {state.message ? (
          <div
            className={
              state.status === "success"
                ? "rounded-xl border border-green-200 bg-green-50 p-3 text-sm"
                : "rounded-xl border border-red-200 bg-red-50 p-3 text-sm"
            }
          >
            {state.message}
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            {isPending ? "Création..." : "Créer le produit"}
          </button>
        </div>
      </form>
    </div>
  );
}
