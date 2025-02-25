import { HoroscopeCard } from "./horoscope-card";

const zodiacSigns = [
    { name: "Aries", date: "Mar 21 - Apr 19", icon: "♈", id: "1" },
    { name: "Taurus", date: "Apr 20 - May 20", icon: "♉", id: "2" },
    { name: "Gemini", date: "May 21 - Jun 20", icon: "♊", id: "3" },
    { name: "Cancer", date: "Jun 21 - Jul 22", icon: "♋", id: "4" },
    { name: "Leo", date: "Jul 23 - Aug 22", icon: "♌", id: "5" },
    { name: "Virgo", date: "Aug 23 - Sep 22", icon: "♍", id: "6" },
    { name: "Libra", date: "Sep 23 - Oct 22", icon: "♎", id: "7" },
    { name: "Scorpio", date: "Oct 23 - Nov 21", icon: "♏", id: "8" },
    { name: "Sagittarius", date: "Nov 22 - Dec 21", icon: "♐", id: "9" },
    { name: "Capricorn", date: "Dec 22 - Jan 19", icon: "♑", id: "10" },
    { name: "Aquarius", date: "Jan 20 - Feb 18", icon: "♒", id: "11" },
    { name: "Pisces", date: "Feb 19 - Mar 20", icon: "♓", id: "12" },
  ];

interface Horoscope {
    zodiac: string;
    prediction: string;
    date: string;
    timestamp: string;
}

export interface ZodiacSignGridProps {
    horoscopes: Horoscope[];
}

export function ZodiacSignGrid( {horoscopes}: ZodiacSignGridProps) {
    return (
        <section className="container max-w-7xl mx-auto px-4 md:py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Daily Horoscope by Zodiac Sign</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {horoscopes.map((horoscope) => (
            <HoroscopeCard
            name={zodiacSigns.filter(sign => sign.id === horoscope.zodiac)[0].name}
            date={zodiacSigns.filter(sign => sign.id === horoscope.zodiac)[0].date}
            icon={zodiacSigns.filter(sign => sign.id === horoscope.zodiac)[0].icon}
            prediction={horoscope.prediction}
            key={horoscope.zodiac}
            />
          ))}
        </div>
      </section>
    )
}