import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdminConfigured, isPasswordValid, sessionToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return Response.json(
      { ok: false, error: "ADMIN_PASSWORD n'est pas défini dans votre fichier .env" },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isPasswordValid(password)) {
    return Response.json({ ok: false, error: "Mot de passe incorrect." }, { status: 401 });
  }

  const token = sessionToken();
  const store = await cookies();
  store.set(ADMIN_COOKIE, token as string, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });

  return Response.json({ ok: true });
}