export function ExampleComponent() {
    return (
        <div className="container">
            <h1>Sanity App</h1>
            <p>
                This app runs inside the Sanity Dashboard. Replace this component
                with your own to start building.
            </p>
            <div className="code-hint">
                <p>Quick tip: use SDK hooks to read and write content:</p>
                <pre>{`import { useQuery } from '@sanity/sdk-react'

const { data } = useQuery({
  query: '*[_type == "post"][0...10]{ _id, title }',
})`}</pre>
            </div>
        </div>
    )
}
