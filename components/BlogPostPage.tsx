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
        <motion.aside variants={itemVariants} className="w-full lg:w-1/4 lg:flex-shrink-0">
            <div className="sticky top-28 space-y-8">
                {/* Table of Contents */}
                {headings.length > 1 && (
                    <div className="p-5 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center"><BookOpen size={18} className="mr-2 text-amber-600"/>In this Article</h3>
                        <ul className="space-y-2.5">
                            {headings.map((heading) => (
                                <li key={heading.slug}>
                                    <a href={`#${heading.slug}`} className={`transition-colors duration-200 text-sm ${activeHeading === heading.slug ? 'font-bold text-amber-600' : 'text-slate-500 hover:text-amber-600'}`}>
                                        {heading.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Trending Posts */}
                <div className="p-5 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center"><TrendingUp size={18} className="mr-2 text-amber-600"/>Trending Now</h3>
                    <ul className="space-y-3">
                        {trendingPosts.map(post => (
                           <li key={post.title}><a href={post.slug} className="group flex justify-between items-center text-sm text-slate-500 hover:text-amber-600 transition-colors">{post.title} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></a></li>
                        ))}
                    </ul>
                </div>
                {/* Categories */}
                 <div className="p-5 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center"><LayoutGrid size={18} className="mr-2 text-amber-600"/>Categories</h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                           <a key={cat} href="#" className="text-xs text-slate-600 bg-slate-100 hover:bg-amber-100 hover:text-amber-700 transition-colors rounded-full px-3 py-1.5">{cat}</a>
                        ))}
                    </div>
                </div>
            </div>
        </motion.aside>
    );
};

// --- 5. DATA FETCHING ---
// ... (Data fetching logic is unchanged)
const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
    const response = await client.getEntries({
        content_type: 'blogpost', 'fields.slug': slug, include: 3,
    });
    if (response.items.length === 0) return null;
    const post = response.items[0];
    const getField = (obj: any, path: string[], defaultValue: any = null) => path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
    const authorEntry = getField(post, ['fields', 'author']);
    const heroImageEntry = getField(post, ['fields', 'heroImage']);
    return {
        title: post.fields.title as string,
        slug: post.fields.slug as string,
        heroImageUrl: `https:${getField(heroImageEntry, ['fields', 'file', 'url'])}`,
        excerpt: post.fields.excerpt as string,
        publishDate: post.fields.publishDate as string,
        author: {
            name: getField(authorEntry, ['fields', 'name']),
            pictureUrl: `https:${getField(authorEntry, ['fields', 'picture', 'fields', 'file', 'url'])}`,
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
        return <h2 id={id} className="text-3xl font-bold mt-12 mb-4 text-slate-900 scroll-mt-28">{children}</h2>;
      },
      [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-2xl font-semibold mt-8 mb-4 text-slate-800">{children}</h3>,
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-6 text-lg leading-relaxed text-slate-700">{children}</p>,
      [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc list-inside mb-6 pl-4 space-y-2 text-lg text-slate-700">{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal list-inside mb-6 pl-4 space-y-2 text-lg text-slate-700">{children}</ol>,
      [BLOCKS.QUOTE]: (node, children) => <blockquote className="border-l-4 border-amber-400 pl-6 py-2 my-8 text-lg italic text-slate-600">{children}</blockquote>,
      [INLINES.HYPERLINK]: (node, children) => <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">{children}</a>,
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

  if (isLoading) return <div className="flex justify-center items-center min-h-screen bg-slate-50"><p className="text-xl text-slate-500 animate-pulse">Loading Article...</p></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen bg-red-50"><p className="text-xl text-red-600 font-semibold">{error}</p></div>;
  if (!post) return null; // Or a 404 component

  return (
    <>
      <NavBar />
      <div className="bg-slate-50 font-sans">
        <ReadingProgressBar />
        <AnimatePresence>
            <motion.div 
                className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    {/* --- Left Sidebar --- */}
                    <LeftSidebar headings={headings} activeHeading={activeHeading} />

                    {/* --- Main Article Content --- */}
                    <motion.div variants={itemVariants} className="w-full lg:w-3/4">
                        {/* Article Header */}
                        <header className="mb-12">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4"
                            >
                                {post.title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-xl text-slate-600 mb-6"
                            >
                                {post.excerpt}
                            </motion.p>
                             <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex items-center space-x-4 border-t border-b border-slate-200 py-4"
                            >
                                <img src={`${post.author.pictureUrl}?w=100&h=100&fit=faces&q=80`} alt={post.author.name} className="w-12 h-12 rounded-full"/>
                                <div>
                                    <p className="font-semibold text-slate-800">{post.author.name}</p>
                                    <p className="text-sm text-slate-500">{format(new Date(post.publishDate), 'MMMM dd, yyyy')}</p>
                                </div>
                            </motion.div>
                        </header>

                        {/* Hero Image */}
                        <motion.figure 
                             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
                             className="mb-12"
                        >
                            <img src={`${post.heroImageUrl}?w=1600&fit=fill&q=80`} alt={`Hero image for ${post.title}`} className="w-full h-auto object-cover rounded-xl shadow-xl" />
                        </motion.figure>

                        {/* Article Body */}
                        <article ref={articleRef} className="prose prose-lg prose-slate max-w-none">
                            {documentToReactComponents(post.content, richTextOptions)}
                        </article>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
}