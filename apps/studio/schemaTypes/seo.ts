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
            description: 'Shown in browser tab and search results. Max 60 characters.',
            validation: (Rule) => Rule.max(60),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            rows: 3,
            description: 'Shown in search result snippets. Max 160 characters.',
            validation: (Rule) => Rule.max(160),
        }),
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
        }),
        defineField({
            name: 'ogImage',
            title: 'Social Share Image (OG Image)',
            type: 'image',
            description: 'Image shown when this page is shared on social media.',
            options: { hotspot: true },
        }),
    ],
})
