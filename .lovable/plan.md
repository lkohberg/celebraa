

## Plan: Premium-Paket, Mobile-Optimierung & Mehrsprachigkeit (DE/EN)

Dies ist ein umfangreiches Feature-Set. Ich schlage vor, es in Phasen aufzuteilen. Hier der vollständige Plan:

---

### 1. Paket-System (Basis vs. Premium)

**Konzept:**
- **Basis (€49):** Wie bisher — einfache Event-Seite mit Gradient-Vorschau, RSVP, QR-Code
- **Premium (€99):** Vollständig gestaltete Event-Seite mit Envelope-Animation, Countdown, Story-Sektion, Details-Sektion, RSVP-Formular, Footer — basierend auf dem HTML-Beispiel, als React-Komponente umgesetzt

**Änderungen:**

- `TemplateCard.tsx`: `Template`-Interface erweitern um `tier: "basis" | "premium"` und `premiumFeatures?: string[]`. Neue Premium-Templates pro Kategorie hinzufügen (3x Wedding, 3x Birthday, 3x Corporate = 9 neue Templates). Badge "Premium" auf der Karte anzeigen.

- `ConfigurePage.tsx`: Preis dynamisch basierend auf `template.tier` setzen (Basis=€49, Premium=€99). Bei Premium-Templates zusätzliche Konfigurationsfelder anzeigen (Story-Text, Ceremony/Reception Details, Hero-Bild-Upload).

- `PriceSummary.tsx`: Paket-Tier anzeigen.

- Neue Komponente `src/components/premium-templates/PremiumWeddingPage.tsx`: React-Umsetzung des HTML/CSS/JS-Beispiels mit:
  - Envelope-Intro mit Klick-Animation (framer-motion)
  - Hero-Sektion mit Hintergrundbild
  - Countdown-Timer
  - "Unsere Geschichte" Sektion
  - Veranstaltungsdetails (Trauung, Zeitplan, Feier)
  - RSVP-Formular (verbunden mit Supabase `guests`-Tabelle)
  - Footer

- Ähnliche Premium-Komponenten für Birthday und Corporate:
  - `PremiumBirthdayPage.tsx`: Konfetti-Animation, Party-Countdown, Programm, RSVP
  - `PremiumCorporatePage.tsx`: Clean Business-Design, Agenda, Speaker-Sektion, RSVP

- Neue Route `/e/:eventLink` (öffentliche Event-Seite): Lädt Event aus DB, rendert je nach `template_id` entweder Basis-Template oder Premium-Template. Trackt Analytics.

**DB-Änderung:**
- `events`-Tabelle: Neue Spalten `tier TEXT DEFAULT 'basis'`, `story_text TEXT`, `ceremony_location TEXT`, `ceremony_address TEXT`, `reception_location TEXT`, `reception_address TEXT`, `schedule JSONB`, `hero_image_url TEXT`

---

### 2. Öffentliche Event-Seite (`/e/:eventLink`)

- Neue Page `src/pages/EventPage.tsx`
- Lädt Event via `useEventByLink`
- Rendert Basis- oder Premium-Template basierend auf `tier`
- RSVP-Formular mit `useSubmitRsvp`
- Analytics-Tracking via `useTrackAnalytics`
- Route in `App.tsx` hinzufügen

---

### 3. Mobile-Optimierung

- **Landing Page (Index):** Navbar-Hamburger-Menü für mobile, Template-Grid 1-spaltig auf mobile
- **Dashboard:** Responsive Layout — Event-Liste und Detail-View stacken auf mobile, kompaktere Stat-Cards
- **ConfigurePage:** Form und Preview stacken vertikal auf mobile (bereits teilweise vorhanden, feintuning)
- **Premium-Templates:** Vollständig responsive (das CSS-Beispiel ist bereits teilweise responsive)

---

### 4. Mehrsprachigkeit (DE/EN)

- Neuer `i18n`-Context mit `useTranslation`-Hook
- Translations-Dateien: `src/i18n/de.ts` und `src/i18n/en.ts`
- Language-Switcher in der Navbar (DE/EN Toggle)
- Alle statischen Texte über `t("key")`-Funktion
- Browser-Sprache als Default, mit localStorage-Persistenz

---

### Technische Details

**Dateien die erstellt werden:**
- `src/i18n/index.tsx` — Context + Provider + Hook
- `src/i18n/de.ts` — Deutsche Übersetzungen
- `src/i18n/en.ts` — Englische Übersetzungen
- `src/components/LanguageSwitcher.tsx`
- `src/pages/EventPage.tsx` — Öffentliche Event-Seite
- `src/components/premium-templates/PremiumWeddingPage.tsx`
- `src/components/premium-templates/PremiumBirthdayPage.tsx`
- `src/components/premium-templates/PremiumCorporatePage.tsx`
- `src/components/premium-templates/EnvelopeIntro.tsx`
- `src/components/premium-templates/CountdownTimer.tsx`
- `src/components/premium-templates/RsvpForm.tsx`

**Dateien die geändert werden:**
- `src/App.tsx` — i18n Provider + `/e/:eventLink` Route
- `src/components/TemplateCard.tsx` — Template-Interface + Premium-Templates + Badge
- `src/pages/ConfigurePage.tsx` — Tier-basierte Preise + Extra-Felder
- `src/pages/Index.tsx` — i18n + Mobile-Nav
- `src/pages/AdminDashboard.tsx` — i18n + Mobile-Layout
- `src/components/PriceSummary.tsx` — Tier-Anzeige
- `src/components/HeroSection.tsx` — i18n
- `src/components/Footer.tsx` — i18n
- `src/components/FeatureGrid.tsx` — i18n
- `supabase/functions/create-checkout/index.ts` — Tier-basierte Preise

**DB-Migration:**
- Neue Spalten auf `events`-Tabelle für Premium-Daten

---

### Empfohlene Reihenfolge

Da das sehr viel auf einmal ist, empfehle ich die Umsetzung in dieser Reihenfolge:

1. **DB-Migration + Premium-Templates + Event-Seite** (Kern-Feature)
2. **Mobile-Optimierung** (alle Seiten)
3. **Mehrsprachigkeit** (alle Texte)

Soll ich mit der Umsetzung beginnen?

