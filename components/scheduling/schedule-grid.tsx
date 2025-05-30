import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card"; // Assuming this path is correct

interface GridAvailabilitySlot { // Renamed to match parent and for clarity
    date: string; // e.g., "2025-04-01" (YYYY-MM-DD format is best for new Date())
    start_time: string; // e.g., "09:00:00"
    id: number; 
    is_booked?: boolean; // To indicate if the slot is booked by a customer
}

interface ScheduleGridProps {
    selectedDate: Date; // Used to determine the initial view range
    timezone: string; // For future timezone-aware calculations
    // onSlotInteract is replaced by onToggleSlotSelection for a different interaction model
    onToggleSlotSelection: (
        day: Date, 
        timeSlot24H: string
    ) => void;
    onAttemptDeleteSlot: (slotId: number) => void; // New prop for handling deletion attempts
    viewMode: "day" | "week";
    availabilityData?: GridAvailabilitySlot[]; // Existing slots from backend
    selectedSlotsToRegister?: Set<string>; // Keys of slots selected for registration
    processingSlotKey?: string | null; // Key of the slot currently being processed
}

export function ScheduleGrid({
    selectedDate,
    timezone,
    onToggleSlotSelection,
    onAttemptDeleteSlot,
    viewMode,
    availabilityData = [],
    selectedSlotsToRegister = new Set(),
    processingSlotKey,
}: ScheduleGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    // Constants for responsive design
    const TIME_COLUMN_WIDTH = "60px"; // For "9:00 AM"
    const DAY_COLUMN_MIN_WIDTH = "70px"; // For "Wed" & "23"

    const now = new Date();

    // Use a Map for efficient lookup of existing slots
    const [existingSlotsMap, setExistingSlotsMap] = useState<Map<string, GridAvailabilitySlot>>(new Map());

    useEffect(() => {
        // This effect can be used to process availabilityData if needed for complex styling
        // For now, we'll directly check availabilityData in the render
    }, [availabilityData]);

    useEffect(() => {
        const newMap = new Map<string, GridAvailabilitySlot>();
        availabilityData.forEach(slot => {
            // Key: "YYYY-MM-DD-HH:MM" (24-hour format for start_time, using the local date from slot.date)
            // slot.date is already in local YYYY-MM-DD format from page.tsx
            const startTime24H = slot.start_time.substring(0, 5); // Extracts HH:MM
            // Ensure slot.date is used directly as it's already the local date string
            if (!slot.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                console.warn("ScheduleGrid: Encountered slot with malformed date:", slot);
            }
            const key = `${slot.date}-${startTime24H}`;
            newMap.set(key, slot);
        });
        setExistingSlotsMap(newMap);
    }, [availabilityData]);

    const daysToDisplay = viewMode === "day"
        ? [selectedDate]
        : Array.from({ length: 7 }, (_, i) => {
            const date = new Date(selectedDate);
            // Ensure the week starts correctly based on your locale or preference
            const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)
            date.setDate(date.getDate() - dayOfWeek + i);
            return date;
        });

    const timeSlots = [];
    // Generate time slots from 6:00 AM to 9:30 PM in 30-minute increments
    for (let hour = 6; hour <= 21; hour++) { // 6 AM up to 9 PM hour
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 21 && minute > 30) break; // Ensures 9:30 PM is the last slot from 9 PM hour

            const formattedHour = hour % 12 || 12;
            const period = hour < 12 || hour === 24 ? "AM" : "PM";
            timeSlots.push(`${formattedHour}:${minute === 0 ? "00" : minute} ${period}`);
        }
    }


    // Helper to parse slot string and day into a Date object
    const parseSlotDateTime = (timeSlot: string, day: Date): Date => {
        const referenceDate = new Date(day); // Copy of the day part

        const [time, period] = timeSlot.split(" ");
        const [hoursStr, minutesStr] = time.split(":");
        let hours = parseInt(hoursStr, 10);
        let minutes = parseInt(minutesStr, 10);

        if (period.toUpperCase() === "PM" && hours !== 12) {
            hours += 12;
        } else if (period.toUpperCase() === "AM" && hours === 12) { // 12 AM is 00 hours
            hours = 0;
        }

        // Create a new Date object for the specific slot, using year, month, date from referenceDate
        const slotDateTime = new Date(
            referenceDate.getFullYear(),
            referenceDate.getMonth(),
            referenceDate.getDate(),
            hours,
            minutes,
            0, // seconds
            0  // milliseconds
        );
        return slotDateTime;
    };

    const isSlotInPast = (timeSlot: string, day: Date): boolean => {
        const slotDateTime = parseSlotDateTime(timeSlot, day);
        const isPast = slotDateTime < now;
        // console.log(`Slot: ${day.toDateString()} ${timeSlot} (${slotDateTime.toString()}) | Now: ${now.toString()} | IsPast: ${isPast}`); // DEBUG
        return isPast;
    };

    const gridCols = daysToDisplay.length + 1;

    // Calculate the grid template columns style
    const gridTemplateColumnsStyle = `${TIME_COLUMN_WIDTH} repeat(${daysToDisplay.length}, minmax(${DAY_COLUMN_MIN_WIDTH}, 1fr))`;

    // Calculate minimum width for the scrollable grid area
    const calculatedMinWidth = parseInt(TIME_COLUMN_WIDTH) + daysToDisplay.length * parseInt(DAY_COLUMN_MIN_WIDTH);
    const minWidthStyle = `${calculatedMinWidth}px`;

    const getExistingSlotDetails = (day: Date, timeSlot12H: string): GridAvailabilitySlot | undefined => {
        const slotDateTime = parseSlotDateTime(timeSlot12H, day);
        // Use local date components for the key
        const localYear = day.getFullYear();
        const localMonth = (day.getMonth() + 1).toString().padStart(2, '0');
        const localDayOfMonth = day.getDate().toString().padStart(2, '0');
        const localDateString = `${localYear}-${localMonth}-${localDayOfMonth}`; // YYYY-MM-DD
        const timeSlot24H = `${slotDateTime.getHours().toString().padStart(2, '0')}:${slotDateTime.getMinutes().toString().padStart(2, '0')}`;
        return existingSlotsMap.get(`${localDateString}-${timeSlot24H}`);
    };

    const handleGridMouseUp = () => {
        // Placeholder if needed in future for drag-release logic
    };

    return (
        <Card className="p-2 sm:p-4 overflow-auto">
            <div
                className="grid-container" // More semantic class name
                ref={gridRef}
                onMouseUp={handleGridMouseUp} // If complex drag interactions are re-added
                onMouseLeave={handleGridMouseUp} // If complex drag interactions are re-added
                style={{ minWidth: minWidthStyle }}
            >
                {/* Header Row */}
                <div className="grid gap-1 mb-2 sticky top-0 bg-white z-20" style={{ gridTemplateColumns: gridTemplateColumnsStyle }}>
                    <div className="p-1 sm:p-2 font-medium text-[11px] sm:text-xs text-gray-500 sticky left-0 bg-white z-10">Time</div>
                    {daysToDisplay.map((day, index) => (
                        <div key={index} className="p-2 font-medium text-sm text-center">
                            <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div>{day.getDate()}</div>
                        </div>
                    ))}
                </div>

                {/* Data Rows */}
                <div className="space-y-1">
                    {timeSlots.map((timeSlot, timeIndex) => (
                        <div
                            key={timeIndex}
                            className="grid gap-1"
                            style={{ gridTemplateColumns: gridTemplateColumnsStyle }}
                        >
                            <div className="p-1 sm:p-2 text-[10px] sm:text-xs text-gray-500 sticky left-0 bg-white z-10 flex items-center">{timeSlot}</div>
                            {daysToDisplay.map((day, dayIndex) => {
                                const existingSlot = getExistingSlotDetails(day, timeSlot);
                                const isCurrentlyAvailable = !!existingSlot;
                                const isBooked = existingSlot?.is_booked || false;
                                const slotIsInPast = isSlotInPast(timeSlot, day);
                                
                                // Determine if this cell is the one being processed
                                const slotDateTimeForCell = parseSlotDateTime(timeSlot, day);
                                const timeSlot24HForCell = `${slotDateTimeForCell.getHours().toString().padStart(2, '0')}:${slotDateTimeForCell.getMinutes().toString().padStart(2, '0')}`;
                                // Use local date components for cellKey, consistent with how slotsToRegister keys are generated
                                const localYearCell = day.getFullYear();
                                const localMonthCell = (day.getMonth() + 1).toString().padStart(2, '0');
                                const localDayOfMonthCell = day.getDate().toString().padStart(2, '0');
                                const localDateStringCell = `${localYearCell}-${localMonthCell}-${localDayOfMonthCell}`;

                                const cellKey = `${localDateStringCell}-${timeSlot24HForCell}`;
                                const isSelectedForRegistration = selectedSlotsToRegister.has(cellKey);

                                let isProcessingThisCell = false;
                                if (processingSlotKey) {
                                    if (isBooked && existingSlot && processingSlotKey === `delete-${existingSlot.id}`) {
                                        isProcessingThisCell = true; // This slot is being deleted
                                    } else if (!isBooked && cellKey === processingSlotKey) {
                                        // This branch handles if registration sets processingSlotKey to a cellKey
                                        isProcessingThisCell = true;
                                    }
                                }

                                // DEBUGGING: Log details for a specific known booked slot
                                // Replace "YYYY-MM-DD-HH:MM" with an actual key of a slot you know is booked
                                // For example, if a slot on 2024-06-15 at 10:00 is booked, use "2024-06-15-10:00"
                                // if (cellKey === "REPLACE_WITH_KNOWN_BOOKED_SLOT_KEY") {
                                //     console.log(`[DEBUG] Slot Cell: ${cellKey}`, {
                                //         existingSlot, // What object was retrieved from the map?
                                //         isBooked,     // Is this true as expected?
                                //         isCurrentlyAvailable,
                                //         slotIsInPast,
                                //         isSelectedForRegistration
                                //     });
                                // }

                                let slotClasses = "p-1.5 h-9 sm:p-2 sm:h-10 rounded transition-colors flex items-center justify-center "; // Added flex for potential content centering

                                if (isProcessingThisCell) {
                                    slotClasses += "bg-yellow-300 opacity-70 cursor-wait"; // Style for processing slot
                                } else if (isBooked) {
                                    slotClasses += "bg-red-500 text-white cursor-pointer hover:bg-red-600"; // Booked slot, now clickable
                                } else if (slotIsInPast) {
                                    slotClasses += "bg-gray-400 text-gray-600 !cursor-not-allowed"; // Darker gray for past
                                } else if (isCurrentlyAvailable && !isBooked) { // Explicitly check not booked for orange
                                    slotClasses += "bg-[#FF7F4F] hover:bg-[#FF9F70] text-white cursor-pointer";
                                } else if (isSelectedForRegistration) {
                                    slotClasses += "bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"; // Selected for new registration
                                } else {
                                    slotClasses += "bg-gray-200 hover:bg-gray-300 cursor-pointer"; // Matched legend for unavailable
                                }

                                return (
                                    <div
                                        key={dayIndex}
                                        className={slotClasses}
                                        title={
                                            isProcessingThisCell ? "Processing..." :
                                            isBooked && existingSlot ? `Booked. Click to unregister this slot (ID: ${existingSlot.id})` :
                                            slotIsInPast ? "Time slot is in the past" :
                                            isCurrentlyAvailable && !isBooked ? `Registered. (ID: ${existingSlot?.id})` : // Orange slots
                                            isSelectedForRegistration ? "Selected for registration. Click to deselect." :
                                            "Click to select for registration"}
                                        onClick={() => {
                                            if (isProcessingThisCell || slotIsInPast) {
                                                return; // Always prevent action if processing or in past
                                            }

                                            if (isBooked && existingSlot) { // RED slot (guide registered it)
                                                onAttemptDeleteSlot(existingSlot.id); // Call new prop
                                            } else if (isCurrentlyAvailable && !isBooked && existingSlot) { // ORANGE slot (guide registered, not booked by customer)
                                                onAttemptDeleteSlot(existingSlot.id); // Allow guide to delete their own available (orange) slots
                                            } else if (isSelectedForRegistration || (!isCurrentlyAvailable && !isBooked)) {
                                                // BLUE slot (selected by guide for new registration) OR GRAY slot (not yet registered by guide)
                                                const slotDateTime = parseSlotDateTime(timeSlot, day);
                                                const timeSlot24H = `${slotDateTime.getHours().toString().padStart(2, '0')}:${slotDateTime.getMinutes().toString().padStart(2, '0')}`;
                                                onToggleSlotSelection(day, timeSlot24H); // Existing prop for toggling selection
                                            }
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}