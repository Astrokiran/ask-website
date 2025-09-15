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
      <div className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-orange-200/20 z-50 text-xl shadow-lg">
        {/* Instagram-style gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/30 via-purple-50/20 to-orange-50/30 dark:from-orange-950/10 dark:via-purple-950/5 dark:to-orange-950/10"></div>

        {/* Floating sparkle effects */}
        <div className="absolute top-1 left-1/4 text-orange-400/60 animate-pulse text-xs">✨</div>
        <div className="absolute top-1 right-1/4 text-purple-500/60 animate-bounce text-xs">⭐</div>

        <nav className="relative flex items-center p-4 max-w-7xl mx-auto gap-4">
          {/* Fixed Logo - never shrinks */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2 group transition-all duration-300 hover:scale-105">
              {/* Enhanced logo with glow effect */}
              <div className="relative">
                <img src="/ask-logo.png" alt="Astrokiran Logo" className="w-12 h-12 transition-all duration-300 group-hover:drop-shadow-lg" />
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span className="font-bold bg-gradient-to-r from-orange-600 via-purple-600 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-500 group-hover:via-purple-500 group-hover:to-orange-500 transition-all duration-300 whitespace-nowrap">
                Astrokiran
              </span>
              {/* Floating sparkle on logo hover */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-yellow-400 animate-bounce text-sm ml-1">✨</span>
            </div>
          </Link>

          {/* Scrollable Navigation for Desktop */}
          <div className="hidden md:flex items-center flex-1 relative group">
            {/* Left scroll button */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-orange-500 to-purple-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Right scroll button */}
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-orange-500 to-purple-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
            >
              <ChevronRight size={16} />
            </button>

            {/* Navigation items container */}
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-2 overflow-x-auto nav-scroll px-8"
            >
            <Link href="/free-kundli" className="group relative text-sm font-semibold text-foreground px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md overflow-hidden whitespace-nowrap flex-shrink-0">
              <span className="relative z-10 group-hover:text-orange-600">Free Kundli</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
             <Link href="/kundli-match" className="group relative text-sm font-semibold text-foreground px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md overflow-hidden whitespace-nowrap flex-shrink-0">
              <span className="relative z-10 group-hover:text-purple-600">Kundli Matching</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/horoscopes" className="group relative text-sm font-semibold text-foreground px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md overflow-hidden whitespace-nowrap flex-shrink-0">
              <span className="relative z-10 group-hover:text-orange-600">Daily Horoscope</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/blog" className="group relative text-sm font-semibold text-foreground px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md overflow-hidden whitespace-nowrap flex-shrink-0">
              <span className="relative z-10 group-hover:text-purple-600">Blogs</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/#astrologers" className="group relative text-sm font-semibold text-foreground px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md overflow-hidden whitespace-nowrap flex-shrink-0">
              <span className="relative z-10 group-hover:text-orange-600">Our Astrologers</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/#services" className="group relative text-sm font-semibold text-foreground px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md overflow-hidden whitespace-nowrap flex-shrink-0">
              <span className="relative z-10 group-hover:text-purple-600">Services</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/pricing" className="group relative text-sm font-semibold text-foreground px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md overflow-hidden whitespace-nowrap flex-shrink-0">
              <span className="relative z-10 group-hover:text-orange-600">Pricing</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link href="/games/hindu-wisdom-millionaire" className="group relative text-sm font-semibold text-foreground px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 hover:shadow-md overflow-hidden whitespace-nowrap flex-shrink-0">
              <span className="relative z-10 group-hover:text-purple-600 flex items-center gap-1">
                <span>🎮</span>
                <span>Games</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            </div>
          </div>

          {/* Fixed Right Side Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <ThemeToggle />
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#22c55e] text-white px-4 py-2 rounded-full hover:from-[#22c55e] hover:to-[#20b954] transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md overflow-hidden whitespace-nowrap"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <img
                src="/social.png"
                alt="WhatsApp"
                className="w-6 h-6 relative z-10 group-hover:animate-pulse"
              />
              <span className="text-sm font-semibold relative z-10">Book Now</span>
              {/* Special badge */}
              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse relative z-10">HOT</span>
            </a>
          </div>

          {/* Fixed Right Side Actions - Mobile */}
          <div className="md:hidden flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center bg-gradient-to-r from-[#25D366] to-[#22c55e] text-white p-2.5 rounded-full hover:from-[#22c55e] hover:to-[#20b954] transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg overflow-hidden"
            >
              {/* Pulse ring effect */}
              <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></div>
              <img
                src="/social.png"
                alt="WhatsApp"
                className="w-6 h-6 relative z-10 group-hover:animate-pulse"
              />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-300 hover:scale-110"
            >
              {isMenuOpen ? <X size={24} className="transition-transform duration-300 rotate-90" /> : <Menu size={24} className="transition-transform duration-300" />}
            </button>
          </div>
        </nav>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-orange-200/20 shadow-xl max-h-[80vh] overflow-y-auto scrollbar-hide">
            {/* Mobile menu gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-50/20 to-purple-50/20 dark:from-orange-950/10 dark:to-purple-950/10"></div>
            <div className="relative flex flex-col p-6 space-y-4">
               <Link
                href="/free-kundli"
                className="group flex items-center gap-2 text-sm text-muted-foreground px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 border border-transparent hover:border-orange-200/30"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-orange-500">🎁</span>
                <span className="group-hover:text-orange-600 transition-colors">Free Kundli</span>
              </Link>
              <Link
                href="/kundli-match"
                className="group flex items-center gap-2 text-sm text-muted-foreground px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 border border-transparent hover:border-orange-200/30"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-purple-500">💕</span>
                <span className="group-hover:text-purple-600 transition-colors">Kundli Matching</span>
              </Link>

              <Link
                href="/horoscopes"
                className="group flex items-center gap-2 text-sm text-muted-foreground px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 border border-transparent hover:border-orange-200/30"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-yellow-500">⭐</span>
                <span className="group-hover:text-yellow-600 transition-colors">Daily Horoscope</span>
              </Link>

              <Link
                href="/#astrologers"
                className="group flex items-center gap-2 text-sm text-muted-foreground px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 border border-transparent hover:border-orange-200/30"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-blue-500">👨‍🏫</span>
                <span className="group-hover:text-blue-600 transition-colors">Find Astrologers</span>
              </Link>
              <Link
                href="/#services"
                className="group flex items-center gap-2 text-sm text-muted-foreground px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 border border-transparent hover:border-orange-200/30"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-green-500">🔮</span>
                <span className="group-hover:text-green-600 transition-colors">Services</span>
              </Link>
              <Link
                href="/pricing"
                className="group flex items-center gap-2 text-sm text-muted-foreground px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 border border-transparent hover:border-orange-200/30"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-pink-500">💰</span>
                <span className="group-hover:text-pink-600 transition-colors">Pricing</span>
              </Link>

              <Link
                href="/games/hindu-wisdom-millionaire"
                className="group flex items-center gap-2 text-sm text-muted-foreground px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-purple-50 dark:hover:from-orange-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:scale-105 border border-transparent hover:border-orange-200/30"
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
                className="group relative flex items-center gap-3 text-sm bg-gradient-to-r from-[#25D366] to-[#22c55e] text-white px-4 py-3 rounded-xl hover:from-[#22c55e] hover:to-[#20b954] transition-all duration-300 hover:scale-105 shadow-md overflow-hidden border-2 border-transparent hover:border-green-300/30"
                onClick={() => setIsMenuOpen(false)}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <img
                  src="/social.png"
                  alt="WhatsApp"
                  className="w-5 h-5 relative z-10 group-hover:animate-pulse"
                />
                <span className="font-semibold relative z-10">Consult on WhatsApp</span>
                <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse relative z-10">LIVE</span>
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="h-[65px]" />
    </>
  )
}

