# Tristan Wiering - Inner Leadership Website

Deze website is gebouwd met React, TypeScript en Tailwind CSS. De configuratie is volledig overgebracht naar **GitHub Pages** met een automatische GitHub Actions workflow voor een feilloze en snelle deployment.

## GitHub Pages Deployment

De website maakt gebruik van GitHub Actions (`.github/workflows/deploy.yml`) om bij elke push naar de `main` branch de site automatisch te bouwen en te deployen.

### Stap-voor-stap handleiding voor herkoppelen & deployen:

1. **Maak een GitHub repository aan** of gebruik je bestaande repository (bijvoorbeeld `Tristan1981/testsite`).
2. **Push de bestanden naar GitHub**:
   * Zorg ervoor dat je de bestanden uploadt naar de repository.
   * *Tip voor uitsluiten:* Grote werkmappen zoals `node_modules` en build-bestanden in `dist` worden genegeerd door Git via het `.gitignore` bestand.
3. **Schakel GitHub Actions in voor Pages**:
   * Ga in je GitHub repository naar **Settings** (Instellingen).
   * Klik in het linkermenu op **Pages** onder de sectie "Code and automation".
   * Onder **Build and deployment**, kies bij **Source** voor:
     `GitHub Actions` (in plaats van "Deploy from a branch").
4. **Activeer de workflow**:
   * Zodra je de bron op "GitHub Actions" zet, is de workflow actief!
   * Elke keer dat je wijzigingen pusht of uploadt naar de `main` branch, herkent GitHub de workflow in `.github/workflows/deploy.yml` en start de automatische publicatie.
   * Je kunt de voortgang bekijken onder het tabblad **Actions** in je GitHub-repository.

## Bestanden Uitsluiten bij Handmatige Upload

Als je de bestanden handmatig sleept (drag & drop) naar GitHub via de browser:
* **Wel uploaden:** Alle bestanden in de hoofdmap (waaronder `src/`, `public/`, `components/`, `.github/`, `package.json`, `vite.config.ts`, `App.tsx`, `content.json`, `index.html`, etc.).
* **NIET uploaden:**
  * `node_modules/` (deze map bevat duizenden dependency-bestanden en wordt door GitHub Actions zelf geïnstalleerd).
  * `dist/` (dit is de lokale build-uitvoer; GitHub bouwt dit live in de cloud).
  * `WEBSITE_BESTANDEN/` (dit is een back-up map met oude bestanden en heeft geen invloed op deze React-site).

