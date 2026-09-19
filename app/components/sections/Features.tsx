"use client";

// ─── palette (identique au reste du site) ─────────────────────────────────────
const WHITE = "#ffffff";
const ORANGE = "#ff6b00";
const INK = "#111111";

// ─── données ──────────────────────────────────────────────────────────────────
/** Mots-clés qui défilent — remplace par ce qui correspond vraiment à ton offre. */
const KEYWORDS = [
  "Branding",
  "UI/UX Design",
  "Développement web",
  "Applications mobiles",
  "Motion design",
  "Réalisation vidéo",
  "Photographie",
  "Print",
  "Réseaux sociaux",
  "Référencement SEO",
  "Identité visuelle",
  "Formation",
  "E-commerce",
  "Direction artistique",
  "Publicité",
  "Content creation",
  "Packaging",
  "Stratégie de marque",
];

type Highlight = { title: string; description: string; icon: IconName };
type IconName = "team" | "clock" | "pin" | "shield";

const HIGHLIGHTS: Highlight[] = [
  {
    icon: "team",
    title: "Une équipe pluridisciplinaire",
    description:
      "Design, développement, vidéo et marketing sous un même toit — pas de va-et-vient entre prestataires.",
  },
  {
    icon: "clock",
    title: "Des délais maîtrisés",
    description:
      "Un planning clair dès le brief, avec des points d'étape réguliers plutôt qu'une livraison surprise.",
  },
  {
    icon: "pin",
    title: "Un ancrage local",
    description:
      "Basés à Dakar, nous connaissons les usages, les moyens de paiement et les contraintes du marché ouest-africain.",
  },
  {
    icon: "shield",
    title: "Un rendu qui dure",
    description: "Des livrables pensés pour rester pertinents après la livraison, pas seulement le jour du rendu.",
  },
];

// ─── root export ──────────────────────────────────────────────────────────────
export default function ServicesShowcase() {
  const third = Math.ceil(KEYWORDS.length / 3);
  const rows = [
    KEYWORDS.slice(0, third),
    KEYWORDS.slice(third, third * 2),
    KEYWORDS.slice(third * 2),
  ];

  return (
    <>
      <ShowcaseStyles />

      <section className="fshow">
        <div className="fshow-inner">
          {/* accroche */}
          <header className="fshow-head">
            <h2>La clarté qui propulse votre marque</h2>
            <p>
              Trop d&apos;outils, de conseils et de bruit digital font perdre du temps et de l&apos;argent.
              Nous filtrons l&apos;essentiel et concentrons nos forces sur ce qui compte vraiment :
              vous rendre visible, mémorable et rentable — avec une méthode agile et des résultats mesurables.
            </p>
          </header>

          {/* bandeau de mots-clés défilants */}
          <div className="fshow-marquee-wrap">
            <span className="fshow-fade fshow-fade-l" />
            <span className="fshow-fade fshow-fade-r" />

            <div className="fshow-rows">
              {rows.map((row, i) => (
                <div
                  className={`fshow-row${i % 2 === 1 ? " reverse" : ""}`}
                  key={i}
                  style={{ "--fshow-duration": `${42 + i * 5}s` } as React.CSSProperties}
                >
                  <div className="fshow-track">
                    {[...row, ...row, ...row, ...row].map((word, j) => (
                      <span className="fshow-tag" key={`${word}-${j}`}>
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* grille de points forts */}
          <ul className="fshow-grid">
            {HIGHLIGHTS.map((h) => (
              <li className="fshow-card" key={h.title}>
                <Icon name={h.icon} />
                <div className="fshow-card-txt">
                  <h3>{h.title}</h3>
                  <p>{h.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

// ─── icônes (SVG inline — aucune dépendance externe requise) ──────────────────
function Icon({ name }: { name: IconName }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "team":
      return (
        <svg className="fshow-icon" {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
          <circle cx="17" cy="8.5" r="2.4" />
          <path d="M15.5 12c2.4.3 4 2 4 4.6" />
        </svg>
      );
    case "clock":
      return (
        <svg className="fshow-icon" {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3.2 2" />
        </svg>
      );
    case "pin":
      return (
        <svg className="fshow-icon" {...common}>
          <path d="M12 21s-6.8-6.1-6.8-11.2A6.8 6.8 0 0 1 12 3a6.8 6.8 0 0 1 6.8 6.8C18.8 14.9 12 21 12 21Z" />
          <circle cx="12" cy="9.8" r="2.3" />
        </svg>
      );
    case "shield":
      return (
        <svg className="fshow-icon" {...common}>
          <path d="M12 3.2 19 6v6c0 4.4-3 7.6-7 8.8-4-1.2-7-4.4-7-8.8V6l7-2.8Z" />
          <path d="M9 12l2.2 2.2L15.5 10" />
        </svg>
      );
  }
}

// ─── styles ───────────────────────────────────────────────────────────────────
function ShowcaseStyles() {
  return (
    <style>{`
      .fshow, .fshow * { box-sizing: border-box; margin: 0; padding: 0; }

      .fshow {
        --white: ${WHITE};
        --orange: ${ORANGE};
        --ink: ${INK};
        --tag-bg: #fff3ea;
        --tag-border: #ffd9b8;
        --line: rgba(17,17,17,.12);
        background: var(--white); color: var(--ink);
        font-family: Inter, sans-serif;
        padding: clamp(4.5rem, 10vw, 8rem) 0 0;
      }

      .fshow-inner { max-width: 1180px; margin: 0 auto; }

      /* ── accroche ── */
      .fshow-head {
        max-width: 680px; margin: 0 auto;
        display: flex; flex-direction: column; align-items: center; gap: 1.1rem;
        text-align: center; padding: 0 clamp(1.25rem, 5vw, 2.5rem);
      }
      .fshow-head h2 {
        font-size: clamp(2rem, 5.5vw, 3.4rem);
        font-weight: 900; letter-spacing: -.035em; line-height: 1.1;
      }
      .fshow-head p { font-size: clamp(.95rem, 1.6vw, 1.08rem); line-height: 1.75; opacity: .62; }

      /* ── bandeau défilant ── */
      .fshow-marquee-wrap {
        position: relative; overflow: hidden;
        margin-top: clamp(2.5rem, 5vw, 3.5rem);
      }
      .fshow-fade {
        position: absolute; top: 0; bottom: 0; z-index: 2; width: clamp(3rem, 8vw, 7rem);
        pointer-events: none;
      }
      .fshow-fade-l { left: 0; background: linear-gradient(90deg, var(--white), transparent); }
      .fshow-fade-r { right: 0; background: linear-gradient(270deg, var(--white), transparent); }

      .fshow-rows { display: flex; flex-direction: column; gap: .6rem; }
      .fshow-row { overflow: hidden; }

      .fshow-track {
        display: flex; align-items: center; gap: .6rem;
        width: max-content;
        animation: fshow-scroll var(--fshow-duration, 45s) linear infinite;
      }
      .fshow-row.reverse .fshow-track { animation-direction: reverse; }

      @keyframes fshow-scroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      .fshow-tag {
        flex: none;
        padding: 9px 20px; border-radius: 999px;
        background: var(--tag-bg); border: 1px solid var(--tag-border);
        color: var(--ink);
        font-size: .85rem; font-weight: 600; letter-spacing: -.005em;
        white-space: nowrap;
        transition: background .3s ease, color .3s ease, border-color .3s ease;
      }
      .fshow-tag:hover { background: var(--orange); border-color: var(--orange); color: var(--white); }

      /* ── grille de points forts ── */
      .fshow-grid {
        list-style: none;
        margin-top: clamp(3.5rem, 7vw, 5.5rem);
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border-top: 1px dashed var(--line);
      }

      .fshow-card {
        padding: clamp(2rem, 4vw, 2.5rem) clamp(1.25rem, 3vw, 1.75rem);
        border-right: 1px dashed var(--line);
        border-bottom: 1px dashed var(--line);
        display: flex; flex-direction: column; gap: 1.4rem;
        transition: background .35s ease;
      }
      .fshow-card:hover { background: #fffaf5; }
      .fshow-card:last-child { border-right: none; }

      .fshow-icon {
        width: 40px; height: 40px; color: var(--orange);
      }

      .fshow-card-txt { display: flex; flex-direction: column; gap: .5rem; }
      .fshow-card-txt h3 {
        font-size: clamp(1.05rem, 2vw, 1.25rem);
        font-weight: 800; letter-spacing: -.02em;
      }
      .fshow-card-txt p { font-size: .92rem; line-height: 1.7; opacity: .62; }

      /* ── responsive ── */
      @media (max-width: 980px) {
        .fshow-grid { grid-template-columns: repeat(2, 1fr); }
        .fshow-card:nth-child(2) { border-right: none; }
      }
      @media (max-width: 560px) {
        .fshow-grid { grid-template-columns: 1fr; }
        .fshow-card { border-right: none; }
      }

      @media (prefers-reduced-motion: reduce) {
        .fshow-track { animation: none; }
        .fshow *, .fshow *::before, .fshow *::after { transition-duration: .01ms !important; }
      }
    `}</style>
  );
}