"use client";
import { useEffect, useRef, useState } from "react";
import { Fragment } from "react";
import { AboutSection } from "./About";
import { useMedia } from "@/lib/useMedia";
import { optimizeVideoUrl } from "@/lib/media";

// ─── constants ────────────────────────────────────────────────────────────────
const BALL_SIZE = 380; // px — diamètre fixe pendant le trajet Phase 1

// Palette (modifiable ici uniquement)
const WHITE = "#ffffff";
const ORANGE = "#ff6b00";

type Props = {
  /** Fichier vidéo (mp4 h264 recommandé, muet, bouclé). */
  videoSrc?: string;
  /** Image affichée avant le chargement de la vidéo. */
  poster?: string;
};

// ─── root export ──────────────────────────────────────────────────────────────
export default function InversionCircleScrollAnimation({
  videoSrc = "../../videos/stade.mp4",
  poster = "../../images/paysage.jpg",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // La vidéo de couverture vient de Cloudinary (collection "scroll") ;
  // le poster et la section About restent en images locales statiques.
  const { assets } = useMedia("scroll");
  const cloudVideo = assets.find((a) => a.resourceType === "video");
  const resolvedVideo = cloudVideo ? optimizeVideoUrl(cloudVideo.url) : videoSrc;

  return (
    <>
      <Styles />
      <div ref={wrapperRef} id="top" className="icsa-wrap">
        <HeroSection wrapperRef={wrapperRef} videoSrc={resolvedVideo} poster={poster} />
        <ContentSection wrapperRef={wrapperRef} />
      </div>
    </>
  );
}

// ─── HeroSection ──────────────────────────────────────────────────────────────
type WRef = React.RefObject<HTMLDivElement | null>;

function HeroSection({
  wrapperRef,
  videoSrc,
  poster,
}: {
  wrapperRef: WRef;
  videoSrc: string;
  poster: string;
}) {
  const [scrollY, setScrollY] = useState(0);
  const [viewH, setViewH] = useState(600);
  const [viewW, setViewW] = useState(800);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const measure = () => {
      setViewH(el.clientHeight);
      setViewW(el.clientWidth);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // rAF throttle → scroll parfaitement fluide même sur mobile
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrollY(el.scrollTop);
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, [wrapperRef]);

  // progression des phases 0 → 1
  const p1 = clamp(scrollY / viewH);
  const p2 = clamp((scrollY - viewH) / viewH);

  // Power4 InOut
  const p1e = p1 < 0.5 ? 8 * p1 ** 4 : 1 - (-2 * p1 + 2) ** 4 / 2;
  // ease-in²
  const p2e = p2 * p2;

  // géométrie
  const yOff = (1 - p1e) * (viewH / 2 + BALL_SIZE / 2);
  const coverSize = Math.max(viewW, viewH) * 2.8;
  const ballSize = BALL_SIZE + p2e * (coverSize - BALL_SIZE);
  const clipX = viewW / 2;
  const clipY = viewH / 2 + yOff;
  const clipR = ballSize / 2;

  // vidéo : léger dézoom pendant la phase 1, puis flou/assombrissement en phase 2
  const videoScale = 1.14 - 0.14 * p1e;
  const videoBlur = p2e * 6;
  const veilOpacity = 0.55 + p2e * 0.35;

  return (
    <div className="icsa-track">
      <section className="icsa-hero">
        {/* vidéo d'arrière-plan */}
        <div className="icsa-video-layer">
          <video
            className="icsa-video"
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              transform: `translate(-50%, -50%) scale(${videoScale})`,
              filter: `blur(${videoBlur}px)`,
            }}
          />
          {/* voile subtil : lisibilité du texte sans tuer l'image */}
          <div className="icsa-veil" style={{ opacity: veilOpacity }} />
          <div className="icsa-tint" />
          <div className="icsa-grain" />
        </div>

        {/* cercle blanc qui monte puis recouvre l'écran */}
        <div
          className="icsa-ball"
          style={{
            width: ballSize,
            height: ballSize,
            transform: `translate(-50%, calc(-50% + ${yOff}px))`,
          }}
        />

        {/* texte blanc — sur la vidéo */}
        <div className="icsa-layer icsa-on-video">
          <HeroCopy />
        </div>

        {/* texte orange — découpé au cercle (inversion) */}
        <div
          className="icsa-layer icsa-on-ball"
          style={{ clipPath: `circle(${clipR}px at ${clipX}px ${clipY}px)` }}
        >
          <HeroCopy />
        </div>

        {/* indicateur de scroll */}
        <div className="icsa-scroll-hint" style={{ opacity: 1 - clamp(p1 * 3) }}>
          <span>Scroll</span>
          <i />
        </div>
      </section>
    </div>
  );
}

/** Contenu du hero — rendu deux fois à l'identique pour que le clip s'aligne. */
function HeroCopy() {
  return (
    <>
      <Reveal as="span" className="icsa-eyebrow" text="Agence web & digitale" delay={0.1} step={0.05} />
      <Reveal as="h1" text="De l'idée à l'impact." delay={0.28} step={0.09} />
      <Reveal as="p" text="Nous rendons votre marque visible." delay={0.62} step={0.045} />
    </>
  );
}

/**
 * Révélation mot par mot : masque + montée + flou + stagger.
 * 100 % CSS (animation-delay) → strictement identique dans les deux calques.
 */
function Reveal({
  text,
  as = "span",
  className = "",
  delay = 0,
  step = 0.07,
}: {
  text: string;
  as?: "h1" | "p" | "span";
  className?: string;
  delay?: number;
  step?: number;
}) {
  const Tag = as as React.ElementType;
  const words = text.split(" ");
  return (
    <Tag className={`icsa-reveal ${className}`}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="icsa-word">
            <span className="icsa-word-in" style={{ animationDelay: `${delay + i * step}s` }}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

// ─── ContentSection ───────────────────────────────────────────────────────────
function ContentSection({ wrapperRef }: { wrapperRef: WRef }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const root = wrapperRef.current;
    if (!el || !root) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setOn(true);
      },
      { root, threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [wrapperRef]);

  return (
    // <section ref={ref} className={`icsa-cs${on ? " on" : ""}`}>
    //   <div className="icsa-inner">
    //     <span className="icsa-label">What comes next</span>
    //     <h2>
    //       Build with intention.
    //       <br />
    //       Ship with confidence.
    //     </h2>
    //     <p>
    //       Every great product starts with a clear vision and a simple idea. From a blank canvas to
    //       something remarkable — the only thing between you and it is the work.
    //     </p>
    //     <CTAButton />
    //   </div>
    // </section>
    <div className="w-full">
      <AboutSection
        logo={{
            url: "./logos/logo-lwd.png",
            alt: "Company Logo",
            text: "Look Web Digital"
        }}
        slogan=""
        title={
          <>
            Look Web digital  <br />
            <span className="text-primary">Qui Sommes-nous ? </span>
          </>
        }
        subtitle="
            Née à Dakar, Look Web Digital accompagne les entreprises, marques et entrepreneurs
            d'Afrique de l'Ouest et d'ailleurs dans leur transformation digitale. Identité visuelle,
            sites web sur mesure, production audiovisuelle et marketing digital : nous réunissons
            créativité, technologie et stratégie pour construire des communications qui ne passent
            pas inaperçues — et qui génèrent des résultats mesurables.
        "
        callToAction={{
          text: "Voir nos services",
          href: "#explore",
        }}
        backgroundImage="./images/paysage.jpg"
        contactInfo={{
            website: "yourwebsite.com",
            phone: "+1 (555) 123-4567",
            address: "20 Fieldstone Dr, Roswell, GA",
        }}
      />
    </div>
  );
}


// ─── helpers ──────────────────────────────────────────────────────────────────
const clamp = (v: number) => Math.min(1, Math.max(0, v));

// ─── styles ───────────────────────────────────────────────────────────────────
function Styles() {
  return (
    <style>{`
      .icsa-wrap {
        --white:  ${WHITE};
        --orange: ${ORANGE};
      }

      .icsa-wrap .icsa-track,
      .icsa-wrap .icsa-track *,
      .icsa-wrap .icsa-track *::before,
      .icsa-wrap .icsa-track *::after {
        box-sizing: border-box; margin: 0; padding: 0;
      }

      /* ── conteneur de scroll ───────────────────────────────────────────
         overflow-y:scroll  → contexte de scroll propre; sticky fonctionne
         overflow-x:clip    → clip sûr (contrairement à hidden)
      ─────────────────────────────────────────────────────────────────── */
      .icsa-wrap {
        width: 100%; height: 100vh;
        overflow-y: scroll; overflow-x: clip;
        font-family: Inter, sans-serif;
        background: var(--white);
        scroll-behavior: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .icsa-wrap::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }

      /* 300 vh de course; le hero reste collé */
      .icsa-track { height: 300vh; position: relative; }

      .icsa-hero {
        position: sticky; top: 0;
        height: 100vh; overflow: hidden;
        background: #0a0a0a;
      }

      /* ── vidéo ── */
      .icsa-video-layer { position: absolute; inset: 0; z-index: 0; overflow: hidden; }

      .icsa-video {
        position: absolute; top: 50%; left: 50%;
        min-width: 100%; min-height: 100%;
        width: auto; height: auto;
        object-fit: cover;
        will-change: transform, filter;
      }

      /* voile sombre — assez subtil pour laisser vivre l'image */
      .icsa-veil {
        position: absolute; inset: 0;
        background:
          radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,.20) 0%, rgba(0,0,0,.60) 100%),
          linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.15) 45%, rgba(0,0,0,.65) 100%);
      }

      /* teinte orange très légère pour raccrocher la vidéo à la marque */
      .icsa-tint {
        position: absolute; inset: 0;
        background: linear-gradient(160deg, rgba(255,107,0,.16) 0%, transparent 55%, rgba(255,107,0,.10) 100%);
        mix-blend-mode: overlay;
      }

      /* grain fin */
      .icsa-grain {
        position: absolute; inset: -50%;
        opacity: .10; pointer-events: none;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>");
        animation: icsa-grain 8s steps(6) infinite;
      }
      @keyframes icsa-grain {
        0%,100% { transform: translate(0,0) }
        20% { transform: translate(-3%, 2%) }
        40% { transform: translate(2%, -3%) }
        60% { transform: translate(-2%, -2%) }
        80% { transform: translate(3%, 1%) }
      }

      /* ── cercle (blanc) ── */
      .icsa-ball {
        position: absolute; top: 50%; left: 50%;
        border-radius: 50%; background: var(--white);
        opacity: .65;
        z-index: 1;
        box-shadow: 0 30px 120px rgba(255,107,0,.25);
        will-change: transform, width, height;
      }

      /* ── calques de texte ── */
      .icsa-layer {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 1.25rem;
        text-align: center; padding: 0 2rem;
        pointer-events: none;
      }
      .icsa-on-video { color: var(--white); z-index: 2; }
      .icsa-on-ball  { color: var(--orange); z-index: 3; will-change: clip-path; }

      .icsa-layer h1 {
        font-size: clamp(2.5rem, 7vw, 6rem);
        font-weight: 900; letter-spacing: -0.035em; line-height: 1.05;
      }
      .icsa-layer p {
        font-size: clamp(1rem, 2.5vw, 1.5rem);
        font-weight: 400; margin-top: 0; opacity: .78;
      }
      .icsa-eyebrow {
        font-size: .7rem; font-weight: 600;
        letter-spacing: .28em; text-transform: uppercase;
        margin-bottom: 0; opacity: .7;
      }
      /* le calque orange prend un accent : le eyebrow reste orange plein */
      .icsa-on-ball .icsa-eyebrow { opacity: .85; }

      /* ── révélation premium mot par mot ── */
      .icsa-reveal { display: block; }
      .icsa-word {
        display: inline-block; overflow: hidden;
        vertical-align: bottom;
        padding: 0 .06em .14em;
      }
      .icsa-word-in {
        display: inline-block;
        opacity: 0;
        transform: translateY(105%) rotate(4deg);
        filter: blur(6px);
        animation: icsa-rise 1.15s cubic-bezier(.16,1,.3,1) forwards;
      }
      @keyframes icsa-rise {
        to { opacity: 1; transform: translateY(0) rotate(0); filter: blur(0); }
      }

      /* ── indicateur de scroll ── */
      .icsa-scroll-hint {
        position: absolute; bottom: 2.25rem; left: 50%;
        transform: translateX(-50%);
        z-index: 4; color: var(--white);
        display: flex; flex-direction: column; align-items: center; gap: .6rem;
        font-size: .65rem; letter-spacing: .3em; text-transform: uppercase;
        opacity: .75; pointer-events: none;
        transition: opacity .3s ease;
      }
      .icsa-scroll-hint i {
        width: 1px; height: 38px; display: block;
        background: linear-gradient(var(--white), transparent);
        animation: icsa-hint 1.8s ease-in-out infinite;
        transform-origin: top;
      }
      @keyframes icsa-hint {
        0%   { transform: scaleY(0);   opacity: 0 }
        40%  { transform: scaleY(1);   opacity: 1 }
        100% { transform: scaleY(1);   opacity: 0 }
      }

      /* ── section de contenu : orange → blanc ── */
      .icsa-cs {
        min-height: 100vh;
        display: flex; align-items: center; justify-content: center;
        padding: 6rem 2rem;
        background: var(--orange); color: var(--white);
        transition: background 2.4s cubic-bezier(.25,0,.1,1),
                    color      2.4s cubic-bezier(.25,0,.1,1);
      }
      .icsa-cs.on { background: var(--white); color: #111; }

      .icsa-inner {
        max-width: 720px; text-align: center;
        display: flex; flex-direction: column;
        align-items: center; gap: 1.75rem;
      }

      .icsa-inner > * {
        opacity: 0; transform: translateY(24px);
        transition: opacity .7s ease, transform .7s ease;
      }
      .icsa-cs.on .icsa-inner > * { opacity: 1; transform: translateY(0); }

      .icsa-cs.on .icsa-label { transition-delay: .10s; }
      .icsa-cs.on h2          { transition-delay: .24s; }
      .icsa-cs.on p           { transition-delay: .38s; }
      .icsa-cs.on .icsa-btn   { transition-delay: .52s; }

      .icsa-label {
        font-size: .75rem; font-weight: 600;
        letter-spacing: .18em; text-transform: uppercase;
        color: var(--orange); opacity: 0;
      }
      .icsa-cs.on .icsa-label { opacity: .8; }
      .icsa-inner h2 {
        font-size: clamp(2rem, 6vw, 4rem);
        font-weight: 900; letter-spacing: -.03em; line-height: 1.08;
      }
      .icsa-inner p {
        font-size: clamp(1rem, 2vw, 1.2rem);
        line-height: 1.75; opacity: .65; max-width: 560px;
      }

      /* ── bouton ── */
      .icsa-btn {
        position: relative; overflow: hidden;
        background: var(--orange); color: var(--white);
        padding: 14px 34px; border-radius: 999px; border: none;
        cursor: pointer; font-family: Inter, sans-serif;
        font-size: 1rem; font-weight: 600; letter-spacing: .01em;
        transition: transform .25s cubic-bezier(.16,1,.3,1),
                    box-shadow .25s ease;
        box-shadow: 0 8px 24px rgba(255,107,0,.28);
      }
      .icsa-btn span { position: relative; z-index: 1; }
      .icsa-btn::after {
        content: ""; position: absolute; inset: 0;
        background: #111; transform: translateY(101%);
        transition: transform .4s cubic-bezier(.16,1,.3,1);
      }
      .icsa-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(255,107,0,.34); }
      .icsa-btn:hover::after { transform: translateY(0); }
      .icsa-btn:active { transform: translateY(0); }

      /* ── accessibilité ── */
      @media (prefers-reduced-motion: reduce) {
        .icsa-word-in { animation: none; opacity: 1; transform: none; filter: none; }
        .icsa-grain, .icsa-scroll-hint i { animation: none; }
        .icsa-video { display: none; }
      }
    `}</style>
  );
}