'use client';

import { useState } from 'react';
import { MapPin, Building, Clock, Calendar, DollarSign, ArrowLeft, Share2, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { useAuth } from '@/contexts/AuthContext';
import JobApplicationModal from './JobApplicationModal';
import type { Job, JobPreview } from '@/lib/jobs';

interface JobDetailProps {
  job: Job;
  relatedJobs: JobPreview[];
}

export default function JobDetail({ job, relatedJobs }: JobDetailProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'part-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'contract': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'internship': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    // Use UTC to avoid hydration mismatches
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job.title} - Astrokiran Careers`,
          text: `Join Astrokiran as ${job.title} in ${job.department}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you could save to localStorage or user preferences
  };

  const handleApply = () => {
    // Always show application modal - no auth required
    setShowApplicationModal(true);
  };

  // Rich text renderer options
  const richTextOptions = {
    renderMark: {
      [MARKS.BOLD]: (text: any) => <strong className="font-semibold">{text}</strong>,
      [MARKS.ITALIC]: (text: any) => <em className="italic">{text}</em>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: any) => (
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: any) => (
        <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: any) => <li>{children}</li>,
      [BLOCKS.HEADING_1]: (node: any, children: any) => (
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: any) => (
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: any) => (
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{children}</h3>
      ),
    },
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Button>
          </div>

          {/* Job Header */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 mb-8 bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.type)}`}>
                    {job.type.replace('-', ' ')}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {job.experience.replace('-', ' ')}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {job.title}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Posted {formatDate(job.publishDate)}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{job.salary}</span>
                    </div>
                  )}
                </div>

                {job.applicationDeadline && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        Application deadline: {formatDate(job.applicationDeadline)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <Button
                  onClick={handleApply}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                  size="lg"
                >
                  Apply Now
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBookmark}
                    className={`flex items-center gap-2 ${isBookmarked ? 'bg-orange-50 text-orange-600 border-orange-200' : ''}`}
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Job Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Job Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Job Description
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {job.description ? (
                    documentToReactComponents(job.description, richTextOptions)
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      No description available for this position.
                    </p>
                  )}
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700 dark:text-gray-300">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Benefits & Perks
                  </h2>
                  <ul className="space-y-3">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Apply */}
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Apply
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Ready to join our team? Apply now and we'll get back to you within 3-5 business days.
                </p>
                <Button
                  onClick={handleApply}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Apply for this Position
                </Button>
              </div>

              {/* Job Tags */}
              {job.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Skills & Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Jobs */}
              {relatedJobs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Other Open Positions
                  </h3>
                  <div className="space-y-4">
                    {relatedJobs.filter(relatedJob => relatedJob.id !== job.id).slice(0, 2).map((relatedJob) => (
                      <Link
                        key={relatedJob.id}
                        href={`/Jobs/${relatedJob.slug}`}
                        className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {relatedJob.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {relatedJob.department} • {relatedJob.location}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getJobTypeColor(relatedJob.type)}`}>
                          {relatedJob.type.replace('-', ' ')}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/Jobs">
                    <Button variant="outline" className="w-full mt-4">
                      View All Jobs
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        job={job}
      />
    </>
  );
}