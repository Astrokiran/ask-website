"use client"

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from 'contentful';
import { documentToReactComponents, type Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, type Document } from '@contentful/rich-text-types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, BookOpen, TrendingUp, LayoutGrid } from 'lucide-react';
import { NavBar } from '@/components/nav-bar'; // Assuming you have these
import { Footer } from '@/components/footer';   // Assuming you have these


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


// --- 3. ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};


// --- 4. REUSABLE UI COMPONENTS ---

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
    <div className="fixed top-0 left-0 z-50 w-full h-1 bg-amber-100/20">
      <motion.div className="h-1 bg-amber-500" style={{ width: `${width}%` }} />
    </div>
  );
};

const LeftSidebar = ({ headings, activeHeading }: { headings: Heading[], activeHeading: string }) => {
    // Mock data for demonstration
    const trendingPosts = [ { title: 'Understanding Your Saturn Return', slug: '#' }, { title: 'The Power of Birth Charts', slug: '#' }, { title: 'Mars Retrograde: What to Expect', slug: '#' }];
    const categories = ['Vedic', 'Tarot', 'Numerology', 'Vastu', 'Festivals'];

    return (
        <motion.aside variants={itemVariants} className="hidden lg:block w-full lg:w-1/4 lg:flex-shrink-0">
            <div className="sticky top-28 space-y-8">
                {/* Table of Contents */}
                {headings.length > 1 && (
                    <div className="p-6 rounded-2xl border-2 border-orange-200/50 dark:border-orange-800/50 bg-card/80 backdrop-blur-sm shadow-xl">
                        <h3 className="font-bold text-lg text-foreground mb-4 flex items-center">
                            <BookOpen size={20} className="mr-3 text-orange-500"/>
                            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">In this Article</span>
                        </h3>
                        <ul className="space-y-2.5">
                            {headings.map((heading) => (
                                <li key={heading.slug}>
                                    <a href={`#${heading.slug}`} className={`transition-colors duration-200 text-sm ${activeHeading === heading.slug ? 'font-bold text-orange-500' : 'text-muted-foreground hover:text-orange-500'}`}>
                                        {heading.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Trending Posts */}
                <div className="p-6 rounded-2xl border-2 border-orange-200/50 dark:border-orange-800/50 bg-card/80 backdrop-blur-sm shadow-xl">
                    <h3 className="font-bold text-lg text-foreground mb-4 flex items-center">
                        <TrendingUp size={20} className="mr-3 text-orange-500"/>
                        <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">Trending Now</span>
                    </h3>
                    <ul className="space-y-3">
                        {trendingPosts.map(post => (
                           <li key={post.title}><a href={post.slug} className="group flex justify-between items-center text-sm text-muted-foreground hover:text-orange-500 transition-colors">{post.title} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></a></li>
                        ))}
                    </ul>
                </div>
                {/* Categories */}
                 <div className="p-6 rounded-2xl border-2 border-orange-200/50 dark:border-orange-800/50 bg-card/80 backdrop-blur-sm shadow-xl">
                    <h3 className="font-bold text-lg text-foreground mb-4 flex items-center">
                        <LayoutGrid size={20} className="mr-3 text-orange-500"/>
                        <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">Categories</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                           <a key={cat} href="#" className="text-xs text-foreground bg-gradient-to-r from-orange-100 to-purple-100 hover:from-orange-200 hover:to-purple-200 dark:from-orange-900/30 dark:to-purple-900/30 dark:hover:from-orange-800/50 dark:hover:to-purple-800/50 transition-all rounded-full px-3 py-1.5 font-medium shadow-sm hover:shadow-md">{cat}</a>
                        ))}
                    </div>
                </div>
            </div>
        </motion.aside>
    );
};

const MobileTableOfContents = ({ headings, activeHeading }: { headings: Heading[], activeHeading: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (headings.length <= 1) return null;

    return (
        <>
            {/* Mobile TOC Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
                <BookOpen size={20} />
            </motion.button>

            {/* Mobile TOC Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t-2 border-orange-200/50 dark:border-orange-800/50 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-foreground flex items-center">
                                    <BookOpen size={20} className="mr-3 text-orange-500"/>
                                    <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">In this Article</span>
                                </h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"
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
                                            className={`block p-3 rounded-xl transition-all duration-200 ${
                                                activeHeading === heading.slug
                                                    ? 'bg-gradient-to-r from-orange-500/20 to-purple-600/20 text-orange-500 font-bold border-l-4 border-orange-500'
                                                    : 'text-muted-foreground hover:text-orange-500 hover:bg-orange-100/30 dark:hover:bg-orange-900/30'
                                            }`}
                                        >
                                            {heading.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

// --- 5. DATA FETCHING ---
// ... (Data fetching logic is unchanged)
const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
    const response = await client.getEntries({
        content_type: 'blogpost',
        'fields.slug': slug,
        include: 3,
    });
    if (response.items.length === 0) return null;
    const post = response.items[0];
    const getField = (obj: any, path: string[], defaultValue: any = null) => path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);

    // Get author entry and hero image entry
    const authorEntry = getField(post, ['fields', 'author']);
    const heroImageEntry = getField(post, ['fields', 'heroImage']);

    // Extract author picture with proper path
    let authorPictureUrl = '';
    if (authorEntry && authorEntry.fields && authorEntry.fields.picture) {
        const pictureAsset = authorEntry.fields.picture;
        if (pictureAsset.fields && pictureAsset.fields.file && pictureAsset.fields.file.url) {
            authorPictureUrl = `https:${pictureAsset.fields.file.url}`;
        }
    }

    // Debug logging to help troubleshoot
    if (process.env.NODE_ENV === 'development') {
        console.log('Author entry:', authorEntry);
        console.log('Author picture URL:', authorPictureUrl);
        console.log('Full author object:', {
            name: getField(authorEntry, ['fields', 'name']) || 'Unknown Author',
            pictureUrl: authorPictureUrl,
        });
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
    
    // Extract H2 headings for Table of Contents
    const extractedHeadings = post.content.content
      .filter(node => node.nodeType === BLOCKS.HEADING_2)
      .map(node => {
        const text = (node.content[0] as any).value;
        return { text, slug: slugify(text), level: 2 };
      });
    setHeadings(extractedHeadings);

    // Smooth scrolling setup
    document.documentElement.style.scrollBehavior = 'smooth';

    // Intersection Observer for scroll-spy
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveHeading(entry.target.id);
            }
        });
    }, { rootMargin: '-20% 0px -80% 0px', threshold: 0 }); // Highlights when heading is in the top 20% of the viewport

    const headingElements = articleRef.current.querySelectorAll('h2');
    headingElements.forEach(el => observer.observe(el));

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      headingElements.forEach(el => observer.unobserve(el));
    };
  }, [post]);


  // --- Rich Text Rendering Options ---
  const richTextOptions: Options = {
    renderNode: {
      [BLOCKS.HEADING_2]: (node, children) => {
        const text = Array.isArray(children) ? (children[0] as string) : '';
        const id = slugify(text);
        return (
          <h2 id={id} className="text-3xl lg:text-4xl font-bold mt-12 mb-6 scroll-mt-28">
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              {children}
            </span>
          </h2>
        );
      },
      [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-2xl lg:text-3xl font-semibold mt-8 mb-4 text-foreground">{children}</h3>,
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-6 text-lg leading-relaxed text-foreground">{children}</p>,
      [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc list-inside mb-6 pl-4 space-y-3 text-lg text-foreground">{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal list-inside mb-6 pl-4 space-y-3 text-lg text-foreground">{children}</ol>,
      [BLOCKS.QUOTE]: (node, children) => <blockquote className="border-l-4 border-gradient-to-b from-orange-400 to-purple-500 pl-6 py-4 my-8 text-lg italic bg-gradient-to-r from-orange-50/50 to-purple-50/50 dark:from-orange-950/30 dark:to-purple-950/30 rounded-r-lg text-muted-foreground">{children}</blockquote>,
      [INLINES.HYPERLINK]: (node, children) => <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-purple-600 underline font-medium transition-colors duration-200">{children}</a>,
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const file = node.data.target?.fields?.file;
        const description = node.data.target?.fields?.description;
        return file ? (
          <figure className="my-10">
            <motion.img
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                src={`https:${file.url}?w=1200&fm=webp&q=80`}
                alt={description || 'Embedded blog image'}
                className="w-full h-auto rounded-xl shadow-lg"
                loading="lazy"
            />
            {description && <figcaption className="text-center text-sm text-slate-500 mt-3 italic">{description}</figcaption>}
          </figure>
        ) : null;
      },
       // Add styling for your custom embedded entries if you have them
       // [BLOCKS.EMBEDDED_ENTRY]: (node) => { ... }
    },
  };

  if (isLoading) return (
    <div className="min-h-screen bg-background relative overflow-hidden flex justify-center items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-purple-50/30 dark:from-orange-950/20 dark:via-transparent dark:to-purple-950/10"></div>
      <div className="relative text-center">
        <div className="text-6xl mb-4 animate-pulse">✨</div>
        <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent animate-pulse">Loading Cosmic Article...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-background relative overflow-hidden flex justify-center items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-orange-50/30 dark:from-red-950/20 dark:via-transparent dark:to-orange-950/10"></div>
      <div className="relative text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-xl font-semibold text-red-600 dark:text-red-400">{error}</p>
      </div>
    </div>
  );
  if (!post) return null; // Or a 404 component

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Dynamic Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-purple-50/30 dark:from-orange-950/20 dark:via-transparent dark:to-purple-950/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(251,146,60,0.15)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_40%,rgba(251,146,60,0.08)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05)_0%,transparent_50%)]"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-orange-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-orange-300 rounded-full animate-pulse opacity-50"></div>

        <ReadingProgressBar />
        <AnimatePresence>
            <motion.div
                className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
                    {/* --- Left Sidebar --- */}
                    <LeftSidebar headings={headings} activeHeading={activeHeading} />

                    {/* --- Main Article Content --- */}
                    <motion.div variants={itemVariants} className="w-full lg:w-3/4">
                        {/* Article Header */}
                        <header className="mb-8 lg:mb-12">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6"
                            >
                                <span className="bg-gradient-to-r from-orange-500 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                                    {post.title}
                                </span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-4xl"
                            >
                                {post.excerpt}
                            </motion.p>
                             <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex items-center space-x-4 lg:space-x-6 bg-card/80 backdrop-blur-sm border-2 border-orange-200/50 dark:border-orange-800/50 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-xl"
                            >
                                <div className="relative group">
                                    {/* Glow Effect for Author Image */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 to-purple-500/30 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                                    {post.author.pictureUrl ? (
                                        <img
                                            src={`${post.author.pictureUrl}?w=200&h=200&fit=face&q=80&fm=webp`}
                                            alt={post.author.name}
                                            className="relative w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                console.error('Failed to load author image with transformations, trying original:', post.author.pictureUrl);
                                                e.currentTarget.src = post.author.pictureUrl;
                                                e.currentTarget.onError = (e2) => {
                                                    console.error('Failed to load original author image:', post.author.pictureUrl);
                                                    e2.currentTarget.style.display = 'none';
                                                    e2.currentTarget.nextElementSibling.style.display = 'flex';
                                                };
                                            }}
                                            onLoad={() => console.log('Author image loaded successfully:', post.author.pictureUrl)}
                                        />
                                    ) : null}
                                    <div className="relative w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-2xl" style={{ display: post.author.pictureUrl ? 'none' : 'flex' }}>
                                        <span className="text-white font-bold text-xl lg:text-2xl xl:text-3xl">{post.author.name[0]}</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-base lg:text-lg xl:text-xl text-foreground mb-1">{post.author.name}</p>
                                    <p className="text-muted-foreground font-medium flex items-center gap-2 text-sm lg:text-base">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                        {format(new Date(post.publishDate), 'MMMM dd, yyyy')}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs bg-gradient-to-r from-orange-500 to-purple-600 text-white px-2 lg:px-3 py-1 rounded-full font-semibold">✨ Expert Author</span>
                                    </div>
                                </div>
                            </motion.div>
                        </header>

                        {/* Hero Image */}
                        <motion.figure
                             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
                             className="mb-8 lg:mb-12 relative group"
                        >
                            {/* Glow Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-orange-500/20 rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                            {post.heroImageUrl ? (
                                <div className="relative rounded-3xl overflow-hidden border border-orange-200/30 dark:border-orange-800/30 shadow-2xl">
                                    <img
                                        src={`${post.heroImageUrl}?w=1600&h=800&fit=fill&q=80&fm=webp`}
                                        alt={`Hero image for ${post.title}`}
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                                    {/* Floating Badge */}
                                    <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                                        <p className="text-sm font-semibold text-foreground">✨ Featured Article</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-80 bg-gradient-to-br from-orange-400/30 to-purple-500/30 flex items-center justify-center rounded-3xl shadow-2xl border border-orange-200/30 dark:border-orange-800/30">
                                    <div className="text-center text-foreground">
                                        <div className="text-8xl mb-4">✨</div>
                                        <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">Featured Article</p>
                                    </div>
                                </div>
                            )}
                        </motion.figure>

                        {/* Article Body */}
                        <article ref={articleRef} className="prose prose-sm sm:prose-base lg:prose-lg prose-slate max-w-none dark:prose-invert">
                            <div className="bg-card/50 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-orange-200/30 dark:border-orange-800/30 shadow-lg">
                                {documentToReactComponents(post.content, richTextOptions)}
                            </div>
                        </article>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>

        {/* Mobile Table of Contents */}
        <MobileTableOfContents headings={headings} activeHeading={activeHeading} />
      </div>
      <Footer />
    </>
  );
}