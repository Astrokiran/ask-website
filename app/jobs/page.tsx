import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import JobsListing from "@/components/jobs/JobsListing"

export const metadata: Metadata = {
  title: "Careers - Join Astrokiran Team | Open Job Positions",
  description: "Join our growing team at Astrokiran! Explore exciting career opportunities in astrology, technology, content creation, and customer service. Apply for open positions and grow with India's leading astrology platform.",
  keywords: ["astrokiran careers", "astrology jobs", "tech jobs India", "content writer jobs", "customer service jobs", "remote jobs", "astrology industry careers"],
  alternates: {
    canonical: "https://astrokiran.com/jobs",
  },
}

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-orange-50 to-purple-50 dark:from-orange-950/20 dark:to-purple-950/20 py-16 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">We're Hiring!</span>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 leading-tight text-gray-900 dark:text-white">
              Join the Astrokiran Team
              <br />
              <span className="text-2xl md:text-4xl font-medium text-orange-600 dark:text-orange-400">
                Shape the Future of Astrology
              </span>
            </h1>

            {/* Description */}
            <div className="max-w-4xl mx-auto text-center mb-8">
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Be part of India's fastest-growing astrology platform. We're looking for passionate individuals
                who want to make a meaningful impact in the lives of millions seeking spiritual guidance.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">40,000+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Active Users</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Remote</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Work Culture</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Listing Component */}
        <JobsListing />

        {/* Why Work With Us Section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Why Work With Astrokiran?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Join a company that values growth, innovation, and making a positive impact in people's lives through ancient wisdom and modern technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-orange-100 dark:bg-orange-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Growth Opportunities
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Accelerate your career with continuous learning, mentorship programs, and opportunities to work on cutting-edge projects in the spiritual tech space.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-purple-100 dark:bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Remote-First Culture
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Work from anywhere in India with flexible hours, modern tools, and a culture built around trust, results, and work-life balance.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Competitive Benefits
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Enjoy competitive salaries, health insurance, performance bonuses, stock options, and comprehensive benefits package.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Meaningful Impact
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Make a real difference by helping millions of people find guidance, clarity, and spiritual growth through our platform.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-yellow-100 dark:bg-yellow-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Collaborative Team
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Work with passionate, talented individuals from diverse backgrounds who share a common vision of innovation and excellence.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-red-100 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Learning & Development
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Access to online courses, conferences, workshops, and a dedicated budget for professional development and skill enhancement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process Section */}
        <section className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Hiring Process
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                We believe in a transparent, fair, and efficient hiring process that respects your time and showcases your talents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Apply</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Submit your application with resume and cover letter through our portal.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Review</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our team reviews your application and contacts you within 3-5 business days.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Interview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  1-2 rounds of interviews including technical and cultural fit assessments.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Welcome</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Offer letter, onboarding, and welcome to the Astrokiran family!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}