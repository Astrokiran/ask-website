import React from 'react';

// WhatsApp SVG icon
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.167 1.687a.75.75 0 01-.882-.882z" />
    <path fill="#FFF" d="M18.333 13.945c-.244-.123-1.442-.71-1.668-.79-.226-.08-.39-.123-.553.123-.163.245-.63.79-.773.945-.143.155-.286.17-.53.048-.244-.123-1.027-.378-1.956-1.207-.723-.655-1.208-1.464-1.35-1.71-.144-.245-.015-.378.109-.502.11-.11.245-.286.368-.43.124-.143.164-.245.245-.408.08-.163.04-.306-.02-.43s-.553-1.32-.756-1.823c-.204-.502-.408-.43-.553-.438-.143-.008-.306-.008-.47-.008-.163 0-.43.062-.655.306-.226.245-.863.84-1.127 1.523-.263.682-.366 1.35-.306 2.051.062.7.45 1.378.715 1.956.264.578 1.48 2.398 3.65 3.23.54.204 1.05.325 1.44.408.63.123 1.18.109 1.58.062.45-.048 1.442-.593 1.646-.17.204-1.164.204-2.158.143-2.302-.06-.144-.226-.23-.47-.353z" />
  </svg>
);

interface DailyHoroscopeCtaProps {
  phoneNumber: string; // e.g. 919876543210
}

export const DailyHoroscopeCta: React.FC<DailyHoroscopeCtaProps> = ({
  phoneNumber,
}) => {
  const prefilledMessage = "Hello AstroKiran, I’d like to know my daily horoscope for today.";
  const encodedMessage = encodeURIComponent(prefilledMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg p-10 sm:p-14 my-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side: Text */}
        <div className="text-white text-center md:text-left max-w-3xl">
          <h3 className="text-3xl font-extrabold">Daily Horoscope Readings</h3>
          <p className="mt-3 text-lg text-orange-100">
            Discover your destiny through the ancient wisdom of the stars.
          </p>
          <p className="mt-4 text-base text-orange-50 leading-relaxed">
            For thousands of years, humans have looked to the stars for guidance. Astrology helps us understand ourselves better and navigate life&apos;s challenges with cosmic insight and wisdom.
          </p>
        </div>

        {/* Right Side: WhatsApp Button */}
        <div className="flex-shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-lg shadow-md hover:bg-orange-50 transform hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            <WhatsAppIcon />
            Get Daily Horoscope
          </a>
        </div>
      </div>
    </div>
  );
};
