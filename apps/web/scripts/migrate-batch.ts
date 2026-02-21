import { createClient } from '@sanity/client'
import 'dotenv/config'
import data from './ahmedabad-data.json'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lizsas7c',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2025-01-01',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
})

const BATCH_SIZE = 20

// Extra regions referenced in the large dataset but not in the original seed
const extraRegions = [
    { title: 'Thaltej', pincode: '380054' },
    { title: 'SG Highway', pincode: '380054' },
    { title: 'Maninagar', pincode: '380008' },
    { title: 'Chandkheda', pincode: '382424' },
    { title: 'Gota', pincode: '382481' },
    { title: 'Paldi', pincode: '380007' },
    { title: 'Ashram Road', pincode: '380009' },
]

async function getOrCreateDoc(type: string, title: string, extra: Record<string, any> = {}): Promise<string> {
    const existing = await client.fetch(`*[_type == $type && title == $title][0]._id`, { type, title })
    if (existing) return existing

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const doc = await client.create({ _type: type, title, slug: { _type: 'slug', current: slug }, ...extra })
    console.log(`  + Created ${type} "${title}"`)
    return doc._id
}

async function migrate() {
    console.log('\n🚀 Starting batch migration of', data.length, 'resources...\n')

    // 1. Ensure all categories exist
    console.log('📁 Ensuring categories...')
    const categoryMap: Record<string, string> = {}
    const categoryNames = [...new Set(data.map((d: any) => d.categorySlug))]
    for (const slug of categoryNames) {
        const title = slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        categoryMap[slug] = await getOrCreateDoc('category', title)
    }

    // 2. Ensure all regions exist (including extras)
    console.log('\n📍 Ensuring regions...')
    const regionMap: Record<string, string> = {}
    const regionSlugs = [...new Set(data.map((d: any) => d.regionSlug))]
    for (const slug of regionSlugs) {
        const title = slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        const extra = extraRegions.find((r) => r.title.toLowerCase().replace(/\s+/g, '-') === slug)
        regionMap[slug] = await getOrCreateDoc('region', title, extra ? { pincode: extra.pincode } : {})
    }

    // 3. Batch insert resources using transactions
    console.log('\n🏗️  Migrating resources in batches of', BATCH_SIZE, '...')
    const totalBatches = Math.ceil(data.length / BATCH_SIZE)

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE)
        const batchNum = Math.floor(i / BATCH_SIZE) + 1
        const transaction = client.transaction()

        for (const item of batch) {
            const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            const catTitle = item.categorySlug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            const regTitle = item.regionSlug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

            // Auto-generate SEO
            const metaTitle = `${item.title} - ${catTitle} in ${regTitle}, Ahmedabad`.slice(0, 60)
            const metaDescription = `Visit ${item.title}, a top-rated ${catTitle} located in ${regTitle}, Ahmedabad. Find contact info, location, and services offered here.`.slice(0, 160)

            // Determine Schema.org type from category
            let schemaType = 'LocalBusiness'
            const catLower = item.categorySlug.toLowerCase()
            if (catLower.includes('clinic') || catLower.includes('ngo')) schemaType = 'MedicalClinic'
            if (catLower.includes('library')) schemaType = 'Library'
            if (catLower.includes('gym')) schemaType = 'ExerciseGym'
            if (catLower.includes('food')) schemaType = 'NGO'

            const doc = {
                _id: `resource-${slug}`,
                _type: 'resource' as const,
                title: item.title,
                slug: { _type: 'slug' as const, current: slug },
                category: { _type: 'reference' as const, _ref: categoryMap[item.categorySlug] },
                region: { _type: 'reference' as const, _ref: regionMap[item.regionSlug] },
                description: (item as any).description || '',
                address: item.address,
                location: { _type: 'geopoint' as const, lat: item.lat, lng: item.lng },
                contactInfo: {
                    phone: item.phone,
                },
                isApproved: true,
                seo: {
                    metaTitle,
                    metaDescription,
                    keywords: [catTitle, regTitle, 'Ahmedabad', 'community resource'],
                },
                structuredData: {
                    schemaType,
                    priceRange: '₹0',
                },
            }

            transaction.createOrReplace(doc)
        }

        await transaction.commit()
        console.log(`  ✅ Migrated batch ${batchNum}/${totalBatches} (${batch.length} items)`)
    }

    console.log(`\n🎉 Migration complete! ${data.length} resources inserted.\n`)
}

migrate().catch((err) => {
    console.error('❌ Migration failed:', err)
    process.exit(1)
})
