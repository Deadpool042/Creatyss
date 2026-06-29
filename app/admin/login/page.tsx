import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/core/auth/admin/guard";
import { LoginForm, loginAction } from "@/features/admin/auth";
import { getStoreLogo } from "@/features/storefront/store/queries/get-store-logo-url.query";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
  }>;
}>;

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin.status === "authenticated") {
    redirect("/admin");
  }

  if (currentAdmin.status !== "missing") {
    redirect("/admin/session-invalid");
  }

  const resolvedSearchParams = await searchParams;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;

  const showError = errorParam === "invalid_credentials";
  const { logoUrl } = await getStoreLogo();

  return <LoginForm action={loginAction} showError={showError} logoUrl={logoUrl} />;
}
