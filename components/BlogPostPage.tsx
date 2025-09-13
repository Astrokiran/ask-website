"use client"

import { useEffect, useState, useCallback } from 'react';
import { createClient } from 'contentful';
import { documentToReactComponents, type Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, type Document } from '@contentful/rich-text-types';
import { format } from 'date-fns';

/*
NOTE: You need to install the following packages for this component to work:
npm install contentful @contentful/rich-text-react-renderer @contentful/rich-text-types date-fns @tailwindcss/typography
*/

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
  slug:string;
}

interface BlogPostPageProps {
  slug: string;
}

// --- 3. HELPER & STYLED COMPONENTS ---

// A. Reading Progress Bar Component
const ReadingProgressBar = () => {
    const [width, setWidth] = useState(0);

    const handleScroll = useCallback(() => {
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPosition = window.scrollY;
        setWidth((scrollPosition / totalHeight) * 100);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div className="fixed top-0 left-0 z-50 w-full h-1 bg-gray-200">
            <div className="h-1 bg-indigo-600 transition-all duration-75" style={{ width: `${width}%` }} />
        </div>
    );
};

// B. Custom Callout Block Component
const CalloutBlock = ({ headline, summary }: { headline: string; summary: string }) => (
  <div className="my-10 p-6 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg shadow-md">
    <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mb-2">{headline}</h3>
    <p className="text-lg text-indigo-800 dark:text-indigo-300 leading-relaxed">{summary}</p>
  </div>
);

// C. Custom Content Banner Component
const ContentBanner = ({ imageUrl, caption }: { imageUrl: string; caption: string }) => (
  <figure className="my-12 group">
    <img 
      src={imageUrl} 
      alt={caption || 'Content banner'} 
      className="w-full h-auto rounded-lg shadow-xl transform group-hover:shadow-2xl transition-shadow duration-300" 
      loading="lazy"
      decoding="async"
    />
    {caption && <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 italic">{caption}</figcaption>}
  </figure>
);

// --- 4. DATA FETCHING LOGIC ---

const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
    // ... (Data fetching logic is unchanged as it was already correct)
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

// --- 5. MAIN PAGE COMPONENT ---

export function BlogPostPage({ slug }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (post?.content) {
      const extractedHeadings = post.content.content
        .filter(node => node.nodeType === BLOCKS.HEADING_2)
        .map(node => {
          const text = (node.content[0] as any).value;
          return { text, slug: slugify(text) };
        });
      setHeadings(extractedHeadings);
    }
    
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [post]);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedPost = await getBlogPost(slug);
            setPost(fetchedPost);
            if (!fetchedPost) setError('Blog post not found.');
        } catch (e) {
            console.error("Failed to fetch post:", e);
            setError("Failed to load the post.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchPost();
  }, [slug]);

  // --- Rich Text Rendering Options ---
  const richTextOptions: Options = {
    renderNode: {
      [BLOCKS.HEADING_2]: (node, children) => {
        const text = Array.isArray(children) ? (children[0] as string) : '';
        const id = slugify(text);
        return <h2 id={id} className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white scroll-mt-24">{children}</h2>;
      },
      [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-2xl font-semibold mt-12 mb-5 text-gray-800 dark:text-gray-200">{children}</h3>,
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-8 text-lg leading-loose text-gray-700 dark:text-gray-300">{children}</p>,
      [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc list-inside mb-8 pl-6 space-y-3 text-lg text-gray-700 dark:text-gray-300">{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal list-inside mb-8 pl-6 space-y-3 text-lg text-gray-700 dark:text-gray-300">{children}</ol>,
      [BLOCKS.QUOTE]: (node, children) => <blockquote className="border-l-4 border-indigo-500 pl-6 py-4 my-8 italic text-xl text-gray-600 dark:text-gray-400">{children}</blockquote>,
      [INLINES.HYPERLINK]: (node, children) => <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition-colors">{children}</a>,
      
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        const entry = node.data.target as any;
        const contentType = entry.sys.contentType.sys.id;
        switch (contentType) {
          case 'calloutBlock':
            return <CalloutBlock headline={entry.fields.headline} summary={entry.fields.summary} />;
          case 'contentBanner':
            const bannerUrl = entry.fields.image?.fields?.file?.url;
            return bannerUrl ? <ContentBanner imageUrl={`https:${bannerUrl}`} caption={entry.fields.caption} /> : null;
          default:
            return null;
        }
      },
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
          const file = node.data.target?.fields?.file;
          const description = node.data.target?.fields?.description;
          return file ? (
              <figure className="my-12">
                  <img 
                      src={`https:${file.url}?w=1200&fm=webp&q=85`} 
                      alt={description || 'Embedded blog image'} 
                      className="w-full h-auto rounded-lg shadow-lg"
                      loading="lazy"
                      decoding="async"
                   />
                  {description && <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 italic">{description}</figcaption>}
              </figure>
          ) : null;
      },
    },
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen bg-gray-50"><p className="text-xl text-gray-500 animate-pulse">Loading Article...</p></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen bg-red-50"><p className="text-xl text-red-600 font-semibold">{error}</p></div>;
  if (!post) return null;

  return (
    <div className="bg-white dark:bg-gray-900 font-sans">
      <ReadingProgressBar />
      
      {/* --- Hero Section --- */}
<header className="relative h-[45vh] min-h-[350px] w-full flex items-center justify-center text-white">
        <div className="absolute inset-0">
          <img src={`${post.heroImageUrl}?w=1800&fit=fill&q=80&fm=webp`} alt={`Hero image for ${post.title}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-[fade-in-up_0.8s_ease-out] [animation-fill-mode:backwards]">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-shadow mb-4" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>{post.title}</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">{post.excerpt}</p>
          <div className="flex items-center justify-center space-x-4">
            <img src={`${post.author.pictureUrl}?w=100&h=100&fit=faces&q=80&fm=webp`} alt={post.author.name} className="w-14 h-14 rounded-full border-2 border-white/80"/>
            <div>
              <p className="font-semibold text-white">{post.author.name}</p>
              <p className="text-sm text-gray-300">{format(new Date(post.publishDate), 'MMMM dd, yyyy')}</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* --- Main Content Area --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="lg:grid lg:grid-cols-4 lg:gap-x-12">
          
          {/* --- Table of Contents (Sticky on lg screens) --- */}
          {headings.length > 1 && (
            <aside className="lg:col-span-1 mb-12 lg:mb-0">
              <div className="sticky top-24 animate-[fade-in-up_0.5s_ease-out_0.2s] [animation-fill-mode:backwards]">
                <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 tracking-wider uppercase">Table of Contents</h2>
                <ol className="space-y-3">
                  {headings.map((heading) => (
                    <li key={heading.slug}>
                      <a href={`#${heading.slug}`} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 block">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          )}

          {/* --- Rich Text Article Body --- */}
          <article className={`lg:col-span-3 animate-[fade-in-up_0.5s_ease-out_0.4s] [animation-fill-mode:backwards] ${headings.length <= 1 && 'lg:col-start-1 lg:col-span-4'}`}>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {documentToReactComponents(post.content, richTextOptions)}
            </div>
          </article>
          
        </div>
      </div>
    </div>
  );
}