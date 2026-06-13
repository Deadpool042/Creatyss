import { notFound, redirect } from "next/navigation";

import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { LocalizationModuleShell } from "@/features/admin/pilotage/components/settings-advanced";
import { HomepageTranslationsForm } from "@/features/admin/settings/components/homepage-translations-form";
import { listHomepageTranslations } from "@/features/admin/settings/queries/list-homepage-translations.query";
import { meetsLocalizationLevel } from "@/features/localization/queries/get-localization-feature-state.query";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ family: string }>;
};

export default async function AdvancedSettingsDetailLocalizationTranslationsPage({
  params,
}: PageProps) {
  const { family } = await params;

  if (family !== "optional") {
    notFound();
  }

  const featureActive = await meetsLocalizationLevel("multilingual");

  if (!featureActive) {
    redirect("/admin/settings/advanced/optional");
  }

  const state = await listHomepageTranslations();

  return (
    <LocalizationModuleShell activeTab="translations">
        {!state.hasTargetLocale ? (
          <AdminEmptyState
            eyebrow="Aucune langue secondaire"
            title="Aucune langue secondaire active"
            description="Activez une seconde locale pour pouvoir saisir des traductions."
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Langue cible :{" "}
              <span className="font-medium text-foreground">{state.targetLocale.name}</span>{" "}
              (<code className="font-mono text-[11px]">{state.targetLocale.code}</code>)
            </p>
            <HomepageTranslationsForm
              targetLocaleName={state.targetLocale.name}
              fields={state.fields}
            />
          </div>
        )}
    </LocalizationModuleShell>
  );
}
