"use client";

import { useEffect, useState, useCallback } from 'react';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { FeaturedBlogCard } from '@/components/blog/BlogCard';
import { BlogSidebarToggle } from '@/components/blog/BlogSidebarToggle';
import { getBlogPosts, getFeaturedPosts, getBlogTags, getBlogArchives, getBlogAuthors, type BlogPostPreview, type PaginatedBlogResponse, type BlogFilters } from '@/lib/blog';

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
      <NavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-background to-purple-50 dark:from-indigo-950 dark:via-background dark:to-purple-950 py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight mb-6">
              Astrology Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover expert astrology insights, vedic wisdom, horoscope tips, and spiritual guidance for your cosmic journey. Dive deep into the mysteries of the universe with our comprehensive guides.
            </p>
          </div>

          {/* Featured Post Hero */}
          {featuredPosts.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Featured Article</h2>
              <FeaturedBlogCard post={featuredPosts[0]} />
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {searchQuery || filters.tag || filters.author ? 'Search Results' : 'Latest Articles'}
                </h2>
                <p className="text-muted-foreground mt-1">
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
              <section className="mt-20">
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">More Featured Articles</h2>
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {featuredPosts.slice(1, 4).map((post) => (
                    <div key={post.slug} className="transform hover:scale-105 transition-transform duration-300">
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