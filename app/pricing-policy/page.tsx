import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";

export default function PricingPolicyPage() {
  return (
    <div>
      <NavBar/>
      
      <section className="container mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Pricing Policy</h2>
        <Card className="max-w-4xl mx-auto p-6 shadow-lg">
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Price Range</h3>
              <p>At AstroKiran, we have customized pricing according to the services rendered by us. The details are provided to you beforehand based on the effort, efficiency, and the output of the service. Typically, the range of transactions on our WhatsApp service varies from INR 50 to 500 per user per session.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Schedule of Payment</h3>
              <p>There is no scheduled payment for our services. Users are charged based on their session usage, and each transaction is processed individually at the time of booking or consultation.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Price Matching</h3>
              <p>At AstroKiran, we are committed to offering you the best possible prices. If you find a service that we offer—providing a similar level of professionalism and features—available from a comparable service provider at a lower price, we will be happy to review and consider a price match.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Sale Adjustment</h3>
              <p>If a service that you have purchased is reduced in price within one week of your booking date, we will not be able to adjust the sale price for you. Please note that we cannot make sale adjustments. If you have booked a session, we generally cannot reschedule it to another date. This will result in the cancellation of the booking/order(s). Please refer to our cancellation policies for more details.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Pricing Errors</h3>
              <p>We strive to ensure the accuracy of our pricing. However, errors may occur despite our best efforts. If a service's price is higher than the price displayed, we will cancel your booking and notify you of the cancellation.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Terms of Service</h3>
              <p>Our service is offered for sale by Pixel Forge Tech PVT LTD for your personal needs. We reserve the right to refuse service to any person whom we believe may be misusing the service.</p>
              <p className="mt-4">For any support or inquiries, please reach out to us at <strong>support@astrokiran.com</strong>.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
