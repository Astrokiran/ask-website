import React from 'react';
import { User, Sun, Moon, Star, Building2, Zap } from 'lucide-react';

// --- INTERFACES ---

interface SummaryData {
    name: string;
    interpretation: string;
}

interface SummaryDetailsProps {
    kundliData: SummaryData | null;
}

// --- ROBUST PARSING LOGIC ---

/**
 * Extracts content for all known sections from a text block.
 * This is more robust than the previous sequential search.
 * @param text The full interpretation string.
 * @returns A Record mapping section keywords to their content.
 */
const parseAllSections = (text: string): Record<string, string> => {
    const sections: Record<string, string> = {};
    const keywords = [
        'Planetary Placements:',
        'Your Moon is in Nakshatra',
        'House Analysis:',
        'You have the following important yogas'
    ];

    let remainingText = text;

    // 1. Extract Lagna Interpretation (everything before the first keyword)
    const firstKeywordIndex = Math.min(
        ...keywords.map(k => text.indexOf(k)).filter(index => index !== -1)
    );
    if (firstKeywordIndex !== -1) {
        sections['Lagna Interpretation'] = text.substring(0, firstKeywordIndex).trim();
        remainingText = text.substring(firstKeywordIndex);
    } else {
        sections['Lagna Interpretation'] = text.trim(); // The whole text is Lagna if no keywords
        return sections;
    }

    // 2. Extract content for each keyword
    keywords.forEach((currentKeyword, i) => {
        const startIndex = remainingText.indexOf(currentKeyword);
        if (startIndex === -1) return;

        let endIndex = remainingText.length;
        // Find the start of the *next* keyword in the list to define the boundary
        for (let j = i + 1; j < keywords.length; j++) {
            const nextKeywordIndex = remainingText.indexOf(keywords[j], startIndex);
            if (nextKeywordIndex !== -1) {
                endIndex = nextKeywordIndex;
                break;
            }
        }
        const content = remainingText.substring(startIndex + currentKeyword.length, endIndex).trim();
        sections[currentKeyword] = content;
    });

    return sections;
};

/**
 * Parses a string of bullet points (•) into an array of strings.
 * @param text The text block containing bullet points.
 * @returns An array of list items.
 */
const parseBulletPoints = (text: string): string[] => {
    if (!text) return [];
    return text.split('•').map(item => item.trim()).filter(Boolean);
};


// --- MODERN UI COMPONENTS ---

const HighlightCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-xl shadow-lg text-white h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold opacity-90">{title}</h3>
            <div className="opacity-80">{icon}</div>
        </div>
        <div className="flex-grow">
            {children}
        </div>
    </div>
);

const FeatureCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-card rounded-xl shadow-md border border p-6 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
            <span className="mr-3 text-orange-500">{icon}</span>
            {title}
        </h3>
        <div className="text-foreground space-y-2">
            {children}
        </div>
    </div>
);

const StyledListItem: React.FC<{ item: string; index: number }> = ({ item, index }) => {
    const parts = item.split(':');
    const label = parts[0] || '';
    const description = parts.length > 1 ? parts.slice(1).join(':').trim() : '';

    return (
        <li key={index} className="flex items-start p-3 bg-muted/20 hover:bg-muted/30 rounded-lg transition-colors duration-200">
            <span className="font-semibold text-orange-600 w-1/3 md:w-1/4">{label}</span>
            <span className="text-foreground w-2/3 md:w-3/4">{description}</span>
        </li>
    );
};


// --- MAIN COMPONENT ---

const SummaryDetails: React.FC<SummaryDetailsProps> = ({ kundliData }) => {

    if (!kundliData || !kundliData.name || !kundliData.interpretation) {
        return (
            <div className="bg-muted/20 min-h-screen p-8 flex items-center justify-center">
                <p className="text-lg text-muted-foreground">No summary data available to display.</p>
            </div>
        );
    }
    const { name, interpretation } = kundliData;

    // Use the robust parser
    const sections = parseAllSections(interpretation);
    const lagnaInterpretation = sections['Lagna Interpretation'] || 'No interpretation available.';
    const planetaryPlacements = parseBulletPoints(sections['Planetary Placements:'] || '');
    const nakshatraDetailsText = sections['Your Moon is in Nakshatra'] || 'Not specified.';
    const houseInsights = parseBulletPoints(sections['House Analysis:'] || '');
    const importantYogas = parseBulletPoints(sections['You have the following important yogas'] || '');
    
    // Simple parser for Nakshatra details to break them down
    const nakshatraParts = nakshatraDetailsText.split(/, |\. /);
    const nakshatraName = nakshatraParts[0] || 'N/A';
    const nakshatraRuler = nakshatraParts.find(p => p.toLowerCase().includes('ruled by')) || '';
    const nakshatraDescription = nakshatraParts.slice(1).filter(p => !p.toLowerCase().includes('ruled by')).join('. ') || 'No description.';


    return (
        <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* --- HEADER --- */}
                <header className="mb-8 md:mb-12">
                    <h4 className="text-4xl md:text-5xl font-bold text-foreground">
                        Astrological Summary
                    </h4>
                    <p className="text-lg text-muted-foreground mt-2">
                        Welcome, <span className="font-semibold text-orange-600">{name}</span>. Here is a detailed look into your Vedic astrology chart.
                    </p>
                </header>

                {/* --- DYNAMIC GRID LAYOUT --- */}
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* Main Lagna Interpretation (takes more space) */}
                    <div className="lg:col-span-2">
                        <FeatureCard title="Lagna (Ascendant) Interpretation" icon={<Sun size={24} />}>
                            <p className="leading-relaxed">{lagnaInterpretation}</p>
                        </FeatureCard>
                    </div>

                    {/* Highlight Card for Nakshatra */}
                    <div className="space-y-6">
                        <HighlightCard title="Nakshatra (Lunar Mansion)" icon={<Moon size={28} />}>
                           <div>
                             <h4 className="text-2xl font-bold mb-3">{nakshatraName}</h4>
                             <ul className="space-y-2 text-base opacity-95">
                                {nakshatraRuler && <li className="flex items-start"><Star size={16} className="mr-2 mt-1 flex-shrink-0" /><span>{nakshatraRuler}</span></li>}
                                {nakshatraDescription && <li className="flex items-start"><Zap size={16} className="mr-2 mt-1 flex-shrink-0" /><span>{nakshatraDescription}</span></li>}
                             </ul>
                           </div>
                        </HighlightCard>
                    </div>

                    {/* Full-width sections */}
                    <div className="lg:col-span-3">
                        <FeatureCard title="Planetary Placements" icon={<Star size={24} />}>
                            <ul className="space-y-3">
                                {planetaryPlacements.map((item, index) => <StyledListItem key={index} item={item} index={index} />)}
                            </ul>
                        </FeatureCard>
                    </div>

                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <FeatureCard title="Key House Insights" icon={<Building2 size={24} />}>
                            <ul className="list-disc list-inside space-y-2">
                                {houseInsights.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </FeatureCard>
                        <FeatureCard title="Important Yogas" icon={<Zap size={24} />}>
                             <ul className="list-disc list-inside space-y-2">
                                {importantYogas.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </FeatureCard>
                    </div>

                </main>

                <footer className="text-center mt-12 text-sm text-muted-foreground">
                    <p>This interpretation provides key insights from your Vedic astrology chart. Your chart is unique and contains many more subtleties that can be explored in a detailed consultation.</p>
                </footer>
            </div>
        </div>
    );
};

export default SummaryDetails;