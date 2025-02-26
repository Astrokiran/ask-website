import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";

export default function DisclaimerPage() {
    return (
        <div>
            <NavBar />

            <section className="container mx-auto py-10 px-4">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Disclaimer</h2>
                <Card className="max-w-4xl mx-auto p-6 shadow-lg">
                    <CardContent className="space-y-6">
                        <p>
                            The information and data contained on the AstroKiran website and WhatsApp services are to be treated purely for entertainment purposes only. Any prediction or message that you receive is not a substitute for advice, programs, or treatment that you would normally receive from a licensed professional such as a lawyer, doctor, psychiatrist, or financial advisor. Accordingly, AstroKiran provides no guarantees, implied warranties, or assurances of any kind and will not be responsible for any interpretation made or use by the recipient of the information and data mentioned above.
                        </p>

                        <p>
                            Moreover, AstroKiran is a product of Pixel Forge Tech PVT LTD. All transactions and gathered data are accessed and managed by AstroKiran in accordance with our privacy policy and terms of service.
                        </p>

                        <p>
                            For any concerns or inquiries, please contact us at <strong>support@astrokiran.com</strong>.
                        </p>
                    </CardContent>
                </Card>
            </section>

            <Footer />
        </div>
    );
}