import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1a1b2e] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-yellow-500">⚛</span>
              <span className="font-semibold text-white">Astrokiran</span>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted platform for authentic astrological predictions and spiritual insights.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-gray-400 hover:text-white">
                About Us
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white">
                Our Astrologers
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white">
                Blog & Articles
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white">
                Testimonials
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-gray-400 hover:text-white">
                Horoscope Reading
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white">
                Kundli Analysis
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white">
                Numerology
              </Link>
              <Link href="#" className="block text-sm text-gray-400 hover:text-white">
                Tarot Reading
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>123 Spiritual Street, Mumbai</p>
              <p>contact@astrokiran.com</p>
              <p>+91 123 456 7890</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400">© 2024 Astrokiran. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-white">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

