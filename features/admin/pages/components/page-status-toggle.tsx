"use client";

import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared";
import { toggleAdminPageStatusAction } from "../actions/toggle-admin-page-status.action";
import type { AdminPageBodyFormState } from "../schemas/admin-page-body.schema";
import type { AdminPageStatus } from "../types";

const INITIAL_STATE: AdminPageBodyFormState = { status: "idle" };

type PageStatusToggleProps = {
  pageId: string;
  status: AdminPageStatus;
};

/**
 * Publication / dépublication d'une page système.
 * Le serveur refuse la publication si le body est vide ou contient [TODO.
 */
export function PageStatusToggle({ pageId, status }: PageStatusToggleProps) {
  const action = toggleAdminPageStatusAction.bind(null, pageId);
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  const isActive = status === "ACTIVE";

  return (
    <form action={formAction} className="shrink-0">
      <Button
        type="submit"
        size="sm"
        variant={isActive ? "outline" : "default"}
        disabled={isPending}
        className="rounded-full"
      >
        {isPending ? "…" : isActive ? "Dépublier" : "Publier"}
      </Button>
    </form>
  );
}
