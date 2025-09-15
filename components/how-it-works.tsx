export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Choose Your Expert",
      description: "Browse through our verified astrologers",
    },
    {
      number: "2",
      title: "Book Consultation",
      description: "Select time slot & make payment",
    },
    {
      number: "3",
      title: "Receive Divine Guidance",
      description: "Get accurate predictions & solutions",
    },
  ]

  return (
    <div className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900 dark:text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 font-medium">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

