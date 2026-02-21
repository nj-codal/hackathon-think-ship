export function Footer() {
    return (
        <footer className="border-t-2 border-slate-900 bg-slate-900 py-12 text-slate-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h3 className="font-display text-2xl font-black text-white">AmdavadMap</h3>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                            A centralized public directory mapping essential community resources across Ahmedabad city. Built for the people.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-display text-lg font-bold text-white">Quick Links</h4>
                        <ul className="mt-4 space-y-2 text-sm font-medium">
                            <li><a href="/" className="hover:text-accent-400">Home</a></li>
                            <li><a href="/resources" className="hover:text-accent-400">Resources Map</a></li>
                            <li><a href="/studio" className="hover:text-accent-400">Add a Place</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800 pt-8 sm:flex-row">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Hackathon Civic Tech. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
