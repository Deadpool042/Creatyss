"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { AdminCheckboxField } from "@/components/admin/forms/admin-checkbox-field";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { toast } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CUSTOMER_STATUS_LABELS, type CustomerLifecycleStatus } from "@/entities/customer";
import { updateAdminCustomerAction } from "../actions";
import {
  ADMIN_EDITABLE_CUSTOMER_STATUSES,
  ADMIN_CUSTOMER_NAME_MAX_LENGTH,
  ADMIN_CUSTOMER_NOTES_MAX_LENGTH,
  ADMIN_CUSTOMER_PHONE_MAX_LENGTH,
  type UpdateAdminCustomerFormState,
} from "../schemas";

const INITIAL_STATE: UpdateAdminCustomerFormState = { status: "idle" };

type CustomerDetailFormProps = Readonly<{
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    displayName: string | null;
    phone: string | null;
    status: CustomerLifecycleStatus;
    acceptsEmail: boolean;
    acceptsSms: boolean;
    notes: string | null;
  };
}>;

export function CustomerDetailForm({ customer }: CustomerDetailFormProps) {
  const action = updateAdminCustomerAction.bind(null, customer.id);
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state]);

  const fieldErrors = state.status === "error" ? state.fieldErrors ?? {} : {};

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && !state.fieldErrors ? (
        <div className="flex items-center gap-2.5 rounded-xl border border-feedback-error-border bg-feedback-error-surface/40 px-4 py-3">
          <XCircle className="size-4 shrink-0 text-feedback-error-foreground" />
          <p className="text-sm text-feedback-error-foreground">{state.message}</p>
        </div>
      ) : null}

      {state.status === "success" ? (
        <div className="flex items-center gap-2.5 rounded-xl border border-feedback-success-border bg-feedback-success-surface/40 px-4 py-3">
          <CheckCircle2 className="size-4 shrink-0 text-feedback-success-foreground" />
          <p className="text-sm text-feedback-success-foreground">{state.message}</p>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <AdminFormField label="Prénom" htmlFor="customer-first-name" error={fieldErrors.firstName}>
          {(controlProps) => (
            <Input
              {...controlProps}
              id="customer-first-name"
              name="firstName"
              defaultValue={customer.firstName ?? ""}
              maxLength={ADMIN_CUSTOMER_NAME_MAX_LENGTH}
            />
          )}
        </AdminFormField>

        <AdminFormField label="Nom" htmlFor="customer-last-name" error={fieldErrors.lastName}>
          {(controlProps) => (
            <Input
              {...controlProps}
              id="customer-last-name"
              name="lastName"
              defaultValue={customer.lastName ?? ""}
              maxLength={ADMIN_CUSTOMER_NAME_MAX_LENGTH}
            />
          )}
        </AdminFormField>

        <AdminFormField
          label="Nom affiché"
          htmlFor="customer-display-name"
          description="Utilisé si le prénom et le nom ne sont pas renseignés."
          error={fieldErrors.displayName}
        >
          {(controlProps) => (
            <Input
              {...controlProps}
              id="customer-display-name"
              name="displayName"
              defaultValue={customer.displayName ?? ""}
              maxLength={ADMIN_CUSTOMER_NAME_MAX_LENGTH}
            />
          )}
        </AdminFormField>

        <AdminFormField label="Téléphone" htmlFor="customer-phone" error={fieldErrors.phone}>
          {(controlProps) => (
            <Input
              {...controlProps}
              id="customer-phone"
              name="phone"
              defaultValue={customer.phone ?? ""}
              maxLength={ADMIN_CUSTOMER_PHONE_MAX_LENGTH}
              inputMode="tel"
            />
          )}
        </AdminFormField>

        <AdminFormField
          label="Statut"
          htmlFor="customer-status"
          description="Le statut archivé est géré via un flux dédié et n’est pas exposé dans ce formulaire."
          error={fieldErrors.status}
          className="md:col-span-2"
        >
          {(controlProps) => (
            <select
              {...controlProps}
              id="customer-status"
              name="status"
              defaultValue={customer.status}
              className="h-9 w-full rounded-lg border border-control-border bg-control-surface px-3 text-sm shadow-control outline-none transition-all hover:border-control-border-strong hover:bg-control-surface-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50"
            >
              {ADMIN_EDITABLE_CUSTOMER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {CUSTOMER_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          )}
        </AdminFormField>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <AdminCheckboxField
          label="Consentement email"
          inputProps={{
            name: "acceptsEmail",
            defaultChecked: customer.acceptsEmail,
          }}
        />
        <AdminCheckboxField
          label="Consentement SMS"
          inputProps={{
            name: "acceptsSms",
            defaultChecked: customer.acceptsSms,
          }}
        />
      </div>

      <AdminFormField
        label="Notes internes"
        htmlFor="customer-notes"
        description="Notes opératoires visibles uniquement dans l’admin."
        error={fieldErrors.notes}
      >
        {(controlProps) => (
          <Textarea
            {...controlProps}
            id="customer-notes"
            name="notes"
            defaultValue={customer.notes ?? ""}
            maxLength={ADMIN_CUSTOMER_NOTES_MAX_LENGTH}
            rows={6}
            className="min-h-36"
          />
        )}
      </AdminFormField>

      <div className="flex items-center justify-end border-t border-surface-border-subtle pt-5">
        <Button type="submit" disabled={isPending} className="min-w-32 rounded-full">
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
