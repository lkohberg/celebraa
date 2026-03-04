

## Plan: Premium-Demo zeigt echte Premium-Seite

**Problem:** Die Demo-Vorschau (`DemoPreview.tsx`) zeigt für alle Templates (Basis + Premium) die gleiche einfache Vorschau. Premium-Templates sollten stattdessen die vollständige Premium-Seite rendern.

**Lösung:** `DemoPreview.tsx` anpassen:

1. Wenn `template.tier === "premium"` → statt der einfachen Gradient-Vorschau die entsprechende Premium-Komponente rendern (`PremiumWeddingPage`, `PremiumBirthdayPage`, `PremiumCorporatePage`) mit Demo-Daten
2. Wenn `template.tier === "basis"` → bestehende einfache Vorschau beibehalten
3. Dialog auf `max-w-5xl` vergrößern für Premium-Templates, damit die Seite gut dargestellt wird
4. Demo-Event-Daten generieren basierend auf `template.eventType` (Titel, Datum, Location etc.)

**Dateien:**
- `src/components/DemoPreview.tsx` — Hauptänderung: Premium-Komponenten conditional rendern mit Fake-Event-Daten

