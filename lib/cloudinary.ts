import { v2 as cloudinary } from "cloudinary";
import type { UploadApiOptions, UploadApiResponse } from "cloudinary";

/**
 * Helpers Cloudinary côté serveur.
 *
 * La configuration se fait exclusivement via la variable d'environnement
 * `CLOUDINARY_URL` (ex : `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`),
 * lue automatiquement par le SDK.
 */

export function isCloudinaryConfigured(): boolean {
  return Boolean(process.env.CLOUDINARY_URL);
}

export function getCloudinary() {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error("Cloudinary n'est pas configuré : mettez CLOUDINARY_URL dans votre fichier .env");
  }
  return cloudinary;
}

/** Upload d'images via un stream. */
function uploadImage(buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    try {
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) reject(error);
        else if (result) resolve(result);
        else reject(new Error("Upload échoué : réponse vide."));
      });
      stream.on("error", reject);
      stream.end(buffer);
    } catch (error) {
      reject(error);
    }
  });
}

/** Upload de vidéos (chunked, gère les gros fichiers). */
function uploadVideo(buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    try {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "video", chunk_size: 6_000_000, use_filename: true, unique_filename: true, ...options },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload échoué : réponse vide."));
        },
      );
      stream.on("error", reject);
      stream.end(buffer);
    } catch (error) {
      reject(error);
    }
  });
}

export function uploadAsset(buffer: Buffer, resourceType: "image" | "video", options: UploadApiOptions): Promise<UploadApiResponse> {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[cloudinary] upload ${resourceType} → ${options.folder ?? "racine"}`);
  }
  return resourceType === "video" ? uploadVideo(buffer, options) : uploadImage(buffer, options);
}

export async function deleteAsset(publicId: string, resourceType: "image" | "video" | "raw" = "image"): Promise<unknown> {
  return getCloudinary().uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
}

export function updateAssetContext(publicId: string, resourceType: "image" | "video", context: string): Promise<unknown> {
  return getCloudinary().api.update(publicId, { resource_type: resourceType, context });
}