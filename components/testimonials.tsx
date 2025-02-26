import { Star } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = Array(3).fill({
  content:
    "The predictions were incredibly accurate. Impressed by the guidance I received! Would definitely recommend.",
  author: "Happy Client",
})

export function Testimonials() {
  return (
    <div className="py-20 bg-[#1a1b2e]" id="testimonials">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-[#252642] p-6 rounded-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>HC</AvatarFallback>
                </Avatar>
                <div className="text-sm text-gray-300">{testimonial.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

