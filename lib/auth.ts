import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// ─── Session admin ───────────────────────────────────────────────────────────
// Le mot de passe du dashboard vit dans `.env` (`ADMIN_PASSWORD`).
// La session est un simple cookie httpOnly signé avec un hash du mot de passe.

export const ADMIN_COOKIE = "lwd_admin_session";

export function sessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(password).digest("hex");
}

export function isAdminCookieValue(value: string | undefined): boolean {
  const token = sessionToken();
  if (!token || !value) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(value));
  } catch {
    return false;
  }
}

export function isPasswordValid(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

/** Vrai si `ADMIN_PASSWORD` est renseigné dans `.env`. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** Vérifie le cookie d'une requête (routes API). */
export function isAdminRequest(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const value = parseCookie(cookieHeader).get(ADMIN_COOKIE);
  return isAdminCookieValue(value);
}

/** Vérifie le cookie sur le serveur (pages / layouts). */
export async function isAdminPage(): Promise<boolean> {
  const store = await cookies();
  return isAdminCookieValue(store.get(ADMIN_COOKIE)?.value);
}

function parseCookie(header: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const pair of header.split(";")) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    const key = pair.slice(0, eq).trim();
    let value = pair.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    map.set(key, value);
  }
  return map;
}