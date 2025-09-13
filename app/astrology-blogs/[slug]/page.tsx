// File: app/blog/[slug]/page.tsx

import  BlogPostPage  from '@/components/BlogPostPage';
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
// This is a Server Component that gets params from the URL
export default function Page({ params }: { params: { slug: string } }) {
  // We render the client component from the Canvas, 
  // passing the slug from the URL as a prop.
  return (
    <>
      <NavBar />
      <BlogPostPage slug={params.slug} />
      <Footer />
    </>
  );
}