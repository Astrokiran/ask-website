import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

interface HoroscopeCardProps {
  name: string;
  date: string;
  icon: string;
  prediction: string;
}

export const zodiacData = [
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
        <Link href={`/horoscopes/${zodiacData.filter((x) => x.name===name)[0].id}/`}>
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
