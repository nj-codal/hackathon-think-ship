import { defineField, defineType } from 'sanity'

export const structuredDataType = defineType({
    name: 'structuredData',
    title: 'Structured Data (Schema.org)',
    type: 'object',
    fields: [
        defineField({
            name: 'schemaType',
            title: 'Schema.org Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Local Business', value: 'LocalBusiness' },
                    { title: 'NGO', value: 'NGO' },
                    { title: 'Medical Clinic', value: 'MedicalClinic' },
                    { title: 'Library', value: 'Library' },
                    { title: 'Exercise Gym', value: 'ExerciseGym' },
                ],
            },
        }),
        defineField({
            name: 'priceRange',
            title: 'Price Range',
            type: 'string',
            description: 'e.g., "₹0", "₹", "₹₹"',
        }),
        defineField({
            name: 'openingHours',
            title: 'Opening Hours',
            type: 'string',
            description: 'e.g., "Mo-Su 09:00-18:00"',
        }),
    ],
})
