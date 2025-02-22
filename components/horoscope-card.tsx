import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

interface HoroscopeCardProps {
  name: string;
  date: string;
  icon: string;
  prediction: string;
}

const zodiacData = [
  { name: "Aries", date: "Mar 21 - Apr 19", icon: "♈" },
  { name: "Taurus", date: "Apr 20 - May 20", icon: "♉" },
  { name: "Gemini", date: "May 21 - Jun 20", icon: "♊" },
  { name: "Cancer", date: "Jun 21 - Jul 22", icon: "♋" },
  { name: "Leo", date: "Jul 23 - Aug 22", icon: "♌" },
  { name: "Virgo", date: "Aug 23 - Sep 22", icon: "♍" },
  { name: "Libra", date: "Sep 23 - Oct 22", icon: "♎" },
  { name: "Scorpio", date: "Oct 23 - Nov 21", icon: "♏" },
  { name: "Sagittarius", date: "Nov 22 - Dec 21", icon: "♐" },
  { name: "Capricorn", date: "Dec 22 - Jan 19", icon: "♑" },
  { name: "Aquarius", date: "Jan 20 - Feb 18", icon: "♒" },
  { name: "Pisces", date: "Feb 19 - Mar 20", icon: "♓" },
];
export function HoroscopeCard({ name, date, icon, prediction }: HoroscopeCardProps) {

  return (
    <Card
      key={name}
      className="transition-transform hover:-translate-y-1"
    >
      <CardContent className="p-6">
        <div className="mb-4 text-4xl">{icon}</div>
        <h3 className="mb-1 text-xl font-semibold">{name}</h3>
        <p className="mb-3 text-sm text-gray-500">{date}</p>
        <p className="mb-4 text-gray-600">{prediction?.substring(0, 100)}</p>
        <Link href={`/horoscopes/1/`}>
        <Button
          variant="link"
          className="p-0 text-[#FF7B51] hover:text-[#ff6b3c]"
        >
          Read More
        </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
