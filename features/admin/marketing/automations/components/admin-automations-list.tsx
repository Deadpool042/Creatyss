"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useOptimistic, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { archiveAutomationAction } from "@/features/admin/marketing/automations/actions/archive-automation.action";
import { toggleAutomationStatusAction } from "@/features/admin/marketing/automations/actions/toggle-automation-status.action";
import { updateAutomationAction } from "@/features/admin/marketing/automations/actions/update-automation.action";
import {
  AUTOMATION_ACTION_TYPES,
  AUTOMATION_ACTION_LABELS,
  AUTOMATION_TRIGGER_TYPES,
  AUTOMATION_TRIGGER_LABELS,
} from "@/features/admin/marketing/automations/shared/admin-automation-options";
import type {
  AdminAutomationDefinitionFilter,
  AdminAutomationSummary,
} from "@/features/admin/marketing/automations/types/admin-automation.types";
import type { AdminAutomationJobStatus } from "@/features/admin/marketing/automations/types/admin-automation-job.types";
import { cn } from "@/lib/utils";

type AdminAutomationsListProps = {
  automations: ReadonlyArray<AdminAutomationSummary>;
  selectedAutomationId: string | null | undefined;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const selectClassName = cn(
  "h-8 w-full min-w-0 rounded-lg border border-control-border bg-control-surface px-2.5 py-1 text-base shadow-control transition-all outline-none hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 md:text-sm"
);

type AutomationBadgeVariant = "secondary" | "outline" | "destructive" | "default";

function getStatusLabel(status: AdminAutomationSummary["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "INACTIVE":
      return "Inactif";
    case "ARCHIVED":
      return "Archivé";
    case "DRAFT":
    default:
      return "Brouillon";
  }
}

function getStatusBadgeVariant(status: AdminAutomationSummary["status"]): AutomationBadgeVariant {
  switch (status) {
    case "ACTIVE":
      return "secondary";
    case "ARCHIVED":
      return "destructive";
    case "INACTIVE":
    case "DRAFT":
    default:
      return "outline";
  }
}

function formatDelay(delayMinutes: number): string {
  if (delayMinutes <= 0) {
    return "Immédiat";
  }

  if (delayMinutes < 60) {
    return `${delayMinutes} min`;
  }

  const hours = Math.floor(delayMinutes / 60);
  const minutes = delayMinutes % 60;

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} min`;
}

function getLatestJobStatusLabel(status: NonNullable<AdminAutomationSummary["latestJobStatus"]>): string {
  switch (status) {
    case "PENDING":
      return "Dernier job en attente";
    case "RUNNING":
      return "Dernier job en cours";
    case "SUCCEEDED":
      return "Dernier job réussi";
    case "FAILED":
      return "Dernier job échoué";
    case "CANCELLED":
      return "Dernier job annulé";
  }
}

function formatActivityBadges(automation: AdminAutomationSummary): Array<{
  label: string;
  status: AdminAutomationJobStatus | null;
}> {
  const items: Array<{ label: string; status: AdminAutomationJobStatus | null }> = [];

  if (automation.jobActivity.pending > 0) {
    items.push({
      label: `${automation.jobActivity.pending} en attente`,
      status: "PENDING",
    });
  }

  if (automation.jobActivity.running > 0) {
    items.push({
      label: `${automation.jobActivity.running} en cours`,
      status: "RUNNING",
    });
  }

  if (automation.jobActivity.failed > 0) {
    items.push({
      label: `${automation.jobActivity.failed} échoué(s)`,
      status: "FAILED",
    });
  }

  if (automation.jobActivity.total > 0) {
    items.push({
      label: `${automation.jobActivity.total} job(s)`,
      status: null,
    });
  }

  return items;
}

function buildAutomationJobsHref(input: {
  automationId: string;
  status: AdminAutomationJobStatus | null;
  definition: AdminAutomationDefinitionFilter | null;
}): string {
  const params = new URLSearchParams();
  params.set("automation", input.automationId);

  if (input.status) {
    params.set("status", input.status);
  }

  if (input.definition) {
    params.set("definition", input.definition);
  }

  return `/admin/marketing/automations?${params.toString()}#automation-jobs`;
}

function buildAutomationsPageHref(input: {
  status: AdminAutomationJobStatus | null;
  definition: AdminAutomationDefinitionFilter | null;
}): string {
  const params = new URLSearchParams();

  if (input.status) {
    params.set("status", input.status);
  }

  if (input.definition) {
    params.set("definition", input.definition);
  }

  const query = params.toString();

  return query.length > 0
    ? `/admin/marketing/automations?${query}`
    : "/admin/marketing/automations";
}

function AutomationRow({
  automation,
  selectedAutomationId,
  selectedJobStatus,
  selectedDefinitionFilter,
}: {
  automation: AdminAutomationSummary;
  selectedAutomationId: string | null | undefined;
  selectedJobStatus: AdminAutomationJobStatus | null;
  selectedDefinitionFilter: AdminAutomationDefinitionFilter | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    automation.status,
    (_prev: AdminAutomationSummary["status"], next: AdminAutomationSummary["status"]) => next
  );

  const isActive = optimisticStatus === "ACTIVE";
  const activityBadges = formatActivityBadges(automation);
  const isSelected = selectedAutomationId === automation.id;
  const isLatestJobShortcutActive =
    isSelected &&
    automation.latestJobStatus !== null &&
    selectedJobStatus === automation.latestJobStatus;

  function handleToggle() {
    startTransition(async () => {
      setFeedbackError(null);
      setFeedbackMessage(null);
      setOptimisticStatus(isActive ? "INACTIVE" : "ACTIVE");
      const result = await toggleAutomationStatusAction(automation.id);

      if (!result.ok) {
        setOptimisticStatus(automation.status);
        setFeedbackError(result.error);
        return;
      }

      setFeedbackMessage(
        result.cancelledJobsCount > 0
          ? `Statut mis à jour. ${result.cancelledJobsCount} job(s) en attente annulé(s).`
          : "Statut mis à jour."
      );
      router.refresh();
    });
  }

  function handleUpdate(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setFeedbackError(null);
      setFeedbackMessage(null);

      const result = await updateAutomationAction(automation.id, formData);

      if (!result.ok) {
        setFeedbackError(result.error);
        return;
      }

      setIsEditing(false);
      setFeedbackMessage("Automation mise à jour.");
      router.refresh();
    });
  }

  function handleArchive(): void {
    const confirmed = window.confirm(
      `Supprimer l'automation "${automation.code}" ? Elle sera archivée et retirée de la liste active.`
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      setFeedbackError(null);
      setFeedbackMessage(null);

      const result = await archiveAutomationAction(automation.id);

      if (!result.ok) {
        setFeedbackError(result.error);
        return;
      }

      if (isSelected) {
        router.push(
          buildAutomationsPageHref({
            status: selectedJobStatus,
            definition: selectedDefinitionFilter,
          })
        );
        return;
      }

      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between",
        isSelected ? "bg-surface-subtle/30 px-3" : ""
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-foreground">{automation.code}</span>
          <Badge variant={getStatusBadgeVariant(optimisticStatus)}>
            {getStatusLabel(optimisticStatus)}
          </Badge>
        </div>
        <p className="truncate text-sm font-medium text-foreground">{automation.name}</p>
        {automation.description ? (
          <p className="text-xs text-muted-foreground">{automation.description}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Déclencheur : {AUTOMATION_TRIGGER_LABELS[automation.triggerType]}</span>
          <span>Action : {AUTOMATION_ACTION_LABELS[automation.actionType]}</span>
          <span>Délai : {formatDelay(automation.delayMinutes)}</span>
          <span>Créé le {dateFormatter.format(new Date(automation.createdAt))}</span>
          {automation.templateCode ? <span>Template : {automation.templateCode}</span> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {activityBadges.length > 0 ? (
            activityBadges.map((item) => {
              const isActiveStatus =
                isSelected && selectedJobStatus === item.status;
              return (
                <Link
                  key={item.label}
                  href={buildAutomationJobsHref({
                    automationId: automation.id,
                    status: item.status,
                    definition: selectedDefinitionFilter,
                  })}
                  className={cn(
                    "rounded-full border border-surface-border/60 px-2 py-0.5 text-muted-foreground transition-colors hover:border-control-border-strong hover:bg-surface-subtle/40",
                    isActiveStatus ? "border-control-border-strong bg-surface-subtle/40 text-foreground" : ""
                  )}
                >
                  {item.label}
                </Link>
              );
            })
          ) : (
            <span className="text-muted-foreground/70">Aucun job local pour le moment</span>
          )}
        </div>
        {automation.latestJobStatus && automation.latestJobAt ? (
          <Link
            href={buildAutomationJobsHref({
              automationId: automation.id,
              status: automation.latestJobStatus,
              definition: selectedDefinitionFilter,
            })}
            className={cn(
              "text-xs transition-colors hover:text-foreground hover:underline",
              isLatestJobShortcutActive ? "text-foreground underline" : "text-muted-foreground"
            )}
          >
            {getLatestJobStatusLabel(automation.latestJobStatus)} le{" "}
            {dateTimeFormatter.format(new Date(automation.latestJobAt))}
            {automation.latestJobStatus === "FAILED" && automation.latestJobError
              ? ` · ${automation.latestJobError}`
              : ""}
          </Link>
        ) : null}
        {feedbackMessage ? (
          <p className="text-xs text-feedback-success-foreground">{feedbackMessage}</p>
        ) : null}
        {feedbackError ? (
          <p className="text-xs text-feedback-error-foreground">{feedbackError}</p>
        ) : null}
        {isEditing ? (
          <form onSubmit={handleUpdate} className="mt-2 grid gap-4 rounded-xl border border-surface-border/60 bg-surface-subtle/20 p-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`automation-code-${automation.id}`}>Code</Label>
              <Input
                id={`automation-code-${automation.id}`}
                name="code"
                defaultValue={automation.code}
                maxLength={64}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`automation-name-${automation.id}`}>Nom</Label>
              <Input
                id={`automation-name-${automation.id}`}
                name="name"
                defaultValue={automation.name}
                maxLength={120}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor={`automation-description-${automation.id}`}>
                Description (optionnel)
              </Label>
              <Textarea
                id={`automation-description-${automation.id}`}
                name="description"
                rows={2}
                maxLength={500}
                defaultValue={automation.description ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`automation-trigger-type-${automation.id}`}>Déclencheur</Label>
              <select
                id={`automation-trigger-type-${automation.id}`}
                name="triggerType"
                className={selectClassName}
                defaultValue={automation.triggerType}
              >
                {AUTOMATION_TRIGGER_TYPES.map((triggerType) => (
                  <option key={triggerType} value={triggerType}>
                    {AUTOMATION_TRIGGER_LABELS[triggerType]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`automation-action-type-${automation.id}`}>Action</Label>
              <select
                id={`automation-action-type-${automation.id}`}
                name="actionType"
                className={selectClassName}
                defaultValue={automation.actionType}
              >
                {AUTOMATION_ACTION_TYPES.map((actionType) => (
                  <option key={actionType} value={actionType}>
                    {AUTOMATION_ACTION_LABELS[actionType]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`automation-delay-minutes-${automation.id}`}>Délai (minutes)</Label>
              <Input
                id={`automation-delay-minutes-${automation.id}`}
                name="delayMinutes"
                type="number"
                min={0}
                step={1}
                defaultValue={automation.delayMinutes}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`automation-template-code-${automation.id}`}>
                Code template (optionnel)
              </Label>
              <Input
                id={`automation-template-code-${automation.id}`}
                name="templateCode"
                defaultValue={automation.templateCode ?? ""}
                maxLength={100}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
              <Button type="submit" size="sm" disabled={isPending}>
                Enregistrer
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => {
                  setIsEditing(false);
                  setFeedbackError(null);
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant={isSelected ? "secondary" : "ghost"} size="sm">
          <Link
            href={buildAutomationJobsHref({
              automationId: automation.id,
              status: selectedJobStatus,
              definition: selectedDefinitionFilter,
            })}
          >
            Voir les jobs
          </Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => {
            setIsEditing((current) => !current);
            setFeedbackError(null);
            setFeedbackMessage(null);
          }}
        >
          {isEditing ? "Fermer" : "Modifier"}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleToggle}>
          {isActive ? "Désactiver" : "Activer"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          className="border-feedback-error-border/60 text-feedback-error-foreground hover:bg-feedback-error-surface"
          onClick={handleArchive}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
}

export function AdminAutomationsList({
  automations,
  selectedAutomationId,
  selectedJobStatus,
  selectedDefinitionFilter,
}: AdminAutomationsListProps) {
  if (automations.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aucune automation définie pour le moment.
      </p>
    );
  }

  return (
    <div className="divide-y divide-surface-border/40">
      {automations.map((automation) => (
        <AutomationRow
          key={automation.id}
          automation={automation}
          selectedAutomationId={selectedAutomationId}
          selectedJobStatus={selectedJobStatus}
          selectedDefinitionFilter={selectedDefinitionFilter}
        />
      ))}
    </div>
  );
}
