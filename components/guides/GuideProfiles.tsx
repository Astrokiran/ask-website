import { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircularProgress, Box } from '@mui/material';
import { Star, Briefcase, Languages, IndianRupee } from 'lucide-react';

// The new public API endpoint
const GUIDES_API_URL = process.env.NEXT_PUBLIC_HOROSCOPE_API_URL || 'https://devazstg.astrokiran.com/auth';

// A reusable component to display a single guide in a card format
const GuideCard = ({ guide }) => {
    // Helper to get the first initial of the name for the avatar fallback
    const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '';

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
                 <Button className="w-full" variant={guide.online ? 'default' : 'secondary'}>
                    {guide.online ? (guide.is_busy ? 'Busy' : 'Chat Now') : 'Chat Now'}
                </Button>
            </CardFooter>
        </Card>
    );
};


// The main component to fetch and display the list of all guides
export const GuidesListPage = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await fetch(`${GUIDES_API_URL}/api/v1/public/guide/all`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                
                // Set the guides from the 'data.guides' array in the response
                if (data.success && Array.isArray(data.data.guides)) {
                    setGuides(data.data.guides);
                } else {
                     throw new Error('API response format is incorrect.');
                }

            } catch (err) {
                console.error("Failed to fetch guides:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, []); // Empty dependency array means this effect runs once on mount

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Our Expert Guides</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {guides.map((guide) => (
                    <GuideCard key={guide.id} guide={guide} />
                ))}
            </div>
        </div>
    );
};