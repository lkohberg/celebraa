

## Plan: Neue Event-Optionen (Tagesablauf, Dresscode, Google Maps, Kinder, Hotels)

### Zusammenfassung
Fünf neue Features für den Event-Konfigurator und die Event-Anzeige:
1. **Tagesablauf** -- vertikaler Zeitstrahl mit Uhrzeiten und Beschreibungen
2. **Dresscode** -- optionale Auswahl (z.B. Casual, Smart Casual, Elegant, Black Tie)
3. **Google Maps** -- eingebettete Karte beim Veranstaltungsort
4. **Kinder willkommen** -- nur bei Hochzeiten, Auswahl ob Kinder erwünscht/nicht erwünscht
5. **Hotelempfehlungen** -- Liste mit Hotels für Gäste von weiter weg

---

### 1. Datenbank-Migration

Neue Spalten in `events`:
```sql
ALTER TABLE events ADD COLUMN dress_code text;           -- z.B. 'casual', 'smart_casual', 'elegant', 'black_tie'
ALTER TABLE events ADD COLUMN children_welcome boolean;  -- null = nicht angegeben, true/false
ALTER TABLE events ADD COLUMN hotel_recommendations jsonb; -- [{name, address, url?, note?}]
```

Die `schedule`-Spalte existiert bereits als `jsonb` -- wird jetzt aktiv genutzt als `[{time: "14:00", label: "Trauung"}, ...]`.

### 2. ConfigurePage -- Neue Formularfelder

Im Konfigurator (`ConfigurePage.tsx`) werden folgende Abschnitte ergänzt:

**Tagesablauf-Editor**: Dynamische Liste mit +/- Buttons. Jede Zeile hat ein Zeitfeld (Input type="time") und ein Textfeld (z.B. "Empfang", "Kuchen anschneiden"). Die Daten werden als `schedule` JSON gespeichert.

**Dresscode-Auswahl**: Ein `Select`-Dropdown mit Optionen: Keine Angabe, Casual, Smart Casual, Elegant, Black Tie.

**Kinder willkommen** (nur bei `eventType === "wedding"`): Ein Switch/Select mit 3 Zuständen: Keine Angabe, Kinder willkommen, Nur Erwachsene.

**Hotelempfehlungen**: Dynamische Liste mit Name, Adresse, optionaler URL. +/- Buttons zum Hinzufügen/Entfernen.

### 3. Event-Seiten -- Anzeige der neuen Daten

**Tagesablauf-Komponente** (neue Datei `src/components/premium-templates/ScheduleTimeline.tsx`):
- Vertikaler Zeitstrahl mit einer durchgehenden Linie
- Kreismarkierungen an jedem Punkt
- Uhrzeit links, Beschreibung rechts
- Wird in allen 3 Premium-Templates und auch in Basis-Templates eingebunden

**Dresscode-Anzeige**: Wird im Details-Bereich als Icon + Text angezeigt (z.B. Shirt-Icon + "Elegant").

**Google Maps Embed**: Wenn eine Adresse vorhanden ist, wird ein `<iframe>` mit Google Maps Embed API eingebettet. Nutzt die kostenlose Embed-Variante: `https://www.google.com/maps/embed/v1/place?q=ADRESSE&key=API_KEY` oder alternativ die keyless Variante `https://maps.google.com/maps?q=ADRESSE&output=embed`.

**Kinder-Hinweis** (nur Hochzeit): Im Details-Bereich ein dezenter Hinweis "Kinder sind herzlich willkommen" oder "Wir bitten um Verständnis, dass diese Feier nur für Erwachsene geplant ist."

**Hotelempfehlungen**: Eigene Sektion mit Karten-Layout, Name, Adresse und optionalem Link zum Hotel.

### 4. i18n -- Neue Übersetzungen (de.ts, en.ts)

Neue Keys für: Tagesablauf-Labels, Dresscode-Optionen, Kinder-Hinweise, Hotel-Sektion, Google Maps.

### 5. PremiumEventData Interface

Erweitert um: `dress_code`, `children_welcome`, `hotel_recommendations`.

### Dateien die geändert/erstellt werden

| Datei | Aktion |
|-------|--------|
| DB Migration | Neue Spalten |
| `src/components/premium-templates/ScheduleTimeline.tsx` | Neu -- Zeitstrahl-Komponente |
| `src/components/premium-templates/PremiumWeddingPage.tsx` | Erweitern -- Zeitstrahl, Maps, Dresscode, Kinder, Hotels |
| `src/components/premium-templates/PremiumBirthdayPage.tsx` | Erweitern -- Zeitstrahl, Maps, Dresscode, Hotels |
| `src/components/premium-templates/PremiumCorporatePage.tsx` | Erweitern -- Zeitstrahl, Maps, Dresscode, Hotels |
| `src/pages/ConfigurePage.tsx` | Erweitern -- alle neuen Formularfelder |
| `src/i18n/de.ts` | Neue Übersetzungen |
| `src/i18n/en.ts` | Neue Übersetzungen |

