"use client";

import { useEffect, useState } from 'react';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { FeaturedBlogCard } from '@/components/blog/BlogCard';
import { getBlogPosts, type BlogPostPreview, type PaginatedBlogResponse } from '@/lib/blog';

export default function RecentBlogPage() {
  const [recentPosts, setRecentPosts] = useState<BlogPostPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecentPosts = async () => {
      try {
        setIsLoading(true);
        // Get recent posts sorted by publication date
        const data = await getBlogPosts(1, 20, { sortBy: 'publishedAt', sortOrder: 'desc' });
        setRecentPosts(data.posts);
      } catch (e) {
        console.error("Failed to load recent posts:", e);
        setError('Failed to load recent posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic Background Effects */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-purple-50/20 dark:from-orange-950/10 dark:via-transparent dark:to-purple-950/5"></div>
      <div className="hidden lg:block absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(251,146,60,0.08)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_40%,rgba(251,146,60,0.04)_0%,transparent_50%)]"></div>

      <NavBar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
              <span className="bg-gradient-to-r from-orange-500 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                Latest Astrology Articles
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Stay updated with the freshest cosmic insights and astrological revelations. Our recent articles cover the latest planetary movements, seasonal transitions, lunar phases, and their profound impact on your daily life. Discover how current celestial events influence your personal journey, relationships, career, and spiritual growth through expert vedic astrology analysis and practical guidance.
            </p>
            <div className="flex justify-center items-center gap-6 mt-12">
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full px-6 py-3 border border-green-300/30">
                <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
                  🆕 Fresh Content Daily
                </span>
              </div>
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full px-6 py-3 border border-blue-300/30">
                <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                  🌟 Current Cosmic Events
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              🌙 Fresh Cosmic Insights
            </span>
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            Discover the most recent astrological developments and their impact on your life. Our latest articles provide timely insights into current planetary transits,
            seasonal energy shifts, and practical guidance for navigating the cosmic currents with wisdom and confidence.
          </p>
        </div>

        {/* Recent Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-muted rounded-xl mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No recent articles available at the moment.</p>
            </div>
          ) : (
            recentPosts.map((post, index) => (
              <div key={post.slug} className="transform hover:scale-105 transition-transform duration-500">
                <FeaturedBlogCard post={post} />
              </div>
            ))
          )}
        </div>

        {/* Additional Content Sections */}
        <section className="mt-24 space-y-16">
          {/* What's New Section */}
          <div className="bg-gradient-to-r from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-green-950/20 rounded-3xl p-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                What's New This Week
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stay ahead of cosmic changes with our weekly updates on planetary movements, astrological forecasts, and spiritual guidance.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🌙</div>
                <h4 className="text-xl font-semibold mb-3 text-green-600 dark:text-green-400">Lunar Phases</h4>
                <p className="text-muted-foreground">Track the moon's journey and its influence on emotions, intuition, and spiritual practices.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🪐</div>
                <h4 className="text-xl font-semibold mb-3 text-emerald-600 dark:text-emerald-400">Planetary Transits</h4>
                <p className="text-muted-foreground">Understand how current planetary movements affect different aspects of your life and relationships.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⭐</div>
                <h4 className="text-xl font-semibold mb-3 text-teal-600 dark:text-teal-400">Daily Guidance</h4>
                <p className="text-muted-foreground">Receive practical astrological advice for making informed decisions in your daily life.</p>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-blue-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-blue-950/20 rounded-3xl p-12">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Trending Astrological Topics
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[
                  { topic: "Mercury Retrograde", emoji: "☿️", color: "bg-blue-100 dark:bg-blue-900/30" },
                  { topic: "Full Moon Rituals", emoji: "🌕", color: "bg-indigo-100 dark:bg-indigo-900/30" },
                  { topic: "Chakra Alignment", emoji: "🔮", color: "bg-purple-100 dark:bg-purple-900/30" },
                  { topic: "Relationship Astrology", emoji: "💕", color: "bg-pink-100 dark:bg-pink-900/30" }
                ].map((item, index) => (
                  <div key={index} className={`${item.color} rounded-2xl p-6 text-center`}>
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <h4 className="font-semibold text-foreground">{item.topic}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}