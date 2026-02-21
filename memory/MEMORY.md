# Project Memory: Ahmedabad Community Resource Map

## Project Overview
Turborepo monorepo with three apps. Building a local community resource directory + interactive map for Ahmedabad, Gujarat.

## Key Files
- `apps/studio/schemaTypes/` — Sanity schemas (category, region, resource)
- `apps/studio/sanity.config.ts` — Studio config with @sanity/google-maps-input
- `apps/web/src/types/index.ts` — Shared TS types (Category, Region, Resource)
- `apps/web/src/sanity/lib/queries.ts` — GROQ queries
- `apps/web/src/components/` — Navbar, Footer, CategoryCard, ResourceCard, GoogleMapComponent
- `apps/web/src/app/page.tsx` — Home page (server component)
- `apps/web/src/app/resources/page.tsx` — Resources listing (server, passes data to client)
- `apps/web/src/app/resources/ResourcesPageClient.tsx` — Interactive split-screen client component
- `apps/web/src/app/resources/[slug]/page.tsx` — Detail page (server component)

## Design System
- Fonts: Lora (display/headings) + Nunito Sans (body) via Google Fonts
- Colors: Teal-700 (#0d7377) primary, Saffron-500 (#f4a025) accent, Cream (#fefcf8) background
- Tailwind v4 CSS-first config in globals.css using @theme directive

## Installed Packages
- `apps/web`: @react-google-maps/api
- `apps/studio`: @sanity/google-maps-input

## Environment Variables Needed
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — for map in web app
- `SANITY_STUDIO_GOOGLE_MAPS_API_KEY` — for geopoint input in studio
- (Already set) `NEXT_PUBLIC_SANITY_PROJECT_ID=lizsas7c`, `NEXT_PUBLIC_SANITY_DATASET=production`

## Plan2 Features
- `isApproved` boolean field added to resource schema (initialValue: false)
- Studio structure builder separates ✅ Approved / ⏳ Pending in sidebar
- All GROQ resource queries filter `isApproved == true`
- Public submit form at `/submit` — react-hook-form + zod validation
- API route at `/api/submit-resource` — POST, Zod validated, needs SANITY_API_WRITE_TOKEN
- Seed script at `apps/web/scripts/seed.ts` — run with `pnpm --filter @repo/web seed`
- Seed upserts 4 categories, 5 regions, 5 Ahmedabad resources (all isApproved: true)

## Architecture Notes
- GoogleMapComponent is dynamically imported with ssr:false everywhere it's used
- Resources page: server component fetches all data → passes as props to ResourcesPageClient
- Filtering is pure client-side (React state) for hackathon simplicity
- noUncheckedIndexedAccess is enabled — be careful with array[0] access
- sanityFetch returns `{ data: unknown }` — cast to typed arrays at usage site
