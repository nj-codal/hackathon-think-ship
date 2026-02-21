import { sanityFetch } from '@/sanity/lib/live'
import { allCategoriesQuery, allRegionsQuery } from '@/sanity/lib/queries'
import type { Category, Region } from '@/types'
import SubmitForm from './SubmitForm'
import Link from 'next/link'

export const metadata = {
    title: 'Submit a Resource — Ahmedabad Resource Map',
    description: "Know a community resource we're missing? Submit it for review and help your neighbours find it.",
}

export default async function SubmitPage() {
    const [{ data: rawCategories }, { data: rawRegions }] = await Promise.all([
        sanityFetch({ query: allCategoriesQuery }),
        sanityFetch({ query: allRegionsQuery }),
    ])

    const categories = rawCategories as Category[]
    const regions = rawRegions as Region[]

    return (
        <>
            {/* Page header */}
            <section className="bg-gradient-to-br from-teal-900 to-teal-800 text-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-teal-300 hover:text-white text-sm mb-6 transition-colors">
                        ← Back to home
                    </Link>
                    <span className="inline-block bg-saffron-500/20 text-saffron-400 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4 border border-saffron-500/30">
                        Community Contribution
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                        Submit a Resource
                    </h1>
                    <p className="text-teal-200 leading-relaxed max-w-lg">
                        Help your community by adding a resource to the map. All submissions are reviewed before going live.
                    </p>
                </div>
            </section>

            {/* Form card */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-warm-200 shadow-sm p-6 sm:p-8">
                        <SubmitForm categories={categories} regions={regions} />
                    </div>

                    {/* Sidebar tips */}
                    <div className="space-y-5">
                        <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100">
                            <h3 className="font-display font-semibold text-teal-900 mb-3">What happens next?</h3>
                            <ol className="space-y-3 text-sm text-gray-600">
                                {[
                                    'Your submission is saved as "Pending"',
                                    'Our team reviews it for accuracy',
                                    'Once approved, it appears on the public map',
                                ].map((step, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-teal-700 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {i + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="bg-saffron-100 rounded-2xl p-5 border border-saffron-500/20">
                            <h3 className="font-display font-semibold text-gray-900 mb-2">Good to know</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-saffron-500 flex-shrink-0">•</span>
                                    Only resources in Ahmedabad are listed
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-saffron-500 flex-shrink-0">•</span>
                                    Free and community-focused resources are prioritised
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-saffron-500 flex-shrink-0">•</span>
                                    Duplicate or spam submissions are removed
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
