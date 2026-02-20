import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // Enable logging for fetch cache hits/misses during development
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
}

export default nextConfig
