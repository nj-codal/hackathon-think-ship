import Link from 'next/link'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { Resource } from '@/lib/types'

export function ResourceCard({ resource, isActive }: { resource: Resource; isActive?: boolean }) {
    return (
        <Link href={`/resources/${resource.slug}`} className="block w-full">
            <article className={`group flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border-2 p-4 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${isActive ? 'border-brand-600 bg-brand-50 brutal-shadow' : 'border-slate-200 bg-white hover:border-slate-900'}`}>
                {resource.featuredImageUrl && (
                    <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl border-2 border-slate-900 sm:h-auto sm:w-48">
                        <img 
                            src={resource.featuredImageUrl} 
                            alt={resource.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 to-transparent sm:hidden" />
                    </div>
                )}
                
                <div className="flex flex-1 flex-col py-2">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-sm bg-brand-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-brand-900">
                            {resource.category}
                        </span>
                        {resource.eligibility && (
                            <span className="inline-flex items-center rounded-sm bg-accent-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent-900 border border-accent-200">
                                {resource.eligibility}
                            </span>
                        )}
                    </div>
                    
                    <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 group-hover:text-brand-600 flex items-center justify-between">
                        {resource.title}
                        <ArrowUpRight className="h-5 w-5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hidden sm:block" />
                    </h3>
                    
                    <div className="mt-2 flex items-start gap-1.5 text-sm text-slate-600">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <span className="line-clamp-2">
                            {resource.address || resource.region} {resource.pincode && `- ${resource.pincode}`}
                        </span>
                    </div>

                    {resource.services && resource.services.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {resource.services.slice(0, 3).map((service, idx) => (
                                <span key={idx} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                    {service}
                                </span>
                            ))}
                            {resource.services.length > 3 && (
                                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                    +{resource.services.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </article>
        </Link>
    )
}
