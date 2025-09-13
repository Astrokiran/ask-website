import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
// --- FIX: Import contentful from a CDN to resolve the error ---
import { createClient } from 'contentful';
import { Sun, Moon, Home, Star, Sparkles, Dna, Bot } from 'lucide-react';

// --- Contentful Client Initialization ---
// Make sure to set these environment variables in your project
const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
});

// --- INTERFACES ---

interface ReportData {
    report: string;
    userName: string;
}

interface ReportProps {
    kundliData: ReportData | null;
}

// --- Interface for the image data we fetch from Contentful ---
interface ZodiacImageMap {
    [key: string]: string; // e.g., { aquarius: 'https://...', leo: 'https://...' }
}


// --- UI COMPONENT: SectionCard ---
// Redesigned for a fully responsive, side-by-side layout
const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; imageUrl?: string | null; }> = ({ title, icon, children, imageUrl }) => (
  <div className="bg-card rounded-xl shadow-md border border-orange-100 p-6 md:p-8 transition-all duration-300 hover:shadow-lg overflow-hidden">
    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-6 flex items-center">
      <span className="text-orange-500 mr-3">{icon}</span>
      {title}
    </h3>
    {/* Responsive container for content and image */}
    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
        {/* Left Side: Image (only renders if imageUrl exists) - POSITION SWITCHED & SIZE INCREASED */}
        {imageUrl && (
            <div className="flex-shrink-0 w-28 md:w-36 mx-auto md:mx-0">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-auto object-contain rounded-full bg-orange-50 p-2 shadow-sm border border-orange-100"
                />
            </div>
        )}

        {/* Right Side: Text Content */}
        <div className="prose prose-md max-w-none text-foreground leading-relaxed flex-1">
            {children}
        </div>
    </div>
  </div>
);


// --- MAIN REPORT COMPONENT ---

const ReportDetails: React.FC<ReportProps> = ({ kundliData }) => {
    // --- State for storing zodiac images from CMS and loading status ---
    const [zodiacImageMap, setZodiacImageMap] = useState<ZodiacImageMap>({});
    const [isCmsLoading, setIsCmsLoading] = useState(true);

    // --- Fetch zodiac images from Contentful on component mount ---
    useEffect(() => {
        client.getEntries<any>({ content_type: 'zodiacSigns' })
          .then((response) => {
              if (response.items) {
                  const imageMap: ZodiacImageMap = {};
                  response.items.forEach((item: any) => {
                      // Ensure all data exists before creating the map entry
                      if (item.fields.signName && item.fields.image?.fields?.file?.url) {
                          const signName = String(item.fields.signName).toLowerCase();
                          const imageUrl = `https:${item.fields.image.fields.file.url}`;
                          imageMap[signName] = imageUrl;
                      }
                  });
                  setZodiacImageMap(imageMap);
              }
          })
          .catch(error => console.error("Error fetching data from Contentful:", error))
          .finally(() => setIsCmsLoading(false));
    }, []); // Empty array ensures this runs only once

    // Loading state for the entire report
    if (!kundliData || !kundliData.report || isCmsLoading) {
        return (
            <div className="bg-background min-h-screen p-8 flex items-center justify-center">
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                    <Bot size={20} className="text-orange-500 animate-pulse" />
                    Preparing your astrological report...
                </p>
            </div>
        );
    }

    // Custom Markdown renderers
    const renderers = {
        h3: ({ node, ...props }: any) => <h3 className="text-lg font-semibold text-foreground mt-6 mb-3" {...props} />,
        p: ({ node, ...props }: any) => <p className="mb-4 text-foreground" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc list-inside space-y-3 mb-4" {...props} />,
        li: ({ node, ...props }: any) => (
            <li className="flex items-start">
                <Sparkles size={15} className="text-orange-400 mr-3 mt-1.5 flex-shrink-0" />
                <span>{props.children}</span>
            </li>
        ),
        strong: ({ node, ...props }: any) => <strong className="font-semibold text-orange-700" {...props} />,
    };

    const { report } = kundliData;

    // Split the report into sections. Using '###' based on your API response example
    const sections = report.split(/(?=###\s)/).filter(section => section.trim().startsWith('###'));

    // Helper function to parse the sign from the content string
    const getSignFromContent = (text: string): string | null => {
        const match = text.match(/\*\*Sign:\*\*\s*(\w+)/);
        return match ? match[1].toLowerCase() : null;
    };

    return (
        <div className="bg-background min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="grid gap-6">
                    {sections.map((section, index) => {
                        const firstNewline = section.indexOf('\n');
                        const title = section.substring(0, firstNewline).replace(/###\s/g, '').trim();
                        const content = section.substring(firstNewline + 1).trim();

                        // --- Get the image URL from the state map ---
                        const sign = getSignFromContent(content);
                        const imageUrl = sign ? zodiacImageMap[sign] : null;

                        const icons: { [key: string]: React.ReactNode } = {
                            'Lagna': <Sun size={24} />,
                            'Rashi': <Moon size={24} />,
                        };
                        const iconKey = Object.keys(icons).find(key => title.includes(key));
                        const icon = iconKey ? icons[iconKey] : <Star size={24} />;

                        return (
                            <SectionCard key={index} title={title} icon={icon} imageUrl={imageUrl}>
                                <ReactMarkdown components={renderers}>
                                    {content}
                                </ReactMarkdown>
                            </SectionCard>
                        );
                    })}
                </div>

                <footer className="text-center mt-10 text-sm text-muted-foreground bg-card/50 py-4 rounded-lg">
                    <p>
                        This report offers a foundational analysis of your birth chart. For personalized insights, consult a professional astrologer.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default ReportDetails;

