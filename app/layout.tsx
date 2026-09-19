import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Look Web Digital — Agence Web & Digitale à Dakar",
    template: "%s — Look Web Digital",
  },
  description:
    "Agence web et digitale à Dakar : identité visuelle, sites web sur mesure, production vidéo et marketing digital. Nous rendons votre marque visible, mémorable et rentable.",
  keywords: [
    "agence web dakar",
    "agence digitale sénégal",
    "création site web",
    "design graphique",
    "identité visuelle",
    "production vidéo",
    "marketing digital",
    "community management",
    "Look Web Digital",
  ],
  metadataBase: new URL("https://lookwebdigital.com"),
  openGraph: {
    title: "Look Web Digital — Agence Web & Digitale à Dakar",
    description:
      "Design, vidéo, développement et marketing : une seule équipe pour rendre votre marque visible, mémorable et rentable.",
    type: "website",
    locale: "fr_FR",
    siteName: "Look Web Digital",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}