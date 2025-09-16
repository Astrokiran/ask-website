import { createClient, type Entry } from 'contentful';

// --- CONTENTFUL CLIENT SETUP ---
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
});

// --- TYPES ---
export interface BlogPostPreview {
  title: string;
  slug: string;
  heroImageUrl: string;
  excerpt: string;
  publishDate: string;
  author?: {
    name: string;
    pictureUrl: string;
  };
  tags?: string[];
}

export interface PaginatedBlogResponse {
  posts: BlogPostPreview[];
  total: number;
  skip: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  currentPage: number;
}

export interface BlogFilters {
  search?: string;
  tag?: string;
  author?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// --- HELPER FUNCTIONS ---
const getField = (obj: any, path: string[], defaultValue: any = null) =>
  path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);

const mapEntryToBlogPost = (item: Entry<any>): BlogPostPreview => {
  const heroImageUrl = getField(item, ['fields', 'heroImage', 'fields', 'file', 'url']);
  const authorEntry = getField(item, ['fields', 'author']);

  // Extract author picture with proper path
  let authorPictureUrl = '';
  if (authorEntry && authorEntry.fields && authorEntry.fields.picture) {
    const pictureAsset = authorEntry.fields.picture;
    if (pictureAsset.fields && pictureAsset.fields.file && pictureAsset.fields.file.url) {
      authorPictureUrl = pictureAsset.fields.file.url;
    }
  }

  return {
    title: item.fields.title as string,
    slug: item.fields.slug as string,
    heroImageUrl: heroImageUrl ? `https:${heroImageUrl}` : '',
    excerpt: item.fields.excerpt as string,
    publishDate: item.fields.publishDate as string,
    author: authorEntry ? {
      name: getField(authorEntry, ['fields', 'name']) || 'Anonymous',
      pictureUrl: authorPictureUrl ? `https:${authorPictureUrl}` : '',
    } : undefined,
    tags: (item.fields.tags as any[])?.map(tag => tag.fields?.name).filter(Boolean) || [],
  };
};

// --- API FUNCTIONS ---

/**
 * Fetch paginated blog posts with optional filtering
 */
export const getBlogPosts = async (
  page: number = 1,
  limit: number = 12,
  filters: BlogFilters = {}
): Promise<PaginatedBlogResponse> => {
  const skip = (page - 1) * limit;

  try {
    // Build query parameters
    const queryParams: any = {
      content_type: 'blogpost',
      order: ['-fields.publishDate'] as any,
      include: 2,
      limit,
      skip,
    };

    // Add search filter
    if (filters.search) {
      queryParams['fields.title[match]'] = filters.search;
    }

    // Add tag filter
    if (filters.tag) {
      queryParams['fields.tags.sys.id'] = filters.tag;
    }

    // Add author filter
    if (filters.author) {
      queryParams['fields.author.fields.name[match]'] = filters.author;
    }

    const response = await client.getEntries(queryParams);

    const posts = response.items.map(mapEntryToBlogPost);
    const total = response.total;
    const totalPages = Math.ceil(total / limit);

    return {
      posts,
      total,
      skip,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
};

/**
 * Get featured blog posts (latest 3)
 */
export const getFeaturedPosts = async (): Promise<BlogPostPreview[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'blogpost',
      order: ['-fields.publishDate'] as any,
      include: 2,
      limit: 3,
    });

    return response.items.map(mapEntryToBlogPost);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
};

/**
 * Get related posts based on tags
 */
export const getRelatedPosts = async (
  currentSlug: string,
  tags: string[] = [],
  limit: number = 3
): Promise<BlogPostPreview[]> => {
  try {
    if (tags.length === 0) {
      // If no tags, just get latest posts excluding current
      const response = await client.getEntries({
        content_type: 'blogpost',
        order: ['-fields.publishDate'] as any,
        include: 2,
        limit: limit + 1,
        'fields.slug[ne]': currentSlug,
      });
      return response.items.slice(0, limit).map(mapEntryToBlogPost);
    }

    // Get posts with similar tags
    const response = await client.getEntries({
      content_type: 'blogpost',
      order: ['-fields.publishDate'] as any,
      include: 2,
      limit: limit + 1,
      'fields.slug[ne]': currentSlug,
      'fields.tags.sys.id[in]': tags.join(','),
    });

    return response.items.slice(0, limit).map(mapEntryToBlogPost);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
};

/**
 * Get all available tags for filtering
 */
export const getBlogTags = async (): Promise<Array<{ id: string; name: string; count: number }>> => {
  try {
    // Since blogTag content type doesn't exist, return empty array
    // This can be implemented when the blogTag content type is created in Contentful
    console.log('blogTag content type not found, returning empty tags array');
    return [];
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return [];
  }
};

/**
 * Get blog archives by month/year
 */
export const getBlogArchives = async (): Promise<Array<{ year: number; months: Array<{ month: string; count: number; slug: string }> }>> => {
  try {
    const response = await client.getEntries({
      content_type: 'blogpost',
      order: ['-fields.publishDate'] as any,
      limit: 1000,
      select: 'fields.publishDate' as any,
    });

    const archiveMap = new Map<number, Map<string, number>>();

    response.items.forEach((item) => {
      const publishDate = new Date(item.fields.publishDate as string);
      const year = publishDate.getFullYear();
      const month = publishDate.toLocaleString('default', { month: 'long' });

      if (!archiveMap.has(year)) {
        archiveMap.set(year, new Map());
      }

      const yearMap = archiveMap.get(year)!;
      yearMap.set(month, (yearMap.get(month) || 0) + 1);
    });

    const archives = Array.from(archiveMap.entries())
      .map(([year, monthsMap]) => ({
        year,
        months: Array.from(monthsMap.entries())
          .map(([month, count]) => ({
            month,
            count,
            slug: `${year}-${String(new Date(`${month} 1, ${year}`).getMonth() + 1).padStart(2, '0')}`,
          }))
          .sort((a, b) => new Date(`${a.month} 1, ${year}`).getMonth() - new Date(`${b.month} 1, ${year}`).getMonth())
          .reverse(), // Latest month first
      }))
      .sort((a, b) => b.year - a.year); // Latest year first

    return archives;
  } catch (error) {
    console.error('Error fetching blog archives:', error);
    return [];
  }
};

/**
 * Get author statistics
 */
export const getBlogAuthors = async (): Promise<Array<{ name: string; count: number; avatar?: string }>> => {
  try {
    const response = await client.getEntries({
      content_type: 'blogpost',
      include: 2,
      limit: 1000,
      select: 'fields.author' as any,
    });

    const authorMap = new Map<string, { count: number; avatar?: string }>();

    response.items.forEach((item) => {
      const authorEntry = getField(item, ['fields', 'author']);
      if (authorEntry) {
        const authorName = getField(authorEntry, ['fields', 'name']);
        // Extract author avatar with proper path
        let authorAvatar = '';
        if (authorEntry.fields && authorEntry.fields.picture) {
          const pictureAsset = authorEntry.fields.picture;
          if (pictureAsset.fields && pictureAsset.fields.file && pictureAsset.fields.file.url) {
            authorAvatar = pictureAsset.fields.file.url;
          }
        }

        if (authorName) {
          const existing = authorMap.get(authorName) || { count: 0 };
          authorMap.set(authorName, {
            count: existing.count + 1,
            avatar: authorAvatar ? `https:${authorAvatar}` : existing.avatar,
          });
        }
      }
    });

    return Array.from(authorMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        avatar: data.avatar,
      }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching blog authors:', error);
    return [];
  }
};

/**
 * Search blog posts
 */
export const searchBlogPosts = async (
  query: string,
  page: number = 1,
  limit: number = 12
): Promise<PaginatedBlogResponse> => {
  return getBlogPosts(page, limit, { search: query });
};