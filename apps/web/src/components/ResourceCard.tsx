'use client'

import type { Resource } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

interface ResourceCardProps {
    resource: Resource
    isHighlighted?: boolean
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

interface CategoryStyle {
    icon: string
    gradient: string
    accent: string
    textColor: string
}

const SLUG_STYLES: Record<string, CategoryStyle> = {
    'food-bank':     { icon: '🍱', gradient: 'from-orange-100 via-amber-50 to-yellow-50',    accent: 'bg-orange-400',  textColor: 'text-orange-600' },
    'food-bank-ngo': { icon: '🍱', gradient: 'from-orange-100 via-amber-50 to-yellow-50',    accent: 'bg-orange-400',  textColor: 'text-orange-600' },
    'clinic':        { icon: '🏥', gradient: 'from-red-100 via-rose-50 to-pink-50',           accent: 'bg-red-400',     textColor: 'text-red-600' },
    'free-clinic':   { icon: '🏥', gradient: 'from-red-100 via-rose-50 to-pink-50',           accent: 'bg-red-400',     textColor: 'text-red-600' },
    'gym':           { icon: '💪', gradient: 'from-blue-100 via-sky-50 to-cyan-50',           accent: 'bg-blue-500',    textColor: 'text-blue-600' },
    'community-gym': { icon: '💪', gradient: 'from-blue-100 via-sky-50 to-cyan-50',           accent: 'bg-blue-500',    textColor: 'text-blue-600' },
    'xerox-shop':    { icon: '🖨️', gradient: 'from-purple-100 via-violet-50 to-indigo-50',   accent: 'bg-purple-500',  textColor: 'text-purple-600' },
    'playground':    { icon: '🌳', gradient: 'from-green-100 via-emerald-50 to-teal-50',      accent: 'bg-green-500',   textColor: 'text-green-600' },
    'library':       { icon: '📚', gradient: 'from-teal-100 via-cyan-50 to-sky-50',           accent: 'bg-teal-600',    textColor: 'text-teal-700' },
    'mental-health': { icon: '🧠', gradient: 'from-pink-100 via-rose-50 to-fuchsia-50',      accent: 'bg-pink-400',    textColor: 'text-pink-600' },
    'shelter':       { icon: '🏠', gradient: 'from-yellow-100 via-amber-50 to-orange-50',    accent: 'bg-yellow-400',  textColor: 'text-yellow-700' },
    'legal':         { icon: '⚖️', gradient: 'from-slate-100 via-gray-50 to-zinc-50',        accent: 'bg-slate-500',   textColor: 'text-slate-600' },
    'education':     { icon: '🎓', gradient: 'from-indigo-100 via-blue-50 to-sky-50',         accent: 'bg-indigo-500',  textColor: 'text-indigo-600' },
}

const DEFAULT_STYLE: CategoryStyle = {
    icon: '📍',
    gradient: 'from-warm-100 via-cream to-teal-50',
    accent: 'bg-teal-500',
    textColor: 'text-teal-600',
}

function getStyle(slug?: string, title?: string): CategoryStyle {
    // 1. Exact slug match
    if (slug && SLUG_STYLES[slug]) return SLUG_STYLES[slug]!

    // 2. Partial slug match (handles variants like 'food-bank-ngo', 'free-clinic-opd', etc.)
    if (slug) {
        if (slug.includes('food') || slug.includes('bank') || slug.includes('ration'))   return SLUG_STYLES['food-bank']!
        if (slug.includes('clinic') || slug.includes('medical') || slug.includes('opd')) return SLUG_STYLES['clinic']!
        if (slug.includes('gym') || slug.includes('fitness') || slug.includes('sport'))  return SLUG_STYLES['gym']!
        if (slug.includes('xerox') || slug.includes('print') || slug.includes('copy'))   return SLUG_STYLES['xerox-shop']!
        if (slug.includes('park') || slug.includes('play') || slug.includes('garden'))   return SLUG_STYLES['playground']!
        if (slug.includes('library') || slug.includes('book'))                            return SLUG_STYLES['library']!
        if (slug.includes('mental') || slug.includes('counsel'))                          return SLUG_STYLES['mental-health']!
        if (slug.includes('shelter') || slug.includes('housing'))                         return SLUG_STYLES['shelter']!
        if (slug.includes('legal') || slug.includes('law'))                               return SLUG_STYLES['legal']!
        if (slug.includes('edu') || slug.includes('school'))                              return SLUG_STYLES['education']!
    }

    // 3. Title keyword match
    if (title) {
        const t = title.toLowerCase()
        if (t.includes('food') || t.includes('bank') || t.includes('ration') || t.includes('kitchen')) return SLUG_STYLES['food-bank']!
        if (t.includes('clinic') || t.includes('medical') || t.includes('hospital') || t.includes('opd')) return SLUG_STYLES['clinic']!
        if (t.includes('gym') || t.includes('fitness') || t.includes('sport') || t.includes('yoga'))  return SLUG_STYLES['gym']!
        if (t.includes('xerox') || t.includes('print') || t.includes('copy'))                          return SLUG_STYLES['xerox-shop']!
        if (t.includes('park') || t.includes('playground') || t.includes('garden'))                    return SLUG_STYLES['playground']!
        if (t.includes('library') || t.includes('book') || t.includes('reading'))                      return SLUG_STYLES['library']!
        if (t.includes('mental') || t.includes('counsel') || t.includes('therapy'))                    return SLUG_STYLES['mental-health']!
        if (t.includes('shelter') || t.includes('housing'))                                             return SLUG_STYLES['shelter']!
        if (t.includes('legal') || t.includes('law'))                                                   return SLUG_STYLES['legal']!
        if (t.includes('school') || t.includes('education') || t.includes('tutor'))                    return SLUG_STYLES['education']!
    }

    return DEFAULT_STYLE
}

export default function ResourceCard({
    resource,
    isHighlighted = false,
    onMouseEnter,
    onMouseLeave,
}: ResourceCardProps) {
    const imageUrl = resource.featuredImage?.asset?.url
    const style = getStyle(resource.category?.slug?.current, resource.category?.title)

    return (
        <Link
            href={`/resources/${resource.slug.current}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`group block bg-white rounded-2xl border-2 overflow-hidden transition-all duration-200
                ${isHighlighted
                    ? 'border-saffron-500 shadow-lg ring-2 ring-saffron-500/20 -translate-y-0.5'
                    : 'border-warm-200 hover:border-teal-300 hover:shadow-md hover:-translate-y-0.5'
                }`}
        >
            {/* Image / Placeholder */}
            <div className="relative h-40 overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={resource.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 400px"
                    />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center gap-1.5`}>
                        <div className={`absolute -top-5 -right-5 w-24 h-24 rounded-full ${style.accent} opacity-10`} />
                        <div className={`absolute -bottom-8 -left-8 w-32 h-32 rounded-full ${style.accent} opacity-10`} />
                        <span className="relative text-5xl drop-shadow-sm select-none leading-none">{style.icon}</span>
                        <span className={`relative text-xs font-semibold uppercase tracking-widest ${style.textColor} opacity-70`}>
                            {resource.category?.title ?? 'Resource'}
                        </span>
                    </div>
                )}
                {/* Category badge */}
                {resource.category && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-teal-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        {resource.category.title}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-display font-semibold text-gray-900 text-base leading-snug mb-1.5 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {resource.title}
                </h3>

                {resource.region && (
                    <p className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {resource.region.title}{resource.region.pincode ? ` — ${resource.region.pincode}` : ''}
                    </p>
                )}

                {resource.address && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">{resource.address}</p>
                )}

                {resource.services && resource.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {resource.services.slice(0, 3).map((service, i) => (
                            <span key={i} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                                {service}
                            </span>
                        ))}
                        {resource.services.length > 3 && (
                            <span className="text-xs text-gray-400">+{resource.services.length - 3} more</span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    )
}
