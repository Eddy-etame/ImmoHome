# ImmoPro — Next Steps, Amelioration & Outstanding Recommendations

**Companion to**: `start.md` (master plan) and `PROGRESS_2026-05-31.md` (session log)
**Audience**: Next implementing agent / contributor
**Tone**: Concrete, actionable. Skip generalities.

---

## 0. Where We Are

Phases 0, 1, and a Phase 2 lite-pass are complete. The site now builds clean to 14 pages with a leak-free sitemap, full bilingual coverage via a single dictionary, and a typed data layer. **Foundation is solid; the gap to a polished V1 is now mostly content depth + polish + integrations.**

---

## 1. Phase 3 — Content Richness (Next Priority)

> The site is structurally complete but visually sparse. Phase 3 is what makes it *feel* like a premium product.

### 1.1 Homepage Expansion (`src/pages/index.astro`)

Current homepage has 4 sections (hero, featured, stats, engagement, subscribe). Target: 8 sections.

| Add | Notes |
|---|---|
| **"Comment ça marche" process steps** | 3–4 cards with staggered reveal: *Découverte → Visite privée → Négociation → Signature*. Use `--ease-editorial` token, stagger via `transition-delay: calc(var(--i) * 80ms)` |
| **Territory showcase** | Three image-anchored bento cards: Douala (Bonapriso/Bali), Yaoundé (Bastos), Kribi. Each card links to a filtered `/properties?city=` query |
| **Testimonials marquee** | CSS-only marquee (no JS lib). Three to six client quote cards. Mirror MagicUI's marquee visual pattern in pure Astro+Tailwind |
| **Subscribe CTA upgrade** | Replace the `prompt()`-driven subscribe button with an inline `<form>` (email input + submit), client-side validation, persists to `localStorage.immopro_subscribers`. Keep `subscribeForAlerts()` as a fallback for places that still use it |

**Image strategy**: curate 15–20 distinct Unsplash photos (currently we reuse ~4). Recommended search terms: *Douala villa interior*, *Cameroun residential*, *Bonapriso architecture*, *Kribi beachfront*, *African modernist interior*. Use Astro's `<Image>` component from `astro:assets` for responsive serving (you'll need to add `@astrojs/image` if not already pulled).

### 1.2 Property Detail Enrichment (`src/pages/properties/[id].astro`)

Current page has gallery + description + features + film section + booking sidebar. To enrich:

- **Neighborhood description** — paragraph per property describing the quartier (Bonapriso, Bastos, Akwa, Denver…). Add a `neighborhood: { fr, en }` field to the `Property` interface and seed each property.
- **Similar properties** — bottom section, "Voir aussi", 3 cards. Algorithm: filter by `type` OR `city`, exclude self, take top 3 by closest `price`.
- **Map placeholder** — drop in OpenStreetMap or a static Mapbox image; even a styled stylized SVG of Cameroon is fine for V1.
- **Floor plan stub** — single image slot per property (currently absent). Optional but high signal.
- **Specs sidebar** — convert the existing sidebar into a more detailed spec sheet: include features list inline, then add lot size, year built, energy class.

### 1.3 About + Contact Pages

These are still 9-line placeholders (`about.astro`, `contact.astro`). Rebuild:

- **About**: editorial story, founders, three values cards, Cameroon market expertise paragraph, trust signals (transactions count, years active). Use the same `reveal` + `elevate` pattern as the homepage.
- **Contact**: form (name / email / phone / message) wired to localStorage `immopro_contact_messages` for now, with TODO comment for backend. Include WhatsApp link (`https://wa.me/237XXXXXXXX`) — critical for the Cameroon market. Physical address + map placeholder + opening hours.

### 1.4 i18n Dictionary Extension

Phase 3 will add many new strings. Keep the discipline established in Phase 1: every new translatable string **must** live in `src/lib/i18n.ts` and be referenced via `data-i18n` or `t()`. Suggested key namespaces to add:

- `home.process.*` (process step titles + descriptions)
- `home.territory.*` (per-city blurbs)
- `home.testimonials.*`
- `about.*` (full About page copy)
- `contact.*` (form labels + validation messages)
- `property.neighborhood`, `property.similar`, `property.map_caption`

---

## 2. Phase 4 — Animation & Interaction

> Most of the motion plumbing is wired. This phase is about applying it densely + tightening reduced-motion coverage.

### 2.1 Quick Wins

- **Shimmer Button**: add a `.shimmer` utility class that applies a moving linear-gradient over the primary CTAs (`Voir les biens`, `Réserver une visite`). Pure CSS keyframes, ~6 lines.
- **Card Lift Stagger**: on grids of `.property-card.reveal.elevate`, set `style="--i: {index}"` on each card and add `transition-delay: calc(var(--i) * 80ms)` to the `.reveal` rule. Free perceived quality.
- **Heart Pop**: when `toggleFavorite` returns `true` (added), apply a brief `transform: scale(1.25)` + color flash via a small CSS class added/removed in `favorites.ts`.
- **Direction-aware ViewTransitions**: `MainLayout.astro` already sets `data-nav="back"|"forward"` on `<html>`. Add the actual CSS:
  ```css
  @keyframes slide-from-right { from { transform: translateX(24px); opacity: 0 } }
  @keyframes slide-from-left  { from { transform: translateX(-24px); opacity: 0 } }
  [data-nav="forward"]::view-transition-old(page-content) { animation: 280ms slide-from-right }
  [data-nav="back"]::view-transition-old(page-content)    { animation: 280ms slide-from-left }
  ```

### 2.2 Reduced-Motion Discipline

Add a single global guard at the top of `global.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  [data-kinetic] { /* still show final state */ }
}
```

Plus update `initLivelyTextAnimations()` in `MainLayout.astro` to early-return when the user prefers reduced motion (set text content immediately instead of typewriter-animating it).

---

## 3. Phase 5 — Agent Dashboard Upgrade

> The dashboard works but UX is "demo-ware" (browser `prompt()` everywhere). Phase 5 makes it feel professional.

### 3.1 Replace Native Dialogs With Modal Forms

Build a single reusable `<Modal>` component (or pattern) and use it for:

- **New property form** — all fields: title FR/EN, city, price, surface, rooms, bathrooms, type, features FR/EN (comma-separated), image URLs (multiple)
- **Edit property** — same form, pre-populated
- **New client** — name, email, phone, source dropdown (referral / web / agent / other)
- **New appointment** — date picker, client select, property select, status, notes

Use `<dialog>` element (already used in `atelier/` components) — native, accessible, no library needed.

### 3.2 Split `agent.astro`

The file is now ~350 lines. Recommended split:

```
src/pages/agent.astro             ← shell + tabs only
src/components/agent/
  ├── PropertiesTab.astro
  ├── ClientsTab.astro
  ├── AppointmentsTab.astro
  ├── VideosTab.astro
  └── AnalyticsTab.astro
```

Each tab encapsulates its render functions and event handlers. Easier to maintain and review.

### 3.3 Visitor Tracking

Add a tiny `src/lib/analytics.ts`:

```ts
export function recordVisit() {
  if (typeof window === 'undefined') return;
  const today = new Date().toISOString().slice(0, 10);
  const history = JSON.parse(localStorage.getItem('immopro_visitor_history') || '{}');
  history[today] = (history[today] || 0) + 1;
  localStorage.setItem('immopro_visitor_history', JSON.stringify(history));
}
```

Call it from `MainLayout.astro` on initial load + `astro:after-swap`. Then the agent Analytics tab can render a sparkline from the last 30 days.

### 3.4 Optional React Island for the Heaviest Tab

If the property form grows complex (image uploads, validation, etc.), consider a React island:

```bash
npx astro add react
```

Then make `PropertyForm.tsx` a `client:load` island. Worth it only if vanilla JS becomes painful.

---

## 4. Phase 6 — Remotion Integration

> The biggest differentiator. Currently the `immoPro-remotion/` workspace has 3 compositions; none are reachable from the live site.

### 4.1 Design System Sync (Critical)

`immoPro-remotion/src/immoProDesignSystem.ts` currently uses Pro Max tokens (Trust Teal, Cinzel, Josefin Sans). The Astro site uses **Paper & Ink** (OKLCH paper background, ink foreground, Instrument Serif + Inter). Sync to:

```ts
export const immoProColors = {
  background: '#f5f3ee',
  foreground: '#0d0d0d',
  card: '#faf9f6',
  muted: '#e8e5df',
  border: '#d4d0c8',
  accent: '#0F766E',         // teal kept as restricted accent only
  destructive: '#DC2626',
} as const;

export const immoProTypography = {
  heading: 'Instrument Serif, serif',
  body: 'Inter, system-ui, sans-serif',
} as const;
```

Then update all 3 compositions (`PropertyHighlight.tsx`, `AgentBranding.tsx`, `Building3DTour.tsx`) to consume these tokens.

### 4.2 Composition Fixes

Audit findings from `start.md` Section "Remotion Compositions Quality Audit":

- **`PropertyHighlight.tsx`**: hardcoded `fps = 30`. Replace with `const { fps } = useVideoConfig()`.
- **`Building3DTour.tsx`**: imports `Canvas` from `@react-three/fiber` (unused, wrong per Remotion 3D rules). Use `ThreeCanvas` from `@remotion/three`. Add `layout="none"` to any `Sequence` inside `ThreeCanvas`. Implement actual camera position via `useThree` + frame-driven `camera.position.set()`.
- All compositions should be re-tested in `remotion preview` after the design system swap.

### 4.3 Wire to Astro

- Add `@remotion/player` to `immoPro/package.json`.
- Create a React island wrapper `src/components/RemotionEmbed.tsx` that takes a composition id + props.
- Replace the "[Remotion Video Player placeholder]" in `properties/[id].astro` film modal with `<RemotionEmbed compositionId="PropertyHighlight" inputProps={{ property }} client:visible />`.
- Replace the agent dashboard "GÉNÉRER LA VISITE 3D" placeholder preview with a real `<RemotionEmbed compositionId="Building3DTour" />`.

### 4.4 Remotion Lambda (Cloud Rendering)

For MP4 exports without local FFmpeg dependency:

1. Set up AWS IAM user with Lambda + S3 access
2. `npx remotion lambda functions deploy`
3. Add env vars to `.env`: `REMOTION_AWS_ACCESS_KEY_ID`, `REMOTION_AWS_SECRET_ACCESS_KEY`, `REMOTION_AWS_REGION`, `REMOTION_LAMBDA_FUNCTION_NAME`
4. Server-side trigger (out of static-site scope) or a thin Vercel Edge Function endpoint that calls `renderMediaOnLambda` and returns the MP4 URL

For V1, embedding `@remotion/player` is sufficient — defer Lambda to V1.1.

### 4.5 Skill Extraction Before Cleanup

Before deleting the `remotion/` monorepo (if you choose to):

- Copy `remotion/packages/skills/skills/remotion/rules/video-layout.md` → `remotion-skills/skills/remotion/rules/video-layout.md`
- Copy `remotion/packages/skills/skills/remotion/rules/sfx.md` (1857 bytes, larger) over `remotion-skills/skills/remotion/rules/sfx.md` (897 bytes, smaller)
- Check `remotion/packages/skills/skills/remotion/rules/assets/` for asset files referenced by text-animation rules

Then `Remove-Item -Recurse -Force remotion/` is safe.

---

## 5. Phase 7 — Agent Area Hardening

> The agent dashboard at `/agent/` is publicly reachable without authentication. Phase 7 closes this.

### 5.1 Simple Auth Gate (Static-Site Compatible)

Without a backend, use a passphrase-gated client-side check (same pattern as the editorial maintenance area):

```ts
// On /agent/ initial load:
const AGENT_KEY = 'immopro_agent_sess';
if (sessionStorage.getItem(AGENT_KEY) !== '1') {
  const pass = prompt('Code d\'accès agent :');
  if (!pass || (await sha256(pass)) !== EXPECTED_HASH) {
    location.href = '/';
    return;
  }
  sessionStorage.setItem(AGENT_KEY, '1');
}
```

For a real backend later, swap the SHA-256 check for a JWT validation against an API.

### 5.2 Input Sanitization

Audit log rendering already escapes via the `escapeText` helper in `EventLog.astro`. Apply the same discipline anywhere user-typed content gets rendered: `agent.astro` client names, appointment notes, property titles. Currently we use `innerHTML` with template literals — vulnerable to XSS if users paste `<script>` in a property title.

Easiest fix: replace `innerHTML = \`<div>${name}</div>\`` with `textContent` + element creation. Or write a `safe()` helper:

```ts
const safe = (s: string) => s.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]!));
```

And use it on every interpolation in render functions.

### 5.3 LocalStorage Schema Versioning

Currently the schema is implicit — if I change a field on `Property` or `Client`, existing localStorage data may de-serialize incorrectly. Add a version sentinel:

```ts
const SCHEMA_VERSION = 2;
const stored = JSON.parse(localStorage.getItem('immopro_properties_meta') || '{}');
if (stored.version !== SCHEMA_VERSION) {
  // migrate or wipe
}
```

---

## 6. Phase 8 — Final Polish + Verification

### 6.1 Lighthouse Targets

Run on each route, target:

- Performance ≥ 90
- Accessibility ≥ 95
- SEO ≥ 95
- Best Practices ≥ 95

Common fixes you'll likely need:

- `alt` text on all `<img>` (currently many are generic "Main View" etc.)
- Color contrast (some `text-foreground/45` on busy backgrounds fails 4.5:1)
- `<button>` without text need `aria-label`
- Heart toggle button on cards needs `aria-pressed`

### 6.2 Cross-Breakpoint Manual Test

Use Chrome DevTools device emulation at 375 / 768 / 1024 / 1440. Known weak spots:

- Property gallery bento on `[id].astro` collapses awkwardly at 640–768px
- Agent dashboard tab bar can overflow horizontally — already has `overflow-x-auto` but UX is rough
- Heart icon on card stacks behind image hover effects

### 6.3 i18n Final QA

Toggle FR ↔ EN on every page. Verify zero French leaks in EN mode by searching the rendered DOM for accented characters that shouldn't be there (`Réservation`, `Détails`, etc.). The `data-i18n` mechanic already ensures full coverage; this QA catches any newly added unmarked strings.

### 6.4 Dark Mode QA

Toggle OS dark mode. Verify:

- No bright cards leaking in dark mode (agent videos panel has `bg-[#0a0a0a]` hardcoded — intentional but verify it harmonizes)
- Form inputs visible (text contrast on dark inputs)
- Modal dialogs styled in both modes

---

## 7. Cross-Cutting Architectural Suggestions

Beyond the phased plan, here are improvements that touch the whole codebase:

### 7.1 Astro Image Optimization

Currently all images are `<img src="https://...unsplash.com/...">`. Switch to `astro:assets`:

```astro
---
import { Image } from 'astro:assets';
import villa1 from '../assets/villa1.jpg';
---
<Image src={villa1} alt="..." widths={[400, 800, 1200]} sizes="(max-width: 768px) 100vw, 33vw" />
```

Massive LCP improvement. Caveat: you'd need to download a curated set of Unsplash photos into `src/assets/` (legal under their license for personal/commercial use as long as not as standalone product).

### 7.2 Pre-Rendered Locale Variants for SEO

The current client-side i18n means search engines only index the FR variant of each page. For genuine bilingual SEO:

- Option A: duplicate pages under `/en/` (e.g., `/en/properties/p1/`) via `getStaticPaths` returning both `{ id, locale }` combos
- Option B: use Astro's i18n routing helpers (Astro 4.6+) with `defaultLocale: 'fr'`, `locales: ['fr', 'en']`
- Either way, the `lang` prop already exists on `MainLayout` to accept the locale

This was deferred in V1 to keep complexity low. Recommended for V1.1.

### 7.3 Component Composition Discipline

Several files have grown past 200 lines (`agent.astro` ~350, `[id].astro` ~220, `MainLayout.astro` ~290). Refactor opportunities:

- Extract the inline `<script>` in `MainLayout.astro` into `src/lib/main-layout.client.ts` and import it
- Break `agent.astro` into per-tab components (already covered in 3.2)
- Move the property detail gallery bento into `src/components/property/Gallery.astro`

### 7.4 Test Stub

No tests exist yet. For V1.1, add at minimum:

- **Playwright smoke**: visit `/`, click language toggle, verify FR → EN swap on a known element
- **Vitest unit**: test `interpolate()` and `clamp()` from `src/lib/animation.ts`, test `t()` resolution from `src/lib/i18n.ts`, test `getProperties()`/`saveProperties()` round-trip

### 7.5 Component Documentation

Add JSDoc to public-API functions in `lib/`:

- `getFavorites`, `toggleFavorite`, `removeFavorite`, `isFavorited`
- `getProperties`, `saveProperties`, `INITIAL_PROPERTIES`
- `getLocale`, `setLocale`, `t`
- `interpolate`, `clamp`, `Easing`

Helps the next agent and IDE autocomplete.

### 7.6 Skill-Coupled Suggestions

Per the original `start.md` constraints (SEO, GEO, metadata, animations, MagicUI patterns, Remotion):

- **GEO (Generative Engine Optimization)**: add a `<script type="application/ld+json">` `Place` schema per property with `geo.latitude` / `geo.longitude`. Cameroun cities have known coords (Douala 4.0511 / 9.7679; Yaoundé 3.8480 / 11.5021; Kribi 2.9404 / 9.9097). LLM-driven search engines reward this.
- **OG Image generation**: integrate `@vercel/og` (or static images per property) so social shares render branded cards instead of the generic hero photo.
- **MagicUI patterns**: the bento grid in `[id].astro` could be enhanced with the *Marquee*, *Border Beam*, and *Animated Beam* patterns — all CSS-only re-implementations.
- **Editorial typography**: leverage `font-feature-settings` more — add `'ss02'`, `'cv03'` to `body` for Inter's stylistic alternates, or use Instrument Serif's italic 1 for blockquotes.

---

## 8. Recommended Execution Order

If picking up tomorrow, the highest-value-per-hour sequence is:

1. **Phase 3.1 + 3.3** (homepage expansion + About/Contact) — 1 day, transforms perceived quality dramatically
2. **Phase 4.2** (reduced-motion + direction-aware transitions) — 2 hours, low-effort big polish
3. **Phase 5.1** (replace `prompt()`/`confirm()` with modal forms) — 1 day, agent dashboard goes from demo to professional
4. **Phase 6.1 + 6.2 + 6.3** (Remotion design sync + composition fixes + Player embed) — 1–2 days, the differentiator
5. **Phase 7.1 + 7.2** (agent auth gate + input sanitization) — 4 hours, critical for any kind of public deploy
6. **Phase 8** (Lighthouse, cross-device, dark mode QA) — 1 day, final polish

Estimated total: 5–7 productive days to a deploy-ready V1.

---

## 9. Risks & Watch-Outs

- **Image licensing**: if downloading Unsplash photos into the repo, confirm each one's license terms; some require attribution
- **Remotion Lambda costs**: monitor AWS spend if/when enabled — each render costs cents but stacks up
- **localStorage 5MB cap**: the agent dashboard accumulates clients/appointments/properties indefinitely; add a "purge old" affordance before users hit the cap
- **iOS Safari `prompt()` block**: some iOS versions block `prompt()` after user interactions; the agent dashboard prompts should be migrated to modals anyway (Phase 5.1)
- **`@astrojs/sitemap` filter**: any new page added under a non-public route name (e.g., `_drafts/`, `_internal/`) needs to be added to the `filter` exclusion list in `astro.config.mjs`

---

## 10. Outstanding Plan Items (From `start.md`)

Items in the master plan not yet executed and not covered above:

- [ ] Phase 2 — full execution of the Remotion monorepo skill extraction + monorepo deletion (4.5.5 above is the playbook)
- [ ] Phase 3.4 — Astro `<Image>` strategy with downloaded local assets (4.7.1 above)
- [ ] Phase 4.3 — direction-aware ViewTransitions CSS (4.2.1 covered the snippet)
- [ ] Phase 6.4 — Remotion Player React island for the film modal and agent videos tab (4.4.3 covered the wiring)
- [ ] Phase 7 — agent area hardening (5 covered)
- [ ] Phase 8 — final QA pass

---

**End of recommendations.** The codebase is in a healthy, buildable, type-safe, fully-bilingual state. The next agent has a clear runway.
