"use client";

import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { BlogPostPreview } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostPreview;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const cardClasses = featured
    ? "bg-card rounded-2xl shadow-xl overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border border-border"
    : "bg-card rounded-xl shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl border border-border";

  const imageHeight = featured ? "h-64" : "h-48";
  const titleSize = featured ? "text-2xl" : "text-xl";

  return (
    <Link href={`/blog/${post.slug}`} className={cardClasses}>
      <div className="relative overflow-hidden">
        <img
          src={`${post.heroImageUrl}?w=800&h=400&fit=cover&q=75&fm=webp`}
          alt={`Cover image for ${post.title}`}
          className={`w-full ${imageHeight} object-cover transition-transform duration-300 group-hover:scale-105`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              {post.tags[0]}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Meta information */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.publishDate}>
              {format(new Date(post.publishDate), 'MMM dd, yyyy')}
            </time>
          </div>
          {post.author && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className={`${titleSize} font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2`}>
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-muted-foreground flex-grow mb-6 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Read more link */}
        <div className="mt-auto font-semibold text-primary inline-flex items-center group-hover:text-primary/80 transition-colors duration-200">
          Read More
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

// Featured blog card for hero sections
export function FeaturedBlogCard({ post }: { post: BlogPostPreview }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl"
    >
      <div className="relative h-96 w-full">
        <img
          src={`${post.heroImageUrl}?w=1200&h=600&fit=cover&q=80&fm=webp`}
          alt={`Cover image for ${post.title}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
              {post.tags[0]}
            </span>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.publishDate}>
              {format(new Date(post.publishDate), 'MMMM dd, yyyy')}
            </time>
          </div>
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.pictureUrl && (
                <img
                  src={`${post.author.pictureUrl}?w=32&h=32&fit=faces&q=80&fm=webp`}
                  alt={post.author.name}
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span>{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-3 leading-tight group-hover:text-gray-200 transition-colors">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-200 text-lg line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Read more */}
        <div className="inline-flex items-center text-white font-semibold group-hover:text-gray-200 transition-colors">
          Read Full Article
          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}