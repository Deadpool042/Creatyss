"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findAdminUserByEmail } from "@/db/repositories/admin-users.repository";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_DURATION_SECONDS,
  adminSessionCookieOptions,
  createAdminSessionValue,
  verifyAdminPassword,
} from "@/lib/admin-auth";

import { LoginSchema } from "../schemas/login-schema";

export async function loginAction(formData: FormData): Promise<void> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/admin/login?error=invalid_credentials");
  }

  const { email, password } = parsed.data;

  const adminUser = await findAdminUserByEmail(email);

  if (adminUser === null || !adminUser.isActive) {
    redirect("/admin/login?error=invalid_credentials");
  }

  const isPasswordValid = await verifyAdminPassword(password, adminUser.passwordHash);

  if (!isPasswordValid) {
    redirect("/admin/login?error=invalid_credentials");
  }

  const sessionValue = await createAdminSessionValue(adminUser.id);
  const cookieStore = await cookies();

  cookieStore.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: sessionValue,
    ...adminSessionCookieOptions,
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  });

  redirect("/admin");
}
