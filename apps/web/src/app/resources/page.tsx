import { Suspense } from 'react'
import { sanityFetch } from '@/sanity/lib/live'
import { GET_RESOURCES_QUERY, GET_CATEGORIES_QUERY } from '@/sanity/lib/queries'
import { ResourceCard } from '@/components/ResourceCard'
import GoogleMapComponent from '@/components/GoogleMapComponent'
import Link from 'next/link'
import { Filter } from 'lucide-react'

// This page requires searchParams so it can dynamically filter by category.
export default async function ResourcesListingPage(props: { searchParams: Promise<{ category?: string }> }) {
    const searchParams = await props.searchParams;
    const { category } = searchParams
    
    const [{ data: resources }, { data: categories }] = await Promise.all([
        sanityFetch({ query: GET_RESOURCES_QUERY, params: { category: category || null, region: null } }),
        sanityFetch({ query: GET_CATEGORIES_QUERY })
    ])

    return (
        <div className="flex h-[calc(100vh-64px)] flex-col md:flex-row overflow-hidden bg-slate-50">
            <aside className="flex h-full w-full flex-col border-r-2 border-slate-900 bg-white md:w-1/2 lg:w-[45%] xl:w-[40%]">
                <div className="border-b-2 border-slate-900 p-6">
                    <h1 className="font-display text-3xl font-black text-slate-900">
                        {category ? `${category.replace(/-/g, ' ')}` : 'All Resources'}
                    </h1>
                    <p className="mt-2 text-sm font-medium text-slate-600">Showing {resources.length} location(s) in Ahmedabad.</p>
                    
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        <Link 
                            href="/resources" 
                            className={`rounded-full border-2 ${!category ? 'border-slate-900 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900'} px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors`}
                        >
                            All
                        </Link>
                        {categories.map((cat: any) => (
                            <Link 
                                key={cat._id}
                                href={`/resources?category=${cat.slug}`} 
                                className={`rounded-full border-2 ${category === cat.slug ? 'border-slate-900 bg-brand-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:-translate-y-0.5'} px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all`}
                            >
                                {cat.title}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6">
                    {resources.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {resources.map((resource: any) => (
                                <ResourceCard key={resource._id} resource={resource} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-center p-8">
                            <Filter className="h-12 w-12 text-slate-300 mb-4" />
                            <h3 className="font-display text-xl font-bold text-slate-900">No resources found</h3>
                            <p className="mt-2 text-slate-500">We couldn't find any locations matching this filter.</p>
                            {category && (
                                <Link href="/resources" className="mt-6 font-bold text-brand-600 hover:underline">Clear filters</Link>
                            )}
                        </div>
                    )}
                </div>
            </aside>

            <main className="relative hidden w-full h-[calc(100vh-64px)] bg-slate-100 p-4 md:block md:w-1/2 lg:w-[55%] xl:w-[60%]">
                <Suspense fallback={<div className="h-full w-full animate-pulse rounded-2xl bg-slate-200" />}>
                   <GoogleMapComponent resources={resources} />
                </Suspense>
            </main>
            
            {/* Mobile View Map Toggle */}
            <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden h-[40vh] shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                <Suspense fallback={<div className="h-full w-full animate-pulse rounded-2xl border-2 border-slate-900 bg-slate-200" />}>
                    <GoogleMapComponent resources={resources} />
                </Suspense>
            </div>
        </div>
    )
}
