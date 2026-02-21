import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/live'
import { GET_CATEGORIES_QUERY, GET_RESOURCES_QUERY } from '@/sanity/lib/queries'
import { CategoryCard } from '@/components/CategoryCard'
import { ResourceCard } from '@/components/ResourceCard'

export default async function HomePage() {
    const [{ data: categories }, { data: recentResources }] = await Promise.all([
        sanityFetch({ query: GET_CATEGORIES_QUERY }),
        sanityFetch({ query: GET_RESOURCES_QUERY, params: { category: null, region: null } })
    ])

    return (
        <div className="flex flex-col gap-16 pb-16">
            <section className="relative overflow-hidden bg-brand-900 px-4 py-24 sm:px-6 lg:px-8">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                <div className="container relative z-10 mx-auto max-w-4xl text-center">
                    <span className="inline-block rounded-full border border-brand-400 bg-brand-800 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-brand-100">
                        Civic Data For Everyone
                    </span>
                    <h1 className="mt-8 font-display text-5xl font-black leading-tight text-white sm:text-7xl">
                        Find What You Need in <span className="text-accent-400">Ahmedabad.</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-brand-100 sm:text-xl">
                        A crowdsourced, beautifully mapped directory of essential local resources. 
                        From clinics and food banks to community gyms and study halls.
                    </p>
                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                        <Link 
                            href="/resources"
                            className="inline-flex items-center justify-center rounded-xl border-2 border-slate-900 bg-accent-400 px-8 py-4 font-display text-lg font-bold text-slate-900 transition-transform brutal-shadow"
                        >
                            Explore Directory
                        </Link>
                        <Link 
                            href="/submit"
                            className="inline-flex items-center justify-center rounded-xl bg-white/10 px-8 py-4 font-display text-lg font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                        >
                            Add a Resource
                        </Link>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-10 flex items-end justify-between border-b-2 border-slate-900 pb-4">
                    <div>
                        <h2 className="font-display text-3xl font-black text-slate-900 sm:text-4xl">Browse Categories</h2>
                        <p className="mt-2 text-slate-600 font-medium">Find services by what you need.</p>
                    </div>
                </header>
                
                {categories.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.map((category: any) => (
                            <CategoryCard key={category._id} category={category} />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-48 items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white">
                        <p className="text-slate-500 font-medium">No categories added yet. Check the Studio!</p>
                    </div>
                )}
            </section>
        </div>
    )
}
