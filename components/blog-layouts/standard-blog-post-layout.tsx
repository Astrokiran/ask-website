import React from 'react';
import Head from 'next/head'; // For SEO metadata
import Image from 'next/image'; // For optimized images
import { CalendarDays, UserCircle, Tag } from 'lucide-react'; // Example icons

// Assuming you have a types file like this:
// import { StandardBlogPostData } from '@/types/blog';

// Temporary placeholder for the type, replace with actual import
export interface BlogAuthor {
  name: string;
  avatarUrl?: string;
}
export interface BlogSeoData {
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
}
export interface StandardBlogPostData {
  id: string;
  slug: string;
  title: string;
  featuredImageUrl?: string;
  publishDate: string;
  lastUpdatedDate?: string;
  author?: BlogAuthor;
  category?: string;
  tags?: string[];
  introduction: string;
  mainContentHtml: string;
  conclusion?: string;
  seo?: BlogSeoData;
}

interface StandardBlogPostLayoutProps {
  post: StandardBlogPostData;
}

export function StandardBlogPostLayout({ post }: StandardBlogPostLayoutProps) {
  const {
    title,
    featuredImageUrl,
    publishDate,
    author,
    category,
    tags,
    introduction,
    mainContentHtml,
    conclusion,
    seo,
  } = post;

  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Head>
        <title>{seo?.metaTitle || title}</title>
        {seo?.metaDescription && <meta name="description" content={seo.metaDescription} />}
        {/* Add other SEO tags like OpenGraph here */}
        {seo?.ogImageUrl && <meta property="og:image" content={seo.ogImageUrl} />}
      </Head>
      <article className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg my-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4 mb-4">
            {author && (
              <div className="flex items-center">
                <UserCircle size={18} className="mr-1" />
                <span>{author.name}</span>
              </div>
            )}
            <div className="flex items-center">
              <CalendarDays size={18} className="mr-1" />
              <time dateTime={publishDate}>{formattedDate}</time>
            </div>
            {category && (
              <div className="flex items-center">
                {/* Consider a category icon */}
                <span>{category}</span>
              </div>
            )}
          </div>
          {featuredImageUrl && (
            <div className="relative w-full h-64 md:h-96 mb-6 rounded-md overflow-hidden">
              <Image src={featuredImageUrl} alt={title} layout="fill" objectFit="cover" />
            </div>
          )}
        </header>

        {introduction && <p className="text-lg text-gray-700 mb-6 italic">{introduction}</p>}

        <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: mainContentHtml }} />

        {conclusion && <p className="text-lg text-gray-700 mt-8 pt-6 border-t border-gray-200">{conclusion}</p>}

        {tags && tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center"><Tag size={16} className="mr-1" /> Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}

// Note on `dangerouslySetInnerHTML`:
// This is used for `mainContentHtml`. Ensure that the HTML content
// is sanitized on the server-side or comes from a trusted source
// to prevent XSS vulnerabilities. For more complex content, consider
// using a structured content format (e.g., JSON) and rendering
// React components, or a Markdown parser like 'react-markdown'.