"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, MapPinIcon, MailIcon, UserIcon, PhoneIcon, Loader } from "lucide-react";
import LocationField from "@/components/ui/location-field";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { downloadPDF } from '@/lib/utils';

// Define validation schema
const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[6-9]\d{9}$/, "Phone number must be valid indian number"),
  dob: z.string().min(1, "Date of birth is required"),
  time: z.string().min(1, "Time of birth is required"),
  place: z.string().min(1, "Place of birth is required"),
  lat: z.string().min(1, "Latitude is required"),
  long: z.string().min(1, "Longitude is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function BirthDetailsForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formComplete, setFormComplete] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
    mode: "onChange",
  });

  // Monitor form state to enable/disable submit button
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      const { fullName, email, phone, dob, time, place, lat, long } = form.getValues();

      // Check if all required fields are filled
      const isComplete =
        fullName &&
        email &&
        phone &&
        dob &&
        time &&
        place &&
        lat &&
        long;

      setFormComplete(!!isComplete);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(data: FormValues) {
    setLoading(true);

    try {
      // Format lat and long to have at most 6 decimal places
      const formattedLat = parseFloat(data.lat || "0").toFixed(6);
      const formattedLong = parseFloat(data.long || "0").toFixed(6);

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
        if (window.confirm("Your birth chart is ready. Do you want to download it now?")) {
          try {
            // Attempt to download using our utility
            await downloadPDF(kundliData.pdf_url, `${data.fullName}-kundli.pdf`);
            router.push('/');
          } catch (error) {
            // If download fails, fallback to opening in new tab
            console.warn('Direct download failed, falling back to new tab');
            window.open(kundliData.pdf_url, '_blank');
            router.push('/');
          }
        } else {
          router.push('/');
        }
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
    <div>
      <NavBar />

      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-center mb-4">Enter Your Birth Details</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            All fields are required <span className="text-red-500">*</span>
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Personal Information</h3>

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            {...field}
                            placeholder="Full Name"
                            className="pl-10"
                            required
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email Address
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MailIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            type="email"
                            {...field}
                            placeholder="Email Address"
                            className="pl-10"
                            required
                          />
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
                      <FormLabel>
                        Phone Number
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            type="tel"
                            {...field}
                            placeholder="Phone Number"
                            className="pl-10"
                            required
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Birth Details</h3>

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date of Birth
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            type="date"
                            {...field}
                            className="pl-10"
                            required
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Time of Birth
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            type="time"
                            {...field}
                            className="pl-10"
                            required
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                <LocationField form={form} required={true} />
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading || !formComplete}
              >
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
      <Footer />
    </div>
  );
}