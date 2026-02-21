import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
    api: {
        projectId: 'lizsas7c',
        dataset: 'production',
    },
    deployment: {
        autoUpdates: true,
    },
})
