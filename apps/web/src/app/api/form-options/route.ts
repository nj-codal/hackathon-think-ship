import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET() {
    try {
        const [categories, regions] = await Promise.all([
            client.fetch(`*[_type == "category"] | order(title asc) { _id, title }`),
            client.fetch(`*[_type == "region"] | order(title asc) { _id, title }`),
        ])
        return NextResponse.json({ categories, regions })
    } catch (error) {
        console.error('Failed to fetch form options:', error)
        return NextResponse.json({ categories: [], regions: [] }, { status: 500 })
    }
}
