import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ family: string }>;
};

export default async function AdvancedSettingsDetailLocalizationPage({ params }: PageProps) {
  const { family } = await params;

  if (family !== "optional") {
    notFound();
  }

  redirect("/admin/settings/advanced/optional/localization/settings");
}
