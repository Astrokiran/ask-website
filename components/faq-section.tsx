import { ChevronRight, Eye, Hand, Sparkles } from "lucide-react"
import Link from "next/link"

const faqData = [
  {
    id: "astrology",
    question: "What is Astrology?",
    answer: "Astrology studies celestial movements to understand their influence on human affairs and predict future events.",
    icon: Sparkles,
    route: "/horoscopes",
    linkText: "Get Your Horoscope"
  },
  {
    id: "palmistry",
    question: "What is Palmistry?",
    answer: "Palmistry reads palms to reveal character, personality traits, and future prospects through hand analysis.",
    icon: Hand,
    route: "/palmistry",
    linkText: "Learn About Palmistry"
  },
  {
    id: "tarot",
    question: "What is Tarot Reading?",
    answer: "Tarot uses 78 cards to gain insights into past, present, and future for spiritual guidance and clarity.",
    icon: Eye,
    route: "/tarot",
    linkText: "Explore Tarot Reading"
  }
]

export function FaqSection() {
  return (
    <div className="py-16 lg:py-24 bg-white dark:bg-gray-800" id="faq">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-medium text-sm mb-6">
            Learn More
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
            FAQ's
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the ancient wisdom behind astrology, palmistry, and tarot reading
          </p>
        </div>

        {/* FAQ Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqData.map((faq) => (
            <Link
              key={faq.id}
              href={faq.route}
              className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              {/* Icon and Question */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <faq.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                  {faq.question}
                </h3>
              </div>

              {/* Answer Content */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>

              {/* CTA Arrow */}
              <div className="flex items-center gap-2 text-orange-500 font-medium group-hover:gap-3 transition-all duration-200">
                <span>{faq.linkText}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}