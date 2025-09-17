"use client";

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { FeaturedBlogCard } from '@/components/blog/BlogCard';
import { getBlogPosts, getFeaturedPosts, getBlogTags, getBlogArchives, getBlogAuthors, type BlogPostPreview, type PaginatedBlogResponse, type BlogFilters } from '@/lib/blog';

// Dynamic import for sidebar - not critical for initial load
const BlogSidebarToggle = dynamic(
  () => import('@/components/blog/BlogSidebarToggle').then(mod => ({ default: mod.BlogSidebarToggle })),
  {
    loading: () => <div className="w-80 h-48 bg-muted/30 animate-pulse rounded-lg" />,
    ssr: false
  }
);

const POSTS_PER_PAGE = 12;

export default function BlogListPage() {
  // State management
  const [blogData, setBlogData] = useState<PaginatedBlogResponse | null>(null);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPostPreview[]>([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string; count: number }>>([]);
  const [archives, setArchives] = useState<Array<{ year: number; months: Array<{ month: string; count: number; slug: string }> }>>([]);
  const [authors, setAuthors] = useState<Array<{ name: string; count: number; avatar?: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<BlogFilters>({});

  // Fetch blog posts with current filters
  const fetchBlogPosts = useCallback(async (page: number = 1, search: string = '', filters: BlogFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const combinedFilters = { ...filters };
      if (search) {
        combinedFilters.search = search;
      }

      const data = await getBlogPosts(page, POSTS_PER_PAGE, combinedFilters);
      setBlogData(data);
    } catch (e) {
      console.error("Failed to fetch blog posts:", e);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);

        // Fetch featured posts, tags, archives, authors, and initial blog posts in parallel
        const [featuredData, tagsData, archivesData, authorsData] = await Promise.all([
          getFeaturedPosts(),
          getBlogTags(),
          getBlogArchives(),
          getBlogAuthors(),
        ]);

        setFeaturedPosts(featuredData);
        setTags(tagsData);
        setArchives(archivesData);
        setAuthors(authorsData);

        // Fetch initial blog posts
        await fetchBlogPosts(1, '', {});
      } catch (e) {
        console.error("Failed to load initial data:", e);
        setError('Failed to load blog content. Please try again later.');
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [fetchBlogPosts]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchBlogPosts(1, query, filters);
  }, [filters, fetchBlogPosts]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: BlogFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchBlogPosts(1, searchQuery, newFilters);
  }, [searchQuery, fetchBlogPosts]);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchBlogPosts(page, searchQuery, filters);

    // Scroll to top of results
    const resultsSection = document.getElementById('blog-results');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchQuery, filters, fetchBlogPosts]);

  // Extract unique author names for search component
  const authorNames = authors.map(author => author.name);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <NavBar />

      {/* Header Section */}
      <section className="relative py-4 sm:py-6 lg:py-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-4 text-gray-900 dark:text-white">
              Astrology Blogs
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content - moved to top */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <BlogSidebarToggle
            tags={tags}
            authors={authors}
            archives={archives}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Search and Filters */}
            <div className="mb-12">
              <BlogSearch
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                tags={tags}
                authors={authorNames}
                isLoading={isLoading}
                placeholder="Search articles about astrology, horoscopes, palmistry..."
              />
            </div>

            {/* Results Section */}
            <div id="blog-results">
          {/* Results Header */}
          {blogData && !isLoading && (
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white">
                  {searchQuery || filters.tag || filters.author ? 'Search Results' : 'Latest Articles'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
                  {blogData.total === 0
                    ? 'No articles found'
                    : `Showing ${((blogData.currentPage - 1) * POSTS_PER_PAGE) + 1}-${Math.min(blogData.currentPage * POSTS_PER_PAGE, blogData.total)} of ${blogData.total} articles`
                  }
                </p>
              </div>

              {/* Sort options could be added here in the future */}
            </div>
          )}

          {/* Blog Grid */}
          <BlogGrid
            posts={blogData?.posts || []}
            isLoading={isLoading}
            error={error}
          />

          {/* Pagination */}
          {blogData && blogData.totalPages > 1 && (
            <BlogPagination
              currentPage={blogData.currentPage}
              totalPages={blogData.totalPages}
              hasNextPage={blogData.hasNextPage}
              hasPrevPage={blogData.hasPrevPage}
              onPageChange={handlePageChange}
            />
          )}
            </div>

            {/* Featured Posts Section */}
            {featuredPosts.length > 1 && (
              <section className="mt-24">
                <h2 className="text-4xl lg:text-5xl font-semibold mb-12 text-center text-gray-900 dark:text-white">
                  More Insights
                </h2>
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {featuredPosts.slice(1, 4).map((post) => (
                    <div key={post.slug} className="transition-transform duration-200 hover:scale-[1.02]">
                      <FeaturedBlogCard post={post} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Hero Content Section - moved below main content */}
      <section className="relative py-8 sm:py-12 lg:py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6">
              Discover expert astrology insights, vedic wisdom, horoscope tips, and spiritual guidance for your cosmic journey. Dive deep into the mysteries of the universe with our comprehensive guides.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6">
              Our astrology blog serves as your gateway to ancient Vedic knowledge and modern spiritual understanding. Explore in-depth articles on planetary movements, birth chart analysis, and cosmic influences that shape your destiny. Learn from certified astrologers who combine traditional wisdom with contemporary insights to guide you through life's challenges and opportunities.
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              From beginner-friendly explanations of zodiac signs to advanced techniques in predictive astrology, our content caters to seekers at every level of their spiritual journey. Discover practical remedies, understand planetary transits, and unlock the secrets of your personal horoscope through our carefully curated collection of astrology articles.
            </p>
          </div>

          {/* Featured Post Hero */}
          {featuredPosts.length > 0 && (
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-10 text-center text-gray-900 dark:text-white">
                Featured Astrology Article
              </h2>
              <FeaturedBlogCard post={featuredPosts[0]} />
            </div>
          )}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Main SEO Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Complete Astrology Knowledge Hub - Learn Vedic Wisdom
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Welcome to India's most comprehensive astrology blog, where ancient Vedic wisdom meets modern understanding. Our expert astrologers share profound insights on numerology calculation, daily horoscope predictions, kundli analysis, and palmistry readings. Whether you're exploring kanya rashi today, makar rashi predictions, or seeking guidance about tula rashi and meen rashi, our articles provide authentic astrological knowledge.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Discover the power of aaj ka panchang with detailed explanations of tithi, nakshatra, and muhurat timings. Learn about name numerology calculator techniques, understand your life path numbers, and explore the mystical world of hastrekha reading. Our blog covers everything from basic astrology concepts to advanced predictive techniques used by professional astrologers across India.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Explore Our Astrology Topics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Horoscope & Predictions</h4>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                      <li>• Daily Kanya Rashi Forecasts</li>
                      <li>• Makar Rashi Weekly Predictions</li>
                      <li>• Tula Rashi Love Compatibility</li>
                      <li>• Meen Rashi Career Guidance</li>
                      <li>• Monthly Horoscope Analysis</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Numerology & Calculations</h4>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                      <li>• Name Numerology Calculator Guide</li>
                      <li>• Life Path Number Analysis</li>
                      <li>• Destiny Number Predictions</li>
                      <li>• Lucky Number Calculations</li>
                      <li>• Business Name Numerology</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Palmistry & Reading</h4>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                      <li>• Complete Hastrekha Reading</li>
                      <li>• Heart Line Analysis</li>
                      <li>• Career Line Predictions</li>
                      <li>• Marriage Line Insights</li>
                      <li>• Money Line Indicators</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Panchang & Muhurat</h4>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                      <li>• Aaj Ka Panchang Updates</li>
                      <li>• Auspicious Timing Guide</li>
                      <li>• Festival Date Calculations</li>
                      <li>• Wedding Muhurat Selection</li>
                      <li>• Business Launch Timing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-8">
              <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Astrology Articles
                </h3>
                <div className="space-y-3">
                  <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    → Understanding Your Kanya Rashi Personality Traits
                  </a>
                  <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    → Complete Guide to Numerology Calculation Methods
                  </a>
                  <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    → Makar Rashi Career and Business Predictions
                  </a>
                  <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    → How to Use Name Numerology Calculator Effectively
                  </a>
                  <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    → Tula Rashi Love and Relationship Compatibility
                  </a>
                  <a href="#" className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    → Daily Panchang: Understanding Aaj Ka Panchang
                  </a>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Free Astrology Tools
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500">🎯</span>
                    <span className="text-gray-700 dark:text-gray-300">Free Kundli Generation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500">💕</span>
                    <span className="text-gray-700 dark:text-gray-300">Love Calculator & Compatibility</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500">🔢</span>
                    <span className="text-gray-700 dark:text-gray-300">Name Numerology Calculator</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500">👑</span>
                    <span className="text-gray-700 dark:text-gray-300">Daily Horoscope Predictions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500">✋</span>
                    <span className="text-gray-700 dark:text-gray-300">Palmistry Reading Guide</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500">📅</span>
                    <span className="text-gray-700 dark:text-gray-300">Aaj Ka Panchang Calendar</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Access all tools free and get personalized consultations with our certified astrologers
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Expert Astrology Consultation
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                  Get personalized guidance from our certified astrologers specializing in Vedic astrology, numerology, palmistry, and horoscope analysis.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">WhatsApp Consultation</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹51</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Detailed Kundli Report</span>
                    <span className="font-medium text-gray-900 dark:text-white">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Marriage Matching</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹99</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                  Start Consultation
                </button>
              </div>
            </div>
          </div>

          {/* Additional SEO Content */}
          <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Learn Astrology from Expert Practitioners
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
                Our astrology blog is authored by certified practitioners with decades of experience in Vedic astrology, numerology, palmistry, and spiritual guidance. Each article is carefully researched and validated according to traditional astrological principles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-orange-100 dark:bg-orange-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Comprehensive Guides
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Deep-dive articles on numerology calculation, kundli analysis, and rashi predictions with step-by-step explanations for beginners and advanced practitioners.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Daily Updates
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Fresh content on aaj ka panchang, daily horoscope for all rashis including kanya rashi today, makar rashi, tula rashi, and meen rashi predictions.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Practical Applications
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Real-world applications of astrology including name numerology calculator usage, hastrekha reading techniques, and marriage compatibility analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}