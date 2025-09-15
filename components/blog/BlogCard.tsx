"use client";

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { BlogPostPreview } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostPreview;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const cardClasses = featured
    ? "relative bg-card/90 rounded-3xl shadow-lg overflow-hidden flex flex-col group md:transform md:hover:-translate-y-3 transition-all duration-300 md:hover:shadow-3xl border-2 border-orange-200/50 dark:border-orange-800/50"
    : "relative bg-card/90 rounded-2xl shadow-md overflow-hidden flex flex-col group md:transform md:hover:-translate-y-2 transition-all duration-300 md:hover:shadow-2xl border border-orange-200/30 dark:border-orange-800/30";

  const imageHeight = featured ? "h-56 lg:h-48" : "h-40 lg:h-36";
  const titleSize = featured ? "text-2xl" : "text-xl";

  return (
    <Link href={`/blog/${post.slug}`} className={cardClasses}>
      {/* Glow Effect - only on desktop */}
      <div className="hidden md:block absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-orange-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
      <div className="relative overflow-hidden">
        {post.heroImageUrl ? (
          <Image
            src={`${post.heroImageUrl}?w=800&h=400&fit=fill&q=85&fm=webp`}
            alt={`Cover image for ${post.title}`}
            width={800}
            height={400}
            className={`w-full ${imageHeight} object-cover md:transition-transform md:duration-300 md:group-hover:scale-105`}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={`w-full ${imageHeight} bg-gradient-to-br from-orange-400/30 to-purple-500/30 flex items-center justify-center`}>
            <div className="text-center text-foreground">
              <div className="text-5xl mb-3">✨</div>
              <p className="text-lg font-semibold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">Cosmic Article</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg backdrop-blur-sm">
              ✨ {post.tags[0]}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 lg:p-6 flex flex-col flex-grow">
        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1 sm:gap-2 bg-orange-100/50 dark:bg-orange-900/30 rounded-full px-2 sm:px-3 py-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
            <time dateTime={post.publishDate} className="font-medium">
              {format(new Date(post.publishDate), 'MMM dd, yyyy')}
            </time>
          </div>
          {post.author && (
            <div className="flex items-center gap-1 sm:gap-2 bg-purple-100/50 dark:bg-purple-900/30 rounded-full px-2 sm:px-3 py-1">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
              <span className="font-medium truncate max-w-[100px] sm:max-w-none">{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className={`${titleSize} lg:text-xl font-bold leading-tight mb-3 line-clamp-2 group-hover:scale-105 transition-transform duration-300`}>
          <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-orange-500 transition-all duration-300">
            {post.title}
          </span>
        </h2>

        {/* Excerpt */}
        <p className="text-muted-foreground flex-grow mb-4 line-clamp-2 lg:line-clamp-3 leading-relaxed text-sm lg:text-base">
          {post.excerpt}
        </p>

        {/* Read more link */}
        <div className="mt-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
            <span>Read More</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
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
      className="group relative block overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:-translate-y-2"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/30 via-purple-500/30 to-orange-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative h-96 w-full">
        {post.heroImageUrl ? (
          <Image
            src={`${post.heroImageUrl}?w=1200&h=600&fit=fill&q=85&fm=webp`}
            alt={`Cover image for ${post.title}`}
            width={1200}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            priority={true}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-orange-400/40 to-purple-500/60 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-8xl mb-6">✨</div>
              <p className="text-2xl font-bold">Featured Cosmic Article</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-xl backdrop-blur-sm">
              ✨ {post.tags[0]}
            </span>
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200 mb-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <Calendar className="h-4 w-4 text-orange-400" />
            <time dateTime={post.publishDate} className="font-medium">
              {format(new Date(post.publishDate), 'MMMM dd, yyyy')}
            </time>
          </div>
          {post.author && (
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <User className="h-4 w-4 text-purple-400" />
              <span className="font-medium">{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight group-hover:scale-105 transition-transform duration-300">
          <span className="bg-gradient-to-r from-white via-orange-200 to-purple-200 bg-clip-text text-transparent">
            {post.title}
          </span>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-200 text-lg line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Read more */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold rounded-full shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
          <span>Read Full Article</span>
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}