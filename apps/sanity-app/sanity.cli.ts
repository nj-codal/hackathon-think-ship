import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
    app: {
        organizationId: '<your-org-id>', // Replace with your Sanity organization ID
        entry: './src/App.tsx',
    },
})
