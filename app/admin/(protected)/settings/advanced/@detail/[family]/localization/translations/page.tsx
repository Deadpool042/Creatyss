import { notFound, redirect } from "next/navigation";

import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { LocalizationModuleShell } from "@/features/admin/pilotage/components/settings-advanced";
import { HomepageTranslationsForm } from "@/features/admin/settings/components/homepage-translations-form";
import { ProductPageTranslationsForm } from "@/features/admin/settings/components/product-page-translations-form";
import { BoutiquePageTranslationsForm } from "@/features/admin/settings/components/boutique-page-translations-form";
import { ContactPageTranslationsForm } from "@/features/admin/settings/components/contact-page-translations-form";
import { AProposPageTranslationsForm } from "@/features/admin/settings/components/a-propos-page-translations-form";
import { LesMarchesPageTranslationsForm } from "@/features/admin/settings/components/les-marches-page-translations-form";
import { listHomepageTranslations } from "@/features/admin/settings/queries/list-homepage-translations.query";
import { listProductPageTranslations } from "@/features/admin/settings/queries/list-product-page-translations.query";
import { listBoutiquePageTranslations } from "@/features/admin/settings/queries/list-boutique-page-translations.query";
import { listContactPageTranslations } from "@/features/admin/settings/queries/list-contact-page-translations.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";
import { listAProposPageTranslations } from "@/features/admin/settings/queries/list-a-propos-page-translations.query";
import { listLesMarchesPageTranslations } from "@/features/admin/settings/queries/list-les-marches-page-translations.query";

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

  const featureActive = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual");

  if (!featureActive) {
    redirect("/admin/settings/advanced/optional");
  }

  const [
    homepageState,
    productPageState,
    boutiquePageState,
    contactPageState,
    aProposPageState,
    lesMarchesPageState,
  ] = await Promise.all([
    listHomepageTranslations(),
    listProductPageTranslations(),
    listBoutiquePageTranslations(),
    listContactPageTranslations(),
    listAProposPageTranslations(),
    listLesMarchesPageTranslations(),
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
                (<code className="font-mono text-[11px]">{productPageState.targetLocale.code}</code>
                )
              </p>
            </div>
            <ProductPageTranslationsForm
              targetLocaleName={productPageState.targetLocale.name}
              fields={productPageState.fields}
            />
          </section>
        ) : null}

        {boutiquePageState.hasTargetLocale ? (
          <section className="space-y-4 border-t border-surface-border/40 pt-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Page boutique</h3>
              <p className="text-sm text-muted-foreground">
                Langue cible :{" "}
                <span className="font-medium text-foreground">
                  {boutiquePageState.targetLocale.name}
                </span>{" "}
                (
                <code className="font-mono text-[11px]">{boutiquePageState.targetLocale.code}</code>
                )
              </p>
            </div>
            <BoutiquePageTranslationsForm
              targetLocaleName={boutiquePageState.targetLocale.name}
              fields={boutiquePageState.fields}
            />
          </section>
        ) : null}

        {contactPageState.hasTargetLocale ? (
          <section className="space-y-4 border-t border-surface-border/40 pt-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Page Contact</h3>
              <p className="text-sm text-muted-foreground">
                Langue cible :{" "}
                <span className="font-medium text-foreground">
                  {contactPageState.targetLocale.name}
                </span>{" "}
                (<code className="font-mono text-[11px]">{contactPageState.targetLocale.code}</code>
                )
              </p>
            </div>
            <ContactPageTranslationsForm
              targetLocaleName={contactPageState.targetLocale.name}
              fields={contactPageState.fields}
            />
          </section>
        ) : null}

        {aProposPageState.hasTargetLocale ? (
          <section className="space-y-4 border-t border-surface-border/40 pt-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Page À propos</h3>
              <p className="text-sm text-muted-foreground">
                Langue cible :{" "}
                <span className="font-medium text-foreground">
                  {aProposPageState.targetLocale.name}
                </span>{" "}
                (<code className="font-mono text-[11px]">{aProposPageState.targetLocale.code}</code>
                )
              </p>
            </div>
            <AProposPageTranslationsForm
              targetLocaleName={aProposPageState.targetLocale.name}
              fields={aProposPageState.fields}
            />
          </section>
        ) : null}

        {lesMarchesPageState.hasTargetLocale ? (
          <section className="space-y-4 border-t border-surface-border/40 pt-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Page Les marchés</h3>
              <p className="text-sm text-muted-foreground">
                Langue cible :{" "}
                <span className="font-medium text-foreground">
                  {lesMarchesPageState.targetLocale.name}
                </span>{" "}
                (
                <code className="font-mono text-[11px]">
                  {lesMarchesPageState.targetLocale.code}
                </code>
                )
              </p>
            </div>
            <LesMarchesPageTranslationsForm
              targetLocaleName={lesMarchesPageState.targetLocale.name}
              fields={lesMarchesPageState.fields}
            />
          </section>
        ) : null}
      </div>
    </LocalizationModuleShell>
  );
}
