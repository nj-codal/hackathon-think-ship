import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amdavadmap.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/resources`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/submit`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    // Dynamic resource pages
    const resources = await client.fetch<{ slug: string; _updatedAt: string }[]>(
        `*[_type == "resource" && isApproved == true] { "slug": slug.current, _updatedAt }`
    )

    const resourcePages: MetadataRoute.Sitemap = resources.map((resource) => ({
        url: `${BASE_URL}/resources/${resource.slug}`,
        lastModified: new Date(resource._updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...staticPages, ...resourcePages]
}
