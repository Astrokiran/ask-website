import { useEffect, useState } from 'react';

export default function useGoogleMapsScript() {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if script is already loaded
        if (window.google && window.google.maps) {
            setLoaded(true);
            return;
        }

        // Define callback for when API is loaded
        window.initGoogleMapsCallback = () => {
            setLoaded(true);
        };

        // Create script element
        const script = document.createElement('script');
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            setError('Google Maps API key is missing');
            console.error('Google Maps API key is missing');
            return;
        }

        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            setError('Failed to load Google Maps API');
            console.error('Failed to load Google Maps API');
        };

        // Append to document
        document.head.appendChild(script);

        return () => {
            // Clean up
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            // Remove callback
            if (window.initGoogleMapsCallback) {
                delete window.initGoogleMapsCallback;
            }
        };
    }, []);

    return { loaded, error };
} 