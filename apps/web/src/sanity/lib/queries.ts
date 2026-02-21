import { groq } from 'next-sanity'

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    icon {
      asset-> { url }
    }
  }
`

export const allRegionsQuery = groq`
  *[_type == "region"] | order(title asc) {
    _id,
    title,
    pincode
  }
`

export const allResourcesQuery = groq`
  *[_type == "resource" && isApproved == true] | order(title asc) {
    _id,
    title,
    slug,
    description,
    address,
    location,
    services,
    eligibility,
    category-> {
      _id,
      title,
      slug
    },
    region-> {
      _id,
      title,
      pincode
    },
    featuredImage {
      asset-> { url },
      hotspot
    }
  }
`

export const resourceBySlugQuery = groq`
  *[_type == "resource" && isApproved == true && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    address,
    location,
    services,
    eligibility,
    contactInfo,
    category-> {
      _id,
      title,
      slug
    },
    region-> {
      _id,
      title,
      pincode
    },
    featuredImage {
      asset-> { url },
      hotspot
    },
    gallery[] {
      asset-> { url }
    },
    seo {
      metaTitle,
      metaDescription,
      keywords,
      ogImage { asset->{ url } }
    },
    structuredData {
      schemaType,
      priceRange,
      openingHours
    }
  }
`
