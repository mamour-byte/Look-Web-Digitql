"use client";
import { useEffect, useRef, useState } from "react";

// ─── palette (identique au hero, à la navbar et aux services) ────────────────
const WHITE = "#ffffff";
const ORANGE = "#ff6b00";
const INK = "#111111";

export type TeamMember = {
  name: string;
  role: string;
  photo?: string;
  socials?: { label: string; href: string }[];
};

type Props = {
  /** Ref du conteneur qui scrolle (.icsa-wrap). Si absent → viewport. */
  scrollRef?: React.RefObject<HTMLElement | null>;
  eyebrow?: string;
  title?: string;
  intro?: string;
  members?: TeamMember[];
};

const DEFAULT_MEMBERS: TeamMember[] = [
  
  {
    name: "Pape Thiam",
    role: "Direction artistique & Graphiste",
    photo: "./images/paco.jpg",
    socials: [
      { label: "LinkedIn", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  },
  {
    name: "Fama Ndiaye",
    role: "Voix Off & Service client",
    photo: "/team/fama-ndiaye.jpg",
    socials: [
      { label: "Instagram", href: "#" },
      { label: "Vimeo", href: "#" },
    ],
  },
  {
    name: "Mamour Fall",
    role: "Développeur Web",
    photo: "./images/mamour.jpg",
    socials: [
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    name: "Aminata Thiam",
    role: "Graphiste & Motion Designer",
    photo: "/team/aida-sarr.jpg",
    socials: [
      { label: "LinkedIn", href: "#" },
      { label: "Twitter", href: "#" },
    ],
  },
];

// ─── root export ──────────────────────────────────────────────────────────────
export default function Team({
  scrollRef,
  eyebrow = "L'équipe",
  title = "Les mains derrière\nchaque projet.",
  intro = "Graphistes, développeurs, vidéastes et stratégistes : une équipe pluridisciplinaire qui reste impliquée du premier brief jusqu'à la livraison — et au-delà.",
  members = DEFAULT_MEMBERS,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setOn(true),
      { root: scrollRef?.current ?? null, threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scrollRef]);

  return (
    <>
      <TeamStyles />

      <section ref={sectionRef} id="equipe" className={`fteam${on ? " on" : ""}`}>
        <div className="fteam-inner">
          {/* en-tête */}
          <header className="fteam-head">
            <span className="fteam-eyebrow">
              <i />
              {eyebrow}
            </span>
            <h2 className="fteam-title">
              {title.split("\n").map((line, i) => (
                <span className="fteam-line" key={i}>
                  <span style={{ transitionDelay: `${0.1 + i * 0.1}s` }}>{line}</span>
                </span>
              ))}
            </h2>
            <p className="fteam-intro">{intro}</p>
          </header>

          {/* grille */}
          <ul className="fteam-grid">
            {members.map((m, i) => (
              <li
                key={m.name}
                className="fteam-card"
                style={{ transitionDelay: `${0.14 + i * 0.08}s` }}
              >
                <div className="fteam-media">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} loading="lazy" />
                  ) : (
                    <span className="fteam-fallback" aria-hidden>
                      {m.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}

                  {/* voile + socials qui montent au survol */}
                  <div className="fteam-overlay">
                    <div className="fteam-socials">
                      {(m.socials ?? []).map((s) => (
                        <a key={s.label} href={s.href} aria-label={`${m.name} — ${s.label}`}>
                          {s.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* <span className="fteam-corner" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span> */}
                </div>

                <div className="fteam-id">
                  <h3>{m.name}</h3>
                  <p>{m.role}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* pied de section */}
          {/* <div className="fteam-foot">
            <p>Envie de rejoindre l'équipe ou de collaborer sur un projet ponctuel ?</p>
            <a className="fteam-cta" href="#contact">
              <span>Nous écrire</span>
            </a>
          </div> */}
        </div>
      </section>
    </>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
function TeamStyles() {
  return (
    <style>{`
      .fteam, .fteam * { box-sizing: border-box; margin: 0; padding: 0; }

      .fteam {
        --white: ${WHITE};
        --orange: ${ORANGE};
        --ink: ${INK};
        --line: rgba(17,17,17,.10);
        background: var(--white); color: var(--ink);
        font-family: Inter, sans-serif;
        padding: clamp(3.5rem, 7vw, 5.5rem) clamp(1.25rem, 5vw, 3rem);
      }

      .fteam-inner { max-width: 1160px; margin: 0 auto; }

      /* ── en-tête (même grammaire que Services) ── */
      .fteam-head { max-width: 720px; margin-bottom: clamp(2rem, 4vw, 3.5rem); }

      .fteam-eyebrow {
        display: inline-flex; align-items: center; gap: .6rem;
        font-size: .7rem; font-weight: 600;
        letter-spacing: .26em; text-transform: uppercase;
        color: var(--orange);
        opacity: 0; transform: translateY(14px);
        transition: opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1);
      }
      .fteam-eyebrow i {
        width: 26px; height: 1px; background: var(--orange); display: block;
        transform: scaleX(0); transform-origin: left;
        transition: transform .8s cubic-bezier(.16,1,.3,1) .15s;
      }
      .fteam.on .fteam-eyebrow { opacity: 1; transform: translateY(0); }
      .fteam.on .fteam-eyebrow i { transform: scaleX(1); }

      .fteam-title {
        margin-top: 1.5rem;
        font-size: clamp(2rem, 5.5vw, 3.6rem);
        font-weight: 900; letter-spacing: -.035em; line-height: 1.08;
      }
      .fteam-line { display: block; overflow: hidden; padding-bottom: .06em; }
      .fteam-line > span {
        display: block; transform: translateY(105%);
        transition: transform 1s cubic-bezier(.16,1,.3,1);
      }
      .fteam.on .fteam-line > span { transform: translateY(0); }

      .fteam-intro {
        margin-top: 1.5rem; max-width: 480px;
        font-size: clamp(.95rem, 1.6vw, 1.1rem); line-height: 1.75;
        opacity: 0; transform: translateY(18px);
        transition: opacity .8s ease .35s, transform .8s cubic-bezier(.16,1,.3,1) .35s;
      }
      .fteam.on .fteam-intro { opacity: .62; transform: translateY(0); }

      /* ── grille ── */
      .fteam-grid {
        list-style: none;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: clamp(1.25rem, 3vw, 2rem);
      }

      .fteam-card {
        opacity: 0; transform: translateY(24px);
        transition: opacity .75s ease, transform .75s cubic-bezier(.16,1,.3,1);
      }
      .fteam.on .fteam-card { opacity: 1; transform: translateY(0); }

      /* ── photo / média ── */
      .fteam-media {
        position: relative; overflow: hidden;
        aspect-ratio: 3 / 4; border-radius: 18px;
        background: #f2f2f2;
      }
      .fteam-media img {
        width: 100%; height: 100%; object-fit: cover;
        filter: grayscale(.15) contrast(1.02);
        transform: scale(1.02);
        transition: transform .7s cubic-bezier(.16,1,.3,1), filter .5s ease;
      }
      .fteam-card:hover .fteam-media img { transform: scale(1.09); filter: grayscale(0) contrast(1.05); }

      .fteam-fallback {
        position: absolute; inset: 0;
        display: grid; place-items: center;
        font-size: clamp(2rem, 5vw, 3rem);
        font-weight: 900; letter-spacing: -.03em;
        color: var(--orange); background: #fff3ea;
      }

      /* liseré orange qui encadre la carte au survol */
      .fteam-media::after {
        content: ""; position: absolute; inset: 0;
        border-radius: inherit;
        opacity: 0; transition: opacity .4s ease;
        pointer-events: none;
      }
      .fteam-card:hover .fteam-media::after { opacity: 1; }

      /* voile orange qui monte + liens sociaux */
      .fteam-overlay {
        position: absolute; inset: 0;
        display: flex; align-items: flex-end; justify-content: center;
        padding: 0 1rem 1.4rem;
        background: linear-gradient(180deg, transparent 40%, rgba(255,107,0,.92) 100%);
        opacity: 0; transform: translateY(10%);
        transition: opacity .45s ease, transform .45s cubic-bezier(.16,1,.3,1);
      }
      .fteam-card:hover .fteam-overlay,
      .fteam-card:focus-within .fteam-overlay { opacity: 1; transform: translateY(0); }

      .fteam-socials { display: flex; gap: .5rem; flex-wrap: wrap; justify-content: center; }
      .fteam-socials a {
        text-decoration: none; color: var(--white);
        font-size: .72rem; font-weight: 600; letter-spacing: .04em;
        padding: 7px 14px; border-radius: 999px;
        border: 1px solid rgba(255,255,255,.55);
        transition: background .3s ease, color .3s ease, transform .3s ease;
      }
      .fteam-socials a:hover { background: var(--white); color: var(--orange); transform: translateY(-2px); }

      /* coin "flèche" — écho du composant Services */
      .fteam-corner {
        position: absolute; top: .75rem; right: .75rem;
        width: 36px; height: 36px; border-radius: 50%;
        background: rgba(255,255,255,.9); color: var(--orange);
        display: grid; place-items: center;
        opacity: 0; transform: scale(.7) rotate(-45deg);
        transition: opacity .35s ease, transform .4s cubic-bezier(.16,1,.3,1);
      }
      .fteam-corner svg { width: 16px; height: 16px; }
      .fteam-card:hover .fteam-corner { opacity: 1; transform: scale(1) rotate(0deg); }

      /* ── identité ── */
      .fteam-id { padding-top: 1.1rem; }
      .fteam-id h3 {
        font-size: clamp(1.05rem, 1.8vw, 1.25rem);
        font-weight: 800; letter-spacing: -.02em;
      }
      .fteam-id p {
        margin-top: .3rem;
        font-size: .84rem; letter-spacing: .01em;
        color: var(--orange); font-weight: 600;
      }

      /* ── pied de section ── */
      .fteam-foot {
        margin-top: clamp(3.5rem, 7vw, 5rem);
        padding-top: clamp(2rem, 4vw, 2.5rem);
        border-top: 1px solid var(--line);
        display: flex; flex-wrap: wrap; align-items: center;
        justify-content: space-between; gap: 1.5rem;
        opacity: 0; transform: translateY(20px);
        transition: opacity .8s ease .5s, transform .8s cubic-bezier(.16,1,.3,1) .5s;
      }
      .fteam.on .fteam-foot { opacity: 1; transform: translateY(0); }
      .fteam-foot p { max-width: 420px; font-size: .95rem; line-height: 1.7; opacity: .6; }

      .fteam-cta {
        position: relative; overflow: hidden;
        text-decoration: none; display: inline-block;
        background: var(--orange); color: var(--white);
        padding: 14px 34px; border-radius: 999px;
        font-size: .95rem; font-weight: 600;
        box-shadow: 0 8px 24px rgba(255,107,0,.26);
        transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease;
      }
      .fteam-cta span { position: relative; z-index: 1; }
      .fteam-cta::after {
        content: ""; position: absolute; inset: 0;
        background: var(--ink); transform: translateY(101%);
        transition: transform .45s cubic-bezier(.16,1,.3,1);
      }
      .fteam-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(255,107,0,.32); }
      .fteam-cta:hover::after { transform: translateY(0); }

      /* ── responsive ── */
      @media (max-width: 980px) { .fteam-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 480px) {
        .fteam-grid { grid-template-columns: 1fr; gap: 1.75rem; }
        .fteam-media { aspect-ratio: 4 / 3; }
      }

      /* le survol n'existe pas au doigt : le voile reste discret par défaut */
      @media (hover: none) {
        .fteam-overlay { opacity: .92; transform: translateY(0); background: linear-gradient(180deg, transparent 55%, rgba(255,107,0,.88) 100%); }
        .fteam-corner { opacity: 1; transform: scale(1) rotate(0deg); }
      }

      @media (prefers-reduced-motion: reduce) {
        .fteam *, .fteam *::before, .fteam *::after { transition-duration: .01ms !important; }
      }
    `}</style>
  );
}