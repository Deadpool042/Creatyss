import { redirect } from "next/navigation";

import { meetsLocalizationLevel } from "@/features/localization/queries/get-localization-feature-state.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsLocalizationPage() {
  const featureActive = await meetsLocalizationLevel("managed");
  if (!featureActive) redirect("/admin/settings/advanced/optional");
  redirect("/admin/settings/advanced/optional/localization/settings");
}
