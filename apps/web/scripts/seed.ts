import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lizsas7c',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2025-01-01',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN,
})

// --- Helpers ---

async function upsert(type: string, title: string, extraFields: Record<string, any> = {}) {
    const existing = await client.fetch(`*[_type == $type && title == $title][0]._id`, { type, title })
    if (existing) {
        console.log(`  ✓ ${type} "${title}" already exists (${existing})`)
        return existing
    }

    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const doc = await client.create({
        _type: type,
        title,
        slug: { _type: 'slug', current: slug },
        ...extraFields,
    })
    console.log(`  + Created ${type} "${title}" (${doc._id})`)
    return doc._id
}

// --- Data ---

const categories = [
    'Library',
    'Food Bank / NGO',
    'Free Clinic / NGO',
    'Park & Library',
    'Community Gym',
    'Xerox Shop',
    'Puncture Shop',
    'Petrol Pump',
    'Civic Center',
]

const regions = [
    { title: 'Ellisbridge', pincode: '380006' },
    { title: 'Navrangpura', pincode: '380009' },
    { title: 'Vastrapur', pincode: '380015' },
    { title: 'Sardar Nagar', pincode: '380018' },
    { title: 'Ambawadi', pincode: '380015' },
    { title: 'Bopal', pincode: '380058' },
    { title: 'Satellite', pincode: '380015' },
]

interface SeedResource {
    title: string
    category: string
    region: string
    description: string
    address: string
    lat: number
    lng: number
    phone?: string
    email?: string
}

const resources: SeedResource[] = [
    {
        title: 'M.J. Library (Sheth Maneklal Jethabhai Pustakalaya)',
        category: 'Library',
        region: 'Ellisbridge',
        description:
            'One of the oldest public libraries in Ahmedabad with over 7.5 lakh books. Features a digital wing with rare digitized manuscripts.',
        address: 'Kavi Nanalal Marg, Near Town Hall, Ellisbridge.',
        lat: 23.0258,
        lng: 72.5703,
    },
    {
        title: "St. Xavier's Social Service Society",
        category: 'Food Bank / NGO',
        region: 'Navrangpura',
        description:
            'Provides essential food donations, rations, and community support for marginalized groups.',
        address: 'Opposite Loyola School, Navrangpura.',
        lat: 23.0374,
        lng: 72.5595,
    },
    {
        title: 'Vikram Sarabhai Library (IIMA)',
        category: 'Library',
        region: 'Vastrapur',
        description: 'State-of-the-art academic library housed in the IIM Ahmedabad campus.',
        address: 'Indian Institute of Management, Vastrapur.',
        lat: 23.0285,
        lng: 72.5247,
    },
    {
        title: 'Mother Krishna Charitable Trust',
        category: 'Free Clinic / NGO',
        region: 'Sardar Nagar',
        description:
            'Charitable trust offering free/subsidized medical care and food donations to those in need.',
        address: 'Opposite Shree Jogani Temple, Sardar Nagar.',
        lat: 23.0595,
        lng: 72.6055,
    },
    {
        title: 'Parimal Garden Mini-Library',
        category: 'Park & Library',
        region: 'Ambawadi',
        description:
            'A free, open-air community mini-library set up inside Parimal Garden by local volunteers.',
        address: 'Parimal Garden, Ambawadi.',
        lat: 23.0284,
        lng: 72.5536,
    },
]

// --- Main ---

async function seed() {
    console.log('\n🌱 Seeding Sanity Database...\n')

    // 1. Upsert Categories
    console.log('📁 Categories:')
    const categoryIds: Record<string, string> = {}
    for (const cat of categories) {
        categoryIds[cat] = await upsert('category', cat)
    }

    // 2. Upsert Regions
    console.log('\n📍 Regions:')
    const regionIds: Record<string, string> = {}
    for (const region of regions) {
        regionIds[region.title] = await upsert('region', region.title, {
            pincode: region.pincode,
        })
    }

    // 3. Insert Resources
    console.log('\n🏗️  Resources:')
    for (const res of resources) {
        const existing = await client.fetch(`*[_type == "resource" && title == $title][0]._id`, {
            title: res.title,
        })
        if (existing) {
            console.log(`  ✓ Resource "${res.title}" already exists (${existing})`)
            continue
        }

        const slug = res.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        // Auto-generate SEO
        const metaTitle = `${res.title} - ${res.category} in ${res.region}, Ahmedabad`.slice(0, 60)
        const metaDescription = `Visit ${res.title}, a top-rated ${res.category} located in ${res.region}, Ahmedabad. Find contact info, location, and services offered here.`.slice(0, 160)

        // Determine Schema.org type
        let schemaType = 'LocalBusiness'
        const catLower = res.category.toLowerCase()
        if (catLower.includes('clinic') || catLower.includes('ngo')) schemaType = 'MedicalClinic'
        if (catLower.includes('library')) schemaType = 'Library'
        if (catLower.includes('gym')) schemaType = 'ExerciseGym'
        if (catLower.includes('food')) schemaType = 'NGO'
        if (catLower.includes('park')) schemaType = 'LocalBusiness'

        await client.create({
            _type: 'resource',
            title: res.title,
            slug: { _type: 'slug', current: slug },
            category: { _type: 'reference', _ref: categoryIds[res.category] },
            region: { _type: 'reference', _ref: regionIds[res.region] },
            description: res.description,
            address: res.address,
            location: { _type: 'geopoint', lat: res.lat, lng: res.lng },
            contactInfo: {
                phone: res.phone,
                email: res.email,
            },
            isApproved: true,
            seo: {
                metaTitle,
                metaDescription,
                keywords: [res.category, res.region, 'Ahmedabad', 'community resource'],
            },
            structuredData: {
                schemaType,
                priceRange: '₹0',
            },
        })
        console.log(`  + Created resource "${res.title}"`)
    }

    console.log('\n✅ Seeding complete!\n')
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
})
