"use client";

import { useEffect, useState } from "react";

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

type TestimonialColors = {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
};

type TestimonialFontSizes = {
  name?: string;
  designation?: string;
  quote?: string;
};

type CircularTestimonialsProps = {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: TestimonialColors;
  fontSizes?: TestimonialFontSizes;
};

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}: CircularTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredArrow, setHoveredArrow] = useState<"prev" | "next" | null>(null);
  const count = testimonials.length;

  useEffect(() => {
    if (!autoplay || count < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [autoplay, count]);

  if (count === 0) return null;

  const active = testimonials[activeIndex];
  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + count) % count);
  };

  return (
    <section className="testimonial-container" aria-label="Témoignages clients">
      <div className="testimonial-grid">
        <div className="image-container">
          {testimonials.map((testimonial, index) => {
            const offset = (index - activeIndex + count) % count;
            const visible = offset === 0 || offset === 1 || offset === count - 1;
            const side = offset === count - 1 ? -1 : 1;
            return (
              <img
                key={testimonial.src}
                src={testimonial.src}
                alt={testimonial.name}
                className="testimonial-image"
                style={{
                  opacity: visible ? 1 : 0,
                  pointerEvents: index === activeIndex ? "auto" : "none",
                  transform: index === activeIndex
                    ? "translateX(0) scale(1)"
                    : `translateX(${side * 18}%) translateY(-8%) scale(.84)`,
                  zIndex: index === activeIndex ? 3 : 2,
                }}
              />
            );
          })}
        </div>

        <div className="testimonial-content" aria-live="polite">
          <div>
            <h3 style={{ color: colors.name ?? "#111", fontSize: fontSizes.name ?? "1.5rem" }}>
              {active.name}
            </h3>
            <p className="designation" style={{ color: colors.designation ?? "#6b7280", fontSize: fontSizes.designation ?? ".925rem" }}>
              {active.designation}
            </p>
            <p className="quote" style={{ color: colors.testimony ?? "#4b5563", fontSize: fontSizes.quote ?? "1.125rem" }}>
              {active.quote}
            </p>
          </div>

          <div className="arrow-buttons">
            {([-1, 1] as const).map((direction) => {
              const name = direction === -1 ? "prev" : "next";
              return (
                <button
                  key={name}
                  type="button"
                  className="arrow-button"
                  aria-label={direction === -1 ? "Témoignage précédent" : "Témoignage suivant"}
                  onClick={() => move(direction)}
                  onMouseEnter={() => setHoveredArrow(name)}
                  onMouseLeave={() => setHoveredArrow(null)}
                  style={{
                    background: hoveredArrow === name
                      ? colors.arrowHoverBackground ?? "#f97316"
                      : colors.arrowBackground ?? "#141414",
                    color: colors.arrowForeground ?? "#fff",
                  }}
                >
                  {direction === -1 ? "←" : "→"}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonial-container { width: 100%; max-width: 1152px; padding: 2rem; }
        .testimonial-grid { display: grid; gap: 3rem; align-items: center; }
        .image-container { position: relative; height: 24rem; perspective: 1000px; }
        .testimonial-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,.18); transition: opacity .5s ease, transform .7s ease; }
        .testimonial-content { display: flex; min-height: 18rem; flex-direction: column; justify-content: space-between; }
        .testimonial-content h3 { font-weight: 700; margin: 0; }
        .designation { margin: .35rem 0 1.5rem; }
        .quote { line-height: 1.75; margin: 0; }
        .arrow-buttons { display: flex; gap: 1rem; padding-top: 2rem; }
        .arrow-button { width: 2.8rem; height: 2.8rem; border: 0; border-radius: 999px; color: white; cursor: pointer; font-size: 1.35rem; transition: transform .2s ease; }
        .arrow-button:hover { transform: scale(1.06); }
        @media (min-width: 768px) { .testimonial-grid { grid-template-columns: 1fr 1fr; gap: 5rem; } }
      `}</style>
    </section>
  );
}



export default CircularTestimonials;
