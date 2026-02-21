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
            description: 'Name of the region (e.g., "Navrangpura", "Satellite")',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'pincode',
            title: 'Pincode',
            type: 'string',
            description: 'Postal code for filtering (e.g., "380009")',
            validation: (rule) => rule.required(),
        }),
    ],
})
