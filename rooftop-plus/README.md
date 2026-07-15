# Rooftop+

A model-page pipeline dashboard for a multi-store auto dealer group. Rooftop+ tracks every new-model landing page — from SEO copy, to page build, to live verification — across eight dealership rooftops, with role-aware workspaces for builders, SEO writers, and AEO writers.

**This is a portfolio demo.** Redwood Motors Group, its dealerships, team members, and all pipeline data are fictional. The app is a stripped-down public version of a production dashboard I built for a real 17-store dealer group; the production build adds live dealer inventory CSV feeds, Firebase Auth with Google Sign-In, real-time sync via Firebase Realtime Database, and Google Drive SEO-doc integration.

## Try it

Open `index.html` — no build step, no dependencies, no backend. Pick any of the three roles on the sign-in screen to explore that workspace. Progress you make (statuses, owners, notes) persists in localStorage; add `?demo=reset` to the URL to start fresh.

## What's inside

**My Work** — a role-filtered personal queue. Builders see pages ready to build and verify; SEO writers see pages that need copy; AEO writers see the answer-engine-optimization layer. Tasks group into a collapsible brand accordion, and clicking a task enters a full-width focus mode with a checklist, resources, and one-click status actions.

**Team Pipeline** — the whole board, grouped into urgency tiers (on-lot with no page, blocked, ready to build, in progress, needs SEO, needs AEO), with owner filtering, per-tier row caps, and owner avatars.

**Wins** — the celebration page: live-page counters, a brand trophy shelf with per-make progress bars, a team leaderboard computed from real task ownership, and a feed of the latest pages to go live.

## Stack

Deliberately boring: one HTML file, hand-written CSS, and vanilla JS modules loaded in cascade order — no framework, no bundler.

```
css/  tokens → base → layout → components → pages → workbench → responsive → wins
js/   demo-auth → data → state → renderers → navigation → theme → events → wins → app
```

- **Theme system** — System / Light / Dark with a warm cream light mode and stone dark mode, driven by CSS custom properties in `tokens.css` and a `prefers-color-scheme` listener.
- **State** — a single global `state` object; task status/owner/note overrides persist to localStorage (the production build swaps these writes for Firebase through the same `fb*` API surface in `demo-auth.js`).
- **Rendering** — string-template renderers orchestrated by a single `render()` pass; workspace visibility is CSS-driven via `body[data-workspace-view]`.
- **Role system** — each session carries a primary role that filters the My Work queue and gates admin-only UI; owners are auto-assigned on a task's first status action.

## Typography

[Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) for UI, [Newsreader](https://fonts.google.com/specimen/Newsreader) for editorial moments, [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) for data.
