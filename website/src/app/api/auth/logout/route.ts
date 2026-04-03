import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "../../../../lib/authCookies";

export async function POST() {
  const out = NextResponse.json({ ok: true });
  out.cookies.set(AUTH_COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  return out;
}

