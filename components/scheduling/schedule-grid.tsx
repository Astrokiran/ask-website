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
        timeSlot24H: string, // HH:MM
        slotId?: number,      // Provided if it's an existing slot
        isCurrentlyBooked?: boolean // Current booked status of an existing slot
    ) => void;
    viewMode: "day" | "week";
    availabilityData?: GridAvailabilitySlot[]; // Existing slots from backend
    selectedSlotsToRegister?: Set<string>; // Keys of slots selected for registration
    selectedSlotsToUnregister?: Set<number>; // IDs of existing slots selected for unregistration
    processingSlotKey?: string | null; // Key of the slot currently being processed
}

export function ScheduleGrid({
    selectedDate,
    timezone,
    onToggleSlotSelection,
    viewMode,
    availabilityData = [],
    selectedSlotsToRegister = new Set(),
    selectedSlotsToUnregister = new Set(),
    processingSlotKey,
}: ScheduleGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    // Constants for responsive design
    const TIME_COLUMN_WIDTH = "50px"; // For "9:00 AM"
    const DAY_COLUMN_MIN_WIDTH = "60px"; // For "Wed" & "23"

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

    // Generate time slots dynamically, starting from the current hour
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    useEffect(() => {
        const generateTimeSlots = () => {
            const now = new Date();
            const selectedDateIsToday = daysToDisplay.some(day => 
                day.getFullYear() === now.getFullYear() &&
                day.getMonth() === now.getMonth() &&
                day.getDate() === now.getDate()
            );

            let startHour = 0;  // Default start time for future dates
            if (selectedDateIsToday) {
                startHour = now.getHours() + 1;  // Start from the next full hour
            }

            const slots = [];
            const endHour = 23;  // Always end at 11 PM

            for (let hour = startHour; hour <= endHour; hour++) {
                for (let minute = 0; minute < 60; minute += 60) {  // Assuming 60-minute slots

                    let formattedHour = hour % 12;
                    formattedHour = formattedHour === 0 ? 12 : formattedHour; // Convert 0 to 12 for AM/PM format

                    let period = hour < 12 ? "AM" : "PM";

                    if (hour === 24) {  // Midnight adjustment
                        formattedHour = 12;
                        period = "AM";
                    }
                    slots.push(`${formattedHour}:${minute === 0 ? "00" : minute} ${period}`);
                }
            }
            return slots;
        };

         const generatedSlots = generateTimeSlots();
         if (JSON.stringify(generatedSlots) !== JSON.stringify(timeSlots)) {
             setTimeSlots(generatedSlots);
         }
    }, [daysToDisplay]);  // Recalculate when daysToDisplay changes
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
        return slotDateTime < now;
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
                    <div className="p-1 sm:p-2 font-medium text-[10px] sm:text-xs text-gray-500 sticky left-0 bg-white z-10 flex items-center">Time</div>
                    {daysToDisplay.map((day, index) => (
                        <div key={index} className="p-1 text-center sm:p-2">
                            <div className="font-medium text-[10px] sm:text-xs md:text-sm">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className="text-[10px] sm:text-xs md:text-sm">{day.getDate()}</div>
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
                            <div className="p-1 text-[9px] sm:text-[10px] md:text-xs text-gray-500 sticky left-0 bg-white z-10 flex items-center">{timeSlot}</div>
                            {daysToDisplay.map((day, dayIndex) => {
                                const existingSlot = getExistingSlotDetails(day, timeSlot);
                                const isCurrentlyAvailable = !!existingSlot;
                                const slotIsInPast = isSlotInPast(timeSlot, day);

                                // Render nothing if the slot is in the past
                                if (slotIsInPast) {
                                    return null;
                                }
                                else {
                                    const isBooked = existingSlot?.is_booked || false;
                                    const isSelectedForUnregistration = existingSlot && selectedSlotsToUnregister.has(existingSlot.id);

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

                                    let slotClasses = "p-1 h-8 sm:p-1.5 sm:h-9 md:p-2 md:h-10 rounded transition-colors flex items-center justify-center ";

                                    if (isProcessingThisCell) {
                                        slotClasses += "bg-yellow-300 opacity-70 cursor-wait"; // Style for processing slot
                                    } else if (isSelectedForUnregistration) {
                                        slotClasses += "bg-purple-400 line-through text-white cursor-pointer hover:bg-purple-500"; // Selected for unregistration
                                    } else if (isBooked) {
                                        slotClasses += "bg-red-500 text-white cursor-pointer hover:bg-red-600"; // Booked slot
                                    } else if (isCurrentlyAvailable && !isBooked) { // Explicitly check not booked for orange
                                        slotClasses += "bg-green-500 hover:bg-green-600 text-white cursor-pointer"; // Guide's available slot (Green)
                                    } else if (isSelectedForRegistration) {
                                        slotClasses += "bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"; // Selected for new registration
                                    } else {
                                        // Default for future, unselected, non-existing slots: make them green
                                        slotClasses += "bg-green-500 hover:bg-green-600 text-white cursor-pointer";
                                    }

                                    return (
                                        <div
                                            key={dayIndex}
                                            className={slotClasses}
                                            title={
                                                isProcessingThisCell ? "Processing..." :
                                                    isSelectedForUnregistration && existingSlot ? `Marked for unregistration. Click to deselect (ID: ${existingSlot.id})` :
                                                        isBooked && existingSlot ? `Booked by customer. Click to mark for unregistration (ID: ${existingSlot.id})` :
                                                            isCurrentlyAvailable && !isBooked && existingSlot ? `Your available slot. Click to mark for unregistration (ID: ${existingSlot.id})` : // Green slots
                                                                isSelectedForRegistration ? "Selected for registration. Click to deselect." :
                                                                    "Click to select for registration"}
                                            onClick={() => {
                                                if (isProcessingThisCell) {
                                                    return; // Always prevent action if processing
                                                }

                                                // Use the cellKey's timeSlot24HForCell for consistency with selection logic
                                                if (existingSlot) {
                                                    // This is an existing slot (could be red or orange initially, or purple if selected for unreg)
                                                    // Toggle its selection for unregistration
                                                    onToggleSlotSelection(day, timeSlot24HForCell, existingSlot.id, existingSlot.is_booked);
                                                } else {
                                                    // This is a new slot (gray) or one already selected for registration (blue)
                                                    // Toggle its selection for registration
                                                    onToggleSlotSelection(day, timeSlot24HForCell);
                                                }
                                            }}
                                        />
                                    );
                                }
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}