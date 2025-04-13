"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { LogOut, Menu, X } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })
    return unsubscribe
  }, [])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  return (
    <nav className="bg-black border-b border-zinc-800 p-4 flex items-center">
      {/* Left: Greeting + nav links */}
      <div className="flex items-center space-x-6">
        <span className="text-white font-medium tracking-tight">
          {user ? (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              {user.displayName || user.email?.split("@")[0]}
            </span>
          ) : (
            "Guest"
          )}
        </span>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
            Dashboard
          </Link>
          {user && (
            <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors">
              Admin
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black border-b border-zinc-800 p-4 md:hidden z-50">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            {user && (
              <Link
                href="/admin"
                className="text-zinc-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Right: Sign in / Logout */}
      <div className="ml-auto">
        {user ? (
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-zinc-800 bg-black hover:bg-zinc-900 text-white"
            disabled={loading}
          >
            {loading ? "..." : <LogOut className="h-4 w-4 mr-2" />}
            Logout
          </Button>
        ) : (
          <Button onClick={() => router.push("/login")} className="bg-white text-black hover:bg-zinc-200">
            Sign In
          </Button>
        )}
      </div>
    </nav>
  )
}
