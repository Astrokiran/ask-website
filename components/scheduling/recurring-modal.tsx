import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface RecurringModalProps {
    onClose: () => void;
    selectedTimeSlots: string[];
}

export function RecurringModal({ onClose, selectedTimeSlots }: RecurringModalProps) {
    const [pattern, setPattern] = useState("weekly");
    const [endDate, setEndDate] = useState("");

    const handleSave = () => {
        // Here you would implement the logic to save recurring availability
        console.log("Saving recurring pattern:", { pattern, endDate, selectedTimeSlots });
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set Recurring Availability</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Repeat Pattern</label>
                        <select
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Selected Time Slots</label>
                        <div className="max-h-40 overflow-y-auto p-2 border rounded-md">
                            {selectedTimeSlots.length > 0 ? (
                                <ul className="space-y-1">
                                    {selectedTimeSlots.map((slot) => (
                                        <li key={slot} className="text-sm">
                                            {slot.split("-")[0]} at {slot.split("-")[1]}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No time slots selected</p>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-[#FF7F50] hover:bg-[#FF6A3D]">
                        Save Recurring Schedule
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 