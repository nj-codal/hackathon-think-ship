import { sanityFetch } from '@/sanity/lib/live'
import { resourceBySlugQuery } from '@/sanity/lib/queries'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Resource } from '@/types'
import LocalBusinessSchema from '@/components/LocalBusinessSchema'
import ResourceMapEmbed from '@/components/ResourceMapEmbed'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const { data: rawResource } = await sanityFetch({
        query: resourceBySlugQuery,
        params: { slug },
    })
    const resource = rawResource as Resource | null
    if (!resource) return {}

    const title = resource.seo?.metaTitle ?? `${resource.title} — Ahmedabad Resource Map`
    const description = resource.seo?.metaDescription ?? resource.description
    const ogImageUrl =
        resource.seo?.ogImage?.asset?.url ?? resource.featuredImage?.asset?.url

    return {
        title,
        description,
        keywords: resource.seo?.keywords,
        openGraph: {
            title,
            description: description ?? undefined,
            images: ogImageUrl ? [{ url: ogImageUrl }] : [],
        },
    }
}

const CATEGORY_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
    'food-bank':    { icon: '🍱', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
    'clinic':       { icon: '🏥', color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
    'gym':          { icon: '💪', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
    'xerox-shop':   { icon: '🖨️', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
    'playground':   { icon: '🌳', color: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
    'library':      { icon: '📚', color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200' },
}

function getCategoryMeta(slug?: string) {
    if (!slug) return { icon: '📍', color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200' }
    return CATEGORY_ICONS[slug] ?? { icon: '📍', color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200' }
}

export default async function ResourceDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const { data: rawResource } = await sanityFetch({
        query: resourceBySlugQuery,
        params: { slug },
    })
    const resource = rawResource as Resource | null

    if (!resource) {
        notFound()
    }

    const hasLocation = resource.location?.lat != null && resource.location?.lng != null
    const imageUrl = resource.featuredImage?.asset?.url
    const categorySlug = resource.category?.slug?.current
    const catMeta = getCategoryMeta(categorySlug)

    // Use description from content, fall back to SEO meta description
    const description = resource.description ?? resource.seo?.metaDescription

    const mapsLink = hasLocation
        ? `https://www.google.com/maps/search/?api=1&query=${resource.location!.lat},${resource.location!.lng}`
        : resource.address
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.address)}`
            : null

    return (
        <>
            <LocalBusinessSchema resource={resource} />

            {/* ── Hero ── */}
            <div className="relative bg-teal-950 overflow-hidden">
                {/* background image */}
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={resource.title}
                        fill
                        className="object-cover opacity-30"
                        priority
                        sizes="100vw"
                    />
                ) : (
                    /* decorative dot grid when no image */
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #b2e0e2 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />
                )}

                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/60 to-teal-900/40" />

                {/* decorative arc */}
                <div className="absolute -bottom-1 left-0 right-0 h-12 bg-cream" style={{ borderRadius: '60% 60% 0 0 / 100% 100% 0 0' }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-teal-300/70 mb-8">
                        <Link href="/" className="hover:text-teal-200 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/resources" className="hover:text-teal-200 transition-colors">Resources</Link>
                        <span>/</span>
                        <span className="text-teal-100 truncate max-w-[160px]">{resource.title}</span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                        {/* Big icon badge */}
                        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-4xl shadow-lg">
                            {catMeta.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            {resource.category && (
                                <span className="inline-block bg-saffron-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
                                    {resource.category.title}
                                </span>
                            )}
                            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                {resource.title}
                            </h1>
                            {resource.region && (
                                <p className="flex items-center gap-1.5 text-teal-200 text-sm mt-3">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {resource.region.title}
                                    {resource.region.pincode ? ` · PIN ${resource.region.pincode}` : ''}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Quick-action strip ── */}
            <div className="bg-white border-b border-warm-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
                    {resource.contactInfo?.phone && (
                        <a
                            href={`tel:${resource.contactInfo.phone}`}
                            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call Now
                        </a>
                    )}
                    {mapsLink && (
                        <a
                            href={mapsLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 bg-saffron-500 hover:bg-saffron-400 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Get Directions
                        </a>
                    )}
                    {resource.contactInfo?.website && (
                        <a
                            href={resource.contactInfo.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 border border-warm-200 hover:border-teal-300 text-gray-600 hover:text-teal-700 text-sm font-medium px-4 py-2 rounded-full transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Website
                        </a>
                    )}
                    <Link
                        href="/resources"
                        className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-teal-700 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        All resources
                    </Link>
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* ── Left column ── */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* About */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-1 h-6 rounded-full bg-teal-600 block" />
                                <h2 className="font-display text-xl font-semibold text-teal-900">About this resource</h2>
                            </div>
                            {description ? (
                                <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-line">{description}</p>
                            ) : (
                                <div className="bg-warm-100 rounded-2xl p-6 border border-warm-200">
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        <span className="font-semibold text-teal-800">{resource.title}</span> is a community resource
                                        {resource.category ? ` in the ${resource.category.title} category` : ''}{resource.region ? ` serving the ${resource.region.title} area` : ''} of Ahmedabad.
                                        Contact them directly for the latest details on services and timings.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Key details grid */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-1 h-6 rounded-full bg-teal-600 block" />
                                <h2 className="font-display text-xl font-semibold text-teal-900">Details</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {resource.category && (
                                    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${catMeta.bg}`}>
                                        <span className="text-2xl leading-none mt-0.5">{catMeta.icon}</span>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Category</p>
                                            <p className={`font-semibold text-sm ${catMeta.color}`}>{resource.category.title}</p>
                                        </div>
                                    </div>
                                )}
                                {resource.region && (
                                    <div className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50 p-4">
                                        <span className="text-2xl leading-none mt-0.5">📍</span>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Area</p>
                                            <p className="font-semibold text-sm text-teal-700">
                                                {resource.region.title}
                                                {resource.region.pincode ? <span className="font-normal text-teal-500"> · {resource.region.pincode}</span> : ''}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {resource.address && (
                                    <div className="flex items-start gap-3 rounded-2xl border border-warm-200 bg-white p-4 sm:col-span-2">
                                        <span className="text-2xl leading-none mt-0.5">🗺️</span>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Full Address</p>
                                            <p className="text-sm text-gray-700 leading-relaxed">{resource.address}</p>
                                        </div>
                                    </div>
                                )}
                                {resource.contactInfo?.phone && (
                                    <div className="flex items-start gap-3 rounded-2xl border border-warm-200 bg-white p-4">
                                        <span className="text-2xl leading-none mt-0.5">📞</span>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Phone</p>
                                            <a href={`tel:${resource.contactInfo.phone}`} className="text-sm font-semibold text-teal-700 hover:text-teal-900">
                                                {resource.contactInfo.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {resource.contactInfo?.email && (
                                    <div className="flex items-start gap-3 rounded-2xl border border-warm-200 bg-white p-4">
                                        <span className="text-2xl leading-none mt-0.5">✉️</span>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Email</p>
                                            <a href={`mailto:${resource.contactInfo.email}`} className="text-sm font-semibold text-teal-700 hover:text-teal-900 break-all">
                                                {resource.contactInfo.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {resource.contactInfo?.website && (
                                    <div className="flex items-start gap-3 rounded-2xl border border-warm-200 bg-white p-4">
                                        <span className="text-2xl leading-none mt-0.5">🌐</span>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Website</p>
                                            <a
                                                href={resource.contactInfo.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm font-semibold text-teal-700 hover:text-teal-900 break-all"
                                            >
                                                {resource.contactInfo.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Services */}
                        {resource.services && resource.services.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="w-1 h-6 rounded-full bg-saffron-500 block" />
                                    <h2 className="font-display text-xl font-semibold text-teal-900">Services Offered</h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {resource.services.map((service, i) => (
                                        <span
                                            key={i}
                                            className="bg-teal-50 text-teal-800 border border-teal-200 text-sm font-medium px-4 py-2 rounded-full"
                                        >
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Eligibility */}
                        {resource.eligibility && (
                            <section>
                                <div className="flex items-start gap-4 bg-saffron-100 border border-saffron-500/30 rounded-2xl p-5">
                                    <div className="w-10 h-10 rounded-xl bg-saffron-500 flex items-center justify-center flex-shrink-0 text-white text-lg">
                                        ✓
                                    </div>
                                    <div>
                                        <h2 className="font-display text-lg font-semibold text-gray-900 mb-1">Who can use this?</h2>
                                        <p className="text-gray-700 text-sm leading-relaxed">{resource.eligibility}</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Gallery */}
                        {resource.gallery && resource.gallery.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="w-1 h-6 rounded-full bg-teal-600 block" />
                                    <h2 className="font-display text-xl font-semibold text-teal-900">Gallery</h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {resource.gallery.map((img, i) =>
                                        img.asset?.url ? (
                                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-warm-100 border border-warm-200">
                                                <Image
                                                    src={img.asset.url}
                                                    alt={`${resource.title} photo ${i + 1}`}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 640px) 50vw, 33vw"
                                                />
                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* ── Right sidebar ── */}
                    <div className="space-y-6">

                        {/* Map card */}
                        {hasLocation && (
                            <div className="rounded-2xl overflow-hidden border border-warm-200 shadow-sm">
                                <div className="h-56">
                                    <ResourceMapEmbed
                                        id={resource._id}
                                        title={resource.title}
                                        lat={resource.location!.lat}
                                        lng={resource.location!.lng}
                                    />
                                </div>
                                {mapsLink && (
                                    <a
                                        href={mapsLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 text-xs font-semibold text-teal-700 hover:text-teal-900 hover:bg-teal-50 bg-white border-t border-warm-200 py-3 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Open in Google Maps
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Call-to-action */}
                        {resource.contactInfo?.phone && (
                            <a
                                href={`tel:${resource.contactInfo.phone}`}
                                className="flex items-center justify-center gap-2 w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3.5 rounded-2xl transition-colors text-sm shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Call {resource.contactInfo.phone}
                            </a>
                        )}

                        {/* "Know something wrong?" nudge */}
                        <p className="text-center text-xs text-gray-400 leading-relaxed">
                            Something outdated?{' '}
                            <Link href="/submit" className="text-teal-600 hover:text-teal-800 underline underline-offset-2">
                                Submit an update
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
