import { defineField, defineType } from 'sanity'

export const regionType = defineType({
    name: 'region',
    title: 'Region',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'e.g. "Navrangpura", "Bopal", "Satellite"',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'pincode',
            title: 'Pincode',
            type: 'string',
            description: 'Postal code for this region',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'pincode',
        },
    },
})
