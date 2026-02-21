import Link from 'next/link'
import { MapPin, Search } from 'lucide-react'

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b-2 border-slate-900 bg-white shadow-[0_4px_0_0_rgba(15,23,42,1)]">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white brutal-shadow">
                        <MapPin className="h-5 w-5" strokeWidth={2.5} />
                    </div>
                    <span className="font-display text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                        Amdavad<span className="text-brand-600">Map</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-brand-600">Home</Link>
                    <Link href="/resources" className="text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-brand-600">Directory</Link>
                    <Link href="/submit" className="text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-brand-600">Submit a Place</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link 
                        href="/resources" 
                        className="hidden sm:flex items-center gap-2 rounded-full border-2 border-slate-900 bg-accent-400 px-6 py-2 font-bold text-slate-900 transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                    >
                        <Search className="h-4 w-4" />
                        <span>Find Resources</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}
