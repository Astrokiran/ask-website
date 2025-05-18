import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface ScheduleGridProps {
    selectedDate: Date;
    timezone: string;
    onTimeSlotSelect: (timeSlot: string) => void;
    selectedTimeSlots: string[];
    viewMode: "day" | "week";
    availabilityData?: AvailabilitySlot[];
    onSlotStatusChange: (slot: string, newStatus: string, oldStatus: string) => void;
}

export function ScheduleGrid({
    selectedDate,
    timezone,
    onTimeSlotSelect,
    selectedTimeSlots,
    viewMode,
    availabilityData = [],
    onSlotStatusChange,
}: ScheduleGridProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // Add local state to track slot statuses
    const [localSlotStatuses, setLocalSlotStatuses] = useState<Record<string, string>>({});

    // Add a state to track the original statuses from the backend
    const [originalSlotStatuses, setOriginalSlotStatuses] = useState<Record<string, string>>({});

    // Update the useEffect to properly initialize slot statuses
    useEffect(() => {
        const statuses: Record<string, string> = {};
        const originalStatuses: Record<string, string> = {};

        console.log("Initializing slot statuses from backend data:", availabilityData);

        availabilityData.forEach(slot => {
            const date = slot.date;
            const time = slot.start_time.substring(0, 5); // Get HH:MM part
            const hours = parseInt(time.split(':')[0]);
            const minutes = time.split(':')[1];

            // Convert to 12-hour format
            const period = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12;
            const formattedTime = `${hours12}:${minutes} ${period}`;

            // Create a key in the format "Wed Apr 01 2025-9:00 AM"
            const dateObj = new Date(date);
            const key = `${dateObj.toDateString()}-${formattedTime}`;

            // Always mark slots from the backend as AVAILABLE
            statuses[key] = 'AVAILABLE';
            originalStatuses[key] = 'AVAILABLE';

            console.log(`Initialized slot ${key} as AVAILABLE (from backend)`);
        });

        setLocalSlotStatuses(statuses);
        setOriginalSlotStatuses(originalStatuses);
    }, [availabilityData]);

    // Generate days to display based on viewMode
    const daysToDisplay = viewMode === "day"
        ? [selectedDate] // Just the selected date for day view
        : Array.from({ length: 7 }, (_, i) => {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() - date.getDay() + i);
            return date;
        });

    // Generate time slots from 6:00 AM to 9:30 PM in 30-minute increments
    const timeSlots = [];
    for (let hour = 6; hour <= 21; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 21 && minute === 30) break; // Stop at 9:30 PM
            const formattedHour = hour % 12 || 12;
            const period = hour < 12 ? "AM" : "PM";
            timeSlots.push(`${formattedHour}:${minute === 0 ? "00" : minute} ${period}`);
        }
    }

    const handleMouseDown = (timeSlot: string, day: Date) => {
        const slotKey = `${day.toDateString()}-${timeSlot}`;

        // Get the current status from local state or default to 'UNAVAILABLE'
        const currentStatus = localSlotStatuses[slotKey] || 'UNAVAILABLE';

        // Get the original status from backend or default to 'UNAVAILABLE'
        const originalStatus = originalSlotStatuses[slotKey] || 'UNAVAILABLE';

        // Toggle between AVAILABLE and UNAVAILABLE
        const newStatus = currentStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';

        console.log(`Toggling slot ${slotKey} from ${currentStatus} to ${newStatus} (original: ${originalStatus})`);

        // Update local state immediately for visual feedback
        setLocalSlotStatuses(prev => ({
            ...prev,
            [slotKey]: newStatus
        }));

        // For slots that were originally AVAILABLE, we need to make sure we're tracking them correctly
        if (originalStatus === 'AVAILABLE') {
            // If we're toggling an originally available slot, always use AVAILABLE as the old status
            onSlotStatusChange(slotKey, newStatus, 'AVAILABLE');
        } else {
            // For slots that weren't originally available, use the current status
            onSlotStatusChange(slotKey, newStatus, currentStatus);
        }

        // If we're starting a drag operation, set the drag start slot
        setIsDragging(true);
        setDragStartSlot(slotKey);
    };

    const handleMouseEnter = (timeSlot: string, day: Date) => {
        if (isDragging && dragStartSlot) {
            const slotKey = `${day.toDateString()}-${timeSlot}`;
            const currentStatus = localSlotStatuses[slotKey] || 'UNAVAILABLE';
            const originalStatus = originalSlotStatuses[slotKey] || 'UNAVAILABLE';

            // Get the status of the drag start slot
            const dragStatus = localSlotStatuses[dragStartSlot] || 'UNAVAILABLE';

            // Update local state immediately for visual feedback
            setLocalSlotStatuses(prev => ({
                ...prev,
                [slotKey]: dragStatus
            }));

            // Apply the same status to this slot, but use the original status for the old status
            onSlotStatusChange(slotKey, dragStatus, originalStatus);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStartSlot(null);
    };

    // Calculate the number of columns based on viewMode
    const gridCols = daysToDisplay.length + 1; // +1 for the time column

    // Get the status of a slot, first checking local state, then falling back to API data
    const getSlotStatus = (slotKey: string) => {
        // First check our local state for any updates
        if (slotKey in localSlotStatuses) {
            return localSlotStatuses[slotKey];
        }

        // Check if this slot is in the original statuses from the backend
        if (slotKey in originalSlotStatuses) {
            return originalSlotStatuses[slotKey];
        }

        // If not found in either local or original statuses, it's unavailable
        return 'UNAVAILABLE';
    };

    return (
        <Card className="p-4 overflow-auto">
            <div
                className="min-w-[800px]"
                ref={gridRef}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Header row with days */}
                <div className={`grid grid-cols-${gridCols} gap-1 mb-2`} style={{ gridTemplateColumns: `auto repeat(${daysToDisplay.length}, 1fr)` }}>
                    <div className="p-2 font-medium text-sm text-gray-500">Time</div>
                    {daysToDisplay.map((day, index) => (
                        <div key={index} className="p-2 font-medium text-sm text-center">
                            <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div>{day.getDate()}</div>
                        </div>
                    ))}
                </div>

                {/* Time slots grid */}
                <div className="space-y-1">
                    {timeSlots.map((timeSlot, timeIndex) => (
                        <div
                            key={timeIndex}
                            className="grid gap-1"
                            style={{ gridTemplateColumns: `auto repeat(${daysToDisplay.length}, 1fr)` }}
                        >
                            <div className="p-2 text-xs text-gray-500">{timeSlot}</div>
                            {daysToDisplay.map((day, dayIndex) => {
                                const slotKey = `${day.toDateString()}-${timeSlot}`;
                                const isSelected = selectedTimeSlots.includes(slotKey);
                                const slotStatus = getSlotStatus(slotKey);

                                return (
                                    <div
                                        key={dayIndex}
                                        className={`p-2 h-10 rounded cursor-pointer transition-colors ${isSelected
                                            ? "bg-[#FF7F50] hover:bg-[#FF9F70]" // Selected slots are bright orange
                                            : slotStatus === 'AVAILABLE'
                                                ? "bg-[#FF7F4F] hover:bg-[#FF9F70] text-white" // Available slots with specific orange color
                                                : "bg-gray-100 hover:bg-gray-200" // Unavailable slots are gray
                                            }`}
                                        onMouseDown={() => handleMouseDown(timeSlot, day)}
                                        onMouseEnter={() => handleMouseEnter(timeSlot, day)}
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