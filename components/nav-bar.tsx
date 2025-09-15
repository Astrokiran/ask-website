'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X, MessageCircle } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const whatsappNumber = "+918197503574";
const message = "Hello, I would like to get an astrology consultation.";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <div className="fixed top-0 w-full bg-background border-b z-50 text-xl">
        <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Link href="/" >
            <div className="flex items-center gap-2">
              <img src="/ask-logo.png" alt="Astrokiran Logo" className="w-12 h-12" />
              <span className="font-bold">Astrokiran</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/free-kundli" className="text-sm text-muted-foreground px-3 py-1 rounded-md hover:bg-accent transition-all duration-200">
              Free Kundli
            </Link>
             <Link href="/kundli-match" className="text-sm text-muted-foreground px-3 py-1 rounded-md hover:bg-accent transition-all duration-200">
              Kundli Matching
            </Link>
            <Link href="/horoscopes" className="text-sm text-muted-foreground px-3 py-1 rounded-md hover:bg-accent transition-all duration-200">
              Daily Horoscope
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground px-3 py-1 rounded-md hover:bg-accent transition-all duration-200">
              Blogs
            </Link>
            <Link href="/#astrologers" className="text-sm text-muted-foreground px-3 py-1 rounded-md hover:bg-accent transition-all duration-200">
              Our Astrologers
            </Link>
            <Link href="/#services" className="text-sm text-muted-foreground px-3 py-1 rounded-md hover:bg-accent transition-all duration-200">
              Services
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground px-3 py-1 rounded-md hover:bg-accent transition-all duration-200">
              Pricing
            </Link>
            <ThemeToggle />
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-[#25D366] text-white px-3 py-1 rounded-md hover:bg-[#22c55e] transition-all duration-200"
            >
              <img
                src="/social.png"
                alt="WhatsApp"
                className="w-8 h-8"
              />
              <span className="text-sm">Book Now</span>
            </a>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-[#25D366] text-white p-2 rounded-full hover:bg-[#22c55e] transition-all duration-200"
            >
              <img
                src="/social.png"
                alt="WhatsApp"
                className="w-8 h-8"
              />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t">
            <div className="flex flex-col p-4 space-y-4">
               <Link
                href="/free-kundli"
                className="text-sm hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Free Kundli
              </Link>
              <Link
                href="/kundli-match"
                className="text-sm hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Kundli Matching
              </Link>
              
              <Link
                href="/horoscopes"
                className="text-sm hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Daily Horoscope
              </Link>
           
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
              <a
                href="https://wa.me/+1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#25D366] hover:text-[#22c55e]"
                onClick={() => setIsMenuOpen(false)}
              >
                <img
                  src="/social.png"
                  alt="WhatsApp"
                  className="w-5 h-5"
                />
                <span>Consult on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="h-[65px]" />
    </>
  )
}

