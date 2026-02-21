import { defineField, defineType } from 'sanity'

export const structuredDataType = defineType({
    name: 'structuredData',
    title: 'Structured Data (Schema.org)',
    type: 'object',
    fields: [
        defineField({
            name: 'schemaType',
            title: 'Schema Type',
            type: 'string',
            description: 'Schema.org type that best describes this resource.',
            options: {
                list: [
                    { title: 'Local Business', value: 'LocalBusiness' },
                    { title: 'NGO', value: 'NGO' },
                    { title: 'Medical Clinic', value: 'MedicalClinic' },
                    { title: 'Library', value: 'Library' },
                    { title: 'Exercise Gym', value: 'ExerciseGym' },
                ],
                layout: 'radio',
            },
        }),
        defineField({
            name: 'priceRange',
            title: 'Price Range',
            type: 'string',
            description: 'e.g. "₹0" for free, "₹" for low cost, "₹₹" for moderate',
            placeholder: '₹0',
        }),
        defineField({
            name: 'openingHours',
            title: 'Opening Hours',
            type: 'string',
            description: 'Schema.org format. e.g. "Mo-Fr 09:00-17:00" or "Mo-Su 09:00-18:00"',
            placeholder: 'Mo-Su 09:00-18:00',
        }),
    ],
})
