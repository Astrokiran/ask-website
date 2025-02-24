"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, MapPinIcon, MailIcon, UserIcon, PhoneIcon } from "lucide-react";
import LocationField from "@/components/ui/location-field";

export default function BirthDetailsForm() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      time: "",
      place: "",
    },
  });

  async function onSubmit(data: any) {
    setLoading(true);
    setReport(null);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to fetch report");

      const reportData = await response.json();
      setReport(reportData);
    } catch (error) {
      console.error("Error fetching astrology report:", error);
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

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              {loading ? "Generating Report..." : "Generate Birth Chart"}
            </Button>
          </form>
        </Form>

        {report && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Astrology Report</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm">{JSON.stringify(report, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}