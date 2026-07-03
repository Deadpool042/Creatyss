import { Globe, Star } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LocalizationModuleShell } from "@/features/admin/pilotage/components/settings-advanced";
import { setDefaultLocalizationLocaleAction } from "@/features/admin/settings/actions/set-default-localization-locale.action";
import {
  listAdminLocalizationLocales,
  type AdminLocalizationLocaleSummary,
} from "@/features/admin/settings/queries/list-admin-localization-locales.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<AdminLocalizationLocaleSummary["status"], string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ARCHIVED: "Archivee",
};

function LocaleStatusBadge({ status }: { status: AdminLocalizationLocaleSummary["status"] }) {
  if (status === "ACTIVE") {
    return (
      <Badge
        variant="outline"
        className="border-feedback-success-border/60 bg-feedback-success-surface/30 text-feedback-success-foreground"
      >
        {STATUS_LABELS[status]}
      </Badge>
    );
  }

  if (status === "INACTIVE") {
    return (
      <Badge variant="outline" className="border-surface-border/60 text-muted-foreground">
        {STATUS_LABELS[status]}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-surface-border/60 text-muted-foreground/70">
      {STATUS_LABELS[status]}
    </Badge>
  );
}

type PageProps = {
  params: Promise<{ family: string }>;
};

async function setDefaultLocale(formData: FormData) {
  "use server";
  await setDefaultLocalizationLocaleAction(formData);
}

export default async function AdvancedSettingsDetailLocalizationSettingsPage({
  params,
}: PageProps) {
  const { family } = await params;

  if (family !== "optional") {
    notFound();
  }

  const featureActive = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "managed");

  if (!featureActive) {
    redirect("/admin/settings/advanced/optional");
  }

  const locales = await listAdminLocalizationLocales();
  const activeLocalesCount = locales.filter((locale) => locale.status === "ACTIVE").length;
  const defaultLocale = locales.find((locale) => locale.isDefault) ?? null;

  return (
    <LocalizationModuleShell activeTab="settings">
      {locales.length === 0 ? (
        <AdminEmptyState
          eyebrow="Aucune locale"
          title="Aucune locale configuree"
          description="Aucune locale n'est encore geree pour cette boutique."
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-4 shadow-sm backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Languages
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {locales.length}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Langues configurees dans le module.
              </p>
            </section>

            <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-4 shadow-sm backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Actives
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {activeLocalesCount}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Langues visibles pour la boutique.
              </p>
            </section>

            <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-4 shadow-sm backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Langue par defaut
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                {defaultLocale?.name ?? "Aucune"}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {defaultLocale?.code ?? "Aucun code par defaut"}
              </p>
            </section>
          </div>

          <section className="overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 border-b border-surface-border/40 px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Languages</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Gestion plugin-like des langues du storefront.
                </p>
              </div>
              <Badge variant="outline" className="border-surface-border/60 text-muted-foreground">
                {locales.length} entree{locales.length > 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-border/30">
                <thead className="bg-surface-subtle/20">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Language
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Code
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Default
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/30">
                  {locales.map((locale) => (
                    <tr key={locale.id} className="transition-colors hover:bg-surface-subtle/20">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-xl border",
                              locale.isDefault
                                ? "border-feedback-success-border/50 bg-feedback-success-surface/20"
                                : "border-surface-border/60 bg-surface-subtle"
                            )}
                          >
                            {locale.isDefault ? (
                              <Star className="size-4 text-feedback-success-foreground" />
                            ) : (
                              <Globe className="size-4 text-muted-foreground/60" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {locale.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {locale.languageCode}
                              {locale.countryCode ? `-${locale.countryCode}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-surface-subtle px-2 py-1 font-mono text-[11px] text-muted-foreground/80">
                          {locale.code}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <LocaleStatusBadge status={locale.status} />
                      </td>
                      <td className="px-4 py-3">
                        {locale.isDefault ? (
                          <Badge
                            variant="outline"
                            className="border-feedback-success-border/60 bg-feedback-success-surface/30 text-feedback-success-foreground"
                          >
                            Par defaut
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Secondaire</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!locale.isDefault && locale.status === "ACTIVE" ? (
                          <form action={setDefaultLocale} className="inline-flex">
                            <input type="hidden" name="localeId" value={locale.id} />
                            <button
                              type="submit"
                              className="rounded-full border border-surface-border/60 px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-surface-subtle/30"
                            >
                              Definir par defaut
                            </button>
                          </form>
                        ) : (
                          <span className="text-xs text-muted-foreground/70">Aucune action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </LocalizationModuleShell>
  );
}
