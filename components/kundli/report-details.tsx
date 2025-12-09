import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
// --- FIX: Import contentful from a CDN to resolve the error ---
import { createClient } from 'contentful';
import { Sun, Moon, Home, Star, Sparkles, Dna, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../stores/languageStore';

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

// --- Language-aware translation function ---
const translateContent = (text: string, targetLanguage: string): string => {
    // Return original text if target language is English
    if (targetLanguage === 'en') {
        return text;
    }

    // Hindi translation function
    const translateToHindi = (text: string): string => {
    // Common English words and their Hindi translations found in reports
    const translations: { [key: string]: string } = {
        // Section headings
        'Lagna (Ascendant)': 'लग्न (उदय लग्न)',
        'Lagna': 'लग्न',
        'Ascendant': 'उदय लग्न',
        'Rashi (Moon sign)': 'राशि (चंद्र राशि)',
        'Rashi': 'राशि',
        'Moon Sign': 'चंद्र राशि',
        'Moon sign': 'चंद्र राशि',
        'Sun Sign': 'सूर्य राशि',
        'Rising Sign': 'उदय राशि',

        // Planet positions format: "Planet (Sign, House):"
        'Sun': 'सूर्य',
        'Moon': 'चंद्रमा',
        'Mars': 'मंगल',
        'Mercury': 'बुध',
        'Jupiter': 'गुरु',
        'Venus': 'शुक्र',
        'Saturn': 'शनि',
        'Rahu': 'राहु',
        'Ketu': 'केतु',

        // Zodiac signs in parentheses
        'Aries': 'मेष',
        'Taurus': 'वृषभ',
        'Gemini': 'मिथुन',
        'Cancer': 'कर्क',
        'Leo': 'सिंह',
        'Virgo': 'कन्या',
        'Libra': 'तुला',
        'Scorpio': 'वृश्चिक',
        'Sagittarius': 'धनु',
        'Capricorn': 'मकर',
        'Aquarius': 'कुंभ',
        'Pisces': 'मीन',

        // House numbers with suffixes
        '1st': 'पहले',
        '2nd': 'दूसरे',
        '3rd': 'तीसरे',
        '4th': 'चौथे',
        '5th': 'पांचवें',
        '6th': 'छठे',
        '7th': 'सातवें',
        '8th': 'आठवें',
        '9th': 'नौवें',
        '10th': 'दसवें',
        '11th': 'ग्यारहवें',
        '12th': 'बारहवें',

        // Labels and metadata
        'Sign:': 'राशि:',
        'Sign': 'राशि',
        'Element:': 'तत्व:',
        'Element': 'तत्व',
        'Quality:': 'गुणवत्ता:',
        'Quality': 'गुणवत्ता',
        'Ruling Planet:': 'शासक ग्रह:',
        'Ruling Planet': 'शासक ग्रह',
        'Symbol:': 'प्रतीक:',
        'Symbol': 'प्रतीक',
        'Position:': 'स्थिति:',
        'Position': 'स्थिति',
        'Status:': 'स्थिति:',
        'Status': 'स्थिति',
        'Degree:': 'अंश:',
        'Degree': 'अंश',
        'Nakshatra:': 'नक्षत्र:',
        'Nakshatra': 'नक्षत्र',
        'House:': 'भाव:',
        'House': 'भाव',
        'Lord:': 'स्वामी:',
        'Lord': 'स्वामी',
        'Prayer:': 'प्रार्थना:',
        'Prayer': 'प्रार्थना',
        'Gemstone:': 'रत्न:',
        'Gemstone': 'रत्न',

        // Traits and characteristics
        'Trait:': 'विशेषता:',
        'Trait': 'विशेषता',
        'Traits:': 'विशेषताएं:',
        'Traits': 'विशेषताएं',
        'Positive:': 'सकारात्मक:',
        'Positive': 'सकारात्मक',
        'Negative:': 'नकारात्मक:',
        'Negative': 'नकारात्मक',
        'Strengths:': 'शक्तियां:',
        'Strengths': 'शक्तियां',
        'Weaknesses:': 'कमजोरियां:',
        'Weaknesses': 'कमजोरियां',
        'Characteristics:': 'विशेषताएं:',
        'Characteristics': 'विशेषताएं',

        // General terms
        'and': 'और',
        'in': 'में',
        'of': 'का',
        'with': 'के साथ',
        'for': 'के लिए',
        'is': 'है',
        'are': 'हैं',
        'the': '',
        'a': '',
        'an': '',

        // Astrological terms
        'Ascendant': 'लग्न',
        'Lagna': 'लग्न',
        'Moon Sign': 'चंद्रमा राशि',
        'Sun Sign': 'सूर्य राशि',
        'Rising Sign': 'उदय राशि',
        'Birth Chart': 'जन्म कुंडली',
        'Kundli': 'कुंडली',
        'Planet': 'ग्रह',
        'Planets': 'ग्रह',
        'Zodiac': 'राशि चक्र',
        'Signs': 'राशियां',
        'House': 'भाव',
        'Houses': 'भाव',
        'Nakshatra': 'नक्षत्र',
        'Nakshatras': 'नक्षत्र',
        'Dashas': 'दशाएं',
        'Mahadasha': 'महादशा',
        'Antardasha': 'अंतर्दशा',

        // Planetary names
        'Sun': 'सूर्य',
        'Moon': 'चंद्रमा',
        'Mars': 'मंगल',
        'Mercury': 'बुध',
        'Jupiter': 'गुरु',
        'Venus': 'शुक्र',
        'Saturn': 'शनि',
        'Rahu': 'राहु',
        'Ketu': 'केतु',

        // Zodiac signs
        'Aries': 'मेष',
        'Taurus': 'वृषभ',
        'Gemini': 'मिथुन',
        'Cancer': 'कर्क',
        'Leo': 'सिंह',
        'Virgo': 'कन्या',
        'Libra': 'तुला',
        'Scorpio': 'वृश्चिक',
        'Sagittarius': 'धनु',
        'Capricorn': 'मकर',
        'Aquarius': 'कुंभ',
        'Pisces': 'मीन',

        // Elements
        'Fire': 'अग्नि',
        'Earth': 'पृथ्वी',
        'Air': 'वायु',
        'Water': 'जल',

        // Qualities
        'Cardinal': 'चल',
        'Fixed': 'स्थिर',
        'Mutable': 'द्विस्वभाव',

        // Common descriptive words
        'Strong': 'मजबूत',
        'Weak': 'कमजोर',
        'Good': 'अच्छा',
        'Bad': 'बुरा',
        'Positive': 'सकारात्मक',
        'Negative': 'नकारात्मक',
        'Malefic': 'पापी',
        'Benefic': 'शुभ',
        'Exalted': 'उच्च',
        'Debilitated': 'नीच',
        'Retrograde': 'वक्री',
        'Direct': 'अनुलोम',
        'Combust': 'दग्ध',

        // Time periods
        'Years': 'वर्ष',
        'Months': 'महीने',
        'Days': 'दिन',
        'Period': 'अवधि',
        'Duration': 'अवधि',
        'Start': 'आरंभ',
        'End': 'समाप्त',

        // General life areas
        'Career': 'करियर',
        'Finance': 'वित्त',
        'Health': 'स्वास्थ्य',
        'Relationship': 'रिश्ता',
        'Relationships': 'रिश्ते',
        'Family': 'परिवार',
        'Marriage': 'विवाह',
        'Education': 'शिक्षा',
        'Business': 'व्यवसाय',
        'Job': 'नौकरी',
        'Love': 'प्रेम',
        'Children': 'बच्चे',
        'Property': 'संपत्ति',

        // Numbers
        'First': 'पहला',
        'Second': 'दूसरा',
        'Third': 'तीसरा',
        'Fourth': 'चौथा',
        'Fifth': 'पांचवां',
        'Sixth': 'छठा',
        'Seventh': 'सातवां',
        'Eighth': 'आठवां',
        'Ninth': 'नौवां',
        'Tenth': 'दसवां',
        'Eleventh': 'ग्यारहवां',
        'Twelfth': 'बारहवां',

        // Common conjunctions and prepositions
        'in the': 'में',
        'of the': 'का',
        'on the': 'पर',
        'for the': 'के लिए',
        'with the': 'के साथ',
        'by the': 'द्वारा',
        'from the': 'से',
        'to the': 'को',
        'at the': 'पर',

        // Section headers to filter out or translate
        'Planetary Details और Their Extended Information': 'ग्रह विवरण और उनकी विस्तृत जानकारी',
        'Planetary Details and Their Extended Information': 'ग्रह विवरण और उनकी विस्तृत जानकारी',
        'Planetary Details': 'ग्रह विवरण',
        'Extended Information': 'विस्तृत जानकारी',
        'Extended Details:': 'विस्तृत विवरण:',
        'Extended Details': 'विस्तृत विवरण',
        'Planetary Significance:': 'ग्रह का महत्व:',
        'Planetary Significance': 'ग्रह का महत्व',
        'Presiding Deity:': 'अधिष्ठित देवता:',
        'Presiding Deity': 'अधिष्ठित देवता',
        'Influence में Astrology:': 'ज्योतिष में प्रभाव:',
        'Influence in Astrology:': 'ज्योतिष में प्रभाव:',
        'Remedies और Worship:': 'उपाय और पूजा:',
        'Remedies and Worship:': 'उपाय और पूजा:',
        'Remedies': 'उपाय',
        'Worship': 'पूजा',
        'Mantra और Stotra:': 'मंत्र और स्तोत्र:',
        'Mantra and Stotra:': 'मंत्र और स्तोत्र:',
        'Mantra': 'मंत्र',
        'Stotra': 'स्तोत्र',
        'Ritual:': 'अनुष्ठान:',
        'Ritual': 'अनुष्ठान',
        'Yantra और Gem:': 'यंत्र और रत्न:',
        'Yantra and Gem:': 'यंत्र और रत्न:',
        'Yantra': 'यंत्र',
        'Gem': 'रत्न',
        'Other Practices:': 'अन्य अभ्यास:',
        'Other Practices': 'अन्य अभ्यास',

        // Remedies and practices related terms
        'Offerings:': 'भेंट:',
        'Offerings': 'भेंट',
        'Fasting and Charity:': 'उपवास और दान:',
        'Fasting and Charity': 'उपवास और दान',
        'Fasting और Charity:': 'उपवास और दान:',
        'Symbolic Wear:': 'प्रतीकात्मक पहनावा:',
        'Symbolic Wear': 'प्रतीकात्मक पहनावा',
        'Crystals:': 'क्रिस्टल:',
        'Crystals': 'क्रिस्टल',
        'Meditation:': 'ध्यान:',
        'Meditation': 'ध्यान',
    };

    let translatedText = text;

    // Special pattern matching for planet positions: "Planet (Sign, House):"
    const planetPositionPattern = /\b(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\s*\(([^)]+)\)/g;
    translatedText = translatedText.replace(planetPositionPattern, (match, planet, details) => {
        const planetHindi = translations[planet] || planet;

        // Translate the zodiac sign in the parentheses
        let translatedDetails = details;
        Object.keys(translations).forEach(english => {
            if (['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].includes(english)) {
                translatedDetails = translatedDetails.replace(new RegExp(english, 'g'), translations[english]);
            }
        });

        // Translate house numbers
        translatedDetails = translatedDetails.replace(/\b(\d+)(?:st|nd|rd|th)\s*House\b/gi, (houseMatch, num) => {
            const houseNum = parseInt(num);
            const houseHindi = ['', 'पहले', 'दूसरे', 'तीसरे', 'चौथे', 'पांचवें', 'छठे', 'सातवें', 'आठवें', 'नौवें', 'दसवें', 'ग्यारहवें', 'बारहवें'][houseNum] || houseNum + 'वें';
            return houseHindi + ' भाव';
        });

        return `${planetHindi} (${translatedDetails}):`;
    });

    // Fix mixed language patterns
    translatedText = translatedText.replace(/Influence\s+में\s+Astrology:/g, 'ज्योतिष में प्रभाव:');
    translatedText = translatedText.replace(/Influence\s+in\s+Astrology:/g, 'ज्योतिष में प्रभाव:');

    // Fix other mixed patterns
    translatedText = translatedText.replace(/Remedies\s+और\s+Worship:/g, 'उपाय और पूजा:');
    translatedText = translatedText.replace(/Remedies\s+and\s+Worship:/g, 'उपाय और पूजा:');
    translatedText = translatedText.replace(/Mantra\s+और\s+Stotra:/g, 'मंत्र और स्तोत्र:');
    translatedText = translatedText.replace(/Mantra\s+and\s+Stotra:/g, 'मंत्र और स्तोत्र:');
    translatedText = translatedText.replace(/Yantra\s+और\s+Gem:/g, 'यंत्र और रत्न:');
    translatedText = translatedText.replace(/Yantra\s+and\s+Gem:/g, 'यंत्र और रत्न:');

        // Fix additional mixed patterns
        translatedText = translatedText.replace(/Offerings:\s*अपनी/g, 'भेंट: अपनी');
        translatedText = translatedText.replace(/Offerings:/g, 'भेंट:');
        translatedText = translatedText.replace(/Fasting\s+और\s+Charity:/g, 'उपवास और दान:');
        translatedText = translatedText.replace(/Fasting\s+and\s+Charity:/g, 'उपवास और दान:');
        translatedText = translatedText.replace(/Symbolic\s+Wear:/g, 'प्रतीकात्मक पहनावा:');
        translatedText = translatedText.replace(/Crystals:/g, 'क्रिस्टल:');
        translatedText = translatedText.replace(/Meditation:/g, 'ध्यान:');

    // Fix broken words like "यंत्र और Gemstone: बु" -> remove the incomplete part
    translatedText = translatedText.replace(/Gemstone:\s*बु\s*$/g, 'रत्न:');
    translatedText = translatedText.replace(/यंत्र\s*और\s*Gemstone:\s*बु\s*$/g, '');

    // Fix incomplete words at line endings
    translatedText = translatedText.replace(/\b(\w+)\s*$/gm, (match, word) => {
        // If it's a very short incomplete word at the end of line, remove it
        return word.length <= 2 ? '' : word;
    });

    // Apply translations - sort by length to avoid partial matches
    const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length);

    for (const englishWord of sortedKeys) {
        const hindiWord = translations[englishWord];
        if (hindiWord) {
            // Use word boundaries to avoid replacing parts of words
            const regex = new RegExp(`\\b${englishWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            translatedText = translatedText.replace(regex, hindiWord);
        }
    }

    return translatedText;
    };

    return translateToHindi(text);
};


// --- UI COMPONENT: SectionCard ---
// Redesigned for a fully responsive, side-by-side layout
const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; imageUrl?: string | null; }> = ({ title, icon, children, imageUrl }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 transition-all duration-200 hover:shadow-sm overflow-hidden">
    <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
      <span className="text-orange-600 dark:text-orange-400 mr-3">{icon}</span>
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
                    className="w-full h-auto object-contain rounded-full bg-gray-50 dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600"
                />
            </div>
        )}

        {/* Right Side: Text Content */}
        <div className="prose prose-md max-w-none text-gray-900 dark:text-white leading-relaxed flex-1">
            {children}
        </div>
    </div>
  </div>
);


// --- MAIN REPORT COMPONENT ---

const ReportDetails: React.FC<ReportProps> = ({ kundliData }) => {
    const { t } = useTranslation();
    const { language } = useLanguageStore();
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
            <div className="min-h-screen p-8 flex items-center justify-center">
                <p className="text-lg text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Bot size={20} className="text-orange-600 dark:text-orange-400 animate-pulse" />
                    {t('reportDetails.preparing')}
                </p>
            </div>
        );
    }

    // Custom Markdown renderers
    const renderers = {
        h3: ({ node, ...props }: any) => <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
        p: ({ node, ...props }: any) => <p className="mb-4 text-gray-900 dark:text-white" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc list-inside space-y-3 mb-4" {...props} />,
        li: ({ node, ...props }: any) => (
            <li className="flex items-start">
                <Sparkles size={15} className="text-orange-600 dark:text-orange-400 mr-3 mt-1.5 flex-shrink-0" />
                <span>{props.children}</span>
            </li>
        ),
        strong: ({ node, ...props }: any) => <strong className="font-semibold text-orange-600 dark:text-orange-400" {...props} />,
    };

    const { report } = kundliData;

    // Split the report into sections. Using '###' based on your API response example
    const sections = report.split(/(?=###\s)/).filter(section => section.trim().startsWith('###'));

    // Helper function to parse the sign from the content string
    const getSignFromContent = (text: string): string | null => {
        const match = text.match(/\*\*Sign:\*\*\s*(\w+)/);
        return match ? match[1].toLowerCase() : null;
    };

    // Apply language-aware translation to the report content
    const translateReportContent = (content: string): string => {
        return translateContent(content, language);
    };

    // Apply language-aware translation to section titles
    const translateTitle = (title: string): string => {
        return translateContent(title, language);
    };

    // Filter out unwanted sections (like "Planetary Details और Their Extended Information")
    const filterSections = (sections: string[]): string[] => {
        const unwantedKeywords = [
            'Planetary Details और Their Extended Information',
            'Planetary Details and Their Extended Information',
            'Planetary Details',
            'ग्रह विवरण और उनकी विस्तृत जानकारी'
        ];

        return sections.filter(section => {
            const title = section.split('\n')[0].replace(/###\s/g, '').trim();
            return !unwantedKeywords.some(keyword =>
                title.toLowerCase().includes(keyword.toLowerCase()) ||
                title.includes(keyword)
            );
        });
    };

    const filteredSections = filterSections(sections);

    return (
        <div className="mt-6">
            <div className="space-y-6">
                <div className="grid gap-6">
                    {filteredSections.map((section, index) => {
                        const firstNewline = section.indexOf('\n');
                        const originalTitle = section.substring(0, firstNewline).replace(/###\s/g, '').trim();
                        const content = section.substring(firstNewline + 1).trim();

                        // --- Translate title and content based on current language ---
                        const translatedTitle = translateTitle(originalTitle);
                        const translatedContent = translateReportContent(content);

                        // --- Get the image URL from the state map ---
                        const sign = getSignFromContent(content); // Use original content for sign detection
                        const imageUrl = sign ? zodiacImageMap[sign] : null;

                        const lagnaKey = t('reportDetails.lagna');
                        const rashiKey = t('reportDetails.rashi');
                        const icons: { [key: string]: React.ReactNode } = {
                            'Lagna': <Sun size={24} />,
                            'Rashi': <Moon size={24} />,
                            'लग्न': <Sun size={24} />,
                            'राशि': <Moon size={24} />,
                            [lagnaKey]: <Sun size={24} />,
                            [rashiKey]: <Moon size={24} />,
                        };

                        // Use both original and translated title for icon matching
                        const iconKey = Object.keys(icons).find(key =>
                            originalTitle.includes(key) || translatedTitle.includes(key)
                        );
                        const icon = iconKey ? icons[iconKey] : <Star size={24} />;

                        return (
                            <SectionCard key={index} title={translatedTitle} icon={icon} imageUrl={imageUrl}>
                                <ReactMarkdown components={renderers}>
                                    {translatedContent}
                                </ReactMarkdown>
                            </SectionCard>
                        );
                    })}
                </div>

                <footer className="text-center mt-10 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 py-4 rounded-xl">
                    <p>
                        {t('reportDetails.footerText')}
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default ReportDetails;

