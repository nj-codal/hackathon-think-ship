import type { Metadata } from 'next'
import { SanityLive } from '@/sanity/lib/live'
import './globals.css'

export const metadata: Metadata = {
    title: 'Hackathon',
    description: 'Built with Next.js and Sanity',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}): React.ReactElement {
    return (
        <html lang="en">
            <body>
                {children}
                <SanityLive />
            </body>
        </html>
    )
}
