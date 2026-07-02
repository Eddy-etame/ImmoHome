HERE'S A PROJECT THAT HAS MANY GAP AND LAPSES, I WANT YOU TO ANALYSE THE CODEBASE AND FILE AND GAIN YOURE OWN UNDERSTANDING ON THEM. HERE'S THE RESUMTION PROMPT, AND THE IMPLEMENTATION PLAN. THESE SHOULD BE REVIWED, PLAN VALIDATED, AND YOU SHOULD PICK UP WHERE THE OTHER AGENT ENDED AND MAKE SURE YOU FOLLOW THE OUTPUT I EXPECT AT THE END OF THE WORK.
HERE'S THE RESUMTION PROMPT:
network error. plan was validated and you were woking. RESUME EXACTLY WHERE YOU LEFT OFF. REMMEMBER: you are IMPLEMENTING WHAT IS IN THE PLAN WHILE MAKING SURE NOT TO BREAK ANYTHING AND WHILE LINKING INFO SO YOU CA, AFTER FINICHING ON PHASES, PRODUCE AN AMELIORATION, OUTSTANDING AND GENERAL SUGGESTION FILE FOR NEXT STEPS.
REMEMBER you are an expert in SEO, GEO, metadata, astro + react coding, Css, animations, remotion, ui/ux pro-max, using skills and linking them, magic ui, designs, transitions, and artistic direction.

HERE'S THE PLAN:
# ImmoPro — NEW Implementation Plan (Post-Audit, User-Reviewed)

**Date**: 2026-05-31  
**Status**: Incorporating ALL user feedback from first audit review  
**Files Analyzed**: 45+ across all 9 workspace directories + all skill files read in full  
**Priority**: FOUNDATION FIXES FIRST (confirmed by user)

---

## Confirmed Decisions (From Your Review)

| Decision | Your Answer | Impact |
|----------|-------------|--------|
| Design system | **Keep Paper & Ink** + integrate Pro Max UX rules | Astro keeps OKLCH palette + Instrument Serif + Inter; Remotion compositions need design system sync |
| Backend | **Stay localStorage for V1** | No Express/MongoDB wiring yet — focus on polished frontend |
| Remotion rendering | **Whichever is smoother for deployment** | Remotion Lambda (cloud) recommended — generates MP4s without local FFmpeg dependency |
| Delete Remotion monorepo | **Yes, but extract ALL skills first** | Must copy video-layout.md + updated sfx.md from monorepo to remotion-skills before deletion |
| Short-spectrum | **Analyze it** | ✅ CONFIRMED: Empty Astro 6 starter scaffold (npm create astro -- --template minimal). Only contains a default <h1>Astro</h1> page. **Not related to ImmoPro.** Safe to ignore or delete. |
| Phase priority | **Foundation fixes** | Phase 0 + Phase 1 first |
| Read MagicUI skill | **Must do** | ✅ Done — full SKILL.md + references/components.md + references/recipes.md read |
| Read Remotion skill | **Must do** | ✅ Done — full SKILL.md + 6 key rule files read (tailwind, text-animations, 3d, transitions) |
| Consolidate research docs | **Fix this** | 14 overlapping/contradictory files → consolidate into 1 canonical reference |
| Add .env.example | **Do it** | Will document all expected env vars |
| TypeScript properly | **Do it** | Eliminate all any types, add interfaces |
| Version control | **Do it** | Ensure .gitignore complete, regular commits |
| Preface dark mode | **Fix preface + prefers-color-scheme: dark** | Both CSS and JS fixes needed |

---

## What Changed Since First Audit (Additional Research)

### Short-Spectrum: Confirmed Empty
[short-spectrum/](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/short-spectrum) is an unmodified Astro 6.4.2 minimal starter. The [index.astro](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/short-spectrum/src/pages/index.astro) contains only <h1>Astro</h1>. **Zero relation to ImmoPro.** It can be safely deleted or ignored.

### Remotion Monorepo Skills vs remotion-skills: Diff Found

The monorepo at remotion/packages/skills/ has **36 rule files** while remotion-skills/ has **35 rule files**. Differences:

| File | remotion-skills | monorepo | Action |
|------|----------------|----------|--------|
| video-layout.md (4.1KB) | ❌ Missing | ✅ Present | **Must copy to remotion-skills before deletion** |
| sfx.md | 897 bytes | 1857 bytes (larger, more content) | **Must overwrite with monorepo version** |
| All other 34 files | ✅ Identical sizes | ✅ Identical sizes | No action needed |

### MagicUI Skill — Key Constraint for Astro

The [MagicUI SKILL.md](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/magicui/skills/magic-ui/SKILL.md) specifies:
> "Project should be **React/Next.js with Tailwind CSS**. shadcn must be initialized before adding registry components."

**This means we CANNOT directly use npx shadcn@latest add @magicui/...** in our Astro project because:
1. Astro is not React/Next.js — MagicUI components are React components
2. We don't have shadcn initialized in immoPro (no components.json)
3. Our Astro project uses plain .astro files, not React

**Strategy**: We will **study MagicUI component patterns** (from [recipes.md](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/magicui/skills/magic-ui/references/recipes.md) and the registry) and **re-implement the visual effects in pure Astro + Tailwind + vanilla JS**. For interactive islands where React is justified (agent dashboard, property search), we can install MagicUI components via React islands (client:load).

### Remotion Design System Mismatch — Critical Finding

[immoProDesignSystem.ts](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro-remotion/src/immoProDesignSystem.ts) uses the **Pro Max palette** (Trust Teal #0F766E, Cinzel, Josefin Sans) — NOT the Paper & Ink system we're keeping.

All 3 Remotion compositions ([PropertyHighlight](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro-remotion/src/compositions/PropertyHighlight.tsx), [AgentBranding](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro-remotion/src/compositions/AgentBranding.tsx), [Building3DTour](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro-remotion/src/compositions/Building3DTour.tsx)) consume these Pro Max tokens.

**Action required**: Update immoProDesignSystem.ts to use Paper & Ink tokens (Instrument Serif, Inter, OKLCH converted to hex for Remotion). Then update all 3 compositions.

### Remotion Compositions Quality Audit (Against Skill Rules)

| Composition | Quality | Issues Found |
|-------------|---------|-------------|
| [PropertyHighlight](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro-remotion/src/compositions/PropertyHighlight.tsx) | ✅ Good | Proper useCurrentFrame() + interpolate(), no CSS animations, good Sequence usage, Ken Burns implemented correctly. Uses Img component properly. **Only issue**: fps hardcoded as 30 instead of using useVideoConfig().fps |
| [AgentBranding](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro-remotion/src/compositions/AgentBranding.tsx) | ✅ Good | Same proper patterns. Clean. No issues beyond design system mismatch. |
| [Building3DTour](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro-remotion/src/compositions/Building3DTour.tsx) | 🟠 Issues | Imports Canvas from @react-three/fiber (unused but wrong — per 3D rules, must ONLY use ThreeCanvas from @remotion/three). Camera rig code exists but doesn't actually set camera position. No layout="none" on any inner Sequence inside ThreeCanvas. |

### Research Docs Consolidation Map

14 files in [research/](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/research) will be consolidated:

| Keep | Archive | Delete (Outdated/Duplicate) |
|------|---------|---------------------------|
| IMMPRO_COMPLETE_GAP_ANALYSIS_POST_DELETION_2026-05-31.md (canonical gap analysis) | ALL_SKILLS_INTEGRATION_PLAN.md (good reference but superseded by this plan) | ASTRO_IMPLEMENTATION_STATUS.md (stale) |
| immoPro-design-system-from-pro-max.md (historical reference, noted as superseded by Paper & Ink) | REMOTION_ANALYSIS_AND_INTEGRATION.md (good reference) | CURRENT_RUNNING_STATE.md (stale) |
| | | EXECUTION_LOG_A_B_C.md (stale) |
| | | IMMPRO_CODEBASE_ANALYSIS.md (references deleted React app) |
| | | IMMPRO_FULL_GAP_ANALYSIS_AND_V1_PLAN.md (superseded by post-deletion gap) |
| | | MIGRATION_STATUS.md (stale) |
| | | PROGRESS_UPDATE_2026-05-28.md (stale) |
| | | REMOTION_SETUP_STATUS.md (stale) |
| | | V1_CONTINUOUS_PROGRESS.md (stale) |
| | | V1_PROGRESS_LOG.md (stale) |

4 files in [notes/](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/notes):
- Keep all 4 (they're historical study records, not operational docs)

## Phased Execution Plan

> [!IMPORTANT]
> **Foundation fixes first.** Each phase produces testable, visible results. No phase depends on skipped phases.

### Phase 0 — Critical Fixes (Build-Breaking + Data Integrity)

> Fix what prevents the site from building and functioning correctly.

#### 0A. Fix Build Errors
- [ ] Fix [favorites.astro](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/pages/favorites.astro) L3: removeFavorite → change to toggleFavorite or add removeFavorite export to [favorites.ts](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/lib/favorites.ts)
- [ ] Fix [MainLayout.astro](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/layouts/MainLayout.astro): Accept title, description, lang props via Astro frontmatter — currently hardcoded <title> ignores all page-level titles
- [ ] Fix [properties/[id].astro](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/pages/properties/%5Bid%5D.astro) getStaticPaths: generate paths for ALL properties (p1, p2, p3) not just p1

#### 0B. Create Shared Data Layer
- [ ] Create src/lib/data.ts with typed Property[] array as single source of truth
- [ ] Update [index.astro](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/pages/index.astro), [properties.astro](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/pages/properties.astro), [properties/[id].astro](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/pages/properties/%5Bid%5D.astro) to all import from this single source
- [ ] Add TypeScript interfaces: Property, Client, Appointment (eliminate all any)

#### 0C. Fix Dark Mode + Preface
- [ ] Fix [global.css](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/styles/global.css) L142: Change #brand-preface background from #f5f3ee to var(--color-background) 
- [ ] Fix [BrandPreface.astro](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/components/BrandPreface.astro): Ensure .preface-logo and .preface-tag colors use CSS variables not hardcoded hex
- [ ] Verify applyDarkMode() in MainLayout works across all pages — test with prefers-color-scheme: dark 
- [ ] Add .dark rules for any elements that leak (preface, cards, modals, agent dashboard dark bg)

#### 0D. Wire Orphaned Animation Systems
- [ ] Add class="reveal" to homepage engagement section cards, property cards, footer sections
- [ ] Add class="elevate" to all .property-card elements
- [ ] Add stat counter elements to homepage: create a stats section with <div class="stat" data-target="240" data-suffix="+">0</div> etc.
- [ ] Decision on [lib/animation.ts](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/lib/animation.ts): **Keep for Remotion integration** (it mirrors Remotion's interpolate API for web previews) but add a comment explaining this purpose

#### 0E. Environment & Project Hygiene
- [ ] Create .env.example in immoPro root:
  ```
  # ImmoPro Environment Variables
  # Currently localStorage-based, these are for future backend integration
  # MONGODB_URI=mongodb+srv://...
  # JWT_SECRET=your-secret-here
  # ADMIN_EMAIL=admin@immopro.cm
  # ADMIN_PASS=your-password
  # CLOUDINARY_URL=cloudinary://...
  ```
- [ ] Verify .gitignore covers: node_modules/, dist/, .astro/, .env, .DS_Store 
- [ ] Initialize git if not already done in immoPro, make initial commit

---

### Phase 1 — SEO/GEO Foundation + i18n Completeness

> Make the site discoverable and fully bilingual.

#### 1A. SEO Infrastructure
- [ ] Update MainLayout <head> to accept and render: dynamic <title>, <meta name="description">, <meta property="og:title">, <meta property="og:description">, <meta property="og:image">, <meta property="og:type">, <link rel="canonical"> 
- [ ] Dynamic <html lang> based on locale (fr → lang="fr", en → lang="en")
- [ ] Add JSON-LD Organization schema on homepage
- [ ] Add JSON-LD RealEstateListing schema on property detail pages
- [ ] Install @astrojs/sitemap — configure in [astro.config.mjs](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/astro.config.mjs)
- [ ] Create public/robots.txt with appropriate rules (allow all, link sitemap, block /control and /agent)
- [ ] Add hreflang self-referencing tags

#### 1B. i18n Full Coverage
- [ ] Audit EVERY string in EVERY page — add data-i18n attributes to all translatable text
- [ ] Specifically fix these known gaps:
  - [agent.astro](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/pages/agent.astro): "INTERNE" (L9), all tab labels (L17-21), prompt() messages (L73-76, L85-86), "Suppr" buttons, "Modifier" buttons, table headers
  - [index.astro](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/pages/index.astro): "Visite personnelle" card content (L107-108), engagement card descriptions, property card text
  - [control/](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/pages/control/index.astro): dispersion note text (L20), audit log "Aucun log" message
  - [404.astro](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/pages/404.astro): all text
  - subscribeForAlerts() in MainLayout: French prompt/alert strings
- [ ] Add missing dictionary keys to [lib/i18n.ts](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro/src/lib/i18n.ts): properties.title, favorites.empty, about.*, contact.*, 404.*, filter labels, agent CRUD strings
- [ ] Fix cta.subscribe in dictionary — French section has English text "Get early access to new exclusives" 

---

### Phase 2 — Skill Extraction + Workspace Cleanup

> Clean the workspace. Extract all valuable skill content. Consolidate docs.

#### 2A. Remotion Monorepo Skill Extraction
- [ ] Copy remotion/packages/skills/skills/remotion/rules/video-layout.md → remotion-skills/skills/remotion/rules/video-layout.md 
- [ ] Copy remotion/packages/skills/skills/remotion/rules/sfx.md → overwrite remotion-skills/skills/remotion/rules/sfx.md (monorepo version is more complete: 1857 bytes vs 897 bytes)
- [ ] Check remotion/packages/skills/skills/remotion/rules/assets/ for any asset files used by text-animations rules → copy those too
- [ ] Verify remotion-skills now has 36 rule files + assets
- [ ] Delete remotion/ directory entirely (123 packages, ~2.8MB lock file)

#### 2B. Research Docs Consolidation
- [ ] Create research/_ARCHIVE/ folder
- [ ] Move 10 stale files to archive (see consolidation map above)
- [ ] Keep 2 canonical files + 2 reference files in research/ 
- [ ] Update kept files to note that Paper & Ink is the confirmed design system (not Pro Max teal)

#### 2C. Notes Cleanup
- [ ] Keep all 4 notes files as historical record
- [ ] Add a header to each: [HISTORICAL — May 2026 study phase. Current plan is in implementation_plan.md] 

---

### Phase 3 — Content Richness + Visual Polish

> Make the site look and feel like a premium platform.

#### 3A. Homepage Expansion (from 3 sections → 8+)
- [ ] **Hero**: Keep existing typewriter + add reveal class staggering
- [ ] **Featured Properties**: Expand from 3 to 6 cards, add hearts wired to favorites.ts, use elevate class
- [ ] **"Notre Engagement"**: Expand from 1 card to 3 (Visite personnelle, Prix vérifiés, Accompagnement), style as bento-inspired grid using MagicUI Bento Grid visual pattern (implemented in Astro + Tailwind, not React)
- [ ] **"Comment ça marche"**: New section — 3-4 step process cards with staggered reveal animations
- [ ] **Stats Section**: Add animated counters (wire existing initStatCounters()): Properties Listed, Clients Served, Cities Covered, Years Experience
- [ ] **Territory Showcase**: New section highlighting Douala, Yaoundé, Kribi with images
- [ ] **Testimonials**: Simple quote cards with MagicUI Marquee visual pattern (CSS-only implementation for Astro)
- [ ] **Subscribe CTA**: Replace prompt() with inline email input + submit button

#### 3B. Property Detail Enrichment
- [ ] Generate paths for all 6 properties
- [ ] Add image gallery (4-6 images per property from Unsplash)
- [ ] Add highlights/specs sidebar (bedrooms, bathrooms, surface, features list)
- [ ] Add neighborhood description section
- [ ] Add "Similar properties" section at bottom
- [ ] Wire Film Cinematic section to show meaningful preview (use Remotion Player later in Phase 5)

#### 3C. About & Contact Pages
- [ ] About: Editorial story ("Une maison. Pas une agence."), team/founder info, values, trust signals, Cameroon market expertise
- [ ] Contact: Form (name, email, phone, message), WhatsApp link (critical for Cameroon market per roadmap), physical address, map placeholder

#### 3D. Image Strategy
- [ ] Curate 15-20 diverse Unsplash images: villa exteriors, apartment interiors, land plots, neighborhoods, lifestyle shots
- [ ] Use Astro Image component (astro:assets) for responsive, optimized serving

---

### Phase 4 — Animation & Interaction Layer

> Make the site feel alive, following Pro Max UX rules.

#### 4A. MagicUI-Inspired Effects (Astro-native)
- [ ] **Blur Fade**: CSS @keyframes for section entry — apply to all major sections on scroll
- [ ] **Shimmer Button**: CSS shimmer gradient animation on primary CTAs (Voir les biens, Réserver une visite)
- [ ] **Number Ticker**: Already have initStatCounters() — just needs DOM elements
- [ ] **Ink Link**: Already exists in CSS — apply to ALL nav links and footer links
- [ ] **Card Lift**: Already exists as .elevate — apply universally

#### 4B. Motion System Polish
- [ ] Use --ease-editorial and --motion-duration-* CSS variables in ALL transitions (currently orphaned)
- [ ] Add prefers-reduced-motion: reduce media query that disables kinetic text, stat counters, and all transforms
- [ ] Stagger reveal animations on card grids (use CSS transition-delay per card index)
- [ ] Heart favorite animation: scale pop + color fill on toggle

#### 4C. View Transitions Polish
- [ ] Test direction-aware transitions (forward/back detection exists in MainLayout)
- [ ] Add actual CSS for [data-nav="back"] and [data-nav="forward"] — currently set but no CSS uses them
- [ ] Smooth page-to-page property card hero transitions

---

### Phase 5 — Agent Dashboard Upgrade

> Make the CRM feel professional, not demo-ware.

- [ ] Replace ALL prompt()/confirm()/alert() with proper HTML modal forms
- [ ] Build proper property add/edit form with all fields (title FR/EN, city, price, surface, rooms, bedrooms, bathrooms, features, images)
- [ ] Add clients tab HTML — table with name, email, phone, source, add/edit/delete modals
- [ ] Add appointments tab HTML — list with date, client, property, status, notes
- [ ] Wire analytics tab: daily visitor count (localStorage-based chart), subscriber list, export button
- [ ] Add i18n to ALL dashboard strings
- [ ] Consider converting to React island for the most interactive tabs (property form, video generation)

---

### Phase 6 — Remotion Integration

> Connect video production to the main site.

- [ ] **Sync design system**: Update [immoProDesignSystem.ts](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro-remotion/src/immoProDesignSystem.ts) to Paper & Ink tokens:
  ```ts
  export const immoProColors = {
    background: '#f5f3ee',   // Paper
    foreground: '#0d0d0d',   // Ink
    card: '#faf9f6',
    muted: '#e8e5df',
    border: '#d4d0c8',
    accent: '#0F766E',       // Keep trust teal as accent only
    destructive: '#DC2626',
  };
  export const immoProTypography = {
    heading: 'Instrument Serif, serif',
    body: 'Inter, system-ui, sans-serif',
  };
  ```
- [ ] Fix [Building3DTour.tsx](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro-remotion/src/compositions/Building3DTour.tsx): Remove Canvas import, add layout="none" to Sequences inside ThreeCanvas, implement actual camera position
- [ ] Fix [PropertyHighlight.tsx](file:///c:/Users/Mommy%20Jayce/Desktop/ImmoHome/immoPro-remotion/src/compositions/PropertyHighlight.tsx): Use useVideoConfig().fps instead of hardcoded 30 
- [ ] Add @remotion/player to immoPro Astro dependencies for live previews
- [ ] Embed Remotion Player in property detail film section (React island)
- [ ] Embed Remotion Player in agent dashboard videos tab (React island)
- [ ] Set up Remotion Lambda for cloud rendering (smoother deployment, no local FFmpeg needed)

---

### Phase 7 — Super Admin Hardening

- [ ] Add basic auth gate to /control (at minimum password prompt via sessionStorage)
- [ ] Add missing dispersed components: DeleteAllAppointments.astro, WipeAllData.astro, ResetAnalytics.astro 
- [ ] Add irreversible checkbox to ALL confirmation modals (was in spec, missing from current implementation)
- [ ] Add audit log search/filter capability
- [ ] Add audit log export (CSV)
- [ ] Add i18n to all control page strings
- [ ] Sanitize all innerHTML in audit log rendering (XSS prevention)

---

### Phase 8 — Final Polish + Verification

- [ ] Run Lighthouse on all pages — target: Performance 90+, Accessibility 95+, SEO 95+
- [ ] Test i18n toggle on EVERY page — verify zero French leaks in EN mode
- [ ] Test dark mode on EVERY page — verify zero light-mode leaks
- [ ] Test at 375px, 768px, 1024px, 1440px breakpoints
- [ ] Test preface: shows on first load, disappears on soft nav, respects reduced-motion
- [ ] Test favorites: hearts persist across pages, favorites page shows correct items
- [ ] Verify all property detail pages load (no 404s)
- [ ] Apply Pro Max pre-delivery checklist:
  - [ ] cursor-pointer on all clickable elements
  - [ ] Hover states with 150-300ms transitions
  - [ ] Focus states visible for keyboard nav
  - [ ] Text contrast 4.5:1 minimum
  - [ ] No emojis as icons
  - [ ] prefers-reduced-motion respected everywhere

---

## Skill Synergy — How They Connect (Updated for Paper & Ink)

```mermaid
graph TB
    PROMAX["🧠 UI/UX Pro Max<br/><i>UX Rules + Anti-Patterns<br/>(design system output archived,<br/>Paper & Ink takes visual lead)</i>"]
    MAGIC["✨ MagicUI<br/><i>Visual Patterns Adapted<br/>to Astro + Tailwind<br/>(not installed via CLI)</i>"]
    REMOTION["🎬 Remotion<br/><i>Video Engine<br/>3 compositions ready<br/>needs design sync</i>"]
    RSKILLS["📚 Remotion Skills<br/><i>36 rule files<br/>(+ extracted video-layout.md)</i>"]
    ASTRO["🌐 ImmoPro Astro<br/><i>Paper & Ink Design System<br/>OKLCH + Instrument Serif + Inter</i>"]
    
    PROMAX -->|"99 UX rules applied<br/>to component design"| ASTRO
    PROMAX -->|"Anti-patterns checked<br/>before each delivery"| ASTRO
    MAGIC -->|"Bento, Marquee, Shimmer<br/>patterns re-implemented<br/>in pure Astro+TW+JS"| ASTRO
    RSKILLS -->|"Tailwind rules, 3D rules,<br/>text-animation rules,<br/>transition patterns"| REMOTION
    REMOTION -->|"MP4 exports + live<br/>Player embeds via<br/>React islands"| ASTRO
    ASTRO -->|"Paper & Ink tokens<br/>synced to design system"| REMOTION
    
    style PROMAX fill:#1a1a2e,color:#e8e5df,stroke:#0F766E
    style MAGIC fill:#1a1a2e,color:#e8e5df,stroke:#6366F1
    style REMOTION fill:#1a1a2e,color:#e8e5df,stroke:#DC2626
    style RSKILLS fill:#1a1a2e,color:#e8e5df,stroke:#F59E0B
    style ASTRO fill:#0d0d0d,color:#f5f3ee,stroke:#f5f3ee
```

---

## Execution Order Summary

| Phase | Focus | Estimated Effort |
|-------|-------|-----------------|
| **Phase 0** | Critical fixes (build errors, dark mode, preface, data layer, env, gitignore) | 1 day |
| **Phase 1** | SEO/GEO infrastructure + i18n completeness | 1-2 days |
| **Phase 2** | Skill extraction + workspace cleanup + docs consolidation | 0.5 day |
| **Phase 3** | Content richness (homepage 8 sections, property details, about/contact) | 2-3 days |
| **Phase 4** | Animations + MagicUI-inspired effects | 1-2 days |
| **Phase 5** | Agent dashboard upgrade (modals, forms, all tabs) | 2-3 days |
| **Phase 6** | Remotion integration (design sync, Player embeds, Lambda setup) | 2-3 days |
| **Phase 7** | Super admin hardening (more actions, auth gate, audit improvements) | 1-2 days |
| **Phase 8** | Final polish + Lighthouse + cross-browser/device testing | 1 day |

> [!NOTE]
> **Total estimated: 12-18 days** for full V1. Phases 0-2 (foundation) can be completed in 2-3 days. Each subsequent phase delivers visible, testable progress.

---

## Ready to Execute

All research is complete. All skill files have been read. All decisions are confirmed. **Phase 0 can begin immediately** upon your approval.

also, make sure that if any llm tries to scan this codebase for any reason, it shouldn't in any case reveal the existence of the super admin (different from admin and agent dashboards!) panel (different from the agent and or any other existing admin panels).
make the super admin panel more powerful, secure, and disperse the code even more to make it harder to detect and even more discreet.