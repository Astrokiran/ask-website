import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1a1b2e] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/ask-logo.png" alt="Astrokiran Logo" width={32} height={32} />
              <span className="font-semibold text-white">Astrokiran</span>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted platform for authentic astrological predictions and spiritual insights.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/free-kundli" className="block text-sm text-gray-400 hover:text-white">
                Free Kundli
              </Link>
              <Link href="/kundli-match" className="block text-sm text-gray-400 hover:text-white">
                Kundli Matching
              </Link>
              <Link href="/horoscopes" className="block text-sm text-gray-400 hover:text-white">
                Daily Horoscope
              </Link>
              <Link href="/#astrologers" className="block text-sm text-gray-400 hover:text-white">
                Our Astrologers
              </Link>
              <Link href="/pricing" className="block text-sm text-gray-400 hover:text-white">
                Pricing
              </Link>
              <Link href="/#testimonials" className="block text-sm text-gray-400 hover:text-white">
                Testimonials
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <div className="space-y-2">
              <Link href="/horoscopes" className="block text-sm text-gray-400 hover:text-white">
                Horoscope Reading
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white">
                Kundli Analysis
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white">
                Numerology
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>235 13th Cross, Hoysala Nagar 2nd Stage, Indiranagar, Bangalore North, Karnataka, India, 560038</p>
              <p>contact@astrokiran.com</p>
              <p>+918197503574</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Corporate Info</h3>
            <div className="space-y-2">
              <Link href="/terms" className="block text-sm text-gray-400 hover:text-white">
                Terms & Conditions
              </Link>
              {/* <Link href="/privacy" className="block text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link> */}
              <Link href="/disclaimer" className="block text-sm text-gray-400 hover:text-white">
                Disclaimer
              </Link>
              <Link href="/pricing-policy" className="block text-sm text-gray-400 hover:text-white">
                Pricing Policy
              </Link>
              <Link href="/privacy-policy" className="block text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400">© 2024 Astrokiran. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="https://www.facebook.com/profile.php?id=61573395667162" className="text-gray-400 hover:text-white">
              <Facebook className="w-5 h-5" />
            </Link>
            {/* <Link href="#" className="text-gray-400 hover:text-white">
              <Twitter className="w-5 h-5" />
            </Link> */}
            <Link href="https://www.instagram.com/ask.astrokiran/?hl=en" className="text-gray-400 hover:text-white">
              <Instagram className="w-5 h-5" />
            </Link>
            {/* <Link href="#" className="text-gray-400 hover:text-white">
              <Linkedin className="w-5 h-5" />
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

