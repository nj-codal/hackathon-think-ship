import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { googleMapsInput } from '@sanity/google-maps-input'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
    name: 'default',
    title: 'Community Resource Map',

    projectId: 'lizsas7c',
    dataset: 'production',

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Community Resource Map')
                    .items([
                        S.listItem()
                            .title('✅ Approved Resources')
                            .child(
                                S.documentList()
                                    .title('Approved Resources')
                                    .filter('_type == "resource" && isApproved == true')
                                    .defaultOrdering([{ field: 'title', direction: 'asc' }])
                            ),
                        S.listItem()
                            .title('⏳ Pending Approvals')
                            .child(
                                S.documentList()
                                    .title('Pending Approvals')
                                    .filter('_type == "resource" && (isApproved != true)')
                                    .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
                            ),
                        S.divider(),
                        S.documentTypeListItem('category').title('📂 Categories'),
                        S.documentTypeListItem('region').title('📍 Regions'),
                    ]),
        }),
        visionTool(),
        googleMapsInput({
            apiKey: process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY ?? '',
        }),
    ],

    schema: {
        types: schemaTypes,
    },
})
