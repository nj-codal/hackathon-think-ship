'use client'

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { useState, useCallback } from 'react'

export interface MapMarker {
    id: string
    title: string
    lat: number
    lng: number
    category?: string
}

interface GoogleMapComponentProps {
    markers: MapMarker[]
    onMarkerClick?: (id: string) => void
    selectedMarkerId?: string | null
    center?: { lat: number; lng: number }
    zoom?: number
}

const AHMEDABAD_CENTER = { lat: 23.0225, lng: 72.5714 }

const containerStyle = {
    width: '100%',
    height: '100%',
}

const MAP_STYLES = [
    { elementType: 'geometry', stylers: [{ color: '#f5ede0' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#5c4a2a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#fef9f0' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#c8aa84' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#7c5828' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#e8dcc8' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#7c5828' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d8e8c0' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#4a7c40' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e8d8b8' }] },
    { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#7c5828' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#d4b880' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#5c4010' }] },
    { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#8c6848' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#d8c8a8' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#8ab4cc' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d5a73' }] },
]

export default function GoogleMapComponent({
    markers,
    onMarkerClick,
    selectedMarkerId,
    center,
    zoom = 12,
}: GoogleMapComponentProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
    })

    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null)

    const handleMarkerClick = useCallback(
        (marker: MapMarker) => {
            setActiveMarkerId(marker.id)
            onMarkerClick?.(marker.id)
        },
        [onMarkerClick]
    )

    const handleInfoClose = useCallback(() => {
        setActiveMarkerId(null)
    }, [])

    if (!apiKey) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-warm-100 rounded-xl">
                <div className="text-center p-6">
                    <div className="text-4xl mb-3">🗺️</div>
                    <p className="font-semibold text-gray-700">Map not configured</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Add <code className="bg-warm-200 px-1 rounded text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable the map
                    </p>
                </div>
            </div>
        )
    }

    if (loadError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-warm-100 rounded-xl">
                <p className="text-sm text-red-600">Failed to load map. Check your API key.</p>
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-warm-100 rounded-xl animate-pulse">
                <div className="text-center">
                    <div className="text-3xl mb-2">🗺️</div>
                    <p className="text-sm text-gray-500">Loading map…</p>
                </div>
            </div>
        )
    }

    const mapCenter = center ?? AHMEDABAD_CENTER
    const activeMarker = markers.find((m) => m.id === activeMarkerId)

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom}
            options={{
                styles: MAP_STYLES,
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
            }}
        >
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={() => handleMarkerClick(marker)}
                    icon={{
                        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                        fillColor: marker.id === (selectedMarkerId ?? activeMarkerId) ? '#f4a025' : '#0d7377',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                        scale: marker.id === (selectedMarkerId ?? activeMarkerId) ? 1.6 : 1.3,
                        anchor: new window.google.maps.Point(12, 22),
                    }}
                />
            ))}

            {activeMarker && (
                <InfoWindow
                    position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
                    onCloseClick={handleInfoClose}
                >
                    <div className="p-1 max-w-[180px]">
                        {activeMarker.category && (
                            <p className="text-xs text-teal-600 font-semibold uppercase tracking-wide mb-0.5">
                                {activeMarker.category}
                            </p>
                        )}
                        <p className="font-semibold text-sm text-gray-900">{activeMarker.title}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    )
}
