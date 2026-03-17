"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Heart, Sparkles, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AISearch } from "@/components/ai-search"

interface NavigationProps {
  isAuthenticated?: boolean
  user?: {
    name: string
    avatar?: string
  }
}

export function Navigation({ isAuthenticated: isAuthProp, user: userProp }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aiSearchOpen, setAiSearchOpen] = useState(false)
  const [authState, setAuthState] = useState<{ isAuthenticated: boolean; user: { name: string; avatar?: string } | null }>({
    isAuthenticated: isAuthProp ?? false,
    user: userProp ?? null,
  })
  const router = useRouter()

  useEffect(() => {
    if (isAuthProp !== undefined) return
    const stored = localStorage.getItem("user")
    if (stored) {
      const u = JSON.parse(stored)
      setAuthState({
        isAuthenticated: true,
        user: {
          name: u.username,
          avatar: u.profileImage?.startsWith("http")
            ? u.profileImage
            : u.profileImage
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u.profileImage}`
            : undefined,
        },
      })
    }
  }, [isAuthProp])

  const isAuthenticated = isAuthProp ?? authState.isAuthenticated
  const user = userProp ?? authState.user

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    setMobileMenuOpen(false)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="font-serif text-3xl font-medium italic tracking-tight">
              <span className="text-primary group-hover:text-foreground transition-colors duration-300">Ry</span>
              <span className="text-foreground group-hover:text-primary transition-colors duration-300">dex</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link 
              href="/cars" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Browse Cars
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              href="/list-your-car" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              List Your Car
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setAiSearchOpen(true)}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              AI Search
            </Button>
            
            {isAuthenticated ? (
              <>
                <Link href="/favorites">
                  <Button variant="ghost" size="icon-sm">
                    <Heart className="w-5 h-5" />
                    <span className="sr-only">Favorites</span>
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="icon-sm">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="sr-only">Profile</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon-sm" onClick={handleLogout} title="Sign out">
                  <LogOut className="w-5 h-5" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon-sm" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/50">
            <div className="flex flex-col gap-1">
              <Link 
                href="/cars" 
                className="text-muted-foreground hover:text-foreground transition-colors py-3 px-2 rounded-lg hover:bg-secondary/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Cars
              </Link>
              <Link 
                href="/list-your-car" 
                className="text-muted-foreground hover:text-foreground transition-colors py-3 px-2 rounded-lg hover:bg-secondary/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                List Your Car
              </Link>
              
              <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-border/50">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setAiSearchOpen(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Search
                </Button>
                
                {isAuthenticated ? (
                  <>
                    <Link href="/favorites" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        <Heart className="w-4 h-4 mr-2" />
                        Favorites
                      </Button>
                    </Link>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">Profile</Button>
                    </Link>
                    <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* AI Search Modal */}
      <AISearch isOpen={aiSearchOpen} onClose={() => setAiSearchOpen(false)} />
    </header>
  )
}
