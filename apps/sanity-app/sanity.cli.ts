import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
    app: {
        organizationId: 'lizsas7c', // Replace with your Sanity organization ID
        entry: './src/App.tsx',
    },
})
