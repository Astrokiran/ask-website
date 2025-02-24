import { useHoroscopeStore } from "@/store/horoscope";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Horoscope } from "@/types/horoscope";
import React, { useEffect, useState } from "react";
import { StarRating } from "./ui/star-rating";
import {Briefcase, Home, CurrencyIcon, Handshake, HeartPulse, Dumbbell, SmileIcon, Plane, Heart } from "lucide-react";


type SubCategory = "career" | "family" | "finances" | "friends" | "health" | "physique" | "status" | "travel" | "relationship";

export const SubCategoryIcons: Record<SubCategory, React.ComponentType> = {
    "career": Briefcase,
    "family": Home,
    "finances": CurrencyIcon,
    "friends": Handshake,
    "health": HeartPulse,
    "physique": Dumbbell,
    "status": SmileIcon,
    "travel": Plane,
    "relationship": Heart

  }

export function HoroscopeDetails({zodiac}: {zodiac: string}) {

    const { getHoroscopeByZodiac } = useHoroscopeStore()
    const [horoscope, setHoroscope] = useState<Horoscope | null>(null)

    useEffect(() => {
        console.log('zodiac', zodiac)
        const horoscope = getHoroscopeByZodiac(zodiac)
        if (horoscope) {
            setHoroscope(horoscope)
        }
    }, [])

    return (
        <section className="container max-w-7xl mx-auto px-4 md:py-10">
            <Card className="transition-transform hover:-translate-y-1">
                <CardContent className="mx-auto pt-5">
                    <h3 className="font-bold text-2xl mb-10 text-gray-800">Today's Overview</h3>
                    <p className="text-gray-600">{horoscope?.prediction}</p>
                    <div className="mt-8">
                        <StarRating rating={parseInt(horoscope?.subCategories?.filter(category=>category.name==='total_score')[0].score || '0')} />
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {horoscope?.subCategories?.map((category) => (
                (category.name !== 'total_score' && <Card key={category.name} className="mt-10 transition-transform hover:-translate-y-1">
                    <CardHeader>
                        <div className="p-1 rounded-lg">
                            {SubCategoryIcons[category.name as SubCategory] && React.createElement(SubCategoryIcons[category.name as SubCategory], { className: "w-10 h-10 text-orange-500 mb-4 " })}
                            <h3 className="capitalize text-xl font-semibold mb-2">{category.name}</h3>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">{category.prediction}</p>
                        <div className="mt-5">
                            <StarRating rating={parseInt(category.score)} />
                        </div>
                    </CardContent>
                </Card>)
            ))}
            </div>
        </section>
    )
} 