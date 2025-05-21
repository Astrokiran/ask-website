import React from 'react';
import {
  ListicleBlogPostLayout,
  ListiclePostData,
} from '../components/blog-layouts/listicle-blog-post-layout'; // Adjust path if necessary

// Mock data for the ListiclePostData
const mockListiclePost: ListiclePostData = {
  id: 'preview-123',
  slug: 'astrology-listicle-preview',
  title: 'Top 5 Astrological Events to Watch This Month',
  featuredImageUrl: undefined, // Removed image
  publishDate: new Date().toISOString(),
  author: {
    name: 'Astro Previewer',
    avatarUrl: 'https://via.placeholder.com/40', // Placeholder avatar
  },
  category: 'Monthly Forecasts',
  tags: ['Planets', 'Transits', 'Horoscope'],
  introduction:
    'This month is packed with celestial action! Here are the top astrological events you won’t want to miss. Get ready to align your energies and make the most of these cosmic shifts.',
  items: [
    {
      id: 'item-1',
      title: '1. Mercury Retrograde Ends',
      contentHtml:
        '<p>Finally, the communication chaos subsides! With Mercury turning direct, expect clarity to return to your conversations and plans. It’s a great time to sign contracts and make important decisions.</p><p>Focus on resolving any misunderstandings from the past few weeks.</p>',
      imageUrl: undefined, // Removed image
    },
    {
      id: 'item-2',
      title: '2. Full Moon in Sagittarius',
      contentHtml:
        '<p>A powerful Full Moon illuminates the sign of Sagittarius, bringing themes of expansion, truth, and adventure to the forefront. This is a time for culmination and release.</p><ul><li>What beliefs are you ready to let go of?</li><li>How can you embrace more freedom in your life?</li></ul>',
      // No imageUrl for this item, to test optionality
    },
    {
      id: 'item-3',
      title: '3. Venus Enters Cancer',
      contentHtml:
        '<p>Love and relationships take on a nurturing, sentimental tone as Venus moves into Cancer. Focus on home, family, and emotional security. It’s a wonderful period for deepening connections and creating a cozy atmosphere.</p>',
      imageUrl: undefined, // Removed image
    },
    {
      id: 'item-4',
      title: '4. Mars Square Saturn',
      contentHtml:
        '<p>This challenging aspect can bring up frustrations or obstacles. Mars wants action, while Saturn imposes limits. The key is to find disciplined ways to channel your energy. Patience will be your best friend.</p>',
    },
    {
      id: 'item-5',
      title: '5. Sun Trine Jupiter',
      contentHtml:
        '<p>A beautiful, optimistic transit! The Sun harmonizing with Jupiter brings opportunities for growth, luck, and abundance. Say yes to new experiences and trust in your potential. This is a great time for manifestation.</p>',
      imageUrl: undefined, // Removed image
    },
  ],
  conclusion:
    'Stay tuned to the cosmos and use these astrological insights to navigate your month with greater awareness and intention. Remember, astrology is a tool for self-understanding and growth!',
  seo: {
    metaTitle: 'Listicle Preview | Astro Site',
    metaDescription: 'A preview of the listicle blog post layout.',
  },
};

export default function ListiclePreviewPage() {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      {/* You can add a general page layout wrapper here if you have one */}
      <ListicleBlogPostLayout post={mockListiclePost} />
    </div>
  );
}

// If you want to prevent this page from being indexed by search engines,
// you can add a noindex meta tag in the Head component within ListiclePreviewPage
// or configure it in your robots.txt if this is purely for development.
// Example for noindex:
// <Head>
//   <meta name="robots" content="noindex, nofollow" />
// </Head>