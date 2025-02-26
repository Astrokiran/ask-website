import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavBar() {
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
            <Link href="/#astrologers" className="text-sm">
              Find Astrologers
            </Link>
            <Link href="/#services" className="text-sm">
              Services
            </Link>
            <Link href="/pricing" className="text-sm">
              Pricing
            </Link>
          </div>
        </nav>
      </div>
      <div className="h-[65px]" /> {/* Spacer div to prevent content from going under navbar */}
    </>
  )
}

