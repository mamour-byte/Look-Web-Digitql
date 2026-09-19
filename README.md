# CURATION DES MÉDIAS VIA CLOUDINARY

Les composants **Galery**, **Scroll** et **Slider** lisent leurs médias depuis
un compte Cloudinary. Un dashboard d'administration (`/admin`) permet d'y
importer, réordonner, renommer et supprimer les fichiers — sans toucher au code.

## 1. Configuration (uniquement dans `.env`)

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
ADMIN_PASSWORD=un-mot-de-passe-fort
```

- `CLOUDINARY_URL` : votre URL de connexion Cloudinary
  (Dashboard Cloudinary → **Settings → Access keys**).
- `ADMIN_PASSWORD` : mot de passe du dashboard `/admin`.

Copiez `.env.example` vers `.env.local` et renseignez ces deux valeurs.

## 2. Importer des médias

1. Lancez le serveur : `npm run dev`
2. Ouvrez **http://localhost:3000/admin** et connectez-vous.
3. Choisissez la collection cible puis importez vos fichiers :

| Collection | Composant | Contenu attendu |
| ---------- | --------- | --------------- |
| `Galery`   | page d'accueil (galerie) | **Images** |
| `Slider`   | slider de prestations | **Vidéos** (le « Titre » est affiché sur chaque slide) |
| `Scroll`   | hero de la page d'accueil | **Vidéo** de couverture + **image** de poster facultative |

L'ordre s'ajuste avec les flèches ↑/↓. Vous pouvez aussi créer un lien de
partage/publication vers n'importe quel média. Tout est stocké dans le dossier
`lookweb/{collection}` de votre compte Cloudinary.

## 3. Comportement des composants

- Dès qu'une collection contient des médias Cloudinary, le composant affiche
  **ces médias** (avec la priorité).
- Si la collection est **vide** (ou si `CLOUDINARY_URL` manque), le composant
  bascule sur les fichiers locaux de `public/images` et `public/videos` —
  le site reste donc toujours fonctionnel.

> Astuce : une fois vos fichiers importés sur Cloudinary, vous pouvez supprimer
> le contenu volumineux de `public/` pour alléger le dépôt.

## 4. Déploiement (Vercel, etc.)

Renseignez `CLOUDINARY_URL` et `ADMIN_PASSWORD` dans les variables
d'environnement de votre plateforme d'hébergement, puis déployez comme
d'habitude : `npm run build`.

## 5. Aide mémoire des dossiers Cloudinary

| Collection | Dossier Cloudinary        |
| ---------- | ------------------------- |
| Galery     | `lookweb/gallery`         |
| Scroll     | `lookweb/scroll`          |
| Slider     | `lookweb/slider`          |

Le tri s'appuie sur le contexte `order` stocké sur chaque asset Cloudinary.