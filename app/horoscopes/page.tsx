"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import { HeroSection } from "@/components/hero-section";
import { ZodiacSignGrid } from "@/components/daily-horoscope/zodiac-sign-grid";
import { Button } from "@/components/ui/button";
import { useHoroscopeStore } from "@/store/horoscope";
import { DailyHoroscopeCta } from "@/components/banners/Daily-horoscope";

export default function HoroscopesPage() {

  return (
    <div>
      <main>
        <NavBar />
          <DailyHoroscopeCta phoneNumber={"918197503574"}/>;
          <ZodiacSignGrid/> 
      </main>
      <Footer />
    </div>
  );
}
