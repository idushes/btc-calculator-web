# AGENTS.md

Instructions for agents working in this repository.

## Scope

These instructions apply to the entire project.

## Project Overview

This is a BTC mining production-cost calculator built with Next.js App Router.
The primary app is a client-side calculator with saved presets, import/export,
shareable URL state, Open Graph metadata for shared links, and a theory page.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript with `strict` enabled
- Tailwind CSS v4
- ESLint 9 with `eslint-config-next`
- `lucide-react` for icons
- `@vercel/speed-insights` in the root layout

## Hosting

- Production hosting: Vercel.
- Vercel project: `https://vercel.com/lisateam/btc-calculator`.
- Production domain: `https://btc.lisacorp.com/`.
- Keep metadata, Open Graph URLs, and share links aligned with the production
  domain.

## Commands

- Install dependencies with `npm install` when needed.
- Start local development with `npm run dev`.
- Run lint checks with `npm run lint`.
- Run a production build with `npm run build`.
- Use `node verify_calculation.js` for a quick manual sanity check of the mining-cost formula.

Before finishing code changes, run at least `npm run lint`. Run `npm run build`
when changing Next.js routing, metadata, server/client component boundaries,
shared state encoding, or calculation logic.

## Change Boundaries

- Do not make major changes to product behavior, architecture, API, UX, or
  business logic without explicit user confirmation.
- Keep changes narrowly scoped to the user request.
- Do not rewrite the app structure, replace the styling system, or introduce
  new state management, persistence, analytics, or UI libraries unless the user
  explicitly asks for it.
- Do not remove existing features such as presets, import/export, shared links,
  Open Graph metadata, the theory page, or Speed Insights unless explicitly
  requested.

## Calculation Rules

The BTC production-cost formula is product-critical. Treat changes here as
business-logic changes that need extra care.

- The main calculator formula lives in `app/hooks/useCalculator.ts`.
- Shared-link Open Graph summaries duplicate the formula in
  `app/lib/shareCodec.ts`.
- If the formula changes in one place, update the other place and verify that
  both still produce matching results.
- Preserve units unless intentionally changed: difficulty is entered in
  trillions, efficiency is J/TH, electricity is USD/kWh, and block reward is BTC.
- Keep zero block reward guarded to avoid division by zero.

## State, Storage, and Sharing

- Local calculator state uses `localStorage` keys prefixed with `btc_calc_`.
- Presets are stored under `btc_calc_presets`; the active preset id is stored
  under `btc_calc_active_preset`.
- Shared URLs use the `?s=` query parameter and compact URL-safe base64 encoding
  from `app/lib/shareCodec.ts`.
- Maintain backwards compatibility for existing shared URLs and stored presets
  whenever possible.
- Viewing a shared URL must not overwrite the user's saved local state until the
  user edits the calculator.

## UI Guidelines

- Match the existing compact dark UI and Tailwind utility style.
- Use existing component boundaries under `app/components/calculator/` before
  adding new ones.
- Use `lucide-react` icons for icon buttons when an appropriate icon exists.
- Keep the calculator usable on mobile and desktop.
- Preserve existing modal behavior and avoid backdrop or stacking-context
  regressions.

## TypeScript and React Guidelines

- Prefer typed props and explicit interfaces for shared shapes.
- Keep client-only logic in files marked with `"use client"`.
- Avoid accessing browser-only APIs outside client components/hooks or effects.
- Prefer existing hooks (`useCalculator`, `usePresets`, `useShareState`) over
  adding parallel state flows.
- Do not silence TypeScript or ESLint errors without a specific reason.

## Git Workflow

- Check `git status` before editing and before committing.
- Do not revert or overwrite user changes.
- Commit completed work with a clear, focused message.
- Push the committed branch after committing.
