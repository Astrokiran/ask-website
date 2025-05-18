import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface BlockTimeModalProps {
    onClose: () => void;
    selectedDate: Date;
}

export function BlockTimeModal({ onClose, selectedDate }: BlockTimeModalProps) {
    const [startDate, setStartDate] = useState(
        selectedDate.toISOString().split("T")[0]
    );
    const [endDate, setEndDate] = useState(
        selectedDate.toISOString().split("T")[0]
    );
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [reason, setReason] = useState("");

    const handleSave = () => {
        // Here you would implement the logic to block time
        console.log("Blocking time:", { startDate, endDate, startTime, endTime, reason });
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Block Time Period</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                min={startDate}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Reason (Optional)</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-2 border rounded-md h-20 resize-none"
                            placeholder="e.g., Vacation, Personal time, etc."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-[#FF7F50] hover:bg-[#FF6A3D]">
                        Block Time
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 