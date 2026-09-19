import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CircularTestimonials from "../components/sections/Landing";
import Slider from "../components/sections/Slider";
import ServicesShowcase from "../components/sections/Features";
import { ProjectTypesSection } from "../components/sections/ServicesSection";

export default function ServicesPage() {


	const testimonials = [
  {
    quote:
      "Look Web Digital a refondu toute notre identité et notre site web. En trois mois, notre visibilité a doublé et nos clients nous recommandent spontanément. Une équipe à l'écoute, des délais tenus.",
    name: "Aïssatou Ndiaye",
    designation: "Directrice Marketing — Banque Atlantique",
    src:
      "https://cdn.21st.dev/assets/mirror/02/0204be31ac91de05dc9a78ea3438dda481ff3deaaffa40cb28e3bc1822ba3650.jpg",
  },
  {
    quote:
      "Du logo à la boutique en ligne, tout a été pensé pour nos clients de Dakar. Les campagnes ont généré +38 % d'abonnés en trois mois. Un partenaire qui comprend vraiment le marché local.",
    name: "Moussa Diagne",
    designation: "Fondateur — Kaay Fresh",
    src:
      "https://cdn.21st.dev/assets/mirror/bb/bb5e69602eca31b29b15db66d5f95f5d6e1534037d1cc2c06e8cbb22cafb3a8f.jpg",
  },
  {
    quote:
      "Ils ont produit notre film institutionnel et notre catalogue print avec une exigence rare. Nos équipes, nos valeurs, tout y est fidèle. Le rendu est à la hauteur des plus grandes agences.",
    name: "Fatou Sarr",
    designation: "Directrice Communication — Sahel Foods",
    src:
      "https://cdn.21st.dev/assets/mirror/b1/b1e3120d49307c1e99ec979e6d05e79f67d7ecea727b27eb716a2b7bff5fe0bb.jpg",
  },
];


	return (
		<>
			<Navbar />
			<main className="w-full">
                <Slider />

                <section>
                    {/* Light testimonials section */}
                    <div className="bg-[#f7f7fa] p-20 rounded-lg min-h-75 flex flex-wrap gap-6 items-center justify-center relative">
                    <div
                        className="items-center justify-center relative flex"
                        style={{ maxWidth: "1456px" }}
                    >
                        <CircularTestimonials
                        testimonials={testimonials}
                        autoplay={true}
                        colors={{
                            name: "#111111",
                            designation: "#686868",
                            testimony: "#454545",
                            arrowBackground: "#111111",
                            arrowForeground: "#ffffff",
                            arrowHoverBackground: "#ff6b00",
                        }}
                        fontSizes={{
                            name: "28px",
                            designation: "20px",
                            quote: "20px",
                        }}
                        />
                    </div>
                    </div>
                    
                </section>

                <ServicesShowcase />
                <ProjectTypesSection />
            
            </main>
			<Footer />
		</>
	);
}
