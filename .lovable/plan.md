

## Plan: Vollständige DE/EN-Übersetzung der gesamten Seite

### Problem
Viele Komponenten enthalten noch hardcodierte deutsche Texte, die beim Sprachwechsel nicht auf Englisch umschalten. Betroffen sind:

1. **AuthDialog** -- Anmelden, Registrieren, E-Mail, Passwort, Toasts, etc.
2. **HowItWorksDialog** -- Alle 6 Schritte + Untertitel + Preishinweis
3. **OrderFlow** -- Step-Labels, Seitenüberschriften, Formular-Labels, Platzhalter, Preisübersicht, Buttons, Fehler-/Validierungstexte, manuelle Block-Hinweise, AGB-Text
4. **AdminDashboard** -- "Du musst eingeloggt sein", "Wartend auf Bearbeitung", "In Bearbeitung", "Jetzt freischalten", "Musikwünsche", CSV-Headers, Toast-Messages, diverse Labels
5. **BlockConfigurator** -- Alle Section-Titles, Platzhalter, Button-Labels (Zeitpunkt/Gang/Hotel/Route/Wunsch/Item/Frage/Spiel/Sponsor/Produkt hinzufügen)
6. **DemoPreview** -- Demo-Event-Daten (Texte bleiben Deutsch als Demo-Content -- das ist OK)
7. **TemplateCard** -- premiumFeatures Array (Countdown-Timer, Agenda-Sektion, Anmelde-Formular)

### Umsetzung

#### 1. Translation Keys erweitern (~120 neue Keys in `src/i18n/de.ts` und `src/i18n/en.ts`)

Neue Key-Gruppen:
- `auth.*` -- Login/Register Dialog (12 Keys)
- `howItWorks.*` -- How it works Dialog (14 Keys)
- `order.*` -- OrderFlow Seite (40+ Keys: Steps, Headings, Labels, Buttons, Hints, Validation)
- `admin.*` -- AdminDashboard (15 Keys: Pending, Publishing, Music wishes, etc.)
- `blockConfig.*` -- BlockConfigurator (25+ Keys: Section titles, placeholders, add-buttons)
- `templateCard.*` -- Premium feature names (3 Keys)

#### 2. Komponenten-Updates (7 Dateien)

Jede Datei bekommt `useTranslation` import (falls nicht vorhanden) und ersetzt alle hardcodierten Strings durch `t("key")` Aufrufe:

- **`src/components/AuthDialog.tsx`** -- `useTranslation` hinzufügen, alle Strings ersetzen
- **`src/components/HowItWorksDialog.tsx`** -- Steps-Array in Komponente verschieben, damit `t()` Zugriff hat
- **`src/pages/OrderFlow.tsx`** -- STEPS-Array in Komponente, alle ~40 hardcodierten Strings ersetzen
- **`src/pages/AdminDashboard.tsx`** -- Alle deutschen Strings in PendingEventCard, EventDetail, etc.
- **`src/components/BlockConfigurator.tsx`** -- `useTranslation` hinzufügen, Section-Titles & Platzhalter
- **`src/components/TemplateCard.tsx`** -- premiumFeatures dynamisch per Sprache
- **`src/components/DemoPreview.tsx`** -- Demo-Content bleibt deutsch (ist Demo-Daten, kein UI-Text)

#### 3. Nicht betroffen (bereits übersetzt)
- Index, TemplatesPage, ConfigurePage, Footer, SuccessPage, EventPage, HeroSection, FeatureGrid, ComparisonTable, USPSection, EcoSection, PriceSummary, alle Block-Sections (bereits im letzten Update)

