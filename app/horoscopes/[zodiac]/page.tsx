"use client";

import { useEffect, useState } from "react";
import { NavBar } from "../../../components/nav-bar";
import { Footer } from "../../../components/footer";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useHoroscopeStore } from "@/store/horoscope";
import { zodiacData } from "@/components/horoscope-card";
import { HoroscopeDetails } from "@/components/horoscope-details";
import { Newsletter } from "@/components/newsletter";

interface HoroscopeDetails {
  zodiac: string;
  prediction: string;
  date: string;
  timestamp: string;
}

export default function HoroscopeDetailsPage({
  params,
}: {
  params: { zodiac: string };
}) {

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <NavBar />
        <section className="relative py-20 bg-[#1a1b2e]">
          <div className="container relative z-10 max-w-7xl mx-auto px-4 md:py-10">
            <div className="relative z-10 container mx-auto px-4 flex items-center">
              {/* Example: If you have an Aries icon image */}
              {/* You could also just display an emoji or a custom component */}
              <h1 className="mb-4 text-8xl font-bold text-white">
                {zodiacData.filter((sign) => sign.id === params.zodiac)[0].icon}
              </h1>

              <div className="max-w-2xl ml-10">
                <h1 className="text-white text-4xl font-bold mb-2">{
                    zodiacData.filter((sign) => sign.id === params.zodiac)[0]
                      .name
                  }</h1>
                <p className="text-white text-lg">{
                    zodiacData.filter((sign) => sign.id === params.zodiac)[0]
                      .date
                  }</p>
              </div>
            </div>
          </div>
        </section>
        <HoroscopeDetails zodiac={params.zodiac} />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
