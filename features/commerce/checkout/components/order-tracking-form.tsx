"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function OrderTrackingForm() {
  const router = useRouter();
  const [reference, setReference] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = reference.trim();
    if (trimmed.length === 0) return;
    router.push(`/checkout/confirmation/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reference" className="mb-1.5 block text-[13px] font-medium text-foreground">
          Référence de commande
        </label>
        <input
          id="reference"
          name="reference"
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="CRY-XXXXXXXXXX"
          className="w-full rounded-xl border border-surface-border/60 bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <p className="mt-1.5 text-[11px] text-muted-foreground/60">
          Disponible dans votre email de confirmation.
        </p>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-foreground py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        Rechercher
      </button>
    </form>
  );
}
