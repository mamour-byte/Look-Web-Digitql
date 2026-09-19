"use client";
import { useEffect, useRef, useState } from "react";

// ─── palette (identique au hero et à la navbar) ───────────────────────────────
const WHITE = "#ffffff";
const ORANGE = "#ff6b00";
const INK = "#111111";

export type Service = {
  title: string;
  description: string;
  tags: string[];
};

type Props = {
  /** Ref du conteneur qui scrolle (.icsa-wrap). Si absent → viewport. */
  scrollRef?: React.RefObject<HTMLElement | null>;
  eyebrow?: string;
  title?: string;
  intro?: string;
  services?: Service[];
};

const DEFAULT_SERVICES: Service[] = [
  {
    title: "Graphisme & Identité visuelle",
    description:
      "Identité visuelle, logo, charte graphique et déclinaisons. Une marque cohérente, du premier croquis au kit complet, pour vous rendre reconnaissable en un coup d'œil.",
    tags: ["Logo", "Charte", "Packaging", "Réseaux sociaux"],
  },
  {
    title: "Réalisation vidéo",
    description:
      "Écriture, tournage, montage et motion design. Films de marque, capsules réseaux sociaux et couverture d'événements pour capter l'attention et la garder.",
    tags: ["Motion design", "Montage", "Captation", "Publicité"],
  },
  {
    title: "Création de sites web",
    description:
      "Sites vitrines, e-commerce et applications sur mesure. Rapides, pensés mobile d'abord, optimisés SEO et faciles à faire vivre par votre équipe.",
    tags: ["Vitrine", "E-commerce", "Web app", "SEO"],
  },
  {
    title: "Print",
    description:
      "Affiches, flyers, brochures, cartes de visite, signalétique. Fichiers prêts presse et suivi de l'impression pour un rendu fidèle à votre image.",
    tags: ["Affichage", "Édition", "Signalétique", "PLV"],
  },
  {
    title: "Photographie professionnelle",
    description:
      "Portrait corporate, produit, architecture et reportage. Des images calibrées pour vos supports print et digitaux, livrées retouchées sous 72 h.",
    tags: ["Corporate", "Produit", "Événementiel", "Retouche"],
  },
  {
    title: "Masterclass & formation",
    description:
      "Programmes sur mesure pour équipes et indépendants. Design, outils numériques, création de contenu et IA appliquée pour monter en compétence.",
    tags: ["Présentiel", "En ligne", "Sur mesure", "Certifiant"],
  },
  {
    title: "Marketing digital & SEO",
    description:
      "Stratégie de contenu, community management, campagnes payantes et référencement. Chaque action est mesurée, chaque euro de budget est optimisé.",
    tags: ["Stratégie", "Social media", "Ads", "Analytics"],
  },
];

// ─── root export ──────────────────────────────────────────────────────────────
export default function Services({
  scrollRef,
  eyebrow = "Nos services",
  title = "Des expertises\nqui font décoller votre marque.",
  intro = "De l'identité visuelle au site web, du film de marque au référencement : une seule équipe pluridisciplinaire du premier échange jusqu'à la mise en ligne.",
  services = DEFAULT_SERVICES,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setOn(true),
      { root: scrollRef?.current ?? null, threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scrollRef]);

  return (
    <>
      <ServicesStyles />

      <section ref={sectionRef} id="services" className={`fsvc${on ? " on" : ""}`}>
        <div className="fsvc-inner">
          {/* en-tête */}
          <header className="fsvc-head">
            <span className="fsvc-eyebrow">
              <i />
              {eyebrow}
            </span>
            <h2 className="fsvc-title">
              {title.split("\n").map((line, i) => (
                <span className="fsvc-line" key={i}>
                  <span style={{ transitionDelay: `${0.1 + i * 0.1}s` }}>{line}</span>
                </span>
              ))}
            </h2>
            <p className="fsvc-intro">{intro}</p>
          </header>

          {/* liste */}
          <ul className="fsvc-list">
            {services.map((s, i) => {
              const open = openIdx === i;
              return (
                <li
                  key={s.title}
                  className={`fsvc-row${open ? " is-open" : ""}`}
                  style={{ transitionDelay: `${0.12 + i * 0.06}s` }}
                >
                  <button
                    className="fsvc-trigger"
                    aria-expanded={open}
                    onClick={() => setOpenIdx(open ? null : i)}
                  >
                    <span className="fsvc-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="fsvc-name">{s.title}</span>
                    <span className="fsvc-arrow" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>

                  <div className="fsvc-detail">
                    <div className="fsvc-detail-in">
                      <p>{s.description}</p>
                      <ul className="fsvc-tags">
                        {s.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* pied de section */}
          <div className="fsvc-foot">
            <p>Un projet qui mélange plusieurs de ces expertises ? C&apos;est précisément notre terrain.</p>
            <a className="fsvc-cta" href="#contact">
              <span>Parlons-en</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
function ServicesStyles() {
  return (
    <style>{`
      .fsvc, .fsvc * { box-sizing: border-box; margin: 0; padding: 0; }

      .fsvc {
        --white: ${WHITE};
        --orange: ${ORANGE};
        --ink: ${INK};
        --line: rgba(17,17,17,.10);
        background: var(--white); color: var(--ink);
        font-family: Inter, sans-serif;
        padding: clamp(3.5rem, 7vw, 5.5rem) clamp(1.25rem, 5vw, 3rem);
      }

      .fsvc-inner { max-width: 1120px; margin: 0 auto; }

      /* ── en-tête ── */
      .fsvc-head { max-width: 760px; margin-bottom: clamp(2rem, 4vw, 3.5rem); }

      .fsvc-eyebrow {
        display: inline-flex; align-items: center; gap: .6rem;
        font-size: .7rem; font-weight: 600;
        letter-spacing: .26em; text-transform: uppercase;
        color: var(--orange);
        opacity: 0; transform: translateY(14px);
        transition: opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1);
      }
      .fsvc-eyebrow i {
        width: 26px; height: 1px; background: var(--orange); display: block;
        transform: scaleX(0); transform-origin: left;
        transition: transform .8s cubic-bezier(.16,1,.3,1) .15s;
      }
      .fsvc.on .fsvc-eyebrow { opacity: 1; transform: translateY(0); }
      .fsvc.on .fsvc-eyebrow i { transform: scaleX(1); }

      .fsvc-title {
        margin-top: 1.5rem;
        font-size: clamp(2rem, 5.5vw, 3.6rem);
        font-weight: 900; letter-spacing: -.035em; line-height: 1.08;
      }
      .fsvc-line { display: block; overflow: hidden; padding-bottom: .06em; }
      .fsvc-line > span {
        display: block;
        transform: translateY(105%);
        transition: transform 1s cubic-bezier(.16,1,.3,1);
      }
      .fsvc.on .fsvc-line > span { transform: translateY(0); }

      .fsvc-intro {
        margin-top: 1.5rem; max-width: 520px;
        font-size: clamp(.95rem, 1.6vw, 1.1rem); line-height: 1.75;
        opacity: 0; transform: translateY(18px);
        transition: opacity .8s ease .35s, transform .8s cubic-bezier(.16,1,.3,1) .35s;
      }
      .fsvc.on .fsvc-intro { opacity: .62; transform: translateY(0); }

      /* ── liste ── */
      .fsvc-list { list-style: none; border-top: 1px solid var(--line); }

      .fsvc-row {
        position: relative;
        border-bottom: 1px solid var(--line);
        opacity: 0; transform: translateY(22px);
        transition: opacity .75s ease, transform .75s cubic-bezier(.16,1,.3,1);
      }
      .fsvc.on .fsvc-row { opacity: 1; transform: translateY(0); }

      /* remplissage orange qui monte au survol */
      .fsvc-row::before {
        content: ""; position: absolute; inset: 0;
        background: var(--orange);
        transform: scaleY(0); transform-origin: bottom;
        transition: transform .55s cubic-bezier(.76,0,.24,1);
      }
      .fsvc-row:hover::before,
      .fsvc-row:focus-within::before,
      .fsvc-row.is-open::before { transform: scaleY(1); transform-origin: bottom; }

      .fsvc-trigger {
        position: relative; z-index: 1;
        width: 100%; background: none; border: none; cursor: pointer;
        font-family: inherit; color: inherit; text-align: left;
        display: grid; grid-template-columns: auto 1fr auto;
        align-items: center; gap: clamp(1rem, 4vw, 2.5rem);
        padding: clamp(1.4rem, 3vw, 2rem) clamp(.5rem, 2vw, 1.25rem);
        transition: color .4s ease, padding-left .5s cubic-bezier(.16,1,.3,1);
      }
      .fsvc-row:hover .fsvc-trigger,
      .fsvc-row:focus-within .fsvc-trigger,
      .fsvc-row.is-open .fsvc-trigger { color: var(--white); padding-left: clamp(1rem, 3vw, 2rem); }

      .fsvc-num {
        font-size: .72rem; font-weight: 600;
        letter-spacing: .18em; opacity: .4;
        font-variant-numeric: tabular-nums;
        transition: opacity .4s ease;
      }
      .fsvc-row:hover .fsvc-num,
      .fsvc-row.is-open .fsvc-num { opacity: .75; }

      .fsvc-name {
        font-size: clamp(1.25rem, 3.6vw, 2.15rem);
        font-weight: 900; letter-spacing: -.035em; line-height: 1.15;
      }

      .fsvc-arrow {
        width: 42px; height: 42px; flex: none;
        border-radius: 50%; border: 1px solid currentColor;
        display: grid; place-items: center;
        opacity: .35;
        transition: opacity .4s ease, transform .5s cubic-bezier(.16,1,.3,1),
                    background .4s ease, color .4s ease;
      }
      .fsvc-arrow svg { width: 18px; height: 18px; }
      .fsvc-row:hover .fsvc-arrow,
      .fsvc-row:focus-within .fsvc-arrow {
        opacity: 1; transform: rotate(45deg);
        background: var(--white); color: var(--orange); border-color: var(--white);
      }
      .fsvc-row.is-open .fsvc-arrow {
        opacity: 1; transform: rotate(135deg);
        background: var(--white); color: var(--orange); border-color: var(--white);
      }

      /* ── détail dépliable ── */
      .fsvc-detail {
        position: relative; z-index: 1;
        display: grid; grid-template-rows: 0fr;
        transition: grid-template-rows .55s cubic-bezier(.76,0,.24,1);
        color: var(--white);
      }
      .fsvc-row.is-open .fsvc-detail { grid-template-rows: 1fr; }
      .fsvc-detail-in { overflow: hidden; }

      .fsvc-detail-in > p {
        max-width: 620px;
        padding: 0 clamp(1rem, 3vw, 2rem) .5rem;
        margin-left: clamp(0px, 3vw, 62px);
        font-size: clamp(.9rem, 1.6vw, 1.02rem); line-height: 1.75;
        opacity: 0; transform: translateY(10px);
        transition: opacity .5s ease .12s, transform .5s ease .12s;
      }
      .fsvc-row.is-open .fsvc-detail-in > p { opacity: .92; transform: translateY(0); }

      .fsvc-tags {
        list-style: none; display: flex; flex-wrap: wrap; gap: .5rem;
        padding: .25rem clamp(1rem, 3vw, 2rem) clamp(1.4rem, 3vw, 2rem);
        margin-left: clamp(0px, 3vw, 62px);
      }
      .fsvc-tags li {
        font-size: .72rem; font-weight: 600; letter-spacing: .04em;
        padding: 6px 14px; border-radius: 999px;
        border: 1px solid rgba(255,255,255,.45);
        opacity: 0; transform: translateY(10px);
        transition: opacity .5s ease .2s, transform .5s cubic-bezier(.16,1,.3,1) .2s,
                    background .3s ease, color .3s ease;
      }
      .fsvc-row.is-open .fsvc-tags li { opacity: .9; transform: translateY(0); }
      .fsvc-tags li:hover { background: var(--white); color: var(--orange); opacity: 1; }

      /* ── pied de section ── */
      .fsvc-foot {
        margin-top: clamp(3rem, 6vw, 4.5rem);
        display: flex; flex-wrap: wrap; align-items: center;
        justify-content: space-between; gap: 1.5rem;
        opacity: 0; transform: translateY(20px);
        transition: opacity .8s ease .5s, transform .8s cubic-bezier(.16,1,.3,1) .5s;
      }
      .fsvc.on .fsvc-foot { opacity: 1; transform: translateY(0); }
      .fsvc-foot p { max-width: 420px; font-size: .95rem; line-height: 1.7; opacity: .6; }

      .fsvc-cta {
        position: relative; overflow: hidden;
        text-decoration: none; display: inline-block;
        background: var(--orange); color: var(--white);
        padding: 14px 34px; border-radius: 999px;
        font-size: .95rem; font-weight: 600;
        box-shadow: 0 8px 24px rgba(255,107,0,.26);
        transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease;
      }
      .fsvc-cta span { position: relative; z-index: 1; }
      .fsvc-cta::after {
        content: ""; position: absolute; inset: 0;
        background: var(--ink); transform: translateY(101%);
        transition: transform .45s cubic-bezier(.16,1,.3,1);
      }
      .fsvc-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(255,107,0,.32); }
      .fsvc-cta:hover::after { transform: translateY(0); }

      /* ── responsive ── */
      @media (max-width: 640px) {
        .fsvc-trigger { grid-template-columns: auto 1fr; gap: .9rem; }
        .fsvc-arrow { grid-column: 2; justify-self: end; margin-top: .25rem; width: 36px; height: 36px; }
        .fsvc-detail-in > p, .fsvc-tags { margin-left: 0; }
      }

      /* le survol n'existe pas au doigt : on garde l'état ouvert comme seul déclencheur */
      @media (hover: none) {
        .fsvc-row:hover::before { transform: scaleY(0); }
        .fsvc-row.is-open::before { transform: scaleY(1); }
        .fsvc-row:hover .fsvc-trigger { color: var(--ink); padding-left: clamp(.5rem, 2vw, 1.25rem); }
        .fsvc-row.is-open .fsvc-trigger { color: var(--white); }
      }

      @media (prefers-reduced-motion: reduce) {
        .fsvc *, .fsvc *::before, .fsvc *::after { transition-duration: .01ms !important; }
      }
    `}</style>
  );
}