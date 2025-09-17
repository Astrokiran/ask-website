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

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ready to explore your destiny?
          </p>
          <Link
            href="https://wa.me/918197503574?text=Hi,%20I%20would%20like%20to%20consult%20with%20an%20astrologer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
            </svg>
            Chat with Expert Astrologer
          </Link>
        </div>
      </div>
    </div>
  )
}