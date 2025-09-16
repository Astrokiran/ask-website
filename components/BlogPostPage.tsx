"use client"

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from 'contentful';
import { documentToReactComponents, type Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, type Document } from '@contentful/rich-text-types';
import { format } from 'date-fns';
import { ArrowUpRight, BookOpen, TrendingUp, LayoutGrid } from 'lucide-react';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import Image from 'next/image';

// --- 1. UTILITIES & SETUP ---

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
});

// --- 2. TYPESCRIPT INTERFACES ---

interface Author {
  name: string;
  pictureUrl: string;
}

interface BlogPost {
  title: string;
  slug: string;
  heroImageUrl: string;
  excerpt: string;
  publishDate: string;
  author: Author;
  content: Document;
}

interface Heading {
  text: string;
  slug: string;
  level: number;
}

interface BlogPostPageProps {
  slug: string;
}

// --- 3. OPTIMIZED CSS ANIMATIONS ---
const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500";
const fadeIn = "animate-in fade-in duration-300";
const stagger = "animate-in fade-in slide-in-from-bottom-2 duration-700";

// --- 4. LIGHTWEIGHT COMPONENTS ---

const ReadingProgressBar = () => {
  const [width, setWidth] = useState(0);

  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    setWidth(totalHeight > 0 ? (scrollPosition / totalHeight) * 100 : 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-1 bg-gray-200 dark:bg-gray-800">
      <div
        className="h-1 bg-blue-600 transition-all duration-100 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

const LeftSidebar = ({ headings, activeHeading }: { headings: Heading[], activeHeading: string }) => {
    const trendingPosts = [
      { title: 'Understanding Your Saturn Return', slug: '#' },
      { title: 'The Power of Birth Charts', slug: '#' },
      { title: 'Mars Retrograde: What to Expect', slug: '#' }
    ];
    const categories = ['Vedic', 'Tarot', 'Numerology', 'Vastu', 'Festivals'];

    return (
        <aside className={`hidden lg:block w-full lg:w-1/4 lg:flex-shrink-0 ${fadeIn}`}>
            <div className="sticky top-28 space-y-8">
                {/* Table of Contents */}
                {headings.length > 1 && (
                    <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                            <BookOpen size={20} className="mr-3 text-blue-600"/>
                            <span>In this Article</span>
                        </h3>
                        <ul className="space-y-2.5">
                            {headings.map((heading) => (
                                <li key={heading.slug}>
                                    <a
                                      href={`#${heading.slug}`}
                                      className={`transition-colors duration-200 text-sm hover:text-blue-600 ${
                                        activeHeading === heading.slug ? 'font-semibold text-blue-600' : 'text-gray-600 dark:text-gray-400'
                                      }`}
                                    >
                                        {heading.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Trending Posts */}
                <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                        <TrendingUp size={20} className="mr-3 text-blue-600"/>
                        <span>Trending Now</span>
                    </h3>
                    <ul className="space-y-3">
                        {trendingPosts.map(post => (
                           <li key={post.title}>
                             <a href={post.slug} className="group flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                               {post.title}
                               <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                             </a>
                           </li>
                        ))}
                    </ul>
                </div>

                {/* Categories */}
                <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                        <LayoutGrid size={20} className="mr-3 text-blue-600"/>
                        <span>Categories</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                           <a
                             key={cat}
                             href="#"
                             className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors rounded-full px-3 py-1.5 font-medium"
                           >
                             {cat}
                           </a>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

const MobileTableOfContents = ({ headings, activeHeading }: { headings: Heading[], activeHeading: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (headings.length <= 1) return null;

    return (
        <>
            {/* Mobile TOC Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-[1.02]"
            >
                <BookOpen size={20} />
            </button>

            {/* Mobile TOC Modal */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
                    />

                    {/* Modal */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 border-t border-gray-200 dark:border-gray-700 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center">
                                <BookOpen size={20} className="mr-3 text-blue-600"/>
                                <span>In this Article</span>
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                <span className="text-lg">×</span>
                            </button>
                        </div>

                        <ul className="space-y-3">
                            {headings.map((heading) => (
                                <li key={heading.slug}>
                                    <a
                                        href={`#${heading.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className={`block p-3 rounded-xl transition-colors duration-200 ${
                                            activeHeading === heading.slug
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-semibold border-l-4 border-blue-600'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                        }`}
                                    >
                                        {heading.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </>
    );
};

// --- 5. DATA FETCHING ---
const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
    const response = await client.getEntries({
        content_type: 'blogpost',
        'fields.slug': slug,
        include: 3,
    });
    if (response.items.length === 0) return null;
    const post = response.items[0];
    const getField = (obj: any, path: string[], defaultValue: any = null) =>
      path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);

    const authorEntry = getField(post, ['fields', 'author']);
    const heroImageEntry = getField(post, ['fields', 'heroImage']);

    let authorPictureUrl = '';
    if (authorEntry && authorEntry.fields && authorEntry.fields.picture) {
        const pictureAsset = authorEntry.fields.picture;
        if (pictureAsset.fields && pictureAsset.fields.file && pictureAsset.fields.file.url) {
            authorPictureUrl = `https:${pictureAsset.fields.file.url}`;
        }
    }

    return {
        title: post.fields.title as string,
        slug: post.fields.slug as string,
        heroImageUrl: getField(heroImageEntry, ['fields', 'file', 'url']) ? `https:${getField(heroImageEntry, ['fields', 'file', 'url'])}` : '',
        excerpt: post.fields.excerpt as string,
        publishDate: post.fields.publishDate as string,
        author: {
            name: getField(authorEntry, ['fields', 'name']) || 'Unknown Author',
            pictureUrl: authorPictureUrl,
        },
        content: post.fields.content as Document,
    };
};

// --- 6. MAIN PAGE COMPONENT ---

export default function BlogPostPage({ slug }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const articleRef = useRef<HTMLElement>(null);

  // Data fetching effect
  useEffect(() => {
    if (!slug) {
        setIsLoading(false);
        setError("No blog post specified.");
        return;
    };
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const fetchedPost = await getBlogPost(slug);
        if (fetchedPost) {
            setPost(fetchedPost);
        } else {
            setError('Blog post not found.');
        }
      } catch (e) {
        console.error("Failed to fetch post:", e);
        setError("Failed to load the post.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // Headings extraction and scroll-spy effect
  useEffect(() => {
    if (!post?.content || !articleRef.current) return;

    const extractedHeadings = post.content.content
      .filter(node => node.nodeType === BLOCKS.HEADING_2)
      .map(node => {
        const text = (node.content[0] as any).value;
        return { text, slug: slugify(text), level: 2 };
      });
    setHeadings(extractedHeadings);

    document.documentElement.style.scrollBehavior = 'smooth';

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveHeading(entry.target.id);
            }
        });
    }, { rootMargin: '-20% 0px -80% 0px', threshold: 0 });

    const headingElements = articleRef.current.querySelectorAll('h2');
    headingElements.forEach(el => observer.observe(el));

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      headingElements.forEach(el => observer.unobserve(el));
    };
  }, [post]);

  // Rich Text Rendering Options
  const richTextOptions: Options = {
    renderNode: {
      [BLOCKS.HEADING_2]: (node, children) => {
        const text = Array.isArray(children) ? (children[0] as string) : '';
        const id = slugify(text);
        return (
          <h2 id={id} className="text-3xl lg:text-4xl font-semibold mt-12 mb-6 scroll-mt-28 text-gray-900 dark:text-white">
              {children}
          </h2>
        );
      },
      [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-2xl lg:text-3xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">{children}</h3>,
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-6 text-lg leading-relaxed text-gray-900 dark:text-white">{children}</p>,
      [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc list-inside mb-6 pl-4 space-y-3 text-lg text-gray-900 dark:text-white">{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal list-inside mb-6 pl-4 space-y-3 text-lg text-gray-900 dark:text-white">{children}</ol>,
      [BLOCKS.QUOTE]: (node, children) => <blockquote className="border-l-4 border-blue-600 pl-6 py-4 my-8 text-lg italic bg-blue-50 dark:bg-blue-900/20 rounded-r-lg text-gray-600 dark:text-gray-400">{children}</blockquote>,
      [INLINES.HYPERLINK]: (node, children) => <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium transition-colors duration-200">{children}</a>,
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const file = node.data.target?.fields?.file;
        const description = node.data.target?.fields?.description;
        return file ? (
          <figure className="my-10">
            <Image
                src={`https:${file.url}?w=1200&fm=webp&q=85`}
                alt={description || 'Embedded blog image'}
                width={1200}
                height={600}
                className="w-full h-auto rounded-xl shadow-lg"
                loading="lazy"
            />
            {description && <figcaption className="text-center text-sm text-slate-500 mt-3 italic">{description}</figcaption>}
          </figure>
        ) : null;
      },
    },
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full animate-pulse mx-auto mb-4"></div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white animate-pulse">Loading Article...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-red-600 rounded-full"></div>
        </div>
        <p className="text-xl font-semibold text-red-600 dark:text-red-400">{error}</p>
      </div>
    </div>
  );

  if (!post) return null;

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

        <ReadingProgressBar />
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24 ${fadeIn}`}>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
                {/* Left Sidebar */}
                <LeftSidebar headings={headings} activeHeading={activeHeading} />

                {/* Main Article Content */}
                <div className={`w-full lg:w-3/4 ${fadeInUp}`}>
                    {/* Article Header */}
                    <header className="mb-8 lg:mb-12">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6 text-gray-900 dark:text-white">
                                {post.title}
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-4xl">
                            {post.excerpt}
                        </p>
                        <div className="flex items-center space-x-4 lg:space-x-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg">
                            <div className="relative">
                                {post.author.pictureUrl ? (
                                    <Image
                                        src={`${post.author.pictureUrl}?w=200&h=200&fit=face&q=80&fm=webp`}
                                        alt={post.author.name}
                                        width={80}
                                        height={80}
                                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                                    />
                                ) : (
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-blue-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                                        <span className="text-white font-semibold text-xl lg:text-2xl">{post.author.name[0]}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-base lg:text-lg text-gray-900 dark:text-white mb-1">{post.author.name}</p>
                                <p className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2 text-sm lg:text-base">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    {format(new Date(post.publishDate), 'MMMM dd, yyyy')}
                                </p>
                                <div className="mt-2">
                                    <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 lg:px-3 py-1 rounded-full font-semibold">Expert Author</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Hero Image */}
                    {post.heroImageUrl && (
                        <figure className={`mb-8 lg:mb-12 relative ${stagger}`}>
                            <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
                                <Image
                                    src={`${post.heroImageUrl}?w=1600&h=800&fit=fill&q=85&fm=webp`}
                                    alt={`Hero image for ${post.title}`}
                                    width={1600}
                                    height={800}
                                    className="w-full h-auto object-cover"
                                    priority={true}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 rounded-full px-4 py-2 shadow-lg">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Featured Article</p>
                                </div>
                            </div>
                        </figure>
                    )}

                    {/* Article Body */}
                    <article ref={articleRef} className="prose prose-sm sm:prose-base lg:prose-lg prose-slate max-w-none dark:prose-invert">
                        <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
                            {documentToReactComponents(post.content, richTextOptions)}
                        </div>
                    </article>
                </div>
            </div>
        </div>

        {/* Mobile Table of Contents */}
        <MobileTableOfContents headings={headings} activeHeading={activeHeading} />
      </div>
      <Footer />
    </>
  );
}