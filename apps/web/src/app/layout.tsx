import type { Metadata } from 'next'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import { SanityLive } from '@/sanity/lib/live'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const bricolage = Bricolage_Grotesque({
    subsets: ['latin'],
    variable: '--font-bricolage',
    display: 'swap',
})

const dmSans = DM_Sans({
    subsets: ['latin'],
    variable: '--font-dm-sans',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Ahmedabad Community Resources',
    description: 'A centralized directory and map for community resources in Ahmedabad.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${bricolage.variable} ${dmSans.variable}`}>
            <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <SanityLive />
            </body>
        </html>
    )
}
