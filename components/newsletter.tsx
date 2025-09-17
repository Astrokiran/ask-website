import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Stay Updated</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Subscribe to our newsletter for daily horoscopes and astrological insights</p>
        <form className="flex flex-col sm:flex-row gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
          <Button className="bg-orange-600 hover:bg-orange-700 text-white whitespace-nowrap">Subscribe</Button>
        </form>
      </div>
    </div>
  )
}

