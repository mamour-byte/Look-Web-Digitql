import { unstable_cache } from "next/cache";
import { NextRequest } from "next/server";
import { getCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import {
  COLLECTIONS,
  isCollectionKey,
  mapResourceToAsset,
  type MediaAsset,
} from "@/lib/media";

/**
 * Endpoint public : renvoie les médias d'une collection (dossier Cloudinary).
 * Ex : GET /api/media?collection=gallery
 *
 * La recherche Cloudinary est mise en cache 1 h côté serveur (`unstable_cache`) :
 * les visiteurs ne déclenchent plus d'appel API Cloudinary à chaque chargement.
 * L'admin passe `&refresh=...` pour court-circuiter ce cache et voir
 * immédiatement ses changements.
 */
async function searchCollection(folder: string, typeFilter: string): Promise<MediaAsset[]> {
  const result = await getCloudinary()
    .search
    .expression(`${typeFilter}folder:"${folder}"`)
    .with_field(["context"])
    .max_results(200)
    .sort_by("created_at", "desc")
    .execute();

  return (result?.resources ?? []).map(mapResourceToAsset);
}

const cachedSearch = unstable_cache(searchCollection, ["cloudinary-media"], {
  revalidate: 3600,
  tags: ["media"],
});

export async function GET(request: NextRequest) {
  const collection = request.nextUrl.searchParams.get("collection") ?? "gallery";
  const forceRefresh = request.nextUrl.searchParams.get("refresh") !== null;

  if (!isCollectionKey(collection) || !isCloudinaryConfigured()) {
    return Response.json({ assets: [], configured: isCloudinaryConfigured() });
  }

  const spec = COLLECTIONS[collection];

  // Le dossier scroll contient vidéo ET image (poster) → pas de filtre de type.
  const typeFilter = collection === "scroll" ? "" : `resource_type:${spec.resourceType} AND `;

  try {
    const raw = forceRefresh
      ? await searchCollection(spec.folder, typeFilter)
      : await cachedSearch(spec.folder, typeFilter);

    const assets = [...raw].sort(
      (a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt),
    );

    return Response.json({ assets, configured: true });
  } catch (error) {
    console.error("[cloudinary] erreur de recherche :", error);
    return Response.json({ assets: [], configured: true });
  }
}