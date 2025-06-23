import React, { useState, useEffect } from 'react';

export const LoadingScreen = () => {
    const messages = [
        "Astrokiran is diligently preparing your Kundli...",
        "Unveiling cosmic insights, just for you...",
        "Aligning stars and planets, please wait...",
        "Calculating your unique astrological blueprint...",
        "Your personalized Kundli is almost ready...",
        "Exploring celestial patterns for your future...",
        "Processing ancient wisdom with modern precision...",
    ];

    // State to hold the current message
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 3000); // Change message every 3 seconds

        return () => clearInterval(interval);
    }, [messages.length]); // Re-run effect if messages array length changes

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
            {/* Main loading container */}
            <div className="flex flex-col items-center space-y-8 p-8 bg-white rounded-3xl shadow-2xl transform transition-all duration-500 ease-in-out hover:scale-105">
                {/* Image with spinning animation */}
                <img
                    src="/ask-logo.png" // Updated path for your image
                    alt="Astrokiran Logo"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg animate-spin-slow border-4 border-orange-300"
                />

                {/* Loading text with transition */}
                <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-center tracking-wide transition-opacity duration-500 ease-in-out opacity-100">
                    {messages[currentMessageIndex]}
                </p>

                <div className="flex space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-full bg-orange-400 animate-bounce`}
                            style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite; /* 8 seconds per full spin */
                }
                .animate-bounce {
                    animation: bounce 1s infinite;
                }
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(-25%);
                        animation-timing-function: cubic-bezier(0.8,0,1,1);
                    }
                    50% {
                        transform: translateY(0);
                        animation-timing-function: cubic-bezier(0,0,0.2,1);
                    }
                }
            `}</style>
        </div>
    );
};
