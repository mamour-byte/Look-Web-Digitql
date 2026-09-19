"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/* ------------------------------------------------------------------ */
/*  Données                                                            */
/*  Remplace `visuel` par le chemin de tes images (/realisations/x.jpg) */
/*  `teinte` sert de placeholder tant que l'image n'existe pas         */
/* ------------------------------------------------------------------ */

type Format = "portrait" | "paysage" | "carre";

type Realisation = {
  titre: string;
  client: string;
  annee: string;
  format: Format;
  visuel?: string;
  teinte: string;
  note?: string;
};

type Service = {
  id: string;
  nom: string;
  titre: string;
  description: string;
  realisations: Realisation[];
};

const SERVICES: Service[] = [
  {
    id: "infographie",
    nom: "Infographie",
    titre: "Identités visuelles & supports graphiques",
    description:
      "Logos, chartes, affiches et habillages de marque. On part de ce que l'entreprise veut dire, on en fait un système visuel qui tient sur une devanture comme sur un écran de téléphone.",
    realisations: [
      { titre: "Refonte d'identité — Sahel Foods", client: "Sahel Foods", annee: "2025", format: "portrait", teinte: "linear-gradient(140deg,#ff6b00,#ffab6e)" },
      { titre: "Charte graphique complète", client: "Kaay Fresh", annee: "2025", format: "paysage", teinte: "linear-gradient(120deg,#3a2410,#ff8a3d)", note: "Logo, palette, typographie, règles d'usage" },
      { titre: "Série d'affiches — Festival Ndar", client: "Festival Ndar", annee: "2024", format: "portrait", teinte: "linear-gradient(200deg,#ffead8,#ff6b00)" },
      { titre: "Habillage de flotte", client: "Teranga Logistics", annee: "2024", format: "carre", teinte: "linear-gradient(160deg,#111111,#ff6b00)" },
      { titre: "Pictogrammes & signalétique", client: "Clinique Médina", annee: "2024", format: "paysage", teinte: "linear-gradient(90deg,#ff9a47,#ffdfc2)" },
    ],
  },
  {
    id: "video",
    nom: "Création vidéo",
    titre: "Films de marque, motion et formats courts",
    description:
      "Du repérage au montage final. Films institutionnels, capsules produit, motion design et formats verticaux pensés pour être vus jusqu'au bout.",
    realisations: [
      { titre: "Film institutionnel — 2 min", client: "Banque Atlantique", annee: "2025", format: "paysage", teinte: "linear-gradient(120deg,#111111,#ff6b00)" },
      { titre: "Capsule produit verticale", client: "SEN POS", annee: "2025", format: "portrait", teinte: "linear-gradient(180deg,#ff6b00,#3a2410)", note: "Série de 6 épisodes" },
      { titre: "Motion design — lancement", client: "Wave Partners", annee: "2024", format: "carre", teinte: "linear-gradient(140deg,#ffab6e,#e85d00)" },
      { titre: "Aftermovie — Dakar Tech Week", client: "Dakar Tech Week", annee: "2024", format: "paysage", teinte: "linear-gradient(60deg,#3a2410,#ff9a47)" },
    ],
  },
  {
    id: "web",
    nom: "Site web",
    titre: "Sites et applications sur mesure",
    description:
      "Des interfaces rapides, lisibles et durables. Vitrines, plateformes métier et back-offices conçus pour être tenus dans le temps par une petite équipe.",
    realisations: [
      { titre: "Plateforme Code de la route", client: "Projet Forge", annee: "2025", format: "paysage", teinte: "linear-gradient(120deg,#ff6b00,#ffdfc2)", note: "Cours, examens blancs, suivi de progression" },
      { titre: "Site vitrine & blog", client: "Cabinet Diop", annee: "2025", format: "portrait", teinte: "linear-gradient(200deg,#111111,#ff8a3d)" },
      { titre: "Back-office de gestion", client: "SEN POS", annee: "2025", format: "paysage", teinte: "linear-gradient(90deg,#3a2410,#ff6b00)" },
      { titre: "Boutique en ligne", client: "Kaay Fresh", annee: "2024", format: "carre", teinte: "linear-gradient(160deg,#ff9a47,#ffead8)" },
      { titre: "Espace adhérents", client: "Mutuelle Jappo", annee: "2024", format: "portrait", teinte: "linear-gradient(180deg,#ffab6e,#e85d00)" },
    ],
  },
  {
    id: "community",
    nom: "Community management",
    titre: "Présence sociale tenue au quotidien",
    description:
      "Ligne éditoriale, calendrier, production des contenus et réponses aux messages. Un compte qui parle comme la marque, pas comme une agence.",
    realisations: [
      { titre: "Ligne éditoriale & calendrier", client: "Teranga Logistics", annee: "2025", format: "carre", teinte: "linear-gradient(140deg,#ff6b00,#3a2410)" },
      { titre: "Campagne de lancement", client: "Kaay Fresh", annee: "2025", format: "portrait", teinte: "linear-gradient(180deg,#ffead8,#ff6b00)", note: "+38 % d'abonnés en 3 mois" },
      { titre: "Gestion quotidienne — 12 mois", client: "Clinique Médina", annee: "2024", format: "paysage", teinte: "linear-gradient(90deg,#ff8a3d,#ffab6e)" },
    ],
  },
  {
    id: "print",
    nom: "Print",
    titre: "Fabrication et impression grand format",
    description:
      "Cartes, brochures, kakémonos, bâches et PLV. Fichiers préparés pour l'imprimeur, suivi de production et contrôle des épreuves avant tirage.",
    realisations: [
      { titre: "Catalogue 48 pages", client: "Sahel Foods", annee: "2025", format: "paysage", teinte: "linear-gradient(120deg,#3a2410,#ff9a47)" },
      { titre: "Papeterie complète", client: "Cabinet Diop", annee: "2025", format: "carre", teinte: "linear-gradient(160deg,#ffdfc2,#ff6b00)" },
      { titre: "Stand et PLV — SIAGRO", client: "Sahel Foods", annee: "2024", format: "portrait", teinte: "linear-gradient(200deg,#ff6b00,#111111)" },
      { titre: "Bâches grand format", client: "Festival Ndar", annee: "2024", format: "paysage", teinte: "linear-gradient(60deg,#e85d00,#ffab6e)" },
    ],
  },
  {
    id: "photo",
    nom: "Photographie",
    titre: "Photographie corporate et produit",
    description:
      "Portraits d'équipe, reportages d'entreprise et packshots produit. Lumière maîtrisée en studio comme sur site, livraison retouchée sous 72 h.",
    realisations: [
      { titre: "Portraits d'équipe — 24 sujets", client: "Banque Atlantique", annee: "2025", format: "portrait", teinte: "linear-gradient(180deg,#111111,#ff8a3d)" },
      { titre: "Packshots catalogue", client: "Kaay Fresh", annee: "2025", format: "carre", teinte: "linear-gradient(140deg,#ffead8,#ff9a47)" },
      { titre: "Reportage industriel", client: "Teranga Logistics", annee: "2024", format: "paysage", teinte: "linear-gradient(90deg,#ff6b00,#3a2410)", note: "Deux jours sur site" },
      { titre: "Architecture & intérieurs", client: "Clinique Médina", annee: "2024", format: "paysage", teinte: "linear-gradient(120deg,#ffab6e,#e85d00)" },
    ],
  },
];

const LISSAGE = 0.085; // plus bas = glissement plus long

/* ------------------------------------------------------------------ */

export default function RealisationsPage() {
  const [actifId, setActifId] = useState<string>(SERVICES[0].id);
  const [zoom, setZoom] = useState<number | null>(null);
  const [epingle, setEpingle] = useState(false);
  const [distance, setDistance] = useState(0);
  const [hauteurVue, setHauteurVue] = useState<number | null>(null);
  const [curseur, setCurseur] = useState({ x: 0, y: 0, visible: false });

  const pisteRef = useRef<HTMLDivElement | null>(null); // conteneur haut (scroll vertical)
  const fenetreRef = useRef<HTMLDivElement | null>(null); // zone visible du rail
  const railRef = useRef<HTMLDivElement | null>(null); // contenu qui se déplace
  const jaugeRef = useRef<HTMLSpanElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const bulleRef = useRef<HTMLSpanElement | null>(null);

  const cibleRef = useRef(0);
  const posRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const premierRendu = useRef(true);

  const service = useMemo(
    () => SERVICES.find((s) => s.id === actifId) ?? SERVICES[0],
    [actifId]
  );

  /* ---------- mode : épinglé (desktop) ou scroll natif ---------- */
  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1025px) and (prefers-reduced-motion: no-preference)"
    );
    const maj = () => {
      setEpingle(mq.matches);
      setHauteurVue(window.innerHeight);
    };
    maj();
    mq.addEventListener("change", maj);
    window.addEventListener("resize", maj);
    return () => {
      mq.removeEventListener("change", maj);
      window.removeEventListener("resize", maj);
    };
  }, []);

  /* ---------- mesure de la course horizontale ---------- */
  const mesurer = useCallback(() => {
    const rail = railRef.current;
    const fen = fenetreRef.current;
    if (!rail || !fen) return;
    setDistance(Math.max(0, rail.scrollWidth - fen.clientWidth));
  }, []);

  useLayoutEffect(() => {
    mesurer();
    const rail = railRef.current;
    if (!rail) return;
    const ro = new ResizeObserver(mesurer);
    ro.observe(rail);
    if (fenetreRef.current) ro.observe(fenetreRef.current);
    return () => ro.disconnect();
  }, [mesurer, actifId, epingle]);

  /* ---------- boucle d'interpolation (le « glissement ») ---------- */
  // La boucle vit dans une ref : chaque re-render met à jour sa fermeture
  // (notamment le `distance` capturé) sans re-souscrire les effets de scroll.
  const boucleRef = useRef<() => void>(() => {});

  useEffect(() => {
    boucleRef.current = () => {
      const rail = railRef.current;
      if (!rail) return;

      const ecart = cibleRef.current - posRef.current;
      posRef.current += ecart * LISSAGE;
      if (Math.abs(ecart) < 0.35) posRef.current = cibleRef.current;

      rail.style.transform = `translate3d(${-posRef.current}px,0,0)`;

      if (jaugeRef.current) {
        const p = distance > 0 ? posRef.current / distance : 0;
        jaugeRef.current.style.transform = `scaleX(${Math.max(0.03, Math.min(1, p))})`;
      }

      // parallaxe interne des visuels
      const largeur = window.innerWidth;
      rail.querySelectorAll<HTMLElement>(".rz-carte").forEach((carte) => {
        const r = carte.getBoundingClientRect();
        const ratio = (r.left + r.width / 2 - largeur / 2) / largeur;
        carte.style.setProperty("--decalage", `${ratio * -34}px`);
        carte.style.setProperty(
          "--proche",
          `${Math.max(0, 1 - Math.abs(ratio) * 1.8)}`
        );
      });

      if (Math.abs(cibleRef.current - posRef.current) > 0.1) {
        rafRef.current = requestAnimationFrame(() => boucleRef.current());
      } else {
        rafRef.current = null;
      }
    };
  }, [distance]);

  const relancer = useCallback(() => {
    if (rafRef.current === null)
      rafRef.current = requestAnimationFrame(() => boucleRef.current());
  }, []);

  /* ---------- scroll vertical -> position horizontale ---------- */
  useEffect(() => {
    if (!epingle) {
      cibleRef.current = 0;
      posRef.current = 0;
      if (railRef.current) railRef.current.style.transform = "";
      return;
    }

    const onScroll = () => {
      const piste = pisteRef.current;
      if (!piste) return;
      const course = piste.offsetHeight - window.innerHeight;
      const avance = -piste.getBoundingClientRect().top;
      const p = course > 0 ? Math.max(0, Math.min(1, avance / course)) : 0;
      cibleRef.current = p * distance;
      relancer();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [epingle, distance, relancer]);

  /* ---------- indicateur du menu ---------- */
  const placerBulle = useCallback(() => {
    const menu = menuRef.current;
    const bulle = bulleRef.current;
    if (!menu || !bulle) return;
    const cible = menu.querySelector<HTMLElement>(`[data-service="${actifId}"]`);
    if (!cible) return;
    bulle.style.width = `${cible.offsetWidth}px`;
    bulle.style.transform = `translate3d(${cible.offsetLeft - menu.scrollLeft}px,0,0)`;
    bulle.style.opacity = "1";
  }, [actifId]);

  useLayoutEffect(() => {
    placerBulle();
    window.addEventListener("resize", placerBulle);
    return () => window.removeEventListener("resize", placerBulle);
  }, [placerBulle]);

  /* ---------- changement de service ---------- */
  useEffect(() => {
    posRef.current = 0;
    cibleRef.current = 0;
    if (railRef.current && epingle)
      railRef.current.style.transform = "translate3d(0,0,0)";
    if (fenetreRef.current && !epingle) fenetreRef.current.scrollLeft = 0;

    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    // on remonte au début de la piste si on est déjà dedans
    const piste = pisteRef.current;
    if (!piste || !epingle) return;
    if (piste.getBoundingClientRect().top < 0) {
      window.scrollTo({
        top: piste.offsetTop,
        behavior: "smooth",
      });
    }
  }, [actifId, epingle]);

  /* ---------- clavier ---------- */
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (epingle) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        window.scrollBy({
          top: (e.key === "ArrowRight" ? 1 : -1) * window.innerHeight * 0.55,
          behavior: "smooth",
        });
      }
      return;
    }
    const fen = fenetreRef.current;
    if (!fen) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      fen.scrollBy({
        left: (e.key === "ArrowRight" ? 1 : -1) * fen.clientWidth * 0.7,
        behavior: "smooth",
      });
    }
  };

  /* ---------- visionneuse ---------- */
  useEffect(() => {
    if (zoom === null) return;
    const total = service.realisations.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
      if (e.key === "ArrowRight") setZoom((i) => (i === null ? i : (i + 1) % total));
      if (e.key === "ArrowLeft")
        setZoom((i) => (i === null ? i : (i - 1 + total) % total));
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [zoom, service.realisations.length]);

  const projet = zoom === null ? null : service.realisations[zoom];

  const hauteurPiste =
    epingle && hauteurVue !== null ? `${hauteurVue + distance}px` : undefined;

  return (
    <main className="rz">
      <style>{css}</style>

      < Navbar/>

      <header className="rz-tete">
        <h1 className="rz-titre">
          Réalisations<span className="rz-point">.</span>
        </h1>
        <p className="rz-intro">
          Identité visuelle, vidéo, sites web, community management, print et photographie :
          explorez les projets qui ont fait grandir nos clients, du premier brief à la livraison.
        </p>
      </header>

      {/* --------- Piste : sa hauteur détermine la course horizontale --------- */}
      <div
        className={`rz-piste${epingle ? " est-epinglee" : ""}`}
        ref={pisteRef}
        style={hauteurPiste ? { height: hauteurPiste } : undefined}
      >
        <div className="rz-colle">
          {/* Menu des services */}
          <div className="rz-menu" ref={menuRef} role="tablist" aria-label="Spécialités">
            <span className="rz-bulle" ref={bulleRef} aria-hidden="true" />
            {SERVICES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                data-service={s.id}
                aria-selected={s.id === actifId}
                className={`rz-onglet${s.id === actifId ? " est-actif" : ""}`}
                onClick={() => setActifId(s.id)}
              >
                {s.nom}
                <span className="rz-compte">{s.realisations.length}</span>
              </button>
            ))}
          </div>

          <div className="rz-scene" key={service.id}>
            {/* Bloc orange */}
            <aside className="rz-bloc">
              <div className="rz-bloc-corps">
                <p className="rz-eyebrow">Spécialité</p>
                <h2 className="rz-bloc-titre">{service.titre}</h2>
                <p className="rz-bloc-texte">{service.description}</p>
                <div className="rz-bloc-pied">
                  <span>{service.realisations.length} projets</span>
                  <span>{epingle ? "Continue de descendre" : "Glisse sur le côté"}</span>
                </div>
                <div className="rz-barre" aria-hidden="true">
                  <span className="rz-barre-jauge" ref={jaugeRef} />
                </div>
              </div>
              <span className="rz-coin" aria-hidden="true" />
            </aside>

            {/* Fenêtre + rail */}
            <div
              className="rz-fenetre"
              ref={fenetreRef}
              tabIndex={0}
              role="region"
              aria-label={`Réalisations — ${service.nom}`}
              onKeyDown={onKeyDown}
              onPointerMove={(e) => setCurseur({ x: e.clientX, y: e.clientY, visible: true })}
              onPointerLeave={() => setCurseur((c) => ({ ...c, visible: false }))}
            >
              <div className="rz-rail" ref={railRef}>
                {service.realisations.map((r, i) => (
                  <article
                    key={`${service.id}-${r.titre}`}
                    className={`rz-carte rz-carte--${r.format}`}
                    style={{ ["--i" as string]: i }}
                  >
                    <button
                      type="button"
                      className="rz-carte-cible"
                      aria-label={`Ouvrir ${r.titre}`}
                      onClick={() => setZoom(i)}
                    />
                    <div className="rz-visuel">
                      {r.visuel ? (
                        <img src={r.visuel} alt={r.titre} draggable={false} />
                      ) : (
                        <span className="rz-placeholder" style={{ backgroundImage: r.teinte }} />
                      )}
                    </div>
                    <div className="rz-legende">
                      <h3>{r.titre}</h3>
                      <p>
                        {r.client} — {r.annee}
                      </p>
                      {r.note && <p className="rz-note">{r.note}</p>}
                    </div>
                  </article>
                ))}

                <div className="rz-fin">
                  <p>Un projet du même ordre ?</p>
                  <a href="/contact" className="rz-lien">
                    Parlons-en
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <span
        className={`rz-curseur${curseur.visible ? " est-visible" : ""}`}
        style={{ transform: `translate3d(${curseur.x}px, ${curseur.y}px, 0)` }}
        aria-hidden="true"
      >
        Voir
      </span>

      {projet && (
        <div
          className="rz-zoom"
          role="dialog"
          aria-modal="true"
          aria-label={projet.titre}
          onClick={() => setZoom(null)}
        >
          <figure className="rz-zoom-contenu" onClick={(e) => e.stopPropagation()}>
            <div className="rz-zoom-visuel">
              {projet.visuel ? (
                <img src={projet.visuel} alt={projet.titre} />
              ) : (
                <span style={{ backgroundImage: projet.teinte }} />
              )}
            </div>
            <figcaption>
              <h3>{projet.titre}</h3>
              <p>
                {projet.client} — {projet.annee} · {service.nom}
              </p>
              {projet.note && <p className="rz-note">{projet.note}</p>}
              <div className="rz-zoom-nav">
                <button
                  type="button"
                  onClick={() =>
                    setZoom(
                      (zoom! - 1 + service.realisations.length) %
                        service.realisations.length
                    )
                  }
                >
                  Précédent
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((zoom! + 1) % service.realisations.length)}
                >
                  Suivant
                </button>
              </div>
            </figcaption>
          </figure>
          <button
            type="button"
            className="rz-zoom-fermer"
            onClick={() => setZoom(null)}
            aria-label="Fermer"
          >
            Fermer
          </button>
        </div>
      )}

      <Footer/>
    </main>
  );
}

/* ------------------------------------------------------------------ */

const css = `
.rz {
  --orange: #ff6b00;
  --orange-clair: #ffead8;
  --encre: #111111;
  --gris: #686868;
  --blanc: #FFFFFF;
  --rayon: 2px;
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  background: var(--blanc);
  color: var(--encre);
  font-family: var(--font);
  overflow-x: clip;
}
.rz *, .rz *::before, .rz *::after { box-sizing: border-box; }

/* ---------- En-tête ---------- */
.rz-tete {
  display: flex; flex-wrap: wrap; align-items: flex-end;
  justify-content: space-between; gap: 24px;
  padding: clamp(40px, 7vw, 96px) clamp(20px, 5vw, 72px) clamp(20px, 3vw, 36px);
  border-bottom: 1px solid rgba(32,19,9,.12);
  margin: 0 clamp(20px, 5vw, 72px);
}
.rz-titre {
  margin: 0; font-size: clamp(2.6rem, 8vw, 6.2rem); font-weight: 600;
  letter-spacing: -.045em; line-height: .92;
}
.rz-point { color: var(--orange); }
.rz-intro { margin: 0; max-width: 34ch; color: var(--gris); line-height: 1.5; font-size: clamp(.95rem,1.2vw,1.05rem); }

/* ---------- Piste épinglée ---------- */
.rz-piste { position: relative; }
.rz-piste.est-epinglee .rz-colle {
  position: sticky; top: 0; height: 100vh;
  display: flex; flex-direction: column; overflow: hidden;
}
.rz-colle { padding: clamp(20px, 3vw, 40px) 0 clamp(24px, 3vw, 40px); }

/* ---------- Menu ---------- */
.rz-menu {
  position: relative; display: flex; gap: 4px; flex: none;
  padding: 0 clamp(20px, 5vw, 72px) 4px;
  overflow-x: auto; scrollbar-width: none;
}
.rz-menu::-webkit-scrollbar { display: none; }
.rz-bulle {
  position: absolute; left: clamp(20px, 5vw, 72px); top: 0; bottom: 4px;
  background: var(--orange); border-radius: 999px; opacity: 0;
  transition: transform .5s cubic-bezier(.2,.85,.2,1), width .5s cubic-bezier(.2,.85,.2,1);
  will-change: transform, width;
}
.rz-onglet {
  position: relative; z-index: 1; flex: none;
  display: inline-flex; align-items: baseline; gap: 8px;
  padding: 10px 18px; border: 1px solid rgba(32,19,9,.14); border-radius: 999px;
  background: transparent; cursor: pointer; font: inherit; font-size: .95rem;
  color: var(--encre); transition: color .3s ease, border-color .3s ease;
}
.rz-onglet:hover { border-color: rgba(32,19,9,.4); }
.rz-onglet.est-actif { color: var(--blanc); border-color: transparent; }
.rz-onglet.est-actif .rz-compte { color: rgba(255,255,255,.72); }
.rz-compte { font-size: .75rem; color: var(--gris); font-variant-numeric: tabular-nums; }
.rz-onglet:focus-visible { outline: 2px solid var(--orange); outline-offset: 3px; }

/* ---------- Scène ---------- */
.rz-scene {
  display: flex; gap: clamp(20px, 3vw, 48px);
  margin-top: clamp(20px, 3vw, 40px);
  flex: 1; min-height: 0;
}

/* ---------- Bloc orange ---------- */
.rz-bloc {
  position: relative; overflow: hidden; flex: none;
  width: clamp(300px, 28vw, 430px);
  background: var(--orange); color: var(--blanc);
  border-radius: 0 var(--rayon) var(--rayon) 0;
  padding: clamp(24px, 2.6vw, 44px);
  display: flex; align-items: flex-end;
}
.rz-bloc-corps { position: relative; z-index: 1; width: 100%; animation: rz-monte .6s cubic-bezier(.2,.8,.2,1) both; }
.rz-eyebrow { margin: 0 0 14px; font-size: .8rem; color: rgba(255,255,255,.72); }
.rz-bloc-titre {
  margin: 0 0 16px; font-size: clamp(1.6rem, 2.4vw, 2.4rem); font-weight: 600;
  letter-spacing: -.03em; line-height: 1.05; max-width: 16ch;
}
.rz-bloc-texte { margin: 0; max-width: 42ch; line-height: 1.6; font-size: clamp(.9rem,1vw,1rem); color: rgba(255,255,255,.9); }
.rz-bloc-pied {
  display: flex; justify-content: space-between; gap: 16px;
  margin-top: clamp(20px, 3vw, 36px); font-size: .82rem; color: rgba(255,255,255,.8);
}
.rz-barre { margin-top: 12px; height: 2px; background: rgba(255,255,255,.28); }
.rz-barre-jauge {
  display: block; height: 100%; background: var(--blanc);
  transform: scaleX(.03); transform-origin: left center;
}
.rz-coin {
  position: absolute; top: 0; right: 0; width: 84px; height: 84px;
  background: var(--blanc); clip-path: polygon(100% 0, 0 0, 100% 100%);
}

/* ---------- Fenêtre + rail ---------- */
.rz-fenetre { flex: 1; min-width: 0; overflow: hidden; }
.rz-fenetre:focus-visible { outline: 2px solid var(--orange); outline-offset: 4px; }
.rz-rail {
  display: flex; align-items: stretch; gap: clamp(14px, 1.6vw, 26px);
  height: 100%; padding-right: clamp(20px, 5vw, 72px);
  will-change: transform;
}

.rz-carte {
  position: relative; flex: none; height: 100%;
  display: flex; flex-direction: column;
  animation: rz-entree .7s cubic-bezier(.2,.8,.2,1) both;
  animation-delay: calc(var(--i) * 60ms);
}
.rz-visuel {
  position: relative; flex: 1; min-height: 0; overflow: hidden;
  background: var(--orange-clair); border-radius: var(--rayon);
}
.rz-carte--portrait .rz-visuel { aspect-ratio: 3 / 4; }
.rz-carte--paysage  .rz-visuel { aspect-ratio: 16 / 10; }
.rz-carte--carre    .rz-visuel { aspect-ratio: 1 / 1; }

.rz-visuel img, .rz-placeholder {
  position: absolute; inset: -4% -9%; width: 118%; height: 108%;
  display: block; object-fit: cover;
  background-size: cover; background-position: center;
  transform: translate3d(var(--decalage, 0px), 0, 0);
  filter: saturate(calc(.72 + var(--proche, 1) * .28));
  transition: filter .4s ease;
  will-change: transform;
}
.rz-carte-cible {
  position: absolute; inset: 0; z-index: 2; cursor: pointer;
  background: none; border: 0; padding: 0; border-radius: var(--rayon);
}
.rz-carte-cible:focus-visible { outline: 2px solid var(--orange); outline-offset: 6px; }

.rz-legende { flex: none; padding-top: 14px; max-width: 34ch; }
.rz-legende h3 { margin: 0 0 6px; font-size: clamp(1rem,1.1vw,1.12rem); font-weight: 600; letter-spacing: -.015em; line-height: 1.25; }
.rz-legende p { margin: 0; font-size: .85rem; color: var(--gris); }
.rz-note { margin-top: 4px !important; color: var(--orange) !important; }

.rz-fin {
  flex: none; align-self: center; width: clamp(200px, 20vw, 280px);
  padding-left: clamp(12px, 2vw, 28px); border-left: 1px solid rgba(32,19,9,.14);
}
.rz-fin p { margin: 0 0 10px; color: var(--gris); font-size: .9rem; }
.rz-lien {
  display: inline-block; color: var(--encre); font-size: 1.2rem; font-weight: 600;
  letter-spacing: -.02em; text-decoration: none; padding-bottom: 2px;
  border-bottom: 2px solid var(--orange); transition: color .3s ease;
}
.rz-lien:hover { color: var(--orange); }

@keyframes rz-entree { from { opacity: 0; transform: translate3d(36px,18px,0); } to { opacity: 1; transform: none; } }
@keyframes rz-monte  { from { opacity: 0; transform: translate3d(0,18px,0); } to { opacity: 1; transform: none; } }

/* ---------- Curseur ---------- */
.rz-curseur {
  position: fixed; top: 0; left: 0; z-index: 40; pointer-events: none;
  margin: -24px 0 0 -24px; width: 48px; height: 48px; border-radius: 999px;
  display: grid; place-items: center; background: var(--orange); color: var(--blanc);
  font-size: .72rem; opacity: 0; scale: .6;
  transition: opacity .25s ease, scale .25s ease;
}
.rz-curseur.est-visible { opacity: 1; scale: 1; }

/* ---------- Visionneuse ---------- */
.rz-zoom {
  position: fixed; inset: 0; z-index: 50; background: rgba(32,19,9,.92);
  display: grid; place-items: center; padding: clamp(16px,4vw,56px);
  animation: rz-fondu .3s ease both;
}
@keyframes rz-fondu { from { opacity: 0 } to { opacity: 1 } }
.rz-zoom-contenu {
  margin: 0; display: grid; gap: clamp(16px,2vw,32px);
  grid-template-columns: minmax(0,1.4fr) minmax(240px,.6fr);
  align-items: end; max-width: 1100px; width: 100%;
}
.rz-zoom-visuel { position: relative; aspect-ratio: 16/10; overflow: hidden; background: #000; }
.rz-zoom-visuel img, .rz-zoom-visuel span {
  position: absolute; inset: 0; width: 100%; height: 100%; display: block;
  object-fit: cover; background-size: cover; background-position: center;
}
.rz-zoom-contenu figcaption { color: var(--blanc); }
.rz-zoom-contenu h3 { margin: 0 0 8px; font-size: 1.4rem; font-weight: 600; letter-spacing: -.02em; }
.rz-zoom-contenu p { margin: 0; color: rgba(255,255,255,.7); font-size: .9rem; }
.rz-zoom-nav { display: flex; gap: 10px; margin-top: 22px; }
.rz-zoom-nav button {
  font: inherit; font-size: .85rem; padding: 9px 16px; cursor: pointer;
  background: transparent; color: var(--blanc);
  border: 1px solid rgba(255,255,255,.35); border-radius: 999px;
  transition: background .25s ease, color .25s ease;
}
.rz-zoom-nav button:hover { background: var(--blanc); color: var(--encre); }
.rz-zoom-fermer {
  position: fixed; top: 24px; right: 24px; font: inherit; font-size: .85rem;
  padding: 9px 18px; border-radius: 999px; cursor: pointer; border: 0;
  background: var(--orange); color: var(--blanc);
}

/* ---------- Repli : tablette & mobile (scroll horizontal natif) ---------- */
@media (max-width: 1024px), (prefers-reduced-motion: reduce) {
  .rz-piste { height: auto !important; }
  .rz-colle { position: static; height: auto; overflow: visible; }
  .rz-scene { flex-direction: column; gap: 24px; }
  .rz-bloc { width: auto; margin: 0 clamp(20px,5vw,72px); border-radius: var(--rayon); }
  .rz-fenetre {
    overflow-x: auto; overflow-y: hidden;
    scroll-snap-type: x proximity; scrollbar-width: none;
    padding-left: clamp(20px,5vw,72px);
  }
  .rz-fenetre::-webkit-scrollbar { display: none; }
  .rz-rail { height: auto; transform: none !important; padding-bottom: 8px; }
  .rz-carte { height: auto; scroll-snap-align: center; }
  .rz-visuel { flex: none; }
  .rz-visuel img, .rz-placeholder { transform: none; filter: none; }
  .rz-carte--portrait { width: 70vw; max-width: 320px; }
  .rz-carte--paysage  { width: 84vw; max-width: 480px; }
  .rz-carte--carre    { width: 72vw; max-width: 360px; }
  .rz-fin { width: 60vw; max-width: 280px; }
  .rz-curseur { display: none; }
  .rz-zoom-contenu { grid-template-columns: 1fr; align-items: start; }
}
@media (prefers-reduced-motion: reduce) {
  .rz * { animation-duration: .001ms !important; transition-duration: .001ms !important; }
}
`;