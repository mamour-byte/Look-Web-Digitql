"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import InversionCircleScrollAnimation from "./components/sections/Scroll";
import { Gallery, GalleryGrid, GalleryImage } from "./components/sections/Galery";
import { optimizeImageUrl } from "@/lib/media";
import { useMedia } from "@/lib/useMedia";

// Sections sous la ligne de flottaison : chargées en script séparé,
// pour ne pas gonfler le bundle initial.
const Services = dynamic(() => import("./components/sections/Services"), { ssr: false });
const Team = dynamic(() => import("./components/sections/Team"), { ssr: false });
const StatsPartners = dynamic(() => import("./components/sections/StatsandPartners"), { ssr: false });

// Contenu de secours (médias locaux) utilisé tant que la collection
// "gallery" est vide dans Cloudinary.
const FALLBACK_IMAGES = [
  { id: "1", src: "./images/audio.jpg" },
  { id: "2", src: "./images/brand1.jpg" },
  { id: "13", src: "./images/srt.png" },
  { id: "3", src: "./images/cinema.jpg" },
  { id: "4", src: "./images/cover.jpg" },
  { id: "5", src: "./images/info.jpg" },
  { id: "6", src: "./images/logi.jpg" },
  { id: "7", src: "./images/drone.jpg" },
  { id: "8", src: "./images/sono.jpg" },
  { id: "9", src: "./images/tablette.jpg" },
  { id: "10", src: "./images/mark.jpg" },
  { id: "11", src: "./images/social.jpg" },
  { id: "12", src: "./images/dev.jpg" },
];

export default function Home() {
  const { assets } = useMedia("gallery");

  // Les médias Cloudinary prennent le dessus dès qu'ils existent.
  // Les vignettes sont redimensionnées côté Cloudinary (f_auto,q_auto,w_…) :
  // 3 à 5× plus légères ; la version pleine réservation pour le modal.
  const galleryImages = assets.length
    ? assets.map((a) => ({
        id: a.publicId,
        src: optimizeImageUrl(a.url, { w: 800 }),
        fullSrc: optimizeImageUrl(a.url, { w: 1800 }),
        alt: a.name || `Réalisation Look Web Digital`,
      }))
    : FALLBACK_IMAGES.map((image) => ({
        ...image,
        fullSrc: image.src,
        alt: `Réalisation Look Web Digital — projet ${image.id}`,
      }));


// Fix for app.tsx infrastructure horizontal scrolling
  React.useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };
  }, []);

  return (
  <>
    <Navbar/>
    {/* <Hero/> */}
    <InversionCircleScrollAnimation
      videoSrc="/videos/stade.mp4"
      poster="/images/paysage.jpg"
    />

    <div className="w-full self-start bg-white hidden md:block">
      <div id="realisation" className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-10 space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-primary">
            Des projets qui font rayonner votre marque.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Chaque création Look Web Digital est pensée pour un seul objectif : rendre votre marque
            incontournable. Identité visuelle, sites web, vidéos et campagnes — découvrez comment nos
            réalisations transforment la visibilité de nos clients en résultats concrets.
          </p>
        </header>

        <Gallery>
          <GalleryGrid>
            {galleryImages.map((image) => (
              <GalleryImage
                key={image.id}
                id={image.id}
                src={image.src}
                fullSrc={image.fullSrc}
                alt={image.alt}
              />
            ))}
          </GalleryGrid>
        </Gallery>
      </div>
    </div>

    <React.Suspense fallback={<SectionPlaceholder />}>
      <Services />
    </React.Suspense>

    <React.Suspense fallback={<SectionPlaceholder />}>
      <Team />
    </React.Suspense>

    <React.Suspense fallback={<SectionPlaceholder />}>
      <StatsPartners />
    </React.Suspense>
    
    <Footer />
  </>
  );
}

/** Skeleton minimal pendant le chargement des sections dynamiques. */
function SectionPlaceholder() {
  return (
    <div className="w-full bg-white" style={{ minHeight: "60vh" }} aria-hidden />
  );
}
