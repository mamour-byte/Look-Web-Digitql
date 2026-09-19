"use client";
import { useEffect, useRef, useState } from "react";

// ─── palette (identique au reste du site) ─────────────────────────────────────
const WHITE = "#ffffff";
const ORANGE = "#ff6b00";
const INK = "#111111";

export type Stat = { value: number; suffix?: string; prefix?: string; label: string };
export type Partner = { name: string; logo?: string };

type Props = {
  /** Ref du conteneur qui scrolle (.icsa-wrap). Si absent → viewport. */
  scrollRef?: React.RefObject<HTMLElement | null>;
  eyebrow?: string;
  title?: string;
  stats?: Stat[];
  partnersLabel?: string;
  partners?: Partner[];
  /** Durée du compteur en ms. */
  duration?: number;
};

const DEFAULT_STATS: Stat[] = [
  { value: 8, suffix: "+", label: "Années d'expérience" },
  { value: 120, suffix: "+", label: "Projets livrés" },
  { value: 45, suffix: "+", label: "Clients accompagnés" },
  { value: 98, suffix: "%", label: "Clients satisfaits" },
];

const DEFAULT_PARTNERS: Partner[] = [
  { name: "Wave" },
  { name: "Orange Money" },
  { name: "Sonatel" },
  { name: "CTIC Dakar" },
  { name: "Delta Santé" },
  { name: "Teranga Capital" },
];

// ─── root export ──────────────────────────────────────────────────────────────
export default function StatsPartners({
  scrollRef,
  eyebrow = "En chiffres",
  title = "La confiance se mesure\ndans la durée.",
  stats = DEFAULT_STATS,
  partnersLabel = "Ils nous font confiance",
  partners = DEFAULT_PARTNERS,
  duration = 1600,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setOn(true),
      { root: scrollRef?.current ?? null, threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scrollRef]);

  return (
    <>
      <StatsPartnersStyles />

      <section ref={sectionRef} className={`fstat${on ? " on" : ""}`}>
        <div className="fstat-inner">
          {/* en-tête */}
          <header className="fstat-head">
            <span className="fstat-eyebrow">
              <i />
              {eyebrow}
            </span>
            <h2 className="fstat-title">
              {title.split("\n").map((line, i) => (
                <span className="fstat-line" key={i}>
                  <span style={{ transitionDelay: `${0.1 + i * 0.1}s` }}>{line}</span>
                </span>
              ))}
            </h2>
          </header>

          {/* stats */}
          <ul className="fstat-grid">
            {stats.map((s, i) => (
              <li key={s.label} className="fstat-item" style={{ transitionDelay: `${0.15 + i * 0.09}s` }}>
                <span className="fstat-value">
                  <Counter target={s.value} run={on} duration={duration} delay={150 + i * 90} />
                  {s.suffix && <b>{s.suffix}</b>}
                </span>
                <span className="fstat-label">{s.label}</span>
              </li>
            ))}
          </ul>

          {/* partenaires */}
          <div className="fstat-partners">
            <span className="fstat-partners-label">{partnersLabel}</span>

            <div className="fstat-marquee" role="list">
              <div className="fstat-marquee-track">
                {[...partners, ...partners].map((p, i) => (
                  <span className="fstat-logo" role="listitem" key={`${p.name}-${i}`}>
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} loading="lazy" />
                    ) : (
                      <span className="fstat-logo-text">{p.name}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Compteur animé — démarre quand `run` passe à true, une seule fois. */
function Counter({
  target,
  run,
  duration,
  delay = 0,
}: {
  target: number;
  run: boolean;
  duration: number;
  delay?: number;
}) {
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!run || done.current) return;
    done.current = true;

    const start = performance.now() + delay;
    let raf = 0;

    const tick = (now: number) => {
      const t = clamp((now - start) / duration);
      const eased = 1 - (1 - t) ** 3; // ease-out cubic
      setVal(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration, delay]);

  return <>{val}</>;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

// ─── styles ───────────────────────────────────────────────────────────────────
function StatsPartnersStyles() {
  return (
    <style>{`
      .fstat, .fstat * { box-sizing: border-box; margin: 0; padding: 0; }

      .fstat {
        --white: ${WHITE};
        --orange: ${ORANGE};
        --ink: ${INK};
        --line: rgba(17,17,17,.10);
        background: var(--white); color: var(--ink);
        font-family: Inter, sans-serif;
        padding: clamp(3.5rem, 7vw, 5rem) clamp(1.25rem, 5vw, 3rem);
      }

      .fstat-inner { max-width: 1120px; margin: 0 auto; }

      /* ── en-tête ── */
      .fstat-head { max-width: 640px; margin-bottom: clamp(2rem, 4vw, 3rem); }

      .fstat-eyebrow {
        display: inline-flex; align-items: center; gap: .6rem;
        font-size: .7rem; font-weight: 600;
        letter-spacing: .26em; text-transform: uppercase;
        color: var(--orange);
        opacity: 0; transform: translateY(14px);
        transition: opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1);
      }
      .fstat-eyebrow i {
        width: 26px; height: 1px; background: var(--orange); display: block;
        transform: scaleX(0); transform-origin: left;
        transition: transform .8s cubic-bezier(.16,1,.3,1) .15s;
      }
      .fstat.on .fstat-eyebrow { opacity: 1; transform: translateY(0); }
      .fstat.on .fstat-eyebrow i { transform: scaleX(1); }

      .fstat-title {
        margin-top: 1.4rem;
        font-size: clamp(1.9rem, 5vw, 3.2rem);
        font-weight: 900; letter-spacing: -.035em; line-height: 1.1;
      }
      .fstat-line { display: block; overflow: hidden; padding-bottom: .06em; }
      .fstat-line > span {
        display: block; transform: translateY(105%);
        transition: transform 1s cubic-bezier(.16,1,.3,1);
      }
      .fstat.on .fstat-line > span { transform: translateY(0); }

      /* ── grille de stats ── */
      .fstat-grid {
        list-style: none;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border-top: 1px solid var(--line);
        border-left: 1px solid var(--line);
      }

      .fstat-item {
        position: relative;
        padding: clamp(1.75rem, 4vw, 2.5rem) clamp(1rem, 2.5vw, 1.5rem);
        border-right: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
        display: flex; flex-direction: column; gap: .6rem;
        opacity: 0; transform: translateY(20px);
        transition: opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1),
                    background .4s ease;
      }
      .fstat.on .fstat-item { opacity: 1; transform: translateY(0); }
      .fstat-item:hover { background: #fff7f1; }

      /* pastille orange qui apparaît au survol, en écho aux autres sections */
      .fstat-item::before {
        content: ""; position: absolute; top: clamp(1.75rem, 4vw, 2.5rem); left: clamp(1rem, 2.5vw, 1.5rem);
        width: 6px; height: 6px; border-radius: 50%; background: var(--orange);
        transform: scale(0); transition: transform .35s cubic-bezier(.16,1,.3,1);
      }
      .fstat-item:hover::before { transform: scale(1); }

      .fstat-value {
        font-size: clamp(2.2rem, 5.5vw, 3.4rem);
        font-weight: 900; letter-spacing: -.03em;
        font-variant-numeric: tabular-nums;
        display: inline-flex; align-items: baseline; gap: .1em;
      }
      .fstat-value b { color: var(--orange); font-size: .55em; font-weight: 800; }

      .fstat-label {
        font-size: .82rem; letter-spacing: .01em; line-height: 1.5;
        opacity: .55; max-width: 160px;
      }

      /* ── partenaires ── */
      .fstat-partners {
        margin-top: clamp(3.5rem, 7vw, 5rem);
        opacity: 0; transform: translateY(18px);
        transition: opacity .8s ease .35s, transform .8s cubic-bezier(.16,1,.3,1) .35s;
      }
      .fstat.on .fstat-partners { opacity: 1; transform: translateY(0); }

      .fstat-partners-label {
        display: block; text-align: center;
        font-size: .72rem; font-weight: 600;
        letter-spacing: .22em; text-transform: uppercase;
        opacity: .45; margin-bottom: clamp(1.75rem, 4vw, 2.5rem);
      }

      /* défilement infini — masqué en fondu sur les bords */
      .fstat-marquee {
        position: relative; overflow: hidden;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
      }

      .fstat-marquee-track {
        display: flex; align-items: center; gap: clamp(2.5rem, 6vw, 4.5rem);
        width: max-content;
        animation: fstat-scroll 28s linear infinite;
      }
      .fstat-marquee:hover .fstat-marquee-track { animation-play-state: paused; }

      @keyframes fstat-scroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      .fstat-logo {
        flex: none; height: 34px;
        display: flex; align-items: center;
        filter: grayscale(1) opacity(.55);
        transition: filter .35s ease, transform .35s ease;
      }
      .fstat-logo:hover { filter: grayscale(0) opacity(1); transform: translateY(-2px); }
      .fstat-logo img { height: 100%; width: auto; object-fit: contain; }
      .fstat-logo-text {
        font-size: 1.05rem; font-weight: 800; letter-spacing: -.01em;
        white-space: nowrap;
      }

      /* ── responsive ── */
      @media (max-width: 860px) {
        .fstat-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 480px) {
        .fstat-grid { grid-template-columns: 1fr; }
        .fstat-item { border-right: 1px solid var(--line); }
      }

      @media (prefers-reduced-motion: reduce) {
        .fstat *, .fstat *::before, .fstat *::after { transition-duration: .01ms !important; }
        .fstat-marquee-track { animation: none; }
      }
    `}</style>
  );
}