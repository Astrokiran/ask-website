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
        <div key={i} className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-orange-200/30 dark:border-orange-800/30 overflow-hidden animate-pulse shadow-xl">
          <div className="h-48 bg-gradient-to-br from-orange-100/50 to-purple-100/50 dark:from-orange-900/30 dark:to-purple-900/30" />
          <div className="p-6 space-y-4">
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="h-6 w-1/2 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </div>
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="mx-auto w-32 h-32 bg-gradient-to-br from-orange-400/20 to-purple-500/20 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="relative text-6xl">✨</div>
      </div>
      <h3 className="text-2xl lg:text-3xl font-bold mb-4">
        <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
          No Cosmic Articles Found
        </span>
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto text-lg">
        The cosmic archives don't contain any articles matching your search. Try exploring different topics or clearing your filters.
      </p>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="text-center py-20">
      <div className="mx-auto w-32 h-32 bg-gradient-to-br from-red-400/20 to-orange-500/20 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl"></div>
        <div className="relative text-6xl">⚠️</div>
      </div>
      <h3 className="text-2xl lg:text-3xl font-bold mb-4">
        <span className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
          Cosmic Connection Lost
        </span>
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
      >
        <span>Reconnect to the Cosmos</span>
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