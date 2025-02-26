'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <div className="fixed top-0 w-full bg-white border-b z-50">
        <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Link href="/" >
            <div className="flex items-center gap-2">
              <img src="/ask-logo.png" alt="AstroKiran Logo" className="w-8 h-8" />
              <span className="font-semibold">AstroKiran</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#astrologers" className="text-sm hover:text-primary">
              Find Astrologers
            </Link>
            <Link href="/#services" className="text-sm hover:text-primary">
              Services
            </Link>
            <Link href="/pricing" className="text-sm hover:text-primary">
              Pricing
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="flex flex-col p-4 space-y-4">
              <Link
                href="/#astrologers"
                className="text-sm hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Astrologers
              </Link>
              <Link
                href="/#services"
                className="text-sm hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/pricing"
                className="text-sm hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="h-[65px]" />
    </>
  )
}

