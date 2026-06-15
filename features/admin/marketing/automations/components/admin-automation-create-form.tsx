"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAutomationAction } from "@/features/admin/marketing/automations/actions/create-automation.action";
import {
  AUTOMATION_ACTION_LABELS,
  AUTOMATION_ACTION_TYPES,
  AUTOMATION_TRIGGER_LABELS,
  AUTOMATION_TRIGGER_TYPES,
} from "@/features/admin/marketing/automations/shared/admin-automation-options";
import { cn } from "@/lib/utils";

const selectClassName = cn(
  "h-8 w-full min-w-0 rounded-lg border border-control-border bg-control-surface px-2.5 py-1 text-base shadow-control transition-all outline-none hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 md:text-sm"
);

export function AdminAutomationCreateForm() {
  return (
    <form action={createAutomationAction} className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="automation-code">Code</Label>
        <Input
          id="automation-code"
          name="code"
          placeholder="ABANDONED_CART_EMAIL"
          required
          maxLength={64}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="automation-name">Nom</Label>
        <Input
          id="automation-name"
          name="name"
          placeholder="Relance panier abandonné"
          required
          maxLength={120}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="automation-description">Description (optionnel)</Label>
        <Textarea id="automation-description" name="description" rows={2} maxLength={500} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="automation-trigger-type">Déclencheur</Label>
        <select id="automation-trigger-type" name="triggerType" className={selectClassName} defaultValue="CART_ABANDONED">
          {AUTOMATION_TRIGGER_TYPES.map((triggerType) => (
            <option key={triggerType} value={triggerType}>
              {AUTOMATION_TRIGGER_LABELS[triggerType]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="automation-action-type">Action</Label>
        <select id="automation-action-type" name="actionType" className={selectClassName} defaultValue="EMAIL_MESSAGE">
          {AUTOMATION_ACTION_TYPES.map((actionType) => (
            <option key={actionType} value={actionType}>
              {AUTOMATION_ACTION_LABELS[actionType]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="automation-delay-minutes">Délai (minutes)</Label>
        <Input
          id="automation-delay-minutes"
          name="delayMinutes"
          type="number"
          min={0}
          step={1}
          defaultValue={0}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="automation-template-code">Code template (optionnel)</Label>
        <Input
          id="automation-template-code"
          name="templateCode"
          placeholder="cart-abandoned-v1"
          maxLength={100}
        />
      </div>

      <div className="sm:col-span-2">
        <Button type="submit">Créer l&apos;automation</Button>
      </div>
    </form>
  );
}
