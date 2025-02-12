import { Users2, Clock, Target, Star } from "lucide-react"

const stats = [
  {
    label: "Expert Astrologers",
    value: "500+",
    icon: Users2,
  },
  {
    label: "Consultations",
    value: "50,000+",
    icon: Clock,
  },
  {
    label: "Accuracy rate",
    value: "98%",
    icon: Target,
  },
  {
    label: "Average Rating",
    value: "4.8★",
    icon: Star,
  },
]

export function StatsSection() {
  return (
    <div className="bg-[#1a1b2e] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <stat.icon className="w-8 h-8 text-yellow-500 mb-4" />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

