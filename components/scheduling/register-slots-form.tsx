"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

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
    astrologerId: string;
    onSuccess?: (slots: AvailabilitySlot[]) => void;
}

export function RegisterSlotsForm({ astrologerId, onSuccess }: RegisterSlotsFormProps) {
    const [date, setDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("09:00");
    const [endTime, setEndTime] = useState<string>("17:00");
    const [interval, setInterval] = useState<string>("30");
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

        if (!date) {
            toast({
                title: "Error",
                description: "Please select a date",
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
                throw new Error("Failed to register slots");
            }

            const data = await response.json();

            toast({
                title: "Success",
                description: data.message || `${timeSlots.length} slots registered successfully`,
            });

            if (onSuccess && data.slots) {
                onSuccess(data.slots);
            }

            // Reset form
            setStartTime("09:00");
            setEndTime("17:00");

        } catch (error) {
            console.error("Error registering slots:", error);
            toast({
                title: "Error",
                description: "Failed to register availability slots",
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
                            min={new Date().toISOString().split('T')[0]}
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
                                onChange={(e) => setStartTime(e.target.value)}
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