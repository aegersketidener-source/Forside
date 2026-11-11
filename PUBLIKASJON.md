# Til publiseringskontoen – Ægerske Tidender

Dette er arbeidsbeskrivelsen for ChatGPT-kontoen som skal publisere artikler. Den kan publisere **uten tilgang til designfilene**.

## Hvilke filer skal endres?

- **Artikler:** `data/artikler.json` (JSON-liste som leses direkte på forsiden og artikkelsidene).
- **Annonser:** Legg reklamebilder i `reklame/`. GitHub Actions lager automatisk reklameoversikt uten at JSON endres.
- **Emneregister:** `data/emneregister.json` definerer tillatte hovedkategorier, underkategorier og journalist-ID-er.
- **Journalister:** `data/journalister.json` kobler ID til visningsnavn.
- **Artikkelmal:** `data/artikkelmal.json` (kopier objektet inn i listen, ikke overskriv hele artikkelregisteret).
- **Bilder:** legg en optimalisert `.webp` i `assets/`, og skriv filstien i artikkelen.

## Publiseringsregler

1. Før du publiserer, kontroller hendelsesdato og publiseringstidspunkt. Bruk ISO 8601 med norsk tidssone, for eksempel `2026-11-11T13:05:00+01:00`.
2. Velg en kombinasjon av `hovedkategori` og `underkategori` fra emneregisteret. Bruk eksakt stavemåte.
3. `journalist_id` skal finnes i `data/journalister.json`; ikke skriv byline fritt.
4. Gi artikkelen en unik `id` med bare små latinske bokstaver, siffer og bindestreker.
5. Sett `demo: false` for faktiske, kildekontrollerte artikler. Eksempelartiklene med `demo: true` skal fjernes før lansering.
6. Oppgi presise kilder i artikkelteksten når det er relevant. Ikke konstruer uttalelser, hendelser, lokasjoner eller tall.
7. Ikke endre filene i `css/`, `js/`, HTML-filene eller `.github/` for å publisere nyheter.
8. Kjør `python scripts/validate.py`, eller bruk GitHub-handlingens valideringsstatus ved pull request.
9. Nye artikler vises automatisk. Den fremhevede artikkelen er den nyeste med `fremhevet: true` **på den siste publiseringsdatoen**; hvis ingen er fremhevet, vises den nyeste.
10. Forsiden viser fire sammenhengende kalenderdager regnet fra siste publiseringsdato. Eldre stoff finnes i arkivet og søket.

## Sikker arbeidsflyt

Gi publiseringskontoen minst mulig tilgang. Den kan for eksempel lage pull requests med endringer bare i `data/`, `assets/` og `reklame/`. En gjennomgang før sammenslåing til `main` reduserer risikoen for utilsiktede endringer i design og kode. GitHub Actions-kontrollen er et hjelpemiddel, ikke en garanti for faktasjekk.

## Søk og relaterte artikler

- Beslektede artikler beregnes fra `hovedkategori`, `underkategori`, `sted` og `tags`. Det er derfor viktig med konkrete emneord.
- Søk skjer i nettleseren mot de publiserte JSON-dataene. Ingen database er nødvendig.
- Artikkellenker har formen `artikkel.html?id=artikkel-id`.

## Viktig

Nettsiden er en statisk, offentlig GitHub Pages-side. Ikke legg inn passord, tokens, private personopplysninger eller hemmeligheter i JSON-filer eller kode.

## Annonsebilder

Plasser nye bildeannonser i `reklame/`. Valgfri tittel/alttekst legges i `reklame/metadata.json`. Ved push til main vil GitHub Actions finne alle bildene og lage ny `reklame/manifest.json` automatisk i publisert versjon. Forsiden velger tilfeldig 4–5 ulike reklamer ved hver lasting; én tilfeldig reklame vises på artikkelsiden. Ikke bruk annonseillustrasjoner som dokumentasjon for virkelige forhold.
