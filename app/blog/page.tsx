"use client"

import { useEffect, useState } from 'react';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { createClient, type Entry } from 'contentful';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

/*
NOTE: You need to install the following packages for this component to work:
npm install contentful date-fns lucide-react
*/


// --- 1. SETUP CONTENTFUL CLIENT ---
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
});

// --- 2. DEFINE TYPES FOR THE BLOG POST PREVIEW ---
interface BlogPostPreview {
  title: string;
  slug: string;
  heroImageUrl: string;
  excerpt: string;
  publishDate: string;
}

// --- 3. HELPER FUNCTION TO FETCH ALL POSTS ---
const getBlogPosts = async (): Promise<BlogPostPreview[]> => {
  const response = await client.getEntries({
    content_type: 'blogpost', // Match the ID from your Contentful model
    order: ['-fields.publishDate'],
    include: 1 // Include linked entries like the author
  });

const getField = (obj: any, path: string[], defaultValue: any = null) =>
    path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);


  return response.items.map((item: Entry<any>) => {
    const imageUrl = (item.fields.heroImage as any)?.fields?.file?.url;
    return {
      // 👈 THE FIX IS APPLIED HERE
      title: item.fields.title as string,
      slug: item.fields.slug as string,
      heroImageUrl: imageUrl ? `https:${imageUrl}` : '',
      excerpt: item.fields.excerpt as string,
      publishDate: item.fields.publishDate as string,
    };
  });
};


// --- 4. THE MAIN BLOG LISTING PAGE COMPONENT ---
export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
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

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><p className="text-xl text-slate-500">Loading posts...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen"><p className="text-xl text-red-500 font-semibold">{error}</p></div>;
  }

  return (
    <>
      <NavBar />
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">From the Blog</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Insights, stories, and guidance on your cosmic journey. 🚀
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`} 
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={`${post.heroImageUrl}?w=600&h=400&fit=cover&q=75&fm=webp`}
                  alt={`Cover image for ${post.title}`}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-slate-500 mb-2">
                  {format(new Date(post.publishDate), 'MMMM dd, yyyy')}
                </p>
                <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors duration-200">
                  {post.title}
                </h2>
                <p className="text-slate-600 flex-grow mb-6">
                  {post.excerpt}
                </p>
                <div className="mt-auto font-semibold text-indigo-600 inline-flex items-center">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
}