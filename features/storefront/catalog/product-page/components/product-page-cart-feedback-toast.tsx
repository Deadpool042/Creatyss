"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { toast } from "@/components/shared/toast";

function getCartStatusMessage(status: string | null): string | null {
  switch (status) {
    case "added":
      return "Ajouté au panier.";
    default:
      return null;
  }
}

function getCartErrorMessage(error: string | null): string | null {
  switch (error) {
    case "missing_variant":
      return "La déclinaison demandée est introuvable.";
    case "missing_quantity":
    case "invalid_quantity":
      return "Renseignez une quantité entière supérieure ou égale à 1.";
    case "missing_variant_id":
    case "invalid_variant_id":
      return "La déclinaison sélectionnée est invalide.";
    case "variant_unavailable":
      return "Cette déclinaison n'est pas disponible actuellement.";
    case "insufficient_stock":
      return "Le stock disponible est insuffisant pour cette quantité.";
    case "save_failed":
      return "Impossible de mettre à jour le panier.";
    default:
      return null;
  }
}

export function ProductPageCartFeedbackToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const handledKeyRef = useRef<string | null>(null);

  const status = searchParams.get("cart_status");
  const error = searchParams.get("cart_error");

  useEffect(() => {
    const key = `${status ?? ""}:${error ?? ""}`;

    if (handledKeyRef.current === key) {
      return;
    }

    const statusMessage = getCartStatusMessage(status);
    const errorMessage = getCartErrorMessage(error);

    if (!statusMessage && !errorMessage) {
      return;
    }

    handledKeyRef.current = key;

    if (statusMessage) {
      toast.success(statusMessage);
    }

    if (errorMessage) {
      toast.error(errorMessage);
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("cart_status");
    nextParams.delete("cart_error");
    const nextQuery = nextParams.toString();

    router.replace(nextQuery.length > 0 ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [status, error, pathname, router, searchParams]);

  return null;
}
