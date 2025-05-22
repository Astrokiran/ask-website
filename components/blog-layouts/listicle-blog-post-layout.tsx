import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { CalendarDays, UserCircle, Tag, CheckCircle, Bookmark } from 'lucide-react';


export interface BlogAuthor {
  name: string;
  avatarUrl?: string;
}
export interface BlogSeoData {
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
}
export interface ContentListItem {
  id: string;
  title: string;
  contentHtml: string;
  imageUrl?: string;
}
export interface ListiclePostData {
  id: string;
  slug: string;
  title: string;
  featuredImageUrl?: string;
  publishDate: string;
  lastUpdatedDate?: string;
  author?: BlogAuthor;
  category?: string;
  tags?: string[];
  introduction?: string;
  items: ContentListItem[];
  conclusion?: string;
  seo?: BlogSeoData;
}

interface ListicleBlogPostLayoutProps {
  post: ListiclePostData;
}

export function ListicleBlogPostLayout({ post }: ListicleBlogPostLayoutProps) {
  const {
    title,
    featuredImageUrl,
    publishDate,
    author,
    category,
    tags,
    introduction,
    items,
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
        {seo?.ogImageUrl && <meta property="og:image" content={seo.ogImageUrl} />}
      </Head>
      <article className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg my-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <div className="flex flex-wrap justify-center items-center text-sm text-gray-500 space-x-4 mb-4">
            {author && <div className="flex items-center"><UserCircle size={18} className="mr-1" /><span>{author.name}</span></div>}
            <div className="flex items-center"><CalendarDays size={18} className="mr-1" /><time dateTime={publishDate}>{formattedDate}</time></div>
            {category && (
              <div className="flex items-center">
                <Bookmark size={18} className="mr-1" />
                <span>{category}</span>
              </div>
            )}
          </div>
          {featuredImageUrl && (
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-md">
              <Image src={featuredImageUrl} alt={title} layout="fill" objectFit="cover" />
            </div>
          )}
        </header>

        {introduction && <p className="text-xl text-gray-600 mb-12 text-center leading-relaxed italic">{introduction}</p>}

        <div className="space-y-8">
          {items.map((item, index) => (
            <section
              key={item.id}
              className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1.5"
            >
              <h2 className="text-2xl font-semibold text-orange-600 mb-4 flex items-center">
                <CheckCircle size={24} className="mr-3 text-orange-500" />
                {item.title}
              </h2>
              {item.imageUrl && (
                <div className="relative w-full h-48 md:h-60 mb-4 rounded-lg overflow-hidden shadow-sm">
                  <Image src={item.imageUrl} alt={item.title} layout="fill" objectFit="cover" />
                </div>
              )}
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: item.contentHtml }}
              />
            </section>
          ))}
        </div>

        {conclusion && (
          <p className="text-xl text-gray-600 mt-12 pt-8 border-t border-gray-300 text-center leading-relaxed">
            {conclusion}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-300 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-3 inline-flex items-center"><Tag size={18} className="mr-2" /> Tags:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {tags.map(tag => (
                <span key={tag} className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors cursor-pointer">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}

// Note on `dangerouslySetInnerHTML`:
// Used for `item.contentHtml`. Ensure HTML is sanitized or from a trusted source.
// Consider structured content or Markdown for safer and more flexible rendering.