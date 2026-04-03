import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "jsk_token";

export function getAuthTokenFromCookies() {
  return cookies().get(AUTH_COOKIE_NAME)?.value ?? null;
}

