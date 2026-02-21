import { Resource } from '@/lib/types'

interface LocalBusinessSchemaProps {
    resource: Resource
    schemaType?: string
    priceRange?: string
    openingHours?: string
}

export function LocalBusinessSchema({ resource, schemaType, priceRange, openingHours }: LocalBusinessSchemaProps) {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': schemaType || 'LocalBusiness',
        name: resource.title,
        description: resource.description,
        address: {
            '@type': 'PostalAddress',
            streetAddress: resource.address,
            addressLocality: resource.region,
            addressRegion: 'Gujarat',
            addressCountry: 'IN',
            postalCode: resource.pincode,
        },
    }

    if (resource.location) {
        schema.geo = {
            '@type': 'GeoCoordinates',
            latitude: resource.location.lat,
            longitude: resource.location.lng,
        }
    }

    if (resource.contactInfo?.phone) {
        schema.telephone = resource.contactInfo.phone
    }

    if (resource.contactInfo?.email) {
        schema.email = resource.contactInfo.email
    }

    if (resource.contactInfo?.website) {
        schema.url = resource.contactInfo.website
    }

    if (resource.featuredImageUrl) {
        schema.image = resource.featuredImageUrl
    }

    if (priceRange) {
        schema.priceRange = priceRange
    }

    if (openingHours) {
        schema.openingHoursSpecification = openingHours
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
