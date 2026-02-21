import { sanityFetch } from '@/sanity/lib/live'
import { allResourcesQuery, allCategoriesQuery, allRegionsQuery } from '@/sanity/lib/queries'
import ResourcesPageClient from './ResourcesPageClient'
import type { Resource, Category, Region } from '@/types'

interface SearchParams {
    search?: string
    category?: string
}

export default async function ResourcesPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const params = await searchParams

    const [{ data: rawResources }, { data: rawCategories }, { data: rawRegions }] =
        await Promise.all([
            sanityFetch({ query: allResourcesQuery }),
            sanityFetch({ query: allCategoriesQuery }),
            sanityFetch({ query: allRegionsQuery }),
        ])

    const resources = rawResources as Resource[]
    const categories = rawCategories as Category[]
    const regions = rawRegions as Region[]

    return (
        <ResourcesPageClient
            resources={resources}
            categories={categories}
            regions={regions}
            initialSearch={params.search ?? ''}
            initialCategory={params.category ?? ''}
        />
    )
}
