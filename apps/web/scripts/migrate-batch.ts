import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import { createClient } from '@sanity/client'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
})

const CATEGORIES = [
    { slug: 'food-bank', title: 'Food Bank & NGO' },
    { slug: 'clinic', title: 'Free Clinic / OPD' },
    { slug: 'gym', title: 'Gym & Fitness' },
    { slug: 'xerox-shop', title: 'Print & Copy Centre' },
    { slug: 'playground', title: 'Park & Playground' },
]

const REGIONS = [
    { slug: 'bopal', title: 'Bopal', pincode: '380058' },
    { slug: 'satellite', title: 'Satellite', pincode: '380015' },
    { slug: 'thaltej', title: 'Thaltej', pincode: '380054' },
    { slug: 'sg-highway', title: 'SG Highway', pincode: '380060' },
    { slug: 'maninagar', title: 'Maninagar', pincode: '380008' },
    { slug: 'chandkheda', title: 'Chandkheda', pincode: '382424' },
    { slug: 'gota', title: 'Gota', pincode: '382481' },
    { slug: 'paldi', title: 'Paldi', pincode: '380007' },
    { slug: 'vastrapur', title: 'Vastrapur', pincode: '380015' },
    { slug: 'ashram-road', title: 'Ashram Road', pincode: '380009' },
]

interface RawRecord {
    title: string
    categorySlug: string
    regionSlug: string
    address: string
    phone: string
    lat: number
    lng: number
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

function chunk<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
    }
    return chunks
}

async function main() {
    console.log('Starting batch migration...\n')

    // Step 1: Upsert categories
    console.log('Upserting categories...')
    for (const cat of CATEGORIES) {
        await client.createOrReplace({
            _id: `category-${cat.slug}`,
            _type: 'category',
            title: cat.title,
            slug: { _type: 'slug', current: cat.slug },
        })
        console.log(`  Category: ${cat.title}`)
    }

    // Step 2: Upsert regions
    console.log('\nUpserting regions...')
    for (const reg of REGIONS) {
        await client.createOrReplace({
            _id: `region-${reg.slug}`,
            _type: 'region',
            title: reg.title,
            pincode: reg.pincode,
        })
        console.log(`  Region: ${reg.title}`)
    }

    // Step 3: Load records from JSON
    const dataPath = path.resolve(process.cwd(), 'scripts/ahmedabad-data.json')
    const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as RawRecord[]
    console.log(`\nLoaded ${rawData.length} records from ahmedabad-data.json`)

    // Build lookup maps
    const categoryMap = Object.fromEntries(
        CATEGORIES.map(c => [c.slug, { id: `category-${c.slug}`, title: c.title }])
    )
    const regionMap = Object.fromEntries(
        REGIONS.map(r => [r.slug, { id: `region-${r.slug}`, title: r.title }])
    )

    // Step 4: Migrate in chunks of 20 using transaction API
    const batches = chunk(rawData, 20)
    console.log(`\nMigrating ${rawData.length} resources in ${batches.length} batches...\n`)

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]!
        const transaction = client.transaction()

        for (const record of batch) {
            const category = categoryMap[record.categorySlug]
            const region = regionMap[record.regionSlug]

            if (!category || !region) {
                console.warn(`  Skipping "${record.title}": unknown category "${record.categorySlug}" or region "${record.regionSlug}"`)
                continue
            }

            const docId = `resource-${slugify(record.title)}`
            const regionTitle = region.title
            const categoryTitle = category.title

            transaction.createOrReplace({
                _id: docId,
                _type: 'resource',
                title: record.title,
                slug: { _type: 'slug', current: slugify(record.title) },
                isApproved: true,
                address: record.address,
                location: { _type: 'geopoint', lat: record.lat, lng: record.lng },
                contactInfo: { phone: record.phone },
                category: { _type: 'reference', _ref: category.id },
                region: { _type: 'reference', _ref: region.id },
                seo: {
                    metaTitle: `${record.title} — ${regionTitle}, Ahmedabad`,
                    metaDescription: `Find ${categoryTitle.toLowerCase()} services at ${record.title} in ${regionTitle}, Ahmedabad. Address: ${record.address}. Contact: ${record.phone}.`,
                    keywords: [categoryTitle, regionTitle, 'Ahmedabad', 'community resource'],
                },
                structuredData: {
                    schemaType: 'LocalBusiness',
                },
            })
        }

        await transaction.commit()
        console.log(`  Migrated batch ${i + 1}/${batches.length} (${batch.length} records)`)
    }

    console.log('\nMigration complete!')
}

main().catch(err => {
    console.error('Migration failed:', err)
    process.exit(1)
})
