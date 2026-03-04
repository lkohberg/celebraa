

## Plan: Verbleibende Probleme beheben

Nach Analyse des aktuellen Codes gibt es diese offenen Punkte:

### 1. Basis-Template: Schrift & Farbe aus DB anwenden
**Problem**: Die EventPage rendert das Basis-Template ohne die gespeicherten `font` und `primary_color` Werte aus der Datenbank.
**Lösung**: In `EventPage.tsx` die DB-Werte `event.font` und `event.primary_color` auf den Basis-Template-Container anwenden (Google Fonts laden, `fontFamily` und Farbe setzen).

### 2. RLS-Problem für öffentliche Event-Seiten
**Problem**: `useEventByLink` fragt Events als unauthentifizierter User ab. Die RLS-Policy "Anyone can view live events" erlaubt SELECT nur bei `status = 'live'`. Das sollte funktionieren, aber die Query filtert nicht explizit nach Status — wenn kein User eingeloggt ist und das Event "live" ist, sollte es klappen. **Kein Code-Problem**, aber ein Test ist nötig.

### 3. Dashboard: Event manuell auf "archiviert" setzen
**Problem**: Es gibt keinen Button im Dashboard um ein Event zu deaktivieren/archivieren.
**Lösung**: Im `EventDetail` einen Toggle-Button hinzufügen (Live / Archiviert).

### 4. Success-Page & Dashboard: Nicht übersetzte Texte
**Problem**: Einige Texte sind hardcoded auf Deutsch statt über `t()`.
**Lösung**: Fehlende i18n-Keys in `de.ts` und `en.ts` ergänzen und in den Komponenten verwenden.

---

### Technische Änderungen

| Datei | Änderung |
|-------|----------|
| `src/pages/EventPage.tsx` | Google Font laden, `fontFamily` und `primaryColor` auf Basis-Container anwenden |
| `src/pages/AdminDashboard.tsx` | Archivieren-Button mit `useUpdateEvent` hinzufügen |
| `src/pages/SuccessPage.tsx` | Hardcoded Texte durch `t()` ersetzen |
| `src/i18n/de.ts` + `en.ts` | Fehlende Keys für Success-Page und Dashboard |

### Nicht in diesem Schritt
- **Subdomain-Routing** (`eventname.celebra.at`): Erfordert DNS-Konfiguration und Server-seitige Logik, die außerhalb der App liegt. Kann als separater Schritt geplant werden.

