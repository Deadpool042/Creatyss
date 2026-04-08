import { NextResponse } from "next/server";

import { logoutAdmin } from "@/core/auth/admin/guard";

export async function POST(request: Request) {
  await logoutAdmin();

  return NextResponse.redirect(new URL("/admin/login", request.url));
}
