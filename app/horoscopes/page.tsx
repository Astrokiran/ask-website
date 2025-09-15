import { Metadata } from 'next'
import { Footer } from "@/components/footer"
import { NavBar } from "@/components/nav-bar"
import { ZodiacSignGrid } from "@/components/daily-horoscope/zodiac-sign-grid"
import { DailyHoroscopeCta } from "@/components/banners/Daily-horoscope"

export const metadata: Metadata = {
  title: "Daily Horoscope Today - Rashi Predictions for All Zodiac Signs",
  description: "Read your daily horoscope predictions for all 12 zodiac signs. Get accurate rashi forecasts, love, career, and health predictions updated daily by expert astrologers.",
  keywords: ["daily horoscope", "rashi predictions", "zodiac signs", "astrology predictions", "horoscope today"],
  alternates: {
    canonical: "https://astrokiran.com/horoscopes",
  },
}

export default function HoroscopesPage() {
  return (
    <div>
      <main>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Daily Horoscope - Today's Rashi Predictions
          </h1>
          <p className="text-lg text-center mb-8 text-gray-600">
            Get your daily horoscope and zodiac predictions. Accurate forecasts for love, career, health, and finance updated every day.
          </p>

          {/* Enhanced Content Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-orange-600">🌟 Why Read Daily Horoscopes?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Daily horoscopes provide valuable insights into your day ahead based on planetary movements and cosmic energies. Our expert astrologers analyze the positions of celestial bodies to bring you accurate predictions for all 12 zodiac signs.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Gain clarity on important decisions</li>
                  <li>Understand favorable and challenging periods</li>
                  <li>Prepare for opportunities and obstacles</li>
                  <li>Enhance your spiritual awareness</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-purple-600">🔮 What Makes Our Predictions Special?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our horoscope predictions are crafted by experienced Vedic astrologers who combine ancient wisdom with modern astronomical calculations. Each prediction considers the unique planetary transits affecting your zodiac sign.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Based on authentic Vedic astrology principles</li>
                  <li>Updated daily with fresh cosmic insights</li>
                  <li>Covers love, career, health, and finance</li>
                  <li>Personalized guidance for better life decisions</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-950/20 dark:to-purple-950/20 p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-bold mb-4 text-center">📚 Understanding Your Zodiac Sign</h2>
              <p className="text-muted-foreground leading-relaxed text-center mb-6">
                Each zodiac sign is influenced by specific planetary rulers and elements. Understanding your sign's characteristics helps you make the most of daily horoscope predictions. Whether you're an ambitious Aries, a practical Taurus, or a mysterious Scorpio, our daily forecasts are tailored to your sign's unique traits and cosmic influences.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <h3 className="font-semibold text-orange-600 mb-2">Fire Signs</h3>
                  <p className="text-muted-foreground">Aries, Leo, Sagittarius - Dynamic, passionate, and energetic</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-blue-600 mb-2">Water Signs</h3>
                  <p className="text-muted-foreground">Cancer, Scorpio, Pisces - Emotional, intuitive, and compassionate</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-green-600 mb-2">Earth Signs</h3>
                  <p className="text-muted-foreground">Taurus, Virgo, Capricorn - Practical, reliable, and grounded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DailyHoroscopeCta phoneNumber={"918197503574"}/>
        <ZodiacSignGrid/>
      </main>
      <Footer />
    </div>
  );
}
