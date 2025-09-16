import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Star, Heart, Sparkles, Gift, Users, TrendingUp } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/ask-logo.png" alt="Astrokiran Logo" width={32} height={32} />
              <span className="font-semibold text-foreground">Astrokiran</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <strong className="text-blue-600 dark:text-blue-400">Trusted by 40,000+ WhatsApp Users</strong><br/>
              Authentic Astrological Guidance<br/>
              Expert Predictions & Insights<br/>
              Discover your cosmic path today!
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              Quick Access
            </h3>
            <div className="space-y-2">
              <Link href="/free-kundli" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Free Kundli
              </Link>
              <Link href="/kundli-match" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Kundli Matching
              </Link>
              <Link href="/horoscopes" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Daily Horoscope
              </Link>
              <Link href="/blog" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Blogs
              </Link>
              <Link href="/#astrologers" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Our Astrologers
              </Link>
              <Link href="/#services" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Services
              </Link>
              <Link href="/pricing" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Pricing
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              Our Expertise
            </h3>
            <div className="space-y-2">
              <Link href="/horoscopes" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Horoscope Reading
              </Link>
              <Link href="/free-kundli" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Kundli Analysis
              </Link>
              <Link href="/kundli-match" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Compatibility Matching
              </Link>
              <Link href="/blog" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Astrological Insights
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="leading-relaxed">235 13th Cross, Hoysala Nagar 2nd Stage, Indiranagar, Bangalore North, Karnataka, India, 560038</p>
              <p className="break-all">contact@astrokiran.com</p>
              <p>+918197503574</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Corporate Info</h3>
            <div className="space-y-2">
              <Link href="/terms" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Terms & Conditions
              </Link>
              <Link href="/disclaimer" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Disclaimer
              </Link>
              <Link href="/pricing-policy" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Pricing Policy
              </Link>
              <Link href="/privacy-policy" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 Astrokiran. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="https://www.facebook.com/profile.php?id=61573395667162" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="https://www.instagram.com/ask.astrokiran/?hl=en" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

