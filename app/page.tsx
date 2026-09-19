"use client";
import * as React from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import InversionCircleScrollAnimation from "./components/sections/Scroll";
import Services from "./components/sections/Services";
import { Gallery, GalleryGrid, GalleryImage } from "./components/sections/Galery";
import Team from "./components/sections/Team";
import StatsPartners from "./components/sections/StatsandPartners";

const IMAGES = [
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
      poster="/images/hero-poster.jpg"
    />

    <div className="w-full self-start bg-white">
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
            {IMAGES.map((image) => (
              <GalleryImage 
                key={image.id} 
                id={image.id} 
                src={image.src} 
                alt={`Réalisation Look Web Digital — projet ${image.id}`} 
              />
            ))}
          </GalleryGrid>
        </Gallery>
      </div>
    </div>

    <Services />

    <Team/>

    <StatsPartners  />
    
    <Footer />
  </>
  );
}
