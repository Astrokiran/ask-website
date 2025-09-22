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
    getValues: (name: string) => any;
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
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref for the actual input DOM element
  const { isLoaded, error: mapsScriptError } = useGoogleMapsScript(['places']);
  const [isAutocompleteInitialized, setIsAutocompleteInitialized] = useState(false);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    // Only run if Google Maps is loaded, input ref exists, and we haven't initialized yet
    if (!isLoaded || !inputRef.current || isAutocompleteInitialized || mapsScriptError) return;

    // Make sure Google Maps and Places are fully loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      // This case should ideally be handled by `isLoaded` from the hook,
      // but as a safeguard:
      console.warn("Google Maps Places API not fully loaded yet, initialization deferred.");
      return;
    }

    try {
      // Initialize the autocomplete with more defensive coding
      if (inputRef.current && document.body.contains(inputRef.current)) {
        // Create the autocomplete instance
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['geocode'], // Or '(cities)' if more appropriate
          fields: ['formatted_address', 'geometry.location'] // Specify only needed fields
        });

        // Add listener for place selection
        autocompleteRef.current.addListener('place_changed', () => {
          if (!autocompleteRef.current) return;

          const place = autocompleteRef.current.getPlace();

          if (place && place.formatted_address && place.geometry && place.geometry.location) {
            const newPlaceValue = place.formatted_address;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            // Update form values
            form.setValue("place", newPlaceValue, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true
            });
            form.setValue("lat", lat.toString(), {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true
            });
            form.setValue("long", lng.toString(), {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true
            });
            // inputValue will be updated via useEffect watching field.value
          }
        });

        setIsAutocompleteInitialized(true);
      }
    } catch (err) {
      console.error("Error initializing Google Places Autocomplete:", err);
      // mapsScriptError from the hook might also capture this, or set a local error state.
    }
  }, [isLoaded, isAutocompleteInitialized, mapsScriptError, form.setValue]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clear listeners to prevent memory leaks
      if (autocompleteRef.current && window.google && window.google.maps && window.google.maps.event) {
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
          hasCoordinates: (currentPlaceValue: any) => {
            // If not required and field is empty, it's valid
            if (!required && (!currentPlaceValue || String(currentPlaceValue).trim() === "")) return true;

            // Check if lat and long are set when place is set
            const lat = form.getValues("lat");
            const long = form.getValues("long");

            if (currentPlaceValue && typeof currentPlaceValue === 'string' && currentPlaceValue.trim() !== "" && (!lat || !long)) {
              return "Please select a valid location from the dropdown";
            }
            return true;
          }
        }
      }}
      render={({ field }) => {
        // Local state for the input's display value.
        // Initialized from RHF's field.value.
        const [inputValue, setInputValue] = useState(field.value || "");

        // Effect to sync inputValue with field.value from RHF if it changes externally
        useEffect(() => {
          if (field.value !== inputValue) {
            setInputValue(field.value || "");
          }
        }, [field.value]); // Only re-run if RHF's field.value changes

        return (
          <FormItem>
            <FormLabel>
              Place of Birth
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  ref={(el) => {
                    field.ref(el); // Pass ref to RHF
                    inputRef.current = el; // Assign to local ref for Autocomplete
                  }}
                  name={field.name} // From RHF
                  value={inputValue} // Display local state
                  onChange={(e) => {
                    const typedValue = e.target.value;
                    setInputValue(typedValue); // Update display immediately
                    field.onChange(typedValue); // Inform RHF

                    // When user types, clear associated lat/long as they are no longer valid
                    // until a new place is selected from Autocomplete.
                    if (isAutocompleteInitialized) {
                      form.setValue("lat", "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                      form.setValue("long", "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                    }
                  }}
                  onBlur={field.onBlur} // Propagate blur to RHF
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      // Prevent default form submission when Enter is pressed in this input.
                      // Google Autocomplete's selection via Enter should still work,
                      // and will trigger the 'place_changed' event.
                      e.preventDefault();
                    }
                  }}
                  placeholder={mapsScriptError ? "Google Maps API failed to load" : (isLoaded ? "Search for a location..." : "Loading Google Maps...")}
                  className="pl-10" // For the icon
                  disabled={!!mapsScriptError || !isLoaded} // Disable if maps error or not loaded
                  required={required} // HTML5 required attribute
                  aria-required={required} // Accessibility
                />
                {mapsScriptError && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {typeof mapsScriptError === 'string' ? mapsScriptError : "Failed to load Google Maps"}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage /> {/* Shows RHF validation messages */}
          </FormItem>
        );
      }}
    />
  );
}