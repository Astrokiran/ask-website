import { useEffect, useRef, useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPinIcon, AlertCircle } from "lucide-react";

import { Control, UseFormSetValue } from "react-hook-form";
import useGoogleMapsScript from '@/lib/hooks/useGoogleMapsScript';

// Define the interface for location data
interface PlaceOption {
  value: string;
  label: string;
  lat: number;
  lng: number;
}

interface LocationFieldProps {
  form: {
    control: Control;
    setValue: UseFormSetValue<any>;
  };
}

// Add this to your next-env.d.ts or create a new declaration file
declare global {
  interface Window {
    initGoogleMapsCallback?: () => void;
    google: any;
  }
}

export default function LocationField({ form }: LocationFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { loaded, error } = useGoogleMapsScript();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!loaded || !inputRef.current || isInitialized) return;

    try {
      // Initialize the autocomplete
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
      });

      // Add listener for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();

        if (place && place.formatted_address) {
          // Update form values
          form.setValue("place", place.formatted_address);

          if (place.geometry?.location) {
            form.setValue("lat", place.geometry.location.lat());
            form.setValue("long", place.geometry.location.lng());
          }

          // Update input value
          setInputValue(place.formatted_address);
        }
      });

      setIsInitialized(true);
      console.log("Google Places Autocomplete initialized successfully");
    } catch (err) {
      console.error("Error initializing Google Places Autocomplete:", err);
    }

    // Cleanup
    return () => {
      if (autocompleteRef.current && window.google) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [loaded, form, isInitialized]);

  return (
    <FormField
      control={form.control}
      name="place"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Place of Birth</FormLabel>
          <FormControl>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                {...field}
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={error ? "Google Maps API failed to load" : "Search for a location..."}
                className="pl-10"
                disabled={!!error}
              />
              {error && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}