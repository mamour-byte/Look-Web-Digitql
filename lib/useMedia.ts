"use client";
import { useCallback, useEffect, useState } from "react";
import type { CollectionKey, MediaAsset } from "./media";

/**
 * Charge les médias d'une collection Cloudinary côté client.
 * Retourne un tableau vide si Cloudinary n'est pas configuré ou si la
 * collection est vide — les composants peuvent alors basculer sur leurs
 * contenus locaux de secours.
 */
export function useMedia(collection: CollectionKey) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch(`/api/media?collection=${collection}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as { assets?: MediaAsset[] };
        if (cancelled) return;
        setAssets(Array.isArray(data.assets) ? data.assets : []);
      } catch {
        if (!cancelled) setAssets([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [collection]);

  const reload = useCallback(async () => {
    try {
      const res = await fetch(`/api/media?collection=${collection}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as { assets?: MediaAsset[] };
      setAssets(Array.isArray(data.assets) ? data.assets : []);
    } catch {
      setAssets([]);
    }
  }, [collection]);

  return { assets, loading, reload };
}