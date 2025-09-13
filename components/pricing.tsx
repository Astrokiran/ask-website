"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

const pricingPlans = [
  {
    duration: "5 min",
    price: "51",
    features: [
      "Quick Overview",
      "One Question",
      "Basic Guidance"
    ]
  },
  {
    duration: "10 min",
    price: "199",
    features: [
      "Detailed Reading",
      "Multiple Questions",
      "Personalized Advice"
    ]
  },
  {
    duration: "20 min",
    price: "399",
    features: [
      "Comprehensive Analysis",
      "In-depth Discussion",
      "Future Predictions",
      "Written Summary"
    ],
    popular: true
  },
  {
    duration: "30 min",
    price: "599",
    features: [
      "Complete Reading",
      "Multiple Topics",
      "Detailed Predictions",
      "Follow-up Support",
      "Priority Booking"
    ]
  }
]

const benefits = [
  {
    title: "Flexible Duration",
    description: "Choose the consultation length that fits your needs and schedule",
    icon: "⏱️"
  },
  {
    title: "Expert Astrologers",
    description: "Experienced professionals with years of astrological expertise",
    icon: "🛡️"
  },
  {
    title: "Personalized Guidance",
    description: "Get answers tailored to your specific life situations",
    icon: "💬"
  }
]

const faqs = [
  {
    question: "How does the consultation work?",
    answer: "Our consultations are conducted via phone or video call. Once you book a slot, you'll receive confirmation with connection details."
  },
  {
    question: "What happens if the call drops?",
    answer: "If technical issues occur, we'll immediately reconnect and ensure you get your full consultation time."
  },
  {
    question: "Can I extend my consultation time?",
    answer: "Yes, if the astrologer is available, you can extend your session at the applicable rate."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, and net banking options."
  }
]

const whatsappNumber = "+918197503574";
const message = "Hello, I would like to get an astrology consultation.";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


export default function Pricing() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-purple-50/30 dark:from-orange-950/20 dark:via-transparent dark:to-purple-950/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(251,146,60,0.1)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(251,146,60,0.05)_0%,transparent_50%)]"></div>

        <div className="relative py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-purple-600 to-orange-500 bg-clip-text text-transparent mb-6">
                Expert Astrological Consultation
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover your path with personalized astrological guidance from our experienced consultants
              </p>
              <div className="flex justify-center mt-8">
                <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Choose Your Consultation Plan</h2>
            <p className="text-muted-foreground">Flexible options to suit your needs and budget</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`relative group`}
              >
                <div
                  className={`rounded-3xl border backdrop-blur-sm p-8 relative h-full transition-all duration-300 ${
                    plan.popular
                      ? 'border-orange-500/50 bg-gradient-to-br from-orange-50/80 to-purple-50/80 dark:from-orange-950/30 dark:to-purple-950/30 shadow-2xl shadow-orange-500/10'
                      : 'border-border bg-card/80 hover:border-orange-300/50 hover:shadow-lg'
                  }`}
                >
                  {/* Glow effect for popular */}
                  {plan.popular && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-orange-500/20 rounded-3xl blur-xl -z-10"></div>
                  )}

                  {plan.popular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-purple-600 text-white px-6 py-2 text-sm font-semibold rounded-full shadow-lg">
                      Most Popular ⭐
                    </span>
                  )}

                  <div className="text-center mb-8">
                    <div className="text-2xl font-bold text-orange-500 mb-2">{plan.duration}</div>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-extrabold text-foreground">₹{plan.price}</span>
                    </div>
                    <p className="text-muted-foreground mt-2">per session</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-6 font-semibold text-lg rounded-2xl transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                    }`}
                    onClick={() => window.open(whatsappLink, '_blank')}
                  >
                    Book on WhatsApp
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-muted/30"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Our Consultation</h2>
            <p className="text-muted-foreground">Experience the difference with our expert guidance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-orange-300/50 transition-all duration-300 hover:shadow-lg">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our consultations</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-orange-300/50 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-purple-50/30 dark:from-orange-950/20 dark:via-transparent dark:to-purple-950/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.05)_0%,transparent_70%)]"></div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card/80 backdrop-blur-sm rounded-3xl p-12 border border-border/50 shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Discover Your Path?</h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Book your consultation now and get personalized astrological guidance from our expert astrologers
            </p>
            <div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold py-6 px-12 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.open(whatsappLink, '_blank')}
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                </svg>
                Book Your Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}