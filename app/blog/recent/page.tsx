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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <NavBar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-8 text-gray-900 dark:text-white">
              Latest Astrology Articles
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Stay updated with the latest astrological insights and revelations. Our recent articles cover the latest planetary movements, seasonal transitions, lunar phases, and their profound impact on your daily life. Discover how current celestial events influence your personal journey, relationships, career, and spiritual growth through expert vedic astrology analysis and practical guidance.
            </p>
            <div className="flex justify-center items-center gap-6 mt-12">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full px-6 py-3 border border-blue-200 dark:border-blue-800">
                <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                  Fresh Content Daily
                </span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full px-6 py-3 border border-blue-200 dark:border-blue-800">
                <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                  Current Events
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center mb-8 text-gray-900 dark:text-white">
            Recent Insights
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto">
            Discover the most recent astrological developments and their impact on your life. Our latest articles provide timely insights into current planetary transits,
            seasonal energy shifts, and practical guidance for navigating with wisdom and confidence.
          </p>
        </div>

        {/* Recent Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No recent articles available at the moment.</p>
            </div>
          ) : (
            recentPosts.map((post, index) => (
              <div key={post.slug} className="transform hover:scale-[1.02] transition-transform duration-200">
                <FeaturedBlogCard post={post} />
              </div>
            ))
          )}
        </div>

        {/* Additional Content Sections */}
        <section className="mt-24 space-y-16">
          {/* What's New Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
                What's New This Week
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Stay ahead of changes with our weekly updates on planetary movements, astrological forecasts, and spiritual guidance.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Lunar Phases</h4>
                <p className="text-gray-600 dark:text-gray-400">Track the moon's journey and its influence on emotions, intuition, and spiritual practices.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Planetary Transits</h4>
                <p className="text-gray-600 dark:text-gray-400">Understand how current planetary movements affect different aspects of your life and relationships.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Daily Guidance</h4>
                <p className="text-gray-600 dark:text-gray-400">Receive practical astrological advice for making informed decisions in your daily life.</p>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-12">
            <div className="text-center">
              <h3 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
                Trending Astrological Topics
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[
                  { topic: "Mercury Retrograde", color: "bg-blue-50 dark:bg-blue-900/20" },
                  { topic: "Full Moon Rituals", color: "bg-blue-50 dark:bg-blue-900/20" },
                  { topic: "Chakra Alignment", color: "bg-blue-50 dark:bg-blue-900/20" },
                  { topic: "Relationship Astrology", color: "bg-blue-50 dark:bg-blue-900/20" }
                ].map((item, index) => (
                  <div key={index} className={`${item.color} border border-blue-200 dark:border-blue-800 rounded-2xl p-6 text-center`}>
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">{item.topic}</h4>
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