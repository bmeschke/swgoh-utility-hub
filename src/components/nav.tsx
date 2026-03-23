import { Link, NavLink } from 'react-router-dom'
import { SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`

export default function Nav() {
  const { isSignedIn, isLoaded } = useAuth()

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold">
            GoH Tools
          </Link>
          <NavLink to="/pack-library" className={navLinkClass}>
            Pack Library
          </NavLink>
          <NavLink to="/evaluate-pack" className={navLinkClass}>
            Evaluate Pack
          </NavLink>
          {isSignedIn && (
            <NavLink to="/income" className={navLinkClass}>
              Income
            </NavLink>
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
