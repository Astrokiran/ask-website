import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { MusicPlayer } from "@/components/music/MusicPlayer"

export const metadata: Metadata = {
  title: "Music - Spiritual & Devotional Videos | Astrokiran",
  description: "Explore our collection of spiritual music, devotional songs, and meditation videos. Find peace and spiritual connection through divine melodies.",
  keywords: ["spiritual music", "devotional songs", "meditation music", "bhajans", "mantras", "spiritual videos", "astrology music"],
  alternates: {
    canonical: "https://astrokiran.com/music",
  },
}

export default function MusicPage() {
  return (
    <div className="w-full max-w-full">
      <NavBar />
      <main className="w-full max-w-full min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <section className="pt-8 pb-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Spiritual Music & Videos
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Immerse yourself in divine melodies, devotional songs, and spiritual content that brings peace to your soul
            </p>
          </div>
        </section>

        {/* Music Player Component */}
        <MusicPlayer />
      </main>
      <Footer />
    </div>
  )
}
