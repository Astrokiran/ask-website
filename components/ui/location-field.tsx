import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPinIcon } from "lucide-react";

export default function LocationField({ form }) {
  const [search, setSearch] = useState(""); // Store user input
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  // Fetch locations from OpenStreetMap API based on user input
  const fetchLocations = async (input: string) => {
    setSearch(input); // Update search input value
    if (input.length < 3) return; // Avoid too many requests on short inputs

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
    );
    const data = await response.json();

    const newOptions = data
      .filter((loc: any) => loc.display_name) // Ensure valid locations
      .map((loc: any) => ({ value: loc.display_name, label: loc.display_name }));

    setOptions(newOptions);
  };

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

              {/* Search Input for Location */}
              <Input
                value={search}
                onChange={(e) => fetchLocations(e.target.value)}
                placeholder="Type to search..."
                className="pl-10 mb-2"
              />

              {/* Select Dropdown for Choosing Location */}
              <Select onValueChange={(value) => form.setValue("place", value)}>
                <SelectTrigger className="pl-10">
                  {field.value || "Select a location"}
                </SelectTrigger>
                <SelectContent>
                  {options.length === 0 ? (
                    <SelectItem value="loading" disabled>
                      No results found
                    </SelectItem>
                  ) : (
                    options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}