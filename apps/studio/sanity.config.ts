import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { googleMapsInput } from '@sanity/google-maps-input'
import { schemaTypes } from './schemaTypes'
import type { StructureBuilder } from 'sanity/structure'

const resourceStructure = (S: StructureBuilder) =>
    S.list()
        .title('Content')
        .items([
            S.listItem()
                .title('Approved Resources')
                .child(
                    S.documentList()
                        .title('Approved Resources')
                        .filter('_type == "resource" && isApproved == true')
                ),
            S.listItem()
                .title('Pending Approvals')
                .child(
                    S.documentList()
                        .title('Pending Approvals')
                        .filter('_type == "resource" && isApproved != true')
                ),
            S.divider(),
            ...S.documentTypeListItems().filter(
                (listItem) => !['resource'].includes(listItem.getId() ?? '')
            ),
        ])

export default defineConfig({
    name: 'default',
    title: 'Hackathon',

    projectId: 'lizsas7c',
    dataset: 'production',

    plugins: [
        structureTool({ structure: resourceStructure }),
        visionTool(),
        googleMapsInput({
            apiKey: process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY || '',
        }),
    ],

    schema: {
        types: schemaTypes,
    },
})
