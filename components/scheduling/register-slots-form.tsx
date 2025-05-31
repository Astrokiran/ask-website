"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";


interface Guide {
    id: number;
    unique_id: string;
    name: string;
    phone_number: string;
    skills: string;
    languages: string;
    years_of_experience: number;
}
interface AvailabilitySlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface RegisterSlotsFormProps {
    guideId: string; // Changed from astrologerId
    onSuccess?: (slots: AvailabilitySlot[]) => void;
    initialDate?: string; // YYYY-MM-DD
    initialStartTime?: string; // HH:MM (24-hour format)
}

export function RegisterSlotsForm({ guideId, onSuccess, initialDate, initialStartTime }: RegisterSlotsFormProps) {
    const [date, setDate] = useState<string>(initialDate || "");
    const [startTime, setStartTime] = useState<string>(initialStartTime || "09:00");
    const [endTime, setEndTime] = useState<string>("17:00");
    const [interval, setInterval] = useState<string>("30");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (initialDate) {
            setDate(initialDate);
        }
    }, [initialDate]);

    useEffect(() => {
        if (initialStartTime) {
            setStartTime(initialStartTime);
        }
    }, [initialStartTime]);

    // Helper to get current time in HH:MM format
    const getCurrentTimeHHMM = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    };

    // Helper to format a Date object to HH:MM string for time input
    const formatTimeForInput = (dateObj: Date): string => {
        return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
    };

    const todayDateString = new Date().toISOString().split('T')[0];

    const generateTimeSlots = (start: string, end: string, intervalMinutes: number): string[] => {
        const slots: string[] = [];
        const startDate = new Date(`2000-01-01T${start}:00`);
        const endDate = new Date(`2000-01-01T${end}:00`);

        let current = new Date(startDate);

        while (current < endDate) {
            const hours = current.getHours().toString().padStart(2, '0');
            const minutes = current.getMinutes().toString().padStart(2, '0');
            slots.push(`${hours}:${minutes}`);

            current.setMinutes(current.getMinutes() + intervalMinutes);
        }

        return slots;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log("handleSubmit triggered"); 
        // console.log("Initial guideId:", guideId);
        // console.log("Initial date state:", date);
        // console.log("Initial startTime state:", startTime);
        // console.log("Initial endTime state:", endTime);
        // console.log("Initial interval state:", interval);

        if (!guideId || typeof guideId !== 'string' || guideId.trim() === "") {
            toast({
                title: "Configuration Error",
                description: "Guide ID (Booking Key) is missing or invalid. Please ensure it's correctly provided.",
                variant: "destructive",
            });
            return;
        }

        if (!date) {
            toast({
                title: "Error",
                description: "Please select a date",
                variant: "destructive",
            });
            return;
        }

        // Validate start and end times
        if (date === todayDateString) {
            const currentTime = getCurrentTimeHHMM();
            if (startTime < currentTime) {
                toast({
                    title: "Error",
                    description: "Start time cannot be in the past for today.",
                    variant: "destructive",
                });
                return;
            }
        }

        if (endTime <= startTime) {
            toast({
                title: "Error",
                description: "End time must be after start time.",
                variant: "destructive",
            });
            return;
        }

        const intervalMinutes = parseInt(interval);
        const timeSlots = generateTimeSlots(startTime, endTime, intervalMinutes);

        if (timeSlots.length === 0) {
            toast({
                title: "Error",
                description: "No valid time slots generated",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        // Prepare slots for the backend
        // The guideId prop should be the guide's static_booking_key (UUID string)

        const slotsToSubmit = timeSlots.map(slotStartTime => {
            const startDateTime = new Date(`${date}T${slotStartTime}:00`);
            const endDateTime = new Date(startDateTime);
            endDateTime.setMinutes(endDateTime.getMinutes() + intervalMinutes);
            return {
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
            };
        });

        try {
            // TODO: Retrieve your actual auth token (e.g., from context or local storage)
            // const authToken = "YOUR_AUTH_TOKEN_HERE"; 

            // Use the environment variable for the Django API URL
            const baseApiUrl = process.env.NEXT_PUBLIC_DJANGO_URL;
            // console.log("Sending X-Booking-Key:", guideId); 
            const response = await fetch(`${baseApiUrl}/api/guides/slots/bulk-create/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-Booking-Key': guideId, // Send the static_booking_key as a header
                },
                body: JSON.stringify(slotsToSubmit),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Failed to register slots" }));
                throw new Error(errorData.message || `Failed to register slots. Status: ${response.status}`);
            }

            const createdSlots: AvailabilitySlot[] = await response.json();

            toast({
                title: "Success",
                description: `${createdSlots.length} slots registered successfully`,
            });
            
            if (onSuccess) {
                onSuccess(createdSlots);
            }

            // Reset form
            setStartTime("09:00");
            setEndTime("17:00");

        } catch (error) {
            console.error("Error registering slots:", error);
            toast({
                title: "Error",
                description: (error instanceof Error && error.message) || "Failed to register availability slots",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Register Availability Slots</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={todayDateString}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={startTime}
                                onChange={(e) => {
                                    const newStartTime = e.target.value;
                                    setStartTime(newStartTime);

                                    // Adjust endTime if newStartTime makes it invalid
                                    if (newStartTime && endTime <= newStartTime) {
                                        const [hours, minutes] = newStartTime.split(':').map(Number);
                                        if (!isNaN(hours) && !isNaN(minutes)) {
                                            const currentIntervalNum = parseInt(interval, 10) || 30;
                                            const startTimeDate = new Date(2000, 0, 1, hours, minutes);
                                            
                                            const proposedEndTimeDate = new Date(startTimeDate);
                                            proposedEndTimeDate.setMinutes(startTimeDate.getMinutes() + currentIntervalNum);

                                            if (proposedEndTimeDate.getDate() > 1) { // Crossed midnight
                                                setEndTime("23:59");
                                            } else {
                                                setEndTime(formatTimeForInput(proposedEndTimeDate));
                                            }
                                        }
                                    }
                                }}
                                min={date === todayDateString ? getCurrentTimeHHMM() : "00:00"}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endTime">End Time</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                min={startTime} // End time cannot be before start time
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="interval">Interval (minutes)</Label>
                        <select
                            id="interval"
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>  
                        </select>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register Slots"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 