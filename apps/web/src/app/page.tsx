export default function Home(): React.JSX.Element {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen font-sans gap-4">
            <h1 className="text-4xl font-bold">Hackathon</h1>
            <p className="text-lg text-gray-600">
                Next.js + Sanity monorepo is ready.{' '}
                <a
                    href="http://localhost:3333"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    Open Sanity Studio →
                </a>
            </p>
        </main>
    )
}
