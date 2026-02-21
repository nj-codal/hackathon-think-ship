import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const writeClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2025-01-01',
    useCdn: false,
    token: process.env.SANITY_API_WRITE_TOKEN, // Must be a write-capable token
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, categoryId, regionId, address, description, phone, email } = body

        if (!title || !categoryId || !regionId || !address || !description) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
        }

        // Sanitize and build the slug from the title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const doc = {
            _type: 'resource',
            title: title.trim(),
            slug: { _type: 'slug', current: slug },
            category: { _type: 'reference', _ref: categoryId },
            region: { _type: 'reference', _ref: regionId },
            address: address.trim(),
            description: description.trim(),
            contactInfo: {
                phone: phone?.trim() || undefined,
                email: email?.trim() || undefined,
            },
            isApproved: false, // Submitted resources are NOT approved by default
        }

        const result = await writeClient.create(doc)

        return NextResponse.json({ message: 'Resource submitted successfully!', id: result._id }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating resource:', error)
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 })
    }
}
