"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── palette (identique au reste du site) ─────────────────────────────────────
const WHITE = "#ffffff";
const ORANGE = "#ff6b00";
const INK = "#111111";

export type Decor = {
  name: string;
  video: string;
  address: string;
  addressHref?: string;
  capacity: number;
};

type Props = {
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
  decors?: Decor[];
  /** Délai avant passage automatique au décor suivant, en ms. */
  autoPlayDelay?: number;
};

const DEFAULT_DECORS: Decor[] = [
  {
    name: "Identité visuelle",
    video: "/videos/paysage.mp4",
    address: "12 rue des Ateliers, Dakar",
    addressHref: "#",
    capacity: 2,
  },
  {
    name: "Production vidéo",
    video: "/videos/plage.mp4",
    address: "12 rue des Ateliers, Dakar",
    addressHref: "#",
    capacity: 3,
  },
  {
    name: "Web & Digital",
    video: "/videos/mer.mp4",
    address: "Almadies, Dakar",
    addressHref: "#",
    capacity: 4,
  },
];

// ─── root export ──────────────────────────────────────────────────────────────
export default function StudioDecors({
  eyebrow = "Nos savoir-faire",
  ctaLabel = "Démarrer mon projet",
  ctaHref = "/Contact",
  decors = DEFAULT_DECORS,
  autoPlayDelay = 10000,
}: Props) {
  const count = decors.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (next: number, direction: 1 | -1) => {
      setDir(direction);
      setIndex((next + count) % count);
    },
    [count],
  );

  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);

  // Passage automatique régulier au décor suivant.
  useEffect(() => {
    if (count <= 1) return;
    autoTimer.current = setTimeout(() => goTo(index + 1, 1), autoPlayDelay);
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [index, autoPlayDelay, count, goTo]);

  // ne joue que la vidéo active — les autres restent en pause pour économiser la bande passante
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) v.play().catch(() => {});
      else v.pause();
    });
  }, [index]);

  const d = decors[index];

  return (
    <>
      <StudioStyles />

      <section
        id="studios"
        className="sdec on"
      >
        {/* pile vidéo en fondu croisé */}
        <div className="sdec-stage">
          {decors.map((dec, i) => (
            <video
              key={dec.video}
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              className={`sdec-video${i === index ? " is-active" : ""}`}
              src={dec.video}
              muted
              loop
              playsInline
              preload={i === index ? "auto" : "metadata"}
            />
          ))}
          <div className="sdec-veil" />
        </div>

        {/* carrousel de décors, centré en haut */}
        <div className="sdec-picker">
          {/* <span className="sdec-badge">{eyebrow}</span> */}

          <div className="sdec-row">
            <button className="sdec-arrow" onClick={prev} aria-label="Décor précédent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="sdec-name-mask">
              <span className="sdec-name-plate" aria-hidden />
              <span className={`sdec-name sdec-dir-${dir}`} key={index}>
                {d.name}
              </span>
            </div>

            <button className="sdec-arrow" onClick={next} aria-label="Décor suivant">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* <div className="sdec-dots" role="tablist">
            {decors.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Décor ${i + 1}`}
                className={`sdec-dot${i === index ? " is-active" : ""}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
              >
                <i style={{ animationDuration: i === index ? `${autoPlayDelay}ms` : undefined }} />
              </button>
            ))}
          </div> */}

          <a className="sdec-cta" href={ctaHref}>
            <span>{ctaLabel}</span>
          </a>
        </div>

        {/* barre inférieure : adresse + capacité */}
        {/* <div className="sdec-bottom">
          <a className="sdec-pill sdec-address" href={d.addressHref} target="_blank" rel="noreferrer">
            <span key={`addr-${index}`} className={`sdec-fade sdec-dir-${dir}`}>
              {d.address}
            </span>
          </a>

          <div className="sdec-pill sdec-capacity">
            <span className="sdec-avatars" aria-hidden>
              {Array.from({ length: Math.min(d.capacity, 4) }).map((_, i) => (
                <i key={i} style={{ zIndex: 4 - i }} />
              ))}
            </span>
            <span key={`cap-${index}`} className={`sdec-fade sdec-dir-${dir}`}>
              Jusqu'à {d.capacity} personnes
            </span>
          </div>
        </div> */}
      </section>
    </>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
function StudioStyles() {
  return (
    <style>{`
      .sdec, .sdec * { box-sizing: border-box; margin: 0; padding: 0; }

      .sdec {
        --white: ${WHITE};
        --orange: ${ORANGE};
        --ink: ${INK};
        position: relative; width: 100%; height: 100svh; min-height: 560px;
        overflow: hidden; border-radius: 0;
        background: var(--ink); color: var(--white);
        font-family: Inter, sans-serif;
        opacity: 0; transition: opacity .3s ease;
      }
      .sdec.on { opacity: 1; }

      /* ── vidéo en fondu croisé ── */
      .sdec-stage {
        position: absolute; inset: 0;
        overflow: hidden;
      }
      .sdec-video {
        position: absolute; inset: 0; width: 100%; height: 100%;
        object-fit: cover; opacity: 0;
        transition: opacity .3s ease;
      }
      .sdec-video.is-active { opacity: 1; }

      .sdec-veil {
        position: absolute; inset: 0;
        background:
          linear-gradient(180deg, rgba(255,107,0,.32) 0%, rgba(255,107,0,.18) 48%, rgba(20,8,0,.38) 100%),
          rgba(255,107,0,.10);
        pointer-events: none;
      }

      /* ── sélecteur de décor ── */
      .sdec-picker {
        position: absolute; z-index: 2; inset: 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.4rem;
        pointer-events: none;
      }

      .sdec-badge {
        padding: 8px 18px; border-radius: 999px;
        background: rgba(255,255,255,.12);
        backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
        font-size: .78rem; font-weight: 600; letter-spacing: .02em;
      }

      .sdec-row { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; }

      .sdec-arrow {
        position: absolute; top: 50%; z-index: 4;
        width: 52px; height: 52px; flex: none; border-radius: 999px;
        border: none; cursor: pointer;
        background: rgba(255,255,255,.18);
        backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
        color: var(--white);
        display: grid; place-items: center;
        opacity: 0; pointer-events: auto;
        transition: opacity .3s ease, background .3s ease, transform .3s cubic-bezier(.16,1,.3,1);
      }
      .sdec-arrow:first-child { left: clamp(1rem, 3vw, 2.5rem); transform: translateY(-50%); }
      .sdec-arrow:last-child { right: clamp(1rem, 3vw, 2.5rem); transform: translateY(-50%); }
      .sdec:hover .sdec-arrow,
      .sdec:focus-within .sdec-arrow { opacity: 1; }
      .sdec-arrow svg { width: 18px; height: 18px; }
      .sdec-arrow:hover { background: var(--orange); transform: translateY(-50%) scale(1.06); }
      .sdec-arrow:active { transform: translateY(-50%) scale(.94); }

      .sdec-name-mask {
        position: relative; overflow: hidden;
        width: min(70vw, 520px); min-height: 1.3em; height: auto;
        display: flex; align-items: center; justify-content: center;
        mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
      }
      .sdec-name {
        max-width: 100%;
        font-size: clamp(1.8rem, 5vw, 3.4rem);
        font-weight: 800; letter-spacing: -.03em; text-align: center; white-space: normal;
        animation: sdec-swap .5s cubic-bezier(.16,1,.3,1);
      }
      .sdec-name.sdec-dir-1  { animation-name: sdec-swap-r; }
      .sdec-name.sdec-dir--1 { animation-name: sdec-swap-l; }
      @keyframes sdec-swap-r { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes sdec-swap-l { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); } }

      /* ── bouton de réservation ── */
      .sdec-cta {
        position: relative; overflow: hidden;
        text-decoration: none; display: inline-block;
        background: var(--orange); color: var(--white);
        padding: 13px 28px; border-radius: 999px;
        font-size: .88rem; font-weight: 700; letter-spacing: -.01em;
        box-shadow: 0 10px 26px rgba(255,107,0,.35);
        transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease;
        pointer-events: auto;
      }
      .sdec-cta span { position: relative; z-index: 1; }
      .sdec-cta::after {
        content: ""; position: absolute; inset: 0;
        background: var(--ink);
        transform: translateY(101%);
        transition: transform .45s cubic-bezier(.16,1,.3,1);
      }
      .sdec-cta:hover { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(255,107,0,.42); }
      .sdec-cta:hover::after { transform: translateY(0); }

      .sdec-dots {
        display: flex; align-items: center; gap: .55rem;
        pointer-events: auto;
      }
      .sdec-dot {
        width: 30px; height: 4px; padding: 0;
        border: 0; border-radius: 999px; overflow: hidden;
        background: rgba(255,255,255,.28); cursor: pointer;
      }
      .sdec-dot i {
        display: block; width: 0; height: 100%;
        background: var(--white); border-radius: inherit;
      }
      .sdec-dot.is-active i { width: 100%; animation: sdec-progress linear forwards; }
      @keyframes sdec-progress { from { width: 0; } to { width: 100%; } }

      /* ── barre inférieure ── */
      .sdec-bottom {
        position: absolute; z-index: 2; left: 0; right: 0; bottom: 0;
        display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        padding: clamp(1.25rem, 3vw, 1.75rem);
        background: linear-gradient(180deg, transparent, rgba(0,0,0,.4) 100%);
      }

      .sdec-pill {
        display: inline-flex; align-items: center; gap: .6rem;
        height: 46px; padding: 0 1.1rem; border-radius: 999px;
        background: rgba(255,255,255,.12);
        backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
        color: var(--white); text-decoration: none;
        font-size: .82rem; font-weight: 500;
        transition: background .3s ease;
      }
      .sdec-address:hover { background: rgba(255,255,255,.2); }

      .sdec-fade { display: inline-block; animation: sdec-fade-in .4s ease; }
      @keyframes sdec-fade-in { from { opacity: 0; } to { opacity: 1; } }

      .sdec-avatars { display: flex; align-items: center; }
      .sdec-avatars i {
        width: 20px; height: 20px; border-radius: 50%;
        background: var(--orange); border: 2px solid var(--ink);
        margin-left: -8px; display: block;
      }
      .sdec-avatars i:first-child { margin-left: 0; }

      /* ── responsive ── */
      @media (max-width: 640px) {
        .sdec { height: 100svh; min-height: 560px; }
        .sdec-bottom { flex-direction: column; align-items: stretch; }
        .sdec-pill { justify-content: center; }
      }

      @media (prefers-reduced-motion: reduce) {
        .sdec *, .sdec *::before, .sdec *::after { animation: none !important; transition-duration: .01ms !important; }
      }
    `}</style>
  );
}