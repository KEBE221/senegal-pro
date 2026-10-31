# Ladies & Gentlemen × Tarru Auto — Site Unifié

Site **100 % autonome** (un seul fichier `index.html`, images embarquées) réunissant les deux univers :

1. **Ladies & Gentlemen — Salon & Spa** (Thiès) — Accueil, La Carte, Packs & Offres, Boutique, Galerie, Rendez-vous
2. **Tarru Auto — Lavage, Détailing, Tapis & Linge** (Thiès) — Accueil, Services, Tarifs, Tapis & Linge, Contact

Navigation : glissez horizontalement (tactile, souris, molette) ou utilisez le sélecteur d'univers en bas.

Boutique : 65 produits réels du salon (photos et prix officiels) · Galerie : 24 photos + 17 vidéos du salon · Slider : 8 visuels réels.

**Vidéos de la galerie** : elles sont diffusées en streaming directement depuis le serveur du salon (ladiesandgentlemen.store), avec repli automatique sur un dossier `media/` local si vous y déposez les fichiers (`IMG_8989.MOV`, `coiffure.mp4`, `pédicure.mp4`, `soin-de-visage.mp4`).

## ⚡ Performance (v4 — chargement quasi instantané)

- **Images 100 % WebP** recompressées par famille (slider, flyers, grilles, logos) : fichier final passé de **8,5 Mo → 4,4 Mo (−49 %)**.
- **Écran d'accueil "Splash"** or & nuit peint dès les premiers octets : la marque s'affiche instantanément pendant le micro-chargement, puis fondu élégant.
- **Polices 100 % asynchrones** (Google Fonts + Font Awesome non bloquants) : le rendu ne dépend plus des CDN.
- **Hydratation immédiate** des images (plus d'attente DOMContentLoaded) + `loading="lazy"` sur les pages virtuelles masquées.

## 🔍 SEO Premium (national · international · Thiès)

- Balises complètes : title/description enrichis, **mots-clés Thiès/Sénégal/Dakar**, canonical `https://ladiesandgentlemen.store/`, hreflang fr + x-default, géolocalisation (SN-TH), robots `max-image-preview:large`.
- **Open Graph & Twitter Card** avec image de partage dédiée `og-image.jpg` (1200×630, logos des deux univers).
- **Données structurées Schema.org** : BeautySalon + AutoWash (horaires, adresse Grand Standing/Phoenix, géo, offres & prix, langues fr/wo), WebSite, Organization.
- **robots.txt** + **sitemap.xml** + en-têtes de sécurité/caching Netlify (`_headers`).
- Hiérarchie de titres propre : un seul `<h1>` (descriptif des deux univers), toutes les sections en `<h2>`.

## 🚀 Déploiement

Le fichier prêt à l'emploi est **`index.html`** (à la racine).

- **Netlify** : glisser-déposer `index.html` sur https://app.netlify.com/drop — c'est tout.
- **Tout autre hébergeur statique** : uploader `index.html` tel quel (+ `robots.txt`, `sitemap.xml`, `og-image.jpg`, `_headers`).

Aucune dépendance, aucun build, aucun dossier à uploader.

## 🔧 Modifier le site (prix, textes, images)

Le code source lisible est dans `src/` :

| Fichier | Rôle |
|---|---|
| `src/index.work.html` | Tout le site lisible (HTML/CSS/JS) avec des jetons `{{IMAGE}}` |
| `src/build.js` | Remplace les jetons par les images WebP de `src/opt-webp/` (repli `src/opt/` en JPEG), inline en base64, et génère le `index.html` final |
| `src/opt-webp/*.webp` | Les images optimisées (fichier final le plus léger — utilisées en priorité) |
| `src/opt/*.jpg` | Les images sources JPEG (repli si un `.webp` manque) |

Pour régénérer après modification :

```bash
cd src
node build.js
# → écrit ../index.html (et public/index.html)
```

### Points de modification fréquents
- **Prix** : directement dans `src/index.work.html` (sections `price-menu`, `bento-grid`, tableau `TARIFS`) puis relancer `node build.js`.
- **Logo** : remplacer `src/opt/lg_med_260.jpg` (LG) ou `src/opt/ta_logo_*.png` (Tarru).
- **Photos services** : remplacer le fichier correspondant dans `src/opt/` (ex. `lg_svc_coiffure.jpg`) en gardant le même nom.

## 📍 Infos business (à jour)

- **LG** : Grand Standing, avant l'hôtel Phoenix — Thiès · 7j/7 · 11h–22h (L-V), 11h–23h (S-D) · +221 71 031 75 85 / 78 555 70 70
- **Tarru Auto** : même adresse, côte à côte · Lavage auto dès 2 000 F · Tapis dès 2 500 F/m² · Linge dès 2 500 F/kg · Canapés dès 15 000 F · Matelas dès 12 000 F · Chaises dès 3 000 F · Collecte & livraison à domicile
