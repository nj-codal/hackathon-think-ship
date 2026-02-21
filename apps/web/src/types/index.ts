export interface Category {
    _id: string
    title: string
    slug: { current: string }
    icon?: {
        asset?: {
            url: string
        }
    }
}

export interface Region {
    _id: string
    title: string
    pincode?: string
}

export interface SeoMeta {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    ogImage?: {
        asset?: { url: string }
    }
}

export interface StructuredData {
    schemaType?: string
    priceRange?: string
    openingHours?: string
}

export interface Resource {
    _id: string
    title: string
    slug: { current: string }
    category?: {
        _id: string
        title: string
        slug: { current: string }
    }
    region?: {
        _id: string
        title: string
        pincode?: string
    }
    description?: string
    location?: {
        lat: number
        lng: number
    }
    address?: string
    contactInfo?: {
        phone?: string
        email?: string
        website?: string
        socials?: string
    }
    services?: string[]
    eligibility?: string
    featuredImage?: {
        asset?: {
            url: string
        }
        hotspot?: { x: number; y: number }
    }
    gallery?: Array<{
        asset?: {
            url: string
        }
    }>
    seo?: SeoMeta
    structuredData?: StructuredData
}
