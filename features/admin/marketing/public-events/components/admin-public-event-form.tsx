"use client";

import { useState } from "react";

import { AdminCheckboxField } from "@/components/admin/forms/admin-checkbox-field";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function toDateTimeLocalValue(value: Date | null): string {
  if (value === null) {
    return "";
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

export type AdminPublicEventFormDefaultValues = Readonly<{
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  locationName: string | null;
  locationAddress: string | null;
  hasSpecialConditions: boolean;
  specialConditionsNote: string | null;
}>;

type AdminPublicEventFormProps = Readonly<{
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: AdminPublicEventFormDefaultValues;
  submitLabel: string;
}>;

export function AdminPublicEventForm({
  action,
  defaultValues,
  submitLabel,
}: AdminPublicEventFormProps) {
  const [hasSpecialConditions, setHasSpecialConditions] = useState(
    defaultValues?.hasSpecialConditions ?? false
  );

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <AdminFormField htmlFor="public-event-title" label="Titre" required>
        {(controlProps) => (
          <Input
            {...controlProps}
            id="public-event-title"
            name="title"
            placeholder="Marché de printemps"
            maxLength={160}
            defaultValue={defaultValues?.title}
          />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="public-event-slug"
        label="Slug"
        hint="Laissez vide pour le générer automatiquement à partir du titre."
      >
        {(controlProps) => (
          <Input
            {...controlProps}
            id="public-event-slug"
            name="slug"
            placeholder="marche-de-printemps"
            maxLength={160}
            defaultValue={defaultValues?.slug}
          />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="public-event-starts-at"
        label="Date de début"
        required
        className="sm:col-span-1"
      >
        {(controlProps) => (
          <Input
            {...controlProps}
            id="public-event-starts-at"
            name="startsAt"
            type="datetime-local"
            defaultValue={toDateTimeLocalValue(defaultValues?.startsAt ?? null)}
          />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="public-event-ends-at"
        label="Date de fin"
        hint="Optionnel."
        className="sm:col-span-1"
      >
        {(controlProps) => (
          <Input
            {...controlProps}
            id="public-event-ends-at"
            name="endsAt"
            type="datetime-local"
            defaultValue={toDateTimeLocalValue(defaultValues?.endsAt ?? null)}
          />
        )}
      </AdminFormField>

      <AdminFormField htmlFor="public-event-location-name" label="Lieu" required>
        {(controlProps) => (
          <Input
            {...controlProps}
            id="public-event-location-name"
            name="locationName"
            placeholder="Place du marché"
            maxLength={160}
            defaultValue={defaultValues?.locationName ?? undefined}
          />
        )}
      </AdminFormField>

      <AdminFormField htmlFor="public-event-location-address" label="Adresse" hint="Optionnel.">
        {(controlProps) => (
          <Input
            {...controlProps}
            id="public-event-location-address"
            name="locationAddress"
            placeholder="12 place du marché, 75000 Paris"
            maxLength={300}
            defaultValue={defaultValues?.locationAddress ?? undefined}
          />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="public-event-short-description"
        label="Résumé"
        hint="Optionnel."
        className="sm:col-span-2"
      >
        {(controlProps) => (
          <Textarea
            {...controlProps}
            id="public-event-short-description"
            name="shortDescription"
            rows={2}
            maxLength={300}
            defaultValue={defaultValues?.shortDescription ?? undefined}
          />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="public-event-description"
        label="Description"
        hint="Optionnel."
        className="sm:col-span-2"
      >
        {(controlProps) => (
          <Textarea
            {...controlProps}
            id="public-event-description"
            name="description"
            rows={5}
            maxLength={5000}
            defaultValue={defaultValues?.description ?? undefined}
          />
        )}
      </AdminFormField>

      <div className="sm:col-span-2">
        <AdminCheckboxField
          label="Conditions spéciales (inscription conseillée, places limitées, etc.)"
          inputProps={{
            name: "hasSpecialConditions",
            defaultChecked: defaultValues?.hasSpecialConditions ?? false,
            onChange: (event) => setHasSpecialConditions(event.currentTarget.checked),
          }}
        />
      </div>

      {hasSpecialConditions ? (
        <AdminFormField
          htmlFor="public-event-special-conditions-note"
          label="Note de conditions spéciales"
          required
          hint="Purement informatif — affiché côté public, sans logique de blocage."
          className="sm:col-span-2"
        >
          {(controlProps) => (
            <Input
              {...controlProps}
              id="public-event-special-conditions-note"
              name="specialConditionsNote"
              placeholder="Inscription conseillée, places limitées"
              maxLength={300}
              defaultValue={defaultValues?.specialConditionsNote ?? undefined}
            />
          )}
        </AdminFormField>
      ) : null}

      <div className="sm:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
