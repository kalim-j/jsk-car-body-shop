import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "../../../../lib/authCookies";
import { getBackendUrl } from "../../../../lib/backend";

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${getBackendUrl()}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json(data ?? { error: "Login failed" }, { status: res.status });
  }

  const token = data?.token as string | undefined;
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 500 });

  const out = NextResponse.json({ ok: true, user: data.user });
  out.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
    maxAge: 60 * 60 * 24 * 30,
  });
  return out;
}

