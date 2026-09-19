"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (res.ok && data.ok) {
        window.location.reload();
        return;
      }
      setError(data.error || "Connexion impossible.");
    } catch {
      setError("Connexion impossible. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-[var(--shadow-card)]"
      >
        <p className="eyebrow mb-2">Look Web Digital</p>
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight">
          Administration
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Espace réservé : importez vos médias vers Cloudinary pour les
          composants Galery, Scroll et Slider.
        </p>

        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary"
        />

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn btn-primary w-full">
          {busy ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}