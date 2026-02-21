'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import ResourceCard from '@/components/ResourceCard'
import type { Resource, Category, Region } from '@/types'
import type { MapMarker } from '@/components/GoogleMapComponent'

const GoogleMapComponent = dynamic(() => import('@/components/GoogleMapComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-warm-100 animate-pulse">
            <div className="text-center">
                <div className="text-3xl mb-2">🗺️</div>
                <p className="text-sm text-gray-500">Loading map…</p>
            </div>
        </div>
    ),
})

interface ResourcesPageClientProps {
    resources: Resource[]
    categories: Category[]
    regions: Region[]
    initialSearch?: string
    initialCategory?: string
}

export default function ResourcesPageClient({
    resources,
    categories,
    regions,
    initialSearch = '',
    initialCategory = '',
}: ResourcesPageClientProps) {
    const [search, setSearch] = useState(initialSearch)
    const [selectedCategory, setSelectedCategory] = useState(initialCategory)
    const [selectedRegion, setSelectedRegion] = useState('')
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
    const [showMobileMap, setShowMobileMap] = useState(false)
    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const filteredResources = useMemo(() => {
        return resources.filter((r) => {
            if (selectedCategory && r.category?.slug?.current !== selectedCategory) return false
            if (selectedRegion && r.region?._id !== selectedRegion) return false
            if (search.trim()) {
                const q = search.toLowerCase()
                return (
                    r.title.toLowerCase().includes(q) ||
                    (r.address?.toLowerCase().includes(q) ?? false) ||
                    (r.region?.title.toLowerCase().includes(q) ?? false) ||
                    (r.category?.title.toLowerCase().includes(q) ?? false)
                )
            }
            return true
        })
    }, [resources, selectedCategory, selectedRegion, search])

    const mapMarkers: MapMarker[] = useMemo(() => {
        return filteredResources
            .filter((r) => r.location?.lat != null && r.location?.lng != null)
            .map((r) => ({
                id: r._id,
                title: r.title,
                lat: r.location!.lat,
                lng: r.location!.lng,
                category: r.category?.title,
            }))
    }, [filteredResources])

    // Scroll highlighted card into view when marker is clicked
    useEffect(() => {
        if (selectedMarkerId) {
            const el = cardRefs.current[selectedMarkerId]
            el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [selectedMarkerId])

    const handleMarkerClick = (id: string) => {
        setSelectedMarkerId(id)
        setShowMobileMap(false)
    }

    const clearFilters = () => {
        setSearch('')
        setSelectedCategory('')
        setSelectedRegion('')
    }

    const hasFilters = search || selectedCategory || selectedRegion

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Filter Bar */}
            <div className="bg-white border-b border-warm-200 px-4 sm:px-6 py-3 flex-shrink-0">
                <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[180px] max-w-xs">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search resources…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-warm-100/50"
                        />
                    </div>

                    {/* Category filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="py-2 px-3 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-warm-100/50 text-gray-700"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c.slug.current}>{c.title}</option>
                        ))}
                    </select>

                    {/* Region filter */}
                    <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="py-2 px-3 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-warm-100/50 text-gray-700"
                    >
                        <option value="">All Areas</option>
                        {regions.map((r) => (
                            <option key={r._id} value={r._id}>{r.title}{r.pincode ? ` (${r.pincode})` : ''}</option>
                        ))}
                    </select>

                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-teal-700 hover:text-teal-900 font-medium underline"
                        >
                            Clear filters
                        </button>
                    )}

                    {/* Results count */}
                    <p className="text-xs text-gray-500 ml-auto">
                        {filteredResources.length} {filteredResources.length === 1 ? 'result' : 'results'}
                    </p>

                    {/* Mobile map toggle */}
                    <button
                        onClick={() => setShowMobileMap((v) => !v)}
                        className="sm:hidden flex items-center gap-1.5 bg-teal-700 text-white text-sm font-semibold px-3 py-2 rounded-lg"
                    >
                        {showMobileMap ? '📋 List' : '🗺️ Map'}
                    </button>
                </div>
            </div>

            {/* Split-screen Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Resource List */}
                <div className={`${showMobileMap ? 'hidden' : 'flex'} sm:flex flex-col w-full sm:w-[45%] overflow-y-auto`}>
                    {filteredResources.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="text-center">
                                <div className="text-4xl mb-3">🔍</div>
                                <p className="font-semibold text-gray-700 mb-1">No resources found</p>
                                <p className="text-sm text-gray-500">Try adjusting your filters</p>
                                {hasFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 text-sm text-teal-700 underline font-medium"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 sm:p-5 grid grid-cols-1 gap-4">
                            {filteredResources.map((resource) => (
                                <div
                                    key={resource._id}
                                    ref={(el) => { cardRefs.current[resource._id] = el }}
                                >
                                    <ResourceCard
                                        resource={resource}
                                        isHighlighted={resource._id === selectedMarkerId || resource._id === hoveredId}
                                        onMouseEnter={() => setHoveredId(resource._id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Map */}
                <div className={`${showMobileMap ? 'flex' : 'hidden'} sm:flex flex-1 relative bg-warm-100`}>
                    <GoogleMapComponent
                        markers={mapMarkers}
                        onMarkerClick={handleMarkerClick}
                        selectedMarkerId={selectedMarkerId ?? hoveredId}
                    />

                    {mapMarkers.length === 0 && filteredResources.length > 0 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-xs text-gray-600 px-4 py-2 rounded-full shadow-md border border-warm-200">
                            No location data for these resources
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
