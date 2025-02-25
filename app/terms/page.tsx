import React from "react";
import { NavBar } from "@/components/nav-bar"; // Adjust the path as needed
import { Footer } from "@/components/footer"; // Adjust the path as needed
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const TermsPage = () => {
    return (
        <div>
            {/* Navigation Bar */}
            <NavBar />

            <main className="bg-gray-50">
                <div className="mt-50">
                    <Card className="container max-w-5xl mx-auto px-4 shadow-lg p-6">
                        <CardHeader>
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms and Conditions</h1>
                        </CardHeader>
                        <CardContent className="text-gray-700 space-y-6">
                            <p>
                                AstroKiran is an online platform offered by Pixel Forge Tech Private Limited (hereinafter referred to as "AstroKiran", "We", "Us", or "Our") that enables users ("You") to use our astrology services over WhatsApp, website, and mobile applications.
                                These Terms of Service for AstroKiran ("Terms"), along with AstroKiran’s Privacy Policy ("Privacy Policy") (together, "Platform Policies"), govern the relationship between You and Us. The Terms and Privacy Policy form a binding legal agreement based on which You may visit, access, or use the AstroKiran product, website, mobile applications, and related services ("Services").
                                Your use of the Services indicates Your acceptance of the Platform Policies. You are advised to read the Platform Policies carefully before using Our Services. If You do not accept any part of the Platform Policies or any subsequent modifications, You must stop accessing or using Our Services.
                                We reserve the right to periodically review, update, or otherwise modify any part of the Platform Policies at Our sole discretion. You are advised to keep Yourself updated on the latest versions of the Platform Policies. We will provide You with notice of any material modifications, and Your continued use of the Services after such notification constitutes consent to the modified Platform Policies.
                                If one or more of the terms herein are determined to be invalid or unlawful by a competent authority in India, the remaining terms will remain valid and binding.

                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800">2. Overview of Services</h2>
                            <p>
                                AstroKiran offers astrological services such as astrological content, reports, data, telephone, video, and email consultations, and other related services.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800">3. Registration and Eligibility</h2>
                            <p>
                                Only individuals legally capable of entering into binding contracts under the Indian Contract Act, 1872, may access the Platform and use Our Services. Minors under the age of 18 (eighteen) years are prohibited from registering or using Our Services. We reserve the right to refuse or terminate access to Our Services if it is discovered that You are not legally competent to contract.
                                You may access Our Services via WhatsApp using Your phone number ("Login Details"). However, You are expressly prohibited from:

                            </p>
                            <div>
                                <ul className="list-disc pl-5 p-2">
                                    <li>Providing false or misleading personal information or creating an account on behalf of someone else without their explicit consent.</li>
                                    <li>Using another person’s Login Details with the intention of impersonating them.</li>
                                </ul>
                            </div>

                            <h2 className="text-2xl font-semibold text-gray-800">4. Usage of Services</h2>
                            <p>
                                You can use the Services via WhatsApp, website, or mobile applications available on Google Play and the Apple App Store.
                                When You access Our Services and/or create an AstroKiran account, We may collect, use, share, and store Your information, including personal and sensitive information, to ensure effective service delivery. The collection and usage of such information are governed by the Privacy Policy.
                                By agreeing to these Terms, You consent to Us arranging a call with You on Your mobile number, even if it is registered under a Do Not Disturb (DND) service.
                                You agree to receive promotional and service messages from Us and Our affiliates via SMS, email, calls, and push notifications. You may withdraw consent by emailing <a href="mailto:support@astrokiran.com" className="text-blue-600 hover:underline">support@astrokiran.com</a>.
                                We are not responsible for connectivity issues, local internet disruptions, or device-related problems affecting Your usage of Our Services.
                                You are responsible for protecting Your devices from malware, viruses, spyware, and other harmful software. We shall not be liable for damages resulting from Your use or misuse of Our Platform.

                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800">5. Restrictions on Use</h2>
                            <p>You shall not:</p>
                            <ul className="list-disc pl-5">
                                <li>Upload, distribute, transmit, publish, or share content that is defamatory, obscene, invasive of privacy, misleading, or violates any applicable law.</li>
                                <li>Infringe any patent, trademark, copyright, or proprietary rights.</li>
                                <li>Impersonate another person or engage in fraudulent activities.</li>
                                <li>Host, intercept, emulate, or redirect Our proprietary communication protocols.</li>
                                <li>Frame Our Services, impose editorial comments, or alter content.</li>
                                <li>Use Our Services for commercial purposes without authorization.</li>
                                <li>Engage in fraudulent payment activities.</li>
                                <li>Send spam emails or unsolicited communications to other users.</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-800">6. Payments</h2>
                            <p>
                                You agree to pay applicable fees for accessing Our Services. Fees are subject to periodic review and revision. Your network provider may impose additional charges.
                                All payments must be made in Indian Rupees (INR). Payments via credit/debit cards, net banking, and other methods are processed through third-party payment gateways. We are not responsible for payment delays or denials at their end.
                                Pixel Forge Tech Pvt Ltd will issue a GST-compliant invoice, which will be sent to Your WhatsApp number.

                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800">7. Refund Policy</h2>
                            <p>Refunds may be requested under the following conditions:</p>
                            <ul className="list-disc pl-5">
                                <li>Network issues that disrupted the chat or call, including weak signal, background noise, or inaudibility of the astrologer.</li>
                                <li>The astrologer was unable to communicate fluently in the listed language.</li>
                                <li>The astrologer took excessive time to respond.</li>
                                <li>The astrologer provided irrelevant responses.</li>
                            </ul>
                            <p>Refund requests must be raised within 180 days of payment. Once your refund request is received, it will be processed within two (2) weeks from the date of submission. The refunded amount will be credited to the original payment source used to make the payment. Approved refunds will be processed after deducting applicable transaction fees.</p>
                            <p>Refunds will <b>not</b> be granted if:</p>
                            <ul className="list-disc pl-5">
                                <li>The order has already entered processing (an astrologer has been assigned).</li>
                                <li>Incorrect information was provided by You.</li>
                                <li>The provided contact number was unreachable at the time of the call session.</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-800">8. Disclaimer, Indemnity, and Limitation of Liability</h2>
                            <ul className="list-disc pl-5">
                                <li>AstroKiran is not liable for any loss, damages, or expenses incurred by You in connection with Our Services.</li>
                                <li>
                                    <p className="mb-2">To the maximum extent permitted by law, you agree to indemnify and hold harmless the Company, its officers, directors, and employees from and against any losses, damages, costs, expenses, and claims arising from:</p>
                                    <ol className="list-[lower-roman] pl-8 space-y-1">
                                        <li>Your use of the Services;</li>
                                        <li>Your violation of these Terms of Use or the Privacy Policy;</li>
                                        <li>Any infringement of intellectual property or other rights belonging to the Company or a third party; or</li>
                                        <li>Your non-compliance with any applicable laws.</li>
                                    </ol>
                                </li>
                                <li>
                                    <p className="mb-2">To the fullest extent permitted by law, the Company and its affiliates shall not be liable for any direct, indirect, special, incidental, punitive, exemplary, or consequential damages related to the Platform and/or Services, regardless of the legal basis, including warranty, contract, or tort (such as negligence), even if the Company has been advised of the possibility of such damages. You acknowledge that under no circumstances, including negligence, shall the Company be liable to you or any other person or entity for any direct or indirect damages, including but not limited to loss of profits, goodwill, data, or any other intangible losses, arising from:</p>
                                    <ul>
                                        <li>Your use or inability to use the Platform and/or Services;</li>
                                        <li>Your reliance on statements or representations made by the Company while providing the Services; or</li>
                                        <li>Any other matter relating to the Platform and/or Services.</li>
                                    </ul>
                                </li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-800">9. Intellectual Property Rights</h2>
                            <p>
                                AstroKiran and its affiliates exclusively own all intellectual property, including trademarks, copyrights, patents, and proprietary technology related to the Platform. You are granted a <b>limited</b>,<b> non-transferable right</b> to use Our Services but have no ownership over any intellectual property.
                                You may not reverse-engineer, modify, or distribute any part of Our Services without Our written consent.

                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800">10. Complaints and Disputes</h2>

                            <p>
                                <strong>Grievance Officer:</strong><br />
                                Name: Ankit Gupta<br />
                                Designation: CEO<br />
                                Email: <a href="mailto:ankit@pixelforgetechnology.com" className="text-blue-600 hover:underline">ankit@pixelforgetechnology.com</a>
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800">11. Governing Law, Dispute Resolution & Jurisdiction</h2>
                            <p>
                                The Platform Policies are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of civil courts in Bengaluru, Karnataka.
                                Disputes must first be notified in writing. If unresolved within 30 days, arbitration will be conducted before a three-member tribunal in Bangalore, per the Arbitration and Conciliation Act, 1996. The decision will be final and binding. AstroKiran may seek injunctive relief in a court of competent jurisdiction.
                            </p>
                            <div>
                                <p>
                                    <strong>YOU HAVE FULLY READ AND UNDERSTOOD THESE TERMS AND VOLUNTARILY AGREE TO ALL PROVISIONS</strong>
                                </p>
                            </div>
                            <p className="text-gray-600 text-sm mt-4">
                                <i>Last updated: 25th February 2025</i>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default TermsPage;