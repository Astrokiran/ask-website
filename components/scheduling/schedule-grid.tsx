import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card"; // Assuming this path is correct

interface GridAvailabilitySlot { 
    date: string; 
    start_time: string; 
    id: number; 
    is_booked?: boolean; 
    made_available_after_booking?: boolean; // New field
}

interface ScheduleGridProps {
    selectedDate: Date; 
    timezone: string; 
    onToggleSlotSelection: (
        day: Date,
        timeSlot24H: string, // HH:MM
        existingSlotData?: GridAvailabilitySlot // Pass the whole existing slot if available
    ) => void;
    viewMode: "day" | "week";
    availabilityData?: GridAvailabilitySlot[]; // Existing slots from backend
    selectedSlotsToRegister?: Set<string>; // Keys of new slots selected for registration
    selectedSlotsToMarkAsUnbooked?: Set<number>; // IDs of existing slots to mark is_booked = false
    selectedSlotsToMarkAsBookedByGuide?: Set<number>; // IDs of existing slots to mark is_booked = true
    processingSlotKey?: string | null; // Key of the slot currently being processed
}

export function ScheduleGrid({
    selectedDate,
    timezone,
    onToggleSlotSelection,
    viewMode,
    availabilityData = [],
    selectedSlotsToRegister: selectedSlotsToRegisterNew = new Set(), 
    selectedSlotsToMarkAsUnbooked = new Set(),
    selectedSlotsToMarkAsBookedByGuide = new Set(),
    processingSlotKey,
}: ScheduleGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    // Constants for responsive design
    const TIME_COLUMN_WIDTH = "50px"; 
    const DAY_COLUMN_MIN_WIDTH = "60px"; 

    const [currentTimeForGrid, setCurrentTimeForGrid] = useState(new Date());
    useEffect(() => {
        const timeId = setInterval(() => {
            setCurrentTimeForGrid(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timeId);
    }, []);

    const now = currentTimeForGrid;
    // Use a Map for efficient lookup of existing slots
    const [existingSlotsMap, setExistingSlotsMap] = useState<Map<string, GridAvailabilitySlot>>(new Map());

    useEffect(() => {
    }, [availabilityData]);

    useEffect(() => {
        const newMap = new Map<string, GridAvailabilitySlot>();
        availabilityData.forEach(slot => {
            // Key: "YYYY-MM-DD-HH:MM" (24-hour format for start_time, using the local date from slot.date)
            // slot.date is already in local YYYY-MM-DD format from page.tsx
            const startTime24H = slot.start_time.substring(0, 5); 
            if (!slot.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                console.warn("ScheduleGrid: Encountered slot with malformed date:", slot);
            }
            const key = `${slot.date}-${startTime24H}`;
            newMap.set(key, slot);
        });
        setExistingSlotsMap(newMap);
    }, [availabilityData]);

    const todayForViewColumns = new Date();
    todayForViewColumns.setHours(0, 0, 0, 0); 

    const daysToDisplay = viewMode === "day"
        ? [selectedDate]
        : Array.from({ length: 7 }, (_, i) => {
            const date = new Date(todayForViewColumns);
            date.setDate(todayForViewColumns.getDate() + i);
            return date;
        });

    // Generate time slots dynamically, starting from the current hour
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    useEffect(() => {

        const generateSlots = () => {
            const nowForSlotGeneration = currentTimeForGrid;
            const slots = [];
            let startHourConfig = 0;
            const endHourConfig = 23; // 24-hour format, so we include 0-23
            if (viewMode === "day") {
                const selectedYear = selectedDate.getFullYear();    
                const selectedMonth = selectedDate.getMonth();
                const selectedDay = selectedDate.getDate();
                const todayYear = nowForSlotGeneration.getFullYear();
                const todayMonth = nowForSlotGeneration.getMonth();
                const todayDay = nowForSlotGeneration.getDate();    


                if (selectedYear === todayYear && selectedMonth === todayMonth && selectedDay === todayDay) {
                    let currentActualHour = nowForSlotGeneration.getHours();
                    let currentActualMinutes = nowForSlotGeneration.getMinutes();

                    if (currentActualMinutes > 0) {
                        // If current minutes are not zero, we start from the next hour
                        startHourConfig = currentActualHour + 1;
                    } else {
                        // If current minutes are zero, we start from the current hour
                        startHourConfig = currentActualHour;
                    }
                }
            }


            for (let hour = startHourConfig; hour <= endHourConfig; hour++) {
                for (let minute = 0; minute < 60; minute += 60) {  // Assuming 60-minute slots

                    let formattedHour = hour % 12;
                    formattedHour = formattedHour === 0 ? 12 : formattedHour; // Convert 0 to 12 for AM/PM format

                    let period = hour < 12 ? "AM" : "PM";

                   
                    slots.push(`${formattedHour}:${minute === 0 ? "00" : minute} ${period}`);
                }
            }
            return slots;
        };

         const generatedSlots = generateSlots();
         if (JSON.stringify(generatedSlots) !== JSON.stringify(timeSlots)) {
             setTimeSlots(generatedSlots);
         }
    }, [viewMode, selectedDate, currentTimeForGrid]);  // Recalculate when daysToDisplay changes
    const gridCols = daysToDisplay.length + 1;

    const gridTemplateColumnsStyle = `${TIME_COLUMN_WIDTH} repeat(${daysToDisplay.length}, minmax(${DAY_COLUMN_MIN_WIDTH}, 1fr))`;

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
        const referenceDate = new Date(day);

        const [time, period] = timeSlot.split(" ");
        const [hoursStr, minutesStr] = time.split(":");
        let hours = parseInt(hoursStr, 10);
        let minutes = parseInt(minutesStr, 10);

        if (period.toUpperCase() === "PM" && hours !== 12) {
            hours += 12;
        } else if (period.toUpperCase() === "AM" && hours === 12) { 
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
                className="grid-container" 
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
                                if (viewMode === "day" && slotIsInPast) {
                                     return null;
                                }
                                else {
                                    const isBooked = existingSlot?.is_booked || false;
                                    // const isSelectedForUnregistration = existingSlot && selectedSlotsToMarkAsUnbooked.has(existingSlot.id); // Not directly used for styling like this anymore

                                    // Determine if this cell is the one being processed
                                    const slotDateTimeForCell = parseSlotDateTime(timeSlot, day);
                                    const timeSlot24HForCell = `${slotDateTimeForCell.getHours().toString().padStart(2, '0')}:${slotDateTimeForCell.getMinutes().toString().padStart(2, '0')}`;
                                    // Use local date components for cellKey, consistent with how slotsToRegister keys are generated
                                    const localYearCell = day.getFullYear();
                                    const localMonthCell = (day.getMonth() + 1).toString().padStart(2, '0');
                                    const localDayOfMonthCell = day.getDate().toString().padStart(2, '0');
                                    const localDateStringCell = `${localYearCell}-${localMonthCell}-${localDayOfMonthCell}`;

                                    const cellKey = `${localDateStringCell}-${timeSlot24HForCell}`;
                                    const isSelectedForNewRegistration = selectedSlotsToRegisterNew.has(cellKey);

                                    let isProcessingThisCell = false;
                                    if (processingSlotKey) {
                                        if (isBooked && existingSlot && processingSlotKey === `delete-${existingSlot.id}`) {
                                            isProcessingThisCell = true;
                                        } else if (!isBooked && cellKey === processingSlotKey) {
                                            // This branch handles if registration sets processingSlotKey to a cellKey
                                            isProcessingThisCell = true;
                                        }
                                    }

                                    let slotClasses = "p-1 h-8 sm:p-1.5 sm:h-9 md:p-2 md:h-10 rounded transition-colors flex items-center justify-center ";

                                    if (slotIsInPast) {
                                        slotClasses += "bg-gray-300 text-gray-500 !cursor-not-allowed"; // Past slots are gray and disabled
                                    } else if (isProcessingThisCell) {
                                        slotClasses += "bg-yellow-300 opacity-70 cursor-wait"; // Processing slot
                                    } else if (existingSlot && selectedSlotsToMarkAsBookedByGuide.has(existingSlot.id)) {
                                        // Currently unbooked (green), selected to be booked by guide
                                        slotClasses += "bg-blue-500 text-white cursor-pointer hover:bg-blue-600"; // Blue for "mark as booked"
                                    } else if (existingSlot && selectedSlotsToMarkAsUnbooked.has(existingSlot.id)) {
                                        // Currently booked (red), selected to be unbooked by guide
                                        slotClasses += "bg-purple-400 text-white cursor-pointer hover:bg-purple-500"; // Purple for "mark as unbooked"
                                    } else if (isBooked) {
                                        // Default state for a booked slot (not selected for any action)
                                        slotClasses += "bg-red-500 text-white cursor-pointer hover:bg-red-600"; // Booked slot
                                    } else if (isCurrentlyAvailable && !isBooked) { 
                                        // Default state for an available slot (not selected for any action)
                                        slotClasses += "bg-green-500 hover:bg-green-600 text-white cursor-pointer"; // Guide's available slot (Green)
                                    } else if (isSelectedForNewRegistration) {
                                        // New slot selected for registration
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
                                                slotIsInPast ? "This slot is in the past and cannot be selected." :
                                                isProcessingThisCell ? "Processing..." :
                                                    (existingSlot && selectedSlotsToMarkAsBookedByGuide.has(existingSlot.id)) ? `Slot marked to be booked. Click to deselect. (ID: ${existingSlot.id})` :
                                                    (existingSlot && selectedSlotsToMarkAsUnbooked.has(existingSlot.id)) ? `Slot marked to be unbooked. Click to deselect. (ID: ${existingSlot.id})` :
                                                        isBooked && existingSlot ? `Booked by customer. Click to mark for unregistration (ID: ${existingSlot.id})` :
                                                            isCurrentlyAvailable && !isBooked && existingSlot ? `Your available slot. Click to mark for unregistration (ID: ${existingSlot.id})` :
                                                                isSelectedForNewRegistration ? "Selected for registration. Click to deselect." :
                                                                    "Click to select for registration"}
                                            onClick={() => {
                                               if (slotIsInPast || isProcessingThisCell) {
                                                   return;
                                               }

                                                if (existingSlot) {
                                                    // Toggle its selection for unregistration
                                                    onToggleSlotSelection(day, timeSlot24HForCell, existingSlot);
                                                } else {
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