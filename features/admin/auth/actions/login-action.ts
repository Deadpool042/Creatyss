"use server";

import { redirect } from "next/navigation";

import { loginAdmin } from "@/core/auth/admin/guard";

import { LoginSchema } from "../schemas/login-schema";

export async function loginAction(formData: FormData): Promise<void> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/admin/login?error=invalid_credentials");
  }

  const admin = await loginAdmin({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (!admin) {
    redirect("/admin/login?error=invalid_credentials");
  }

  redirect("/admin");
}
