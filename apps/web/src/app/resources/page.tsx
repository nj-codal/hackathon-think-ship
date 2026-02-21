import { sanityFetch } from '@/sanity/lib/live'
import { GET_RESOURCES_QUERY, GET_CATEGORIES_QUERY } from '@/sanity/lib/queries'
import { ResourcesListWithMap } from '@/components/ResourcesListWithMap'

export default async function ResourcesListingPage(props: { searchParams: Promise<{ category?: string }> }) {
    const searchParams = await props.searchParams;
    const { category } = searchParams
    
    const [{ data: resources }, { data: categories }] = await Promise.all([
        sanityFetch({ query: GET_RESOURCES_QUERY, params: { category: category || null, region: null } }),
        sanityFetch({ query: GET_CATEGORIES_QUERY })
    ])

    return (
        <ResourcesListWithMap 
            resources={resources} 
            categories={categories} 
            category={category} 
        />
    )
}
