"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight, Palette, Video, Globe, Printer, Camera, Megaphone } from "lucide-react";
import Link from "next/link";

const projectTypes = [
  {
    id: "graphic-design",
    title: "Graphisme & Identité visuelle",
    description: "Nous créons des identités visuelles fortes et cohérentes : logo, charte graphique et supports de communication pour rendre votre marque immédiatement reconnaissable.",
    icon: Palette,
    href: "/Services",
  },
  {
    id: "video-production",
    title: "Réalisation vidéo",
    description: "De l'idée au montage final, nous produisons des vidéos créatives et professionnelles pour raconter votre histoire et captiver votre audience.",
    icon: Video,
    href: "/Services",
  },
  {
    id: "website",
    title: "Création de site Web",
    description: "Nous concevons des sites modernes, rapides et responsive, pensés pour présenter votre activité, renforcer votre crédibilité et convertir vos visiteurs.",
    icon: Globe,
    href: "/Services",
  },
  {
    id: "print",
    title: "Print",
    description: "Flyers, affiches, brochures, cartes de visite et supports imprimés : nous donnons à vos communications physiques un rendu soigné et impactant.",
    icon: Printer,
    href: "/Services",
  },
  {
    id: "professional-photography",
    title: "Photographie professionnelle",
    description: "Nous réalisons des images professionnelles de vos produits, équipes et projets pour valoriser votre activité sur tous vos supports.",
    icon: Camera,
    href: "/Services",
  },
  {
    id: "digital-marketing-seo",
    title: "Marketing Digital & SEO",
    description: "Nous développons votre visibilité en ligne grâce à une stratégie digitale, au référencement naturel et à des campagnes ciblées pour attirer les bons clients.",
    icon: Megaphone,
    href: "/Services",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export const ProjectTypesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-[var(--background)] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">
              Nos solutions
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--orange)] mb-6"
          >
            Le bon format technique pour votre croissance
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[var(--text-muted)] max-w-2xl"
          >
            De la vitrine digitale à l&apos;infrastructure cloud, nous concevons des solutions sur mesure,
            évolutives et orientées résultats — pour que chaque investissement technique serve votre croissance.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {projectTypes.map((project) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.id}
                variants={cardVariants}
                className="group flex flex-col h-full bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[var(--orange)]/20 hover:-translate-y-1"
              >
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-full bg-[var(--orange-soft)] flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-[var(--orange)]/10">
                  <Icon className="w-5 h-5 text-[var(--orange)]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[var(--orange)] mb-3 tracking-tight">
                  {project.title}
                </h3>
                <p className="text-[15px] text-[var(--text-muted)] leading-relaxed mb-8 flex-grow">
                  {project.description}
                </p>

                {/* Action Link */}
                <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-[var(--orange)] transition-colors group-hover:text-[var(--orange-dark)]">
                  En savoir plus
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA to contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-[var(--surface-soft)] border border-[var(--line-subtle)]">
            <span className="px-4 py-2 text-sm text-[var(--text-muted)]">Un besoin très spécifique ?</span>
            <Link
              href="/Contact"
              className="btn btn-primary btn-sm"
            >
              Parlons-en
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
