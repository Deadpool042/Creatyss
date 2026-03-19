import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME, adminSessionCookieOptions } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    ...adminSessionCookieOptions,
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}
