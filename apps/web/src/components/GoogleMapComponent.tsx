'use client'

import { memo, useCallback, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { Resource } from '@/lib/types'

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
}

const defaultCenter = {
  lat: 23.0225, // Ahmedabad center
  lng: 72.5714,
}

interface MapProps {
    resources: Resource[]
    activeResourceId?: string
    onMarkerClick?: (resourceId: string) => void
}

function MapComponent({ resources, activeResourceId, onMarkerClick }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    if (resources.length > 0) {
        const bounds = new window.google.maps.LatLngBounds()
        let hasValidLocation = false

        resources.forEach((res) => {
            if (res.location && res.location.lat && res.location.lng) {
                bounds.extend({ lat: res.location.lat, lng: res.location.lng })
                hasValidLocation = true
            }
        })

        if (hasValidLocation) {
            map.fitBounds(bounds)
            // Zoom out slightly to not hug the markers too tightly
            const listener = google.maps.event.addListener(map, "idle", function() { 
                if (map.getZoom() && (map.getZoom() as number) > 16) map.setZoom(16); 
                google.maps.event.removeListener(listener); 
            });
        }
    }
    setMap(map)
  }, [resources])

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null)
  }, [])

  if (!isLoaded) return <div className="flex h-full w-full items-center justify-center bg-slate-100 font-display font-medium text-slate-500 rounded-xl border-2 border-slate-200">Loading Map...</div>

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border-2 border-slate-900 brutal-shadow bg-blue-50">
        <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            styles: [
                {
                    featureType: "poi.business",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "poi.medical",
                    stylers: [{ visibility: "off" }] // Will show our own pins
                }
            ]
        }}
        >
        {resources.map((res) => {
            if (!res.location || !res.location.lat || !res.location.lng) return null
            
            const isSelected = activeResourceId === res._id

            return (
                <Marker
                    key={res._id}
                    position={{ lat: res.location.lat, lng: res.location.lng }}
                    onClick={() => {
                        setSelectedResource(res)
                        if (onMarkerClick) onMarkerClick(res._id)
                    }}
                    animation={isSelected ? window.google.maps.Animation.BOUNCE : undefined}
                />
            )
        })}

        {selectedResource && selectedResource.location && (
            <InfoWindow
                position={{ lat: selectedResource.location.lat, lng: selectedResource.location.lng }}
                onCloseClick={() => setSelectedResource(null)}
            >
                <div className="max-w-50 p-1 font-body">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-brand-600">{selectedResource.category}</p>
                    <h4 className="font-display text-sm font-bold text-slate-900 leading-tight mb-2">{selectedResource.title}</h4>
                    <a href={`/resources/${selectedResource.slug}`} className="mt-2 block w-full rounded bg-slate-900 py-1.5 text-center text-xs font-medium text-white hover:bg-brand-600">
                        View Details
                    </a>
                </div>
            </InfoWindow>
        )}
        </GoogleMap>
    </div>
  )
}

export default memo(MapComponent)
