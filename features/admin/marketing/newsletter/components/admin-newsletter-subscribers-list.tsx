"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleNewsletterSubscriberStatusAction } from "@/features/admin/marketing/newsletter/actions/toggle-newsletter-subscriber-status.action";
import type { AdminNewsletterSubscriberSummary } from "@/features/admin/marketing/newsletter/types/admin-newsletter-subscriber.types";

type AdminNewsletterSubscribersListProps = {
  subscribers: ReadonlyArray<AdminNewsletterSubscriberSummary>;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

type SubscriberBadgeVariant = "secondary" | "outline" | "destructive" | "default";

function getStatusLabel(status: AdminNewsletterSubscriberSummary["status"]): string {
  switch (status) {
    case "SUBSCRIBED":
      return "Abonné";
    case "UNSUBSCRIBED":
      return "Désabonné";
    case "BOUNCED":
      return "Rejeté";
    case "ARCHIVED":
      return "Archivé";
    case "PENDING":
    default:
      return "En attente";
  }
}

function getStatusBadgeVariant(status: AdminNewsletterSubscriberSummary["status"]): SubscriberBadgeVariant {
  switch (status) {
    case "SUBSCRIBED":
      return "secondary";
    case "BOUNCED":
    case "ARCHIVED":
      return "destructive";
    case "UNSUBSCRIBED":
    case "PENDING":
    default:
      return "outline";
  }
}

function getDisplayName(subscriber: AdminNewsletterSubscriberSummary): string | null {
  const parts = [subscriber.firstName, subscriber.lastName].filter((part): part is string => Boolean(part));
  return parts.length > 0 ? parts.join(" ") : null;
}

function SubscriberRow({ subscriber }: { subscriber: AdminNewsletterSubscriberSummary }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    subscriber.status,
    (
      _prev: AdminNewsletterSubscriberSummary["status"],
      next: AdminNewsletterSubscriberSummary["status"]
    ) => next
  );

  const isSubscribed = optimisticStatus === "SUBSCRIBED";
  const displayName = getDisplayName(subscriber);

  function handleToggle() {
    startTransition(async () => {
      setOptimisticStatus(isSubscribed ? "UNSUBSCRIBED" : "SUBSCRIBED");
      await toggleNewsletterSubscriberStatusAction(subscriber.id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{subscriber.email}</span>
          <Badge variant={getStatusBadgeVariant(optimisticStatus)}>{getStatusLabel(optimisticStatus)}</Badge>
          {subscriber.source ? <Badge variant="outline">{subscriber.source}</Badge> : null}
          {subscriber.customerId ? <Badge variant="outline">Client lié</Badge> : null}
        </div>
        {displayName ? <p className="truncate text-xs text-muted-foreground">{displayName}</p> : null}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Ajouté le {dateFormatter.format(new Date(subscriber.createdAt))}</span>
          {subscriber.subscribedAt ? (
            <span>Abonné le {dateFormatter.format(new Date(subscriber.subscribedAt))}</span>
          ) : null}
          {optimisticStatus === "UNSUBSCRIBED" && subscriber.unsubscribedAt ? (
            <span>Désabonné le {dateFormatter.format(new Date(subscriber.unsubscribedAt))}</span>
          ) : null}
        </div>
      </div>
      <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleToggle}>
        {isSubscribed ? "Désabonner" : "Réabonner"}
      </Button>
    </div>
  );
}

export function AdminNewsletterSubscribersList({ subscribers }: AdminNewsletterSubscribersListProps) {
  if (subscribers.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aucun abonné ne correspond aux filtres actuels.
      </p>
    );
  }

  return (
    <div className="divide-y divide-surface-border/40">
      {subscribers.map((subscriber) => (
        <SubscriberRow key={subscriber.id} subscriber={subscriber} />
      ))}
    </div>
  );
}
