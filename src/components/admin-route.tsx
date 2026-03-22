import { useUser } from '@clerk/clerk-react'
import ProtectedRoute from '@/components/protected-route'

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoaded } = useUser()

  return (
    <ProtectedRoute>
      {isLoaded && user?.id !== import.meta.env.VITE_ADMIN_USER_ID ? (
        <div className="p-8">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            This area is restricted to admins only.
          </p>
        </div>
      ) : (
        <>{children}</>
      )}
    </ProtectedRoute>
  )
}
