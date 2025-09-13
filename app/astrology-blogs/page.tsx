"use client"

import { useEffect, useState } from 'react';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { createClient, type Entry } from 'contentful';
import { format } from 'date-fns';
import { Search, Eye, LayoutGrid } from 'lucide-react';

/*
NOTE: You need to install the following packages for this component to work:
npm install contentful date-fns lucide-react
*/

// --- 1. SETUP CONTENTFUL CLIENT ---
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
});

// --- 2. DEFINE TYPES FOR THE BLOG POST PREVIEW (with author) ---
interface BlogPostPreview {
  title: string;
  slug: string;
  heroImageUrl: string;
  publishDate: string;
  authorName: string; // Added author's name
  views: number; // Added for mock view count
}

// --- 3. HELPER FUNCTION TO FETCH ALL POSTS ---
const getBlogPosts = async (): Promise<BlogPostPreview[]> => {
  const response = await client.getEntries({
    content_type: 'blogpost',
    order: ['-fields.publishDate'],
    include: 2 // Include linked entries up to 2 levels deep to get author info
  });

  return response.items.map((item: Entry<any>) => {
    const imageUrl = (item.fields.heroImage as any)?.fields?.file?.url;
    // Safely access author name from linked entry
    const authorName = (item.fields.author as any)?.fields?.name || 'Astrotalk Team';
    
    return {
      title: item.fields.title as string,
      slug: item.fields.slug as string,
      heroImageUrl: imageUrl ? `https:${imageUrl}` : 'https://via.placeholder.com/600x400', // Fallback image
      publishDate: item.fields.publishDate as string,
      authorName,
      views: Math.floor(Math.random() * 4000) + 100, // Mock view count for display
    };
  });
};

// --- Sub-components for better organization ---

// Categories Sidebar Component
const CategoriesSidebar = () => {
    // In a real application, these would be fetched dynamically
    const categories = ['Tarot', 'Vastu', 'Vedic', 'Kundli', 'Sports', 'Transits', 'Festivals', 'Business', 'Gemstones'];
    return (
        <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
            <div className="bg-white p-5 rounded-lg border border-gray-200 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <LayoutGrid className="h-5 w-5 mr-3 text-yellow-500" />
                    Categories
                </h3>
                <ul className="space-y-3">
                    {categories.map((category) => (
                        <li key={category}>
                            <a href="#" className="block text-gray-600 hover:text-yellow-600 transition-colors duration-200">
                                {category}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

// Search Bar Component
const SearchBar = ({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (query: string) => void }) => {
    return (
        <div className="relative mb-8">
            <input
                type="text"
                placeholder="Let's find what you're looking for..."
                className="w-full p-4 pl-12 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
    );
};

// Blog Post Card Component
const BlogPostCard = ({ post }: { post: BlogPostPreview }) => (
    <Link
        href={`/blog/${post.slug}`}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
    >
        <div className="relative">
            <img
                src={`${post.heroImageUrl}?w=600&h=400&fit=crop&q=75`}
                alt={`Cover image for ${post.title}`}
                className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full flex items-center backdrop-blur-sm">
                <Eye className="h-3 w-3 mr-1" />
                {post.views}
            </div>
        </div>
        <div className="p-4">
            <h2 className="text-md font-bold text-gray-800 mb-3 leading-tight group-hover:text-yellow-600 transition-colors duration-200">
                {post.title}
            </h2>
            <div className="text-xs text-gray-500 flex justify-between items-center">
                <span>{post.authorName}</span>
                <span>{format(new Date(post.publishDate), 'MMMM dd, yyyy')}</span>
            </div>
        </div>
    </Link>
);


// --- 4. THE MAIN BLOG LISTING PAGE COMPONENT ---
export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedPosts = await getBlogPosts();
        setPosts(fetchedPosts);
      } catch (e) {
        console.error("Failed to fetch blog posts:", e);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filter posts based on search query
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-20"><p className="text-lg text-slate-500">Loading posts...</p></div>;
    }

    if (error) {
      return <div className="text-center py-20"><p className="text-lg text-red-500 font-semibold">{error}</p></div>;
    }
    
    if (filteredPosts.length === 0) {
        return <div className="text-center py-20"><p className="text-lg text-slate-500">No posts found matching your search.</p></div>
    }

    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    );
  };

  return (
    <>
      <NavBar />
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            {/* Left Sidebar */}
            <CategoriesSidebar />
            
            {/* Right Content Area */}
            <main className="w-full md:w-3/4 lg:w-4/5">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              {renderContent()}
            </main>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}