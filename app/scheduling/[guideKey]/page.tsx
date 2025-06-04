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

interface GuideSlotsApiResponse {
  guide_details: GuideDetails;
  slots: AvailabilitySlotBE[];
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
  const [slotsToUnregister, setSlotsToUnregister] = useState<Set<number>>(new Set()); // For existing slot IDs
  const [isRegistering, setIsRegistering] = useState<boolean>(false); // For the "Register" button
  const [processingSlotKey, setProcessingSlotKey] = useState<string | null>(null); // State for the currently processing slot

  useEffect(() => {
    if (guideKey) {
      const fetchGuideDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          await fetchGuideSlots(guideKey);
        } catch (err) {
          // Error handling is done within fetchGuideSlots, which calls setError and toast
        } finally {
          setIsLoading(false); 
        }
      };
      fetchGuideDetails(); // Corrected function call
    } else {
      setIsLoading(false);
      setError("Guide key not found in URL.");
      toast({
        title: "Error",
        description: "Guide key not found in URL.",
        variant: "destructive",
      });
    }
  }, [guideKey]);

  const fetchGuideSlots = async (static_booking_key: string) => {
    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_DJANGO_URL;
      const response = await fetch(`${baseApiUrl}/api/guides/slots/?static_booking_key=${static_booking_key}`); 
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to fetch guide information." }));
        throw new Error(errorData.detail || "Failed to fetch guide information.");
      }
      const apiResponse: GuideSlotsApiResponse = await response.json();
      
      setGuideDetails(apiResponse.guide_details); // Set guide details from the response

      const slots = apiResponse.slots;

      const gridSlots: GridAvailabilitySlot[] = slots.map(slot => {
        const startDate = new Date(slot.start_time);
        // When USE_TZ=False, backend sends naive datetime strings.
        // new Date("YYYY-MM-DDTHH:MM:SS") interprets this as local time in the browser.
        // This matches the requirement if the user's browser is in the intended timezone (e.g., Asia/Kolkata)
        // or if the times are always meant to be displayed as per Asia/Kolkata values.

        const year = startDate.getFullYear();
        const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
        const dayOfMonth = startDate.getDate().toString().padStart(2, '0');
        const dateString = `${year}-${month}-${dayOfMonth}`;

        const hours = startDate.getHours().toString().padStart(2, '0');
        const minutes = startDate.getMinutes().toString().padStart(2, '0');
        const seconds = startDate.getSeconds().toString().padStart(2, '0');
        return {
          date: dateString, // YYYY-MM-DD
          start_time: `${hours}:${minutes}:${seconds}`, // HH:MM:SS
          id: slot.id, 
          is_booked: slot.is_booked, // Map the is_booked status
        };
      });
      setAvailabilityData(gridSlots);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error("Error fetching guide slots:", errorMessage);
      setError(errorMessage);
      toast({
        title: "Error Loading Guide Data",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleToggleSlotSelection = (
    day: Date,
    timeSlot24H: string, // HH:MM
    slotId?: number, // Provided if it's an existing slot from availabilityData
    isCurrentlyBooked?: boolean // From the grid, indicates if the slot is visually "booked"
  ) => {
    const localYear = day.getFullYear();
    const localMonth = (day.getMonth() + 1).toString().padStart(2, '0');
    const localDayOfMonth = day.getDate().toString().padStart(2, '0');
    const localDateString = `${localYear}-${localMonth}-${localDayOfMonth}`;
    const slotKeyForNew = `${localDateString}-${timeSlot24H}`;

    const displayDate = day.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const [hourStr, minuteStr] = timeSlot24H.split(':');
    const displayHour = parseInt(hourStr, 10);
    const displayMinute = minuteStr;
    const displayPeriod = displayHour >= 12 ? 'PM' : 'AM';
    const displayTime12H = `${displayHour % 12 || 12}:${displayMinute} ${displayPeriod}`;
    
    if (slotId !== undefined) { // Interacting with an existing slot
      setSlotsToUnregister(prevUnreg => {
        const newUnregSet = new Set(prevUnreg);
        if (newUnregSet.has(slotId)) {
          newUnregSet.delete(slotId);
          toast({
            title: "Slot Deselected for Unregistration",
            description: `Slot on ${displayDate} at ${displayTime12H} removed from unregistration.`,
          });
        } else {
          newUnregSet.add(slotId);
          toast({
            title: "Slot Selected for Unregistration",
            description: `Slot on ${displayDate} at ${displayTime12H} marked for unregistration.`,
          });
        }
        return newUnregSet;
      });
      // If an existing slot is selected for unregistration, it cannot be selected for new registration
      setSlotsToRegister(prevReg => {
        const newRegSet = new Set(prevReg);
        if (newRegSet.has(slotKeyForNew)) { // Should ideally not happen if UI is clear
          newRegSet.delete(slotKeyForNew);
        }
        return newRegSet;
      });
    } else { // Interacting with a potential new slot
      setSlotsToRegister(prevReg => {
        const newRegSet = new Set(prevReg);
        if (newRegSet.has(slotKeyForNew)) {
          newRegSet.delete(slotKeyForNew);
          toast({
            title: "Slot Deselected for Registration",
            description: `New slot on ${displayDate} at ${displayTime12H} removed from registration.`,
          });
        } else {
          newRegSet.add(slotKeyForNew);
          toast({
            title: "Slot Selected for Registration",
            description: `New slot on ${displayDate} at ${displayTime12H} added for registration.`,
          });
        }
        return newRegSet;
      });
    }
  };
  

  const handleUpdateAvailability = async () => {
    if (!guideDetails) {
        toast({ title: "Error", description: "Guide details not loaded.", variant: "destructive" });
        return;
    }
    if (slotsToRegister.size === 0 && slotsToUnregister.size === 0) {
        toast({
            title: "No Changes",
            description: "No slots selected for registration or unregistration.",
            variant: "default",
        });
        return;
    }

    setIsRegistering(true);
    const baseApiUrl = process.env.NEXT_PUBLIC_DJANGO_URL;

    const slotsToCreatePayload = Array.from(slotsToRegister).map(slotKey => {
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

        // Format as naive datetime string "YYYY-MM-DDTHH:MM:SS"
        const formatToNaiveDateTimeString = (date: Date) => {
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = date.getSeconds().toString().padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };

        return {
            start_time: formatToNaiveDateTimeString(startDateTime),
            end_time: formatToNaiveDateTimeString(endDateTime),
            is_booked: true, // Explicitly set new slots created by the guide as booked
        };
    }).filter(Boolean) as { start_time: string; end_time: string; }[]; // Filter out nulls and assert type

    const slotIdsToDeletePayload = Array.from(slotsToUnregister);

    if (slotsToCreatePayload.length === 0 && slotsToRegister.size > 0) { // Check if any new slots were malformed
        toast({ title: "Error", description: "Could not process any new slots due to malformed data. Please try again.", variant: "destructive" });
        setIsRegistering(false);
        return;
    }

    const payload = {
        static_booking_key: guideDetails.static_booking_key, // Add key to payload
        slots_to_create: slotsToCreatePayload,
        slot_ids_to_delete: slotIdsToDeletePayload,
    };

    try {
        // Corrected endpoint: /api/guides/slots/
        const response = await fetch(`${baseApiUrl}/api/guides/slots/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const responseData = await response.json().catch(() => ({ detail: "Failed to process request. Invalid JSON response." }));

        if (!response.ok) {
            let errorMessage = responseData.detail || "An unknown error occurred during the update.";
            if (responseData.slots_to_create_validation) {
                const createErrors = Array.isArray(responseData.slots_to_create_validation) ?
                    responseData.slots_to_create_validation.map((e: any) => e.non_field_errors || JSON.stringify(e)).join(', ') :
                    JSON.stringify(responseData.slots_to_create_validation);
                errorMessage = `Slot creation error: ${createErrors}`;
            } else if (typeof responseData === 'string') {
                errorMessage = responseData;
            }
            
            const isConflictError = errorMessage.includes("must make a unique set") ||
                                  errorMessage.includes("violates unique constraint") ||
                                  errorMessage.includes("already exists");

            if (isConflictError) {
                toast({
                    title: "Slot Conflict",
                    description: "One or more new slots conflicted with existing ones. Refreshing availability.",
                    variant: "default",
                });
            } else {
                throw new Error(errorMessage);
            }
        } else {
            let successMessage = "Availability updated.";
            if (responseData.created_count > 0 || responseData.deleted_count > 0) {
                successMessage = `Registered ${responseData.created_count || 0}, Unregistered ${responseData.deleted_count || 0} slot(s).`;
            }
            toast({ title: "Success", description: successMessage });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Could not update availability.";
        console.error("Error updating availability:", errorMessage);
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
      } finally {
        // Attempt to refresh slots. This will only work if a GET endpoint is available.
        if (guideDetails?.static_booking_key) {
          fetchGuideSlots(guideDetails.static_booking_key);
        }
        setSlotsToRegister(new Set()); // Clear selection
        setIsRegistering(false);
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
    return <div className="min-h-screen flex justify-center items-center"><p>Guide information not available.</p></div>;
  }

  // Button text logic
  let buttonText = "Update Availability";
  const regCount = slotsToRegister.size;
  const unregCount = slotsToUnregister.size;

  if (isRegistering) {
      buttonText = "Updating...";
  } else if (regCount > 0 && unregCount > 0) {
      buttonText = `Register ${regCount}, Unregister ${unregCount} Slot(s)`;
  } else if (regCount > 0) {
      buttonText = `Register ${regCount} New Slot(s)`;
  } else if (unregCount > 0) {
      buttonText = `Unregister ${unregCount} Slot(s)`;
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
                  selectedSlotsToUnregister={slotsToUnregister} // Pass the new set
                  processingSlotKey={processingSlotKey} // Pass the processingSlotKey
                />
            </div>
            {(slotsToRegister.size > 0 || slotsToUnregister.size > 0) && (
                <Button 
                  onClick={handleUpdateAvailability} 
                  disabled={isRegistering || (slotsToRegister.size === 0 && slotsToUnregister.size === 0) } 
                  className="w-full md:w-auto bg-[#FF7F50] hover:bg-[#FF6A3D]"
                >
                    {buttonText}
                </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}