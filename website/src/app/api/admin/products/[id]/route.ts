import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "../../../../../lib/authCookies";
import { getBackendUrl } from "../../../../../lib/backend";

function withAuth(headers: Headers, cookiesHeader: Headers) {
  const cookieHeader = cookiesHeader.get("cookie") ?? "";
  const tokenMatch = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!tokenMatch) return headers;
  const token = decodeURIComponent(tokenMatch.split("=")[1] ?? "");
  if (!token) return headers;
  headers.set("authorization", `Bearer ${token}`);
  return headers;
}

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const resolvedParams = await params;
  const body = await request.json();
  const headers = new Headers({ "content-type": "application/json" });
  const withAuthHeaders = withAuth(headers, new Headers({ cookie: request.headers.get("cookie") ?? "" }));

  const res = await fetch(`${getBackendUrl()}/products/${resolvedParams.id}`, {
    method: "PUT",
    headers: withAuthHeaders,
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request: Request, { params }: Params) {
  const resolvedParams = await params;
  const headers = new Headers();
  const withAuthHeaders = withAuth(headers, new Headers({ cookie: request.headers.get("cookie") ?? "" }));

  const res = await fetch(`${getBackendUrl()}/products/${resolvedParams.id}`, {
    method: "DELETE",
    headers: withAuthHeaders,
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

