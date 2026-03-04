

## Plan: Erweiterte Hauptseite mit Marketing-Sektionen + Dietary Preferences

### Was wird gemacht

Die Hauptseite bekommt mehrere neue Marketing-Sektionen zwischen den bestehenden Bereichen. Zusätzlich wird die Menüauswahl im RSVP-Formular und in der Konfiguration um konkrete Dietary-Optionen erweitert (vegetarisch, vegan, glutenfrei, etc.). Der CSV/Excel-Export im Dashboard zeigt diese Daten ebenfalls an.

### Neue Sektionen auf der Hauptseite (Index.tsx)

Die Reihenfolge wird: Hero → FeatureGrid → **ComparisonTable** → **USPSection** → **EcoSection** → Templates → Footer

1. **ComparisonTable** – Neue Komponente `src/components/ComparisonTable.tsx`
   - Vergleichstabelle: Papier-Einladung vs. WhatsApp vs. celebra.at
   - Zeilen: Kosten, Professionelles Design, RSVP-Tracking, QR-Code, Menüauswahl, Mehrsprachig, Umweltfreundlich, Persönlicher Dashboard-Link, Excel-Export, Automatische Gäste-Verwaltung
   - Papier und WhatsApp bekommen ✗ oder teilweise ✓, celebra.at bekommt überall ✓
   - Animiert mit framer-motion

2. **USPSection** – Neue Komponente `src/components/USPSection.tsx`
   - Grid mit 6 USP-Karten:
     - **Bis zu 80% günstiger** als traditionelle Einladungsservices
     - **Keine Qualitätskompromisse** – Premium-Designs von Profis
     - **Gratis QR-Code** bei jedem Paket inklusive
     - **Jede Sprache** – Einladungen in beliebiger Sprache
     - **Persönlicher Dashboard-Link** – Zu-/Absagen + Essenswünsche live einsehen
     - **Excel-Export** – Alle Gästedaten mit einem Klick exportieren

3. **EcoSection** – Neue Komponente `src/components/EcoSection.tsx`
   - Sektion mit Leaf-Icon und Nachhaltigkeits-Message
   - "Jede digitale Einladung spart Papier und reduziert deinen CO₂-Fußabdruck"
   - Statistik-Badges: z.B. "0 Papier", "0 CO₂", "100% Digital"

### Dietary Preferences (Essenswünsche)

4. **RsvpForm.tsx** – Menüauswahl erweitern
   - Statt freiem Textfeld: Dropdown/Radio mit Optionen: Standard, Vegetarisch, Vegan, Glutenfrei, Laktosefrei
   - Wird in `menu_choice` Feld der `guests`-Tabelle gespeichert (existiert bereits)

5. **ConfigurePage.tsx** – Neue Option im RSVP-Bereich
   - Wenn `menuSelection` aktiv: Hinweis dass Gäste zwischen dietary options wählen können
   - Label anpassen: "Essenswünsche abfragen (vegetarisch, vegan, glutenfrei...)"

6. **AdminDashboard.tsx** – Dietary-Info anzeigen
   - In der Gästeliste: `menu_choice` Badge anzeigen wenn vorhanden
   - CSV-Export: Bereits existierende Daten werden mit exportiert (menu_choice Spalte)

### i18n

7. **de.ts + en.ts** – Alle neuen Strings für:
   - Comparison-Tabelle (Zeilen-Labels, Spaltenüberschriften)
   - USP-Sektion (6 Titel + 6 Beschreibungen)
   - Eco-Sektion (Headline, Beschreibung, Badges)
   - Dietary-Optionen (Standard, Vegetarisch, Vegan, Glutenfrei, Laktosefrei)

### Dateien

| Aktion | Datei |
|--------|-------|
| Neu | `src/components/ComparisonTable.tsx` |
| Neu | `src/components/USPSection.tsx` |
| Neu | `src/components/EcoSection.tsx` |
| Edit | `src/pages/Index.tsx` – neue Sektionen einbinden |
| Edit | `src/components/premium-templates/RsvpForm.tsx` – Dropdown statt Freitext |
| Edit | `src/pages/ConfigurePage.tsx` – Label anpassen |
| Edit | `src/pages/AdminDashboard.tsx` – menu_choice anzeigen |
| Edit | `src/i18n/de.ts` – neue Strings |
| Edit | `src/i18n/en.ts` – neue Strings |

Keine Datenbank-Änderungen nötig – `menu_choice` existiert bereits als Text-Feld in der `guests`-Tabelle.

