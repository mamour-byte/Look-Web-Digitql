import { NextRequest } from "next/server";
import { deleteAsset, isCloudinaryConfigured, updateAssetContext } from "@/lib/cloudinary";
import { isAdminRequest } from "@/lib/auth";
import { buildContextData } from "@/lib/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ publicId: string }> };

function unauthorized() {
  return Response.json({ ok: false, error: "Non autorisé." }, { status: 401 });
}

/** Suppression : DELETE /api/admin/media/{publicId}?resourceType=image|video */
export async function DELETE(request: NextRequest, { params }: Params) {
  if (!isAdminRequest(request)) return unauthorized();
  if (!isCloudinaryConfigured()) {
    return Response.json({ ok: false, error: "CLOUDINARY_URL n'est pas défini." }, { status: 500 });
  }

  const { publicId } = await params;
  const resourceType = (request.nextUrl.searchParams.get("resourceType") ?? "image") as "image" | "video";

  try {
    await deleteAsset(publicId, resourceType);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[cloudinary] erreur de suppression :", error);
    return Response.json({ ok: false, error: "La suppression a échoué." }, { status: 500 });
  }
}

/**
 * Mise à jour du contexte (ordre + titre) :
 * PATCH /api/admin/media/{publicId}  body: { resourceType, order, name }
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  if (!isAdminRequest(request)) return unauthorized();
  if (!isCloudinaryConfigured()) {
    return Response.json({ ok: false, error: "CLOUDINARY_URL n'est pas défini." }, { status: 500 });
  }

  const { publicId } = await params;
  const body = await request.json().catch(() => null);
  if (!body || !publicId) {
    return Response.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const resourceType: "image" | "video" = body.resourceType === "video" ? "video" : "image";
  const order = Number.isFinite(Number(body.order)) ? Number(body.order) : undefined;
  const name = typeof body.name === "string" ? body.name : "";

  try {
    await updateAssetContext(publicId, resourceType, buildContextData(name, order));
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[cloudinary] erreur de mise à jour :", error);
    return Response.json({ ok: false, error: "La mise à jour a échoué." }, { status: 500 });
  }
}