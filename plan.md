# 🏗️ AI Prompt / Technical Blueprint: Local Community Resource Map

**Project Context:**
We are building a highly scalable, centralized directory and interactive map for community resources (mental health, food banks, clinics, gyms, xerox shops, etc.). 
**Initial Focus:** Ahmedabad, Gujarat, India.
**Tech Stack:** Next.js 15 (App Router), React, Tailwind CSS, Sanity v3 (Embedded Studio), Google Maps API (`@react-google-maps/api`), and GROQ for data fetching.

## 1. System Architecture & Setup Requirements
* **Monorepo Approach:** Embed Sanity Studio directly inside the Next.js App Router (typically at `/studio`). This allows content editors and the frontend to live in one codebase.
* **Styling:** Tailwind CSS + Shadcn UI (for quick, accessible components like buttons, cards, and filters).
* **Mapping:** Use `@react-google-maps/api` for the map views. Use `@sanity/google-maps-input` in the Sanity Studio for easy latitude/longitude plotting by admins.

## 2. Database Design (Sanity Schemas)
Create the following document schemas in the Sanity configuration:

| Schema Name | Field Name | Type | Description |
| :--- | :--- | :--- | :--- |
| **Category** | `title` | `string` | e.g., "Food Bank", "Xerox Shop", "Clinic" |
| | `slug` | `slug` | Auto-generated from title |
| | `icon` | `image` | SVG or standard image for map markers/UI |
| **Region** | `title` | `string` | e.g., "Navrangpura", "Bopal", "Satellite" |
| | `pincode` | `string` | Postal code for filtering |
| **Resource** | `title` | `string` | Name of the place/service |
| | `slug` | `slug` | Auto-generated from title |
| | `category` | `reference` | Points to Category schema |
| | `region` | `reference` | Points to Region schema |
| | `description` | `text` | Details about the place |
| | `location` | `geopoint` | Lat/Lng via Google Maps Input plugin |
| | `address` | `string` | Physical street address |
| | `contactInfo` | `object` | Fields for `phone`, `email`, `website`, `socials` |
| | `services` | `array` of `string` | e.g., ["Black & White", "Color", "Spiral Binding"] |
| | `eligibility` | `string` | e.g., "Below poverty line", "Open to all" |
| | `featuredImage` | `image` | Main thumbnail |
| | `gallery` | `array` of `image` | Additional photos |

## 3. Next.js Routing & UI Structure
Implement the following App Router structure:

* **`app/page.tsx` (Dashboard/Home Page)**
    * **Hero Section:** Search bar (by name or pincode) and a clear CTA ("Find Resources in Ahmedabad").
    * **Categories Grid:** Display all `Category` items as clickable cards with their icons. Clicking a category routes to the listing page.
* **`app/resources/page.tsx` (Listing Page)**
    * **Client-Side Component:** This page requires heavy client-side state for filtering and mapping.
    * **Layout:** Split-screen UI (Desktop: 50/50 split. Mobile: Map as a sticky toggle over the list).
    * **Left Column (List):** Display `Resource` cards. Include filters at the top (Filter by Category, Region, Service Availability).
    * **Right Column (Map):** Render Google Maps. Plot markers for all resources currently visible in the Left Column. Clicking a marker highlights the card on the left.
* **`app/resources/[slug]/page.tsx` (Detail Page)**
    * **Layout:** Clean, informational layout.
    * **Header:** `featuredImage` as a hero banner, `title`, and `category` badge.
    * **Body Main:** `description`, `services` (rendered as tags), and `eligibility`.
    * **Body Sidebar:** Google Map zoomed in on the specific `location`, `contactInfo` (clickable phone numbers/emails), and `address`.

## 4. Step-by-Step Execution Plan for AI

**Phase 1: Project Scaffolding**
1. Initialize a Next.js App Router project with Tailwind CSS.
2. Install Sanity inside the project (`npm create sanity@latest`) and configure it for embedded routing at `/app/studio/[[...index]]/page.tsx`.
3. Set up environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, etc.).

**Phase 2: Backend (Sanity CMS)**
1. Create the `category.ts`, `region.ts`, and `resource.ts` schemas in the Sanity schema folder based on the Database Design table provided.
2. Install and configure the `@sanity/google-maps-input` plugin so admins can search for Ahmedabad locations and drop pins to save Lat/Lng data.
3. Expose the schemas to the Sanity `schemaTypes` array.

**Phase 3: Data Fetching & State (GROQ & Utilities)**
1. Create a `lib/sanity/queries.ts` file.
2. Write GROQ queries to:
    * Fetch all categories.
    * Fetch all resources (with expanded category and region references).
    * Fetch a single resource by slug.
3. Set up a global state context or use URL search parameters (`?category=food-bank&region=bopal`) to manage the filter state on the listing page.

**Phase 4: Frontend Development (Components & Pages)**
1. Build the generic UI components (Navbar, Footer, ResourceCard, CategoryCard).
2. Build the `GoogleMapComponent` using `@react-google-maps/api`, ensuring it accepts an array of markers as props.
3. Assemble `app/page.tsx` (Home).
4. Assemble `app/resources/page.tsx` (Split-screen Map & List). Ensure marker clicks sync with the list view.
5. Assemble `app/resources/[slug]/page.tsx` (Detail page).