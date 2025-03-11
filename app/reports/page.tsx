"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, MapPinIcon, MailIcon, UserIcon, PhoneIcon, Loader } from "lucide-react";
import LocationField from "@/components/ui/location-field";
import { useRouter } from "next/navigation";


export default function BirthDetailsForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      time: "",
      place: "",
      lat: "",
      long: "",
    },
  });

  async function onSubmit(data: any) {
    setLoading(true);

    try {
      // Format lat and long to have at most 6 decimal places
      const formattedLat = parseFloat(data.lat).toFixed(6);
      const formattedLong = parseFloat(data.long).toFixed(6);

      // Use our proxy API route
      const response = await fetch('/api/kundli', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "name": data.fullName,
          "phone_number": data.phone,
          "area": data.place,
          "lat": formattedLat,
          "long": formattedLong,
          "date_of_birth": data.dob,
          "time_of_birth": data.time,
          "gender": "male"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error("Failed to generate kundli");
      }

      const kundliData = await response.json();

      if (kundliData.pdf_url) {
        // Create a hidden anchor element to download the PDF
        const link = document.createElement('a');
        link.href = kundliData.pdf_url;
        link.setAttribute('download', 'kundli.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Navigate to home after download starts
        router.push('/');
      } else {
        console.error('PDF URL not found in response');
      }
    } catch (error) {
      console.error("Error generating kundli:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4">Enter Your Birth Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Personal Information</h3>

              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input {...field} placeholder="Full Name" className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input type="email" {...field} placeholder="Email Address" className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input type="tel" {...field} placeholder="Phone Number" className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Birth Details</h3>

              <FormField control={form.control} name="dob" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input type="date" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="time" render={({ field }) => (
                <FormItem>
                  <FormLabel>Time of Birth</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input type="time" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <LocationField form={form} />
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                "Generate Birth Chart"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}