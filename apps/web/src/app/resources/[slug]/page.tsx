import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Globe, Mail, MapPin, Phone, Users } from 'lucide-react'
import { sanityFetch } from '@/sanity/lib/live'
import { GET_RESOURCE_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import GoogleMapComponent from '@/components/GoogleMapComponent'
import { LocalBusinessSchema } from '@/components/LocalBusinessSchema'
import { getCategoryIcon } from '@/lib/categoryIcons'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params
    const { data: resource } = await sanityFetch({
        query: GET_RESOURCE_BY_SLUG_QUERY,
        params: { slug: params.slug },
    })

    if (!resource) {
        return { title: 'Resource Not Found' }
    }

    const seoTitle = resource.seo?.metaTitle || `${resource.title} - ${resource.category} in ${resource.region}, Ahmedabad`
    const seoDesc = resource.seo?.metaDescription || `Visit ${resource.title}, a top-rated ${resource.category} located in ${resource.region}, Ahmedabad. Find contact info, location, and services offered here.`

    return {
        title: seoTitle,
        description: seoDesc,
        keywords: resource.seo?.keywords || [],
        openGraph: {
            title: seoTitle,
            description: seoDesc,
            images: resource.seo?.ogImageUrl ? [resource.seo.ogImageUrl] : resource.featuredImageUrl ? [resource.featuredImageUrl] : [],
        },
    }
}

export default async function ResourceDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { data: resource } = await sanityFetch({ 
        query: GET_RESOURCE_BY_SLUG_QUERY, 
        params: { slug: params.slug } 
    })

    if (!resource) {
        notFound()
    }

    const hasDescription = !!resource.description
    const hasServices = resource.services && resource.services.length > 0
    const hasGallery = resource.galleryUrls && resource.galleryUrls.length > 0
    const hasMainContent = hasDescription || hasServices || hasGallery

    return (
        <div className="bg-white pb-24">
            <LocalBusinessSchema 
                resource={resource} 
                schemaType={resource.structuredData?.schemaType}
                priceRange={resource.structuredData?.priceRange}
                openingHours={resource.structuredData?.openingHours}
            />

            {/* Header / Hero */}
            <div className="relative bg-slate-50 pb-8">
                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/resources" className="inline-flex items-center gap-2 py-6 text-sm font-bold uppercase tracking-wider text-slate-500 hover:text-brand-600">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Map
                    </Link>
                    
                    <div className="relative overflow-hidden rounded-3xl border-2 border-slate-900 bg-brand-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] h-64 sm:h-80 lg:h-96">
                        {resource.featuredImageUrl ? (
                            <img src={resource.featuredImageUrl} alt={resource.title} className="h-full w-full object-cover opacity-70" />
                        ) : (
                            <div className="h-full w-full bg-linear-to-tr from-brand-900 to-brand-600" />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 p-6 sm:p-10">
                            <div className="mb-4 flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 rounded bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow">
                                    {(() => {
                                        const CategoryIcon = getCategoryIcon(resource.category)
                                        return <CategoryIcon className="h-3.5 w-3.5" />
                                    })()}
                                    {resource.category}
                                </span>
                                {resource.eligibility && (
                                    <span className="inline-flex items-center rounded border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                                        {resource.eligibility}
                                    </span>
                                )}
                            </div>
                            <h1 className="font-display text-4xl font-black text-white sm:text-5xl lg:text-6xl mt-2">{resource.title}</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
                <div className={`grid gap-12 ${hasMainContent ? 'lg:grid-cols-3' : 'lg:grid-cols-1 max-w-2xl'}`}>
                    
                    {/* Main Content */}
                    {hasMainContent && (
                        <main className="lg:col-span-2 space-y-12">
                            {hasDescription && (
                                <section>
                                    <h2 className="font-display text-2xl font-black text-slate-900 border-b-2 border-slate-200 pb-2 mb-6">About this place</h2>
                                    <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line">
                                        {resource.description}
                                    </p>
                                </section>
                            )}

                            {hasServices && (
                                <section>
                                    <h2 className="font-display text-2xl font-black text-slate-900 border-b-2 border-slate-200 pb-2 mb-6">Services Offered</h2>
                                    <ul className="grid gap-3 sm:grid-cols-2">
                                        {resource.services.map((service: string, i: number) => (
                                            <li key={i} className="flex items-center gap-3 rounded-xl border-2 border-slate-100 bg-slate-50 p-4 font-medium text-slate-700">
                                                <div className="h-2 w-2 rounded-full bg-brand-500" />
                                                {service}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {hasGallery && (
                                <section>
                                    <h2 className="font-display text-2xl font-black text-slate-900 border-b-2 border-slate-200 pb-2 mb-6">Gallery</h2>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                        {resource.galleryUrls.map((url: string, i: number) => (
                                            <div key={i} className="relative aspect-square overflow-hidden rounded-2xl border-2 border-slate-200">
                                                <img src={url} alt="Gallery image" className="h-full w-full object-cover transition-transform hover:scale-105" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </main>
                    )}

                    {/* Sidebar / Info Card */}
                    <aside className={`space-y-8 ${!hasMainContent ? 'w-full' : ''}`}>
                        <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                            <h3 className="font-display text-xl font-bold text-slate-900 mb-6">Contact & Location</h3>
                            
                            <div className="space-y-6">
                                {/* Category & Region Tags */}
                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-bold text-brand-700">
                                        {(() => {
                                            const CategoryIcon = getCategoryIcon(resource.category)
                                            return <CategoryIcon className="h-4 w-4" />
                                        })()}
                                        {resource.category}
                                    </div>
                                    <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
                                        <MapPin className="h-4 w-4" />
                                        {resource.region}
                                    </div>
                                    {resource.eligibility && (
                                        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
                                            <Users className="h-4 w-4" />
                                            {resource.eligibility}
                                        </div>
                                    )}
                                </div>

                                {(resource.address || resource.region) && (
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Address</p>
                                            <p className="mt-1 font-medium text-slate-900">{resource.address || 'Not provided'}</p>
                                            <p className="text-sm text-slate-600">{resource.region} {resource.pincode && `- ${resource.pincode}`}</p>
                                        </div>
                                    </div>
                                )}

                                {resource.contactInfo?.phone && (
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Phone</p>
                                            <a href={`tel:${resource.contactInfo.phone}`} className="mt-1 block font-medium text-brand-600 hover:underline">
                                                {resource.contactInfo.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {resource.contactInfo?.email && (
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Email</p>
                                            <a href={`mailto:${resource.contactInfo.email}`} className="mt-1 block font-medium text-brand-600 hover:underline">
                                                {resource.contactInfo.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {resource.contactInfo?.website && (
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                                            <Globe className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Website</p>
                                            <a href={resource.contactInfo.website} target="_blank" rel="noopener noreferrer" className="mt-1 block font-medium text-brand-600 hover:underline">
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {resource.location && (
                                <div className="mt-8 h-48 w-full overflow-hidden rounded-xl border-2 border-slate-200">
                                    <GoogleMapComponent resources={[resource]} activeResourceId={resource._id} />
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
