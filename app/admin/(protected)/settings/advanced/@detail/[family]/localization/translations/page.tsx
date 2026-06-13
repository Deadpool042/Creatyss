import { notFound, redirect } from "next/navigation";

import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { LocalizationModuleShell } from "@/features/admin/pilotage/components/settings-advanced";
import { HomepageTranslationsForm } from "@/features/admin/settings/components/homepage-translations-form";
import { ProductPageTranslationsForm } from "@/features/admin/settings/components/product-page-translations-form";
import { listHomepageTranslations } from "@/features/admin/settings/queries/list-homepage-translations.query";
import { listProductPageTranslations } from "@/features/admin/settings/queries/list-product-page-translations.query";
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

  const [homepageState, productPageState] = await Promise.all([
    listHomepageTranslations(),
    listProductPageTranslations(),
  ]);

  if (!homepageState.hasTargetLocale) {
    return (
      <LocalizationModuleShell activeTab="translations">
        <AdminEmptyState
          eyebrow="Aucune langue secondaire"
          title="Aucune langue secondaire active"
          description="Activez une seconde locale pour pouvoir saisir des traductions."
        />
      </LocalizationModuleShell>
    );
  }

  return (
    <LocalizationModuleShell activeTab="translations">
      <div className="space-y-10">
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Accueil</h3>
            <p className="text-sm text-muted-foreground">
              Langue cible :{" "}
              <span className="font-medium text-foreground">{homepageState.targetLocale.name}</span>{" "}
              (<code className="font-mono text-[11px]">{homepageState.targetLocale.code}</code>)
            </p>
          </div>
          <HomepageTranslationsForm
            targetLocaleName={homepageState.targetLocale.name}
            fields={homepageState.fields}
          />
        </section>

        {productPageState.hasTargetLocale ? (
          <section className="space-y-4 border-t border-surface-border/40 pt-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Fiche produit</h3>
              <p className="text-sm text-muted-foreground">
                Langue cible :{" "}
                <span className="font-medium text-foreground">
                  {productPageState.targetLocale.name}
                </span>{" "}
                (<code className="font-mono text-[11px]">{productPageState.targetLocale.code}</code>)
              </p>
            </div>
            <ProductPageTranslationsForm
              targetLocaleName={productPageState.targetLocale.name}
              fields={productPageState.fields}
            />
          </section>
        ) : null}
      </div>
    </LocalizationModuleShell>
  );
}
