"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { retryWebhookDeliveryAction } from "@/features/admin/settings/webhooks/actions/retry-webhook-delivery.action";

type RetryDeliveryButtonProps = {
  deliveryId: string;
};

export function RetryDeliveryButton({ deliveryId }: RetryDeliveryButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleRetry() {
    setError(null);
    startTransition(async () => {
      const result = await retryWebhookDeliveryAction(deliveryId);
      if (!result.ok) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={handleRetry}
        className="gap-1.5"
      >
        <RotateCcw className="size-3.5" />
        {isPending ? "Relance…" : "Relancer"}
      </Button>
      {error ? (
        <p className="text-[12px] text-feedback-error-foreground max-w-[200px] text-right">
          {error}
        </p>
      ) : null}
    </div>
  );
}
