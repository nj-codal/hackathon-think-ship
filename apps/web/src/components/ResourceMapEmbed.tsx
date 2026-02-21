'use client'

import dynamic from 'next/dynamic'

const GoogleMapComponent = dynamic(() => import('@/components/GoogleMapComponent'), {
    ssr: false,
    loading: () => (
        <div className="h-full bg-warm-100 animate-pulse flex items-center justify-center">
            <p className="text-sm text-gray-400">Loading map…</p>
        </div>
    ),
})

interface Props {
    lat: number
    lng: number
    title: string
    id: string
}

export default function ResourceMapEmbed({ lat, lng, title, id }: Props) {
    return (
        <GoogleMapComponent
            markers={[{ id, title, lat, lng }]}
            center={{ lat, lng }}
            zoom={15}
        />
    )
}
