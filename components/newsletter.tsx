import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <div className="py-20 bg-[#1a1b2e]">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Receive Daily Cosmic Insights</h2>
        <p className="text-gray-400 mb-8">Subscribe to our newsletter for daily horoscopes and spiritual guidance</p>
        <form className="flex flex-col sm:flex-row gap-4">
          <Input type="email" placeholder="Enter your email" className="bg-[#252642] border-[#252642] text-white" />
          <Button className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap">Subscribe</Button>
        </form>
      </div>
    </div>
  )
}

