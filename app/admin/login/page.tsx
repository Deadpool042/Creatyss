import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findAdminUserByEmail } from "@/db/admin-users";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_DURATION_SECONDS,
  adminSessionCookieOptions,
  createAdminSessionValue,
  getCurrentAdmin,
  normalizeAdminLoginCredentials,
  verifyAdminPassword
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
  }>;
}>;

async function loginAction(formData: FormData) {
  "use server";

  const credentials = normalizeAdminLoginCredentials({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (credentials === null) {
    redirect("/admin/login?error=invalid_credentials");
  }

  const adminUser = await findAdminUserByEmail(credentials.email);

  if (adminUser === null || !adminUser.isActive) {
    redirect("/admin/login?error=invalid_credentials");
  }

  const isPasswordValid = await verifyAdminPassword(
    credentials.password,
    adminUser.passwordHash
  );

  if (!isPasswordValid) {
    redirect("/admin/login?error=invalid_credentials");
  }

  const sessionValue = await createAdminSessionValue(adminUser.id);
  const cookieStore = await cookies();

  cookieStore.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: sessionValue,
    ...adminSessionCookieOptions,
    maxAge: ADMIN_SESSION_DURATION_SECONDS
  });

  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams
}: AdminLoginPageProps) {
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

  return (
    <div className="shell">
      <section className="card admin-card">
        <p className="eyebrow">Admin</p>
        <h1>Connexion</h1>
        <p className="lead">
          Connectez-vous pour acceder a l&apos;espace d&apos;administration
          Creatyss.
        </p>

        {showError ? (
          <p className="admin-alert" role="alert">
            Identifiants invalides.
          </p>
        ) : null}

        <form action={loginAction} className="admin-form">
          <label className="admin-field">
            <span className="meta-label">Email</span>
            <input
              autoComplete="email"
              className="admin-input"
              name="email"
              required
              type="email"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Mot de passe</span>
            <input
              autoComplete="current-password"
              className="admin-input"
              name="password"
              required
              type="password"
            />
          </label>

          <button className="button" type="submit">
            Se connecter
          </button>
        </form>
      </section>
    </div>
  );
}
