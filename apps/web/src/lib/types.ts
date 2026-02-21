export interface Category {
    _id: string
    title: string
    slug: string
    iconUrl?: string
}

export interface Resource {
    _id: string
    title: string
    slug: string
    category: string
    region: string
    pincode: string
    description?: string
    address?: string
    location?: {
        lat: number
        lng: number
    }
    contactInfo?: {
        phone?: string
        email?: string
        website?: string
        socials?: string
    }
    services?: string[]
    eligibility?: string
    featuredImageUrl?: string
    galleryUrls?: string[]
}
