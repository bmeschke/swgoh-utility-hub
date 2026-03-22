import { Link } from 'react-router-dom'
import { SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'

export default function Nav() {
  const { isSignedIn, isLoaded } = useAuth()

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold">
            Galaxy Tools
          </Link>
          <Link
            to="/pack-library"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Pack Library
          </Link>
          <Link
            to="/evaluate-pack"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Evaluate Pack
          </Link>
          {isSignedIn && (
            <Link
              to="/income"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Income
            </Link>
          )}
        </div>
        <div>
          {isLoaded && (
            isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
