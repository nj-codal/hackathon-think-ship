import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-teal-900 text-teal-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                    <div>
                        <p className="font-display text-white text-xl font-semibold mb-2">
                            Ahmedabad Resource Map
                        </p>
                        <p className="text-sm text-teal-200 leading-relaxed">
                            A community directory connecting residents to essential local services across Ahmedabad, Gujarat.
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold text-white text-sm mb-3 uppercase tracking-wide">Navigate</p>
                        <ul className="space-y-2 text-sm text-teal-200">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/resources" className="hover:text-white transition-colors">Browse Resources</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white text-sm mb-3 uppercase tracking-wide">Categories</p>
                        <ul className="space-y-2 text-sm text-teal-200">
                            <li>Mental Health</li>
                            <li>Food Banks</li>
                            <li>Clinics</li>
                            <li>Gyms &amp; Fitness</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-teal-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-teal-300">
                        © {new Date().getFullYear()} Ahmedabad Community Resource Map. Built for the community.
                    </p>
                    <p className="text-xs text-teal-400">Focused on Ahmedabad, Gujarat, India</p>
                </div>
            </div>
        </footer>
    )
}
