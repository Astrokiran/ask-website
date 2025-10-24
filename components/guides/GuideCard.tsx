// file: components/guides/GuideCard.tsx

"use client"; // <-- This is essential for using onClick handlers

import { useState } from 'react';
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
import { Star, Briefcase, Languages, IndianRupee, Gift, Tag } from 'lucide-react';
import type { Guide } from '@/types/guide'; // Import the type
import { redirectToAppStore } from '@/lib/deviceDetection'; // Import the function
import ChatFlowManager from '@/components/chat/ChatFlowManager';
import { usePricing } from '@/hooks/usePricing';

// Helper to get the first initial of the name for the avatar fallback
const getInitials = (name: string) => (name ? name.charAt(0).toUpperCase() : '');

export const GuideCard = ({ guide }: { guide: Guide }) => {
    const [showChatFlow, setShowChatFlow] = useState(false);
    const { pricingInfo, loading } = usePricing(guide.price_per_minute);

    // This function will be called when the button is clicked
    const handleChatNow = () => {
        setShowChatFlow(true);
    };

    const handleChatStarted = (consultationId: string, pairId: string) => {
        console.log('Chat started:', { consultationId, pairId });
        // Here you can navigate to the chat page or open a chat modal
        // For now, we'll just log it
        setShowChatFlow(false);

        // TODO: Navigate to chat page or open chat modal
        // router.push(`/chat/${consultationId}`);
    };

    return (
        <>
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
                    {/* Dynamic Pricing Display */}
                    <div className="space-y-2">
                        {loading ? (
                            <div className="animate-pulse">
                                <div className="h-5 bg-gray-200 rounded w-20"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-1">
                                {/* Main Price Display */}
                                <div className={`flex items-center font-bold text-base ${
                                    pricingInfo.isFree
                                        ? 'text-green-600'
                                        : pricingInfo.discountType !== 'none'
                                            ? 'text-orange-600'
                                            : 'text-green-600'
                                }`}>
                                    {pricingInfo.isFree ? (
                                        <>
                                            <Gift className="h-4 w-4 mr-1" />
                                            <span>{pricingInfo.displayPrice}</span>
                                        </>
                                    ) : pricingInfo.discountType !== 'none' ? (
                                        <>
                                            <Tag className="h-4 w-4 mr-1" />
                                            <span>{pricingInfo.displayPrice}</span>
                                        </>
                                    ) : (
                                        <>
                                            <IndianRupee className="h-4 w-4 mr-1" />
                                            <span>{pricingInfo.displayPrice}</span>
                                        </>
                                    )}
                                </div>

                                {/* Original Price (if discounted) */}
                                {pricingInfo.discountType !== 'none' && !pricingInfo.isFree && (
                                    <div className="flex items-center text-sm text-gray-500 line-through">
                                        <IndianRupee className="h-3 w-3 mr-1" />
                                        <span>{pricingInfo.originalPrice}</span>
                                    </div>
                                )}

                                {/* Offer Description */}
                                {pricingInfo.offerDescription && (
                                    <div className="text-xs text-blue-600 font-medium">
                                        {pricingInfo.offerDescription}
                                        {pricingInfo.remainingFreeMinutes && (
                                            <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                {pricingInfo.remainingFreeMinutes} min
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
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

            {/* Chat Flow Manager */}
            <ChatFlowManager
                guide={guide}
                isOpen={showChatFlow}
                onClose={() => setShowChatFlow(false)}
                onChatStarted={handleChatStarted}
            />
        </>
    );
};