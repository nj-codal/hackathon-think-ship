import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { z } from 'zod'

const writeClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2025-01-01',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
})

const submitSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(120),
    categoryId: z.string().min(1, 'Category is required'),
    regionId: z.string().min(1, 'Region is required'),
    address: z.string().min(5, 'Address must be at least 5 characters').max(300),
    description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
    phone: z.string().max(20).optional(),
    email: z.string().email('Invalid email').max(100).optional().or(z.literal('')),
})

function toSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 96)
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as unknown
        const parsed = submitSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const { title, categoryId, regionId, address, description, phone, email } = parsed.data

        await writeClient.create({
            _type: 'resource',
            title,
            slug: {
                _type: 'slug',
                current: toSlug(title),
            },
            category: { _type: 'reference', _ref: categoryId },
            region: { _type: 'reference', _ref: regionId },
            address,
            description,
            contactInfo: {
                phone: phone ?? '',
                email: email ?? '',
            },
            isApproved: false,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[submit-resource]', error)
        return NextResponse.json(
            { error: 'Failed to submit. Please try again later.' },
            { status: 500 }
        )
    }
}
