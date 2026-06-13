"use client";

import { useEffect, useState, useTransition } from "react";

import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/shared";
import { setLocalizationMultilingualStateAction } from "@/features/admin/settings/actions/set-localization-multilingual-state.action";

type LocalizationMultilingualToggleProps = Readonly<{
  enabled: boolean;
}>;

export function LocalizationMultilingualToggle({
  enabled,
}: LocalizationMultilingualToggleProps) {
  const [checked, setChecked] = useState(enabled);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setChecked(enabled);
  }, [enabled]);

  function handleCheckedChange(nextChecked: boolean) {
    const previousChecked = checked;

    startTransition(async () => {
      setChecked(nextChecked);
      const result = await setLocalizationMultilingualStateAction(nextChecked);

      if (!result.ok) {
        setChecked(previousChecked);
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-3.5">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Sélecteur de langue storefront</p>
        <p className="text-xs text-muted-foreground">
          Active le niveau <code className="font-mono">multilingual</code> pour afficher le
          sélecteur de langue et ouvrir l&apos;écran de traductions.
        </p>
      </div>

      <Switch
        checked={checked}
        disabled={isPending}
        onCheckedChange={handleCheckedChange}
        aria-label="Activer le sélecteur de langue storefront"
      />
    </div>
  );
}
