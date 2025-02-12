import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const astrologers = Array(6).fill({
  name: "Pandit Sharma",
  title: "Vedic Astrologer",
  rating: 4.8,
  reviews: 52,
})

export function FeaturedAstrologers() {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Astrologers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {astrologers.map((astrologer, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{astrologer.name}</h3>
                  <p className="text-sm text-gray-600">{astrologer.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {astrologer.rating} ({astrologer.reviews})
                </span>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">Book Now</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

