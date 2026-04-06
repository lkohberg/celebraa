

## Premium Event-Seiten Upgrade — mit Funktionalitäts-Garantie

### Bestandsaufnahme: Alle bestehenden Features

Jedes Template hat diese Funktionalitäten, die **1:1 erhalten bleiben**:

**Wedding:** EnvelopeIntro → Hero (mit/ohne Bild) → BackgroundMusic → Countdown → Story → CustomIllustration → Slideshow → ScheduleTimeline → FoodMenu → DressCode → Details (Ceremony + Reception + Children + GoogleMaps) → HotelRecommendations → VideoMessage → Shuttle → Wishlist → MusicPro → RSVP → Footer

**Birthday:** GiftBoxIntro → Hero → BackgroundMusic → Countdown → Story → ScheduleTimeline → FoodMenu → DressCode → Details (Venue + GoogleMaps) → HotelRecommendations → VideoMessage → Quiz → Games → Potluck → Wishlist → MusicWish → RSVP → Footer

**Corporate:** BadgeScanIntro → Hero → BackgroundMusic → Countdown → About → ScheduleTimeline → Agenda → FoodMenu → Details (Location + DressCode + GoogleMaps) → HotelRecommendations → VideoMessage → Products → Sponsors → RSVP → Footer

**Shared Components:** CountdownTimer, RsvpForm (mit companion management, menu selection, guest name sync), ScheduleTimeline (alternating left/right), GoogleMapsEmbed, HotelRecommendations

---

### Umsetzungsplan

#### 1. CountdownTimer — 3 Varianten (neuer `variant` Prop)

Bestehende Props bleiben: `targetDate`, `targetTime`, `className`, `lang`. Neuer optionaler Prop: `variant`.

- **Wedding (`"elegant"`):** Zahlen in feinen Kreisbögen (SVG ring), Serif-Font, sanfte opacity-Animation beim Sekundenwechsel
- **Birthday (`"bold"`):** Große farbige Kacheln mit Schatten, abgerundete Ecken, leichter scale-bounce bei Sekundenwechsel
- **Corporate (`"minimal"`):** Einzeilige Darstellung `23d : 04h : 12m`, Monospace-Font, kein vertikales Layout

Default (kein variant): aktuelles Verhalten bleibt identisch.

#### 2. ScheduleTimeline — Template-spezifische Styles (neuer `variant` Prop)

Bestehende Props bleiben: `schedule`, `accentColor`. Neuer optionaler Prop: `variant`.

- **Wedding:** Zartere Dot-Styles, florale Akzente an den Verbindungslinien
- **Birthday:** Farbigere Dots, leicht größere Abstände, playful rounded Cards um jeden Eintrag
- **Corporate:** Horizontale statt vertikale Timeline auf Desktop, kompakte Liste auf Mobile

Default: aktuelles alternating Layout bleibt.

#### 3. Sektions-Backgrounds & Dividers pro Template

Neue Datei: `SectionDivider.tsx` mit `variant` Prop.

- **Wedding:** SVG-Wellen-Divider zwischen Sektionen, botanische SVG-Ornamente an Sektionsrändern
- **Birthday:** Diagonale Schnitte via `clip-path`, Konfetti-Burst am Sektionsende
- **Corporate:** Thin accent-line mit Fade-Gradient

Jedes Template-File (`PremiumWeddingPage`, `PremiumBirthdayPage`, `PremiumCorporatePage`) bekommt template-spezifische Hintergrund-Patterns statt der identischen `radial-gradient` Dots.

#### 4. RsvpForm — Visuelle Varianten

Bestehende Logik bleibt komplett identisch (submitRsvp, companion management, menu selection, guest name sync, deadline display). Nur das Styling ändert sich pro Variant:

- **Wedding:** Underline-Inputs statt bordered, Script-Font für Überschrift, dezente Herz-Animation bei Submit-Success
- **Birthday:** Rounded pill-Inputs, farbigere Toggle-Buttons, Konfetti-Animation bei Submit
- **Corporate:** Label-Float-Inputs, scharfe Ecken, professioneller Checkmark bei Submit

#### 5. Template-spezifische Layout-Anpassungen

Kein Entfernen oder Umordnen von Sektionen. Nur:
- **Wedding:** Sektionen bekommen mehr vertikalen Atem (py-32 statt py-24), florale Ornamente als absolute-positioned SVGs
- **Birthday:** Leicht asymmetrische Sektionen (alternierend links/rechts-aligned), bunte Akzente
- **Corporate:** Engeres Spacing, Grid-basierte Card-Layouts für Details

---

### Funktionalitäts-Checkliste

Jede Änderung wird gegen diese Liste geprüft:

- [ ] Alle `hasBlock()` Checks und Block-Rendering identisch
- [ ] Intro-Animationen (Envelope, GiftBox, BadgeScan) unverändert
- [ ] `onIntroComplete` Callback funktioniert
- [ ] RSVP: companion count/names, menu selection, guest name sync, deadline
- [ ] CountdownTimer: Zeitberechnung, interval cleanup
- [ ] ScheduleTimeline: alternating layout, animation
- [ ] GoogleMapsEmbed: address encoding
- [ ] HotelRecommendations: links, notes
- [ ] Theme-Farben (primary, secondary, accent, font) werden durchgereicht
- [ ] i18n labels (eventLabels + t()) funktionieren
- [ ] `isDemo` Flag wird korrekt weitergegeben
- [ ] `GuestNameProvider` wrapping bleibt
- [ ] Hero-Bilder (mit/ohne) funktionieren
- [ ] Children welcome (Wedding only) bleibt
- [ ] Dress code display (Corporate) bleibt

### Betroffene Dateien

| Datei | Änderung |
|---|---|
| `CountdownTimer.tsx` | Neuer `variant` Prop, 3 Render-Pfade |
| `ScheduleTimeline.tsx` | Neuer `variant` Prop, 3 Styles |
| `RsvpForm.tsx` | Styling-Varianten (Logik identisch) |
| `SectionDivider.tsx` | **Neu** — SVG-basierte Sektions-Trenner |
| `PremiumWeddingPage.tsx` | Dividers + Ornamente + Variant-Props |
| `PremiumBirthdayPage.tsx` | Dividers + Clip-Paths + Variant-Props |
| `PremiumCorporatePage.tsx` | Dividers + Grid-Layouts + Variant-Props |

Keine DB-Änderungen. Keine neuen API-Calls. Keine Änderungen an Block-Komponenten, Intros oder Hooks.

