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
  made_available_after_booking?: boolean; // New field from backend
  created_at: string;
  updated_at: string;
}

// For ScheduleGrid component
interface GridAvailabilitySlot {
    date: string; // YYYY-MM-DD
    start_time: string; // HH:MM:SS
    id: number; 
    is_booked?: boolean; // To indicate if the slot is booked by a customer
    made_available_after_booking?: boolean; // New field
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
  const [slotsToRegisterNew, setSlotsToRegisterNew] = useState<Set<string>>(new Set()); // For brand new slots
  const [slotsToMarkAsUnbooked, setSlotsToMarkAsUnbooked] = useState<Set<number>>(new Set()); // Existing slots to set is_booked = false
  const [slotsToMarkAsBookedByGuide, setSlotsToMarkAsBookedByGuide] = useState<Set<number>>(new Set()); // Existing slots to set is_booked = true
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
        // Use local date components for consistency with selection keying
        const localYear = startDate.getFullYear();
        const localMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
        const localDayOfMonth = startDate.getDate().toString().padStart(2, '0');
        const localDateString = `${localYear}-${localMonth}-${localDayOfMonth}`;

        // Ensure slot.id is a number
        const numericId = Number(slot.id);
        if (isNaN(numericId)) {
            console.error(`Slot with non-numeric ID received from backend and skipped:`, slot);
            return null; // Skip this slot if its ID is not a valid number
        }

        return {
          date: localDateString, // YYYY-MM-DD from local interpretation
          start_time: startDate.toTimeString().split(' ')[0], // HH:MM:SS
          id: numericId, // Use the validated numeric ID
          is_booked: slot.is_booked, // Map the is_booked status
          made_available_after_booking: slot.made_available_after_booking, // Map the new field
        };
      }).filter(Boolean) as GridAvailabilitySlot[]; // Filter out any nulls from skipped slots
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
    existingSlotData?: GridAvailabilitySlot // Full existing slot data if available
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
    
    if (existingSlotData) { // Interacting with an existing slot
      const slotId = existingSlotData.id;
      // Clear from new registration if it was somehow selected
      setSlotsToRegisterNew(prevReg => {
        const newSet = new Set(prevReg);
        newSet.delete(slotKeyForNew);
        return newSet;
      });

      if (existingSlotData.is_booked) { // Red slot: toggle for unbooking (make available)
        setSlotsToMarkAsUnbooked(prevUnreg => {
          const newSet = new Set(prevUnreg);
          if (newSet.has(slotId)) {
            newSet.delete(slotId);
            toast({ title: "Deselected", description: `Booked slot on ${displayDate} at ${displayTime12H} will remain booked.` });
          } else {
            newSet.add(slotId);
            toast({ title: "Selected to Unbook", description: `Slot on ${displayDate} at ${displayTime12H} will be marked as unbooked.` });
          }
          return newSet;
        });
        // If selected to be unbooked, it cannot be selected to be booked by guide
        setSlotsToMarkAsBookedByGuide(prevBook => { const newSet = new Set(prevBook); newSet.delete(slotId); return newSet; });
      } else { // Green slot (is_booked === false): toggle for booking by guide
        setSlotsToMarkAsBookedByGuide(prevBook => {
          const newSet = new Set(prevBook);
          if (newSet.has(slotId)) {
            newSet.delete(slotId);
            toast({ title: "Deselected for Booking", description: `Slot on ${displayDate} at ${displayTime12H} will remain unbooked.` });
          } else {
            newSet.add(slotId);
            toast({ title: "Selected for Booking", description: `Slot on ${displayDate} at ${displayTime12H} will be marked as booked.` });
          }
          return newSet;
        });
        // If selected to be booked by guide, it cannot be selected to be unbooked
        setSlotsToMarkAsUnbooked(prevUnreg => { const newSet = new Set(prevUnreg); newSet.delete(slotId); return newSet; });
      }
    } else { // Interacting with a potential new slot (no existingSlotData)
      setSlotsToRegisterNew(prevReg => {
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
      // If a new slot is selected, clear any existing slot selections for this cell (should not happen with current UI)
      // This part is more of a safeguard if the UI allowed clicking an existing slot then a new one in same cell.
    }
  };
  

  const handleUpdateAvailability = async () => {
    if (!guideDetails) {
        toast({ title: "Error", description: "Guide details not loaded.", variant: "destructive" });
        return;
    }
    if (slotsToRegisterNew.size === 0 && slotsToMarkAsUnbooked.size === 0 && slotsToMarkAsBookedByGuide.size === 0) {
        toast({
            title: "No Changes",
            description: "No slots selected for registration or unregistration.",
            variant: "default",
        });
        return;
    }

    setIsRegistering(true);
    const baseApiUrl = process.env.NEXT_PUBLIC_DJANGO_URL;

    const slotsToCreatePayload = Array.from(slotsToRegisterNew).map(slotKey => {
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

        const endDateTime = new Date(startDateTime.getTime() + 60 * 60000); // Add 30 minutes
        return {
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
        };
    }).filter(Boolean) as { start_time: string; end_time: string; }[]; // Filter out nulls and assert type

    // Note: The logic to populate slotsToMarkAsUnbooked and slotsToMarkAsBookedByGuide
    // is already handled by handleToggleSlotSelection. We just convert the Sets to Arrays here.

    if (slotsToCreatePayload.length === 0 && slotsToRegisterNew.size > 0) { // Check if any new slots were malformed
        toast({ title: "Error", description: "Could not process any new slots due to malformed data. Please try again.", variant: "destructive" });
        setIsRegistering(false);
        return;
    }

    const payload = {
        static_booking_key: guideDetails.static_booking_key, // Add key to payload
        slots_to_create: slotsToCreatePayload,
        slot_ids_to_mark_as_unbooked: Array.from(slotsToMarkAsUnbooked),
        slot_ids_to_mark_as_booked_by_guide: Array.from(slotsToMarkAsBookedByGuide),
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
            const created = responseData.created_count || 0;
            const markedUnbooked = responseData.marked_unbooked_count || 0; // Expect from backend
            const markedBooked = responseData.marked_booked_count || 0;   // Expect from backend
            if (created > 0 || markedUnbooked > 0 || markedBooked > 0) {
                successMessage = `Registered: ${created}, Marked Unbooked: ${markedUnbooked}, Marked Booked: ${markedBooked}.`;
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
        setSlotsToMarkAsUnbooked(new Set());
        setSlotsToMarkAsBookedByGuide(new Set());
        setSlotsToRegisterNew(new Set());
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
  const newSlotsCount = slotsToRegisterNew.size;
  const markUnbookedCount = slotsToMarkAsUnbooked.size;
  const markBookedCount = slotsToMarkAsBookedByGuide.size;
  const totalActions = newSlotsCount + markUnbookedCount + markBookedCount;

  if (isRegistering) {
      buttonText = "Updating...";
  } else if (totalActions > 0) {
      const parts = [];
      if (newSlotsCount > 0) parts.push(`Register ${newSlotsCount}`);
      if (markUnbookedCount > 0) parts.push(`Mark Unbooked ${markUnbookedCount}`);
      if (markBookedCount > 0) parts.push(`Mark Booked ${markBookedCount}`);
      buttonText = parts.join(', ') + (totalActions === 1 && newSlotsCount === 1 && parts[0].includes("Register") ? " New Slot" : " Slot(s)");
      if (parts.length > 1) {
        const lastPart = parts.pop();
        buttonText = parts.join(', ') + ` & ${lastPart}` + (totalActions === 1 && regCount === 1 && parts.length === 0 && lastPart?.includes("Register") ? " New Slot" : " Slot(s)");
      }
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
                  selectedSlotsToRegister={slotsToRegisterNew}
                  selectedSlotsToMarkAsUnbooked={slotsToMarkAsUnbooked}
                  selectedSlotsToMarkAsBookedByGuide={slotsToMarkAsBookedByGuide}
                  processingSlotKey={processingSlotKey} // Pass the processingSlotKey
                />
            </div>
            {totalActions > 0 && (
                <Button 
                  onClick={handleUpdateAvailability} 
                  disabled={isRegistering || totalActions === 0}
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