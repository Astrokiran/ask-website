import { useEffect, useRef, useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPinIcon, AlertCircle } from "lucide-react";

import { Control, UseFormSetValue } from "react-hook-form";
import { useGoogleMapsScript } from '@/lib/hooks/useGoogleMapsScript';

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
    formState?: {
      errors?: Record<string, any>;
    };
  };
  required?: boolean;
}

// Add this to your next-env.d.ts or create a new declaration file
declare global {
  interface Window {
    initGoogleMapsCallback?: () => void;
    google: any;
  }
}

export default function LocationField({ form, required = true }: LocationFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isLoaded, error } = useGoogleMapsScript(['places']);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    // Only run if Google Maps is loaded, input ref exists, and we haven't initialized yet
    if (!isLoaded || !inputRef.current || isInitialized) return;

    // Make sure Google Maps and Places are fully loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.log("Google Maps Places API not fully loaded yet");
      return;
    }

    try {
      // Initialize the autocomplete with more defensive coding
      if (inputRef.current && document.body.contains(inputRef.current)) {
        // Create the autocomplete instance
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['geocode'],
          fields: ['formatted_address', 'geometry']
        });

        // Add listener for place selection
        window.google.maps.event.addListener(autocompleteRef.current, 'place_changed', () => {
          if (!autocompleteRef.current) return;

          const place = autocompleteRef.current.getPlace();

          if (place && place.formatted_address) {
            // Update form values
            form.setValue("place", place.formatted_address, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true
            });

            if (place.geometry?.location) {
              form.setValue("lat", place.geometry.location.lat().toString(), {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              });
              form.setValue("long", place.geometry.location.lng().toString(), {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
              });
            }

            // Update input value
            setInputValue(place.formatted_address);
          }
        });

        setIsInitialized(true);
        console.log("Google Places Autocomplete initialized successfully");
      }
    } catch (err) {
      console.error("Error initializing Google Places Autocomplete:", err);
    }
  }, [isLoaded, form, isInitialized]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autocompleteRef.current && window.google && window.google.maps) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return (
    <FormField
      control={form.control}
      name="place"
      rules={{
        required: required ? "Location is required" : false,
        validate: {
          hasCoordinates: (value) => {
            // Check if lat and long are set when place is set
            const lat = form.control._formValues?.lat;
            const long = form.control._formValues?.long;

            if (value && (!lat || !long)) {
              return "Please select a valid location from the dropdown";
            }

            return true;
          }
        }
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Place of Birth
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                {...field}
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  field.onChange(e.target.value);

                  // Clear lat/long when user types manually
                  // This ensures validation will fail until they select from dropdown
                  if (e.target.value !== field.value) {
                    form.setValue("lat", "", { shouldValidate: true });
                    form.setValue("long", "", { shouldValidate: true });
                  }
                }}
                placeholder={error ? "Google Maps API failed to load" : "Search for a location..."}
                className="pl-10"
                disabled={!!error}
                required={required}
                aria-required={required}
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