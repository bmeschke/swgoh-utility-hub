import { Link, NavLink } from 'react-router-dom'
import { SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import PatchNotesModal from '@/components/PatchNotesModal'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-xs sm:text-sm whitespace-nowrap transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`

export default function Nav() {
  const { isSignedIn, isLoaded } = useAuth()

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-2 sm:py-0 flex flex-col sm:flex-row sm:items-center sm:h-12 gap-y-1.5">
        {/* Row 1: brand + nav links */}
        <div className="flex items-center gap-3 sm:gap-6 flex-1">
          <Link to="/" className="text-xs sm:text-sm font-semibold whitespace-nowrap">
            GoH Tools
          </Link>
          <NavLink to="/pack-library" className={navLinkClass}>
            Pack Library
          </NavLink>
          <NavLink to="/evaluate-pack" className={navLinkClass}>
            Evaluate Pack
          </NavLink>
          <NavLink to="/income" className={navLinkClass}>
            Income
          </NavLink>
        </div>
        {/* Row 2 on mobile / right side on desktop */}
        <div className="flex items-center gap-2 pb-1 sm:pb-0">
          <PatchNotesModal />
          {isLoaded &&
            (isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            ))}
        </div>
      </div>
    </nav>
  )
}
