import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">404 — Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        <Link to="/" className="underline">Return home</Link>
      </p>
    </div>
  )
}
