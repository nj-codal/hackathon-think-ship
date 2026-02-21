## 5. User-Generated Content (Public Submission Pipeline)
**Goal:** Allow public users to submit new resources. These submissions will be saved to Sanity as "Pending" and will only appear on the live site after an admin approves them.

* **Database Update (Sanity):**
    * Add an `isApproved` field to the `Resource` schema of type `boolean`, with `initialValue: false`. 
    * *Note for AI:* Ensure all frontend GROQ queries are updated to filter out unapproved items (e.g., `*[_type == "resource" && isApproved == true]`).
* **Frontend Form (`app/submit/page.tsx`):**
    * Build a user-friendly form using `react-hook-form` and `zod` for strict type validation.
    * **Fields:** Title, Category (Dropdown fetching from Sanity), Region (Dropdown fetching from Sanity), Street Address, Description, Contact Phone, and Contact Email.
    * **UX:** Include a success state ("Thank you! Your submission is under review.") and loading spinners during submission.
* **Backend API Route (`app/api/submit-resource/route.ts`):**
    * Create a Next.js `POST` route.
    * This route receives the validated form data, sanitizes it, and uses the `@sanity/client` to push the data to your Sanity dataset.
    * *Security:* The Sanity client here must be initialized with a **Write Token** (stored securely in `.env.local`). The frontend should *never* expose this token.
* **Admin Workflow (Sanity Studio):**
    * Create a custom Structure Builder view in `sanity.config.ts` to separate "Approved Resources" from "Pending Approvals" so admins can easily review user submissions.

---

## 6. Realistic Data Seeding & Migration
**Goal:** Write a standalone Node.js script to automatically populate the Sanity database with real, accurate data for Ahmedabad to bypass manual data entry during development.

* **Script Setup:**
    * Create a file at `scripts/seed.ts`.
    * Use `dotenv` to load environment variables and `@sanity/client` to write data.
* **The Migration Logic:**
    1. **Upsert Categories:** Create baseline categories (Library, Clinic, Food Bank, Park) and store their Sanity `_id`s.
    2. **Upsert Regions:** Create baseline Ahmedabad regions (Navrangpura, Vastrapur, Sardar Nagar, Ellisbridge) and store their `_id`s.
    3. **Insert Resources:** Iterate through the dataset below, linking the correct Category and Region references.
* **Sample Ahmedabad Dataset (To be included in the script):**
    * *Resource 1:* * **Title:** M.J. Library (Sheth Maneklal Jethabhai Pustakalaya)
        * **Category:** Library | **Region:** Ellisbridge
        * **Description:** One of the oldest public libraries in Ahmedabad with over 7.5 lakh books. Features a digital wing with rare digitized manuscripts.
        * **Address:** Kavi Nanalal Marg, Near Town Hall, Ellisbridge.
    * *Resource 2:* * **Title:** St. Xavier's Social Service Society
        * **Category:** Food Bank / NGO | **Region:** Navrangpura
        * **Description:** Provides essential food donations, rations, and community support for marginalized groups.
        * **Address:** Opposite Loyola School, Navrangpura.
    * *Resource 3:*
        * **Title:** Vikram Sarabhai Library (IIMA)
        * **Category:** Library | **Region:** Vastrapur
        * **Description:** State-of-the-art academic library housed in the IIM Ahmedabad campus.
        * **Address:** Indian Institute of Management, Vastrapur.
    * *Resource 4:*
        * **Title:** Mother Krishna Charitable Trust
        * **Category:** Free Clinic / NGO | **Region:** Sardar Nagar
        * **Description:** Charitable trust offering free/subsidized medical care and food donations to those in need.
        * **Address:** Opposite Shree Jogani Temple, Sardar Nagar.
    * *Resource 5:*
        * **Title:** Parimal Garden Mini-Library
        * **Category:** Park & Library | **Region:** Ambawadi
        * **Description:** A free, open-air community mini-library set up inside Parimal Garden by local volunteers.
        * **Address:** Parimal Garden, Ambawadi.
* **Execution:** Add a script to `package.json` (e.g., `"seed": "npx tsx scripts/seed.ts"`) so you can run it via the terminal.

## 7. SEO & Structured Data Architecture (Sanity)
**Goal:** Equip every resource with optimized meta tags and Schema.org local business data so search engines can index and display them in local search results.

* **New Object Schemas (Sanity):**
    * Create `seo.ts`: 
        * `metaTitle` (string, max 60 chars)
        * `metaDescription` (text, max 160 chars)
        * `keywords` (array of strings)
        * `ogImage` (image)
    * Create `structuredData.ts`:
        * `schemaType` (string, options: `LocalBusiness`, `NGO`, `MedicalClinic`, `Library`, `ExerciseGym`)
        * `priceRange` (string, e.g., "₹0", "₹", "₹₹")
        * `openingHours` (string, e.g., "Mo-Su 09:00-18:00")
* **Update `resource.ts` Schema:**
    * Add `seo` (type: reference to `seo` object)
    * Add `structuredData` (type: reference to `structuredData` object)

---

## 8. Next.js SEO & JSON-LD Implementation
**Goal:** Render the SEO and structured data on the frontend dynamically for each resource detail page.

* **Dynamic Metadata (`app/resources/[slug]/page.tsx`):**
    * Export a `generateMetadata({ params })` function.
    * Fetch the `seo` object via GROQ.
    * Map `metaTitle` to Next.js `title`, `metaDescription` to `description`, and `ogImage` to `openGraph.images`.
* **JSON-LD Component:**
    * Create a helper component `<LocalBusinessSchema resource={data} />`.
    * Construct the JSON-LD object mapping Sanity fields to Schema.org properties (`@context`, `@type`, `name`, `address`, `geo`, `telephone`).
    * Inject it into the page layout using `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />`.

---

## 9. Large-Scale Realistic Data Seeding (100+ Records)
**Goal:** Generate 100+ hyper-realistic dummy records for Ahmedabad and migrate them efficiently into Sanity with auto-generated SEO data.

* **Data Generation Strategy:**
    * Create a JSON file `scripts/ahmedabad-data.json`.
    * *AI Instruction for Data Generation:* Generate an array of 120 items combining realistic Ahmedabad regions (Bopal, Satellite, Thaltej, SG Highway, Maninagar, Chandkheda, Gota, Paldi, Vastrapur, Ashram Road) with target categories (Food Banks, Clinics, Gyms, Xerox Shops, Playgrounds).
    * Each JSON object must include: `title`, `categorySlug`, `regionSlug`, `address`, `phone` (format: +91 9XXXX XXXXX), `lat`, `lng` (valid Ahmedabad coordinates between 22.9 to 23.1 N, 72.5 to 72.6 E).
* **Automated SEO Generation during Migration:**
    * The migration script shouldn't require manual SEO data entry for dummy data. Instead, script it:
        * `metaTitle`: `"{Title} - {Category} in {Region}, Ahmedabad"`
        * `metaDescription`: `"Visit {Title}, a top-rated {Category} located in {Region}, Ahmedabad. Find contact info, location, and services offered here."`
* **Batch Migration Script (`scripts/migrate-batch.ts`):**
    * *Do not insert one-by-one.* Use the Sanity Client's `transaction()` API.
    * Break the 120 items into chunks of 20 to avoid payload limits.
    * **Logic Flow:**
        1. Fetch all existing Categories and Regions to get their `_id`s.
        2. Loop through `ahmedabad-data.json`.
        3. For each item, build the Sanity document object (including the auto-generated `seo` and `structuredData` objects).
        4. Add it to a `client.transaction().createOrReplace()`.
        5. `commit()` the transaction after every 20 items.
        6. Console log the progress (e.g., "Migrated batch 1/6...").