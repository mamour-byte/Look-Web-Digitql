"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Cloud,
  Copy,
  LayoutDashboard,
  Lock,
  Trash2,
  Unlock,
} from "lucide-react";
import {
  COLLECTIONS,
  COLLECTION_KEYS,
  type CollectionKey,
  type MediaAsset,
} from "@/lib/media";

type Toast = { kind: "ok" | "error"; text: string };

async function fetchCollection(key: CollectionKey): Promise<{ assets: MediaAsset[]; configured: boolean }> {
  const res = await fetch(`/api/media?collection=${key}&refresh=${Date.now()}`, { cache: "no-store" });
  const data = (await res.json()) as { assets?: MediaAsset[]; configured?: boolean };
  return { assets: Array.isArray(data.assets) ? data.assets : [], configured: data.configured !== false };
}

export default function AdminDashboard() {
  const [active, setActive] = useState<CollectionKey>("gallery");
  const [assets, setAssets] = useState<Record<CollectionKey, MediaAsset[]>>({
    gallery: [],
    slider: [],
    scroll: [],
  });
  const [loading, setLoading] = useState(true);
  const [cloudConfigured, setCloudConfigured] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const spec = COLLECTIONS[active];

  const showToast = useCallback((kind: Toast["kind"], text: string) => {
    setToast({ kind, text });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const loadAll = useCallback(async () => {
    try {
      const entries = await Promise.all(COLLECTION_KEYS.map(async (key) => [key, await fetchCollection(key)] as const));
      const next = { gallery: [], slider: [], scroll: [] } as Record<CollectionKey, MediaAsset[]>;
      let anyConfigured = false;
      for (const [key, { assets, configured }] of entries) {
        next[key] = assets;
        anyConfigured = anyConfigured || configured;
      }
      setAssets(next);
      setCloudConfigured(anyConfigured);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const reloadAll = useCallback(async () => {
    const entries = await Promise.all(
      COLLECTION_KEYS.map(async (key) => [key, await fetchCollection(key)] as const),
    );
    setAssets((prev) => {
      const next = { ...prev };
      for (const [key, data] of entries) next[key] = data.assets;
      return next;
    });
  }, []);

  /* ── Upload ── */
  const submitUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      showToast("error", "Choisissez un fichier à importer.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("collection", active);
      fd.append("name", title);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        showToast("error", data.error || "L'upload a échoué.");
        return;
      }
      showToast("ok", "Média importé sur Cloudinary.");
      setFile(null);
      setTitle("");
      await reloadAll();
    } catch {
      showToast("error", "L'upload a échoué.");
    } finally {
      setUploading(false);
    }
  };

  /* ── Réordonner ── */
  const move = async (index: number, dir: -1 | 1) => {
    const list = assets[active];
    const target = index + dir;
    if (target < 0 || target >= list.length) return;

    const next = [...list];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    const ordered = next.map((a, i) => ({ ...a, order: i + 1 }));

    setAssets((prev) => ({ ...prev, [active]: ordered }));
    setSavingOrder(true);
    try {
      for (const a of ordered) {
        await fetch(`/api/admin/media/${encodeURIComponent(a.publicId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resourceType: a.resourceType, order: a.order, name: a.name ?? "" }),
        });
      }
      showToast("ok", "Ordre mis à jour.");
    } catch {
      showToast("error", "Impossible d'enregistrer l'ordre.");
      await reloadAll();
    } finally {
      setSavingOrder(false);
    }
  };

  /* ── Renommer ── */
  const saveName = async (asset: MediaAsset, value: string) => {
    const name = value.trim();
    if (name === (asset.name ?? "")) return;
    try {
      const res = await fetch(`/api/admin/media/${encodeURIComponent(asset.publicId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceType: asset.resourceType, order: asset.order, name }),
      });
      if (!res.ok) throw new Error();
      setAssets((prev) => ({
        ...prev,
        [active]: prev[active].map((a) => (a.publicId === asset.publicId ? { ...a, name } : a)),
      }));
      showToast("ok", "Titre enregistré.");
    } catch {
      showToast("error", "Impossible d'enregistrer le titre.");
    }
  };

  /* ── Supprimer ── */
  const remove = async (asset: MediaAsset) => {
    setConfirmDeleteId(null);
    try {
      const res = await fetch(
        `/api/admin/media/${encodeURIComponent(asset.publicId)}?resourceType=${asset.resourceType}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error();
      showToast("ok", "Média supprimé.");
      await reloadAll();
    } catch {
      showToast("error", "Impossible de supprimer le média.");
    }
  };

  /* ── Copier l'URL ── */
  const copyUrl = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopiedId(asset.publicId);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      showToast("error", "Copie impossible.");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* ── En-tête ── */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-white">
            <LayoutDashboard />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Administration</h1>
            <p className="text-sm text-muted-foreground">Médias Cloudinary des composants du site</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="btn btn-outline btn-sm">
            <ArrowLeft className="h-4 w-4" /> Voir le site
          </Link>
          <button onClick={logout} className="btn btn-outline btn-sm">
            <Lock className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </header>

      {/* ── État Cloudinary ── */}
      {loading ? null : !cloudConfigured ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <Cloud className="mt-0.5 h-5 w-5 flex-none" />
          <p>
            <strong>Cloudinary n&apos;est pas configuré.</strong> Ajoutez votre URL
            <code className="mx-1 rounded bg-white px-1.5 py-0.5 font-mono text-xs">
              CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
            </code>
            dans le fichier <code className="mx-1 rounded bg-white px-1.5 py-0.5 font-mono text-xs">.env</code>,
            puis relancez le serveur. Les composants du site utiliseront encore leurs médias locaux.
          </p>
        </div>
      ) : null}

      {/* ── Onglets des collections ── */}
      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Collections">
        {COLLECTION_KEYS.map((key) => {
          const c = COLLECTIONS[key];
          const count = assets[key].length;
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              aria-pressed={isActive}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "border-primary bg-primary text-white shadow-[var(--shadow-btn)]"
                  : "border-border bg-white text-ink hover:border-primary",
              ].join(" ")}
            >
              {c.label}
              <span
                className={[
                  "rounded-full px-1.5 py-0.5 text-[11px] leading-none",
                  isActive ? "bg-white/20 text-white" : "bg-surface-soft text-muted-foreground",
                ].join(" ")}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Zone d'upload ── */}
      <form
        onSubmit={submitUpload}
        className="mb-8 rounded-2xl border border-border bg-surface-soft p-6"
      >
        <div className="mb-1 flex items-center gap-2 text-sm font-bold text-ink">
          Importer dans <span className="text-primary">{spec.component}</span>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{spec.description}</p>

        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_auto]">
          <div>
            <label htmlFor="media-file" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Fichier
            </label>
            <input
              id="media-file"
              type="file"
              accept={spec.accept}
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
            />
          </div>
          <div>
            <label htmlFor="media-title" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Titre (affiché dans le Slider)
            </label>
            <input
              id="media-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Identité visuelle"
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={uploading || !file} className="btn btn-primary w-full md:w-auto">
              {uploading ? "Upload…" : "Importer"}
              <Unlock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      {/* ── Actions sur la collection ── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight">
          Bibliothèque <span className="text-muted-foreground">({spec.label})</span>
        </h2>
        <div className="flex items-center gap-2">
          {savingOrder && (
            <span className="text-xs text-muted-foreground">Enregistrement de l&apos;ordre…</span>
          )}
          <button type="button" onClick={() => void loadAll()} className="btn btn-outline btn-sm">
            Actualiser
          </button>
        </div>
      </div>

      {/* ── Grille des médias ── */}
      {loading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Chargement des médias…</p>
      ) : assets[active].length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface-soft py-16 text-center text-sm text-muted-foreground">
          Aucun média dans cette collection pour l&apos;instant. Importez vos premiers fichiers ci-dessus.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {assets[active].map((asset, index) => (
            <MediaCard
              key={asset.publicId}
              asset={asset}
              index={index}
              total={assets[active].length}
              confirmDeleteId={confirmDeleteId}
              editingName={editingName[asset.publicId]}
              copied={copiedId === asset.publicId}
              onToggleDelete={() =>
                setConfirmDeleteId((prev) => (prev === asset.publicId ? null : asset.publicId))
              }
              onRemove={() => void remove(asset)}
              onMove={(dir) => void move(index, dir)}
              onNameChange={(v) => setEditingName((prev) => ({ ...prev, [asset.publicId]: v }))}
              onNameBlur={() => {
                const value = editingName[asset.publicId] ?? "";
                void saveName(asset, value);
                setEditingName((prev) => {
                  const next = { ...prev };
                  delete next[asset.publicId];
                  return next;
                });
              }}
              onCopy={() => void copyUrl(asset)}
            />
          ))}
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className={[
            "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg",
            toast.kind === "ok" ? "bg-primary" : "bg-red-600",
          ].join(" ")}
          role="status"
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

/* ─── Carte média ───────────────────────────────────────────────────────────── */

function MediaCard({
  asset,
  index,
  total,
  confirmDeleteId,
  editingName,
  copied,
  onToggleDelete,
  onRemove,
  onMove,
  onNameChange,
  onNameBlur,
  onCopy,
}: {
  asset: MediaAsset;
  index: number;
  total: number;
  confirmDeleteId: string | null;
  editingName: string | undefined;
  copied: boolean;
  onToggleDelete: () => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  onNameChange: (value: string) => void;
  onNameBlur: () => void;
  onCopy: () => void;
}) {
  const isVideo = asset.resourceType === "video";
  const pendingDelete = confirmDeleteId === asset.publicId;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      {/* Prévisualisation */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
        {isVideo ? (
          <video
            src={asset.url}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.url} alt={asset.name || "Média"} className="h-full w-full object-cover" />
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-semibold text-white">
          {index + 1}/{total}
        </span>
        {isVideo && (
          <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Vidéo
          </span>
        )}
      </div>

      <div className="space-y-2 p-3">
        <input
          type="text"
          value={editingName ?? asset.name ?? ""}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={onNameBlur}
          placeholder="Sans titre"
          className="w-full rounded-lg border border-transparent bg-transparent px-1 py-1 text-sm font-semibold outline-none transition focus:border-border focus:bg-white focus:shadow-sm"
        />
        <p className="truncate px-1 text-[11px] text-muted-foreground">{asset.publicId}</p>

        <div className="flex items-center gap-1.5">
          <IconBtn label="Monter" disabled={index === 0} onClick={() => onMove(-1)}>
            <ArrowUp className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Descendre" disabled={index === total - 1} onClick={() => onMove(1)}>
            <ArrowDown className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Copier l'URL" onClick={onCopy}>
            <Copy className="h-4 w-4" />
          </IconBtn>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => (pendingDelete ? onRemove() : onToggleDelete())}
            className={[
              "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition",
              pendingDelete
                ? "bg-red-600 text-white"
                : "text-red-600 hover:bg-red-50",
            ].join(" ")}
          >
            {pendingDelete ? "Supprimer" : <Trash2 className="h-3.5 w-3.5" />}
          </button>
        </div>
        {pendingDelete && (
          <div className="flex items-center justify-between gap-2 rounded-lg bg-red-50 px-2 py-1.5">
            <span className="text-[11px] text-red-600">Supprimer définitivement ?</span>
            <button
              type="button"
              onClick={onToggleDelete}
              className="text-[11px] font-semibold text-muted-foreground hover:underline"
            >
              Annuler
            </button>
          </div>
        )}
        {copied && <p className="text-[11px] font-semibold text-primary">URL copiée ✓</p>}
      </div>
    </article>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full border border-border text-ink transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}