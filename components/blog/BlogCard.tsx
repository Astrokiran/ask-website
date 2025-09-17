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
    ? "relative bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col group transition-all duration-200 hover:shadow-md hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
    : "relative bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col group transition-all duration-200 hover:shadow-md hover:scale-[1.02] border border-gray-200 dark:border-gray-700";

  const imageHeight = featured ? "h-56 lg:h-48" : "h-40 lg:h-36";
  const titleSize = featured ? "text-2xl" : "text-xl";

  return (
    <Link href={`/blog/${post.slug}`} className={cardClasses}>
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
          <div className={`w-full ${imageHeight} bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p className="text-lg font-medium">Article</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-orange-600 text-white shadow-sm">
              {post.tags[0]}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 lg:p-6 flex flex-col flex-grow">
        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-2 sm:px-3 py-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400" />
            <time dateTime={post.publishDate} className="font-medium">
              {format(new Date(post.publishDate), 'MMM dd, yyyy')}
            </time>
          </div>
          {post.author && (
            <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-2 sm:px-3 py-1">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400" />
              <span className="font-medium truncate max-w-[100px] sm:max-w-none">{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className={`${titleSize} lg:text-xl font-semibold leading-tight mb-3 line-clamp-2 text-gray-900 dark:text-white`}>
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 flex-grow mb-4 line-clamp-2 lg:line-clamp-3 leading-relaxed text-sm lg:text-base">
          {post.excerpt}
        </p>

        {/* Read more link */}
        <div className="mt-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02]">
            <span>Read More</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
      className="group relative block overflow-hidden rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
    >

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
          <div className="h-full w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p className="text-2xl font-semibold">Featured Article</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-orange-600 text-white shadow-sm">
              {post.tags[0]}
            </span>
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200 mb-4">
          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
            <Calendar className="h-4 w-4 text-gray-300" />
            <time dateTime={post.publishDate} className="font-medium">
              {format(new Date(post.publishDate), 'MMMM dd, yyyy')}
            </time>
          </div>
          {post.author && (
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
              <User className="h-4 w-4 text-gray-300" />
              <span className="font-medium">{post.author.name}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-semibold mb-4 leading-tight text-white">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-200 text-lg line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Read more */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-orange-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02]">
          <span>Read Full Article</span>
          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}