import { Metadata } from 'next'
import BlogPostPage from '@/components/BlogPostPage'

type BlogPageProps = {
  params: { slug: string }
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const slug = params.slug

  // Format slug to title (replace dashes with spaces and capitalize)
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    title: `${title} - Astrokiran Astrology Blog`,
    description: `Read our comprehensive guide on ${title.toLowerCase()}. Expert astrology insights, tips, and guidance for your spiritual journey.`,
    keywords: [`${title.toLowerCase()}`, "astrology blog", "vedic astrology", "astrology tips", "spiritual guidance"],
    alternates: {
      canonical: `https://astrokiran.com/blog/${slug}`,
    },
  }
}

export default function Page({ params }: BlogPageProps) {
  return <BlogPostPage slug={params.slug} />;
}