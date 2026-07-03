import { redirect } from "next/navigation";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsLocalizationPage() {
  const featureActive = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "managed");
  if (!featureActive) redirect("/admin/settings/advanced/optional");
  redirect("/admin/settings/advanced/optional/localization/settings");
}
