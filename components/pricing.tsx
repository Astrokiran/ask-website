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

const whatsappNumber = "+919353703571";
const message = "Hello, I would like to get an astrology consultation.";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


export default function Pricing() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Expert Astrological Consultation</h1>
          <p className="text-gray-400">
            Discover your path with personalized astrological guidance from our experienced consultants
          </p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg border ${plan.popular ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-200'
                } p-8 relative`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-sm rounded-bl-lg rounded-tr-lg">
                  Popular
                </span>
              )}
              <div className="text-center mb-8">
                <p className="text-gray-600">{plan.duration}</p>
                <p className="text-4xl font-bold mt-2">₹{plan.price}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-orange-500">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.popular ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                onClick={() => window.open(whatsappLink, '_blank')}
              >
                Book Now
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Consultation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Path?</h2>
          <p className="text-gray-600 mb-8">
            Book your consultation now and get personalized astrological guidance
          </p>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600"
            onClick={() => window.open(whatsappLink, '_blank')}>
            Book Your Consultation
          </Button>
        </div>
      </div>
    </div>
  )
}