# Handoff Brief — Multi-Step Inquiry Form for jnuru.studio

## How to use this

1.  Copy jnuru-inquiry-form.html into your repo at reference/jnuru-inquiry-form.html
2.  Copy this file into your repo at reference/HANDOFF.md
3.  Open Claude Code in the repo and paste the prompt in **§0** below

Everything after §0 is context Claude Code will read from the file itself. You only need to paste §0.

## §0 — Paste this into Claude Code

Read reference/HANDOFF.md and reference/jnuru-inquiry-form.html, then implement
the task described there.

Before writing any code:

1. Tell me what framework and styling system this site uses, and where the
   current contact form lives.

2. Tell me which of the two integration paths in §4 applies, and why.

3. Show me your plan. Wait for my approval before editing files.

Do not delete the existing contact form until the new one is verified working.

## §1 — Objective

Replace the single-field contact form on jnuru.studio with a 5-step qualifying form that captures project type, budget, and timeline, then routes the visitor straight into booking a call. Goal is to cut back-and-forth email and stop unqualified inquiries from reaching the calendar.

reference/jnuru-inquiry-form.html is a **complete, tested reference implementation** — all markup, styling, logic, and copy. It is standalone and works when opened directly in a browser. The job is integrating it into the site, not designing it.

Treat it as the source of truth for behavior and copy. Adapt structure to fit the framework; do not redesign the flow or rewrite the copy.

## §2 — Current state

  - Site is at **jnuru.studio**, deployed on **Netlify**
  - An existing contact form already uses **Netlify Forms** and successfully emails the owner on submission — this pipeline works and must keep working
  - Submissions are stored in the Netlify dashboard under Site → Forms
  - No custom backend, no API routes, no database

**Do not build a backend.** Netlify Forms already handles receiving, storing, and emailing. Adding an API route, database, or third-party form service is out of scope and explicitly not wanted.

## §3 — What the reference implementation contains

Behavior, all working and tested:

| **Feature** | **Detail** |
| :-: | :-: |
| 5 steps + intro + success screen | One question per screen |
| Auto-advance | Choice screens advance ~260ms after selection, no Next button |
| Keyboard nav | Number keys select options, Enter advances |
| Back button | Preserves prior selections |
| Progress bar | Plus "Question N of 5" counter |
| Validation | Required fields and email format, inline errors that clear on input |
| Optional soft-decline branch | Off by default via CONFIG.softDecline |
| Success screen | 3-step "what happens next" timeline + calendar embed slot |
| Accessibility | role="radiogroup" / role="radio", labelled inputs, aria-valuenow on progress, prefers-reduced-motion respected |

The five questions: project type → budget → timeline → brand name + current site → name + email + notes. Contact info is last on purpose — sunk cost carries people past the highest-drop-off field.

## §4 — Integration paths — determine which applies

**Path A — static HTML site**

Port the markup, CSS, and JS into the contact page. Netlify's build scanner sees the form in the built HTML and detects it automatically. Nothing extra needed.

**Path B — React / Next / any client-rendered framework**

⚠️ **This is the failure mode to watch for.** Netlify detects forms by scanning built HTML at deploy time. A form that only exists after JS hydration is invisible to the scanner, and submissions return 404 in production while working fine in dev.

Fix — commit a static stub at public/__forms.html:

```
<form name="inquiry" data-netlify="true" hidden>
  <input name="form-name" value="inquiry">
  <input name="name"><input name="email"><input name="brand">
  <input name="site"><input name="projectType"><input name="budget">
  <input name="timeline"><input name="submittedAt"><input name="source">
  <textarea name="notes"></textarea>
</form>
```

Field names must match the live form **exactly**. Any mismatch means that field arrives blank with no error.

State which path applies and why before writing code.

## §5 — Hard constraints

These are non-obvious and each one breaks the form silently if changed.

1.  **Hidden mirror inputs must stay.** The choice steps use `<button>`, and Netlify only captures `<input>` values. projectType, budget, and timeline are mirrored into hidden inputs on selection. Remove them and those three fields arrive blank — no error, no warning.

2.  **Submit must be url-encoded, not JSON.** Netlify Forms rejects application/json. The handler builds the body via `new URLSearchParams(new FormData(form))`.

3.  **form-name must be in the body.** Required for JS-driven submits. Its value must match the form's name attribute exactly (inquiry).

4.  **Preserve the exact option strings**, including en-dashes (– U+2013) in $1,000 – $3,000 and 2–3 months out. Copy-paste them; do not retype. These become the values in the notification email and in any downstream integration.

5.  **Delete the `.catch()` fallback in the submit handler before launch.** It exists so the flow can be previewed locally — Netlify rejects submissions from localhost and file://. Left in production, it shows a fake success screen when submissions genuinely fail.

6.  **Honeypot must stay off-screen, not `display:none`.** Some bots skip display:none fields. The .hp class uses left:-9999px.

## §6 — Tasks, in order

1.  **Recon.** Report framework, styling system, location of the current contact form, and which §4 path applies. Do not edit yet.

2.  **Theme mapping.** The reference uses five CSS custom properties in :root — --bg, --fg, --muted, --line, --accent. Map these to the site's existing design tokens and font stack rather than hardcoding the placeholder values. The form should look native to jnuru.studio, not like a dropped-in widget.

3.  **Integrate the form** at the contact route, following the applicable §4 path. Keep the existing form in place and reachable until step 6 passes.

4.  **Calendar embed.** Replace the .cal placeholder block on the success screen with a Cal.com or Calendly **inline** embed — not a popup or a link out. Booking happening on that screen without a second click is the entire point of the redesign. Ask which service and event URL to use.

5.  **Netlify notification fields.** The email notification needs the new field names added so they appear in the body. Flag this as a manual dashboard step (Site configuration → Forms → Form notifications) — it is not configurable from the repo.

6.  **Verify against §7.** Report results explicitly.

7.  **Clean up.** Once verified, remove the old form and the .catch() fallback.

## §7 — Acceptance criteria

Local:

  - All 5 steps navigate forward and backward; Back preserves selections
  - Choice screens auto-advance on click and on number-key press
  - Empty required fields and malformed emails block submission with inline errors
  - Errors clear as soon as the user starts correcting
  - Success screen greets by first name
  - Layout holds at 375px width
  - Full keyboard-only pass works; visible focus states throughout
  - Zero console errors

Deployed — must be tested on the live Netlify URL, not localhost:

  - A real submission appears in the Netlify Forms dashboard
  - **All nine fields populated** — name, email, brand, site, projectType, budget, timeline, notes, submittedAt. Verify projectType, budget, and timeline specifically; these are the ones that silently fail.
  - Notification email arrives with the new fields in the body
  - Calendar embed loads and a test booking completes
  - .catch() fallback removed and a deliberate failure now surfaces instead of showing success

## §8 — Out of scope

  - Any backend, API route, or database
  - Replacing Netlify Forms with another service
  - Redesigning the question flow or rewriting the copy
  - Post-payment client onboarding (brand questionnaire, asset uploads, Notion client portal) — separate project
  - Notion pipeline integration — optional later step via Netlify outgoing webhook → Make.com, no code required

## §9 — Open questions to raise before starting

1.  Which calendar service, and what is the event URL?
2.  Should the old form's route be preserved and redirected, or removed outright?
3.  Enable CONFIG.softDecline? It routes "Under $1,000" to a polite decline screen instead of the calendar. Off by default — it saves calls but costs the occasional client who would have stretched their budget.

## §10 — Note on tradeoffs

Every step in this form filters out bad leads *and* good ones. If inquiry volume drops noticeably after launch, the fix is fewer steps rather than better copy. Two metrics worth instrumenting eventually: completion rate (submissions ÷ visitors who reached step 1) and booking rate (calls booked ÷ submissions). Booking rate is the one this redesign is meant to move.
