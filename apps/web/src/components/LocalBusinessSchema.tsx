import type { Resource } from '@/types'

interface Props {
    resource: Resource
}

export default function LocalBusinessSchema({ resource }: Props) {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': resource.structuredData?.schemaType ?? 'LocalBusiness',
        name: resource.title,
        description: resource.description,
        address: {
            '@type': 'PostalAddress',
            streetAddress: resource.address,
            addressLocality: resource.region?.title ?? 'Ahmedabad',
            addressRegion: 'Gujarat',
            addressCountry: 'IN',
            postalCode: resource.region?.pincode,
        },
    }

    if (resource.location?.lat != null && resource.location?.lng != null) {
        schema['geo'] = {
            '@type': 'GeoCoordinates',
            latitude: resource.location.lat,
            longitude: resource.location.lng,
        }
    }

    if (resource.contactInfo?.phone) schema['telephone'] = resource.contactInfo.phone
    if (resource.contactInfo?.website) schema['url'] = resource.contactInfo.website
    if (resource.structuredData?.priceRange) schema['priceRange'] = resource.structuredData.priceRange
    if (resource.structuredData?.openingHours) schema['openingHours'] = resource.structuredData.openingHours
    if (resource.featuredImage?.asset?.url) schema['image'] = resource.featuredImage.asset.url

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
