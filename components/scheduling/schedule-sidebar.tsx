import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";

interface ScheduleSidebarProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    timezone: string;
    onTimezoneChange: (timezone: string) => void;
    viewMode: 'day' | 'week';
    onViewModeChange: (mode: 'day' | 'week') => void;
}

export function ScheduleSidebar({
    selectedDate,
    onDateChange,
    timezone,
    onTimezoneChange,
    viewMode,
    onViewModeChange,
}: ScheduleSidebarProps) {
    // List of common timezones
    const timezones = [
        "Asia/Kolkata",
        "America/New_York",
        "America/Los_Angeles",
        "Europe/London",
        "Australia/Sydney",
    ];

    const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);
    const [isCalendarOpenOnMobile, setIsCalendarOpenOnMobile] = useState(false);

    // Improved function to get dates of the current week
    const getCurrentWeekDates = () => {
        const today = new Date();
        const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday

        const monday = new Date(today.setDate(diff));
        monday.setHours(0, 0, 0, 0); // Reset time part

        const weekDates = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            weekDates.push(date.toISOString().split('T')[0]);
        }

        return weekDates;
    };

    const weekDates = getCurrentWeekDates();

    const goToPreviousMonth = () => {
        const prevMonth = new Date(currentMonth);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        setCurrentMonth(prevMonth);
    };

    const goToNextMonth = () => {
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setCurrentMonth(nextMonth);
    };

    return (
        <div className="w-full md:w-80 space-y-4">
            <select
                value={viewMode}
                onChange={(e) => onViewModeChange(e.target.value as 'day' | 'week')}
                className="w-full p-2 border rounded mb-4"
            >
                <option value="day">Day View</option>
                <option value="week">Week View</option>
            </select>

            {/* Calendar Toggle Button for Mobile */}
            <div className="md:hidden mb-4">
                <button
                    onClick={() => setIsCalendarOpenOnMobile(!isCalendarOpenOnMobile)}
                    className="w-full flex items-center justify-center p-2 border rounded-md text-sm font-medium hover:bg-gray-50"
                >
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    {isCalendarOpenOnMobile ? "Hide Calendar" : "Show Calendar"}
                </button>
            </div>

            {/* Calendar Card - conditionally rendered/styled */}
            <div className={`${isCalendarOpenOnMobile ? 'block' : 'hidden'} md:block`}>
                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <h3 className="text-sm font-medium">Select Date</h3>
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={goToPreviousMonth}
                                className="p-1 rounded-md hover:bg-gray-100"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={goToNextMonth}
                                className="p-1 rounded-md hover:bg-gray-100"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 pb-4">
                        <div className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => date && onDateChange(date)}
                                month={currentMonth}
                                onMonthChange={setCurrentMonth}
                                className="w-auto calendar-custom"
                                showOutsideDays={false}
                                disabled={{ before: new Date() }}
                                classNames={{
                                    nav: "!hidden",
                                    cell: "!p-0",
                                    day: "!h-10 !w-10 !p-0 !font-normal !aria-selected:opacity-100 !rounded-md !text-right !pr-1",
                                    day_today: "!bg-blue-100 !font-semibold !text-black",
                                    day_outside: "!hidden",
                                    day_disabled: "!text-gray-300 !line-through !bg-gray-50 !opacity-100",
                                }}
                                modifiers={{
                                    selected: selectedDate,
                                    today: new Date(),  // Correctly set today's date
                                }}
                                modifiersClassNames={{
                                    selected: "!bg-orange-600 !text-white hover:!bg-orange-400",
                                    today: "!bg-blue-500 !text-white",
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <h3 className="text-sm font-medium">Availability Legend</h3>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                            <span className="text-sm">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
                            <span className="text-sm">Unavailable</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded-sm"></div> {/* Changed from blue to red */}
                            <span className="text-sm">Booked</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 