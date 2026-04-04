import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "jsk_token";

export async function getAuthTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}
