

## Plan: Mehrsprachige Einladungen — bis zu 3 Sprachen pro Event

### Die 11 Sprachen

Die 10 meistgesprochenen Sprachen im europäischen und amerikanischen Raum + Mandarin:

1. **Englisch** (en)
2. **Spanisch** (es)
3. **Portugiesisch** (pt)
4. **Französisch** (fr)
5. **Deutsch** (de)
6. **Italienisch** (it)
7. **Polnisch** (pl)
8. **Rumänisch** (ro)
9. **Niederländisch** (nl)
10. **Türkisch** (tr)
11. **Mandarin** (zh) — 中文

### Konzept

- Auf der Konfigurationsseite wählt der Nutzer bis zu 3 Sprachen aus diesen 11
- Pro gewählte Sprache wird ein eigener Event-Link generiert: `/e/mein-event/de`, `/e/mein-event/en`, etc.
- Die UI-Labels auf der Event-Seite (Buttons, Formularfelder wie "Name", "Ich komme", "Absagen", "Nachricht") werden automatisch in der Sprache des Links angezeigt
- Event-Inhalte (Titel, Beschreibung) werden vom Kunden selbst eingegeben — pro Sprache gleicher Inhalt
- Auf der Success-Seite und im Dashboard werden alle Sprach-Links angezeigt

### Datenbank

Neues Feld in `events`-Tabelle:
```sql
ALTER TABLE events ADD COLUMN languages text[] DEFAULT '{de}';
```

### Dateien

| Aktion | Datei | Was |
|--------|-------|-----|
| **Neu** | `src/i18n/eventLabels.ts` | Statische UI-Labels für alle 11 Sprachen (~15 Strings: Name, E-Mail, Ich komme, Absagen, Nachricht senden, Essenswünsche, etc.) |
| **Edit** | `src/pages/ConfigurePage.tsx` | Sprachauswahl-UI: Chip-basierte Multi-Select (max 3 aus 11). Speichert in `languages`-Feld. Erste Sprache = Default |
| **Edit** | `src/App.tsx` | Neue Route `/e/:eventLink/:lang` |
| **Edit** | `src/pages/EventPage.tsx` | `lang`-Param auslesen, Labels aus `eventLabels.ts` laden, an Templates/RsvpForm durchreichen |
| **Edit** | `src/components/premium-templates/RsvpForm.tsx` | `lang`-Prop akzeptieren, Labels dynamisch aus eventLabels |
| **Edit** | `src/components/premium-templates/PremiumWeddingPage.tsx` | `lang`-Prop durchreichen |
| **Edit** | `src/components/premium-templates/PremiumBirthdayPage.tsx` | `lang`-Prop durchreichen |
| **Edit** | `src/components/premium-templates/PremiumCorporatePage.tsx` | `lang`-Prop durchreichen |
| **Edit** | `src/pages/SuccessPage.tsx` | Alle Sprach-Links anzeigen (aus Event-Daten laden) |
| **Edit** | `src/pages/AdminDashboard.tsx` | Alle Sprach-Links zum Kopieren anzeigen |
| **Edit** | `src/components/ComparisonTable.tsx` | Marketing-Zeile anpassen: "Bis zu 3 Sprachen pro Einladung" |
| **Edit** | `src/components/USPSection.tsx` | USP anpassen: "Bis zu 3 Sprachen" |
| **Edit** | `src/i18n/de.ts` + `en.ts` | Neue Strings für Sprachauswahl-UI + Marketing |

### Sprachauswahl-UI (ConfigurePage)

- Unter den RSVP-Optionen: "Sprachen der Einladung (max. 3)"
- Klickbare Chips mit Flaggen-Emoji + Sprachname
- Ausgewählte Chips sind farbig hervorgehoben
- Vorschau der generierten Links darunter

