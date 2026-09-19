"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── palette (identique au hero) ──────────────────────────────────────────────
const WHITE = "#ffffff";
const ORANGE = "#ff6b00";
const INK = "#111111";

export type NavLink = { label: string; href: string };

type Props = {
  /** Ref du conteneur qui scrolle (.icsa-wrap). Si absent → scroll de la fenêtre. */
  scrollRef?: React.RefObject<HTMLElement | null>;
  logoText?: string;
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  /** Scroll (en multiples de la hauteur d'écran) où la barre passe en blanc. */
  solidAt?: number;
};

const DEFAULT_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/Services" },
  { label: "Réalisation", href: "/realisations" },
  { label: "Contact", href: "/Contact" },
];

// ─── root export ──────────────────────────────────────────────────────────────
export default function Navbar({
  scrollRef,
  logoText = "Look Web Digital",
  links = DEFAULT_LINKS,
  ctaLabel = "Démarrer un projet",
  ctaHref = "/Contact",
  solidAt = 1.55,
}: Props) {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(links[0]?.href ?? "");
  const lastY = useRef(0);

  // état de la barre selon le scroll (conteneur interne ou fenêtre)
  useEffect(() => {
    const el = scrollRef?.current ?? null;
    const getY = () => (el ? el.scrollTop : window.scrollY);
    const getH = () => (el ? el.clientHeight : window.innerHeight);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = getY();
        const h = getH();
        setSolid(y > h * solidAt);
        // auto-hide : on masque en descendant, on révèle en remontant
        setHidden(y > h * 0.9 && y > lastY.current + 4);
        lastY.current = y;
        ticking = false;
      });
    };

    const target: HTMLElement | Window = el ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollRef, solidAt]);

  // fermeture du menu mobile : Échap + verrouillage du scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const go = (href: string) => {
    setActive(href);
    setOpen(false);
  };

  return (
    <>
      <NavStyles />

      <header
        className={[
          "fnav",
          solid ? "is-solid" : "",
          hidden && !open ? "is-hidden" : "",
          open ? "is-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="fnav-bar">
          {/* logo */}
          <Link className="fnav-logo" href="/" onClick={() => go("/")} aria-label={logoText}>
            <img src="./logos/logo-lwd.png" alt="" width="60" height="60" />
            <span className="fnav-word">
              {/* {logoText} */}
              <b>.</b>
            </span>
          </Link>

          {/* liens desktop */}
          <nav className="fnav-links" aria-label="Navigation principale">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`fnav-link${active === l.href ? " is-active" : ""}`}
                onClick={() => go(l.href)}
              >
                <span className="fnav-link-txt">
                  <span className="fnav-link-a">{l.label}</span>
                  <span className="fnav-link-b" aria-hidden>
                    {l.label}
                  </span>
                </span>
              </a>
            ))}
          </nav>

          {/* actions */}
          <div className="fnav-actions">
            <a className="fnav-cta" href={ctaHref} onClick={() => go(ctaHref)}>
              <span>{ctaLabel}</span>
            </a>

            <button
              className={`fnav-burger${open ? " is-x" : ""}`}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
            >
              <i />
              <i />
            </button>
          </div>
        </div>

        {/* filet de progression sous la barre */}
        <span className="fnav-rule" />
      </header>

      {/* panneau mobile plein écran */}
      <div className={`fnav-panel${open ? " is-open" : ""}`} role="dialog" aria-modal="true">
        <nav className="fnav-panel-links">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => go(l.href)}
              style={{ transitionDelay: `${0.12 + i * 0.07}s` }}
            >
              <em>{String(i + 1).padStart(2, "0")}</em>
              <span>{l.label}</span>
            </a>
          ))}
        </nav>

        <a
          className="fnav-panel-cta"
          href={ctaHref}
          onClick={() => go(ctaHref)}
          style={{ transitionDelay: `${0.12 + links.length * 0.07}s` }}
        >
          {ctaLabel}
        </a>

        <div className="fnav-panel-foot" style={{ transitionDelay: `${0.2 + links.length * 0.07}s` }}>
          <span>Dakar — Sénégal</span>
          <span>lookwebdigital@gmail.com</span>
        </div>
      </div>
    </>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
function NavStyles() {
  return (
    <style>{`
      .fnav, .fnav *, .fnav-panel, .fnav-panel * {
        box-sizing: border-box; margin: 0; padding: 0;
      }

      .fnav {
        --white: ${WHITE};
        --orange: ${ORANGE};
        --ink: ${INK};
        position: fixed; top: 0; left: 0; right: 0;
        z-index: 60;
        font-family: Inter, sans-serif;
        color: var(--orange);
        background: rgba(255,255,255,.88);
        backdrop-filter: saturate(160%) blur(14px);
        -webkit-backdrop-filter: saturate(160%) blur(14px);
        transition: transform .55s cubic-bezier(.16,1,.3,1),
                    background .6s cubic-bezier(.25,0,.1,1),
                    backdrop-filter .6s ease,
                    color .6s cubic-bezier(.25,0,.1,1);
        transform: translateY(0);
      }
      .fnav.is-hidden { transform: translateY(-101%); }

      /* état "posé sur le blanc" */
      .fnav.is-solid {
        color: var(--orange);
        background: rgba(255,255,255,.92);
        backdrop-filter: saturate(160%) blur(14px);
        -webkit-backdrop-filter: saturate(160%) blur(14px);
      }
      .fnav.is-open { color: var(--orange); background: rgba(255,255,255,.96); }

      .fnav-bar {
        max-width: 1280px; margin: 0 auto;
        height: 76px; padding: 0 clamp(1.25rem, 4vw, 3rem);
        display: flex; align-items: center; justify-content: space-between;
        gap: 2rem;
      }

      .fnav-rule {
        display: block; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(17,17,17,.12) 15%, rgba(17,17,17,.12) 85%, transparent);
        opacity: 0; transition: opacity .6s ease;
      }
      .fnav.is-solid .fnav-rule { opacity: 1; }

      /* ── logo ── */
      .fnav-logo {
        display: inline-flex; align-items: center; gap: .65rem;
        text-decoration: none; color: inherit;
        font-weight: 900; letter-spacing: -.03em; font-size: 1.22rem;
      }
      .fnav-mark {
        width: 30px; height: 30px; border-radius: 50%;
        background: var(--orange);
        display: grid; place-items: center;
        position: relative; overflow: hidden;
        transition: transform .5s cubic-bezier(.16,1,.3,1);
        box-shadow: 0 6px 18px rgba(255,107,0,.35);
      }
      /* le point blanc rappelle le cercle qui monte dans le hero */
      .fnav-mark i {
        width: 10px; height: 10px; border-radius: 50%;
        background: var(--white); display: block;
        transition: transform .55s cubic-bezier(.16,1,.3,1);
      }
      .fnav-logo:hover .fnav-mark { transform: rotate(-12deg); }
      .fnav-logo:hover .fnav-mark i { transform: scale(2.4); }
      .fnav-word b { color: var(--orange); }

      /* ── liens desktop ── */
      .fnav-links { display: flex; align-items: center; gap: .35rem; }
      .fnav-link {
        position: relative;
        padding: .55rem .95rem;
        text-decoration: none; color: inherit;
        font-size: .9rem; font-weight: 600; letter-spacing: -.01em;
      }
      /* roulement vertical du libellé au survol */
      .fnav-link-txt {
        position: relative; display: block; overflow: hidden;
        height: 1.25em;
      }
      .fnav-link-a, .fnav-link-b {
        display: block;
        transition: transform .48s cubic-bezier(.16,1,.3,1);
      }
      .fnav-link-b { position: absolute; top: 0; left: 0; color: var(--orange); transform: translateY(105%); }
      .fnav-link:hover .fnav-link-a { transform: translateY(-105%); }
      .fnav-link:hover .fnav-link-b { transform: translateY(0); }

      /* pastille d'état actif */
      .fnav-link::after {
        content: ""; position: absolute;
        left: 50%; bottom: .05rem;
        width: 4px; height: 4px; border-radius: 50%;
        background: var(--orange);
        transform: translate(-50%, 6px) scale(0);
        transition: transform .4s cubic-bezier(.16,1,.3,1);
      }
      .fnav-link.is-active::after { transform: translate(-50%, 0) scale(1); }

      /* ── actions ── */
      .fnav-actions { display: flex; align-items: center; gap: .75rem; }

      .fnav-cta {
        position: relative; overflow: hidden;
        display: inline-block; text-decoration: none;
        padding: 11px 24px; border-radius: 999px;
        background: var(--orange); color: var(--white);
        font-size: .85rem; font-weight: 600; letter-spacing: -.005em;
        box-shadow: 0 8px 22px rgba(255,107,0,.26);
        transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease;
      }
      .fnav-cta span { position: relative; z-index: 1; }
      .fnav-cta::after {
        content: ""; position: absolute; inset: 0;
        background: var(--ink);
        transform: translateY(101%);
        transition: transform .45s cubic-bezier(.16,1,.3,1);
      }
      .fnav-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(255,107,0,.34); }
      .fnav-cta:hover::after { transform: translateY(0); }

      /* ── burger ── */
      .fnav-burger {
        display: none;
        width: 44px; height: 44px; border: none; border-radius: 50%;
        background: transparent; cursor: pointer;
        position: relative; z-index: 70;
        align-items: center; justify-content: center;
        flex-direction: column; gap: 6px;
      }
      .fnav-burger i {
        display: block; width: 20px; height: 2px; border-radius: 2px;
        background: currentColor;
        transition: transform .45s cubic-bezier(.16,1,.3,1), width .45s ease;
      }
      .fnav-burger:hover i:last-child { width: 13px; }
      .fnav-burger.is-x i:first-child { transform: translateY(4px) rotate(45deg); }
      .fnav-burger.is-x i:last-child  { transform: translateY(-4px) rotate(-45deg); width: 20px; }

      /* ── panneau mobile ── */
      .fnav-panel {
        position: fixed; inset: 0; z-index: 55;
        background: rgba(255,255,255,.97);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        font-family: Inter, sans-serif; color: ${ORANGE};
        display: flex; flex-direction: column;
        justify-content: center; gap: 2.5rem;
        padding: 6rem clamp(1.5rem, 8vw, 4rem) 3rem;
        clip-path: circle(0% at calc(100% - 46px) 38px);
        transition: clip-path .75s cubic-bezier(.76,0,.24,1);
        pointer-events: none;
      }
      .fnav-panel.is-open {
        clip-path: circle(150% at calc(100% - 46px) 38px);
        pointer-events: auto;
      }

      .fnav-panel-links { display: flex; flex-direction: column; }
      .fnav-panel-links a {
        display: flex; align-items: baseline; gap: 1rem;
        text-decoration: none; color: inherit;
        padding: .5rem 0;
        font-size: clamp(2rem, 9vw, 3.4rem);
        font-weight: 900; letter-spacing: -.04em; line-height: 1.12;
        opacity: 0; transform: translateY(26px);
        transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1);
      }
      .fnav-panel.is-open .fnav-panel-links a { opacity: 1; transform: translateY(0); }
      .fnav-panel-links em {
        font-style: normal; font-size: .75rem; font-weight: 600;
        letter-spacing: .2em; opacity: .55;
      }
      .fnav-panel-links a:active span { opacity: .6; }

      .fnav-panel-cta {
        align-self: flex-start;
        text-decoration: none;
        background: ${ORANGE}; color: ${WHITE};
        padding: 14px 32px; border-radius: 999px;
        font-weight: 700; font-size: .95rem;
        opacity: 0; transform: translateY(26px);
        transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1);
      }
      .fnav-panel.is-open .fnav-panel-cta { opacity: 1; transform: translateY(0); }

      .fnav-panel-foot {
        display: flex; flex-direction: column; gap: .25rem;
        font-size: .75rem; letter-spacing: .08em; text-transform: uppercase;
        opacity: 0; transform: translateY(20px);
        transition: opacity .6s ease, transform .6s ease;
      }
      .fnav-panel.is-open .fnav-panel-foot { opacity: .7; transform: translateY(0); }

      /* ── responsive ── */
      @media (max-width: 900px) {
        .fnav-links { display: none; }
        .fnav-cta { display: none; }
        .fnav-burger { display: flex; }
        .fnav-bar { height: 68px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .fnav, .fnav *, .fnav-panel, .fnav-panel * { transition-duration: .01ms !important; }
      }
    `}</style>
  );
}