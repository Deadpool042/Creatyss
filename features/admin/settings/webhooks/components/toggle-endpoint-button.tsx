"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Power } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleWebhookEndpointAction } from "@/features/admin/settings/webhooks/actions/toggle-webhook-endpoint.action";
import type { AdminWebhookEndpointSummary } from "@/features/admin/settings/queries/get-admin-webhooks-snapshot.query";

type ToggleEndpointButtonProps = {
  endpointId: string;
  status: AdminWebhookEndpointSummary["status"];
};

export function ToggleEndpointButton({ endpointId, status }: ToggleEndpointButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (status === "ARCHIVED" || status === "FAILED") {
    return null;
  }

  const isActive = status === "ACTIVE";
  const label = isActive ? "Désactiver" : "Activer";
  const pendingLabel = isActive ? "Désactivation…" : "Activation…";

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      const result = await toggleWebhookEndpointAction(endpointId);
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
        onClick={handleToggle}
        className="gap-1.5"
      >
        <Power className="size-3.5" />
        {isPending ? pendingLabel : label}
      </Button>
      {error ? (
        <p className="text-[12px] text-feedback-error-foreground max-w-[200px] text-right">
          {error}
        </p>
      ) : null}
    </div>
  );
}
