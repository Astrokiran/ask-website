import { useEffect, useState } from 'react';

// Create a variable to track if the script is already loading or loaded
let isScriptLoading = false;
let isScriptLoaded = false;

export function useGoogleMapsScript(libraries: string[] = ['places']) {
    const [isLoaded, setIsLoaded] = useState(isScriptLoaded);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // If the script is already loaded, just update the state
        if (isScriptLoaded) {
            setIsLoaded(true);
            return;
        }

        // If the script is already loading, wait for it
        if (isScriptLoading) {
            const checkIfLoaded = setInterval(() => {
                if (isScriptLoaded) {
                    setIsLoaded(true);
                    clearInterval(checkIfLoaded);
                }
            }, 100);

            return () => clearInterval(checkIfLoaded);
        }

        // Start loading the script
        isScriptLoading = true;

        const script = document.createElement('script');
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            isScriptLoaded = true;
            isScriptLoading = false;
            setIsLoaded(true);
        };

        script.onerror = (e) => {
            isScriptLoading = false;
            setError(e instanceof Error ? e : new Error('Failed to load Google Maps script'));
        };

        document.head.appendChild(script);

        return () => {
            // We don't remove the script on component unmount
            // as it should be available globally
        };
    }, [libraries.join(',')]);

    return { isLoaded, error };
}

// Add this to your global types
declare global {
    interface Window {
        [key: string]: any;
    }
} 