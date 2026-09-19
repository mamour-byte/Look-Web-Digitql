"use client";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// ─── palette (identique au reste du site) ─────────────────────────────────────
const WHITE = "#ffffff";
const ORANGE = "#ff6b00";
const INK = "#111111";

export type ContactDetail = { icon: "mail" | "phone" | "pin"; label: string; value: string; href?: string };

type Props = {
  eyebrow?: string;
  title?: string;
  description?: string;
  details?: ContactDetail[];
  /** URL d'intégration Google Maps (mode "embed", sans clé API nécessaire). */
  mapEmbedUrl?: string;
  mapLabel?: string;
};

const DEFAULT_DETAILS: ContactDetail[] = [
  { icon: "mail", label: "Email", value: "lookwebdigital@gmail.com", href: "mailto:lookwebdigital@gmail.com" },
  { icon: "phone", label: "Téléphone", value: "+221 77 000 00 00", href: "tel:+22177000000" },
  { icon: "pin", label: "Adresse", value: "Dakar, Sénégal" },
];

const DEFAULT_MAP =
  "https://www.google.com/maps?q=14.7506291,-17.4532135&z=17&output=embed";

// ─── root export ──────────────────────────────────────────────────────────────
export default function ContactPage({
  eyebrow = "Contact",
  title = "Parlons de votre projet.",
  description = "Une idée, un besoin précis ou juste une question — écrivez-nous. Nous répondons en général en moins d'un jour ouvré.",
  details = DEFAULT_DETAILS,
  mapEmbedUrl = DEFAULT_MAP,
  mapLabel = "Dakar, Sénégal",
}: Props) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // branche ici ton envoi réel (API route, service tiers, etc.)
    setSent(true);
  };

  return (
    <>
      <ContactStyles />

	  <Navbar/>

      <main className="fcontact">
        <section className="contact-hero" aria-labelledby="contact-hero-title">
          <div className="contact-hero-inner">
            {/* <span className="contact-hero-eyebrow">Parlons ensemble</span> */}
            <h1 id="contact-hero-title">Transformons votre idée en succès.</h1>
            <p>
              Identité, site web, vidéo ou stratégie marketing : racontez-nous votre projet
              et recevez un premier regard stratégique sous 24 heures.
            </p>
          </div>
        </section>

        <div className="fcontact-inner">
          {/* carte contact + formulaire */}
          <section className="fcard">
            <i className="fcard-plus fcard-plus-tl" aria-hidden />
            <i className="fcard-plus fcard-plus-tr" aria-hidden />
            <i className="fcard-plus fcard-plus-bl" aria-hidden />
            <i className="fcard-plus fcard-plus-br" aria-hidden />

            {/* colonne infos */}
            <div className="fcard-info">
              {/* <span className="fcard-eyebrow">
                <i />
                {eyebrow}
              </span> */}
              <h1 className="fcard-title">{title}</h1>
              <p className="fcard-desc">{description}</p>

              <ul className="fcard-details">
                {details.map((d) => (
                  <li key={d.label}>
                    <span className="fcard-icon">
                      <DetailIcon name={d.icon} />
                    </span>
                    <span className="fcard-detail-txt">
                      <b>{d.label}</b>
                      {d.href ? <a href={d.href}>{d.value}</a> : <em>{d.value}</em>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* colonne formulaire */}
            <div className="fcard-form-wrap">
              {sent ? (
                <div className="fcard-success">
                  <span className="fcard-success-mark" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 12.5 9.5 17 19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3>Message envoyé</h3>
                  <p>Merci — nous revenons vers vous très vite.</p>
                </div>
              ) : (
                <form className="fcard-form" onSubmit={onSubmit}>
                  <div className="fcard-field">
                    <label htmlFor="fc-name">Nom</label>
                    <input id="fc-name" name="name" type="text" placeholder="Votre nom" required />
                  </div>

                  <div className="fcard-field-row">
                    <div className="fcard-field">
                      <label htmlFor="fc-email">Email</label>
                      <input id="fc-email" name="email" type="email" placeholder="vous@exemple.com" required />
                    </div>
                    <div className="fcard-field">
                      <label htmlFor="fc-phone">Téléphone</label>
                      <input id="fc-phone" name="phone" type="tel" placeholder="+221 ..." />
                    </div>
                  </div>

                  <div className="fcard-field">
                    <label htmlFor="fc-message">Message</label>
                    <textarea id="fc-message" name="message" rows={5} placeholder="Parlez-nous de votre projet…" required />
                  </div>

                  <button className="fcard-submit" type="submit">
                    <span>Lancer mon projet</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>

        {/* carte plein écran */}
        <section className="fmap" aria-label={`Localisation — ${mapLabel}`}>
          <iframe
            className="fmap-frame"
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Carte — ${mapLabel}`}
          />
          <div className="fmap-tag">
            <span className="fmap-dot" aria-hidden />
            {mapLabel}
          </div>
        </section>
      </main>

	  <Footer />


    </>
  );
}

// ─── icônes (SVG inline) ───────────────────────────────────────────────────────
function DetailIcon({ name }: { name: ContactDetail["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "mail")
    return (
      <svg {...common}>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="M4.5 7 12 13l7.5-6" />
      </svg>
    );
  if (name === "phone")
    return (
      <svg {...common}>
        <path d="M6 4h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L15.5 13l4 1.5v3a2 2 0 0 1-2 2C10 19.5 4.5 14 4 7a2 2 0 0 1 2-3Z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 21s-6.8-6.1-6.8-11.2A6.8 6.8 0 0 1 12 3a6.8 6.8 0 0 1 6.8 6.8C18.8 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.8" r="2.3" />
    </svg>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
function ContactStyles() {
  return (
    <style>{`
      .fcontact, .fcontact * { box-sizing: border-box; margin: 0; padding: 0; }

      .fcontact {
        --white: ${WHITE};
        --orange: ${ORANGE};
        --ink: ${INK};
        --line: rgba(17,17,17,.12);
        background: var(--white); color: var(--ink);
        font-family: Inter, sans-serif;
      }

      .contact-hero {
        position: relative;
        overflow: hidden;
        background: var(--ink);
        background-image: url("/images/cover.jpg");
        background-position: center 58%;
        background-size: cover;
        color: var(--white);
      }
      .contact-hero::before {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,.45);
      }
      .contact-hero::after {
        content: "";
        position: absolute;
        width: 320px;
        height: 320px;
        right: -90px;
        top: -150px;
        border: 1px solid rgba(255,107,0,.45);
        border-radius: 50%;
        box-shadow: 0 0 0 28px rgba(255,107,0,.06), 0 0 0 56px rgba(255,107,0,.04);
      }
      .contact-hero-inner {
        position: relative;
        z-index: 1;
        max-width: 1180px;
        margin: 0 auto;
        padding: clamp(6rem, 13vw, 10rem) clamp(1.25rem, 5vw, 3rem) clamp(5rem, 10vw, 7rem);
      }
      .contact-hero-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: .6rem;
        color: var(--orange);
        font-size: .7rem;
        font-weight: 700;
        letter-spacing: .24em;
        text-transform: uppercase;
      }
      .contact-hero-eyebrow::before {
        content: "";
        width: 24px;
        height: 1px;
        background: var(--orange);
      }
      .contact-hero h1 {
        max-width: 760px;
        margin-top: 1rem;
        font-size: clamp(2.7rem, 7vw, 5.8rem);
        font-weight: 900;
        letter-spacing: -.045em;
        line-height: .98;
      }
      .contact-hero p {
        max-width: 500px;
        margin-top: 1.5rem;
        color: rgba(255,255,255,.68);
        font-size: 1rem;
        line-height: 1.7;
      }

      .fcontact-inner {
        max-width: 1180px; margin: 0 auto;
        padding: clamp(5rem, 11vw, 8rem) clamp(1.25rem, 5vw, 3rem) clamp(4rem, 8vw, 6rem);
      }

      /* ── carte contact ── */
      .fcard {
        position: relative;
        display: grid; grid-template-columns: 1.1fr 1fr;
        border: 1px solid var(--line); border-radius: 22px;
        overflow: hidden;
        box-shadow: 0 30px 70px -40px rgba(17,17,17,.25);
      }

      .fcard-plus {
        position: absolute; z-index: 2; width: 22px; height: 22px;
        color: var(--orange); pointer-events: none;
      }
      .fcard-plus::before, .fcard-plus::after {
        content: ""; position: absolute; background: currentColor;
      }
      .fcard-plus::before { top: 50%; left: 0; width: 100%; height: 1.5px; transform: translateY(-50%); }
      .fcard-plus::after  { left: 50%; top: 0; height: 100%; width: 1.5px; transform: translateX(-50%); }
      .fcard-plus-tl { top: -11px; left: -11px; }
      .fcard-plus-tr { top: -11px; right: -11px; }
      .fcard-plus-bl { bottom: -11px; left: -11px; }
      .fcard-plus-br { bottom: -11px; right: -11px; }

      /* ── colonne infos ── */
      .fcard-info {
        padding: clamp(2rem, 5vw, 3.5rem);
        display: flex; flex-direction: column; gap: 1.1rem;
      }

      .fcard-eyebrow {
        display: inline-flex; align-items: center; gap: .6rem;
        font-size: .7rem; font-weight: 600;
        letter-spacing: .26em; text-transform: uppercase;
        color: var(--orange);
      }
      .fcard-eyebrow i { width: 22px; height: 1px; background: var(--orange); display: block; }

      .fcard-title {
        font-size: clamp(1.9rem, 4.5vw, 2.7rem);
        font-weight: 900; letter-spacing: -.035em; line-height: 1.1;
      }
      .fcard-desc { font-size: .98rem; line-height: 1.75; opacity: .62; max-width: 440px; }

      .fcard-details {
        list-style: none; margin-top: 1rem;
        display: flex; flex-direction: column; gap: .25rem;
        border-top: 1px solid var(--line);
      }
      .fcard-details li {
        display: flex; align-items: center; gap: 1rem;
        padding: 1.1rem 0; border-bottom: 1px solid var(--line);
      }
      .fcard-icon {
        width: 42px; height: 42px; flex: none; border-radius: 12px;
        background: #fff3ea; color: var(--orange);
        display: grid; place-items: center;
      }
      .fcard-icon svg { width: 19px; height: 19px; }

      .fcard-detail-txt { display: flex; flex-direction: column; gap: .15rem; }
      .fcard-detail-txt b { font-size: .78rem; font-weight: 600; opacity: .5; text-transform: uppercase; letter-spacing: .04em; }
      .fcard-detail-txt a, .fcard-detail-txt em {
        font-size: .96rem; font-weight: 600; font-style: normal; color: var(--ink); text-decoration: none;
      }
      .fcard-detail-txt a { transition: color .25s ease; }
      .fcard-detail-txt a:hover { color: var(--orange); }

      /* ── colonne formulaire ── */
      .fcard-form-wrap {
        background: #fafafa; border-left: 1px solid var(--line);
        padding: clamp(2rem, 5vw, 3.5rem);
        display: flex; align-items: center;
      }

      .fcard-form { width: 100%; display: flex; flex-direction: column; gap: 1.15rem; }
      .fcard-field { display: flex; flex-direction: column; gap: .5rem; }
      .fcard-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.15rem; }

      .fcard-field label {
        font-size: .78rem; font-weight: 600; letter-spacing: .03em;
        text-transform: uppercase; opacity: .55;
      }
      .fcard-field input, .fcard-field textarea {
        width: 100%; font-family: inherit; font-size: .95rem; color: var(--ink);
        background: var(--white); border: 1px solid var(--line); border-radius: 12px;
        padding: 12px 14px; resize: vertical;
        transition: border-color .25s ease, box-shadow .25s ease;
      }
      .fcard-field input::placeholder, .fcard-field textarea::placeholder { color: rgba(17,17,17,.35); }
      .fcard-field input:focus, .fcard-field textarea:focus {
        outline: none; border-color: var(--orange);
        box-shadow: 0 0 0 3px rgba(255,107,0,.14);
      }

      .fcard-submit {
        position: relative; overflow: hidden; margin-top: .35rem;
        display: inline-flex; align-items: center; justify-content: center; gap: .6rem;
        background: var(--orange); color: var(--white); border: none; cursor: pointer;
        padding: 14px 24px; border-radius: 999px;
        font-size: .95rem; font-weight: 700; letter-spacing: -.01em;
        box-shadow: 0 10px 26px rgba(255,107,0,.3);
        transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease;
      }
      .fcard-submit::after {
        content: ""; position: absolute; inset: 0;
        background: var(--ink);
        transform: translateY(101%);
        transition: transform .45s cubic-bezier(.16,1,.3,1);
      }
      .fcard-submit span, .fcard-submit svg { position: relative; z-index: 1; }
      .fcard-submit svg { width: 17px; height: 17px; transition: transform .3s cubic-bezier(.16,1,.3,1); }
      .fcard-submit:hover { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(255,107,0,.4); }
      .fcard-submit:hover::after { transform: translateY(0); }
      .fcard-submit:hover svg { transform: translateX(3px); }
      .fcard-submit:active { transform: translateY(0); }

      /* ── confirmation d'envoi ── */
      .fcard-success {
        width: 100%; text-align: center;
        display: flex; flex-direction: column; align-items: center; gap: 1rem;
        padding: 2rem 0;
      }
      .fcard-success-mark {
        width: 56px; height: 56px; border-radius: 50%;
        background: #fff3ea; color: var(--orange);
        display: grid; place-items: center;
      }
      .fcard-success-mark svg { width: 24px; height: 24px; }
      .fcard-success h3 { font-size: 1.2rem; font-weight: 800; letter-spacing: -.02em; }
      .fcard-success p { font-size: .92rem; opacity: .6; }

      /* ── carte de localisation plein écran ── */
      .fmap {
        position: relative;
        width: 100vw; margin-left: calc(50% - 50vw);
        height: clamp(320px, 46vw, 520px);
        background: #eee;
      }
      .fmap-frame { width: 100%; height: 100%; border: 0; display: block; filter: saturate(.9) contrast(1.02); }

      .fmap-tag {
        position: absolute; left: clamp(1.25rem, 5vw, 3rem); bottom: clamp(1.25rem, 4vw, 2rem);
        display: inline-flex; align-items: center; gap: .6rem;
        background: var(--white); color: var(--ink);
        padding: 11px 20px; border-radius: 999px;
        font-size: .85rem; font-weight: 700; letter-spacing: -.005em;
        box-shadow: 0 14px 34px rgba(17,17,17,.18);
      }
      .fmap-dot {
        width: 9px; height: 9px; border-radius: 50%; background: var(--orange);
        box-shadow: 0 0 0 4px rgba(255,107,0,.18);
      }

      /* ── responsive ── */
      @media (max-width: 860px) {
        .fcard { grid-template-columns: 1fr; }
        .fcard-form-wrap { border-left: none; border-top: 1px solid var(--line); }
      }
      @media (max-width: 520px) {
        .fcard-field-row { grid-template-columns: 1fr; }
      }
    `}</style>



  );
}