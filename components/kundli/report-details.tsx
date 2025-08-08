import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sun, Moon, Home, Star, Sparkles, HandHelping, Dna, Bot } from 'lucide-react';

// --- INTERFACES ---

interface ReportData {
    report: string;
    userName: string;
}

interface ReportProps {
    kundliData: ReportData | null;
}

// --- UI COMPONENTS ---

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-md border border-orange-100 p-6 md:p-8 transition-all duration-300 hover:shadow-lg ${className}`}>
    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
      <span className="text-orange-500 mr-3">{icon}</span>
      {title}
    </h3>
    <div className="prose prose-md max-w-none text-gray-700 leading-relaxed">
      {children}
    </div>
  </div>
);

// --- MAIN REPORT COMPONENT ---

const ReportDetails: React.FC<ReportProps> = ({ kundliData }) => {
  if (!kundliData || !kundliData.report) {
    return (
      <div className="bg-gradient-to-b from-orange-50 to-gray-50 min-h-screen p-8 flex items-center justify-center">
        <p className="text-lg text-gray-600 flex items-center gap-2">
          <Bot size={20} className="text-orange-500 animate-pulse" />
          Preparing your astrological report...
        </p>
      </div>
    );
  }

  // Custom renderers for Markdown elements with enhanced styling
  const renderers = {
    h3: ({ node, ...props }: any) => <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3" {...props} />,
    p: ({ node, ...props }: any) => <p className="mb-4 text-gray-600" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc list-inside space-y-3 mb-4" {...props} />,
    li: ({ node, ...props }: any) => (
      <li className="flex items-start">
        <Sparkles size={16} className="text-orange-400 mr-3 mt-1.5 flex-shrink-0" />
        <span>{props.children}</span>
      </li>
    ),
    strong: ({ node, ...props }: any) => <strong className="font-semibold text-orange-700" {...props} />,
  };

  const { report, userName } = kundliData;

  // Split the report into sections based on '##' headings
  const sections = report.split(/(?=##\s)/).filter(Boolean);

  return (
    <div className="bg-gradient-to-b from-orange-50 to-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <p className="text-lg md:text-xl text-gray-600">
            Astrological Insights
            <span className="font-semibold text-orange-600">{userName}</span>
          </p>
        </header>

        <div className="grid gap-6">
          {sections.map((section, index) => {
            const firstNewline = section.indexOf('\n');
            const title = section.substring(0, firstNewline).replace(/##\s/g, '').trim();
            const content = section.substring(firstNewline + 1).trim();

            // Assign icons based on section title
            const icons: { [key: string]: React.ReactNode } = {
              '1.': <Sun size={24} className="text-orange-500" />,
              '2.': <Home size={24} className="text-orange-500" />,
              '3.': <Dna size={24} className="text-orange-500" />,
            };
            const icon = icons[title.substring(0, 2)] || <Star size={24} className="text-orange-500" />;

            return (
              <SectionCard key={index} title={title} icon={icon}>
                <ReactMarkdown components={renderers}>
                  {content}
                </ReactMarkdown>
              </SectionCard>
            );
          })}
        </div>

        <footer className="text-center mt-10 text-sm text-gray-500 bg-white/50 py-4 rounded-lg">
          <p>
            This report offers a foundational analysis of your birth chart. For personalized insights, consult a professional astrologer.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ReportDetails;