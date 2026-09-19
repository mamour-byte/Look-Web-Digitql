// ─── Collections de médias ───────────────────────────────────────────────────
// Chaque composant (Galery, Scroll, Slider…) lit son contenu dans un dossier
// dédié du compte Cloudinary. Les médias sont classés par `order` (contexte
// Cloudinary) pour contrôler l'ordre d'affichage depuis l'admin.

export const CLOUD_ROOT_FOLDER = "lookweb";

export type CollectionKey = "gallery" | "slider" | "scroll";

export type CollectionSpec = {
  key: CollectionKey;
  label: string;
  component: string;
  folder: string;
  resourceType: "image" | "video";
  /** Les types de fichiers autorisés (input accept). */
  accept: string;
  description: string;
};

export const COLLECTIONS: Record<CollectionKey, CollectionSpec> = {
  gallery: {
    key: "gallery",
    label: "Galery",
    component: "Galery",
    folder: `${CLOUD_ROOT_FOLDER}/gallery`,
    resourceType: "image",
    accept: "image/*",
    description: "Images affichées dans la galerie de réalisations.",
  },
  slider: {
    key: "slider",
    label: "Slider",
    component: "Slider",
    folder: `${CLOUD_ROOT_FOLDER}/slider`,
    resourceType: "video",
    accept: "video/*",
    description: "Vidéos du slider (un titre peut être affiché sur chaque slide).",
  },
  scroll: {
    key: "scroll",
    label: "Scroll",
    component: "Scroll",
    folder: `${CLOUD_ROOT_FOLDER}/scroll`,
    resourceType: "video",
    accept: "video/*,image/*",
    description: "Vidéo de couverture du hero de scroll (+ image de poster facultative).",
  },
};

export const COLLECTION_KEYS: CollectionKey[] = Object.keys(COLLECTIONS) as CollectionKey[];

export function isCollectionKey(value: string): value is CollectionKey {
  return value in COLLECTIONS;
}

// ─── Type exposé aux composants ───────────────────────────────────────────────
export type MediaAsset = {
  publicId: string;
  url: string;
  format: string;
  resourceType: "image" | "video";
  createdAt: string;
  order: number;
  name?: string;
  width?: number;
  height?: number;
  bytes?: number;
};

export type CloudinaryResource = {
  public_id: string;
  secure_url?: string;
  url?: string;
  format?: string;
  resource_type?: string;
  created_at?: string;
  context?: { custom?: Record<string, string> } & Record<string, unknown>;
  width?: number;
  height?: number;
  bytes?: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Nettoie une valeur avant son passage dans le contexte Cloudinary (séparé par `|` et `=`). */
export function sanitizeContextValue(value: string): string {
  return value
    .replace(/[|=]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/** Construit la chaîne `context` : `order=N|name=...` */
export function buildContextData(name?: string, order?: number): string {
  const parts: string[] = [];
  if (name) parts.push(`name=${sanitizeContextValue(name)}`);
  if (order != null) parts.push(`order=${Math.max(0, Math.round(order))}`);
  return parts.join("|");
}

/** Convertit une ressource Cloudinary en MediaAsset utilisable par les composants. */
export function mapResourceToAsset(resource: CloudinaryResource): MediaAsset {
  const custom = resource.context?.custom ?? {};
  return {
    publicId: resource.public_id,
    url: resource.secure_url ?? resource.url ?? "",
    format: resource.format ?? "",
    resourceType: resource.resource_type === "video" ? "video" : "image",
    createdAt: resource.created_at ?? "",
    order: Number(custom.order) || 0,
    name: custom.name || "",
    width: resource.width,
    height: resource.height,
    bytes: resource.bytes,
  };
}

// ─── Optimisation d'URL Cloudinary ────────────────────────────────────────────

const CLOUDINARY_UPLOAD = "/upload/";

/** Insère des transformations Cloudinary (`f_auto,q_auto,w_…`) dans une URL res.cloudinary.com. */
export function toCloudinaryUrl(url: string, transforms: string): string {
  if (!url) return url;
  const idx = url.indexOf(CLOUDINARY_UPLOAD);
  if (idx === -1) return url;
  return `${url.slice(0, idx + CLOUDINARY_UPLOAD.length)}${transforms}/${url.slice(idx + CLOUDINARY_UPLOAD.length)}`;
}

/** Image : format auto + qualité auto + largeur cible (les vignettes deviennent 3–5× plus légères). */
export function optimizeImageUrl(
  url: string,
  { w, q = "auto" }: { w?: number; q?: "auto" | number } = {},
): string {
  const parts: string[] = ["f_auto"];
  parts.push(q === "auto" ? "q_auto" : `q_${q}`);
  if (w) parts.push(`w_${w}`);
  return toCloudinaryUrl(url, parts.join(","));
}

/** Vidéo : format mp4 + qualité automatique pour alléger le streaming du hero et du slider. */
export function optimizeVideoUrl(
  url: string,
  { q = "auto", w }: { q?: "auto" | number; w?: number } = {},
): string {
  const parts: string[] = ["f_mp4"];
  parts.push(q === "auto" ? "q_auto" : `q_${q}`);
  if (w) parts.push(`w_${w}`);
  return toCloudinaryUrl(url, parts.join(","));
}