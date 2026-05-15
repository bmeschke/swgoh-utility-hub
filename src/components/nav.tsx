import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PatchNotesModal from '@/components/PatchNotesModal'

const NAV_LINKS = [
  { to: '/pack-library', label: 'Pack Library' },
  { to: '/evaluate-pack', label: 'Evaluate Pack' },
  { to: '/income', label: 'Income' },
]

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm whitespace-nowrap transition-colors ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`

const drawerLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block text-base py-2 px-3 rounded-md transition-colors ${isActive ? 'text-foreground font-medium bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`

export default function Nav() {
  const { isSignedIn, isLoaded } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <nav className="border-b bg-background relative z-40">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 h-12 flex items-center">
          {/* Hamburger — mobile only */}
          <button
            className="sm:hidden mr-3 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            aria-expanded={isOpen}
          >
            <Menu className="size-5" />
          </button>

          {/* Brand */}
          <Link to="/" className="text-sm font-semibold whitespace-nowrap">
            GoH Tools
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-6 ml-6 flex-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} className={desktopLinkClass}>
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side: Changes always visible + auth on desktop */}
          <div className="flex items-center gap-2 ml-auto">
            <PatchNotesModal />
            {isLoaded && (
              <span className="hidden sm:flex items-center">
                {isSignedIn ? (
                  <UserButton />
                ) : (
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </SignInButton>
                )}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 sm:hidden transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] z-50 bg-background border-r shadow-lg flex flex-col sm:hidden transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between h-12 px-4 border-b shrink-0">
          <Link to="/" className="text-sm font-semibold">
            GoH Tools
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 px-2 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={drawerLinkClass} onClick={() => setIsOpen(false)}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Auth section */}
        <div className="px-4 py-4 border-t shrink-0">
          {isLoaded &&
            (isSignedIn ? (
              <div className="flex items-center gap-3">
                <UserButton />
                <span className="text-sm text-muted-foreground">Manage Account</span>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </SignInButton>
            ))}
        </div>
      </div>
    </>
  )
}
