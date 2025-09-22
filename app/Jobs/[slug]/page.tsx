import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import JobDetail from "@/components/jobs/JobDetail";
import { getJobBySlug, getFeaturedJobs } from '@/lib/jobs';

interface JobPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);

  if (!job) {
    return {
      title: 'Job Not Found - Astrokiran Careers',
      description: 'The requested job position could not be found.',
    };
  }

  return {
    title: `${job.title} - ${job.department} | Astrokiran Careers`,
    description: `Join Astrokiran as ${job.title} in ${job.department}. ${job.location} • ${job.type} • ${job.experience}. Apply now and be part of India's leading astrology platform.`,
    keywords: [
      job.title.toLowerCase(),
      job.department.toLowerCase(),
      'astrokiran careers',
      'astrology jobs',
      job.location.toLowerCase(),
      job.type.replace('-', ' '),
      ...job.tags.map(tag => tag.toLowerCase())
    ],
    alternates: {
      canonical: `https://astrokiran.com/careers/${job.slug}`,
    },
    openGraph: {
      title: `${job.title} - ${job.department} | Astrokiran Careers`,
      description: `Join Astrokiran as ${job.title} in ${job.department}. ${job.location} • ${job.type} • ${job.experience}. Apply now!`,
      url: `https://astrokiran.com/careers/${job.slug}`,
      type: 'website',
    }
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const [job, relatedJobs] = await Promise.all([
    getJobBySlug(params.slug),
    getFeaturedJobs(3)
  ]);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <main>
        <JobDetail job={job} relatedJobs={relatedJobs} />
      </main>
      <Footer />
    </div>
  );
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    // We could fetch all job slugs here, but for now return empty array
    // This will enable ISR (Incremental Static Regeneration)
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}