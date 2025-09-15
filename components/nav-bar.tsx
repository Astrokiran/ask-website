'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import { Menu, X, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const whatsappNumber = "+918197503574";
const message = "Hello, I would like to get an astrology consultation.";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className="fixed top-0 w-full max-w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 z-[9999] text-xl shadow-sm overflow-hidden">

        <nav className="relative flex items-center justify-between p-3 sm:p-4 w-full max-w-7xl mx-auto gap-2 overflow-hidden">
          {/* Fixed Logo - never shrinks */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2 group transition-all duration-300 hover:scale-105">
              {/* Enhanced logo with glow effect */}
              <div className="relative">
                <img src="/ask-logo.png" alt="Astrokiran Logo" className="w-12 h-12 transition-all duration-300 group-hover:drop-shadow-lg" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white transition-all duration-300 whitespace-nowrap">
                Astrokiran
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 min-w-0 mx-4">
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-1 overflow-x-auto nav-scroll w-full min-w-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
            <Link href="/free-kundli" className="group relative text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 whitespace-nowrap flex-shrink-0">
              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Free Kundli</span>
            </Link>
             <Link href="/kundli-match" className="group relative text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 whitespace-nowrap flex-shrink-0">
              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Kundli Matching</span>
            </Link>
            <Link href="/horoscopes" className="group relative text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 whitespace-nowrap flex-shrink-0">
              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Daily Horoscope</span>
            </Link>
            <Link href="/blog" className="group relative text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 whitespace-nowrap flex-shrink-0">
              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Blogs</span>
            </Link>
            <Link href="/#astrologers" className="group relative text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 whitespace-nowrap flex-shrink-0">
              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Our Astrologers</span>
            </Link>
            <Link href="/#services" className="group relative text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 whitespace-nowrap flex-shrink-0">
              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Services</span>
            </Link>
            <Link href="/pricing" className="group relative text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 whitespace-nowrap flex-shrink-0">
              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Pricing</span>
            </Link>
            <Link href="/games/hindu-wisdom-millionaire" className="group relative text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 whitespace-nowrap flex-shrink-0">
              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Games</span>
            </Link>
            </div>
          </div>

          {/* Fixed Right Side Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-3 py-2 rounded-lg hover:bg-[#22c55e] transition-all duration-200 whitespace-nowrap text-sm font-medium"
            >
              <img
                src="/social.png"
                alt="WhatsApp"
                className="w-4 h-4"
              />
              <span>Book Now</span>
            </a>
          </div>

          {/* Fixed Right Side Actions - Mobile/Tablet */}
          <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-[#25D366] text-white p-2 rounded-lg hover:bg-[#22c55e] transition-all duration-200"
            >
              <img
                src="/social.png"
                alt="WhatsApp"
                className="w-5 h-5"
              />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-orange-200/20 shadow-xl max-h-[70vh] overflow-y-auto relative z-[9998]">
            <div className="relative flex flex-col p-4 space-y-2">
               <Link
                href="/free-kundli"
                className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-orange-500">🎁</span>
                <span className="group-hover:text-orange-600 transition-colors">Free Kundli</span>
              </Link>
              <Link
                href="/kundli-match"
                className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-purple-500">💕</span>
                <span className="group-hover:text-purple-600 transition-colors">Kundli Matching</span>
              </Link>

              <Link
                href="/horoscopes"
                className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-yellow-500">⭐</span>
                <span className="group-hover:text-yellow-600 transition-colors">Daily Horoscope</span>
              </Link>

              <Link
                href="/#astrologers"
                className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-blue-500">👨‍🏫</span>
                <span className="group-hover:text-blue-600 transition-colors">Find Astrologers</span>
              </Link>
              <Link
                href="/#services"
                className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-green-500">🔮</span>
                <span className="group-hover:text-green-600 transition-colors">Services</span>
              </Link>
              <Link
                href="/pricing"
                className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-pink-500">💰</span>
                <span className="group-hover:text-pink-600 transition-colors">Pricing</span>
              </Link>

              <Link
                href="/games/hindu-wisdom-millionaire"
                className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-purple-500">🎮</span>
                <span className="group-hover:text-purple-600 transition-colors">Hindu Wisdom Game</span>
              </Link>

              {/* Enhanced WhatsApp mobile button */}
              <a
                href="https://wa.me/+918197503574?text=Hello, I would like to get an astrology consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm bg-[#25D366] text-white px-3 py-2 rounded-lg hover:bg-[#22c55e] transition-all duration-200 font-medium"
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

