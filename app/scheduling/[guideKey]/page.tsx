"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ScheduleGrid } from "@/components/scheduling/schedule-grid";
import { ScheduleSidebar } from "@/components/scheduling/schedule-sidebar"; // Import Sidebar
import { NavBar } from "@/components/nav-bar"; // Assuming you have these components
import { Button } from "@/components/ui/button"; // Import Button
import { Footer } from "@/components/footer";   // Assuming you have these components
import { toast } from "@/components/ui/use-toast";

interface GuideDetails {
  id: number;
  name: string;
  static_booking_key: string; 
} 

interface AvailabilitySlotBE { // From backend
  id: number;
  guide: number;
  start_time: string; // ISO DateTime string
  end_time: string; // ISO DateTime string
  is_booked: boolean;
  created_at: string;
  updated_at: string;
}

// For ScheduleGrid component
interface GridAvailabilitySlot {
    date: string; // YYYY-MM-DD
    start_time: string; // HH:MM:SS
    id: number; 
    is_booked?: boolean; // To indicate if the slot is booked by a customer
}

export default function GuideSlotRegistrationPage() {
  const params = useParams();
  const guideKey = params.guideKey! as string; 

  const [guideDetails, setGuideDetails] = useState<GuideDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availabilityData, setAvailabilityData] = useState<GridAvailabilitySlot[]>([]);

  // State for sidebar and grid
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [slotsToRegister, setSlotsToRegister] = useState<Set<string>>(new Set());
  const [isRegistering, setIsRegistering] = useState<boolean>(false); // For the "Register" button
  const [processingSlotKey, setProcessingSlotKey] = useState<string | null>(null); // State for the currently processing slot

  useEffect(() => {
    if (guideKey) {
      const fetchGuideDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/guide-by-key/${guideKey}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || data.details || "Failed to validate guide key");
          }

          if (data.message === "Key is valid." && data.guide) {
            setGuideDetails(data.guide);
            fetchGuideSlots(data.guide.static_booking_key); // Fetch slots using static_booking_key
          } else {
            throw new Error("Invalid guide key or data format.");
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
          console.error("Error fetching guide details:", errorMessage);
          setError(errorMessage);
          toast({
            title: "Error",
            description: `Could not load guide information: ${errorMessage}`,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchGuideDetails();
    } else {
      setIsLoading(false);
      setError("Guide key not found in URL.");
    }
  }, [guideKey]);

  const fetchGuideSlots = async (static_booking_key: string) => {
    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";
      // Assuming backend filters by 'guide_key' for the static_booking_key
      const response = await fetch(`${baseApiUrl}/api/guides/slots/?guide_key=${static_booking_key}`); 
      if (!response.ok) {
        throw new Error("Failed to fetch guide slots");
      }
      const slots: AvailabilitySlotBE[] = await response.json();
      const gridSlots: GridAvailabilitySlot[] = slots.map(slot => {
        const startDate = new Date(slot.start_time);
        // Use local date components for consistency with selection keying
        const localYear = startDate.getFullYear();
        const localMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
        const localDayOfMonth = startDate.getDate().toString().padStart(2, '0');
        const localDateString = `${localYear}-${localMonth}-${localDayOfMonth}`;
        return {
          date: localDateString, // YYYY-MM-DD from local interpretation
          start_time: startDate.toTimeString().split(' ')[0], // HH:MM:SS
          id: slot.id, 
          is_booked: slot.is_booked, // Map the is_booked status
        };
      });
      setAvailabilityData(gridSlots);
    } catch (err) {
      console.error("Error fetching guide slots:", err);
      // Optionally show a toast or set an error state specific to slots
    }
  };

  const handleToggleSlotSelection = (
    day: Date, 
    timeSlot24H: string // HH:MM
  ) => {
    // Use local date components to ensure the key matches the user's perceived date
    const localYear = day.getFullYear();
    const localMonth = (day.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-indexed
    const localDayOfMonth = day.getDate().toString().padStart(2, '0');
    const localDateString = `${localYear}-${localMonth}-${localDayOfMonth}`;
    // Format for display in toast
    const displayDate = day.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const [hourStr, minuteStr] = timeSlot24H.split(':');
    const displayHour = parseInt(hourStr, 10);
    const displayMinute = minuteStr;
    const displayPeriod = displayHour >= 12 ? 'PM' : 'AM';
    const displayTime12H = `${displayHour % 12 || 12}:${displayMinute} ${displayPeriod}`;

    const slotKey = `${localDateString}-${timeSlot24H}`;
    
    setSlotsToRegister(prev => {
        const newSet = new Set(prev);
        if (newSet.has(slotKey)) {
            newSet.delete(slotKey);
            toast({
                title: "Slot Deselected",
                description: `Slot on ${displayDate} at ${displayTime12H} removed from registration list.`,
            });
        } else {
            newSet.add(slotKey);
            toast({
                title: "Slot Selected",
                description: `Slot on ${displayDate} at ${displayTime12H} added for registration.`,
            });
        }
        return newSet;
    });
  };
  

  const handleRegisterSelectedSlots = async () => {
    if (!guideDetails || slotsToRegister.size === 0) {
        toast({
            title: "No Slots Selected",
            description: "Please select one or more new time slots to register.",
            variant: "default",
        });
        return;
    }

    setIsRegistering(true);
    const baseApiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";

    const slotsPayload = Array.from(slotsToRegister).map(slotKey => {
        const parts = slotKey.split('-');
        if (parts.length !== 4) {
            console.error(`Malformed slotKey encountered: ${slotKey}. Skipping this slot.`);
            return null; 
        }
        const dateString = `${parts[0]}-${parts[1]}-${parts[2]}`; // Reconstruct YYYY-MM-DD
        const timeSlot24H = parts[3]; // HH:MM

        // Validate HH:MM format for timeSlot24H (simple check)
        if (!/^\d{2}:\d{2}$/.test(timeSlot24H)) {
            console.error(`Malformed time in slotKey: ${slotKey}. Skipping this slot.`);
            return null;
        }

        const startDateTime = new Date(`${dateString}T${timeSlot24H}:00`);
        // Check if date is valid after construction
        if (isNaN(startDateTime.getTime())) {
            console.error(`Invalid Date constructed from slotKey: ${slotKey} (using "${dateString}T${timeSlot24H}:00"). Skipping this slot.`);
            return null;
        }

        const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // Add 30 minutes
        return {
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
        };
    }).filter(Boolean) as { start_time: string; end_time: string; }[]; // Filter out nulls and assert type

    if (slotsPayload.length === 0 && slotsToRegister.size > 0) {
        toast({ title: "Error", description: "Could not process any selected slots due to malformed data. Please try again.", variant: "destructive"});
        setIsRegistering(false);
        return;
    }

    try {
        const response = await fetch(`${baseApiUrl}/api/guides/slots/bulk-create/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-Booking-Key': guideDetails.static_booking_key,
            },
            body: JSON.stringify(slotsPayload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: "Failed to create slot." }));
          let extractedMessage = "An unknown error occurred during slot registration.";

          // Handle DRF's non_field_errors structure which can be an array of objects
          if (Array.isArray(errorData) && errorData.length > 0) {
            if (errorData[0].non_field_errors && Array.isArray(errorData[0].non_field_errors) && errorData[0].non_field_errors.length > 0) {
              extractedMessage = errorData[0].non_field_errors[0];
            } else if (typeof errorData[0] === 'string') { // Sometimes it might be an array of strings
              extractedMessage = errorData[0];
            }
          } else if (errorData.detail) { // Standard DRF detail error
            extractedMessage = errorData.detail;
          } else if (errorData.message) { // Generic message property
            extractedMessage = errorData.message;
          } else if (typeof errorData === 'string') { // Plain string error
            extractedMessage = errorData;
          }
          const errorMessageString = extractedMessage;

          // Check for common phrases indicating a unique constraint violation
          const isUniqueConstraintError = 
            errorMessageString.includes("must make a unique set") || 
            errorMessageString.includes("violates unique constraint") ||
            errorMessageString.includes("already exists");

          if (isUniqueConstraintError) {
            console.warn("Attempted to create a slot that already exists or would conflict. Backend message:", errorMessageString);
            toast({
                title: "Slot Information",
                description: "One or more selected slots already exist or conflicted. Refreshing availability.",
                variant: "default", 
            });
          } else {
            throw new Error(errorMessageString || `Error creating slots: ${response.status}`);
          }
        } else {
          // Successful creation
          toast({ title: "Success", description: `${slotsPayload.length} slot(s) request processed.` });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Could not register selected slots.";
        console.error("Error registering selected slots:", errorMessage);
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
      } finally {
        fetchGuideSlots(guideDetails.static_booking_key); // Always refresh
        setSlotsToRegister(new Set()); // Clear selection
        setIsRegistering(false);
      }
  };


  const handleAttemptDeleteSlot = async (slotId: number) => {
        const currentGuideKey = guideDetails?.static_booking_key;
        if (!currentGuideKey) {
            toast({ title: "Error", description: "Guide key not available.", variant: "destructive" });
            return;
        }

        const confirmed = window.confirm("Are you sure you want to unregister this time slot?");
        if (!confirmed) {
            return;
        }

        setIsLoading(true); // Use a general loading state or a specific one for deletion
        setProcessingSlotKey(`delete-${slotId}`); // Optional: indicate which slot is being processed

        const baseApiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";
        try {
            // The DELETE request to /api/guides/slots/{id}/ should be authenticated.
            // The backend's perform_destroy checks request.user against the slot's guide.
            // No X-Booking-Key is strictly needed here if authentication is handled (e.g., JWT).
            const response = await fetch(`${baseApiUrl}/api/guides/slots/${slotId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization header if your API requires JWT or other token
                    // 'Authorization': `Bearer ${yourAuthToken}`, 
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: "Failed to delete slot." }));
                throw new Error(errorData.detail || `Error: ${response.status}`);
            }

            toast({ title: "Success", description: "Slot unregistered successfully." });
            // Update local state to reflect deletion
            setAvailabilityData(prev => prev.filter(slot => slot.id !== slotId));

        } catch (error) {
            toast({ title: "Error", description: (error instanceof Error ? error.message : "Could not unregister slot."), variant: "destructive" });
        } finally {
            setIsLoading(false);
            setProcessingSlotKey(null);
        }
    };

    if (error) {
        return <div className="container mx-auto p-4 text-red-500">{error}</div>;
    }

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><p>Loading guide information...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center"><p>Error: {error}</p></div>;
  }

  if (!guideDetails) {
    return <div className="min-h-screen flex justify-center items-center"><p>Guide not found or key is invalid.</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          Manage Your Availability, {guideDetails.name}
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-auto"> {/* Sidebar container */}
            <ScheduleSidebar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              timezone="Asia/Kolkata" // Make dynamic if needed
              onTimezoneChange={() => {}} // Placeholder for timezone change logic
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
          <div className="flex-grow space-y-4"> {/* Grid container and button */}
            <div>
                <ScheduleGrid
                  selectedDate={selectedDate}
                  timezone="Asia/Kolkata" // Make dynamic if needed
                  onToggleSlotSelection={handleToggleSlotSelection}
                  viewMode={viewMode}
                  availabilityData={availabilityData}
                  selectedSlotsToRegister={slotsToRegister}
                  // processingSlotKey={isRegistering ? "all" : null} // Or handle global processing differently
                  onAttemptDeleteSlot={handleAttemptDeleteSlot} // Pass the handler function
                  processingSlotKey={processingSlotKey} // Pass the processingSlotKey
                />
            </div>
            {slotsToRegister.size > 0 && (
                <Button onClick={handleRegisterSelectedSlots} disabled={isRegistering} className="w-full md:w-auto bg-[#FF7F50] hover:bg-[#FF6A3D]">
                    {isRegistering ? "Registering..." : `Register ${slotsToRegister.size} Selected Slot(s)`}
                </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}