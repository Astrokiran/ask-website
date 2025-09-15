"use client";

import { BlogCard } from './BlogCard';
import { BlogPostPreview } from '@/lib/blog';

interface BlogGridProps {
  posts: BlogPostPreview[];
  isLoading?: boolean;
  error?: string | null;
}

function BlogGridSkeleton() {
  return (
    <div className="grid gap-8 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse shadow-sm">
          <div className="h-48 bg-gray-200 dark:bg-gray-700" />
          <div className="p-6 space-y-4">
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="mx-auto w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-8">
        <div className="text-4xl text-gray-400">📄</div>
      </div>
      <h3 className="text-2xl lg:text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
        No Articles Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
        No articles match your search criteria. Try exploring different topics or clearing your filters.
      </p>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="text-center py-20">
      <div className="mx-auto w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-8">
        <div className="text-4xl text-red-500">⚠️</div>
      </div>
      <h3 className="text-2xl lg:text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
        Connection Error
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8 text-lg">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02]"
      >
        <span>Try Again</span>
      </button>
    </div>
  );
}

export function BlogGrid({ posts, isLoading = false, error = null }: BlogGridProps) {
  if (error) {
    return <ErrorState error={error} />;
  }

  if (isLoading) {
    return <BlogGridSkeleton />;
  }

  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-8 md:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}