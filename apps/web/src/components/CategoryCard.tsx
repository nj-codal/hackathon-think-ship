import type { Category } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
    category: Category
    isSelected?: boolean
    href?: string
}

// Keyed by slug.current — covers both seeded and migrated categories
const SLUG_STYLES: Record<string, {
    icon: string
    bg: string
    iconBg: string
    text: string
    accent: string
}> = {
    'food-bank':     { icon: '🍱', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-400', iconBg: 'bg-orange-100',  text: 'text-orange-800', accent: 'bg-orange-400' },
    'clinic':        { icon: '🏥', bg: 'bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-400',             iconBg: 'bg-red-100',     text: 'text-red-800',    accent: 'bg-red-400' },
    'gym':           { icon: '💪', bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-400',         iconBg: 'bg-blue-100',    text: 'text-blue-800',   accent: 'bg-blue-500' },
    'xerox-shop':    { icon: '🖨️', bg: 'bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-400', iconBg: 'bg-purple-100',  text: 'text-purple-800', accent: 'bg-purple-500' },
    'playground':    { icon: '🌳', bg: 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-400',     iconBg: 'bg-green-100',   text: 'text-green-800',  accent: 'bg-green-500' },
    'library':       { icon: '📚', bg: 'bg-teal-50 hover:bg-teal-100 border-teal-200 hover:border-teal-400',         iconBg: 'bg-teal-100',    text: 'text-teal-800',   accent: 'bg-teal-500' },
    'mental-health': { icon: '🧠', bg: 'bg-pink-50 hover:bg-pink-100 border-pink-200 hover:border-pink-400',         iconBg: 'bg-pink-100',    text: 'text-pink-800',   accent: 'bg-pink-400' },
    'shelter':       { icon: '🏠', bg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 hover:border-yellow-400', iconBg: 'bg-yellow-100',  text: 'text-yellow-800', accent: 'bg-yellow-400' },
    'legal':         { icon: '⚖️', bg: 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-400',     iconBg: 'bg-slate-100',   text: 'text-slate-800',  accent: 'bg-slate-500' },
    'education':     { icon: '🎓', bg: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 hover:border-indigo-400', iconBg: 'bg-indigo-100',  text: 'text-indigo-800', accent: 'bg-indigo-500' },
}

const FALLBACK_STYLE = { icon: '📍', bg: 'bg-warm-100 hover:bg-warm-200 border-warm-200 hover:border-teal-400', iconBg: 'bg-teal-100', text: 'text-teal-800', accent: 'bg-teal-500' }

function resolveStyle(slug: string, title: string) {
    // 1. Exact slug match
    if (SLUG_STYLES[slug]) return SLUG_STYLES[slug]!

    // 2. Partial slug match (handles 'food-bank-ngo', 'free-clinic-opd', 'community-gym', etc.)
    if (slug.includes('food') || slug.includes('bank') || slug.includes('ration'))      return SLUG_STYLES['food-bank']!
    if (slug.includes('clinic') || slug.includes('medical') || slug.includes('opd'))    return SLUG_STYLES['clinic']!
    if (slug.includes('gym') || slug.includes('fitness') || slug.includes('sport'))     return SLUG_STYLES['gym']!
    if (slug.includes('xerox') || slug.includes('print') || slug.includes('copy'))      return SLUG_STYLES['xerox-shop']!
    if (slug.includes('park') || slug.includes('play') || slug.includes('garden'))      return SLUG_STYLES['playground']!
    if (slug.includes('library') || slug.includes('book'))                              return SLUG_STYLES['library']!
    if (slug.includes('mental') || slug.includes('counsel'))                             return SLUG_STYLES['mental-health']!
    if (slug.includes('shelter') || slug.includes('housing'))                            return SLUG_STYLES['shelter']!
    if (slug.includes('legal') || slug.includes('law'))                                  return SLUG_STYLES['legal']!
    if (slug.includes('edu') || slug.includes('school'))                                 return SLUG_STYLES['education']!

    // 3. Title keyword match
    const t = title.toLowerCase()
    if (t.includes('food') || t.includes('bank') || t.includes('ration') || t.includes('kitchen')) return SLUG_STYLES['food-bank']!
    if (t.includes('clinic') || t.includes('medical') || t.includes('hospital') || t.includes('opd')) return SLUG_STYLES['clinic']!
    if (t.includes('gym') || t.includes('fitness') || t.includes('sport') || t.includes('yoga'))    return SLUG_STYLES['gym']!
    if (t.includes('xerox') || t.includes('print') || t.includes('copy'))                            return SLUG_STYLES['xerox-shop']!
    if (t.includes('park') || t.includes('playground') || t.includes('garden'))                      return SLUG_STYLES['playground']!
    if (t.includes('library') || t.includes('book') || t.includes('reading'))                        return SLUG_STYLES['library']!
    if (t.includes('mental') || t.includes('counsel') || t.includes('therapy'))                      return SLUG_STYLES['mental-health']!
    if (t.includes('shelter') || t.includes('housing') || t.includes('home'))                        return SLUG_STYLES['shelter']!
    if (t.includes('legal') || t.includes('law') || t.includes('court'))                             return SLUG_STYLES['legal']!
    if (t.includes('school') || t.includes('education') || t.includes('tutor'))                      return SLUG_STYLES['education']!

    return FALLBACK_STYLE
}

export default function CategoryCard({ category, isSelected = false, href }: CategoryCardProps) {
    const slugStyle = resolveStyle(category.slug.current, category.title)

    const selected = {
        bg: 'border-teal-700 bg-teal-50',
        text: 'text-teal-800',
        iconBg: 'bg-teal-100',
    }

    return (
        <Link
            href={href ?? `/resources?category=${category.slug.current}`}
            className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 text-center cursor-pointer
                ${isSelected
                    ? `${selected.bg} shadow-md`
                    : `${slugStyle.bg} hover:shadow-md hover:-translate-y-0.5`
                }`}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${isSelected ? selected.iconBg : slugStyle.iconBg}`}>
                {category.icon?.asset?.url ? (
                    <Image
                        src={category.icon.asset.url}
                        alt={category.title}
                        width={36}
                        height={36}
                        className="object-contain"
                    />
                ) : (
                    <span className="text-3xl select-none leading-none" role="img" aria-label={category.title}>
                        {slugStyle.icon}
                    </span>
                )}
            </div>
            <span className={`text-sm font-semibold leading-tight ${isSelected ? selected.text : slugStyle.text}`}>
                {category.title}
            </span>
        </Link>
    )
}
