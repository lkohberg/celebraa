

# Premium Event Pages Overhaul — Implementation Plan

## Problem Analysis

After reviewing all three premium templates (Wedding, Birthday, Corporate) and the basis template, here's what's wrong:

1. **Structural sameness**: All three premium templates follow the exact same section order — Hero → Countdown → Story → Timeline → Details → RSVP → Footer. Same layout rhythm, same spacing, same dot-pattern backgrounds. Only the accent color and divider SVG differ.
2. **Generic backgrounds**: Every section uses the same `radial-gradient dots` or `linear-gradient grid` pattern at 1-2% opacity. It's the same trick repeated 6-8 times per page.
3. **Countdown/RSVP not themed**: `CountdownTimer` and `RsvpForm` ignore the event's `primary_color` — they use hardcoded HSL values or the generic `text-primary` class.
4. **Basis template is bare**: The fallback template is just centered text with an RSVP form. No visual identity at all.
5. **No layout variation**: Cards, sections, and grids are all center-aligned with identical padding. No asymmetry, no full-bleed sections, no visual surprise.

## Plan — 5 Prioritized Changes (all MVP-scoped)

---

### 1. Theme-Aware Countdown & RSVP (Impact: High, Scope: Small)

**Why**: These are the two most interactive parts of every event page, and they currently ignore the user's chosen color.

**Changes**:
- **CountdownTimer.tsx**: Accept `accentColor` prop. Style the numbers with it instead of generic `text-primary`. Add a subtle card/pill background per digit for visual weight.
- **RsvpForm.tsx**: Accept `accentColor` prop. Use it for the submit button, attendance toggle active state, and the divider — instead of the hardcoded per-variant HSL values.
- Update all 3 premium templates + EventPage basis to pass `accentColor`.

---

### 2. Distinct Visual DNA per Template Type (Impact: Critical, Scope: Medium)

**Why**: This is the core complaint — all invitations look the same.

**Wedding** — Romantic, editorial:
- Replace dot-pattern backgrounds with subtle watercolor-like gradient blobs (soft radials, larger, fewer)
- Add parallax-style staggered entrance animations (left/right alternating)
- Use serif typography hierarchy more aggressively (Great Vibes for headings, lighter body)
- Add a decorative border/frame around the hero text area

**Birthday** — Bold, energetic:
- Use diagonal/angled section dividers (CSS clip-path) instead of flat section breaks
- Add floating confetti particles that drift in the background (already have ConfettiParticle, but it's unused after intro)
- Use larger, bolder typography with tighter spacing
- Use gradient text for the title
- Add a subtle gradient wave between sections

**Corporate** — Clean, geometric:
- Use sharp geometric dividers (straight lines, diamond shapes — already have CorpDivider)
- Add a frosted-glass navbar that appears on scroll with event title
- Use a 2-column asymmetric layout for the details section
- Add subtle grid animation in hero (slow-moving grid lines)
- Professional badge/pill design for date/time/location

---

### 3. Elevated Section Backgrounds (Impact: High, Scope: Small)

**Why**: The dot/grid patterns are the #1 source of visual monotony.

**Changes**:
- Create a `SectionBackground` component with 4 variants: `subtle-gradient`, `mesh`, `geometric`, `watercolor`
- Wedding uses `watercolor` (soft blurred blobs)
- Birthday uses `mesh` (vibrant gradient mesh)
- Corporate uses `geometric` (fine grid + diagonal accent line)
- Each section alternates between 2 background styles instead of repeating the same dot pattern

---

### 4. Basis Template Visual Upgrade (Impact: High, Scope: Small)

**Why**: Users who don't pick premium still deserve a polished page.

**Changes**:
- Add a hero section with the event's `primary_color` as a gradient background
- Add a subtle decorative divider
- Style the date/time/location with icon pills (similar to corporate hero)
- Add a fade-in animation on load
- Add a simple footer with event name + date

---

### 5. Animated Section Entrances (Impact: Medium, Scope: Small)

**Why**: Currently sections just appear. Staggered reveals add perceived quality.

**Changes**:
- Create a reusable `RevealSection` wrapper using framer-motion `whileInView`
- Wedding: fade-up with slight scale
- Birthday: slide-in from alternating sides
- Corporate: clean fade with horizontal line wipe
- Apply to all sections in all 3 templates, replacing the current inconsistent `motion.div` wrappers

---

## Implementation Order

1. **CountdownTimer + RsvpForm** theming (touches 2 shared components)
2. **SectionBackground** component (new file, pure visual)
3. **Wedding template** visual rework (apply new backgrounds, typography, animations)
4. **Birthday template** visual rework (clip-paths, confetti, gradient text)
5. **Corporate template** visual rework (geometry, asymmetry, frost navbar)
6. **Basis template** upgrade
7. **Testing** — verify all block combinations still render, RSVP submits, countdown ticks, intros play

## Files to Create/Modify

- `src/components/premium-templates/SectionBackground.tsx` (new)
- `src/components/premium-templates/RevealSection.tsx` (new)
- `src/components/premium-templates/CountdownTimer.tsx` (modify)
- `src/components/premium-templates/RsvpForm.tsx` (modify)
- `src/components/premium-templates/PremiumWeddingPage.tsx` (modify)
- `src/components/premium-templates/PremiumBirthdayPage.tsx` (modify)
- `src/components/premium-templates/PremiumCorporatePage.tsx` (modify)
- `src/pages/EventPage.tsx` (modify — basis template section)

No database changes needed. No new dependencies.

