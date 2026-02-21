import { defineField, defineType } from 'sanity'

export const resourceType = defineType({
    name: 'resource',
    title: 'Resource',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Name of the place or service',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'region',
            title: 'Region',
            type: 'reference',
            to: [{ type: 'region' }],
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
            description: 'Details about this resource',
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'geopoint',
            description: 'Latitude and longitude of the resource',
        }),
        defineField({
            name: 'address',
            title: 'Address',
            type: 'string',
            description: 'Physical street address',
        }),
        defineField({
            name: 'contactInfo',
            title: 'Contact Information',
            type: 'object',
            fields: [
                defineField({
                    name: 'phone',
                    title: 'Phone',
                    type: 'string',
                }),
                defineField({
                    name: 'email',
                    title: 'Email',
                    type: 'string',
                }),
                defineField({
                    name: 'website',
                    title: 'Website',
                    type: 'url',
                }),
                defineField({
                    name: 'socials',
                    title: 'Social Media Links',
                    type: 'string',
                    description: 'Instagram, Facebook, etc.',
                }),
            ],
        }),
        defineField({
            name: 'services',
            title: 'Services',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'e.g. ["Black & White", "Color", "Spiral Binding"]',
            options: {
                layout: 'tags',
            },
        }),
        defineField({
            name: 'eligibility',
            title: 'Eligibility',
            type: 'string',
            description: 'e.g. "Below poverty line", "Open to all"',
        }),
        defineField({
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            description: 'Main thumbnail image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'gallery',
            title: 'Gallery',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: {
                        hotspot: true,
                    },
                },
            ],
            description: 'Additional photos',
        }),
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'seo',
        }),
        defineField({
            name: 'structuredData',
            title: 'Structured Data',
            type: 'structuredData',
        }),
        defineField({
            name: 'isApproved',
            title: 'Approved',
            type: 'boolean',
            description: 'Only approved resources appear on the public site',
            initialValue: false,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'category.title',
            media: 'featuredImage',
            isApproved: 'isApproved',
        },
        prepare({ title, subtitle, media, isApproved }) {
            return {
                title: `${isApproved ? '✅' : '⏳'} ${title as string}`,
                subtitle: subtitle as string,
                media,
            }
        },
    },
})
