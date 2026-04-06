

# Visual Audit: Hochzeits-Templates — Was fehlt

## Befund nach Code-Analyse

Alle drei Wedding-Templates (Floral Romance, Classic Elegance, Modern Love) rendern exakt denselben `PremiumWeddingPage`-Code. Der einzige Unterschied: 3 Farbwerte und 1 Font. Das ist das Kernproblem.

---

## 1. Drei Templates, ein Layout — null Differenzierung

**Problem:** Ein User, der "Floral Romance" vs. "Modern Love" vergleicht, sieht dasselbe Layout mit anderen Farben. Das fühlt sich nicht nach Auswahl an, sondern nach Farbwechsel.

**Lösung:** Jedes Template bekommt eigene visuelle DNA:

- **Floral Romance:** Botanische SVG-Ornamente als Section-Divider (Blätter, Ranken statt der generischen `FloralDivider`). Weiche, organische Formen. Hero-Text mit floraler Umrahmung.
- **Classic Elegance:** Geometrische, symmetrische Ornamente. Doppelte Rahmenlinien. Serif-dominiertes Layout mit mehr Weissraum. Goldene Akzentlinien.
- **Modern Love:** Keine Ornamente. Clean, asymmetrisches Layout. Sans-serif. Große, mutige Typografie. Minimale Dekoration, stattdessen starke Kontraste und negative Space.

**Impact:** Templates fühlen sich wie echte Produkte an, nicht wie Skins.

---

## 2. Countdown Timer — zu generisch

**Problem:** Nackte Zahlen ohne visuellen Container. Kein Unterschied zu einem Countdown auf irgendeiner Website.

**Lösung:**
- Zahlen in elegante Cards mit `backdrop-blur`, Border und einem subtilen Schatten setzen
- Trennzeichen zwischen den Einheiten (z.B. ":" oder dekorative Punkte)
- Template-spezifische Variante: Floral bekommt einen sanften Rahmen mit Blatt-Ecken, Classic bekommt einen goldenen Doppelrahmen, Modern bekommt ein cleanes Pill-Design

**Impact:** Der Countdown wird zum Blickfang statt zu nackter Information.

---

## 3. RSVP-Formular — Kontaktformular-Ästhetik

**Problem:** Placeholder-only Inputs, keine Labels, kein visueller Container, kein emotionaler Bezug. Die Attendance-Buttons sind generische Kästen. Kein Feedback nach dem Absenden ausser einem Toast.

**Lösung:**
- Floating Labels statt nur Placeholder
- Attendance-Auswahl als stilvolle Icon-Buttons mit Animationen (Herz für "Ja", sanftes X für "Nein")
- Das gesamte Form in eine elegante Card mit leichtem Schatten und Border einbetten
- Nach Submit: Inline-Erfolgsanzeige mit Animation (z.B. Herz-Konfetti oder eleganter Checkmark) statt nur Toast
- Visuell zum Template passend stylen (Ornamente, Farben)

**Impact:** RSVP wird zu einem emotionalen Moment statt zu einer Pflichtübung.

---

## 4. Section-Übergänge — harter Farbwechsel

**Problem:** Jede Section hat einen anderen `backgroundColor`, aber die Übergänge sind harte Kanten. Das wirkt abgehackt.

**Lösung:**
- SVG Wave-Divider oder sanfte Kurven-Shapes zwischen Sections einfügen
- Template-spezifisch: Floral = organische Wellen, Classic = elegante Doppellinie, Modern = diagonaler Schnitt
- CSS `background: linear-gradient(...)` an den Übergangsstellen nutzen

**Impact:** Die Seite fliesst wie ein zusammenhängendes Erlebnis statt einzelner Blöcke.

---

## 5. Timeline — Desktop-Layout auf Mobile

**Problem:** Die alternierende Links/Rechts-Timeline (`isLeft = i % 2 === 0`) ist auf Mobile problematisch — Text wechselt die Seite, der Lesefluss wird unterbrochen. Die Zeitangabe steht unter dem Label statt prominent daneben.

**Lösung:**
- Auf Mobile: Einheitlich linksbündige Timeline (Linie links, Content rechts)
- Zeitangabe in einer eigenen kleinen Card/Badge prominent darstellen
- Desktop: Alternierend beibehalten, aber mit Cards statt nacktem Text

**Impact:** Timeline wird auf allen Geräten intuitiv lesbar.

---

## 6. Footer — verpasste Chance

**Problem:** Nur Name + Datum. Kein emotionaler Abschluss, kein "Add to Calendar", kein Call-to-Action.

**Lösung:**
- Emotionaler Closing-Text (z.B. "Wir freuen uns auf euch" — konfigurierbar)
- "Add to Calendar"-Buttons (Google Calendar, Apple Calendar, .ics Download)
- Dezentes celebra.at Branding mit "Made with ♥"

**Impact:** Der User verlässt die Seite mit einem guten Gefühl und hat den Termin im Kalender.

---

## 7. Details-Karten (Zeremonie/Empfang) — identische Karten

**Problem:** Beide Karten sehen exakt gleich aus (gleiche Icons, gleiche Farbe, gleicher Stil). Es gibt keinen visuellen Unterschied zwischen Zeremonie und Empfang.

**Lösung:**
- Unterschiedliche Icons (z.B. Kirche/Kapelle für Zeremonie, Champagnerglas für Empfang)
- Uhrzeitangabe prominent einbauen
- Optional: kleines Foto/Illustration des Ortes

**Impact:** Information wird sofort unterscheidbar und visuell reicher.

---

## 8. Slideshow — kein Touch-Support, kein Lightbox

**Problem:** Nur Auto-Play mit Dot-Navigation. Kein Swipe auf Mobile. Kein Fullscreen/Lightbox bei Tap. Keine Bildunterschriften.

**Lösung:**
- Touch-Swipe-Gesten via framer-motion `drag="x"` oder ein leichtgewichtiges Carousel
- Tap auf ein Bild öffnet es im Fullscreen-Overlay mit Pinch-to-Zoom
- Optional: Bildunterschriften unter jedem Foto

**Impact:** Gäste interagieren mit den Fotos statt sie nur passiv zu sehen.

---

## Empfohlene Umsetzungsreihenfolge

| Prio | Feature | Aufwand |
|------|---------|---------|
| 1 | Section-Divider (SVG Waves) | Klein |
| 2 | Countdown Timer Redesign (Cards + Separatoren) | Klein |
| 3 | Template-spezifische Ornamente/Divider | Mittel |
| 4 | RSVP-Formular Redesign | Mittel |
| 5 | Timeline Mobile-Layout Fix | Klein |
| 6 | Footer mit Add-to-Calendar | Klein |
| 7 | Slideshow Swipe + Lightbox | Mittel |
| 8 | Detail-Karten Differenzierung | Klein |

---

Sag mir welche Punkte ich umsetzen soll — einzeln oder alle auf einmal.

