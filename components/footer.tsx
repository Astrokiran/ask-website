import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Star, Heart, Sparkles, Gift, Users, TrendingUp } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/ask-logo.png" alt="Astrokiran Logo" width={32} height={32} />
              <span className="font-semibold text-foreground">Astrokiran</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ✨ <strong className="text-orange-500">Trusted by 40,000+ WhatsApp Users</strong> ✨<br/>
              🌟 Authentic Astrological Guidance<br/>
              🎯 Expert Predictions & Insights<br/>
              💫 Discover your cosmic path today!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              🔥 Quick Access
            </h3>
            <div className="space-y-3">
              <Link href="/free-kundli" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition-colors">
                <Gift className="w-4 h-4 text-orange-500" />
                <span className="group-hover:translate-x-1 transition-transform">Free Kundli <em className="text-xs">(₹1K Report FREE!)</em> ✨</span>
              </Link>
              <Link href="/kundli-match" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                <Heart className="w-4 h-4 text-purple-500" />
                <span className="group-hover:translate-x-1 transition-transform">Kundli Matching <em className="text-xs">(Perfect Match?)</em> 💕</span>
              </Link>
              <Link href="/horoscopes" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition-colors">
                <Star className="w-4 h-4 text-orange-500" />
                <span className="group-hover:translate-x-1 transition-transform">Daily Horoscope <em className="text-xs">(What's Today?)</em> 🌟</span>
              </Link>
              <Link href="/blog" className="block text-sm text-gray-400 hover:text-white">
                Blogs
              </Link>
              <Link href="/#astrologers" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="group-hover:translate-x-1 transition-transform">Our Astrologers <em className="text-xs">(Meet Experts)</em> 👨‍🔬</span>
              </Link>
              <Link href="/services" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition-colors">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="group-hover:translate-x-1 transition-transform">Services <em className="text-xs">(All Solutions)</em> 🎯</span>
              </Link>
              <Link href="/pricing" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="group-hover:translate-x-1 transition-transform">Pricing <em className="text-xs">(Fair Rates)</em> 💰</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              🎯 Our Expertise
            </h3>
            <div className="space-y-3">
              <Link href="/horoscopes" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition-colors">
                <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform"></div>
                <span className="group-hover:translate-x-1 transition-transform">Horoscope Reading <em className="text-xs">(Daily Guidance)</em> 🔮</span>
              </Link>
              <Link href="#" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-150 transition-transform"></div>
                <span className="group-hover:translate-x-1 transition-transform">Kundli Analysis <em className="text-xs">(Birth Chart)</em> 📊</span>
              </Link>
              <Link href="#" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition-colors">
                <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform"></div>
                <span className="group-hover:translate-x-1 transition-transform">Numerology <em className="text-xs">(Lucky Numbers)</em> 🎲</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>235 13th Cross, Hoysala Nagar 2nd Stage, Indiranagar, Bangalore North, Karnataka, India, 560038</p>
              <p>contact@astrokiran.com</p>
              <p>+918197503574</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Corporate Info</h3>
            <div className="space-y-2">
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms & Conditions
              </Link>
              {/* <Link href="/privacy" className="block text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link> */}
              <Link href="/disclaimer" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Disclaimer
              </Link>
              <Link href="/pricing-policy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing Policy
              </Link>
              <Link href="/privacy-policy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">© 2024 Astrokiran. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="https://www.facebook.com/profile.php?id=61573395667162" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="w-5 h-5" />
            </Link>
            {/* <Link href="#" className="text-gray-400 hover:text-white">
              <Twitter className="w-5 h-5" />
            </Link> */}
            <Link href="https://www.instagram.com/ask.astrokiran/?hl=en" className="text-muted-foreground hover:text-foreground transition-colors">
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

