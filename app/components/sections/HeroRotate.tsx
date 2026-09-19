"use client";
import { useEffect, useRef, useState } from "react";

// ─── palette (identique au reste du site) ─────────────────────────────────────
const WHITE = "#ffffff";
const ORANGE = "#ff6b00";
const INK = "#111111";

export type Props = {
  backgroundImage?: string;
  eyebrow?: string;
  prefix?: string;
  words?: string[];
  suffix?: string;
  intro?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Durée d'affichage de chaque mot en ms. */
  rotationInterval?: number;
};

const DEFAULT_WORDS = ["visible.", "mémorable.", "désirable.", "rentable."];

// ─── root export ──────────────────────────────────────────────────────────────
export default function HeroRotate({
  backgroundImage = "./images/info.jpg",
  eyebrow = "Look Web Digital",
  prefix = "Nous rendons votre marque",
  words = DEFAULT_WORDS,
  suffix,
  intro = "Design, vidéo, développement et marketing : une seule équipe pour porter votre projet du concept à la mise en ligne.",
  ctaLabel = "Démarrer un projet",
  ctaHref = "#contact",
  rotationInterval = 2200,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <HeroRotateStyles />

      <section className={`hrot${loaded ? " on" : ""}`}>
        <div className="hrot-bg">
          <img className="hrot-img" src={backgroundImage} alt="" />
          {/* voile de lisibilité : dégradé sombre + teinte orange de marque */}
          <div className="hrot-veil" />
          <div className="hrot-tint" />
        </div>

        <div className="hrot-content">
          <span className="hrot-eyebrow">
            {eyebrow}
          </span>

          <h1 className="hrot-title">
            <span className="hrot-static">{prefix}</span>{" "}
            <RotatingWord words={words} interval={rotationInterval} />
            {suffix ? <span className="hrot-static"> {suffix}</span> : null}
          </h1>

          {/* <p className="hrot-intro">{intro}</p> */}

          {/* <a className="hrot-cta" href={ctaHref}>
            <span>{ctaLabel}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a> */}
        </div>

      </section>
    </>
  );
}

/**
 * Mot qui tourne dans une liste, avec une entrée/sortie caractère par caractère.
 * Séquence stricte : le mot sortant termine complètement son animation avant
 * que le mot suivant ne commence à entrer — aucun chevauchement visuel.
 */
function RotatingWord({ words, interval }: { words: string[]; interval: number }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "leaving" | "entering">("idle");
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const EXIT_MS = 420; // durée de la sortie du mot courant
  const ENTER_MS = 520; // durée de l'entrée du mot suivant

  useEffect(() => {
    if (words.length <= 1) return;

    tickTimer.current = setInterval(() => {
      // 1) le mot courant part d'abord, seul
      setPhase("leaving");

      // 2) une fois qu'il a complètement disparu, le mot suivant entre
      stepTimer.current = setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setPhase("entering");

        // 3) fin de l'entrée → retour au repos
        stepTimer.current = setTimeout(() => setPhase("idle"), ENTER_MS);
      }, EXIT_MS);
    }, interval);

    return () => {
      if (tickTimer.current) clearInterval(tickTimer.current);
      if (stepTimer.current) clearTimeout(stepTimer.current);
    };
  }, [words.length, interval]);

  return (
    <span className="hrot-word-mask">
      <span className="hrot-word-pill">
        {phase === "leaving" ? (
          <Letters key={`out-${index}`} text={words[index]} mode="out" />
        ) : (
          <Letters key={`in-${index}`} text={words[index]} mode={phase === "entering" ? "in" : "static"} />
        )}
      </span>
    </span>
  );
}

function Letters({ text, mode }: { text: string; mode: "in" | "out" | "static" }) {
  const chars = Array.from(text);
  return (
    <span className={`hrot-letters hrot-letters-${mode}`}>
      {chars.map((c, i) => (
        <span
          className="hrot-char-mask"
          key={i}
          style={{ animationDelay: `${i * 22}ms` }}
        >
          <span className="hrot-char">{c === " " ? "\u00A0" : c}</span>
        </span>
      ))}
    </span>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
function HeroRotateStyles() {
  return (
    <style>{`
      .hrot, .hrot * { box-sizing: border-box; margin: 0; padding: 0; }

      .hrot {
        --white: ${WHITE};
        --orange: ${ORANGE};
        --ink: ${INK};
        position: relative; width: 100%; height: 100vh; min-height: 620px;
        overflow: hidden; background: var(--ink); color: var(--white);
        font-family: Inter, sans-serif;
        opacity: 0; transition: opacity .7s ease;
      }
      .hrot.on { opacity: 1; }

      /* ── image de fond ── */
      .hrot-bg { position: absolute; inset: 0; }
      .hrot-img {
        width: 100%; height: 100%; object-fit: cover;
        transform: scale(1.05);
        transition: transform 1.4s cubic-bezier(.16,1,.3,1);
      }
      .hrot.on .hrot-img { transform: scale(1); }

      /* voile sombre — assez présent pour garantir la lisibilité du texte */
      .hrot-veil {
        position: absolute; inset: 0;
        background:
          linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.35) 35%, rgba(0,0,0,.72) 100%),
          radial-gradient(70% 60% at 15% 30%, rgba(0,0,0,.35), transparent 70%);
      }
      /* légère teinte orange de marque, en overlay doux */
      .hrot-tint {
        position: absolute; inset: 0;
        background: linear-gradient(160deg, rgba(255,107,0,.20) 0%, transparent 55%);
        mix-blend-mode: overlay;
      }

      /* ── contenu ── */
      .hrot-content {
        position: relative; z-index: 2; height: 100%;
        display: flex; flex-direction: column; justify-content: center;
        max-width: 100%;
        padding: 0 clamp(1.5rem, 6vw, 5rem);
      }

      .hrot-eyebrow {
        display: inline-flex; align-items: center; gap: .6rem;
        font-size: .72rem; font-weight: 600;
        letter-spacing: .26em; text-transform: uppercase;
        color: var(--orange);
        opacity: 0; transform: translateY(12px);
        transition: opacity .7s ease .15s, transform .7s cubic-bezier(.16,1,.3,1) .15s;
      }
      .hrot.on .hrot-eyebrow { opacity: 1; transform: translateY(0); }
      .hrot-eyebrow i { width: 24px; height: 1px; background: var(--orange); display: block; }

      .hrot-title {
        margin-top: 1rem;
        font-size: clamp(2.1rem, 6.2vw, 4rem);
        font-weight: 900; letter-spacing: -.035em; line-height: 1.12;
        
      }
      .hrot-static {
        opacity: 0; transform: translateY(16px);
        transition: opacity .8s ease .3s, transform .8s cubic-bezier(.16,1,.3,1) .3s;
      }
      .hrot.on .hrot-static { opacity: 1; transform: translateY(0); }

      /* ── mot rotatif ── */
      .hrot-word-mask {
        display: inline-flex; overflow: hidden;
        opacity: 0; transform: translateY(16px);
        transition: opacity .8s ease .42s, transform .8s cubic-bezier(.16,1,.3,1) .42s;
      }
      .hrot.on .hrot-word-mask { opacity: 1; transform: translateY(0); }

      .hrot-word-pill {
        position: relative;
        display: inline-flex; align-items: center;
        background: var(--orange); color: var(--white);
        padding: .12em .32em .16em; border-radius: 12px;
        overflow: hidden;
      }

      .hrot-letters { display: inline-flex; }

      .hrot-char-mask { display: inline-block; overflow: hidden; }
      .hrot-char { display: inline-block; }

      /* mot au repos : aucune animation, évite tout re-déclenchement parasite */
      .hrot-letters-static .hrot-char { transform: translateY(0); }

      /* lettre qui entre : monte depuis le bas, une fois l'ancien mot totalement sorti */
      .hrot-letters-in .hrot-char {
        transform: translateY(115%);
        animation: hrot-char-in .5s cubic-bezier(.16,1,.3,1) forwards;
      }
      @keyframes hrot-char-in { to { transform: translateY(0); } }

      /* lettre qui sort : part vers le haut et disparaît avant toute nouvelle entrée */
      .hrot-letters-out .hrot-char {
        transform: translateY(0);
        animation: hrot-char-out .42s cubic-bezier(.6,0,.8,.2) forwards;
      }
      @keyframes hrot-char-out { to { transform: translateY(-130%); opacity: 0; } }

      .hrot-intro {
        margin-top: 1.6rem; max-width: 560px;
        font-size: clamp(.98rem, 1.6vw, 1.15rem); line-height: 1.75; opacity: 0;
        transform: translateY(16px);
        transition: opacity .8s ease .55s, transform .8s cubic-bezier(.16,1,.3,1) .55s;
      }
      .hrot.on .hrot-intro { opacity: .88; transform: translateY(0); }

      .hrot-cta {
        margin-top: clamp(1.75rem, 4vw, 2.5rem);
        display: inline-flex; align-items: center; gap: .65rem; width: fit-content;
        text-decoration: none; background: var(--white); color: var(--ink);
        padding: 14px 26px; border-radius: 999px;
        font-size: .95rem; font-weight: 700; letter-spacing: -.01em;
        opacity: 0; transform: translateY(16px);
        transition: opacity .8s ease .68s, transform .8s cubic-bezier(.16,1,.3,1) .68s,
                    background .3s ease, color .3s ease, box-shadow .3s ease;
      }
      .hrot.on .hrot-cta { opacity: 1; transform: translateY(0); }
      .hrot-cta svg { width: 16px; height: 16px; transition: transform .3s cubic-bezier(.16,1,.3,1); }
      .hrot-cta:hover {
        background: var(--orange); color: var(--white);
        box-shadow: 0 14px 32px rgba(255,107,0,.35);
      }
      .hrot-cta:hover svg { transform: translateX(3px); }

      /* ── indicateur de scroll ── */
      .hrot-scroll {
        position: absolute; z-index: 2; left: clamp(1.5rem, 6vw, 5rem); bottom: clamp(1.75rem, 4vw, 2.5rem);
        display: flex; flex-direction: column; align-items: center; gap: .55rem;
        font-size: .65rem; letter-spacing: .28em; text-transform: uppercase; opacity: .7;
      }
      .hrot-scroll i {
        width: 1px; height: 34px; display: block;
        background: linear-gradient(var(--white), transparent);
        animation: hrot-hint 1.8s ease-in-out infinite;
        transform-origin: top;
      }
      @keyframes hrot-hint {
        0% { transform: scaleY(0); opacity: 0; }
        40% { transform: scaleY(1); opacity: 1; }
        100% { transform: scaleY(1); opacity: 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .hrot *, .hrot *::before, .hrot *::after { animation: none !important; transition-duration: .01ms !important; }
        .hrot-letters-out { display: none; }
        .hrot-char { transform: none !important; }
      }
    `}</style>
  );
}