'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import { Menu, X, MessageCircle, ChevronLeft, ChevronRight, User, LogIn, ChevronDown } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"
import { UserDropdown } from "@/components/auth/UserDropdown"
import { redirectToAppStore } from "@/lib/deviceDetection"

const appDownloadLink = "https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showExploreDropdown, setShowExploreDropdown] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { user, loading } = useAuth()

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

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setShowExploreDropdown(true)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowExploreDropdown(false)
    }, 150)
  }

  return (
    <>
      <div className="fixed top-0 w-full max-w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 z-[9999] text-xl shadow-sm">

        <nav className="relative flex items-center justify-between p-3 sm:p-4 w-full max-w-7xl mx-auto gap-2">
          {/* Fixed Logo - never shrinks */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <img src="/ask-logo.png" alt="Astrokiran Logo" className="w-12 h-12" />
              <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                Astrokiran
              </span>
            </div>
          </Link>

          {/* Desktop and Tablet Navigation */}
          <div className="hidden md:flex items-center flex-1 min-w-0 mx-2 sm:mx-4 relative">
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-1 overflow-x-auto nav-scroll w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingRight: '20px' }}
            >
            <Link href="/free-kundli" className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap flex-shrink-0">
              Free Kundli
            </Link>
            <Link href="/kundli-match" className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap flex-shrink-0">
              Kundli Matching
            </Link>
            <Link href="/horoscopes" className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap flex-shrink-0">
              Daily Horoscope
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap flex-shrink-0">
              Blogs
            </Link>
            <Link href="/#astrologers" className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap flex-shrink-0">
             Astrologers
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap flex-shrink-0">
              Pricing
            </Link>
            {/* Explore Button */}
            <button
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setShowExploreDropdown(!showExploreDropdown)}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap flex-shrink-0 mr-4"
            >
              Explore
              <ChevronDown className={`w-4 h-4 transition-transform ${showExploreDropdown ? 'rotate-180' : ''}`} />
            </button>
            </div>

            {/* Explore Dropdown - Outside scroll container */}
            {showExploreDropdown && (
              <div
                className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-[10000]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/music"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  onClick={() => setShowExploreDropdown(false)}
                >
                  <span className="mr-2">🎵</span>
                  <span>Music</span>
                </Link>
                <Link
                  href="/games/hindu-wisdom-millionaire"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  onClick={() => setShowExploreDropdown(false)}
                >
                  <span className="mr-2">🎮</span>
                  <span>Games</span>
                </Link>
                <Link
                  href="/jobs"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setShowExploreDropdown(false)}
                >
                  <span className="mr-2">💼</span>
                  <span>Jobs</span>
                </Link>
              </div>
            )}
          </div>

          {/* Fixed Right Side Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            {!loading && (
              user ? (
                <UserDropdown />
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              )
            )}
            <a
              href={appDownloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
              <span>Download App</span>
            </a>
          </div>

          {/* Fixed Right Side Actions - Mobile/Tablet */}
          <div className="md:hidden flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            {!loading && (
              user ? (
                <UserDropdown />
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <LogIn className="w-4 h-4" />
                </Button>
              )
            )}
            <a
              href={appDownloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-[#D32F2F] hover:bg-[#B71C1C] text-white p-2 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-orange-200/20 shadow-xl max-h-[70vh] overflow-y-auto relative z-[9998]">
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
                className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-orange-500">👨‍🏫</span>
                <span className="group-hover:text-orange-600 transition-colors">Find Astrologers</span>
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

              {/* Explore Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Explore More
                </div>

                <Link
                  href="/music"
                  className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-red-500">🎵</span>
                  <span className="group-hover:text-red-600 transition-colors">Music</span>
                </Link>

                <Link
                  href="/games/hindu-wisdom-millionaire"
                  className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-purple-500">🎮</span>
                  <span className="group-hover:text-purple-600 transition-colors">Games</span>
                </Link>

                <Link
                  href="/jobs"
                  className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-blue-500">💼</span>
                  <span className="group-hover:text-blue-600 transition-colors">Jobs</span>
                </Link>
              </div>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  redirectToAppStore();
                }}
                className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200 w-full text-left"
              >
                <span className="text-green-500">⚡</span>
                <span className="group-hover:text-green-600 transition-colors">Quick Connect</span>
              </button>

              <Link
                href="/tarot"
                className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-purple-500">🔮</span>
                <span className="group-hover:text-purple-600 transition-colors">Tarot Services</span>
              </Link>

              <Link
                href="/astrology-services"
                className="group flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-orange-500">✨</span>
                <span className="group-hover:text-orange-600 transition-colors">Astrology Services</span>
              </Link>

              {/* Auth section for mobile */}
              {!loading && !user && (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-sm text-foreground px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200 w-full"
                >
                  <span className="text-orange-500">👤</span>
                  <span className="group-hover:text-orange-600 transition-colors">Sign In / Sign Up</span>
                </button>
              )}

              {/* Enhanced App Download mobile button */}
              <a
                href={appDownloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 text-sm bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                  </svg>
                  <span className="font-semibold">Download App</span>
                </div>
                <span className="text-xs">Recharge ₹1, Get 5 min FREE (₹250 value)</span>
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="h-[65px]" />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}

