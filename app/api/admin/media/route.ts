import { NextRequest } from "next/server";
import { getCloudinary, isCloudinaryConfigured, uploadAsset } from "@/lib/cloudinary";
import { isAdminRequest } from "@/lib/auth";
import { buildContextData, COLLECTIONS, isCollectionKey, mapResourceToAsset } from "@/lib/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 1024 * 1024 * 400; // 400 Mo max

/** Prochain `order` disponible dans le dossier de la collection. */
async function nextOrder(folder: string): Promise<number> {
  try {
    const result = await getCloudinary()
      .search.expression(`folder:"${folder}"`)
      .with_field(["context"])
      .max_results(200)
      .execute();
    const orders = (result?.resources ?? [])
      .map((r: { context?: { custom?: Record<string, string> } }) => Number(r.context?.custom?.order) || 0);
    return orders.length ? Math.max(...orders) + 1 : 1;
  } catch {
    return 1;
  }
}

/** Upload d'un fichier vers la collection choisie. */
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return Response.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }
  if (!isCloudinaryConfigured()) {
    return Response.json(
      { ok: false, error: "CLOUDINARY_URL n'est pas défini dans votre fichier .env" },
      { status: 500 },
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return Response.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const file = formData.get("file");
  const collection = typeof formData.get("collection") === "string" ? (formData.get("collection") as string) : "";
  const name = typeof formData.get("name") === "string" ? (formData.get("name") as string) : "";

  if (!isCollectionKey(collection)) {
    return Response.json({ ok: false, error: "Collection inconnue." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ ok: false, error: "Aucun fichier fourni." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ ok: false, error: "Fichier trop volumineux (400 Mo max)." }, { status: 413 });
  }

  const spec = COLLECTIONS[collection];
  const resourceType: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";

  if (spec.resourceType === "image" && resourceType === "video") {
    return Response.json({ ok: false, error: "Cette collection n'accepte que des images." }, { status: 400 });
  }
  if (spec.resourceType === "video" && resourceType === "image" && collection !== "scroll") {
    return Response.json({ ok: false, error: "Cette collection n'accepte que des vidéos." }, { status: 400 });
  }

  try {
    const order = await nextOrder(spec.folder);
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadAsset(buffer, resourceType, {
      folder: spec.folder,
      resource_type: resourceType,
      context: buildContextData(name, order),
      use_filename: true,
      unique_filename: true,
    });

    return Response.json({ ok: true, asset: mapResourceToAsset(result as never) });
  } catch (error) {
    console.error("[cloudinary] erreur d'upload :", error);
    return Response.json(
      { ok: false, error: "L'upload a échoué. Vérifiez votre connexion et votre compte Cloudinary." },
      { status: 500 },
    );
  }
}