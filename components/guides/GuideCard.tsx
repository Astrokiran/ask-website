// file: components/guides/GuideCard.tsx

"use client"; // <-- This is essential for using onClick handlers

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, Briefcase, Languages, IndianRupee } from 'lucide-react';
import type { Guide } from '@/types/guide'; // Import the type
import { redirectToAppStore } from '@/lib/deviceDetection'; // Import the function

// Helper to get the first initial of the name for the avatar fallback
const getInitials = (name: string) => (name ? name.charAt(0).toUpperCase() : '');

export const GuideCard = ({ guide }: { guide: Guide }) => {
    // This function will be called when the button is clicked
    const handleChatNow = () => {
        // Redirects the user to the appropriate app store (iOS/Android)
        redirectToAppStore();
    };

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800">
                <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarImage src={guide.profile_picture_url} alt={guide.full_name} />
                    <AvatarFallback>{getInitials(guide.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-lg font-bold">{guide.full_name}</CardTitle>
                    <CardDescription className="text-sm">
                        {guide.skills?.join(', ') || 'Astrologer'}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3 text-sm flex-grow">
                 <div className="flex items-center text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{guide.years_of_experience} years of experience</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                    <Languages className="h-4 w-4 mr-2" />
                    <span>{guide.languages?.join(', ')}</span>
                </div>
                 <div className="flex items-center font-semibold text-orange-500">
                    <Star className="h-4 w-4 mr-2 fill-current" />
                    <span>{guide.guide_stats?.rating?.toFixed(1) || 'N/A'} ({guide.guide_stats?.total_number_of_reviews || 0} reviews)</span>
                </div>
                <div className="flex items-center font-bold text-green-600 text-base">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    <span>{guide.price_per_minute} / min</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 border-t">
                 {/* UPDATED BUTTON:
                    - The text is always "Chat Now".
                    - The variant is always "default".
                    - onClick now triggers the handleChatNow function.
                 */}
                 <Button className="w-full" variant="default" onClick={handleChatNow}>
                    Chat Now
                </Button>
            </CardFooter>
        </Card>
    );
};