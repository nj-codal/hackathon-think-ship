import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/live'
import { allCategoriesQuery } from '@/sanity/lib/queries'
import CategoryCard from '@/components/CategoryCard'
import type { Category } from '@/types'

export default async function Home() {
    const { data: rawCategories } = await sanityFetch({ query: allCategoriesQuery })
    const categories = rawCategories as Category[]

    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-teal-950 text-white">
                {/* Decorative circles */}
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-700/30 blur-3xl pointer-events-none" aria-hidden="true" />
                <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-saffron-500/20 blur-3xl pointer-events-none" aria-hidden="true" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
                    <div className="max-w-2xl">
                        <span className="inline-block bg-saffron-500/20 text-saffron-400 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6 border border-saffron-500/30">
                            Ahmedabad, Gujarat
                        </span>
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Find Community
                            <br />
                            <span className="text-saffron-400">Resources Near You</span>
                        </h1>
                        <p className="text-teal-100 text-lg leading-relaxed mb-10 max-w-xl">
                            Discover mental health support, food banks, clinics, gyms, and essential services across all neighbourhoods of Ahmedabad.
                        </p>

                        {/* Search Bar */}
                        <form action="/resources" method="GET" className="flex gap-3 max-w-lg">
                            <div className="flex-1 relative">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search by name or area…"
                                    className="w-full pl-10 pr-4 py-3.5 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-saffron-500 hover:bg-saffron-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm flex-shrink-0"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-white border-b border-warm-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-wrap gap-8 justify-center sm:justify-start text-center sm:text-left">
                        {[
                            { label: 'Resource Categories', value: categories.length > 0 ? `${categories.length}+` : 'Multiple' },
                            { label: 'Neighbourhoods', value: 'All of Ahmedabad' },
                            { label: 'Free to Use', value: '100%' },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-2xl font-display font-bold text-teal-700">{value}</p>
                                <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-teal-900 mb-1">Browse by Category</h2>
                        <p className="text-gray-500 text-sm">Choose a category to explore available resources</p>
                    </div>
                    <Link
                        href="/resources"
                        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors"
                    >
                        View all →
                    </Link>
                </div>

                {categories.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categories.map((category) => (
                            <CategoryCard key={category._id} category={category} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-warm-100 rounded-2xl">
                        <div className="text-5xl mb-4">🏗️</div>
                        <p className="font-semibold text-gray-700 mb-1">No categories yet</p>
                        <p className="text-sm text-gray-500 mb-4">
                            Add categories in{' '}
                            <a href="http://localhost:3333" target="_blank" rel="noreferrer" className="text-teal-700 underline">
                                Sanity Studio
                            </a>
                        </p>
                    </div>
                )}
            </section>

            {/* CTA Banner */}
            <section className="bg-saffron-100 border-t border-saffron-500/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="font-display text-2xl font-bold text-gray-900 mb-1">
                            Know a resource we&apos;re missing?
                        </h3>
                        <p className="text-gray-600 text-sm">Help your community — suggest a resource to add to the map.</p>
                    </div>
                    <a
                        href="http://localhost:3333"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-shrink-0 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
                    >
                        Add a Resource
                    </a>
                </div>
            </section>
        </>
    )
}
