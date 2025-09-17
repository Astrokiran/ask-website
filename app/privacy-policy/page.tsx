import React from "react";
import { Metadata } from 'next'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";

export const metadata: Metadata = {
  title: "Privacy Policy - Astrokiran Data Protection",
  description: "Astrokiran's privacy policy explaining how we collect, use, and protect your personal information for astrology consultations, kundli services, and horoscope readings.",
  keywords: ["privacy policy", "data protection", "astrology privacy", "personal information security"],
  alternates: {
    canonical: "https://astrokiran.com/privacy-policy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div>
      <NavBar />

      <section className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-foreground text-center mb-6">Privacy Policy</h1>
        <Card className="max-w-4xl mx-auto p-6 shadow-lg">
          <CardContent className="space-y-8">
            <div>
              <p>Pixelforge Tech Pvt Ltd (“PFTPL”, or “we” or “our” or “us”) operates the Astrokiran website, whatsapp business and mobile application (together “Platform”), which enables users in India (“Users”, or “you” and its grammatical variations) to access various astrological and related services.This policy (“Privacy Policy”) governs how Astrokiran collects, uses, shares, and protects the personal information disclosed to us by Users in the course of their usage of the Platform, and forms an integral part of the Terms of Service between Astrokiran and you. Accordingly, you are advised to read this Privacy Policy carefully before accessing the Platform.All words used but not defined herein shall have the meaning ascribed to them in the Terms of Service.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Information We Collect</h3>
              <p>We may collect the following types of information:</p>
              <div>
                <ol className="p-2 pl-8 space-y-1 list-decimal">
                  <li>Information you provide: When you register on the Platform, you will be required to provide us with your name, location, email address, mobile number, display picture, date of birth, place of birth, time of birth, and other relevant profile information.</li>
                  <li>Transaction details initiated by you: If you initiate a cash transaction in relation to your Astrokiran service or account, we receive and store details pertaining to such transaction, including the payment method used, the amount paid, and the date and time of the transaction.</li>
                  <li>Interaction information: When you interact with our customer support over any medium, such interactions may be recorded and stored.</li>
                  <li>Technical information about you: - We automatically collect certain information from you when you use the Platform, including your IP address, location, other unique device identifiers, your browser type, language, the URL of the website which you may have used to reach our Platform, and cookies (defined below).</li>
                  <li>Messages. When you use our Platform to communicate, we receive and store the messages you may send or receive on the Platform, and any other content you may upload or share on the Platform.</li>
                  <li>Cookies: We use cookies, small text files that uniquely identify your browser and enable Us to recognize the information you have consented to give us, to store certain types of information each time you visit any page on our Platform. These cookies do not contain any personal information and you may choose what cookies you allow by managing your cookies settings on your browser. This will allow you to delete your browser cookies or disable them entirely, however, if you choose to disable all cookies, it will affect your overall experience with our Platform— it may make parts of our Platform non-functional or inaccessible to you in such cases. Therefore, we recommend that you enable cookies for our Platform. The cookies we collect are mainly used to serve advertising banners to you and in doing so we may use the services of third parties. Such third-party service providers do not know the name, phone number, address, email address, or any personal information about you, and no personal information is collected or used in this process.</li>
                  <li>Web beacons: We use web beacons, images that are part of the web pages, also called pixel tags or clear gifs, in combination with cookies to understand how you interact with our Platform and the content therein. When you disable cookies, web beacons are also likely to become ineffective. You can also add browser extensions to specifically block web beacons.</li>
                </ol>
              </div>
              <p>Some of the information that we require you to provide on first accessing or registering on the Platform is mandatory and/or essential to the provision of our services to you, and hence if you do not provide such mandatory information, you may not be able to access some of the features of the Platform.It is clarified that in the event you make any payments through the Platform, we will not store any payment or card related information which you may provide in the course of making such payments, such as card number, account number, validity date, expiry date or CVV number.</p>
            </div>

            <div>
              <h3 className="text-l font-semibold mb-2">How We Use Your Information</h3>
              <p>We use this information to enable your access and use of the Platform, process cash transactions, facilitate your participation in various types of services and events on the Platform, market our Services or products or services of our group companies, affiliates and subsidiaries to You, send you ASK service-related emails and communications, handle support requests, perform internal operations, verify and identify Users and their accounts, measure and understand the effectiveness of the promotions, and advertisements we serve to you and others, personalize the Platform for you, provide you with customer support, and enforce our Platform Policies.</p>
              <p>In accordance with TRAI regulations, we would like to inform you that we may reach out to users registered on the National Do Not Call (DND) registry through calls and SMS for essential communications related to our services.</p>
            </div>

            <div>
              <h3 className="text-l font-semibold mb-2">How We Store Your Information</h3>
              <p>We store your information on secure servers in a controlled environment. We take reasonable measures to protect your information from unauthorized access, use, or disclosure.</p>
            </div>

            <div>
              <h3 className="text-l font-semibold mb-2">How We Share Your Information</h3>
              <p>We do not share your personal information with any third parties except as follows:</p>
              <div>
                <ul className="list-disc pl-5 p-2">
                  <li>We may share your information with our service providers who help us operate our platform.</li>
                  <li>We may share your information with law enforcement or other government officials if required by law.</li>
                  <li>We may share your information with other users of the platform if you consent to such sharing.</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-l font-semibold mb-2">How Long We Retain Your Information</h3>
              <p>We will retain your information for as long as is necessary to provide you with our services. We may also retain your information for a longer period if we are required to do so by law or if we believe that it is necessary to protect our interests.</p>
              <p className="mt-4">For any support or inquiries, please reach out to us at <strong>support@astrokiran.com</strong>.</p>
            </div>

            <div>
              <h3 className="text-l font-semibold mb-2">Your Rights and Preferences</h3>
              <p>You have the right to access, correct, and delete your personal information. You can also object to the processing of your personal information or withdraw your consent at any time.</p>
              <p>To exercise your rights, please contact us at <strong>support@astrokiran.com</strong>.</p>
            </div>

            <div>
              <h3 className="text-l font-semibold mb-2">Security and Protection of Your Information</h3>
              <p>We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no system is completely secure. We cannot guarantee the security of your personal information.</p>
            </div>

            <div>
              <h3 className="text-l font-semibold mb-2">Information Relating to Children</h3>
              <p>We do not collect any information from children under the age of 13. If we become aware that we have collected information from a child under the age of 13, we will delete that information as soon as possible.</p>
            </div>

            <div>
              <h3 className="text-l font-semibold mb-2">Third Party Platforms and Services</h3>
              <p>The Platform may use third-party platforms and services, such as Google Analytics, to track and analyze user activity. These third parties may collect information about your use of the platform, such as your IP address, browser type, and pages visited.</p>
            </div>

            <div>
              <h3 className="text-l font-semibold mb-2">How to Contact Us</h3>
              <p>If you have any questions about our privacy policy, please contact us at <strong>support@astrokiran.com</strong>.</p>
            </div>

            <div>
              <h3 className="text-l font-semibold mb-2">Changes to This Privacy Policy</h3>
              <p>We may update this privacy policy from time to time. We will notify you of any changes to this privacy policy by posting them on our website.</p>
              <p>We encourage you to review this privacy policy periodically.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
