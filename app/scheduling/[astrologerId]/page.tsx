"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { ScheduleHeader } from "@/components/scheduling/schedule-header";
import { ScheduleSidebar } from "@/components/scheduling/schedule-sidebar";
import { ScheduleGrid } from "@/components/scheduling/schedule-grid";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// Define view mode type
type ViewMode = 'day' | 'week';

// Define guide type
interface Guide {
    id: number;
    unique_id: string;
    name: string;
    phone_number: string;
    skills: string;
    languages: string;
    years_of_experience: number;
}

// Define availability slot type
interface AvailabilitySlot {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
    created_at: string;
    updated_at: string;
}

// Define availability response type
interface AvailabilityResponse {
    guide: Guide;
    slots: AvailabilitySlot[];
}

export default function AstrologerSchedulingPage() {
    const params = useParams();
    const astrologerId = params?.astrologerId as string;

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [timezone, setTimezone] = useState<string>("");
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
    const [astrologerName, setAstrologerName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [slotStatusChanges, setSlotStatusChanges] = useState<{
        [key: string]: { newStatus: string; oldStatus: string; action: 'add' | 'delete' }
    }>({});

    // Set timezone based on user's location
    useEffect(() => {
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    // Extract fetchAvailability function
    const fetchAvailability = async () => {
        setIsLoading(true);
        try {
            // Remove the date parameter to get all slots
            const response = await fetch(`/api/astrologers/availability?astrologerId=${astrologerId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch availability');
            }

            const data: AvailabilityResponse = await response.json();

            // Set the guide information
            if (data.guide) {
                setAstrologerName(data.guide.name);
                // You can also store other guide information if needed
            }

            // Set the availability slots
            setAvailability(data.slots || []);
        } catch (error) {
            console.error('Error fetching availability:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Then in your useEffect, call this function
    useEffect(() => {
        fetchAvailability();
    }, [astrologerId]);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const handleTimezoneChange = (tz: string) => {
        setTimezone(tz);
    };

    const handleTimeSlotSelect = (timeSlot: string) => {
        setSelectedTimeSlots((prev) =>
            prev.includes(timeSlot)
                ? prev.filter(slot => slot !== timeSlot)
                : [...prev, timeSlot]
        );
    };

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
    };

    const handleSlotStatusChange = (slot: string, newStatus: string, oldStatus: string) => {
        console.log(`Slot status change: ${slot} from ${oldStatus} to ${newStatus}`);

        setSlotStatusChanges(prev => {
            // If we already have a change for this slot
            if (slot in prev) {
                const existingChange = prev[slot];
                const originalStatus = existingChange.oldStatus;

                // If we're toggling back to the original status, remove the change
                if (newStatus === originalStatus) {
                    const { [slot]: _, ...rest } = prev;
                    return rest;
                }

                // Otherwise, update the new status but keep the original old status
                return {
                    ...prev,
                    [slot]: {
                        newStatus,
                        oldStatus: originalStatus,
                        // Determine action based on the new status
                        action: newStatus === 'AVAILABLE' ? 'add' : 'delete'
                    }
                };
            }

            // If this is a new change, add it with the provided old status
            return {
                ...prev,
                [slot]: {
                    newStatus,
                    oldStatus,
                    // Determine action based on the new status
                    action: newStatus === 'AVAILABLE' ? 'add' : 'delete'
                }
            };
        });
    };

    const handleRegisterAvailability = async () => {
        // Check if there are any changes to process
        if (Object.keys(slotStatusChanges).length === 0) {
            toast({
                title: "No changes",
                description: "No slot changes to register",
            });
            return;
        }

        // Collect slots to add (newly marked as AVAILABLE)
        const slotsToAdd: { date: string; time: string }[] = [];

        // Collect slots to delete (changed from AVAILABLE to UNAVAILABLE)
        const slotsToDelete: { date: string; time: string }[] = [];

        // Process all slot status changes
        Object.entries(slotStatusChanges).forEach(([slot, { newStatus, oldStatus, action }]) => {
            const [dateStr, timeStr] = slot.split('-');

            // Fix the date parsing issue
            // Create a date object correctly from the dateStr
            // The dateStr is in format YYYY-MM-DD, so we should parse it directly
            const dateParts = dateStr.split('-').map(Number);
            const year = dateParts[0];
            const month = dateParts[1] - 1; // JavaScript months are 0-indexed
            const day = dateParts[2];

            const date = new Date(year, month, day);

            const [time, period] = timeStr.trim().split(' ');
            let [hours, minutes] = time.split(':').map(Number);

            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            // Use the ISO string date part directly from the original dateStr
            // This ensures we don't have timezone issues
            const formattedDate = dateStr;
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            // Use the action field to determine what to do
            if (action === 'add') {
                slotsToAdd.push({ date: formattedDate, time: formattedTime });
            } else if (action === 'delete') {
                slotsToDelete.push({ date: formattedDate, time: formattedTime });
            }
        });

        // Group slots by date for efficient API calls
        const addSlotsByDate = slotsToAdd.reduce((acc, { date, time }) => {
            if (!acc[date]) acc[date] = [];
            acc[date].push(time);
            return acc;
        }, {} as Record<string, string[]>);

        const deleteSlotsByDate = slotsToDelete.reduce((acc, { date, time }) => {
            if (!acc[date]) acc[date] = [];
            acc[date].push(time);
            return acc;
        }, {} as Record<string, string[]>);

        try {
            setIsLoading(true);

            // Track successful operations
            let allOperationsSuccessful = true;

            // First process deletions
            for (const [date, timeSlots] of Object.entries(deleteSlotsByDate)) {
                console.log('Deleting slots:', { date, timeSlots });

                if (timeSlots.length === 0) {
                    console.warn(`No time slots to delete for date ${date}, skipping`);
                    continue;
                }

                // Ensure date is in YYYY-MM-DD format
                // The date should already be in the correct format since we're using dateStr directly,
                // but let's validate it to be sure
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(date)) {
                    console.error(`Invalid date format for deletion: ${date}`);
                    allOperationsSuccessful = false;
                    continue;
                }

                // Log the request body
                const requestBody = {
                    guide_id: astrologerId,
                    date: date, // Ensure this is in YYYY-MM-DD format
                    time_slots: timeSlots,
                };
                console.log('Delete request body:', requestBody);

                try {
                    const response = await fetch("/api/astrologers/availability", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(requestBody),
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error(`Delete API error response:`, errorData);
                        allOperationsSuccessful = false;
                        throw new Error(`Failed to delete slots for ${date}: ${response.status} - ${JSON.stringify(errorData)}`);
                    }

                    // Update local state by removing deleted slots
                    if (response.ok) {
                        setAvailability(prev =>
                            prev.filter(slot => {
                                // Keep the slot if it's not in the deleted list
                                const slotTime = slot.start_time.substring(0, 5); // Get HH:MM part
                                return !(slot.date === date && timeSlots.includes(slotTime));
                            })
                        );
                    }
                } catch (error) {
                    allOperationsSuccessful = false;
                    console.error(`Error deleting slots for ${date}:`, error);
                    throw error; // Re-throw to be caught by the outer catch
                }
            }

            // Then process additions
            for (const [date, timeSlots] of Object.entries(addSlotsByDate)) {
                if (timeSlots.length === 0) continue;

                try {
                    const response = await fetch("/api/astrologers/availability", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            guide_id: astrologerId,
                            date,
                            time_slots: timeSlots,
                        }),
                    });

                    if (!response.ok) {
                        allOperationsSuccessful = false;
                        throw new Error(`Failed to register slots for ${date}`);
                    }

                    // Update local state by adding new slots from the response
                    if (response.ok) {
                        const data = await response.json();
                        if (data.slots && Array.isArray(data.slots)) {
                            // Add the new slots to our local state
                            setAvailability(prev => [...prev, ...data.slots]);
                        }
                    }
                } catch (error) {
                    allOperationsSuccessful = false;
                    console.error(`Error adding slots for ${date}:`, error);
                    throw error; // Re-throw to be caught by the outer catch
                }
            }

            // If all operations were successful, show success message and clear changes
            if (allOperationsSuccessful) {
                // Show success message
                const totalChanges = slotsToAdd.length + slotsToDelete.length;
                toast({
                    title: "Success",
                    description: `${totalChanges} slot changes saved successfully`,
                });

                // Clear changes
                setSlotStatusChanges({});

                // Refresh availability data to ensure UI is in sync with backend
                fetchAvailability();
            }
        } catch (error) {
            console.error("Error updating availability:", error);
            toast({
                title: "Error",
                description: "Failed to update availability slots",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <NavBar />

            <ScheduleHeader />

            <div className="container mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg">Loading availability...</p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-6">
                            {astrologerName ? `${astrologerName}'s Availability` : `Astrologer Availability`}
                        </h1>

                        <div className="flex flex-col md:flex-row gap-6">
                            <ScheduleSidebar
                                selectedDate={selectedDate}
                                onDateChange={handleDateChange}
                                timezone={timezone}
                                onTimezoneChange={handleTimezoneChange}
                                viewMode={viewMode}
                                onViewModeChange={handleViewModeChange}
                            />

                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">
                                        {viewMode === 'week' ?
                                            `Week of ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` :
                                            selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
                                        }
                                    </h2>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleRegisterAvailability}
                                            disabled={Object.keys(slotStatusChanges).length === 0 || isLoading}
                                            className="px-4 py-2"
                                        >
                                            {isLoading ? "Registering..." : "Register Selected Slots"}
                                        </Button>
                                    </div>
                                </div>

                                <ScheduleGrid
                                    selectedDate={selectedDate}
                                    timezone={timezone}
                                    onTimeSlotSelect={handleTimeSlotSelect}
                                    selectedTimeSlots={selectedTimeSlots}
                                    viewMode={viewMode}
                                    availabilityData={availability}
                                    onSlotStatusChange={handleSlotStatusChange}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
} 