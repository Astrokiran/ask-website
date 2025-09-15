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
    <div className="min-h-screen bg-background">
      {/* Dynamic Background Effects - desktop only */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-purple-50/20 dark:from-orange-950/10 dark:via-transparent dark:to-purple-950/5"></div>
      <div className="hidden lg:block absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(251,146,60,0.08)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_40%,rgba(251,146,60,0.04)_0%,transparent_50%)]"></div>
      <div className="hidden lg:block absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.03)_0%,transparent_50%)]"></div>

      {/* Floating Elements - desktop only with reduced animation */}
      <div className="hidden lg:block absolute top-20 left-10 w-3 h-3 bg-orange-400/50 rounded-full opacity-40"></div>
      <div className="hidden lg:block absolute top-40 right-20 w-4 h-4 bg-purple-400/50 rounded-full opacity-30"></div>
      <div className="hidden lg:block absolute bottom-20 left-20 w-2 h-2 bg-orange-300/50 rounded-full opacity-30"></div>

      <NavBar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
              <span className="bg-gradient-to-r from-orange-500 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                Astrology Blogs
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-6">
              Discover expert astrology insights, vedic wisdom, horoscope tips, and spiritual guidance for your cosmic journey. Dive deep into the mysteries of the universe with our comprehensive guides.
            </p>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-6">
              Our astrology blog serves as your gateway to ancient Vedic knowledge and modern spiritual understanding. Explore in-depth articles on planetary movements, birth chart analysis, and cosmic influences that shape your destiny. Learn from certified astrologers who combine traditional wisdom with contemporary insights to guide you through life's challenges and opportunities.
            </p>
            <p className="text-base text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              From beginner-friendly explanations of zodiac signs to advanced techniques in predictive astrology, our content caters to seekers at every level of their spiritual journey. Discover practical remedies, understand planetary transits, and unlock the secrets of your personal horoscope through our carefully curated collection of astrology articles.
            </p>
          </div>

          {/* Featured Post Hero */}
          {featuredPosts.length > 0 && (
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-10 text-center">
                <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                  ✨ Featured Astrology Article
                </span>
              </h2>
              <FeaturedBlogCard post={featuredPosts[0]} />
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
                <h2 className="text-3xl lg:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                    {searchQuery || filters.tag || filters.author ? 'Search Results' : 'Latest Cosmic Articles'}
                  </span>
                </h2>
                <p className="text-muted-foreground mt-3 text-lg">
                  {blogData.total === 0
                    ? 'No articles found in the cosmic archives'
                    : `Showing ${((blogData.currentPage - 1) * POSTS_PER_PAGE) + 1}-${Math.min(blogData.currentPage * POSTS_PER_PAGE, blogData.total)} of ${blogData.total} cosmic articles`
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
                <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-center">
                  <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                    ✨ More Cosmic Insights
                  </span>
                </h2>
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {featuredPosts.slice(1, 4).map((post) => (
                    <div key={post.slug} className="transform hover:scale-105 transition-transform duration-500">
                      <FeaturedBlogCard post={post} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}