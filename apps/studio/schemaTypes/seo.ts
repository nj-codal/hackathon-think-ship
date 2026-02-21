import { defineField, defineType } from 'sanity'

export const seoType = defineType({
    name: 'seo',
    title: 'SEO',
    type: 'object',
    fields: [
        defineField({
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            description: 'Max 60 characters for optimal search engine display',
            validation: (rule) => rule.max(60),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            rows: 3,
            description: 'Max 160 characters for optimal search engine display',
            validation: (rule) => rule.max(160),
        }),
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'ogImage',
            title: 'Open Graph Image',
            type: 'image',
            description: 'Image displayed when shared on social media',
            options: { hotspot: true },
        }),
    ],
})
