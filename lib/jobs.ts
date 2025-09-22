import { createClient, type Entry } from 'contentful';

// --- CONTENTFUL CLIENT SETUP ---
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
});

// --- TYPES ---
export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string; // full-time, part-time, contract, internship
  experience: string; // entry-level, mid-level, senior-level
  salary?: string;
  availablePositions?: number;
  description: any; // Rich text from Contentful
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  publishDate: string;
  isActive: boolean;
  applicationDeadline?: string;
  tags: string[];
}

export interface JobPreview {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary?: string;
  availablePositions?: number;
  publishDate: string;
  isActive: boolean;
  applicationDeadline?: string;
  tags: string[];
}

export interface PaginatedJobResponse {
  jobs: JobPreview[];
  total: number;
  skip: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  currentPage: number;
}

export interface JobFilters {
  search?: string;
  department?: string;
  location?: string;
  type?: string;
  experience?: string;
  tags?: string[];
  sortBy?: 'publishDate' | 'title' | 'salary';
  sortOrder?: 'asc' | 'desc';
}

export interface JobApplication {
  jobId: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeUrl: string;
  coverLetter?: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
}

// --- HELPER FUNCTIONS ---
const getField = (obj: any, path: string[], defaultValue: any = null) =>
  path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);

const mapEntryToJobPreview = (item: Entry<any>): JobPreview => {
  return {
    id: item.sys.id,
    title: item.fields.title as string,
    slug: item.fields.slug as string,
    department: item.fields.department as string,
    location: item.fields.location as string,
    type: item.fields.type as string,
    experience: item.fields.experience as string,
    salary: item.fields.salary as string,
    availablePositions: item.fields.availablePositions as number,
    publishDate: item.fields.publishDate as string,
    isActive: item.fields.isActive as boolean,
    applicationDeadline: item.fields.applicationDeadline as string,
    tags: (item.fields.tags as any[])?.map(tag => tag.fields?.name).filter(Boolean) || [],
  };
};

const mapEntryToJob = (item: Entry<any>): Job => {
  return {
    id: item.sys.id,
    title: item.fields.title as string,
    slug: item.fields.slug as string,
    department: item.fields.department as string,
    location: item.fields.location as string,
    type: item.fields.type as string,
    experience: item.fields.experience as string,
    salary: item.fields.salary as string,
    availablePositions: item.fields.availablePositions as number,
    description: item.fields.description,
    requirements: item.fields.requirements as string[] || [],
    responsibilities: item.fields.responsibilities as string[] || [],
    benefits: item.fields.benefits as string[] || [],
    publishDate: item.fields.publishDate as string,
    isActive: item.fields.isActive as boolean,
    applicationDeadline: item.fields.applicationDeadline as string,
    tags: (item.fields.tags as any[])?.map(tag => tag.fields?.name).filter(Boolean) || [],
  };
};

// --- API FUNCTIONS ---

/**
 * Fetch paginated job listings with optional filtering
 */
export const getJobs = async (
  page: number = 1,
  limit: number = 12,
  filters: JobFilters = {}
): Promise<PaginatedJobResponse> => {
  const skip = (page - 1) * limit;

  try {
    // Build query parameters
    const queryParams: any = {
      content_type: 'jobPosting',
      order: ['-fields.publishDate'] as any,
      include: 2,
      limit,
      skip,
      'fields.isActive': true, // Only show active jobs
    };

    // Add search filter
    if (filters.search) {
      queryParams['fields.title[match]'] = filters.search;
    }

    // Add department filter
    if (filters.department) {
      queryParams['fields.department'] = filters.department;
    }

    // Add location filter
    if (filters.location) {
      queryParams['fields.location[match]'] = filters.location;
    }

    // Add job type filter
    if (filters.type) {
      queryParams['fields.type'] = filters.type;
    }

    // Add experience level filter
    if (filters.experience) {
      queryParams['fields.experience'] = filters.experience;
    }

    // Add sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'asc' ? '' : '-';
      queryParams.order = [`${sortOrder}fields.${filters.sortBy}`];
    }

    const response = await client.getEntries(queryParams);

    const jobs = response.items.map(mapEntryToJobPreview);
    const total = response.total;
    const totalPages = Math.ceil(total / limit);

    return {
      jobs,
      total,
      skip,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs');
  }
};

/**
 * Get a single job by slug
 */
export const getJobBySlug = async (slug: string): Promise<Job | null> => {
  try {
    const response = await client.getEntries({
      content_type: 'jobPosting',
      'fields.slug': slug,
      'fields.isActive': true,
      include: 2,
      limit: 1,
    });

    if (response.items.length === 0) {
      return null;
    }

    return mapEntryToJob(response.items[0]);
  } catch (error) {
    console.error('Error fetching job by slug:', error);
    return null;
  }
};

/**
 * Get featured jobs (latest active jobs)
 */
export const getFeaturedJobs = async (limit: number = 6): Promise<JobPreview[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'jobPosting',
      order: ['-fields.publishDate'] as any,
      include: 2,
      limit,
      'fields.isActive': true,
    });

    return response.items.map(mapEntryToJobPreview);
  } catch (error) {
    console.error('Error fetching featured jobs:', error);
    return [];
  }
};

/**
 * Get all departments for filtering
 */
export const getJobDepartments = async (): Promise<Array<{ name: string; count: number }>> => {
  try {
    const response = await client.getEntries({
      content_type: 'jobPosting',
      'fields.isActive': true,
      limit: 1000,
      select: 'fields.department' as any,
    });

    const departmentMap = new Map<string, number>();

    response.items.forEach((item) => {
      const department = item.fields.department as string;
      if (department) {
        departmentMap.set(department, (departmentMap.get(department) || 0) + 1);
      }
    });

    return Array.from(departmentMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching job departments:', error);
    return [];
  }
};

/**
 * Get all locations for filtering
 */
export const getJobLocations = async (): Promise<Array<{ name: string; count: number }>> => {
  try {
    const response = await client.getEntries({
      content_type: 'jobPosting',
      'fields.isActive': true,
      limit: 1000,
      select: 'fields.location' as any,
    });

    const locationMap = new Map<string, number>();

    response.items.forEach((item) => {
      const location = item.fields.location as string;
      if (location) {
        locationMap.set(location, (locationMap.get(location) || 0) + 1);
      }
    });

    return Array.from(locationMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching job locations:', error);
    return [];
  }
};

/**
 * Search jobs
 */
export const searchJobs = async (
  query: string,
  page: number = 1,
  limit: number = 12
): Promise<PaginatedJobResponse> => {
  return getJobs(page, limit, { search: query });
};

/**
 * Get job statistics for dashboard
 */
export const getJobStats = async (): Promise<{
  totalJobs: number;
  activeJobs: number;
  departmentBreakdown: Array<{ department: string; count: number }>;
  typeBreakdown: Array<{ type: string; count: number }>;
}> => {
  try {
    const [allJobs, activeJobs] = await Promise.all([
      client.getEntries({
        content_type: 'jobPosting',
        limit: 1000,
        select: 'fields.department,fields.type,fields.isActive' as any,
      }),
      client.getEntries({
        content_type: 'jobPosting',
        'fields.isActive': true,
        limit: 1000,
        select: 'fields.department,fields.type' as any,
      }),
    ]);

    const departmentMap = new Map<string, number>();
    const typeMap = new Map<string, number>();

    activeJobs.items.forEach((item) => {
      const department = item.fields.department as string;
      const type = item.fields.type as string;

      if (department) {
        departmentMap.set(department, (departmentMap.get(department) || 0) + 1);
      }
      if (type) {
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      }
    });

    return {
      totalJobs: allJobs.total,
      activeJobs: activeJobs.total,
      departmentBreakdown: Array.from(departmentMap.entries())
        .map(([department, count]) => ({ department, count }))
        .sort((a, b) => b.count - a.count),
      typeBreakdown: Array.from(typeMap.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
    };
  } catch (error) {
    console.error('Error fetching job stats:', error);
    return {
      totalJobs: 0,
      activeJobs: 0,
      departmentBreakdown: [],
      typeBreakdown: [],
    };
  }
};