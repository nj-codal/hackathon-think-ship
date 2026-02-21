import { defineQuery } from 'next-sanity'

export const GET_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "iconUrl": icon.asset->url
  }
`)

export const GET_RESOURCES_QUERY = defineQuery(`
  *[_type == "resource" 
    && isApproved == true
    && (!defined($category) || category->slug.current == $category)
    && (!defined($region) || region->title match $region)
  ] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "category": category->title,
    "categorySlug": category->slug.current,
    "region": region->title,
    "pincode": region->pincode,
    services,
    eligibility,
    location,
    "featuredImageUrl": featuredImage.asset->url
  }
`)

export const GET_RESOURCE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "resource" && isApproved == true && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "category": category->title,
    "region": region->title,
    "pincode": region->pincode,
    description,
    address,
    location,
    contactInfo {
      phone,
      email,
      website,
      socials
    },
    services,
    eligibility,
    "featuredImageUrl": featuredImage.asset->url,
    "galleryUrls": gallery[].asset->url,
    seo {
      metaTitle,
      metaDescription,
      keywords,
      "ogImageUrl": ogImage.asset->url
    },
    structuredData {
      schemaType,
      priceRange,
      openingHours
    }
  }
`)

export const GET_REGIONS_QUERY = defineQuery(`
  *[_type == "region"] | order(title asc) {
    _id,
    title,
    pincode
  }
`)
