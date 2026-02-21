import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Category } from '@/lib/types'
import { getCategoryIcon } from '@/lib/categoryIcons'

export function CategoryCard({ category }: { category: Category }) {
    const Icon = getCategoryIcon(category.title)

    return (
        <Link 
            href={`/resources?category=${category.slug}`}
            className="group relative flex h-48 flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 brutal-shadow"
        >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-50 opacity-50 transition-transform group-hover:scale-150" />
            
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                {category.iconUrl ? (
                    <img src={category.iconUrl} alt={category.title} className="h-6 w-6 object-contain" />
                ) : (
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                )}
            </div>

            <div className="relative z-10 mt-auto flex items-end justify-between">
                <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-brand-600">
                    {category.title}
                </h3>
                <div className="flex h-8 w-8 -translate-x-4 items-center justify-center rounded-full bg-slate-900 text-white opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        </Link>
    )
}
