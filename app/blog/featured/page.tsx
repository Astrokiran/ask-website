"use client";

import { useEffect, useState } from 'react';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { FeaturedBlogCard } from '@/components/blog/BlogCard';
import { getFeaturedPosts, type BlogPostPreview } from '@/lib/blog';

export default function FeaturedBlogPage() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPostPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await getFeaturedPosts();
        setFeaturedPosts(posts);
      } catch (e) {
        console.error("Failed to load featured posts:", e);
        setError('Failed to load featured posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <NavBar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-8 text-gray-900 dark:text-white">
              Featured Astrology Articles
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Discover our handpicked collection of the most insightful and transformative astrology articles. These featured pieces offer deep wisdom on vedic astrology, spiritual guidance, horoscope analysis, and insights that illuminate your path to self-discovery. Each article has been carefully selected by our expert astrologers for its profound impact and practical applications in daily life.
            </p>
            <div className="flex justify-center items-center gap-6 mt-12">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full px-6 py-3 border border-blue-200 dark:border-blue-800">
                <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                  Expert Curated Content
                </span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full px-6 py-3 border border-blue-200 dark:border-blue-800">
                <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                  Premium Quality Articles
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
            Wisdom Collection
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto">
            Explore our carefully curated selection of astrology articles that blend ancient vedic wisdom with modern interpretations.
            From detailed birth chart analysis to planetary transit guidance, each article provides actionable insights for your spiritual journey.
          </p>
        </div>

        {/* Featured Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : featuredPosts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No featured articles available at the moment.</p>
            </div>
          ) : (
            featuredPosts.map((post, index) => (
              <div key={post.slug} className="transition-transform duration-200 hover:scale-[1.02]">
                <FeaturedBlogCard post={post} />
              </div>
            ))
          )}
        </div>

        {/* Additional Content Section */}
        <section className="mt-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-12">
          <div className="text-center">
            <h3 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
              Why These Articles Are Featured
            </h3>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Deep Insights</h4>
                <p className="text-gray-600 dark:text-gray-400">Each article provides profound astrological insights backed by years of vedic knowledge and practical experience.</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Expert Validation</h4>
                <p className="text-gray-600 dark:text-gray-400">All featured content is reviewed and approved by our certified astrologers and spiritual guides.</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Transformative Impact</h4>
                <p className="text-gray-600 dark:text-gray-400">These articles have helped thousands of readers gain clarity and direction in their spiritual journey.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}