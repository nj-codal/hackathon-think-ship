import Link from 'next/link'

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-warm-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <span className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <circle cx="8" cy="6" r="3" fill="white" />
                            <path d="M8 9C5 9 2 10.5 2 12.5V14h12v-1.5C14 10.5 11 9 8 9z" fill="white" fillOpacity="0.7" />
                        </svg>
                    </span>
                    <span className="font-display font-semibold text-teal-900 text-lg leading-tight">
                        Ahmedabad<br />
                        <span className="text-xs font-sans font-normal text-warm-200 tracking-widest uppercase">Resource Map</span>
                    </span>
                </Link>

                <nav className="hidden sm:flex items-center gap-6">
                    <Link
                        href="/resources"
                        className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
                    >
                        Browse Resources
                    </Link>
                    <Link
                        href="/submit"
                        className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
                    >
                        Submit a Resource
                    </Link>
                    <a
                        href="http://localhost:3333"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
                    >
                        Studio
                    </a>
                </nav>

                <Link
                    href="/resources"
                    className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Find Resources
                </Link>
            </div>
        </header>
    )
}
