import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavBar() {
  return (
    <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
      <Link href="/" >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-yellow-500">⚛</span>
          <span className="font-semibold">AstroKiran</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link href="#" className="text-sm">
          Find Astrologers
        </Link>
        <Link href="#" className="text-sm">
          Services
        </Link>
        <Link href="#" className="text-sm">
          Blog
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          EN
        </Button>
        <Button variant="secondary" size="sm">
          Login
        </Button>
      </div>
    </nav>
  )
}

