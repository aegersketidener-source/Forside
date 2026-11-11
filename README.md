# ÆGERSKE TIDENDER
**Det Ægerske og Oppland · Grunnlagt 1882**

Fullstendig statisk nettstedspakke for det tomme GitHub-repositoriet
`aegersketidener-source/Forside`.

## På forsiden
- Historisk avisdesign, uten pris, utgavenummer eller digitalt abonnement.
- Siste dato i materialet øverst; de tre foregående kalenderdagene nedenfor.
- Hovedsak i bredde med tre sekundærsaker under.
- 9 kategorier og 228 underkategorier.
- **4–5 forskjellige, tilfeldig valgte reklamebilder ved hver sideinnlasting.**
  Forsiden viser 2 i første annonsebånd og 2–3 i neste. Ingen gjentakelser i samme innlasting.
- Artikkelvisning med bylineportrett og klikkbart navn, profilsider og beslektede saker.

## Legg til reklamer – ingen JSON-redigering
1. Last opp `.webp`, `.png`, `.jpg`, `.jpeg` eller `.avif` i **`reklame/`**.
2. Push til `main`.
3. GitHub Actions oppdager automatisk alle bildene, lager
   `reklame/manifest.json` i publiseringsversjonen og publiserer nettsiden.
4. Ved hver ny sideinnlasting trekker forsiden tilfeldig **4 eller 5** annonser.
   Hvis færre enn 4 reklamer finnes, vises alle tilgjengelige.

Valgfritt: `reklame/metadata.json` gir lesbare annonsenavn og beskrivende alttekster.
Uten metadata brukes filnavnet. **Ikke rediger `reklame/manifest.json` manuelt.**

Annonsegalleriet (`annonser.html`) viser alle tilgjengelige bildefiler fra mappen.
Artikkelsider bruker én tilfeldig annonse etter teksten.

## Oppsett på helt nytt GitHub-repositorium
1. Pakk ut ZIP og last opp **innholdet**, inkludert `.github`, til `main` i
   `https://github.com/aegersketidener-source/Forside`.
2. Åpne **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. I **Actions** ser du arbeidsflyten «Publiser Ægerske Tidender til GitHub Pages».
4. Nettstedet blir vanligvis tilgjengelig på
   `https://aegersketidener-source.github.io/Forside/` etter vellykket utrulling.

Nettstedet er uten Jekyll, Node, database og eksterne biblioteker.
GitHub Actions brukes kun til å oppdatere reklamefiloversikten og publisere siden.

## Lokalt
```bash
python scripts/build_ads.py
python scripts/validate.py
python -m http.server 8000
```
Åpne `http://localhost:8000/`.

## Data
- `data/artikler.json`: artiklene (22 demonstrasjonsartikler som må erstattes før lansering).
- `data/journalister.json`: 18 journalister + redaktør, fotografier i `assets/byline/`.
- `data/redaksjon.json`: hele det leverte redaksjonsregisteret.
- `data/emneregister.json`: ni hovedkategorier, 228 emner.
- `data/steder.json`, `data/natur_og_turhytter.json` og `data/idrettslag.json`:
  innsendte lokale registre. Usikker/ufullstendig innsamling er beholdt, ikke oppgradert til verifisert.
- `reklame/`: enkelt bildegalleri som automatisk brukes på nettstedet.
- `assets/emblem.webp` og `assets/emblem.png`: levert nettstedsemblem/faneikon.

Bylinebilder: 256 × 256 WebP, vist som 64 × 64 på artikkelsidene. Dersom et bilde
mangler, vises initialer. Journalistnavn og avatar åpner journalistenes profilsider.

**Merk:** Demoartiklene er ikke faktiske nyheter. Bildene i annonser er retroillustrasjoner.
Det at et produkt-/merkenavn vises i en retroannonse innebærer ikke at dette er en
nåværende forretning eller reell annonsekampanje.


