"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { refreshMarketingIntentsAction } from "@/features/admin/marketing/intents/actions/refresh-marketing-intents.action";

export function AdminMarketingIntentsRefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);

  function handleRefresh() {
    startTransition(async () => {
      const result = await refreshMarketingIntentsAction();
      router.refresh();
      setSummary(
        `${result.scanned} événement(s) analysé(s) — ${result.created} créée(s), ${result.merged} fusionnée(s), ${result.ignored} ignorée(s).`
      );
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={handleRefresh}
      >
        {isPending ? "Analyse en cours…" : "Analyser les nouveaux événements"}
      </Button>
      {summary !== null ? <p className="text-xs text-muted-foreground">{summary}</p> : null}
    </div>
  );
}
