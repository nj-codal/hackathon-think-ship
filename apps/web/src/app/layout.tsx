import type { Metadata } from 'next'
import { SanityLive } from '@/sanity/lib/live'
import './globals.css'

export const metadata: Metadata = {
    title: 'Ahmedabad Resource Map',
    description: 'Find community resources near you — mental health, food banks, clinics, gyms, and more across Ahmedabad.',
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
