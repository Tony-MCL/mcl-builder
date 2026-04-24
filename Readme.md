Vi skal starte et helt nytt prosjekt fra scratch: en web-basert website builder / adminplattform for Morning Coffee Labs.

Viktig bakgrunn:
Vi forsøkte tidligere å bygge en prototype, men prosjektet ble slettet fordi arbeidsflyten ble for rotete. Problemet var ikke idéen, men at vi blandet GitHub, Codespaces, lokal/dev-preview og terminalbasert filoverskriving. Det skal vi IKKE gjøre igjen.

Denne gangen skal vi ha én tydelig arbeidsflyt:

1. GitHub repo er hovedarbeidsflate
- Filredigering gjøres primært i GitHub-repoet.
- Commit/push gjøres via GitHub.
- Deploy skjer via GitHub Pages og GitHub Actions.
- Vi tester resultatet via deployed Pages.
- Codespaces/terminal brukes kun når det er nødvendig:
  - npm install
  - build-test hvis nødvendig
  - pakkeinstallasjon
  - Firebase-oppsett ved behov
  - ikke som daglig filredigeringsflate med mindre vi eksplisitt bestemmer det.

2. Brukeren kan ikke kode
Derfor må all kode leveres som:
- komplette filer som kan erstatte eksisterende filer
eller
- presise endringer med nøyaktig plassering:
  - “Finn denne linjen…”
  - “Erstatt denne blokken…”
  - “Legg inn dette rett under…”

Ikke gi løse kodebiter uten klar plassering.

3. Ingen canvas/tekstdokument for store kodeleveranser
I forrige forsøk ble filer avkuttet eller ufullstendige når kode ble levert via canvas/tekstdokument. Denne gangen skal kode leveres direkte i chatten som hele filer eller presise blokker.

Prosjektmål:
Vi skal bygge en web-basert website builder som på sikt skal kunne erstatte hele eksisterende Morning Coffee Labs-nettstedet.

Dette er ikke bare en enkel CMS.
Dette skal bli en kontrollplattform for nettstedet gjennom hele levetiden.

Systemet skal på sikt inneholde:
- public website
- admin/kontrollpanel
- visual page builder
- sideadministrasjon
- produktsider
- kontakt/om oss/legal-sider
- meldinger fra nettstedet
- e-post eller meldingsinnboks
- anonym statistikk/diagnostikk
- UTM/kampanjesporing, spesielt QR-koder
- støtte for fremtidig e-handel
- mulighet for senere medlems-/lisensoversikt
- Firebase/Firestore som datalag

Viktig arkitektur:
Builderen skal være del av adminpanelet, ikke et midlertidig byggeprosjekt.

Vi skal ha tydelig skille mellom:
1. Public site
   - det besøkende ser
   - rendres fra data
   - viser forsider, produktsider, kontakt, om oss, legal osv.

2. Admin panel
   - kontrollpanel for eier/admin
   - page builder
   - innholdsstyring
   - meldinger
   - statistikk
   - senere produkter/lisenser/e-handel

3. Data layer
   - Firebase/Firestore
   - pages
   - sections
   - site settings
   - messages
   - analytics events
   - senere products/orders/licenses/users

Teknisk retning:
Vi skal starte i nytt tomt GitHub-repo med React + TypeScript + Vite.
Deploy skal gå til GitHub Pages via GitHub Actions.

Pakker vi vurderer som grunnpakke:
- @dnd-kit/core
- @dnd-kit/sortable
- zustand
- clsx
- lucide-react
- Firebase / Firestore
- eventuelt Radix UI senere for dialogs/dropdowns/popovers
- ikke store UI-frameworks som tar over designet
- ikke full page-builder-pakker som GrapesJS/Builder.io
- ikke rich text editor før vi faktisk trenger det

Viktig prinsipp:
Core builder-logikk skal være vår egen.
Pakker brukes som støtteverktøy, ikke som fundament som overtar arkitekturen.

Første milepæl:
Vi skal ikke hoppe til avanserte features.

Vi starter med:
1. Repo-struktur
2. GitHub Pages workflow
3. Firebase-klart oppsett, men ikke overkomplisert
4. Datamodell for site/pages/sections
5. Public renderer som kan vise en side fra data
6. Admin-shell
7. Enkel page builder i admin:
   - liste sider
   - opprett side
   - velg side
   - legg til seksjon
   - rediger seksjon
   - preview
8. Lagring til Firestore når grunnmodellen er stabil

Viktig læring fra forrige forsøk:
- Ikke bygg for mye før arbeidsflyten er låst.
- Ikke bland flere miljøer.
- Ikke lever kode i format som kan kutte filer.
- Ikke gå videre før build/deploy er grønn.
- Start med fundament og datamodell.
- Inline editing er ønskelig senere, men først når modes, renderer og dataflyt er stabile.
- Preview er viktig og skal bestå.
- Preview kan senere bli arbeidsflate for direkte redigering.
- Venstrepanel skal brukes til struktur, settings og kontroll.
- Preview skal etter hvert kunne brukes til innholdsredigering.

Ønsket utviklingsrekkefølge:
1. Grunnoppsett og deploy
2. Admin/public split
3. Datamodell
4. Renderer
5. Enkel builder
6. Firestore-lagring
7. Strukturpanel
8. Preview/edit mode
9. Inline editing
10. Drag/drop
11. Media library
12. Analytics/UTM
13. Meldinger/kontakt
14. E-handel/lisenser senere

Viktig om brukerens eksisterende nettside:
Det finnes filer fra eksisterende Morning Coffee Labs-nettsted som kan brukes som inspirasjon/testdata, men vi skal ikke bygge direkte videre på gammel kode. Vi bygger nytt, rent og generisk.

Hovedmål:
Dette skal bli plattformen til bedriften på sikt, ikke bare en nettsidebygger-demo.
