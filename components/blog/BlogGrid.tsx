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
        <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
          <div className="h-48 bg-muted" />
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
    <div className="text-center py-16">
      <div className="mx-auto w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-16 h-16 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No blog posts found</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        We couldn't find any blog posts matching your criteria. Try adjusting your search or filters.
      </p>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-32 h-32 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-16 h-16 text-destructive"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">Oops! Something went wrong</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try Again
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
    <div className="grid gap-8 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}