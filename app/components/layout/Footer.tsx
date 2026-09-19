const footerLinks = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/Services" },
  { label: "Réalisation", href: "/realisations" },
  { label: "Contact", href: "/Contact" },
];

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-neutral-200 bg-white/95 text-neutral-900">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl space-y-5">
            <div className="flex items-center gap-3">
                <img src="./logos/logo-lwd.png" alt="" width={80} />
              <span className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500">
                Look Web Digital
              </span>
            </div>

            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-3xl">
              Des idées qui prennent de la hauteur.
            </h3>

            <p className="max-w-lg text-sm leading-6 text-neutral-600 sm:text-base">
              Agence web et digitale basée à Dakar : nous concevons des identités, des sites, des
              vidéos et des campagnes qui rendent votre marque visible, mémorable et rentable.
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <a
              href="/Contact"
              className="btn btn-primary"
            >
              Parlons de votre projet
            </a>

            <div className="flex items-center gap-6 text-sm text-neutral-600">
              {footerLinks.map((link) => (
                <a key={link.href} href={link.href} className="transition-colors hover:text-neutral-950">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <div className="flex flex-col gap-4 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Look Web Digital. Tous droits réservés.</p>

            <div className="flex items-center gap-5">
              <a href="mailto:lookwebdigital@gmail.com" className="transition-colors hover:text-neutral-900">
                lookwebdigital@gmail.com
              </a>
              <a href="tel:+22177000000" className="transition-colors hover:text-neutral-900">
                +221 77 000 00 00
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
