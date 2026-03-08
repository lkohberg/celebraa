

## Umfassende Analyse & Verbesserungsvorschläge für celebra.at

---

### A. Verbleibende Übersetzungsprobleme (i18n)

Folgende Stellen haben noch hardcodierte deutsche Texte, die beim Sprachwechsel nicht umschalten:

1. **`src/pages/Index.tsx` (Zeile 159)**: `"Alle Designs entdecken"` -- nicht übersetzt
2. **`src/pages/SuccessPage.tsx` (Zeilen 67-98)**: Die gesamte "Pending"-Ansicht ist komplett hardcodiert deutsch: "Danke für deine Bestellung!", "Was passiert jetzt?", alle 3 Schritte, "Zum Dashboard", "Zur Startseite"
3. **`src/pages/OrderFlow.tsx`**: Fallback-Texte in `buildPreviewEvent()` sind deutsch: "Empfang", "Zeremonie", "Abendessen", "Party", "Herren:/Damen:", "Eure Geschichte wird hier erzählt", "Hotel Beispiel", "Musterstraße 1"
4. **`src/pages/OrderFlow.tsx` (Zeile 660)**: Placeholder `"z.B. 80"` statt `t("order.maxGuestsPlaceholder")`
5. **`src/pages/ConfigurePage.tsx`**: Mehrere hardcodierte Strings:
   - Zeile 195: `"Fehler beim Erstellen der Zahlung"`
   - Zeile 211: `"Fehler beim Erstellen"`
   - Zeile 319: `"Uhr"` im Preview
   - Zeile 347: `"inkl. Essenspräferenzen (Vegetarisch, Vegan, …)"`
   - Zeile 396: `"Premium-Details"`
   - Zeile 400-401: `"Intro-Animation"`, `"Öffnungsanimation vor der Einladung"`
   - Zeile 467: `"Klicken oder ziehen zum Ersetzen"`
   - Zeile 474: `"Bild hierher ziehen oder klicken"`
6. **`src/data/blocks.ts`**: Alle Block-Names und Descriptions sind deutsch (z.B. "Wunschliste / Geschenke", "Ablauf als Zeitstrahl") -- diese werden in OrderFlow und Dashboard angezeigt
7. **`src/components/premium-templates/RsvpForm.tsx` (Zeile 58)**: `"Error submitting RSVP"` -- englisch hardcodiert statt `t()`
8. **Font-Options** in OrderFlow und ConfigurePage: `"Georgia (Klassisch)"` statt übersetzt

---

### B. Fehlende Funktionalität

1. **Kein Dark Mode Toggle**: CSS-Variablen für `.dark` existieren, aber es gibt keinen Toggle/Switch im UI
2. **Kein Password-Reset**: AuthDialog hat Login und Register, aber keinen "Passwort vergessen"-Flow
3. **Kein Event-Editieren**: Nach Erstellung kann ein Event nicht bearbeitet werden (Titel, Datum, Blöcke etc.)
4. **Kein Logout auf Mobile**: Im Mobile-Menu fehlt der Logout-Button wenn eingeloggt
5. **ConfigurePage ist redundant**: Es gibt sowohl ConfigurePage als auch OrderFlow -- ConfigurePage scheint ein alter Flow zu sein, der parallel existiert, was verwirrend sein könnte
6. **Kein "Passwort bestätigen"-Feld** bei der Registrierung
7. **Keine E-Mail-Verifizierung**: Nach der Registrierung wird nicht klar kommuniziert, ob eine Bestätigungs-E-Mail gesendet wurde
8. **Kein Cookie-Banner**: DSGVO-relevant, Datenschutzerklärung erwähnt Cookies, aber es gibt keinen Consent-Banner
9. **Keine Kontakt-/Support-Seite**: Nur E-Mail im Footer/Impressum
10. **Admin-Check unsicher**: `user.email === "admin@celebra.at"` ist clientseitig und manipulierbar -- sollte über eine Rollen-Tabelle mit RLS abgesichert sein

---

### C. Design & UX Verbesserungen

#### Desktop
1. **Hero-Section**: Kein visuelles Element (Bild/Illustration/Mockup) -- nur Text + Buttons. Ein Screenshot/Mockup einer Einladung würde den Wert sofort zeigen
2. **Navbar**: Kein aktiver Zustand bei Nav-Links, keine Smooth-Scroll-Hervorhebung
3. **Templates-Section auf Index**: Zeigt Templates ohne Kategorie-Beschreibung (die TemplatesPage hat sie, Index nicht)
4. **Footer**: Sehr minimal -- keine Social Links, kein Newsletter, kein "Kontakt"-Link
5. **OrderFlow Step 3 (Preview)**: Die Sidebar mit Preisübersicht ist auf Desktop links, Preview rechts -- ungewöhnliches Layout, Sidebar sollte rechts sein
6. **Dashboard**: Kein visueller Indikator/Chart für Analytics -- nur Zahlen in Karten
7. **Comparison Table**: Nur Icons, keine Erklärung bei Hover was "partial" bedeutet

#### Mobile
1. **OrderFlow Step-Indicators**: Auf Mobile werden nur Nummern gezeigt statt Labels -- gut, aber kein visueller Fortschrittsbalken
2. **Dashboard EventDetail Tabs**: Tabs können bei vielen Tabs (Analytics, Guests, Music, Payment) überlaufen ohne horizontales Scrolling
3. **OrderFlow Price Sidebar**: Auf Mobile nicht sticky/visible -- der User sieht den Preis nicht beim Scrollen durch Blöcke
4. **Template-Karten**: Auf kleinem Bildschirm kein horizontales Swiping, nur vertikales Stacking
5. **Comparison Table**: Auf Mobile wird "celebra.at" durch "✦" ersetzt -- nicht selbsterklärend

---

### D. Performance & Technische Verbesserungen

1. **Hero-Bilder**: 9 hochauflösende JPGs in `src/assets/` -- könnten lazy-loaded oder in WebP konvertiert werden
2. **ConfigurePage**: 763 Zeilen -- sollte in kleinere Komponenten aufgeteilt werden
3. **OrderFlow**: 908 Zeilen -- ebenfalls zu groß, könnte in Step-Komponenten aufgeteilt werden
4. **Keine Error Boundaries**: Wenn ein Premium-Template fehlschlägt, crasht die ganze App
5. **Kein Loading-Skeleton**: Lazy-loaded Pages haben `fallback={null}` -- besser wäre ein Skeleton/Spinner

---

### E. Empfohlene Prioritäten

**Hoch (Bugs/Pflicht)**:
1. SuccessPage Pending-View übersetzen
2. Verbleibende hardcodierte Strings in Index, OrderFlow, ConfigurePage übersetzen
3. Block-Names/Descriptions in `blocks.ts` lokalisieren
4. Admin-Check auf serverseitige Rollen umstellen (Sicherheit)

**Mittel (UX)**:
5. Hero-Mockup/Bild hinzufügen
6. Password-Reset im AuthDialog
7. Cookie-Consent-Banner
8. Event-Editierung im Dashboard
9. Price Sidebar auf Mobile sticky machen

**Niedrig (Nice-to-have)**:
10. Dark Mode Toggle
11. Analytics-Charts im Dashboard
12. Social Links im Footer
13. Loading Skeletons
14. ConfigurePage entfernen oder mit OrderFlow zusammenführen

