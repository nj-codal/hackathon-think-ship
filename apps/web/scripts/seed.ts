/**
 * Seed script: populates Sanity with Ahmedabad community resource data.
 * Run from apps/web: pnpm seed
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local with Editor permissions.
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '../.env.local') })
dotenv.config({ path: resolve(__dirname, '../.env') })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2025-01-01',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
})

// ─── Helpers ────────────────────────────────────────────────────────────────

function toSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function upsertDoc(doc: Record<string, unknown>): Promise<{ _id: string }> {
    const result = await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0])
    console.log(`  ✓ ${doc._type}: ${doc.title as string}`)
    return result
}

// ─── Categories ─────────────────────────────────────────────────────────────

const CATEGORIES = [
    { name: 'Library', emoji: '📚' },
    { name: 'Food Bank / NGO', emoji: '🍱' },
    { name: 'Free Clinic / NGO', emoji: '🏥' },
    { name: 'Park & Library', emoji: '🌳' },
]

async function seedCategories(): Promise<Record<string, string>> {
    console.log('\n📂 Seeding categories…')
    const ids: Record<string, string> = {}

    for (const cat of CATEGORIES) {
        const slug = toSlug(cat.name)
        const doc = await upsertDoc({
            _id: `category-${slug}`,
            _type: 'category',
            title: cat.name,
            slug: { _type: 'slug', current: slug },
        })
        ids[cat.name] = doc._id
    }

    return ids
}

// ─── Regions ─────────────────────────────────────────────────────────────────

const REGIONS = [
    { name: 'Ellisbridge', pincode: '380006' },
    { name: 'Navrangpura', pincode: '380009' },
    { name: 'Vastrapur', pincode: '380015' },
    { name: 'Sardar Nagar', pincode: '382475' },
    { name: 'Ambawadi', pincode: '380015' },
]

async function seedRegions(): Promise<Record<string, string>> {
    console.log('\n📍 Seeding regions…')
    const ids: Record<string, string> = {}

    for (const region of REGIONS) {
        const slug = toSlug(region.name)
        const doc = await upsertDoc({
            _id: `region-${slug}`,
            _type: 'region',
            title: region.name,
            pincode: region.pincode,
        })
        ids[region.name] = doc._id
    }

    return ids
}

// ─── Resources ───────────────────────────────────────────────────────────────

function buildResources(
    categoryIds: Record<string, string>,
    regionIds: Record<string, string>
) {
    return [
        {
            _id: 'resource-mj-library',
            title: 'M.J. Library (Sheth Maneklal Jethabhai Pustakalaya)',
            category: 'Library',
            region: 'Ellisbridge',
            description:
                'One of the oldest public libraries in Ahmedabad with over 7.5 lakh books. Features a digital wing with rare digitized manuscripts and periodicals dating back centuries. Open to all residents free of charge.',
            address: 'Kavi Nanalal Marg, Near Town Hall, Ellisbridge, Ahmedabad',
        },
        {
            _id: 'resource-st-xaviers',
            title: 'St. Xavier\'s Social Service Society',
            category: 'Food Bank / NGO',
            region: 'Navrangpura',
            description:
                'Provides essential food donations, rations, and community support for marginalized groups in Ahmedabad. Runs regular distribution drives for families below the poverty line.',
            address: 'Opposite Loyola School, Navrangpura, Ahmedabad',
        },
        {
            _id: 'resource-vikram-sarabhai-library',
            title: 'Vikram Sarabhai Library (IIMA)',
            category: 'Library',
            region: 'Vastrapur',
            description:
                'State-of-the-art academic library housed in the IIM Ahmedabad campus. Contains an extensive collection of business, management, and social science literature. External reader access available on request.',
            address: 'Indian Institute of Management, Vastrapur, Ahmedabad',
        },
        {
            _id: 'resource-mother-krishna',
            title: 'Mother Krishna Charitable Trust',
            category: 'Free Clinic / NGO',
            region: 'Sardar Nagar',
            description:
                'Charitable trust offering free and subsidized medical care, health checkups, and food donations to those in need. Runs daily OPD clinics staffed by volunteer doctors.',
            address: 'Opposite Shree Jogani Temple, Sardar Nagar, Ahmedabad',
        },
        {
            _id: 'resource-parimal-garden-library',
            title: 'Parimal Garden Mini-Library',
            category: 'Park & Library',
            region: 'Ambawadi',
            description:
                'A free, open-air community mini-library set up inside Parimal Garden by local volunteers. Contains donated books in Gujarati, Hindi, and English. Open during garden hours.',
            address: 'Parimal Garden, Ambawadi, Ahmedabad',
        },
    ].map((r) => ({
        _id: r._id,
        _type: 'resource',
        title: r.title,
        slug: { _type: 'slug', current: toSlug(r.title) },
        category: { _type: 'reference', _ref: categoryIds[r.category] },
        region: { _type: 'reference', _ref: regionIds[r.region] },
        description: r.description,
        address: r.address,
        isApproved: true,
    }))
}

async function seedResources(
    categoryIds: Record<string, string>,
    regionIds: Record<string, string>
) {
    console.log('\n🏛️  Seeding resources…')
    const resources = buildResources(categoryIds, regionIds)

    for (const resource of resources) {
        await upsertDoc(resource)
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log('🌱 Starting seed…')
    console.log(`   Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
    console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'}`)

    if (!process.env.SANITY_API_WRITE_TOKEN) {
        console.error('\n❌ SANITY_API_WRITE_TOKEN is not set in .env.local')
        process.exit(1)
    }

    const categoryIds = await seedCategories()
    const regionIds = await seedRegions()
    await seedResources(categoryIds, regionIds)

    console.log('\n✅ Seed complete!')
}

main().catch((err) => {
    console.error('\n❌ Seed failed:', err)
    process.exit(1)
})
