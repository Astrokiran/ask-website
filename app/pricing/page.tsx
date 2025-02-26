import { NavBar } from "@/components/nav-bar"
import Pricing from "@/components/pricing"
import { Footer } from "@/components/footer"

export default function PricingPage() {
    return (
        <div className="min-h-screen">
            <NavBar />
            <main>
                <Pricing />
            </main>
            <Footer />

        </div>
    )
}